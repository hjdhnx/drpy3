// Emscripten MODULARIZE 形态的 CJS 胶水桩：模拟 CNTVModule 的低层 API 面。
// 用途：验证 lib.wasm.load 的托管语义（胶水识别/垫片环境/就绪等待/按路径缓存）——金标准 B。
var CNTVModule = (function () {
    var heap = new Uint8Array(1 << 20);
    var bump = 16;
    var vmp = 0;
    var wasmMemory = {buffer: heap.buffer};

    function jmalloc(n) {
        var a = bump;
        bump += (n + 15) & ~15;
        return a;
    }

    function jfree(a) { /* 桩不做真实回收 */ }

    function readStr(a) {
        var s = '';
        while (heap[a] !== 0) s += String.fromCharCode(heap[a++]);
        return s;
    }

    function writeStrAt(a, s) {
        for (var i = 0; i < s.length; i++) heap[a + i] = s.charCodeAt(i) & 0xff;
        heap[a + s.length] = 0;
    }

    var Module = {
        HEAP8: heap,
        wasmMemory: wasmMemory,
        _jsmalloc: jmalloc,
        _jsfree: jfree,
        _CNTV_InitPlayer: function (a) {
            Module.__date = readStr(a);
            return 0;
        },
        _CNTV_UnInitPlayer: function (a) {
            Module.__uninit = true;
            return 0;
        },
        _CNTV_UpdatePlayer: function (a) {
            vmp = (vmp + 1) >>> 0;
            return vmp & 0xffff;
        },
        _CNTV_jsdecVOD0: function () {
            return 0;
        },
        _jsdecVOD: function (dA, a, len, webLen) {
            var k = readStr(dA).length & 0xff;
            for (var i = 0; i < len; i++) heap[a + i] = (heap[a + i] ^ k) & 0xff;
            return len;
        },
    };
    // MODULARIZE 工厂：返回函数，调用后异步触发 onRuntimeInitialized（模拟真实 emscripten 就绪时序）。
    // 真实 emscripten 的 Module 多为单例对象——直接返回 Module 本体（保证低层状态跨调用可见）。
    return function CNTVModule(ModuleArg) {
        ModuleArg = ModuleArg || {};
        Promise.resolve().then(function () {
            Module.ready = true;
            if (typeof ModuleArg.onRuntimeInitialized === 'function') ModuleArg.onRuntimeInitialized();
        });
        return Module;
    };
})();
if (typeof exports === 'object' && typeof module === 'object') module.exports = CNTVModule;
else if (typeof define === 'function' && define.amd) define([], function () {
    return CNTVModule;
});
