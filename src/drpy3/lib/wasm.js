// wasm：wasm 一等公民标准库（设计 §6.2/§9 wasm）。
// 三态来源：相对路径（host.loadAsset 随源资产）/ 字节（Uint8Array）/ 远程（req buffer:2）。
// Emscripten 胶水自动识别并托管：垫片环境、调用工厂、等待 onRuntimeInitialized、按路径/字节哈希缓存
// （Runtime 级缓存跨实例驱逐存活，§4.6 复温抓手①）。
import {Drpy3Error} from '../errors.js';
import {hashStr} from '../lifecycle.js';
import {wordArrayToBytes} from './crypto.js';
import {CryptoJS} from './peer.js';

function isWasmBytes(bytes) {
    return bytes && bytes.length >= 4 && bytes[0] === 0x00 && bytes[1] === 0x61 && bytes[2] === 0x73 && bytes[3] === 0x6d;
}

function b64ToBytes(b64) {
    return wordArrayToBytes(CryptoJS.enc.Base64.parse(String(b64)));
}

function bytesHash(bytes) {
    let s = '';
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
        s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return hashStr(s);
}

function withTimeout(promise, ms, msg) {
    return Promise.race([
        promise,
        new Promise((_, rej) => setTimeout(() => rej(new Drpy3Error('wasm', 'load', msg)), ms)),
    ]);
}

/** emscripten 垫片环境：引擎里没有 window/process/XMLHttpRequest——胶水需要的全局由这里兜住（§6.2③） */
function makeShim() {
    const noop = () => {};
    const atobShim = (s) => {
        const bytes = b64ToBytes(s);
        let out = '';
        for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
        return out;
    };
    const btoaShim = (s) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(s));
    return {
        window: {},
        process: {env: {}, platform: 'drpy3', nextTick: (fn) => setTimeout(fn, 0)},
        XMLHttpRequest: function () {
            this.open = noop;
            this.send = noop;
            this.setRequestHeader = noop;
            this.addEventListener = noop;
        },
        document: {createElement: () => ({style: {}, setAttribute: noop, appendChild: noop}), currentScript: {src: ''}},
        location: {href: 'file:///drpy3/', protocol: 'file:'},
        Script: function () {},
        require: (name) => {
            throw new Error(`emscripten 垫片不允许外部 require("${name}")——wasm 资产必须自洽随源分发（§8 兼容性红线）`);
        },
        atob: atobShim,
        btoa: btoaShim,
    };
}

/** 原生 wasm 字节编译：返回 {exports} 形态（百忙无果3 用法：mod.exports.xxh64） */
async function compileWasmBytes(bytes) {
    if (typeof WebAssembly === 'undefined' || !WebAssembly.instantiate) {
        throw new Drpy3Error('wasm', 'load', '引擎无 WebAssembly 能力——检查 capabilities.wasm（native/polyfill/none）');
    }
    const result = await WebAssembly.instantiate(bytes);
    const instance = result.instance || result;
    return {exports: instance.exports};
}

/**
 * Emscripten 胶水托管（§6.2③）：识别 module.exports 形态——
 * ① MODULARIZE 工厂（function）：调用工厂({onRuntimeInitialized})，等待就绪（thenable / 回调 / 微任务兜底）；
 * ② 单例对象：视为同步就绪直接返回。
 */
