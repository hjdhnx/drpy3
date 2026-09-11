import './drpy3-globals-capture.js';
export * from './drpy-core-lite.min.js';
import {nativeWasm, nativeFetch, nativeTextEncoder, nativeConsoleError} from './drpy3-globals-capture.js';
if (nativeWasm && globalThis.WebAssembly !== nativeWasm) globalThis.WebAssembly = nativeWasm;
if (nativeFetch && globalThis.fetch !== nativeFetch) globalThis.fetch = nativeFetch;
if (nativeTextEncoder && globalThis.TextEncoder !== nativeTextEncoder) globalThis.TextEncoder = nativeTextEncoder;
console.error = nativeConsoleError;
