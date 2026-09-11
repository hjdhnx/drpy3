/*
@header({
  title: '央视频[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1,
})

【演示 1｜零样板 · 纯声明式优先（wasm 解密播放版）】
- default export 直接是 rule 对象，零包装、零 import（辅助函数写在同文件顶层即可）
- wasm 关键点：`ctx.lib.wasm.load('./cntv-wasm.cjs')` 一行完成托管——
  框架自动提供 emscripten 环境垫片、等待运行时就绪、按路径缓存实例；
  drpyS 原版手写的 initWasmModule/wasmInitPromise/onRuntimeInitialized 单例管理全部不再需要
- home 由 class_name/class_url + filter（原生 JSON，无需 gzip）声明式生成，无钩子
- 二进制契约：req buffer:1 拿原始字节（Uint8Array）；proxy 五元组契约（toBytes=1 二进制，见设计文档 §10.1）
*/

const H = { 'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1' };
const WEB = 'https://tv.cctv.com';

// wasm 解密包装：加载走框架托管，低层调用语义与原 CNTVModule 完全一致（jsmalloc/HEAP8/_CNTV_*）
async function cntv(ctx) {
    const mod = await ctx.lib.wasm.load('./cntv-wasm.cjs');   // ← 唯一的 wasm 入口：垫片+就绪等待+路径缓存全由框架负责
    let vmpTag = '';
    const writeStr = (s) => {
        const addr = mod._jsmalloc(s.length + 2048);
        mod.HEAP8.set(Array.from(s, ch => ch.charCodeAt(0)), addr);
        return addr;
    };
    const call = (name, dateStr) => {
        const a = writeStr(dateStr);
        const ret = mod['_CNTV_' + name](a);
        mod._jsfree(a);
        return ret;
    };
    return {
        initPlayer: (d) => call('InitPlayer', d),
        unInitPlayer: (d) => call('UnInitPlayer', d),
        updatePlayer(d) {
            const a = writeStr(d);
            vmpTag = mod._CNTV_UpdatePlayer(a).toString(16).padStart(8, '0');
            mod._jsfree(a);
        },
        decryptNal(dateStr, nal) {                            // 按 vmpTag 位选择 _CNTV_jsdecVOD* 解密函数
            const addr = writeStr2(mod, nal);
            const dAddr = writeStr2(mod, dateStr);
            const ret = mod._jsdecVOD(dAddr, addr, nal.length, WEB.length);
            const out = mod.HEAP8.subarray(addr, addr + ret).slice();
            mod._jsfree(addr);
            mod._jsfree(dAddr);
            return out;
        },
        get vmpTag() { return vmpTag; },
    };
}
function writeStr2(mod, s) {
    const addr = mod._jsmalloc(s.length + 16);
    mod.HEAP8.set(typeof s === 'string' ? Array.from(s, ch => ch.charCodeAt(0)) : s, addr);
    return addr;
}

// TS 分片解密：188 字节包 demux → 视频PES 拼接 → H.264 NAL 逐个解密 → 回写
// （简化示意：省略 PID 动态检测与 PES 头变长细节；完整算法见 央视频-3.lib.js）
async function decryptTs(ctx, ts) {
    const cnt = await cntv(ctx);
    const dateStr = String(Date.now());
    cnt.initPlayer(dateStr);
    // ... 逐 188 字节包提取视频流 PES、按 00 00 01 起始码切 NAL：
    //     type 25 → shouldDecrypt 开关；type 1/5 → cnt.decryptNal(dateStr, nal) 后回写原位
    const out = ts;                                           // 解密在原 buffer 上原地完成
    cnt.updatePlayer(dateStr);
    cnt.unInitPlayer(dateStr);
    return out;
}

