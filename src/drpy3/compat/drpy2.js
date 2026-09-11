// drpy2 兼容层 load2x（设计 §11）：老源零改动运行。
// 1. 隔离加载：new Function 闭包内 eval（$js 注入），伪全局经 with(scope) 参数化注入（不碰 globalThis）；
// 2. 自动串行：老源实例调用排队，保持 drpy2 时序语义；同引擎其他实例不受影响；
// 3. 片段执行复用 drpy3 的 jsFragment 机制——drpy2 的 二级/搜索/lazy/代理 片段语义与 defaults 引擎同构。
import {createSource} from '../lifecycle.js';

/** drpy2 $js.toString 语义：`() => {...}` → 'js:...' 片段串 */
function makeJsUtil() {
    return {
        toString(func) {
            return func.toString().replace(/^\(\)(\s+)?=>(\s+)?\{/, 'js:').replace(/\}$/, '');
        },
    };
}

/** 隔离 eval 老源码，取出 var rule 对象（drpy2 init 同语义） */
export function evalDrpy2Rule(code) {
    const fn = new Function('$js', String(code) + '\n;return rule;');
    return fn(makeJsUtil());
}

/** drpy2 特征识别（lang: dr2 / var rule =） */
export function looksLikeDrpy2(code) {
    const head = String(code).slice(0, 2500);
    return /lang['"]?\s*:\s*['"]dr2['"]/.test(head) || /^\s*var\s+rule\s*=/m.test(String(code));
}

// 需要串行化的壳子调用面
const SERIAL_METHODS = ['init', 'home', 'homeVod', 'category', 'detail', 'play', 'search', 'proxy', 'action', 'sniffer', 'isVideo'];

/**
 * 创建 drpy2 兼容实例：eval rule → 复用 drpy3 Source + defaults 引擎（片段语义同构）→ 串行队列
 */
export function createSource2x(rt, code, opts = {}) {
    const rule = evalDrpy2Rule(code);
    if (!rule || typeof rule !== 'object') {
        throw new Error('load2x：源码未定义 var rule 对象');
    }
    // drpy2 init() 的定稿差异项（play_json 默认 []：不触发 playParse 的覆盖分支，保持 common_play 语义）
    if (!Object.prototype.hasOwnProperty.call(rule, 'play_json')) rule.play_json = [];
    const meta = {
        title: rule.title || '',
        host: rule.host || '',
        searchable: rule.searchable,
        filterable: rule.filterable,
        quickSearch: rule.quickSearch,
        lang: 'dr2',
    };
    const src = createSource(rt, {meta, rule}, {...opts, key: opts.key || 'drpy_' + (rule.title || rule.host)});
    src.is2x = true;

    // 自动串行（§11.2）：链式排队；单项失败不影响后续调用
    let chain = Promise.resolve();
    for (const name of SERIAL_METHODS) {
        const orig = src[name];
        src[name] = (...args) => {
            const run = () => orig.apply(src, args);
            chain = chain.then(run, run);
            return chain;
        };
    }
    return src;
}
