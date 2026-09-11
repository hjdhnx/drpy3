// Runtime：HostEnv 校验 / use() 运行时覆盖 / 能力查找顺序 / capabilities（设计 §7）
// 能力查找顺序：source 自带(预留，W8 接入) > rt.use 覆盖 > 构造注入 > 框架内置兜底（§7.2）
import {memoryStore} from './lib/store.js';
import {builtinJoinUrl} from './lib/utils.js';
import {detectForm, createSource, LifecycleManager, hashStr} from './lifecycle.js';
import {createSource2x, looksLikeDrpy2} from './compat/drpy2.js';
import {evalSourceNeutral, evalSourceCjs} from './modules/loader.js';
import {defaults as declarativeDefaults} from './rules/defaults.js';
import {Drpy3Error} from './errors.js';

// 框架有内置兜底的 HostEnv 字段（缺注入不致命，走兜底并在 capabilities 标注）
const BUILTIN_FALLBACK = new Set(['batchFetch', 'pdfl', 'joinUrl', 'store', 'log', 'getProxy', 'loadAsset']);
// 必须注入（框架无法兜底的系统能力）
const REQUIRED = ['req', 'pdfh', 'pdfa', 'pd'];

// 内置兜底实现注册表：名字 -> factory(hostEnv)（惰性调用，保持 runtime 无重依赖）
const BUILTINS = {
    joinUrl: () => builtinJoinUrl,
    store: () => memoryStore(),
    log: () => (...args) => console.log(...args),
    getProxy: () => () => 'http://127.0.0.1:9978/proxy?do=js',
    // batchFetch / pdfl 兜底依赖 net/parse 上下文，在 lib/net.js、lib/parse.js 中组装（W4/W5），
    // 这里先声明存在性供 capabilities 标注；resolve('batchFetch'/'pdfl') 由 net/parse 层拦截。
    batchFetch: null,
    pdfl: null,
    loadAsset: null, // 无兜底：随源资产（wasm 等）必须有宿主实现才可用
};

function detectWasm() {
    try {
        return typeof WebAssembly !== 'undefined' && WebAssembly.compile && WebAssembly.instantiate
            ? 'native' : 'none';
    } catch {
        return 'none';
    }
}

export class Runtime {
    #overrides = {};   // rt.use() 覆盖层
    #sourceCaps = {};  // source 自带层（per-source，W8 模块化接入；运行时层为空默认）
    #memStore = null;  // memory-fallback store 单例（多源共享介质，按源 key 隔离命名空间）

    constructor(hostEnv = {}) {
        this.hostEnv = hostEnv;
        this.hostEnv.env = hostEnv.env || {};
        this.#memStore = memoryStore();
        this.pinList = hostEnv.pinList || [];  // 壳子钉住的高频源（§4.6）
        this.defaults = declarativeDefaults;   // 声明式默认实现（规则引擎，§9/附录D 阶段3-4）
        this.lifecycle = new LifecycleManager(this, hostEnv.lifecycle || {}); // 实例生命周期治理（§4.6）
        this.actionTimeoutMs = hostEnv.actionTimeoutMs || 60000; // action 通道专用长超时（§10.2）
        this.check();
    }

    /** 自动治理入口（壳子可定期调用/测试直调）：LRU+水位+maxHot 驱逐 */
    sweep(opts) {
        return this.lifecycle.sweep(opts);
    }

    /** 源装载（附录 D 阶段1）：drpy2 特征自动走兼容层；对象直接建实例；字符串源码走模块求值 */
    async load(sourceLike, opts = {}) {
        let def = sourceLike;
        const code = typeof sourceLike === 'string' ? sourceLike : null;
        if (code !== null) {
            if (!opts.drpy3 && looksLikeDrpy2(code)) {
                return this.load2x(code, opts); // drpy2 老源零改动（§11）
            }
            def = await this.evaluateSource(code, opts);
        }
        const src = createSource(this, def, opts);
        if (code !== null && !src.signature) src.signature = hashStr(code); // 内容指纹基线（惰性热更）
        this.lifecycle.register(src);
        return src;
    }

