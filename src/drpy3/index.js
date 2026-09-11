// drpy3-core 入口：宿主无关的 ESM 类库
// 设计唯一真相源：docs/drpy3-设计文档.md；执行手册：docs/drpy3-实现任务书.md
// 单文件形态（drpy2.js 同款用法）：npm run build:drpy3 → dist/drpy3.js / dist/drpy3.esm.min.js
import {Runtime} from './runtime.js';

export {Runtime};
export const VERSION = 'drpy3 0.1.0';

// defineSource 运行时恒等（§4.1）：唯一作用是给 IDE/TS 提供类型提示——用不用都不影响行为
export function defineSource(source) {
    return source;
}

// drpy2 消费习惯兼容：宿主可取模块默认导出（const drpy3 = await import('./drpy3.js'); drpy3.default.Runtime）
export default {Runtime, defineSource, VERSION};
