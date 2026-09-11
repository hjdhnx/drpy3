// 声明式默认引擎（设计 附录 D 阶段3-4、§9）：纯声明式源的全部生命周期内置实现。
// 语义基准 = src/drpy2.js 的 homeParse/categoryParse/searchParse/detailParse/playParse。
// 钩子存在时优先走钩子；这里只兜"能声明的全部声明式"。
import {parseRule as runParseRule} from './parseRule.js';
import {runJsFragment} from './jsFragment.js';
import {ungzip} from '../lib/crypto.js';
import {forceOrder, 是否正版} from '../lib/utils.js';

const SPECIAL_URL = /^(ftp|magnet|thunder|ws):/;

function tellIsJx(url) {
    try {
        return !/\.(m3u8|mp4|m4a)$/.test(url.split('?')[0]) && 是否正版(url) ? 1 : 0;
    } catch {
        return 1;
    }
}

/** js: 片段统一执行：错误携带片段名（§5.3） */
async function evalFragment(name, code, ctx, extra) {
    try {
        return await runJsFragment(code, ctx, extra);
    } catch (e) {
        e.message = `片段[${name}]执行错误: ${e.message}`;
        throw e;
    }
}

export const defaults = {
    async init(ctx, ext) {
        // 纯声明式源默认 init：无预处理（rule 定稿在 _warm 完成）
    },

    /** 首页：class_name/class_url 静态分类 + class_parse(js/选择器) + filter 解压（homeParse 语义） */
    async home(ctx, filter) {
        const rule = ctx.rule;
        let classes = [];
        if (rule.class_name && rule.class_url) {
            const names = String(rule.class_name).split('&');
            const urls = String(rule.class_url).split('&');
            const cnt = Math.min(names.length, urls.length);
            for (let i = 0; i < cnt; i++) classes.push({type_id: urls[i], type_name: names[i]});
        }
        if (rule.class_parse && typeof rule.class_parse === 'string' && rule.class_parse.startsWith('js:')) {
            const scope = await evalFragment('class_parse', stripJs(rule.class_parse), ctx, {input: rule.homeUrl || ''});
            if (Array.isArray(scope.input)) classes = scope.input;
        } else if (rule.class_parse) {
            // 选择器形态 class_parse：'列表选择器;名称;链接[;正则]'——需请求 homeUrl
            try {
                const parts = String(rule.class_parse).split(';');
                const res = await ctx.lib.net.req(rule.homeUrl || rule.host);
                const list = ctx.lib.parse.pdfa(res.content, parts[0]) || [];
                for (const it of list) {
                    const name = ctx.lib.parse.pdfh(it, parts[1] || '').trim();
                    let url = ctx.lib.parse.pd(it, parts[2] || '', rule.homeUrl || rule.host);
                    if (parts[3]) url = (url.match(new RegExp(parts[3])) || [])[1] || url;
                    classes.push({type_id: url.trim(), type_name: name.trim()});
                }
            } catch (e) {
                ctx.log(`class_parse 解析失败: ${e.message}`);
            }
        }
        if (rule.cate_exclude) classes = classes.filter((it) => !(new RegExp(rule.cate_exclude)).test(it.type_name));
        const resp = {class: classes};
        if (rule.filter && typeof rule.filter === 'string' && rule.filter.trim()) {
            try {
                rule.filter = JSON.parse(ungzip(rule.filter.trim())); // 解压后写回实例 rule（drpy2 同语义，只解一次）
            } catch {
                rule.filter = {};
            }
        }
        if (rule.filter) resp.filters = rule.filter;
        return resp;
    },

    /** 首页推荐：声明式 推荐 规则（缺省空列表） */
    async homeVod(ctx) {
        const rule = ctx.rule;
        if (!rule.推荐 || typeof rule.推荐 !== 'string') return {list: []};
        return await defaults.category(ctx, '', 1, false, {}, rule.推荐);
    },

    /**
     * 一级分类页：url 渲染（fyclass/fypage/[区间]/filter_url×jinja2）+ 'json:...' 或 js: 片段
     * @param ruleOverride 供 homeVod 复用（推荐 规则替代 一级）
     */
    async category(ctx, tid, pg, filter, extend, ruleOverride) {
        const rule = ctx.rule;
        let p = ruleOverride || rule.一级;
        if (!p || typeof p !== 'string') return {};
        const d = [];
        let url = rule.url.replaceAll('fyclass', tid);
        if (pg === 1 && url.includes('[') && url.includes(']')) {
            url = url.split('[')[1].split(']')[0];
        } else if (pg > 1 && url.includes('[') && url.includes(']')) {
            url = url.split('[')[0];
        }
        if (rule.filter_url) {
            if (!/fyfilter/.test(url)) {
                if (!url.endsWith('&') && !rule.filter_url.startsWith('&')) url += '&';
                url += rule.filter_url;
            } else {
                url = url.replace('fyfilter', rule.filter_url);
            }
            url = url.replaceAll('fyclass', tid);
            let fl = filter ? extend || {} : {};
            if (rule.filter_def && typeof rule.filter_def === 'object' && rule.filter_def[tid]) {
                fl = Object.assign(JSON.parse(JSON.stringify(rule.filter_def[tid])), fl);
            }
            url = ctx.lib.parse.jinja2(url, {fl, fyclass: tid});
        }
        if (/fypage/.test(url)) {
            if (url.includes('(') && url.includes(')')) {
                const urlRep = url.match(/.*?\((.*)\)/)[1];
                const cntPg = urlRep.replaceAll('fypage', pg);
                // eslint-disable-next-line no-eval
                url = url.replaceAll(urlRep, eval(cntPg)).replaceAll('(', '').replaceAll(')', '');
            } else {
                url = url.replaceAll('fypage', pg);
            }
        }
        ctx.url = url;
        ctx.input = url;
        p = p.trim();
        if (p.startsWith('js:')) {
            const scope = await evalFragment('一级', stripJs(p), ctx, {TYPE: 'cate'});
            d.push(...(scope.VODS || []));
        } else {
            const list = await runParseRule(p, ctx, {catePrefix: tid});
            d.push(...list);
        }
        if (d.length < 1) {
            return {
                list: [{vod_name: '无数据,防无限请求', vod_id: 'no_data', vod_remarks: '不要点,会崩的', vod_pic: ''}],
                total: 1, pagecount: 1, page: 1, limit: 1,
            };
        }
        let pagecount = 999;
        if (rule.pagecount && typeof rule.pagecount === 'object' && rule.pagecount[tid] != null) {
            pagecount = parseInt(rule.pagecount[tid]);
        }
        return {page: parseInt(pg) || 1, pagecount, limit: 20, total: 999, list: d};
    },

    /** 二级详情：js: 片段（VOD）/ '*'直连 / 对象形态（title/desc/tabs/lists，drpy2 detailParse 语义）。
     *  id=壳子按透传规则给出的 id（仅 detailUrl 路由源剥「分类$」，其余原样）；fullId=原始全文（vod_id 还原用） */
    async detail(ctx, id, fullId) {
        const rule = ctx.rule;
        const orId = String(id == null ? '' : id);
        const detailId = orId.split('@@')[0];
        let url;
        if (!detailId.startsWith('http') && !detailId.includes('/')) {
            // 「分类$」路由前缀已在壳子 detail() 入口剥除，fyclass 占位符不再有值
            url = (rule.detailUrl || '').replaceAll('fyid', detailId).replaceAll('fyclass', '');
        } else if (detailId.includes('/')) {
            url = ctx.lib.utils.joinUrl(rule.homeUrl || rule.host, detailId);
        } else {
            url = detailId;
        }
        ctx.url = url;
        ctx.input = url;
        const p = rule.二级;
        let vod = {
            vod_id: fullId != null ? fullId : id, vod_name: '片名', vod_pic: '', type_name: '类型', vod_year: '年份',
            vod_area: '地区', vod_remarks: '更新信息', vod_actor: '主演', vod_director: '导演', vod_content: '简介',
        };
        if (rule.二级访问前 && typeof rule.二级访问前 === 'string') {
            await evalFragment('二级访问前', stripJs(rule.二级访问前), ctx, {});
        }
        if (p === '*') {
            vod.vod_play_from = '道长在线';
            vod.vod_remarks = rule.detailUrl || '';
            vod.vod_content = url;
            vod.vod_play_url = '嗅探播放$' + String(id).split('@@')[0];
            return {list: [vod]};
        }
        if (typeof p === 'string' && p.trim().startsWith('js:')) {
            const scope = await evalFragment('二级', stripJs(p), ctx, {TYPE: 'detail', play_url: ''});
            vod = scope.VOD || vod;
            if (!vod.vod_id || (fullId && vod.vod_id !== fullId)) vod.vod_id = fullId != null ? fullId : id;
            return {list: [vod]};
        }
        if (p && typeof p === 'object') {
            // 对象形态二级（CMS 模板源）：title/desc/content/img + tabs/lists
            const res = await ctx.lib.net.req(url);
            const html = res.content;
            const field = (sel) => ctx.lib.parse.pdfh(html, sel).replace(/\n|\t/g, '').trim();
            if (p.title) {
                const t = String(p.title).split(';');
                vod.vod_name = field(t[0]);
                vod.type_name = t.length > 1 ? field(t[1]).replace(/ /g, '') : vod.type_name;
            }
            if (p.desc) {
                const t = String(p.desc).split(';');
                vod.vod_remarks = field(t[0] || '');
                vod.vod_year = t[1] ? field(t[1]) : vod.vod_year;
                vod.vod_area = t[2] ? field(t[2]) : vod.vod_area;
                vod.vod_actor = t[3] ? field(t[3]) : vod.vod_actor;
                vod.vod_director = t[4] ? field(t[4]) : vod.vod_director;
            }
            if (p.content) vod.vod_content = field(String(p.content).split(';')[0]);
            if (p.img) vod.vod_pic = ctx.lib.parse.pd(html, String(p.img).split(';')[0], url);
            let playFrom = ['道长在线'];
            const listsOut = [];
            if (p.tabs) {
                playFrom = (ctx.lib.parse.pdfa(html, String(p.tabs).split(';')[0]) || []).map((v, i) => {
                    let t = ctx.lib.parse.pdfh(v, p.tab_text || 'body&&Text').trim() || '线路空';
                    return t;
                });
                if (!playFrom.length) playFrom = ['道长在线'];
            }
            if (p.lists) {
                const listText = p.list_text || 'body&&Text';
                const listUrl = p.list_url || 'a&&href';
                for (let i = 0; i < playFrom.length; i++) {
                    const p1 = String(p.lists).replaceAll('#idv', playFrom[i]).replaceAll('#id', i);
                    let newVodList = [];
                    if (typeof ctx.lib.parse.pdfl === 'function') {
                        newVodList = ctx.lib.parse.pdfl(html, p1, listText, listUrl, url);
                    } else {
                        const vodList = ctx.lib.parse.pdfa(html, p1) || [];
                        newVodList = vodList.map((it) => `${ctx.lib.parse.pdfh(it, listText).trim()}$${ctx.lib.parse.pd(it, listUrl, url)}`);
                    }
                    listsOut.push(forceOrder(newVodList, '', (x) => x.split('$')[0]).join('#'));
                }
            }
            vod.vod_play_from = playFrom.join('$$$');
            vod.vod_play_url = listsOut.join('$$$') || '嗅探播放$' + url;
            if (!vod.vod_id) vod.vod_id = fullId != null ? fullId : id;
            return {list: [vod]};
        }
        // 无二级规则：一级链接直接嗅探播放
        vod.vod_play_from = '道长在线';
        vod.vod_play_url = '嗅探播放$' + url;
        return {list: [vod]};
    },

    /** 播放：play_parse+lazy js 免嗅，缺省 common_play（playParse 语义，play_json 默认 [] 不覆盖） */
    async play(ctx, flag, id, flags) {
        const rule = ctx.rule;
        let myUrl = String(id == null ? '' : id);
        if (!/http/.test(myUrl)) {
            try {
                myUrl = ctx.lib.crypto.base64Decode(myUrl);
            } catch { /* 非 base64 保持原样 */ }
        }
        try {
            myUrl = decodeURIComponent(myUrl);
        } catch { /* 保原样 */ }
        ctx.url = myUrl;
        ctx.input = myUrl;
        const commonPlay = {
            parse: SPECIAL_URL.test(myUrl) || /^(push:)/.test(myUrl) ? 0 : 1,
            url: myUrl,
            flag,
            jx: tellIsJx(myUrl),
        };
        let lazyPlay = commonPlay;
        if (rule.play_parse && rule.lazy && typeof rule.lazy === 'string') {
            try {
                const scope = await evalFragment('lazy', stripJs(rule.lazy), ctx, {flag});
                lazyPlay = scope.input && typeof scope.input === 'object' ? scope.input : {
                    parse: SPECIAL_URL.test(scope.input) || /^(push:)/.test(scope.input) ? 0 : 1,
                    jx: tellIsJx(scope.input),
                    url: scope.input,
                };
            } catch (e) {
                ctx.log(`js免嗅错误:${e.message}`);
                lazyPlay = commonPlay;
            }
        }
        if (Array.isArray(rule.play_json) && rule.play_json.length > 0) {
            for (const pjson of rule.play_json) {
                if (pjson.re && (pjson.re === '*' || lazyPlay.url.match(new RegExp(pjson.re)))) {
                    if (pjson.json && typeof pjson.json === 'object') {
                        lazyPlay = Object.assign(lazyPlay, pjson.json);
                        break;
                    }
                }
            }
        } else if (rule.play_json && !Array.isArray(rule.play_json)) {
            lazyPlay = Object.assign(lazyPlay, {jx: 1, parse: 1});
        } else if (!rule.play_json) {
            lazyPlay = Object.assign(lazyPlay, {jx: 0, parse: 1});
        }
        return lazyPlay;
    },

    /** 搜索：searchUrl 渲染（双星号替换、fypage、区间、;post）+ '搜索' 规则或 js: 片段（searchParse 语义） */
    async search(ctx, wd, quick, pg) {
        const rule = ctx.rule;
        if (!rule.searchUrl) return {};
        if (rule.searchNoPage && Number(pg) > 1) return {};
        let p = rule.搜索 === '*' && rule.一级 ? rule.一级 : rule.搜索;
        if (!p || typeof p !== 'string') return {};
        const d = [];
        let url = rule.searchUrl.replaceAll('**', wd);
        if (pg === 1 && url.includes('[') && url.includes(']') && !url.includes('#')) {
            url = url.split('[')[1].split(']')[0];
        } else if (pg > 1 && url.includes('[') && url.includes(']') && !url.includes('#')) {
            url = url.split('[')[0];
        }
        if (/fypage/.test(url)) {
            if (url.includes('(') && url.includes(')')) {
                const urlRep = url.match(/.*?\((.*)\)/)[1];
                url = url.replaceAll(urlRep, urlRep.replaceAll('fypage', pg)).replaceAll('(', '').replaceAll(')', '');
            } else {
                url = url.replaceAll('fypage', pg);
            }
        }
        ctx.url = url;
        ctx.input = url;
        p = p.trim();
        if (p.startsWith('js:')) {
            const scope = await evalFragment('搜索', stripJs(p), ctx, {TYPE: 'search', detailUrl: rule.detailUrl || ''});
            d.push(...(scope.VODS || []));
        } else {
            const pp = rule.一级 ? rule.一级.split(';') : [];
            const parts = p.split(';');
            if (parts.length < 5) return {};
            const getPP = (i) => (parts[i] === '*' && pp.length > i ? pp[i] : parts[i]);
            const reqMethod = url.split(';').length > 1 ? url.split(';')[1].toLowerCase() : 'get';
            let html;
            if (reqMethod === 'post' || reqMethod === 'postjson') {
                const rurls = url.split(';')[0].split('#');
                const body = rurls.length > 1 ? rurls[1] : '';
                if (reqMethod === 'postjson') {
                    let params = {};
                    try {
                        params = JSON.parse(body);
                    } catch { /* 空对象 */ }
                    html = (await ctx.lib.net.req(rurls[0], {method: 'POST', data: params})).content;
                } else {
                    html = (await ctx.lib.net.req(rurls[0], {method: 'POST', body})).content;
                }
            } else {
                html = (await ctx.lib.net.req(url)).content;
            }
            const res = await runParseRule(getPP(0) + ';' + getPP(1) + ';' + getPP(2) + ';' + getPP(3) + ';' + getPP(4) + (parts[5] ? ';' + getPP(5) : ''), ctx, {html});
            d.push(...res.map((it) => ({...it, vod_content: it.vod_content || ''})));
        }
        return {page: parseInt(pg) || 1, pagecount: 10, limit: 20, total: 100, list: d};
    },

    /** 本地代理默认：未实现 proxy_rule 时 404（§10.1） */
    async proxy(ctx, params) {
        const rule = ctx.rule;
        if (rule.proxy_rule && typeof rule.proxy_rule === 'string' && rule.proxy_rule.trim()) {
            let code = rule.proxy_rule.trim().replace(/^js:/, '').trim();
            const scope = await evalFragment('proxy', code, ctx, {input: params});
            if (scope.input && scope.input !== params && Array.isArray(scope.input) && scope.input.length >= 3) {
                return scope.input;
            }
            return [404, 'text/plain', 'Not Found'];
        }
        return [404, 'text/plain', 'Not Found'];
    },

    /** 交互通道默认（§10.2）：无钩子返回空提示 */
    async action(ctx, action, value) {
        return '';
    },

    async sniffer(ctx) {
        return !!ctx.rule.sniffer;
    },

    async isVideo(ctx, url) {
        const rule = ctx.rule;
        let pattern = rule.isVideo || '';
        if (pattern && String(pattern).startsWith('js:')) {
            const scope = await evalFragment('isVideo', stripJs(pattern), ctx, {input: url});
            return !!scope.input;
        }
        if (!pattern) return false;
        return new RegExp(pattern).test(url);
    },
};

/** 'js:xxx' → 代码体 */
function stripJs(s) {
    return String(s).trim().replace(/^js:/, '').trim();
}