async function loadEmscriptenGlue(code, key) {
    const shim = makeShim();
    const module_ = {exports: {}};
    const globalSnap = new Set(Object.getOwnPropertyNames(globalThis)
        .filter((k) => typeof globalThis[k] === 'function'));
    let factory;
    try {
        const fn = new Function(
            'module', 'exports', 'require', 'window', 'process', 'XMLHttpRequest',
            'document', 'location', 'Script', 'globalThis', 'console', 'WebAssembly',
            'TextEncoder', 'TextDecoder', 'atob', 'btoa',
            code,
        );
        fn(module_, module_.exports, shim.require, shim.window, shim.process, shim.XMLHttpRequest,
            shim.document, shim.location, shim.Script, globalThis, console, WebAssembly,
            TextEncoder, TextDecoder, shim.atob, shim.btoa);
    } catch (e) {
        throw new Drpy3Error('wasm', 'load', `emscripten 胶水执行失败: ${e.message} @${key}`);
    }
    let exported = module_.exports;
    // 脚本形态胶水（drpyS 遗风）：不挂 module.exports，而是把工厂挂到 globalThis
    // （如 globalThis.CNTVModuleFactory = CNTVModule）——对比执行前后的全局函数键自动识别
    const emptyExports = !exported || (typeof exported === 'object' && Object.keys(exported).length === 0);
    if (emptyExports) {
        const newFns = Object.getOwnPropertyNames(globalThis)
            .filter((k) => !globalSnap.has(k) && typeof globalThis[k] === 'function');
        if (newFns.length === 1) exported = globalThis[newFns[0]];
    }
    if (typeof exported === 'function') {
        let settled = false;
        const ready = new Promise((resolve, reject) => {
            const arg = {
                onRuntimeInitialized() {
                    settled = true;
                    setImmediate(() => resolve(inst)); // 回调后让同步尾部代码跑完
                },
            };
            let inst;
            try {
                inst = exported(arg);
            } catch (e) {
                reject(new Drpy3Error('wasm', 'load', `emscripten 工厂调用失败: ${e && e.message ? e.message : String(e)} @${key}`));
                return;
            }
            // 同步就绪快路径：内嵌 wasm 的老式 emscripten 在工厂返回时运行时已就绪（导出齐备），
            // 无需等待回调——避免 pthread/worker 构建在纯 Node 垫片下等待就绪回调挂起
            if (inst && typeof inst === 'object' && typeof inst._jsmalloc === 'function' && inst.HEAP8) {
                settled = true;
                resolve(inst);
                return;
            }
            if (inst && typeof inst.then === 'function') {
                // emscripten MODULARIZE 的 Module 自带非标准 then（无 catch）——用 Promise.resolve 适配
                Promise.resolve(inst).then((m) => {
                    settled = true;
                    resolve(m);
                }, (e) => reject(new Drpy3Error('wasm', 'load', `emscripten 实例化 rejected: ${e && e.message || e} @${key}`)));
            } else if (inst && typeof inst.onRuntimeInitialized === 'function' && !arg.onRuntimeInitialized) {
                inst.onRuntimeInitialized = () => {
                    settled = true;
                    resolve(inst);
                };
            } else {
                // 同步就绪兜底：微任务后无异常即视为就绪（胶水无异步初始化的常见形态）
                Promise.resolve().then(() => {
                    if (!settled) resolve(inst);
                });
            }
        });
        return await withTimeout(ready, 30000, `emscripten 运行时就绪超时(30s) @${key}`);
    }
    if (exported && typeof exported === 'object') return exported;
    throw new Drpy3Error('wasm', 'load', `无法识别的 wasm 资产形态: ${typeof exported} @${key}`);
}

export function makeWasm(rt) {
    // Runtime 级缓存：key 为 'path:<路径>' 或 'bytes:<哈希>'——跨实例驱逐存活（§4.6 复温抓手①）
    const cache = rt.__wasmCache || (rt.__wasmCache = new Map());

    async function loadCached(key, produce) {
        if (cache.has(key)) return cache.get(key);
        const mod = await produce();
        cache.set(key, mod);
        return mod;
    }

    async function load(source) {
        try {
            if (source instanceof Uint8Array) {
                return await loadCached('bytes:' + bytesHash(source), () => compileWasmBytes(source));
            }
            if (typeof source !== 'string' || !source) {
                throw new Drpy3Error('wasm', 'load', 'wasm.load 参数需为路径字符串或 Uint8Array');
            }
            if (/^https?:\/\//.test(source)) {
                // 远程：走 req，buffer=2 语义（§6.2）
                const req = rt.resolve('req');
                const res = await req(source, {buffer: 2});
                return await loadCached('url:' + source, async () => {
                    const bytes = b64ToBytes(res.content);
                    if (isWasmBytes(bytes)) return await compileWasmBytes(bytes);
                    return await loadEmscriptenGlue(
                        new TextDecoder().decode(bytes), 'url:' + source);
                });
            }
            // 相对/绝对路径：host.loadAsset（随源资产，§6.2①）
            const loader = rt.resolve('loadAsset');
            if (typeof loader !== 'function') {
                throw new Drpy3Error('wasm', 'load', `HostEnv 未注入 loadAsset——无法读取随源 wasm 资产: ${source}`);
            }
            return await loadCached('path:' + source, async () => {
                let content = await loader(source);
                if (content instanceof Uint8Array) {
                    if (isWasmBytes(content)) return await compileWasmBytes(content);
                    content = new TextDecoder().decode(content);
                }
                if (typeof content !== 'string') {
                    throw new Drpy3Error('wasm', 'load', `loadAsset 返回类型不支持: ${typeof content}`);
                }
                const trimmed = content.trimStart();
                if (trimmed.startsWith('{') || trimmed.startsWith('asm')) {
                    // 极少数宿主会把 .wasm 以文本读出——尝试 base64/二进制恢复，失败按胶水处理
                    try {
                        const bytes = b64ToBytes(content);
                        if (isWasmBytes(bytes)) return await compileWasmBytes(bytes);
                    } catch { /* 非 base64 */ }
                }
                return await loadEmscriptenGlue(content, source);
            });
        } catch (e) {
            if (e instanceof Drpy3Error) throw e;
            throw new Drpy3Error('wasm', 'load', e);
        }
    }

    return {load};
}
