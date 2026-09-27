// drpy3 × qjs bundle 构建：与 build.mjs 同构，两处 so 化替换——
//   ① peer 库包 drpy-core-lite.min.js → drpy-webpack 仓库的 drpy-core-qjs.min.js
//     （pako→so zlib / gbkTool→so TextEncoder(GBK) / Buffer·WebAssembly→so 全局 /
//     砍 JS 版 pako·gb18030·polywasm·EncoderDecoder·xxhash·buffer，导出面一致）
//   ② npm cheerio → so 全局 cheerio（Lexbor C，qjs-cheerio-shim.mjs）
// 目标宿主 libquickjs_bridge.so（plugin_qjs，与 drpy2 同引擎）；产物
// assets/drpy3-qjs.bundle.js 由 DsPlayer 本体 assets/drpy3/ 覆盖装载。
// 产物已提交仓库；改了引擎/胶水/库包后重跑两步：
//   cd ../drpy-webpack && npm run esbuild   （产出 dist/drpy-core-qjs.min.js）
//   node hosts/fjs/tools/build-qjs.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// drpy-webpack 仓库 = core-lite/core-qjs 的构建源仓库（约定与本仓库同级 clone）
const CORE_QJS = path.resolve(HERE, '../../../../drpy-webpack/dist/drpy-core-qjs.min.js');
const OUT = path.resolve(HERE, '..', 'assets', 'drpy3-qjs.bundle.js');

if (!fs.existsSync(CORE_QJS)) {
    console.error(`[drpy3-qjs] 找不到库包 ${CORE_QJS}\n` +
        '请先在同级 drpy-webpack 仓库构建：cd ../drpy-webpack && npm run esbuild');
    process.exit(1);
}

// peer 库包重定向：core-lite → core-qjs（so 化变体，导出面一致，peer.js 零改动）
const coreQjsPlugin = {
    name: 'drpy3-core-qjs',
    setup(b) {
        b.onResolve({filter: /drpy-core-lite\.min\.js$/}, () => ({path: CORE_QJS}));
    },
};

// npm cheerio → so 全局 shim（htmlParser.js 唯一外部重依赖，~760KB）
const cheerioShimPlugin = {
    name: 'drpy3-cheerio-so-shim',
    setup(b) {
        b.onResolve({filter: /^cheerio$/}, () => ({path: path.join(HERE, 'qjs-cheerio-shim.mjs')}));
    },
};

await esbuild.build({
    entryPoints: [path.resolve(HERE, '..', 'glue.mjs')],
    bundle: true,
    format: 'esm',
    platform: 'browser', // 引擎本体平台中性；cheerio 已 shim 不再涉 npm 包
    target: 'es2022',
    outfile: OUT,
    legalComments: 'none',
    logLevel: 'info',
    plugins: [coreQjsPlugin, cheerioShimPlugin],
});
console.log(`[drpy3-qjs] bundle 完成: ${OUT}`);
