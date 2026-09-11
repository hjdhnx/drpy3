/*
@header({
  title: '央视频[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1,
})

【演示 3｜模块化工程源（wasm 解密播放版）】—— 源目录形态（§8 相对路径模块）
推荐目录结构：
  央视频-3.js            ← 主文件：只做组装与生命周期（本文件，~70 行）
  lib/cntv-crypto.js     ← 解密模块：wasm 托管 + TS 解复用 + H.264 NAL 解密（见配套文件）
  lib/cntv-wasm.cjs      ← Emscripten 胶水模块资产（CNTVModule，随源分发）
亮点：import cntvWasm from './lib/cntv-wasm.cjs?bytes' —— 资产以字节导入，
lib.wasm.load 自动识别 Emscripten 胶水并提供环境垫片（源里零单例管理代码）。
面向：算法复杂、需要独立测试解密模块的团队/高阶作者。
*/

import { defineSource } from 'drpy3';
import { decryptTs, rewriteM3u8 } from './lib/cntv-crypto.js';
import cntvWasm from './lib/cntv-wasm.cjs?bytes';

const H = { 'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1' };
const WEB = 'https://tv.cctv.com';

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

    async init(ctx) {
        // 预热 wasm：emscripten 胶水的识别、垫片环境、运行时就绪等待全部由框架托管
        await ctx.lib.wasm.load(cntvWasm);
        ctx.log('cntv wasm ready');
    },

    async category(ctx, tid, pg, extend) {
        extend = extend || {};
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
            `https://pcweb.api.cntv.cn/episodesList?vid=${vid}&serviceId=tvcctv`, { headers: H });
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

    async play(ctx, flag, id) {
        const vid = id.split('+')[0];
        const res = await ctx.lib.net.req(`https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${vid}`, { headers: H });
        const data = JSON.parse(res.content);
        const hlsUrl = data.hls_url.split('?')[0];
        const hdUrl = data.manifest.hls_h5e_url.split('?')[0].replace(/\/main([\/.])/g, '/2000$1');
        const proxyBase = await ctx.lib.utils.getProxyUrl();
        return {
            parse: 0,
            urls: [
                '2000Proxy', proxyBase + '&url=' + encodeURIComponent(hdUrl) + '&_type=m3u8',
                '850', hlsUrl.replace(/\/main([\/.])/g, '/850$1'),
                '450', hlsUrl.replace(/\/main([\/.])/g, '/450$1'),
            ],
            header: { 'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 7.0)' },
        };
    },

    // 本地代理：解密与 m3u8 重写全部在模块里，主文件只传 ctx 和参数
    async proxy(ctx, params) {
        const HH = { 'User-Agent': H['user-agent'], Referer: WEB };
        if ((params.url || '').includes('.ts')) {
            const ts = (await ctx.lib.net.req(params.url, { buffer: 1, timeout: 15000, headers: HH })).content;
            const out = await decryptTs(ctx, cntvWasm, ts);
            return [200, 'video/MP2T', Buffer.from(out).toString('base64'), { 'Content-Type': 'video/MP2T' }, 1];
        }
        const res = await ctx.lib.net.req(params.url, { headers: HH });
        const proxyBase = await ctx.lib.utils.getProxyUrl();
        return [200, 'application/vnd.apple.mpegurl', rewriteM3u8(res.content, params.url, proxyBase)];
    },
})
