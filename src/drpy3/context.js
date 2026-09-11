// ctx：两层上下文的调用态层（设计 §4.2/§4.5）。
// 每次调用全新对象（scratch/url/fetchParams 全新），实例态以只读投影挂入（headers 例外：可变基线）。
import {makeNet} from './lib/net.js';
import {makeParse} from './lib/parse.js';
import {makeCrypto} from './lib/crypto.js';
import {makeText} from './lib/text.js';
import {makeUtils} from './lib/utils.js';
import {makeWasm} from './lib/wasm.js';

// ctx 顶层快捷别名（§4.5②）：高频约 20 个函数提升到 ctx 一层；权威源始终是 ctx.lib.*
const NET_ALIASES = ['req', 'request', 'post', 'reqCookie', 'batchFetch', 'all', 'download'];
const PARSE_ALIASES = ['pdfh', 'pdfa', 'pd', 'pdfl', 'jp', 'jinja2', 'parseRule'];
const CRYPTO_ALIASES = ['md5', 'base64Encode', 'base64Decode', 'gzip', 'ungzip', 'aesX', 'desX', 'rc4', 'rsaX'];
const UTILS_ALIASES = ['joinUrl', 'getHome', 'urlencode', 'buildUrl', 'buildQueryString', 'forceOrder', '是否正版', 'urlDeal', 'getProxyUrl'];

/** 实例级共享命名空间缓存 key（parse/crypto/text/utils/wasm 与单实例无关，Runtime 级单例） */
function runtimeNs(rt, name, factory) {
    if (!rt.__libCache) rt.__libCache = {};
    if (!rt.__libCache[name]) rt.__libCache[name] = factory(rt);
    return rt.__libCache[name];
}

function pick(ns, names) {
    const out = {};
    for (const n of names) if (ns[n] !== undefined) out[n] = ns[n];
    return out;
}

/**
 * 构造单次调用的 ctx
 * @param instance Source 实例（实例态来源）
 * @param call 调用参数：{stage, url, input, flag, wd, pg, fl, resumed}
 */
export function buildCtx(instance, call = {}) {
    const rt = instance.rt;
    const ctx = {
        // ═══ 调用态（每次调用全新，天然隔离 §4.3）═══
        stage: call.stage || '',
        url: call.url || '',                 // 原 MY_URL
        input: call.input !== undefined ? call.input : '',  // play/search 场景入参回显
        flag: call.flag !== undefined ? call.flag : '',
        wd: call.wd !== undefined ? call.wd : '',
        pg: call.pg !== undefined ? call.pg : 1,
        fl: call.fl || {},                   // category 场景筛选（原 extend）
        scratch: {},                         // 临时篮子（原 VODS/VOD/TABS/LISTS 归宿）
        fetchParams: JSON.parse(JSON.stringify(instance.fetchParamsBaseline)), // 调用级请求参数基线
        // ═══ 实例态的只读投影（headers 例外：可变实例基线 §4.4）═══
        get rule() {
            return instance.rule;
        },
        key: instance.key,
        meta: instance.meta,
        headers: instance.headers,           // 可变：init/任意调用中更新，实例内后续请求自动携带
        resumed: !!call.resumed,             // 复温标记（§4.6 层次 B）
        // ═══ 能力 ═══
        log: (...args) => rt.resolve('log')(...args),
        store: instance.store,
        cache: instance.cache,
        capabilities: rt.capabilities,
        __sync: !!instance.is2x, // load2x 片段作用域开关：request 走同步桥（drpy2 同步语义）
        __rt: rt,                // 片段同步桥需要 rt 解析 syncReq
    };
    ctx.lib = {
        net: makeNet(rt, ctx),                     // net 绑定调用态（headers 合并需要 ctx）
        parse: runtimeNs(rt, 'parse', makeParse),
        crypto: runtimeNs(rt, 'crypto', makeCrypto),
        text: runtimeNs(rt, 'text', makeText),
        utils: runtimeNs(rt, 'utils', makeUtils),
        wasm: runtimeNs(rt, 'wasm', makeWasm),
        store: instance.store,
        cache: instance.cache,
    };
    // 快捷别名 = lib 投影（同一函数引用，测试以 `ctx.req === ctx.lib.net.req` 断言）
    Object.assign(ctx, pick(ctx.lib.net, NET_ALIASES));
    Object.assign(ctx, pick(ctx.lib.parse, PARSE_ALIASES));
    Object.assign(ctx, pick(ctx.lib.crypto, CRYPTO_ALIASES));
    Object.assign(ctx, pick(ctx.lib.utils, UTILS_ALIASES));
    return ctx;
}
