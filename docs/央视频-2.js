/*
@header({
  title: '央视频[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1,
})

【演示 2｜全钩子异步增强源（"完美体"，wasm 解密播放版）】
- 全部生命周期钩子显式写出；defineSource 全类型提示
- wasm：init 里预热托管加载（capabilities 可查 wasm 档位），decryptTs 走框架缓存零重复初始化
- 并发：栏目搜索 6 页 net.all 并发（原版 readColumns 串行 6 连请求）
- 缓存：栏目表 cache TTL；store 记录 init 时间
- 面向：需要精细控制、追求性能与体验的源作者
*/

import { defineSource } from 'drpy3';

const H = { 'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1' };
const WEB = 'https://tv.cctv.com';
const WASM_PATH = './cntv-wasm.cjs';

// ═══ wasm 托管加载 + 低层调用包装（load 自带缓存；init 已预热后此处近乎零成本）═══
async function cntv(ctx) {
    const mod = await ctx.lib.wasm.load(WASM_PATH);
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
        decryptNal(d, nal) {
            const a = write(nal), da = write(d);
            const ret = mod._jsdecVOD(da, a, nal.length, WEB.length);
            const out = mod.HEAP8.subarray(a, a + ret).slice();
            mod._jsfree(a); mod._jsfree(da);
            return out;
        },
        get vmpTag() { return vmpTag; },
    };
}

// TS 分片解密（完整 NAL/TS 处理逻辑与演示 3 的 lib 相同，此处省略内部细节）
async function decryptTs(ctx, ts) {
    const cnt = await cntv(ctx);
    return ctx.scratch.$dec ? ctx.scratch.$dec(cnt, ts) : ts;   // $dec 由 TS demux 模块注入（见演示 3）
}

