// 字符串规则解析器（设计 §9 parse.parseRule / §5.3）：
// 'json:路径;title;pic;desc;id(+id2)' —— 语义基准 = drpy2 categoryParse/searchParse 的列表解析分支。
// parseRule 面向高级源直接组合（百忙无果2 用法）：返回原始 vod_id（不带分类前缀，由调用方决定拼接）。
import {Drpy3Error} from '../errors.js';

/** drpy2 dealJson：容忍响应体前后杂质，提取 JSON 主体 */
export function dealJson(html) {
    if (typeof html !== 'string') return html;
    try {
        return JSON.parse(html);
    } catch { /* 继续提取 */ }
    const m = html.match(/\{[\s\S]*\}/) || html.match(/\[[\s\S]*\]/);
    if (m) {
        try {
            return JSON.parse(m[0]);
        } catch { /* 落空 */ }
    }
    throw new Drpy3Error('parse', 'parseRule', '响应体不是合法 JSON');
}

/** json 域 pdfh：$. 路径 + '||' 回退 + 非字符串 toString（drpy2 parseTags.json.pdfh 语义） */
function jsonPdfh(data, parse, jp) {
    if (!parse || !parse.trim()) return '';
    let path = parse.trim();
    if (!path.startsWith('$.')) path = '$.' + path;
    for (const ps of path.split('||')) {
        let ret = jp(ps, data);
        if (Array.isArray(ret)) ret = ret[0] || '';
        else ret = ret == null ? '' : ret;
        if (ret && typeof ret !== 'string') ret = String(ret);
        if (ret) return ret;
    }
    return '';
}

function clean(s) {
    return String(s == null ? '' : s).replace(/\n|\t/g, '').trim();
}

/**
 * 解析列表规则为 vod 数组
 * @param ruleStr 'json:data.list;title;img;desc;id'（json:/jsp:/jq: 前缀，缺省 jq）
 * @param ctx 调用上下文（ctx.url 为请求目标；ctx.rule.detailUrl 影响 id 是否走 pd）
 * @param opts {html, catePrefix} html：调用方已持有响应体时直接传入；catePrefix：声明式一级的分类 id 前缀
 *   （drpy2 语义：rule.detailUrl 存在时 vod_id = 分类$id，供 detail 还原；钩子/高级源调用不传则不带前缀）
 */
export async function parseRule(ruleStr, ctx, opts = {}) {
    const rule = String(ruleStr == null ? '' : ruleStr).trim();
    if (!rule) return [];
    const p = rule.split(';');
    if (p.length < 5) return [];
    let p0 = p[0];
    const kind = p0.startsWith('jsp:') ? 'jsp' : p0.startsWith('json:') ? 'json' : 'jq';
    p0 = p0.replace(/^(jsp:|json:|jq:)/, '');
    const MY_URL = ctx.url || '';
    const parse = ctx.lib.parse;
    const detailUrl = (ctx.rule && ctx.rule.detailUrl) || '';

    let html = opts.html;
    if (html == null) {
        const res = await ctx.lib.net.req(MY_URL);
        html = res.content;
    }
    if (kind === 'json') html = dealJson(html);

    // 列表提取（_pdfa 语义）
    let list;
    if (kind === 'json') {
        let path = p0.trim();
        if (!path) return [];
        if (!path.startsWith('$.')) path = '$.' + path;
        let ret = parse.jp(path, html);
        if (Array.isArray(ret) && Array.isArray(ret[0]) && ret.length === 1) ret = ret[0];
        list = ret || [];
    } else {
        list = parse.pdfa(html, p0) || [];
    }
    if (!Array.isArray(list)) return [];

    // 字段提取：id 段支持 '+' 拼接（drpy2 links 语义：有 detailUrl 走 pdfh（相对地址由壳子拼），无则 pd 补全）
    const prefix = opts.catePrefix != null && opts.catePrefix !== '' && detailUrl ? opts.catePrefix + '$' : '';
    const out = [];
    for (const it of list) {
        try {
            const nameOf = (sel) => (kind === 'json' ? jsonPdfh(it, sel, parse.jp) : clean(parse.pdfh(it, sel)));
            const picOf = (sel) => {
                if (kind === 'json') {
                    const r = jsonPdfh(it, sel, parse.jp);
                    return r ? ctx.lib.utils.joinUrl(MY_URL, r) : '';
                }
                return parse.pd(it, sel, MY_URL);
            };
            const idOf = (sel) => (detailUrl ? nameOf(sel) : (kind === 'json' ? picOf(sel) : parse.pd(it, sel, MY_URL)));
            const links = p[4].split('+').map(idOf);
            out.push({
                vod_id: prefix + links.join('$'),
                vod_name: nameOf(p[1]),
                vod_pic: picOf(p[2]),
                vod_remarks: nameOf(p[3]),
            });
        } catch { /* 单条解析失败跳过（drpy2 同语义） */ }
    }
    return out;
}
