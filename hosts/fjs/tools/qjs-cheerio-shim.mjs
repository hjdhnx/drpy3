// npm cheerio → so 全局 cheerio（Lexbor C 实现）的兼容出口。
// cli/htmlParser.js 仅消费 load()（import * as cheerio → 命名导出）。
// 由 build-qjs.mjs 的 esbuild 插件把 'cheerio' 解析重定向到本文件。
const so = globalThis.cheerio;
if (!so || typeof so.load !== 'function') {
    throw new Error('[drpy3-qjs] 缺少 so 全局 cheerio（需 libquickjs_bridge.so 宿主）');
}
export const load = so.load.bind(so);
export default so;
