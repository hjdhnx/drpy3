// drpy3 × fjs 胶水层（W13，§6 对接矩阵 Flutter 行）。
// 由 hosts/fjs/tools/build.mjs 与引擎本体（peer 链 + 库包）+ cli/htmlParser.js 打成
// 单文件 ESM 模块；在 fjs 中以模块名 'drpy3' 装载（declareNewModule/evaluateModule），
// Dart 侧经 engine.call('drpy3', 方法名, params) 调度六环节。
//
// 架构（宿主对接指南 §5 档 A / §6）：
//   - req       → fjs.bridge_call 到 Dart（charset/timeout/redirect 控制权在宿主语言，与
//                 Node 参考宿主 cli/node-host.mjs 语义对拍等价；不用 fjs 内置 fetch——
//                 llrt fetch 的 encoding(gbk)/redirect/buffer 控制不足以覆盖 drpy3 req 契约）
//   - pdf 四件套 → 本地 cheerio 版 htmlParser（与参考实现逐字同源，禁止手写解析器）
//   - store     → 进程内 Map（引擎 store 契约是同步介质，不能走异步 bridge）；
//                 跨重启由 Dart 调 drpy3StoreExport/Import 快照（值须 JSON 可序列化）
//   - evalModule→ bridge：Dart declareNewModule 后 JS 动态 import（fjs 模块一经加载
//                 不可替换——含相对 import 的源热更需重建引擎，见 README 已知限制）
//   - load2x 老源：档 A 无同步 HTTP 原语，syncReq 不提供 → drpy2 老源不支持（README）
import {Runtime} from '../../dist/drpy3.js';
import {jsoup} from '../../cli/htmlParser.js';

// ── 全局垫片：引擎/库包依赖 WHATWG URL（builtinJoinUrl 等）。
// fjs url 内置（llrt）通常已注入全局 URL；缺了再从内置模块补，补不到则留引擎保守拼接兜底。
if (typeof globalThis.URL === 'undefined') {
    try {
        const urlMod = await import('url');
        globalThis.URL = urlMod.URL || urlMod.default?.URL;
    } catch { /* builtinJoinUrl 自带异常兜底路径 */ }
}

const toBytes = (v) => {
    if (v instanceof Uint8Array) return v;
    if (v instanceof ArrayBuffer) return new Uint8Array(v);
    return v;
};

// fjs 桥：engine.init(bridge) 后全局 fjs 可用（register_fjs），JS 侧统一经
// fjs.bridge_call(对象) 进 Dart，Dart 回调返回 JsResult → 本函数拿到 JS 值。
async function callBridge(action, payload = {}) {
    try {
        const fjs = globalThis.fjs;
        if (!fjs || typeof fjs.bridge_call !== 'function') return null;
        return await fjs.bridge_call({action, ...payload});
    } catch {
        return null; // 桥异常按"宿主未提供"处理，走引擎兜底/错误包装
    }
}

/** 组装 HostEnv（bridge 走全局 fjs.bridge_call；opts 供 engine/env 等元信息注入） */
const STORE_MAP = new Map(); // `${ns}|${k}` -> v（跨重启快照见 drpy3StoreExport/Import）
function makeHostEnv(opts = {}) {
    const storeMap = STORE_MAP;
    return {
        engine: 'fjs (quickjs-ng via rquickjs)',
        version: opts.fjsVersion || '',

        // ═══ 必选五件套 ═══
        async req(url, options = {}) {
            const o = options || {};
            const r = await callBridge('req', {url: String(url), options: o});
            if (!r || typeof r !== 'object') return {content: '', headers: {error: 'bridge: req 未返回响应'}};
            if (o.buffer === 1) r.content = toBytes(r.content);
            return r;
        },
        pdfh: (html, parse, baseUrl = '') => new jsoup(baseUrl || '').pdfh(html, parse, baseUrl || ''),
        pdfa: (html, parse) => new jsoup('').pdfa(html, parse),
        pd: (html, parse, baseUrl = '') => new jsoup(baseUrl || '').pd(html, parse, baseUrl || ''),
        pdfl: (html, parse, listText, listUrl, myUrl) =>
            new jsoup(myUrl || '').pdfl(html, parse, listText, listUrl, myUrl),

        // ═══ 可选注入 ═══
        store: {
            get(ns, k, def = undefined) {
                const key = ns + '|' + k;
                return storeMap.has(key) ? storeMap.get(key) : def;
            },
            set(ns, k, v) {
                storeMap.set(ns + '|' + k, v);
                return v;
            },
            delete(ns, k) {
                storeMap.delete(ns + '|' + k);
            },
        },
        log: (...args) => {
            try {
                console.log('[drpy3]', ...args);
            } catch { /* console 未注入时静默 */ }
        },
        getProxy: async (isPublic) => {
            const p = await callBridge('getProxy', {isPublic: !!isPublic});
            return typeof p === 'string' && p ? p : 'http://127.0.0.1:9978/proxy?do=js';
        },
        loadAsset: async (p) => {
            const r = await callBridge('loadAsset', {path: String(p)});
            return r == null ? '' : toBytes(r);
        },
        evalModule: async (code, path) => {
            const r = await callBridge('evalModule', {code: String(code), path: path ? String(path) : ''});
            const name = typeof r === 'string' && r ? r : '';
            if (!name) throw new Error('evalModule: 宿主未注册模块（fjs 需 Dart 侧 declareNewModule）');
            return import(name); // fjs 模块一经加载不可替换——热更需重建引擎（README 已知限制）
        },
        env: opts.env || {},
        action: opts.action !== false,
    };
}

