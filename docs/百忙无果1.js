/*
@header({
  title: '百忙无果[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1, quickSearch: 0,
})

【演示 1｜零样板 · 纯声明式优先】—— drpy3 的"最简现实形态"
- default export 直接是 rule 对象，零包装（无 defineSource、无 import）
- 能声明的全部声明式：分类 / 筛选 / 一级 / 搜索地址 / 详情地址 / 请求头
- 只有 mgtv 接口真正需要代码的两处（搜索嵌套取值、二级两段式组装）写成 async 钩子
- 无全局、无 js: 字符串；drpy2 原版 214 行 → 本版约 80 行
*/

export default {
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
        class_name: '电视剧&电影&综艺&动漫&纪录片&教育&少儿',   // 静态分类：home 无需代码
        class_url: '2&3&1&50&51&115&10',
        filter: 'H4sIAAAAAAAAA+2XvUrDUBSA3+XOHc65adraN+jm5CIdYok/GFupWiilIBalIFYoIh1EBxEKIih0MOZ1msS+hbc1yTni4mKms6XfIbnnC/mG9hSq6mZP7btdVVWNXae949aa2y1VUE3nwDVsHkw+Z378FoT3l4Z2HO/EXd3SNMPwfLoYTJfY/HA8T/UL6eDK3JUMtjDjnb3DFOoMbtTW45tpOHxPR1Y2Sk4/86PxSzotqn59Of/e+ajVPqZto9E4/Lj+tWd0dxrdviYPaNA6hseD9MEN2ih+eJr7o8XzJBxepNOfx3Zdp03Hhv5sHjz+/fVo0MUEry4Zt4hbnGvimnMkjpwDcWAc1zJuLhmvEK9wXiZe5rxEvMS5TdzmnHyR+yL5IvdF8kXui+SL3BfJF7kvkC9wXyBf4L5AvsB9gXyB+wL5AvcF8oXVl1MvKC2pSWqSWh6pWZKapCap5ZGaDdKatCat5dKa/FuT1qS1XFpD80YkNolNYvv32PpfCLkneIcUAAA=',
        一级: 'json:data.hitDocs;title;img;updateInfo||rightCorner.text;playPartId',   // 声明式一级
    },

    // ═══ 以下两个钩子是 mgtv 接口真正"需要写代码"的全部 ═══

    // 搜索：contents[] 混着非 media 项、取 data[0]、title 去 <B>、url/rpt 正则提取
    async search(ctx, wd, quick, pg) {
        const { request } = ctx.lib.net;                    // 解构惯用法（§4.5）：之后与 drpy2 写法一致
        const res = await request(
            ctx.rule.searchUrl.replaceAll('**', wd).replaceAll('fypage', pg),
            { headers: { 'User-Agent': 'MOBILE_UA', Referer: 'https://www.mgtv.com' } },
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
        return { list };
    },

    // 二级：选集接口(JSON) → 详情页(HTML) 两段式；字段解析用 jsoup 语义选择器
    async detail(ctx, id) {
        ctx.fetchParams.headers.Referer = 'https://www.mgtv.com';
        ctx.fetchParams.headers['User-Agent'] = 'MOBILE_UA';
        const { req, all } = ctx.lib.net;
        const { pdfh, pd } = ctx.lib.parse;
        const WEB = 'https://www.mgtv.com';

        const epUrl = ctx.rule.detailUrl.replaceAll('fyid', id);
        const ep = JSON.parse((await req(epUrl)).content);
        let pageUrl = WEB + (ep.data.list[0] ?? ep.data.series[0]).url;
        let html = (await req(pageUrl)).content;
        if (html.includes('window.location =')) {                       // 跳转壳页：取真实地址再取一次
            pageUrl = pdfh(html, 'meta[http-equiv=refresh]&&content').split('url=')[1];
            html = (await req(pageUrl)).content;
        }

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

        // 选集：total_page 已知，第 2..N 页并发取（drpy2 原版是 for 串行）
        const eps = [...ep.data.list];
        const rest = await all(
            Array.from({ length: (ep.data.total_page || 1) - 1 }, (_, i) =>
                req(epUrl.replace('page=1', 'page=' + (i + 2)), { headers: { Referer: WEB } })),
        );
        for (const p of rest)
            for (const it of (JSON.parse(p.content).data.list || []))
                if (it.isIntact == '1') eps.push(it);

        vod.vod_play_url = eps.map(it => it.t4 + '$' + WEB + it.url).join('#');
        return { list: [vod] };
    },
}
