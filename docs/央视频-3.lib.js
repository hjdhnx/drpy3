/*
【演示 3 配套模块】真实目录结构中本文件为 ./lib/cntv-crypto.js
- 解密模块：wasm 托管（lib.wasm.load）+ TS 解复用 + H.264 NAL 解密 + m3u8 重写
- 模块无全局：标准库能力一律经 ctx 传入；可独立单测（mock ctx 即可）
- 与 drpyS 原版 _lib.cntvParse.js 的对照：
  * 原版：手写 initWasmModule/wasmInitPromise/onRuntimeInitialized 单例管理 + require 加载
  * 本版：await ctx.lib.wasm.load(wasmBytes) 一行——垫片环境/就绪等待/实例缓存框架全托管
*/

// ═══ wasm 托管加载（lib.wasm.load 按 bytes 哈希缓存；emscripten 胶水自动识别并垫片）═══
async function cntv(ctx, wasmBytes) {
    const mod = await ctx.lib.wasm.load(wasmBytes);
    let vmpTag = '';
    const write = (s) => {
        const addr = mod._jsmalloc(s.length + 2048);
        mod.HEAP8.set(typeof s === 'string' ? Array.from(s, c => c.charCodeAt(0)) : s, addr);
        return addr;
    };
    return {
        initPlayer: (d) => { const a = write(d); mod._CNTV_InitPlayer(a); mod._jsfree(a); },
        unInitPlayer: (d) => { const a = write(d); mod._CNTV_UnInitPlayer(a); mod._jsfree(a); },
        updatePlayer(d) {
            const a = write(d);
            vmpTag = mod._CNTV_UpdatePlayer(a).toString(16).padStart(8, '0');
            mod._jsfree(a);
        },
        // NAL 解密：vmpTag 的 0-7 位分别触发 _CNTV_jsdecVOD7..0，最后走 _jsdecVOD 主解密
        decryptNal(d, nal) {
            const a = write(nal), da = write(d);
            const FNS = ['_CNTV_jsdecVOD0', '_CNTV_jsdecVOD1', '_CNTV_jsdecVOD2', '_CNTV_jsdecVOD3',
                '_CNTV_jsdecVOD4', '_CNTV_jsdecVOD5', '_CNTV_jsdecVOD6', '_CNTV_jsdecVOD7'];
            for (let i = 0; i < vmpTag.length; i++)
                if (i < 8 && vmpTag[i] !== '0') mod[FNS[i]](da, a, nal.length, WEB.length);
            const ret = mod._jsdecVOD(da, a, nal.length, WEB.length);
            const out = mod.HEAP8.subarray(a, a + ret).slice();
            mod._jsfree(a); mod._jsfree(da);
            return out;
        },
    };
}

const WEB = 'https://tv.cctv.com';
const TS_PACKET = 188;

// 动态检测视频 PID（视频流通常是包数最多的 PID）
function detectVideoPid(ts) {
    const counts = {};
    for (let i = 0; i + TS_PACKET <= ts.length; i += TS_PACKET) {
        if (ts[i] !== 0x47) continue;
        const pid = ((ts[i + 1] & 0x1f) << 8) | ts[i + 2];
        counts[pid] = (counts[pid] || 0) + 1;
    }
    let maxPid = 256, maxN = 0;
    for (const pid in counts)
        if (+pid !== 0 && +pid < 4095 && counts[pid] > maxN) { maxN = counts[pid]; maxPid = +pid; }
    return maxPid;
}

// TS 解复用：提取视频 PID 的 H.264 载荷
function extractH264(ts, videoPid) {
    const chunks = [];
    let inPES = false;
    for (let i = 0; i + TS_PACKET <= ts.length; i += TS_PACKET) {
        if (ts[i] !== 0x47) continue;
        const pid = ((ts[i + 1] & 0x1f) << 8) | ts[i + 2];
        if (pid !== videoPid) continue;
        const payloadStart = (ts[i + 1] & 0x40) !== 0;
        let off = 4 + ((ts[i + 3] & 0x20) ? ts[i + 4] + 1 : 0);
        if (!(ts[i + 3] & 0x10) || off >= TS_PACKET) continue;
        let head = 0;
        if (payloadStart) { head = 9 + (ts[i + off + 8] || 0); inPES = true; }
        else if (!inPES) continue;
        chunks.push(ts.subarray(i + off + Math.min(head, TS_PACKET - off), i + TS_PACKET));
    }
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const h264 = new Uint8Array(total);
    let pos = 0;
    for (const c of chunks) { h264.set(c, pos); pos += c.length; }
    return h264;
}

// H.264 NAL 解密（原地）：00 00 01 起始码切 NAL；type25 控制开关；type1/5 解密回写
function decryptH264(cnt, h264) {
    const nals = [];
    for (let i = 0; i < h264.length - 3; i++) {
        if (h264[i] === 0 && h264[i + 1] === 0 && h264[i + 2] === 1) {
            const start = i + 3;
            let end = h264.length;
            for (let j = start; j < h264.length - 2; j++)
                if (h264[j] === 0 && h264[j + 1] === 0 && (h264[j + 2] === 1 || (h264[j + 2] === 0 && h264[j + 3] === 1))) { end = j; break; }
            nals.push({ start, end, type: h264[start] & 0x1f });
            i = end - 1;
        }
    }
    const dateStr = String(Date.now());
    const hasType25 = nals.some(n => n.type === 25);
    let should = !hasType25;
    cnt.initPlayer(dateStr);
    for (const n of nals) {
        cnt.updatePlayer(dateStr);
        const nal = h264.subarray(n.start - 1, n.end);              // 含 header
        if (n.type === 25) should = nal[1] === 1;
        else if ((n.type === 1 || n.type === 5) && should) {
            const dec = cnt.decryptNal(dateStr, nal);
            const keep = Math.min(dec.length, n.end - n.start);
            h264.set(dec.subarray(0, keep), n.start - 1);
        }
    }
    cnt.unInitPlayer(dateStr);
    return h264;
}

// 解密一个 TS 分片（主入口）
export async function decryptTs(ctx, wasmBytes, ts) {
    const cnt = await cntv(ctx, wasmBytes);
    const videoPid = detectVideoPid(ts);
    const h264 = extractH264(ts, videoPid);
    if (!h264.length) return ts;                                    // 无视频流：原样返回
    decryptH264(cnt, h264);
    // 简化：此处省略第三遍回写（把解密后的 h264 按 PES 位置写回 TS 包），
    // 完整实现与 drpyS 原版 _lib.cntvParse.js 的 Parse_TS 第三遍扫描一致
    return ts;
}

// m3u8 重写：TS/子 m3u8 分片地址全部改写回本地代理
export function rewriteM3u8(text, m3u8Url, proxyBase) {
    const base = m3u8Url.slice(0, m3u8Url.lastIndexOf('/') + 1);
    const origin = (() => { try { return new URL(m3u8Url).origin; } catch { return ''; } })();
    return text.split('\n').map(line => {
        const t = line.trim();
        if (!t || t.startsWith('#')) return line;
        const abs = /^http/.test(t) ? t : (t.startsWith('/') && origin ? origin + t : base + t);
        return proxyBase + '&url=' + encodeURIComponent(abs) + (t.includes('.m3u8') ? '&_type=m3u8' : '');
    }).join('\n');
}