// ═══════════════ 调度面：Dart 经 engine.call 使用 ═══════════════
// 边界统一 JSON 字符串（与 TVBox 调度契约一致；JsValue 深层映射的边角全部规避）。
// 错误约定：drpy3Call 失败时返回 {"__drpy3_error": {stage, rule, error, hint, source}}，
// Dart 侧检测该键后以异常呈现（Drpy3Error.toJSON 契约，宿主对接指南 §3.1）。

const SOURCES = new Map(); // key -> Source 实例
let RT = null;

function rt() {
    if (!RT) RT = new Runtime(makeHostEnv(globalThis.__drpy3Opts || {}));
    return RT;
}

/** Dart 侧装载 bundle 后调用一次：注入元信息选项（fjsVersion/action/env），返回 check 清单 */
export function drpy3Setup(optsJson) {
    globalThis.__drpy3Opts = optsJson ? JSON.parse(optsJson) : {};
    RT = null; // 允许重装（测试场景）；生产单引擎生命周期内通常只调一次
    return JSON.stringify(rt().check());
}

/** 装载源（drpy3 新源；drpy2 老源 fjs 档 A 不支持——无 syncReq 同步桥） */
export async function drpy3Load(code, key, path, extendJson, signature) {
    const src = await rt().load(String(code), {
        key: String(key),
        ...(path ? {path: String(path)} : {}),
        ...(signature ? {signature: String(signature)} : {}),
        ...(extendJson ? {extend: JSON.parse(extendJson)} : {}),
    });
    SOURCES.set(String(key), src);
    return JSON.stringify({key: src.key, form: src.form, hot: src.hot});
}

/** 六环节统一入口：method ∈ init/home/homeVod/category/search/detail/play/proxy/action/sniffer/isVideo */
export async function drpy3Call(key, method, argsJson) {
    const src = SOURCES.get(String(key));
    if (!src) return JSON.stringify({__drpy3_error: {stage: 'dispatch', error: `源未装载: ${key}`}});
    let args = [];
    if (argsJson) {
        try {
            args = JSON.parse(argsJson);
        } catch {
            return JSON.stringify({__drpy3_error: {stage: 'dispatch', error: 'argsJson 非法'}});
        }
    }
    try {
        const out = await src[method](...args);
        return JSON.stringify(out === undefined ? null : out);
    } catch (e) {
        const detail = e && typeof e.toJSON === 'function' ? e.toJSON()
            : {stage: method, error: String(e && e.message || e)};
        return JSON.stringify({__drpy3_error: detail});
    }
}

/** 能力表（fjs 无原生 WebAssembly → wasm:'none'，源据此降级；五件套应全 host） */
export function drpy3Capabilities() {
    return JSON.stringify(rt().capabilities);
}

/** 生命周期治理（LRU/水位/maxHot；平时自动，Dart 可在内存压力时手动触发） */
export async function drpy3Sweep(optsJson) {
    const r = await rt().sweep(optsJson ? JSON.parse(optsJson) : {});
    return JSON.stringify(r);
}

/** store 快照导出/导入（跨重启持久化：Dart 拿去存盘，下次启动先 Import；值须 JSON 可序列化） */
export function drpy3StoreExport() {
    const dump = {};
    for (const [key, v] of STORE_MAP.entries()) {
        const i = key.indexOf('|');
        const ns = i > 0 ? key.slice(0, i) : '';
        const k = i > 0 ? key.slice(i + 1) : key;
        (dump[ns] ||= {})[k] = v;
    }
    return JSON.stringify(dump);
}

export function drpy3StoreImport(json) {
    const dump = JSON.parse(String(json || '{}'));
    for (const [ns, kv] of Object.entries(dump || {})) {
        for (const [k, v] of Object.entries(kv || {})) STORE_MAP.set(ns + '|' + k, v);
    }
    return JSON.stringify({ok: true});
}