export default defineSource({
    meta: {
        title: '央视频[官]',
        host: 'https://api.cntv.cn',
        searchable: 2, filterable: 1,
    },
    rule: {
        headers: H,
        timeout: 15000,
        class_name: '栏目大全&电视剧&综艺&纪录片&直播',
        class_url: 'column&tv&zy&jl&live',
        filter: { tv: { 年份: [{ n: '全部', v: '' }] }, zy: { 年份: [{ n: '全部', v: '' }] } },
    },

    // 初始化：轻量化（§4.6 生命周期友好）——只做鉴权级必做事，重预取一律 lazy + cache
    // （栏目表不在这里预取：category 的栏目分支自带 cache，首次浏览时才拉取，复温成本最低）
    async init(ctx, ext) {
        if (ext) ctx.rule.params = ext;
        const cap = ctx.capabilities || {};                                 // 能力表：wasm 档位/action 通道等
        ctx.log(`wasm: ${cap.wasm}, action: ${cap.action}`);                // native | polyfill | none
        await ctx.lib.wasm.load(WASM_PATH);                                 // 预热：wasm 缓存是 Runtime 级的，跨实例驱逐存活
        await ctx.store.set('lastInit', String(Date.now()));
    },

    async home(ctx) {
        const names = ctx.rule.class_name.split('&');
        const ids = ctx.rule.class_url.split('&');
        return {
            class: names.map((type_name, i) => ({
                type_id: ids[i], type_name,
                type_flag: ids[i] === 'column' ? '0-0-H' : '',
            })),
            filters: ctx.rule.filter,
        };
    },

    async homeVod(ctx) {
        const res = await ctx.lib.net.req(
            'https://api.cntv.cn/List/getVideoAlbumList?channelid=CHAL1460955853485115&serviceId=tvcctv&fc=电视剧&n=50&topv=1&p=1&sort=desc',
            { headers: H },
        );
        const list = (JSON.parse(res.content).data?.list || []).map(v => ({
            vod_id: [v.year || '', v.title, v.id || '_', v.image, 'vod', v.fc, v.sc].join('###'),
            vod_name: v.title, vod_pic: v.image, vod_remarks: v.sc,
        }));
        return { list };
    },

    // 一级：栏目大全分支——columnSearch 共 6 页【并发】拉取（原版 readColumns 是串行 for）
    async category(ctx, tid, pg, extend) {
        extend = extend || {};
        if (tid === 'column') {
            const cacheKey = 'columns';
            let columns = await ctx.cache.get(cacheKey);
            if (!columns) {
                const pages = await ctx.lib.net.all(
                    Array.from({ length: 6 }, (_, i) =>
                        ctx.lib.net.req(`https://api.cntv.cn/lanmu/columnSearch?serviceId=tvcctv&t=json&n=100&p=${i + 1}`, { headers: H })
                            .catch(() => null)),                                     // 单页失败不拖垮整批
                );
                columns = {};
                for (const res of pages)
                    for (const v of (JSON.parse(res?.content || '{}').response?.docs || [])) {
                        const lastVideo = v.lastVIDE?.videoSharedCode || '_';
                        columns[v.column_name] = {
                            vod_id: ['', v.column_name, lastVideo, v.column_logo, 'column', v.column_firstclass, v.channel_name, v.column_brief].join('###'),
                            vod_name: v.column_name, vod_pic: v.column_logo, vod_remarks: '栏目大全',
                        };
                    }
                await ctx.cache.set(cacheKey, columns, 3600);                // 栏目表 1 小时缓存
            }
            return { page: 1, pagecount: 1, limit: 30, total: 30, list: Object.values(columns) };
        }
        // 片库分支
        const res = await ctx.lib.net.req(
            `https://api.cntv.cn/List/getVideoAlbumList?channelid=CHAL1460955853485115&serviceId=tvcctv&fc=${tid}&n=30&topv=1&p=${pg}&sort=desc&year=${extend.year || ''}`,
            { headers: H },
        );
        const list = (JSON.parse(res.content).data?.list || []).map(v => ({
            vod_id: [v.year || '', v.title, v.id || '_', v.image, 'vod', v.fc, v.sc].join('###'),
            vod_name: v.title, vod_pic: v.image, vod_remarks: v.sc,
        }));
        return { page: pg, pagecount: 99, limit: 30, total: 999, list };
    },

    async detail(ctx, id) {
        const [year, title, vid, img] = id.split('###');
        const res = await ctx.lib.net.req(
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

    async search(ctx, wd, quick, pg) {
        const hit = await ctx.cache.get(`s:${wd}:${pg}`);
        if (hit) return hit;
        const res = await ctx.lib.net.req(
            `https://search.cctv.com/search.php?qtext=${encodeURIComponent(wd)}&type=video`, { headers: H });
        const list = (res.content.match(/<div class="ind01"[\s\S]*?<div class="vedio-list">/g) || [])
            .map(block => {
                const name = block.match(/id="video_playlist_xq_\d+"  title="(.*?)"/)?.[1];
                const id = block.match(/<h3 class="tit"><span lanmu1="(.*?)"/)?.[1]?.match(/\/([^\/]+?)\.s?html/)?.[1];
                if (!name || !id || id.length < 6) return null;
                return {
                    vod_id: ['', name, id, block.match(/;" src="(.*?)"/)?.[1] || '', 'vod', '', ''].join('###'),
                    vod_name: name,
                    vod_pic: block.match(/;" src="(.*?)"/)?.[1] || '',
                    vod_remarks: '片库',
                };
            })
            .filter(Boolean);
        const out = { list };
        await ctx.cache.set(`s:${wd}:${pg}`, out, 300);
        return out;
    },

    async play(ctx, flag, id) {
        const urls = [];
        if (flag === '直播') {
            const [channelId, quality] = id.split('+');
            urls.push('2000Proxy', (await ctx.lib.utils.getProxyUrl()) + '&url=' + encodeURIComponent(getLiveUrl(channelId, quality || 'td')) + '&_type=m3u8');
        } else {
            const vid = id.split('+')[0];
            const res = await ctx.lib.net.req(`https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${vid}`, { headers: H });
            const data = JSON.parse(res.content);
            const hlsUrl = data.hls_url.split('?')[0];
            const hdUrl = data.manifest.hls_h5e_url.split('?')[0].replace(/\/main([\/.])/g, '/2000$1');
            urls.push('2000Proxy', (await ctx.lib.utils.getProxyUrl()) + '&url=' + encodeURIComponent(hdUrl) + '&_type=m3u8');
            for (const name of ['850', '450']) urls.push(name, hlsUrl.replace(/\/main([\/.])/g, '/' + name + '$1'));
        }
        return { parse: 0, urls, header: { 'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 7.0)' } };
    },

    // 本地代理（契约见设计文档 §10.1，对标 drpy-node 五元组）：
    // toBytes=1 → base64 转字节（wasm 解密后的 TS）；toBytes=3 → 服务端内联流式（无需解密的流转发）
    async proxy(ctx, params) {
        const HH = { 'User-Agent': H['user-agent'], Referer: WEB };
        if ((params.url || '').includes('.ts')) {
            if (params.noEncrypt) {                                    // 无需解密的流：内联流式 pipe，
                return [200, 'video/MP2T', params.url, {}, 3];         // 壳子边收边吐，避免 base64 过桥开销
            }
            const ts = (await ctx.lib.net.req(params.url, { buffer: 1, timeout: 15000, headers: HH })).content;
            const out = await decryptTs(ctx, ts);
            return [200, 'video/MP2T', Buffer.from(out).toString('base64'), { 'Content-Type': 'video/MP2T' }, 1];
        }
        const res = await ctx.lib.net.req(params.url, { headers: HH });
        const base = params.url.slice(0, params.url.lastIndexOf('/') + 1);
        const proxyBase = await ctx.lib.utils.getProxyUrl();
        const proxied = res.content.split('\n').map(line => {
            const t = line.trim();
            if (!t || t.startsWith('#')) return line;
            const abs = /^http/.test(t) ? t : base + t;
            return proxyBase + '&url=' + encodeURIComponent(abs) + (t.includes('.m3u8') ? '&_type=m3u8' : '');
        });
        return [200, 'application/vnd.apple.mpegurl', proxied.join('\n')];
    },
})

function getLiveUrl(channelId, quality) {
    // 央视直播流地址构造（与原版一致，此处从略——演示聚焦 wasm 解密链路）
    return '';
}