    /** 源码字符串求值：opts.mode==='cjs' → 内置 CJS shim（模式 C）；宿主 evalModule（模式 A）；默认中性形态 */
    async evaluateSource(code, opts = {}) {
        if (opts.mode === 'cjs') {
            return await evalSourceCjs(code, opts, this);
        }
        if (typeof this.hostEnv.evalModule === 'function') {
            const mod = await this.hostEnv.evalModule(code, opts.path || '');
            return mod && mod.default !== undefined ? mod.default : mod;
        }
        return await evalSourceNeutral(code, opts);
    }

    /** drpy2 兼容装载（§11）：伪全局映射 + 自动串行；同引擎其他实例并发不受影响 */
    load2x(code, opts = {}) {
        return createSource2x(this, code, opts);
    }

    /** 形态判定（§4.1）：纯对象=纯声明式 / defineSource=增强 / drpy2 特征=兼容层 */
    _detectForm(def) {
        return detectForm(def);
    }

    /** 运行时覆盖单项或整包（§7.2）：rt.use({pdfh: myFasterPdfh}) */
    use(overrides) {
        if (!overrides || typeof overrides !== 'object') throw new TypeError('rt.use(obj): 需要对象');
        Object.assign(this.#overrides, overrides);
        return this;
    }

    /** 构造期一次性自检：缺什么、什么走了兜底，立刻打印清楚（§7.1） */
    check() {
        const missing = [];
        const fallbacks = {};
        for (const name of REQUIRED) {
            if (typeof this.#raw(name) !== 'function') missing.push(name);
        }
        for (const name of Object.keys(BUILTINS)) {
            if (typeof this.#raw(name) !== 'function' && BUILTINS[name] !== undefined) fallbacks[name] = 'builtin';
        }
        const report = {missing, fallbacks, wasm: this.#wasmMode(), engine: this.hostEnv.engine || ''};
        try {
            const log = typeof this.#raw('log') === 'function' ? this.#raw('log') : console.log;
            if (missing.length) {
                log(`[drpy3] HostEnv 缺少必注入项: ${missing.join(', ')} —— 运行期调用将报错。请注入: ${missing.map((m) => `${m}()`).join(' / ')}`);
            }
            if (Object.keys(fallbacks).length) {
                log(`[drpy3] HostEnv 走内置兜底: ${Object.keys(fallbacks).join(', ')}`);
            }
        } catch { /* 日志出口自身异常不阻塞构造 */ }
        return report;
    }

    /** 本 Runtime 能力表（§7.1）：对接方从"考古全局名"变成"读一张能力表" */
    get capabilities() {
        const cap = {
            wasm: this.#wasmMode(),
            action: this.hostEnv.action === false ? false : true,
            engine: this.hostEnv.engine || 'unknown',
            version: this.hostEnv.version || '',
        };
        for (const name of ['req', 'pdfh', 'pdfa', 'pd', 'pdfl', 'batchFetch', 'joinUrl', 'store', 'log', 'getProxy', 'loadAsset']) {
            cap[name] = this.#capOf(name);
        }
        return Object.freeze(cap);
    }

    /** 能力解析：source 自带 > use 覆盖 > 构造注入 > 内置兜底（§7.2） */
    resolve(name, sourceCaps = null) {
        const layers = [sourceCaps, this.#overrides, this.hostEnv];
        for (const layer of layers) {
            const v = layer && layer[name];
            if (v !== undefined && v !== null) return v;
        }
        return this.#builtin(name);
    }

    // ─── 内部 ───
    #raw(name) {
        for (const layer of [this.#overrides, this.hostEnv]) {
            const v = layer[name];
            if (v !== undefined && v !== null) return v;
        }
        return undefined;
    }

    #capOf(name) {
        if (this.#overrides[name] !== undefined && this.#overrides[name] !== null) return 'use-override';
        if (this.hostEnv[name] !== undefined && this.hostEnv[name] !== null) return 'host';
        if (name === 'store') return 'memory-fallback';
        if (BUILTINS[name] !== undefined) return 'builtin';
        return 'missing';
    }

    #builtin(name) {
        if (name === 'store') return this.#memStore;
        const f = BUILTINS[name];
        if (typeof f === 'function') return f(this.hostEnv);
        return undefined;
    }

    #wasmMode() {
        const declared = this.hostEnv.wasm;
        return declared === 'native' || declared === 'polyfill' || declared === 'none' ? declared : detectWasm();
    }
}
