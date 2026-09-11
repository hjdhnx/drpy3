/*
@header({
  title: '百忙无果[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1, quickSearch: 0,
})

【演示 3｜模块化工程源】—— 源目录形态（§8 相对路径模块）
源不再必须是单文件，推荐目录结构：
  百忙无果3.js          ← 主文件：只做组装与生命周期（本文件，~60 行）
  lib/mgtv.js           ← 站点逻辑模块：接口、解析、组装（见下一代码块）
  lib/sign.wasm         ← 搜索签名 wasm 资产（接口升级 v3 需签名；--?bytes 资产导入为打包模式专属糖）
相对路径基于源文件自身位置解析；分发时整个目录打包（模式 B）或走引擎原生 loader（模式 A）。
面向：多源共享工具库、逻辑复杂需要测试的团队/高阶作者。
*/

import { defineSource } from 'drpy3';
import { searchImgo, fetchEpisodes, buildVod } from './lib/mgtv.js';
import signWasm from './lib/sign.wasm?bytes';

export default defineSource({
    meta: {
        title: '百忙无果[官]',
        host: 'https://pianku.api.%6d%67%74%76.com',
        searchable: 2, filterable: 1, quickSearch: 0, multi: 1,
    },
    rule: {
        searchUrl: 'https://mobileso.bz.mgtv.com/msite/search/v3?q=**&pn=fypage&pc=10',
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

    // 主文件薄到只剩"接线"：站点细节全部在 lib/mgtv.js，ctx 显式传入（模块无全局）
    async search(ctx, wd, quick, pg) {
        return { list: await searchImgo(ctx, wd, pg, signWasm) };
    },

    async detail(ctx, id) {
        const { html, pageUrl, eps } = await fetchEpisodes(ctx, id.split('$').pop());
        return { list: [buildVod(ctx, id, html, pageUrl, eps)] };
    },
})
