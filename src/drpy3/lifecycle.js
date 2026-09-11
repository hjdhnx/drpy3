// lifecycle：Source 实例模型与状态机 Cold/Hot（设计 §4.2-§4.6、附录 D 阶段1/2）。
// W2：实例构造/ctx 调度/this 绑定/headers 基线/并发契约。
// W3：LRU+水位驱逐、signature 惰性热更、headers 快照恢复、in-flight 排空。
import {buildCtx} from './context.js';
import {makeCache} from './lib/cache.js';
import {makeStore} from './lib/store.js';
import {resolveUaConstants} from './lib/utils.js';
import {Drpy3Error} from './errors.js';

export const HOOKS = ['init', 'home', 'homeVod', 'category', 'detail', 'play', 'search', 'proxy', 'action', 'sniffer', 'isVideo'];

/** 内容指纹（宿主无关轻量哈希，signature 惰性热更用；非加密安全） */
export function hashStr(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

/** 形态判定（§4.1）：纯对象=纯声明式源；含钩子/defineSource 包装=增强源（defineSource 恒等） */
export function detectForm(def) {
    if (!def || typeof def !== 'object') throw new Drpy3Error('load', '', '源必须导出对象（{meta, rule, ...钩子}）');
    for (const h of HOOKS) {
        if (typeof def[h] === 'function') return 'enhanced';
    }
    return 'declarative';
}

// ═══ 实例内部与壳子分发方法（createSource 绑定为实例自身属性/原型链）═══
export const sourceProto = {
    /** 实例状态字段初始化（由 createSource 调用） */
    initFields(rt, def, opts = {}) {
        this.rt = rt;
        this.def = def;
        this.form = detectForm(def);
        this.path = opts.path || '';
        this.extend = opts.extend;
        this.meta = def.meta || {};
        this.rawRule = def.rule || {};
        this.key = opts.key || 'drpy_' + (this.meta.title || this.meta.host || Math.random().toString(36).slice(2));
        this.rule = null;            // init 后定稿（ctx.rule 投影）
        this.headers = {};           // 实例请求头基线（可变，§4.4）
        this.fetchParamsBaseline = {headers: {}, timeout: 5000, encoding: 'utf-8'};
        this.cache = makeCache();    // 进程内 TTL 缓存（实例存活期）
        this.store = makeStore(rt.resolve('store'), this.key); // 源级持久 KV（按源隔离）
        // ═══ 生命周期状态机（W3 充实）═══
        this.hot = false;
        this.lastUsed = 0;
        this.inFlight = 0;
        this.signature = opts.signature || '';
        this.headersSnapshot = null; // 驱逐时的 headers 快照（层次 B，§4.6）
        this.stateVersion = this.meta.stateVersion || '';
        this.pinned = (rt.pinList || []).includes(this.key);
        this.destroying = false;
        this._resumed = false;
        this._warming = null;
        this._rebuilding = null;
    },

    /** Cold → Hot 复温（调用到达时触发）：signature 惰性比对 → 快照复温/冷启动 → 并发复温排队 */
    async ensureHot() {
        this.lastUsed = Date.now();
        if (this.hot && this.rt.lifecycle) {
            try {
                await this.rt.lifecycle.checkHotUpdate(this); // 热更失败已在内部回退旧实例
            } catch { /* 旧实例继续服务 */ }
        }
        if (this.hot) return;
        if (this._warming) return this._warming; // 复温排队（§4.6 并发与失败安全）
        this._warming = (async () => {
            const resumed = !!(this.headersSnapshot && this.headersSnapshot.headers);
            await this._warm(resumed);
            this.headersSnapshot = null; // 快照已消费
        })();
        try {
            await this._warming;
        } finally {
            this._warming = null;
        }
    },

    /** rule 定稿 ①②（host/url 拼接 + headers 基线/fetchParams 基线），_warm 与热更失败回退共用 */
    _finalizeRule() {
        const rule = {...this.rawRule};
        const join = (base, u) => this.rt.resolve('joinUrl')(base, u);
        const joinMaybe = (u) => {
            if (!u) return '';
            const str = String(u);
            if (str.includes('[') && str.includes(']')) {
                const u1 = str.split('[')[0];
                const u2 = str.split('[')[1].split(']')[0];
                return (rule.host ? join(rule.host, u1) : u1) + '[' + (rule.host ? join(rule.host, u2) : u2) + ']';
            }
            return rule.host ? join(rule.host, str) : str;
        };
        rule.host = String(rule.host || this.meta.host || '').replace(/\/+$/, '');
        rule.homeUrl = rule.host && rule.homeUrl ? join(rule.host, rule.homeUrl) : (rule.homeUrl || rule.host);
        rule.detailUrl = rule.host && rule.detailUrl ? join(rule.host, rule.detailUrl) : (rule.detailUrl || '');
        rule.url = joinMaybe(rule.url || '');
        rule.searchUrl = joinMaybe(rule.searchUrl || '');
        rule.headers = resolveUaConstants({...((rule.headers && typeof rule.headers === 'object') ? rule.headers : {})});
        rule.timeout = rule.timeout || 5000;
        rule.encoding = rule.encoding || rule.编码 || 'utf-8';
        this.rule = rule;
        this.headers = {...rule.headers};
        this.fetchParamsBaseline = {headers: {...this.headers}, timeout: rule.timeout, encoding: rule.encoding};
    },

    async _warm(resumed = false) {
        // ① 快照复温判定（§4.6 层次 B）：stateVersion 一致才允许恢复旧状态
        const snap = this.headersSnapshot;
        const canResume = !!(resumed && snap && snap.stateVersion === (this.def.meta && this.def.meta.stateVersion || ''));
        // ② rule 定稿 + 实例请求头基线（§4.4）
        this._finalizeRule();
        if (canResume && snap) Object.assign(this.headers, snap.headers); // headers 快照回填
        // ③ init 钩子（this=实例；ctx.resumed=true 时源可跳过登录预处理）
        if (typeof this.def.init === 'function') {
            const ctx = buildCtx(this, {stage: 'init', resumed: canResume});
            await this.def.init.call(this, ctx, this.extend);
        }
        this.hot = true;
        this._resumed = canResume; // 本 warm 代的复温标记（供该代所有调用的 ctx.resumed）
    },

    /** 驱逐（§4.6）：in-flight 排空才释放（未排空则挂 pendingEvict）；headers 快照存档供复温回填 */
    async evict() {
        if (!this.hot) return true;
        if (this.inFlight > 0) {
            this.pendingEvict = true;
            return false;
        }
        this.headersSnapshot = {headers: {...this.headers}, stateVersion: this.stateVersion};
        this.hot = false;
        this.cache = makeCache();
        this.rule = null;
        return true;
    },

    /** 壳子钉住（§4.6 pinList）：驱逐豁免 */
    pin() {
        this.pinned = true;
    },

    unpin() {
        this.pinned = false;
    },

    /** 通用调度：ensureHot → 构造 ctx → 钩子(优先)/声明式默认实现 → 工程化报错包装。
     *  action 通道挂专用长超时（§10.2，默认 60s，HostEnv.actionTimeoutMs 可配） */
    async _dispatch(stage, args, callCtx, hook) {
        await this.ensureHot();
        this.inFlight++;
        try {
            const ctx = buildCtx(this, {stage, resumed: !!this._resumed, ...callCtx});
            const invoke = async () => {
                const fn = (hook && typeof this.def[hook] === 'function') ? this.def[hook] : null;
                if (fn) {
                    const r = await fn.call(this, ctx, ...args);
                    return r === undefined ? {} : r;
                }
                const defaults = this.rt.defaults;
                if (defaults && typeof defaults[stage] === 'function') {
                    const r = await defaults[stage].call(this, ctx, ...args);
                    return r === undefined ? {} : r;
                }
                if (stage === 'action') return ''; // 交互通道缺省空串（§10.2 降级）
                throw new Drpy3Error(stage, '', `源未实现 ${hook || stage} 钩子，且无声明式默认实现`);
            };
            if (stage === 'action') {
                const timeoutMs = this.rt.actionTimeoutMs || 60000;
                return await Promise.race([
                    invoke(),
                    new Promise((_, reject) => setTimeout(() => reject(new Drpy3Error('action', '',
                        `action 通道响应超时(${timeoutMs}ms)——多轮交互/输入类动作需在时限内返回`)), timeoutMs)),
                ]);
            }
            return await invoke();
        } catch (e) {
            if (e instanceof Drpy3Error) throw e;
            throw new Drpy3Error(stage, '', e, this.meta.title || this.key);
        } finally {
            this.inFlight--;
            this.lastUsed = Date.now();
            if (this.pendingEvict && this.inFlight === 0) {
                this.pendingEvict = false;
                this.evict(); // 排空后自动生效
            }
        }
    },

    // ═══ 六环节 + 扩展通道（壳子签名；createSource 绑定为实例自身属性）═══
    async init(extend) {
        if (extend !== undefined) this.extend = extend;
        this.hot = false;
        await this.ensureHot();
    },

    /** 通用环节调用（CLI drpy3 test / 壳子动态分发共用）：按 stage 组装调用态并调度 */
    async callStage(stage, ...args) {
        const fn = stage;
        const ctxMap = {
            home: () => ({}),
            homeVod: () => ({}),
            category: () => ({fl: args[3] || {}, pg: args[1] || 1}),
            detail: () => ({input: args[0], url: ''}),
            play: () => ({flag: args[0], input: args[1], url: args[1]}),
            search: () => ({wd: args[0], quick: !!args[1], pg: args[2] || 1}),
            proxy: () => ({input: args[0]}),
            action: () => ({input: args[1]}),
            sniffer: () => ({}),
            isVideo: () => ({input: args[0], url: args[0]}),
        };
        const build = ctxMap[stage] || (() => ({}));
        return this._dispatch(stage, args, build(), fn);
    },

    async home(filter) {
        return this.callStage('home', filter);
    },

    async homeVod(params) {
        return this.callStage('homeVod', params);
    },

    async category(tid, pg, filter, extend) {
        return this.callStage('category', tid, pg, filter, extend);
    },

    async detail(id) {
        // vod_id 透传规则（对称往返）：
        // ① 源声明 rule.detailUrl（声明式路由，分类时引擎加「分类$」，附录 C 的 3$vid1 形状）
        //    → 引擎剥除自己加的前缀再进二级（drpy2 detail() 同语义）；
        // ② 无 detailUrl（drpyS 式源）→ vod_id 是源自有的任意文本（### 拼装等），原样透传不加工。
        await this.ensureHot();
        const raw = String(id == null ? '' : id);
        const hookId = this.rule && this.rule.detailUrl && raw.includes('$')
            ? raw.slice(raw.indexOf('$') + 1)
            : raw;
        return this._dispatch('detail', [hookId, raw], {input: raw, url: ''}, 'detail');
    },

    async play(flag, id, flags) {
        return this.callStage('play', flag, id, flags);
    },

    async search(wd, quick, pg) {
        return this.callStage('search', wd, quick, pg);
    },

    async proxy(params) {
        return this.callStage('proxy', params);
    },

    async action(action, value) {
        return this.callStage('action', action, value);
    },

    async sniffer() {
        return this.callStage('sniffer');
    },

    async isVideo(url) {
        return this.callStage('isVideo', url);
    },
};

// 壳子侧分发器：绑定为实例自身属性，优先于 def 原型链上的同名裸钩子（壳子签名稳定）
const SHELL_METHODS = ['init', 'home', 'homeVod', 'category', 'detail', 'play', 'search', 'proxy', 'action', 'sniffer', 'isVideo'];

/**
 * 创建实例：原型链 instance → def 成员 → sourceProto（§4.3.6）。
 * 钩子的 this=实例：def 的辅助方法与实例自定义字段（this.columns=...）经原型可达；
 * 实例内复用钩子逻辑请抽辅助方法（如 readColumns()），经 this.助手名() 调用。
 */
export function createSource(rt, def, opts = {}) {
    const proto = Object.assign(Object.create(sourceProto), def);
    const inst = Object.create(proto);
    sourceProto.initFields.call(inst, rt, def, opts);
    for (const name of SHELL_METHODS) {
        inst[name] = sourceProto[name].bind(inst);
    }
    return inst;
}

// ═══════════════ 生命周期治理器（§4.6：数据常驻、实例按需）═══════════════
// 空闲 LRU + 内存水位 + maxHot 自动驱逐；signature 惰性热更 = 强制驱逐的特例；pin 豁免。
const DEFAULT_LIFECYCLE = {idleTTL: 120, maxHot: 16, watermark: 0.7, watermarkTarget: 0.5};

export class LifecycleManager {
    /**
     * @param rt Runtime
     * @param opts {idleTTL 秒, maxHot, memUsage:()=>0..1, watermark, watermarkTarget}
     */
    constructor(rt, opts = {}) {
        this.rt = rt;
        this.idleTTL = opts.idleTTL != null ? opts.idleTTL : DEFAULT_LIFECYCLE.idleTTL;
        this.maxHot = opts.maxHot != null ? opts.maxHot : DEFAULT_LIFECYCLE.maxHot;
        this.memUsage = typeof opts.memUsage === 'function' ? opts.memUsage : null;
        this.watermark = opts.watermark != null ? opts.watermark : DEFAULT_LIFECYCLE.watermark;
        this.watermarkTarget = opts.watermarkTarget != null ? opts.watermarkTarget : DEFAULT_LIFECYCLE.watermarkTarget;
        this.sources = new Map(); // key → Source（同 key 重载替换）
    }

    register(src) {
        this.sources.set(src.key, src);
    }

    sourcesList() {
        return [...this.sources.values()];
    }

    /** 重建成本评分（§4.6）：声明式(0) < 普通异步(1) < initCost=high(2)——从便宜的开始驱逐 */
    _score(src) {
        if (src.meta && src.meta.initCost === 'high') return 2;
        return src.form === 'declarative' ? 0 : 1;
    }

    _victims() {
        return this.sourcesList()
            .filter((s) => s.hot && !s.pinned && s.inFlight === 0)
            .sort((a, b) => this._score(a) - this._score(b) || a.lastUsed - b.lastUsed);
    }

    /** signature 惰性热更（每次调用前比对，不强制 watcher）：内容指纹变化 = 强制驱逐重建 */
    async checkHotUpdate(src) {
        const loadAsset = this.rt.hostEnv.loadAsset;
        if (!src.path || typeof loadAsset !== 'function') return;
        let content;
        try {
            content = await loadAsset(src.path);
        } catch {
            return; // 读不到不判变（资产加载失败不等于源更新）
        }
        if (typeof content !== 'string') return;
        const sig = hashStr(content);
        if (sig === src.signature) return;
        if (src._rebuilding) {
            await src._rebuilding;
            return;
        }
        src._rebuilding = this._rebuild(src, content, sig).finally(() => {
            src._rebuilding = null;
        });
        await src._rebuilding;
    }

    /** 原子替换重建；失败 → 保留旧实例继续服务（§4.6），错误挂 src.lastError 上报 */
    async _rebuild(src, code, sig) {
        const old = {
            def: src.def, meta: src.meta, rawRule: src.rawRule, form: src.form,
            signature: src.signature, stateVersion: src.stateVersion,
        };
        try {
            const def = await this.rt.evaluateSource(code, {path: src.path, key: src.key});
            src.def = def;
            src.meta = def.meta || {};
            src.rawRule = def.rule || {};
            src.form = detectForm(def);
            src.signature = sig;
            src.stateVersion = src.meta.stateVersion || '';
            src.hot = false;
            if (!src.headersSnapshot) {
                // 热更 = 强制驱逐（§4.6）：先快照当前 headers，复温语义一致
                src.headersSnapshot = {headers: {...src.headers}, stateVersion: old.stateVersion};
            }
            await src._warm(true); // 复温语义：headers 快照回填 + resumed
            src.headersSnapshot = null;
            this._log(`[drpy3] 源热更完成: ${src.key}`);
        } catch (e) {
            Object.assign(src, old);
            src._finalizeRule(); // 旧 rule/headers 基线重建（不重跑 init，保留原实例状态）
            src.hot = true;
            src.lastError = e;
            this._log(`[drpy3] 源热更失败，保留旧实例继续服务: ${src.key} — ${e.message}`);
        }
    }

    _log(...args) {
        try {
            const log = this.rt.resolve('log');
            if (typeof log === 'function') log(...args);
        } catch { /* 日志出口异常不阻塞治理 */ }
    }

    /** 自动治理：空闲 LRU → maxHot 上限 → 内存水位（驱逐最冷至目标水位）。壳子零管理成本 */
    async sweep({force = false} = {}) {
        const report = {evicted: []};
        const now = Date.now();
        // ① 空闲 LRU 超时
        for (const src of this.sourcesList()) {
            if (!src.hot || src.pinned || src.inFlight > 0) continue;
            if (force || now - src.lastUsed > this.idleTTL * 1000) {
                if (await src.evict()) report.evicted.push(src.key);
            }
        }
        // ② maxHot 上限
        let hotCount = this.sourcesList().filter((s) => s.hot).length;
        for (const v of this._victims()) {
            if (hotCount <= this.maxHot) break;
            if (await v.evict()) {
                report.evicted.push(v.key);
                hotCount--;
            }
        }
        // ③ 内存水位：超限 → 驱逐最冷至目标水位
        if (this.memUsage) {
            while (this.memUsage() > this.watermark) {
                const victims = this._victims();
                if (!victims.length) break;
                if (!(await victims[0].evict())) break;
                report.evicted.push(victims[0].key);
                if (this.memUsage() <= this.watermarkTarget) break;
            }
        }
        return report;
    }
}
