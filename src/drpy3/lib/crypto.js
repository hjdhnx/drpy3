// crypto：加密域标准库（设计 §9 crypto）。库能力全部来自 peer dist/drpy-core-lite.min.js
// （CryptoJS/JSEncrypt/NODERSA/pako/gbkTool），不重造。纯 CPU 函数保持同步（§5.1）。
import {CryptoJS, pako, JSEncrypt, NODERSA} from './peer.js';
import {Drpy3Error} from '../errors.js';

export function md5(text) {
    return CryptoJS.MD5(String(text)).toString();
}

export function base64Encode(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

export function base64Decode(text) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
}

function bytesToWordArray(bytes) {
    return CryptoJS.lib.WordArray.create(bytes);
}

function wordArrayToBytes(wa) {
    const words = wa.words;
    const sigBytes = wa.sigBytes;
    const out = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
        out[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return out;
}

export {bytesToWordArray, wordArrayToBytes};

/** gzip 压缩 → base64（drpy2 gzip 原语义，压缩率 80%+，home filter 用） */
export function gzip(str) {
    return bytesToWordArray(pako.gzip(String(str))).toString(CryptoJS.enc.Base64);
}

/** base64 → gzip 解压（drpy2 ungzip 原语义，rule.filter 解码用） */
export function ungzip(b64Data) {
    const bytes = wordArrayToBytes(CryptoJS.enc.Base64.parse(String(b64Data).trim()));
    return pako.inflate(bytes, {to: 'string'});
}

// ═══ AES/DES（CryptoJS 封装，语义对齐 drpy2 aesX/desX）═══
function cipherX(algo, padding, mode, input, key, iv, option) {
    option = option || {};
    const keyWA = CryptoJS.enc.Utf8.parse(key);
    const ivWA = iv ? CryptoJS.enc.Utf8.parse(iv) : (algo === 'AES' ? CryptoJS.enc.Utf8.parse(key.substr(0, 16)) : undefined);
    const cfg = {padding: CryptoJS.pad[padding] || CryptoJS.pad.Pkcs7, mode: CryptoJS.mode[mode || 'CBC'], iv: ivWA};
    if ((option.mode || mode) === 'ECB') delete cfg.iv;
    if (/^enc/i.test(option.method || 'enc')) {
        const data = option.utf8 ? CryptoJS.enc.Utf8.parse(input) : CryptoJS.enc.Base64.parse(input);
        return CryptoJS[algo].encrypt(data, keyWA, cfg).ciphertext.toString(CryptoJS.enc.Base64);
    }
    const data = CryptoJS.enc.Base64.parse(input);
    const dec = CryptoJS[algo].decrypt({ciphertext: data}, keyWA, cfg);
    return dec.toString(CryptoJS.enc.Utf8);
}

export function aesX(input, key, iv, option) {
    try {
        return cipherX('AES', 'Pkcs7', 'CBC', input, key, iv, option);
    } catch (e) {
        throw new Drpy3Error('crypto', 'aesX', e);
    }
}

export function desX(input, key, iv, option) {
    try {
        return cipherX('DES', 'Pkcs7', 'CBC', input, key, iv, option);
    } catch (e) {
        throw new Drpy3Error('crypto', 'desX', e);
    }
}

export function rc4(input, key, option) {
    option = option || {};
    const keyWA = CryptoJS.enc.Utf8.parse(key);
    if (/^dec/i.test(option.method || '')) {
        const data = CryptoJS.enc.Base64.parse(input);
        const dec = CryptoJS.RC4.decrypt({ciphertext: data}, keyWA);
        return dec.toString(CryptoJS.enc.Utf8);
    }
    const data = CryptoJS.enc.Utf8.parse(input);
    return CryptoJS.RC4.encrypt(data, keyWA).ciphertext.toString(CryptoJS.enc.Base64);
}

// ═══ RSA（JSEncrypt 主 / NODERSA 备，语义对齐 drpy2 RSA 类）═══
export function rsaX(data, key, option = {}) {
    const method = (option.method || (key && key.includes('BEGIN') ? 'decode' : 'encode')).toLowerCase();
    if (method.startsWith('dec')) {
        if (typeof JSEncrypt === 'function') {
            const dec = new JSEncrypt();
            dec.setPrivateKey(key);
            const fn = dec[option.long ? 'decryptUnicodeLong' : 'decrypt'];
            const r = fn.call(dec, data);
            return r || '';
        }
        return NODERSA.decode({data, key, option});
    }
    if (typeof JSEncrypt === 'function') {
        const enc = new JSEncrypt();
        enc.setPublicKey(key);
        const fn = enc[option.long ? 'encryptUnicodeLong' : 'encrypt'];
        const r = fn.call(enc, data);
        return r || '';
    }
    return NODERSA.encode({data, key, option});
}

/** wasm 预热（§9 crypto.ready）：原生 wasm 引擎上近乎零成本；wasm 域在 lib/wasm.js（W5） */
export function makeCrypto(rt) {
    return {
        md5, base64Encode, base64Decode, gzip, ungzip, aesX, desX, rc4, rsaX,
        async ready() {
            return true;
        },
    };
}
