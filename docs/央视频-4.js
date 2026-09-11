/*
@header({
  title: '央视频[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1,
})

【演示 4｜drpyS 平滑迁移形态（wasm 解密播放版）】
原版（docs/央视频.js）本身就是 drpyS 风格：async 函数 + 相对模块 import + 全局 req/getProxy/Buffer。
它离 drpy3 只差三处机械改动（本文件用 ①②③ 标出），**解密算法一行不用动**：
  ① 导出形态：export function __jsEvalReturn() → export default { ... }
  ② 生命周期函数签名加 ctx 首参（需要标准库时用 ctx.lib.*；req/getProxy/Buffer 作为
     注入别名保持可用，老代码里的裸调用不改也能跑）
  ③ wasm 单例管理二选一：保留 _lib.cntvParse.js 里手写的 initWasmModule（兼容层支持），
     或换成 lib.wasm.load 托管（推荐，删代码）
面向：drpyS 存量源迁移——大部分是"改导出、加 ctx"，解密/解析逻辑原样保留。
*/

import './_lib.cntvParse.js';                    // ③ 兼容层支持老模块：Parse_TS 挂在全局别名上照常可用
// 迁移推荐（二选一）：改用托管加载后，_lib.cntvParse.js 里的单例管理代码整段删除
// import { decryptTs } from './_lib.cntvParse3.js';

let header = {
    'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
};
let js2Base = '';

// ② 每个函数加 ctx 首参；req/getProxy/Buffer 为注入别名（裸调用照旧可用）
async function init(ctx, cfg) {
    js2Base = (await getProxy(true)) + '&url=';   // getProxy：注入别名，老写法不动
    readColumns(ctx);                             // readColumns 内部的 req 同理走注入别名
}

function readColumns(ctx) {
    for (let i = 1; i < 7; i++) {
        let res = req('https://api.cntv.cn/lanmu/columnSearch?serviceId=tvcctv&t=json&n=100&p=' + i, {
            headers: header, method: 'GET',
        });
        let data = JSON.parse(res.content).response;
        if (!data || data.docs.length === 0) break;
        // ...（与原版一致：构建 columns/columnKeys，此处从略）
    }
}

async function home(ctx, filter) {
    // ...（与原版一致：categoryConfig 静态分类）
    return JSON.stringify({ class: classes, filters: filter ? filterConfig : null });
}

async function category(ctx, tid, pg, filter, extend) {
    // ...（与原版一致，req 走注入别名）
    return JSON.stringify({ list: videos });
}

async function detail(ctx, id) {
    // ...（与原版一致）
    return JSON.stringify({ list: [vod] });
}

async function play(ctx, flag, id, flags) {
    // ...（与原版一致：2000 流走 js2Base 代理，850/450 直连）
    return JSON.stringify({ parse: 0, urls: urls, header: { 'user-agent': 'Dalvik/2.1.0' } });
}

async function search(ctx, wd, quick) {
    // ...（与原版一致：栏目表匹配 + search.cctv.com HTML 解析）
    return JSON.stringify({ list: videos });
}

async function proxy(ctx, params) {
    let url = params.url;
    if (url.indexOf('.ts') > 0) {
        // TS 代理——解密：Parse_TS 来自 _lib.cntvParse.js（①③ 原样可用，内部 wasm 托管已由框架垫片兜住）
        const res = await req(url, { method: 'GET', buffer: 1, timeout: 15000, headers: {
            'User-Agent': header['user-agent'], Referer: 'https://tv.cctv.com',
        }});
        const buf = await Parse_TS(res.content);
        return [200, 'video/MP2T', Buffer.from(buf).toString('base64'), { 'Content-Type': 'video/MP2T' }, 1];
    }
    // m3u8 重写（与原版一致，此处从略）
    return [200, 'application/vnd.apple.mpegurl', rewritten];
}

// ① 导出形态：__jsEvalReturn 包装改为 default export（兼容层两者都认）
export default {
    init: init,
    home: home,
    homeVod: homeVod,
    category: category,
    detail: detail,
    play: play,
    proxy: proxy,
    search: search,
}
