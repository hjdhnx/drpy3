// parse：解析域标准库（设计 §9 parse）。pdfh/pdfa/pd/pdfl 由 HostEnv 注入（jsoup 语义，勿重造），
// 框架提供 pdfl 逐元素回退、jp/jinja2（peer cheerio.jinja2/jp）、parseRule（字符串规则解析，W5）。
import {cheerio, 模板} from './peer.js';
import {parseRule} from '../rules/parseRule.js';

export function makeParse(rt) {
    const parse = {
        pdfh: (html, parseRule, baseUrl = '') => rt.resolve('pdfh')(html, parseRule, baseUrl),
        pdfa: (html, parseRule) => rt.resolve('pdfa')(html, parseRule),
        pd: (html, parseRule, baseUrl = '') => rt.resolve('pd')(html, parseRule, baseUrl),
        // HostEnv 未注入 pdfl 时框架回退：pdfa 取列表 + 逐元素 pdfh/pd（§9，正确性不受影响）
        pdfl: (html, parseRule, listText, listUrl, myUrl) => {
            const host = rt.resolve('pdfl');
            if (typeof host === 'function') {
                return host(html, parseRule, listText, listUrl, myUrl);
            }
            const items = rt.resolve('pdfa')(html, parseRule) || [];
            return items.map((it) => `${rt.resolve('pdfh')(it, listText)}$${rt.resolve('pd')(it, listUrl, myUrl)}`);
        },
        // jsonpath（peer cheerio.jp：jp(path, json)）
        jp: (path, json) => cheerio.jp(path, json),
        jinja2: (tpl, obj) => cheerio.jinja2(tpl, obj),
        模板,
        // 'json:...;title;img' 字符串规则解析成数据（§9）：语义基准 drpy2 categoryParse 列表分支
        parseRule(ruleStr, ctx, opts) {
            return parseRule(ruleStr, ctx, opts);
        },
    };
    return parse;
}
