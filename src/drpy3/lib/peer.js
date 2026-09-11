// peer 库装载守卫 + 再导出：drpy3 对 dist/drpy-core-lite.min.js 的唯一入口。
//
// ⚠️ 为什么需要守卫：core-lite 内嵌的 polywasm 会无条件覆盖 globalThis.WebAssembly，
// 自带的 node-fetch polyfill 会覆盖 globalThis.fetch。原生引擎（Node/quickjs-ng）的全局被
// JS 软解释顶替后，宿主自身底座会崩（Node 上 undici 首次编译 llhttp wasm 即 CompileError）。
// native-globals.js（无依赖，进程内最先求值）快照原生引用，core-lite 装载后在此恢复；
// polywasm 仍可经本模块导出的 WebAssembly 使用（宿主无关兜底）。
// 这不是"全局注入回归"（附录 A 否决的是给源代码挂全局名）——只是集成防护。
import {nativeWasm, nativeFetch, nativeTextEncoder, nativeConsoleError} from './native-globals.js';

export * from '../../../dist/drpy-core-lite.min.js';

// core-lite 求值完成：恢复原生全局 + script-loader 噪音过滤器（见 native-globals.js）
if (nativeWasm && globalThis.WebAssembly !== nativeWasm) globalThis.WebAssembly = nativeWasm;
if (nativeFetch && globalThis.fetch !== nativeFetch) globalThis.fetch = nativeFetch;
if (nativeTextEncoder && globalThis.TextEncoder !== nativeTextEncoder) globalThis.TextEncoder = nativeTextEncoder;
console.error = nativeConsoleError;