export default {
    meta: {
        title: '央视频[官]',
        host: 'https://api.cntv.cn',
        searchable: 2, filterable: 1,
    },
    rule: {
        headers: H,
        timeout: 15000,
        class_name: '栏目大全&电视剧&综艺&纪录片&直播',           // 声明式分类
        class_url: 'column&tv&zy&jl&live',
        filter: { tv: { 年份: [{ n: '全部', v: '' }] }, zy: { 年份: [{ n: '全部', v: '' }] } },   // 原生 JSON 筛选
    },

    // 一级：片库 API（栏目/直播分支同理，此处展示最常规路径）
    async category(ctx, tid, pg, extend) {
        extend = extend || {};
        const { req } = ctx.lib.net;                        // 解构惯用法（§4.5）：之后与 drpy2 写法一致
        const res = await req(
            `https://api.cntv.cn/List/getVideoAlbumList?channelid=CHAL1460955853485115&serviceId=tvcctv&fc=${tid}&n=30&topv=1&p=${pg}&sort=desc&year=${extend.year || ''}`,
            { headers: H },
        );
        const list = (JSON.parse(res.content).data?.list || []).map(v => ({
            vod_id: [v.year || '', v.title, v.id || '_', v.image, 'vod', v.fc, v.sc].join('###'),
            vod_name: v.title,
            vod_pic: v.image,
            vod_remarks: v.sc,
        }));
        return { page: pg, pagecount: 99, limit: 30, total: 999, list };
    },

    // 二级：guid 反解 → 选集接口 → 线路列表
    async detail(ctx, id) {
        const [year, title, vid, img] = id.split('###');
        const { req } = ctx.lib.net;
        const res = await req(
            `https://pcweb.api.cntv.cn/episodesList?vid=${vid}&serviceId=tvcctv`,
            { headers: H },
        );
        const eps = (JSON.parse(res.content).list || [])
            .filter(it => it.url)
            .map((it, i) => `第${i + 1}集$${it.url}`);
        return {
            list: [{
                vod_id: id, vod_name: title, vod_pic: img, vod_year: year,
                vod_play_from: 'cntv',
                vod_play_url: eps.join('#') || `正片$${vid}`,
            }],
        };
    },

    // 播放：高清 2000 流走本地代理（wasm 解密），850/450 普通流直连
    async play(ctx, flag, id) {
        const { req } = ctx.lib.net;
        const proxyBase = await ctx.getProxyUrl();          // ctx 顶层快捷别名（§4.5）
        const urls = [];
        if (flag === '直播') {
            const [channelId, quality] = id.split('+');
            urls.push('2000Proxy', proxyBase + '&url=' + encodeURIComponent(getLiveUrl(channelId, quality || 'td')) + '&_type=m3u8');
        } else {
            const vid = id.split('+')[0];
            const res = await req(`https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${vid}`, { headers: H });
            const data = JSON.parse(res.content);
            const hlsUrl = data.hls_url.split('?')[0];
            const hdUrl = data.manifest.hls_h5e_url.split('?')[0].replace(/\/main([\/.])/g, '/2000$1');
            urls.push('2000Proxy', proxyBase + '&url=' + encodeURIComponent(hdUrl) + '&_type=m3u8');
            for (const name of ['850', '450']) urls.push(name, hlsUrl.replace(/\/main([\/.])/g, '/' + name + '$1'));
        }
        return { parse: 0, urls, header: { 'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 7.0)' } };
    },

    // 本地代理：m3u8 重写 + TS 分片 wasm 解密（五元组契约，toBytes=1 见 §10.1）
    async proxy(ctx, params) {
        const { req } = ctx.lib.net;
        const HH = { 'User-Agent': H['user-agent'], Referer: WEB };
        if ((params.url || '').includes('.ts')) {
            const ts = (await req(params.url, { buffer: 1, timeout: 15000, headers: HH })).content;
            const out = await decryptTs(ctx, ts);                          // ← wasm 解密
            return [200, 'video/MP2T', Buffer.from(out).toString('base64'), { 'Content-Type': 'video/MP2T' }, 1];
        }
        // m3u8：分片地址改写回代理地址（相对路径基于当前 m3u8 补全）
        const res = await req(params.url, { headers: HH });
        const base = params.url.slice(0, params.url.lastIndexOf('/') + 1);
        const proxyBase = await ctx.getProxyUrl();
        const proxied = res.content.split('\n').map(line => {
            const t = line.trim();
            if (!t || t.startsWith('#')) return line;
            const abs = /^http/.test(t) ? t : base + t;
            return proxyBase + '&url=' + encodeURIComponent(abs) + (t.includes('.m3u8') ? '&_type=m3u8' : '');
        });
        return [200, 'application/vnd.apple.mpegurl', proxied.join('\n')];
    },
}

function getLiveUrl(channelId, quality) {
    // 央视直播流地址构造（与原版一致，此处从略——演示聚焦 wasm 解密链路）
    return '';
}
