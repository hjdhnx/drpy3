#!/usr/bin/env node
// 构建 drpy3 主产物（§1 产物清单），一次产出两个形态：
//   dist/drpy3.js        可读可维护单文件（esbuild 非压缩，原始标识符，drpy2.js 同款用法）
//   dist/drpy3.esm.min.js 压缩单文件（分发/内嵌用）
// ⚠️ core-lite 必须保持 peer 引用（external，不内联）——jinja 模板编译器依赖原 webpack bundle
// 的 script-loader 作用域语义，esbuild 内联会破坏之（仓库历史 5063ef5"esbuild打包最终失败告终"、
// e18961a 事故同理）。两个产物与 dist/drpy-core-lite.min.js 同目录分发（drpy2.js 双文件同款）。
// 源码唯一真相源是 src/drpy3/**——本脚本只是打包器，勿手改产物，改源码后重新构建。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const peerExternalPlugin = {
    name: 'drpy3-peer-external',
    setup(b) {
        // 库全局（CryptoJS/jinja/模板/pako/gbkTool…）走 peer：产物内保留对同目录 peer 包装的相对引用
        b.onResolve({filter: /drpy-core-lite\.min\.js$/}, () => ({path: './drpy3-peer.js', external: true}));
    },
};

/**
 * 生成 peer 包装链（与 src 树的 native-globals→core-lite→peer 三层求值序完全同构）：
 *   drpy3-globals-capture.js  无依赖快照+过滤器+fromBase64 垫片（进程内最先求值）
 *   drpy3-peer.js             先引 capture、再引 core-lite、body 恢复原生全局并再导出
 * 为什么必须三层：ESM 的静态 import 恒先于本模块体求值——若产物直接外链 core-lite，
 * polywasm/node-fetch 的全局污染会先于任何快照发生，且不可逆（宿主 undici 等会崩）。
 */
function emitPeerFiles() {
    const dist = path.join(ROOT, 'dist');
    fs.copyFileSync(path.join(ROOT, 'src', 'drpy3', 'lib', 'native-globals.js'), path.join(dist, 'drpy3-globals-capture.js'));
    fs.writeFileSync(path.join(dist, 'drpy3-peer.js'), `import './drpy3-globals-capture.js';
export * from './drpy-core-lite.min.js';
import {nativeWasm, nativeFetch, nativeTextEncoder, nativeConsoleError} from './drpy3-globals-capture.js';
if (nativeWasm && globalThis.WebAssembly !== nativeWasm) globalThis.WebAssembly = nativeWasm;
if (nativeFetch && globalThis.fetch !== nativeFetch) globalThis.fetch = nativeFetch;
if (nativeTextEncoder && globalThis.TextEncoder !== nativeTextEncoder) globalThis.TextEncoder = nativeTextEncoder;
console.error = nativeConsoleError;
`);
}

const BANNER = `/*
 * drpy3.js —— drpy3 引擎单文件形态（可读版，drpy2.js 同款用法）
 *
 * ⚠️ 本文件由 cli/build-drpy3.mjs 从 src/drpy3/** 打包生成——请勿手改；维护请改源码后重新构建：
 *     npm run build:drpy3
 *
 * 用法（与 drpy2.js 双文件形态一致，引擎与库包同目录分发）：
 *   你的目录/
 *   ├── drpy3.js                    ← 本文件
 *   ├── drpy-core-lite.min.js       ← 库全局包（CryptoJS/jinja/模板/pako/gbkTool…，peer 引用）
 *   ├── drpy3-peer.js / drpy3-globals-capture.js ← peer 装载链（原生全局守卫，构建时生成）
 *
 *   import { Runtime } from './drpy3.js';
 *   const rt = new Runtime({ req, pdfh, pdfa, pd });   // HostEnv 注入，详见设计文档 §7
 *   const src = await rt.load(sourceCode, { key: '_x' });
 *   const home = await src.home('');
 *
 * 设计唯一真相源：docs/drpy3-设计文档.md；执行手册：docs/drpy3-实现任务书.md
 * 模块索引（对应 src/drpy3/ 下同名源文件）：
 *   runtime.js   Runtime：HostEnv 校验/use()/capabilities
 *   lifecycle.js Source 实例与生命周期治理（LRU/signature 热更/快照复温）
 *   context.js   两层上下文的调用态（ctx 构造与快捷别名投影）
 *   lib/net.js lib/parse.js lib/crypto.js lib/text.js lib/utils.js lib/store.js lib/cache.js lib/wasm.js
 *   rules/parseRule.js rules/jsFragment.js rules/defaults.js（声明式默认引擎）
 *   modules/loader.js（模式 A/B/C 源装载）compat/drpy2.js（load2x 兼容层）errors.js（工程化报错）
 */
`;

emitPeerFiles();

await Promise.all([
    // 可读单文件：drpy2.js 同款用法
    esbuild.build({
        entryPoints: [path.join(ROOT, 'src', 'drpy3', 'index.js')],
        bundle: true,
        platform: 'neutral',
        format: 'esm',
        target: 'es2020',
        outfile: path.join(ROOT, 'dist', 'drpy3.js'),
        minify: false,
        banner: {js: BANNER},
        logLevel: 'silent',
        plugins: [peerExternalPlugin],
    }),
    // 压缩单文件
    esbuild.build({
        entryPoints: [path.join(ROOT, 'src', 'drpy3', 'index.js')],
        bundle: true,
        platform: 'neutral',
        format: 'esm',
        target: 'es2020',
        outfile: path.join(ROOT, 'dist', 'drpy3.esm.min.js'),
        minify: true,
        logLevel: 'silent',
        plugins: [peerExternalPlugin],
    }),
]);
console.log('[drpy3] 构建完成: dist/drpy3.js（可读单文件）+ dist/drpy3.esm.min.js（压缩），peer 引用 ./drpy-core-lite.min.js');
