// 原生全局快照（无任何 import——必须在本进程内最先求值）。
// core-lite 的 polywasm/node-fetch polyfill 会覆盖 WebAssembly/fetch；peer.js 装载 core-lite
// 前在此捕获原生引用，装载后恢复。详见 lib/peer.js 说明。
export const nativeWasm = globalThis.WebAssembly;
export const nativeUint8ArrayFromBase64 = typeof Uint8Array.fromBase64 === 'function' ? Uint8Array.fromBase64 : null;

// Node 22 缺 Uint8Array.fromBase64（TC39 Uint8Array base64 提案），而新版 emscripten 胶水
// 用它解码内嵌 wasm——缺了会在工厂初始化时 abort。此处补规范语义的最小实现（std+url 字母表、
// 忽略 ASCII 空白、校验非法字符与长度）。
if (!nativeUint8ArrayFromBase64) {
    const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const B64_LOOKUP = new Int8Array(128).fill(-1);
    for (let i = 0; i < 64; i++) B64_LOOKUP[B64_ALPHABET.charCodeAt(i)] = i;
    B64_LOOKUP['-'.charCodeAt(0)] = 62; // base64url
    B64_LOOKUP['_'.charCodeAt(0)] = 63;
    const B64_RE = /^(?:[A-Za-z0-9+/-]{4})*(?:[A-Za-z0-9+/-]{2}==|[A-Za-z0-9+/-]{3}=)?$/;
    Uint8Array.fromBase64 = function (string, options) {
        const clean = String(string).replace(/\s/g, '');
        if (!B64_RE.test(clean)) throw new TypeError('Invalid base64 string');
        const stripPad = clean.replace(/=+$/, '');
        const out = new Uint8Array(Math.floor(stripPad.length * 3 / 4));
        let o = 0, buffer = 0, bits = 0;
        for (const ch of stripPad) {
            buffer = (buffer << 6) | B64_LOOKUP[ch.charCodeAt(0)];
            bits += 6;
            if (bits >= 8) {
                bits -= 8;
                out[o++] = (buffer >> bits) & 0xff;
            }
        }
        return out;
    };
}
export const nativeFetch = globalThis.fetch;
export const nativeTextEncoder = globalThis.TextEncoder;
export const nativeConsoleError = console.error;

// core-lite 的 script-loader chunk 在 Node 上 eval 必然失败并 console.error 刷堆栈
// （chunk 内含 `export` token——附录 C 已知非致命告警，native wasm 引擎用不到该 polyfill）。
// 本模块先于 core-lite 求值，在此安装过滤器压掉该噪音，peer.js 求值完成后恢复。
console.error = function drpy3QuietConsoleError(...args) {
    if (typeof args[0] === 'string' && args[0].startsWith('[Script Loader]')) return;
    return nativeConsoleError.apply(this, args);
};
