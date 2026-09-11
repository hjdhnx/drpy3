/*
@header({
  title: '百忙无果[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1, quickSearch: 0,
})

【演示 4｜js: 片段混用形态】—— drpy2 老玩家的平滑迁移写法
- 整体结构与 drpy2 原版几乎一致：声明式 rule + 二级/搜索用 js: 片段
- drpy3 的 js: 片段是 AsyncFunction：注入 input/MY_URL/fetch_params/MOBILE_UA/request/
  pdfh/pdfa/pd/jsp/setResult/VOD/VODS/TABS/LISTS/lib/log/print 这些老名字（参数化注入，非全局）
- 与 drpy2 原版的唯一机械差异：IO 调用前加 await（本文件用 ←── 标出）
- $js.toString(() => {...}) 的老写法依然支持；片段内可 await，还能直接用 lib 并发
面向：从 drpy2 迁移的存量作者——把原片段粘进来，加几个 await 就能跑。
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
        class_name: '电视剧&电影&综艺&动漫&纪录片&教育&少儿',
        class_url: '2&3&1&50&51&115&10',
        filter: 'H4sIAAAAAAAAA+2XvUrDUBSA3+XOHc65adraN+jm5CIdYok/GFupWiilIBalIFYoIh1EBxEKIih0MOZ1msS+hbc1yTni4mKms6XfIbnnC/mG9hSq6mZP7btdVVWNXae949aa2y1VUE3nwDVsHkw+Z378FoT3l4Z2HO/EXd3SNMPwfLoYTJfY/HA8T/UL6eDK3JUMtjDjnb3DFOoMbtTW45tpOHxPR1Y2Sk4/86PxSzotqn59Of/e+ajVPqZto9E4/Lj+tWd0dxrdviYPaNA6hseD9MEN2ih+eJr7o8XzJBxepNOfx3Zdp03Hhv5sHjz+/fVo0MUEry4Zt4hbnGvimnMkjpwDcWAc1zJuLhmvEK9wXiZe5rxEvMS5TdzmnHyR+yL5IvdF8kXui+SL3BfJF7kvkC9wXyBf4L5AvsB9gXyB+wL5AvcF8oXVl1MvKC2pSWqSWh6pWZKapCap5ZGaDdKatCat5dKa/FuT1qS1XFpD80YkNolNYvv32PpfCLkneIcUAAA=',
        一级: 'json:data.hitDocs;title;img;updateInfo||rightCorner.text;playPartId',

        // js: 片段（AsyncFunction）—— 与 drpy2 原版二级逐行对照，仅 await 差异
        二级: `js:
        fetch_params.headers.Referer = "https://www.mgtv.com";
        fetch_params.headers["User-Agent"] = MOBILE_UA;
        pdfh = jsp.pdfh;
        pd = jsp.pd;
        VOD = {};
        let d = [];
        let html = await request(input);                                 // ←── 加 await
        let json = JSON.parse(html);
        let ourl = json.data.list.length > 0 ? json.data.list[0].url : json.data.series[0].url;
        if (!/^http/.test(ourl)) ourl = "https://www.mgtv.com" + ourl;
        html = await request(ourl);                                      // ←── 加 await
        if (html.includes("window.location =")) {
            ourl = pdfh(html, "meta[http-equiv=refresh]&&content").split("url=")[1];
            html = await request(ourl);                                  // ←── 加 await
        }
        try {
            VOD.vod_name = pdfh(html, ".vt-txt&&Text");
            VOD.type_name = pdfh(html, "p:eq(0)&&Text").substr(0, 6);
            VOD.vod_area = pdfh(html, "p:eq(1)&&Text");
            VOD.vod_actor = pdfh(html, "p:eq(4)&&Text").substr(0, 25);
            VOD.vod_director = pdfh(html, "p:eq(3)&&Text");
            VOD.vod_pic = pd(html, ".video-img&&img&&src");
            VOD.vod_content = (pdfh(html, ".desc&&Text").split("简介：")[1] || "").trim();
            VOD.vod_remarks = "已完结";
            if (!VOD.vod_name) VOD.vod_name = VOD.type_name;
        } catch (e) { log("获取影片信息发生错误:" + e.message) }

        // 选集：原版是 for 串行逐页 request；drpy3 片段里可直接用 lib 并发
        let eps = json.data.list;
        if ((json.data.total_page || 1) > 1) {
            const pages = await lib.net.all(                             // ←── 并发替代串行
                Array.from({length: json.data.total_page - 1}, (_, i) =>
                    request(input.replace("page=1", "page=" + (i + 2)), {}))
            );
            for (const p of pages)
                for (const it of (JSON.parse(p.content).data.list || []))
                    if (it.isIntact == "1") eps.push(it);
        }
        VOD.vod_play_from = "mgtv";
        VOD.vod_play_url = eps.map(function (it) {
            return it.t4 + "$https://www.mgtv.com" + it.url
        }).join("#");
        setResult(d);
    `,

        // 搜索片段：与 drpy2 原版一致，仅 await 差异
        搜索: `js:
        fetch_params.headers.Referer = "https://www.mgtv.com";
        fetch_params.headers["User-Agent"] = MOBILE_UA;
        let d = [];
        let html = await request(input);                                 // ←── 加 await
        let json = JSON.parse(html);
        json.data.contents.forEach(function (data) {
            if (data.type && data.type == 'media') {
                let item = data.data[0];
                let desc = item.desc.join(',');
                let fyclass = '';
                if (item.source === "imgo") {
                    try {
                        fyclass = item.rpt.match(/idx=(.*?)&/)[1] + '$';
                    } catch (e) { fyclass = ''; }
                    d.push({
                        title: item.title.replace(/<B>|<\\/B>/g, ''),
                        img: item.img || '',
                        content: '',
                        desc: desc,
                        url: fyclass + item.url.match(/.*\\/(.*?)\\.html/)[1]
                    })
                }
            }
        });
        setResult(d);
    `,
    },
}
