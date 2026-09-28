// drpy3-core 入口：宿主无关的 ESM 类库
// 设计唯一真相源：docs/drpy3-设计文档.md；执行手册：docs/drpy3-实现任务书.md
// 单文件形态（drpy2.js 同款用法）：npm run build:drpy3 → dist/drpy3.js / dist/drpy3.esm.min.js
import {Runtime} from './runtime.js';
import {makeCrypto} from './lib/crypto.js';
import {makeText} from './lib/text.js';
import {makeUtils, UA} from './lib/utils.js';
import {makeParse} from './lib/parse.js';

export {Runtime};
export const VERSION = 'drpy3 0.1.0';

// defineSource 运行时恒等（§4.1）：唯一作用是给 IDE/TS 提供类型提示——用不用都不影响行为
export function defineSource(source) {
    return source;
}

// ── dr2 迁移裸名工具面（2026-09-28）──
// dr2 源与 drpy2.js 拍平同作用域，裸名直用 md5/pdfh/urljoin/MOBILE_UA/print 等；
// dr3 同名能力在 ctx.* 别名层，而 net/store/parseRule 绑定每次调用的 ctx（调用态
// 隔离 §4.2/§4.3），挂全局会跨调用串态——刻意不挂。本函数只把「Runtime 级单例、
// 无调用态」的纯工具提为 Context 全局，dr2 老源作者的写法习惯在 dr3 源内裸名
// 直接可用；同名不覆盖（库全局/宿主注入优先）。
// 宿主在 Runtime 创建后调用一次：exposeRuntimeGlobals(rt)。
export function exposeRuntimeGlobals(rt) {
    const g = globalThis;
    const put = (names, ns) => {
        for (const n of names) {
            if (ns[n] !== undefined && g[n] === undefined) g[n] = ns[n];
        }
    };
    put(['md5', 'base64Encode', 'base64Decode', 'gzip', 'ungzip', 'aesX', 'desX', 'rc4', 'rsaX'], makeCrypto(rt));
    put(['cut', 'encodeStr', 'decodeStr'], makeText());
    put(['joinUrl', 'getHome', 'urlencode', 'encodeUrl', 'buildUrl', 'buildQueryString', 'forceOrder', '是否正版', 'urlDeal'], makeUtils(rt));
    put(['pdfh', 'pdfa', 'pd', 'pdfl', 'jp'], makeParse(rt));
    if (g.urljoin === undefined) g.urljoin = g.joinUrl; // dr2 老名
    // dr2 UA 常量裸名（headers: {'User-Agent': MOBILE_UA} 高频写法）
    for (const k of ['MOBILE_UA', 'PC_UA', 'IOS_UA', 'UC_UA']) {
        if (g[k] === undefined) g[k] = UA[k];
    }
    // dr2 日志习惯：print/log → HostEnv.log（宿主 console 通道，DsPlayer 接 logcat）
    if (g.log === undefined) g.log = (...args) => rt.resolve('log')(...args);
    if (g.print === undefined) g.print = g.log;
}

// drpy2 消费习惯兼容：宿主可取模块默认导出（const drpy3 = await import('./drpy3.js'); drpy3.default.Runtime）
export default {Runtime, defineSource, exposeRuntimeGlobals, VERSION};
