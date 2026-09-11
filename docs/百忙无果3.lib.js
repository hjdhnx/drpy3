/*
@header({
  title: '百忙无果[官]',
  lang: 'dr3',
})

【演示 3 配套模块】真实目录结构中本文件为 ./lib/mgtv.js
- 模块无任何全局：标准库一律经 ctx 显式传入
- 模块可独立单测（传一个 mock ctx 即可），多源可共享
*/

export const WEB = 'https://www.mgtv.com';
export const MOBILE_HEADERS = () => ({ 'User-Agent': 'MOBILE_UA', Referer: WEB });

// 搜索：v3 接口带签名 —— 签名算法用随源分发的 wasm 资产（引擎原生 WebAssembly 执行，性能最佳）
export async function searchImgo(ctx, wd, pg, signWasmBytes) {
    const ts = Date.now();
    const wasm = await ctx.lib.wasm.load(signWasmBytes);          // 框架缓存：同一路径只实例化一次
    const sign = wasm.exports.xxh64(`${wd}|${ts}`, 0x9e3779b1).toString(16);
    const url = ctx.rule.searchUrl
        .replaceAll('**', encodeURIComponent(wd))
        .replaceAll('fypage', pg) + `&ts=${ts}&sign=${sign}`;
    const res = await ctx.lib.net.req(url, { headers: MOBILE_HEADERS() });
    const json = JSON.parse(res.content);
    return (json.data.contents || [])
        .filter(c => c.type === 'media')
        .map(c => c.data[0])
        .filter(item => item.source === 'imgo')
        .map(item => ({
            vod_id: (item.rpt.match(/idx=(.*?)&/)?.[1] || '') + '$' + item.url.match(/.*\/(.*?)\.html/)[1],
            vod_name: item.title.replace(/<B>|<\/B>/g, ''),
            vod_pic: item.img || '',
            vod_remarks: (item.desc || []).join(','),
        }));
}

// 二级两段式：选集接口 + 详情页；第 2..N 页选集与详情页并发
export async function fetchEpisodes(ctx, fyid) {
    const epUrl = ctx.rule.detailUrl.replaceAll('fyid', fyid);
    const ep = JSON.parse((await ctx.lib.net.req(epUrl)).content);
    const first = ep.data.list[0] ?? ep.data.series[0];
    let pageUrl = WEB + first.url;

    const [page, ...rest] = await ctx.lib.net.all([
        ctx.lib.net.req(pageUrl, { headers: MOBILE_HEADERS() }),
        ...Array.from({ length: (ep.data.total_page || 1) - 1 }, (_, i) =>
            ctx.lib.net.req(epUrl.replace('page=1', 'page=' + (i + 2)), { headers: MOBILE_HEADERS() })),
    ]);
    let html = page.content;
    if (html.includes('window.location =')) {
        pageUrl = ctx.lib.parse.pdfh(html, 'meta[http-equiv=refresh]&&content').split('url=')[1];
        html = (await ctx.lib.net.req(pageUrl)).content;
    }
    const eps = [...ep.data.list];
    for (const p of rest)
        for (const it of (JSON.parse(p.content).data.list || []))
            if (it.isIntact == '1') eps.push(it);
    return { html, pageUrl, eps };
}

// 详情字段组装（jsoup 选择器语义与 drpy2 完全一致）
export function buildVod(ctx, id, html, pageUrl, eps) {
    const { pdfh, pd } = ctx.lib.parse;
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
    vod.vod_play_url = eps.map(it => it.t4 + '$' + WEB + it.url).join('#');
    return vod;
}
