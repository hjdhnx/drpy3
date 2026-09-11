/*
@header({
  title: '百忙无果[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1, quickSearch: 0,
})

【演示 2｜全钩子异步增强源（"完美体"）】
- defineSource 全类型提示；全部生命周期钩子显式写出
- 展示 drpy3 的完整能力面：
  * init：store 持久化、crypto.ready() 预热 wasm
  * home/category：手动声明 + parseRule 复用声明式规则（声明式与代码混用）
  * detail：详情页与后续选集页 net.all 并发（drpy2 原版 for 串行）
  * search：cache TTL 缓存，重复搜索零网络
  * play：utils 工具函数判定 parse/jx
- 面向：需要精细控制、追求性能与体验的源作者
*/

import { defineSource } from 'drpy3';

const WEB = 'https://www.mgtv.com';

export default defineSource({
    meta: {
        title: '百忙无果[官]',
        host: 'https://pianku.api.%6d%67%74%76.com',
        searchable: 2, filterable: 1, quickSearch: 0, multi: 1,
    },
    rule: {
        searchUrl: 'https://mobileso.bz.%6d%67%74%76.com/msite/search/v2?q=**&pn=fypage&pc=10',
        detailUrl: 'https://pcweb.api.mgtv.com/episode/list?page=1&size=50&video_id=fyid',
        url: '/rider/list/pcweb/v3?platform=pcweb&channelId=fyclass&pn=fypage&pc=80&hudong=1&_support=10000000&kind=a1&area=a1',
        filter_url: 'year={{fl.year or "all"}}&sort={{fl.sort or "all"}}&chargeInfo={{fl.chargeInfo or "all"}}',
        headers: { 'User-Agent': 'PC_UA' },
        timeout: 5000,
        class_name: '电视剧&电影&综艺&动漫&纪录片&教育&少儿',
        class_url: '2&3&1&50&51&115&10',
        filter: 'H4sIAAAAAAAAA+2XvUrDUBSA3+XOHc65adraN+jm5CIdYok/GFupWiilIBalIFYoIh1EBxEKIih0MOZ1msS+hbc1yTni4mKms6XfIbnnC/mG9hSq6mZP7btdVVWNXae949aa2y1VUE3nwDVsHkw+Z378FoT3l4Z2HO/EXd3SNMPwfLoYTJfY/HA8T/UL6eDK3JUMtjDjnb3DFOoMbtTW45tpOHxPR1Y2Sk4/86PxSzotqn59Of/e+ajVPqZto9E4/Lj+tWd0dxrdviYPaNA6hseD9MEN2ih+eJr7o8XzJBxepNOfx3Zdp03Hhv5sHjz+/fVo0MUEry4Zt4hbnGvimnMkjpwDcWAc1zJuLhmvEK9wXiZe5rxEvMS5TdzmnHyR+yL5IvdF8kXui+SL3BfJF7kvkC9wXyBf4L5AvsB9gXyB+wL5AvcF8oXVl1MvKC2pSWqSWh6pWZKapCap5ZGaDdKatCat5dKa/FuT1qS1XFpD80YkNolNYvv32PpfCLkneIcUAAA=',
        一级: 'json:data.hitDocs;title;img;updateInfo||rightCorner.text;playPartId',
    },

    // 初始化：换源参数、预热、记录
    async init(ctx, ext) {
        if (ext) ctx.rule.params = ext;
        // 有状态源示例（§4.4/§4.6）：需要 cookie 的源在这里预处理——
        // if (!ctx.resumed) {                                     // 复温时 headers 已快照回填，免重登
        //     const res = await ctx.req(loginUrl);
        //     ctx.headers.Cookie = parseCookie(res.headers);      // 实例基线：后续所有请求自动携带
        // }
        // await ctx.store.set('cookie', ctx.headers.Cookie);      // 可选：持久化，跨重启免重登
        await ctx.lib.crypto.ready();                 // wasm 就绪（原生 wasm 引擎上近乎零成本）
        await ctx.store.set('lastInit', String(Date.now()));
        this.initedAt = Date.now();                   // 实例自定义字段：有状态源的归宿（§4.4），跨调用可读
        ctx.log(`init ok: ${ctx.key}`);
    },

    async home(ctx) {
        const names = ctx.rule.class_name.split('&');
        const ids = ctx.rule.class_url.split('&');
        return {
            class: names.map((type_name, i) => ({ type_id: ids[i], type_name })),
            filters: JSON.parse(ctx.lib.crypto.ungzip(ctx.rule.filter)),   // gzip 筛选表解压
        };
    },

    // 声明式规则不必放弃——钩子里可以直接复用 rule 字符串走内置解析器
    async category(ctx, tid, pg, extend) {
        ctx.url = ctx.rule.url
            .replaceAll('fyclass', tid)
            .replaceAll('fypage', pg)
            + '&' + ctx.lib.parse.jinja2(ctx.rule.filter_url, { fl: extend || {}, fyclass: tid });
        const list = await ctx.lib.parse.parseRule(ctx.rule.一级, ctx);
        return {
            page: pg, pagecount: 999, limit: 20, total: 999,
            list: list.map(it => ({ ...it, vod_id: tid + '$' + it.vod_id })),   // 带分类前缀，detail 可还原
        };
    },

    async search(ctx, wd, quick, pg) {
        const cacheKey = `s:${wd}:${pg}`;
        const hit = await ctx.cache.get(cacheKey);            // TTL 缓存：重复搜索零网络
        if (hit) return hit;

        const res = await ctx.lib.net.request(
            ctx.rule.searchUrl.replaceAll('**', wd).replaceAll('fypage', pg),
            { headers: { 'User-Agent': 'MOBILE_UA', Referer: WEB } },
        );
        const list = [];
        for (const data of (JSON.parse(res.content).data.contents || [])) {
            if (data.type !== 'media') continue;
            const item = data.data[0];
            if (item.source !== 'imgo') continue;
            list.push({
                vod_id: (item.rpt.match(/idx=(.*?)&/)?.[1] || '') + '$' + item.url.match(/.*\/(.*?)\.html/)[1],
                vod_name: item.title.replace(/<B>|<\/B>/g, ''),
                vod_pic: item.img || '',
                vod_remarks: (item.desc || []).join(','),
            });
        }
        const out = { list };
        await ctx.cache.set(cacheKey, out, 300);              // 5 分钟
        return out;
    },

    async detail(ctx, id) {
        ctx.fetchParams.headers.Referer = WEB;
        ctx.fetchParams.headers['User-Agent'] = 'MOBILE_UA';
        const { req, all } = ctx.lib.net;
        const { pdfh, pd } = ctx.lib.parse;
        const MOBILE_UA = ctx.lib.utils.UA.MOBILE_UA;

        // 第一步：选集接口第 1 页（拿 total_page 与选集）
        const epUrl = ctx.rule.detailUrl.replaceAll('fyid', id.split('$').pop());
        const ep = JSON.parse((await req(epUrl)).content);
        const first = ep.data.list[0] ?? ep.data.series[0];

        // 第二步：详情页 + 选集第 2..N 页【并发】—— drpy2 原版这里是 for 串行
        let pageUrl = WEB + first.url;
        const [page, ...rest] = await all([
            req(pageUrl, { headers: { 'User-Agent': MOBILE_UA } }),
            ...Array.from({ length: (ep.data.total_page || 1) - 1 }, (_, i) =>
                req(epUrl.replace('page=1', 'page=' + (i + 2)), { headers: { Referer: WEB } })),
        ]);
        let html = page.content;
        if (html.includes('window.location =')) {
            pageUrl = pdfh(html, 'meta[http-equiv=refresh]&&content').split('url=')[1];
            html = (await req(pageUrl)).content;
        }

        // 组装：详情字段（jsoup 选择器）
        const vod = {
            vod_id: id,
            vod_name: pdfh(html, '.vt-txt&&Text'),
            type_name: pdfh(html, 'p:eq(0)&&Text').slice(0, 6),
            vod_area: pdfh(html, 'p:eq(1)&&Text'),
            vod_actor: pdfh(html, 'p:eq(4)&&Text').slice(0, 25),
            vod_director: pdfh(html, 'p:eq(3)&&Text'),
            vod_pic: pd(html, '.video-img&&img&&src', pageUrl),
            vod_content: (pdfh(html, '.desc&&Text').split('简介：')[1] || '').trim(),
            vod_remarks: '已完结',
            vod_play_from: 'mgtv',
        };
        if (!vod.vod_name) vod.vod_name = vod.type_name;

        const eps = [...ep.data.list];
        for (const p of rest)
            for (const it of (JSON.parse(p.content).data.list || []))
                if (it.isIntact == '1') eps.push(it);
        vod.vod_play_url = eps.map(it => it.t4 + '$' + WEB + it.url).join('#');

        await ctx.store.set('lastDetail', id);        // 实例态持久 KV：跨调用记录（如"上次看到"）
        return { list: [vod] };
    },

    async play(ctx, flag, id) {
        return {
            parse: /^(ftp|magnet|thunder|ws):|^push:/.test(id) ? 0 : 1,
            jx: !/\.(m3u8|mp4|m4a)$/.test(id.split('?')[0]) && ctx.lib.utils.是否正版(id) ? 1 : 0,
            url: id,
            flag,
        };
    },

    // 本地代理出口：壳子把本地端口 ?do=js&... 的 query 交给这里，返回 [status, contentType, content]
    async proxy(ctx, params) {
        if (params.do === 'raw' && params.url) {              // 例：跨域资源中转（网盘直链/m3u8 去广告同理）
            const res = await ctx.lib.net.req(params.url);
            return [200, 'application/octet-stream', res.content];
        }
        return [404, 'text/plain', 'Not Found'];
    },

    // 源内交互通道（drpyS 生态转正）：列表里输出 vod_tag:'action' 条目做入口，壳子点击后回调到这里
    async action(ctx, action, value) {
        if (action === 'set-timeout') {                       // 例：源内设置中心——配置持久化
            await ctx.store.set('timeout', value);
            return `已保存：请求超时 ${value}ms`;
        }
        if (action === 'push') {                              // 例：推送播放——返回播放结构直接起播
            return { parse: 1, url: value, jx: 0 };
        }
        return '未知动作';
    },
})
