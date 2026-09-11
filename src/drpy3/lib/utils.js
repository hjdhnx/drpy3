// utils：URL/文本工具（设计 §9 text/utils）。语义基准 = src/drpy2.js 同名函数。
// 库全局（CryptoJS 等）以 peer 方式引用 dist/drpy-core-lite.min.js，勿重造。
import {jinja} from './peer.js';

// UA 常量（drpy2.js:375-379 原值）
export const UA = {
    MOBILE_UA: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
    PC_UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
    IOS_UA: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    UC_UA: 'Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36',
    UA: 'Mozilla/5.0',
};

/** rule.headers 里的 UA 常量名解析（drpy2 init 同语义） */
export function resolveUaConstants(headers) {
    for (const k of Object.keys(headers)) {
        if (k.toLowerCase() === 'user-agent' && UA[headers[k]] !== undefined) headers[k] = UA[headers[k]];
    }
    return headers;
}

/** 内置 joinUrl 兜底：WHATWG URL 语义（= python urljoin 常用面），异常时保守拼接 */
export function builtinJoinUrl(base, path) {
    try {
        return new URL(path, base || undefined).href;
    } catch {
        return (base || '') + path;
    }
}

export function getHome(url) {
    if (!url) return '';
    const tmp = String(url).split('//');
    let home = tmp[0] + '//' + (tmp[1] || '').split('/')[0];
    try {
        home = decodeURIComponent(home);
    } catch { /* 保持原样 */ }
    return home;
}

export function urlencode(str) {
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27')
        .replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

export function buildUrl(url, obj) {
    obj = obj || {};
    if (url.indexOf('?') < 0) url += '?';
    const keys = Object.keys(obj);
    const prs = keys.map((k) => k + '=' + obj[k]).join('&');
    if (keys.length > 0 && !url.endsWith('?')) url += '&';
    return url + prs;
}

export function buildQueryString(params) {
    const arr = [];
    for (const key of Object.keys(params)) {
        let v = params[key];
        if (v === undefined || v === null) v = '';
        else v = v.toString();
        arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
    }
    return arr.join('&');
}

export function 是否正版(vipUrl) {
    return /qq\.com|iqiyi\.com|youku\.com|mgtv\.com|bilibili\.com|sohu\.com|ixigua\.com|pptv\.com|miguvideo\.com|le\.com|1905\.com|fun\.tv/.test(vipUrl);
}

export function urlDeal(vipUrl) {
    if (!vipUrl) return '';
    if (!是否正版(vipUrl)) return vipUrl;
    if (!/miguvideo/.test(vipUrl)) vipUrl = vipUrl.split('#')[0].split('?')[0];
    return vipUrl;
}

/** 选集列表顺序强制纠正（drpy2 forceOrder 原语义） */
export function forceOrder(lists, key, option) {
    const start = Math.floor(lists.length / 2);
    const end = Math.min(lists.length - 1, start + 1);
    if (start >= end) return lists;
    let first = lists[start];
    let second = lists[end];
    if (key) {
        try {
            first = first[key];
            second = second[key];
        } catch { /* 保持原值 */ }
    }
    if (option && typeof option === 'function') {
        try {
            first = option(first);
            second = option(second);
        } catch { /* 保持原值 */ }
    }
    first += '';
    second += '';
    const m1 = first.match(/(\d+)/);
    const m2 = second.match(/(\d+)/);
    if (m1 && m2 && Number(m1[1]) > Number(m2[1])) lists.reverse();
    return lists;
}

/** jinja2 模板渲染（filter_url 用，peer jinja） */
export function jinja2(template, obj) {
    return jinja.render(template, obj);
}

/** 组装运行时级 utils 命名空间（ctx.lib.utils） */
export function makeUtils(rt) {
    return {
        UA,
        joinUrl: (base, path) => rt.resolve('joinUrl')(base, path),
        getHome,
        urlencode,
        encodeUrl: (str) => encodeURI(str),
        buildUrl,
        buildQueryString,
        forceOrder,
        是否正版,
        urlDeal,
        // proxy 类源取本地代理地址（HostEnv getProxy 的包装，§9 utils）
        getProxyUrl: async () => {
            const gp = rt.resolve('getProxy');
            const url = typeof gp === 'function' ? await gp(true) : '';
            return url || 'http://127.0.0.1:9978/proxy?do=js';
        },
    };
}
