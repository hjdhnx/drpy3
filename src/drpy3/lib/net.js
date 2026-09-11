// net：网络域标准库（设计 §9 net）。全部 async（§5.1）。
// req 适配：宿主注入可同步可异步，框架统一 await（§5.1/§5.4）。
// 请求头合并优先级（§4.4）：本次 options.headers > ctx.fetchParams.headers > ctx.headers（实例基线）
import {Drpy3Error} from '../errors.js';
import {UA, getHome} from './utils.js';

function hasHeader(headers, name) {
    return Object.keys(headers || {}).some((k) => k.toLowerCase() === name.toLowerCase());
}

/** UA 常量名解析：header 值恰为常量名（'MOBILE_UA'/'PC_UA'…）时替换为真实 UA（drpy2 init 同机制，
 *  但 drpy2 只解析 rule.headers；这里在每次请求合并时解析，覆盖钩子运行时赋值的场景，如
 *  fetch_params.headers['User-Agent'] = 'MOBILE_UA'） */
function resolveUaNames(headers) {
    for (const k of Object.keys(headers)) {
        if (k.toLowerCase() === 'user-agent' && UA[headers[k]] !== undefined) headers[k] = UA[headers[k]];
    }
    return headers;
}

/** 组装本次请求 options：合并三层 headers + 默认 UA/Referer + 超时（drpy2 request 语义） */
export function mergeOptions(ctx, url, options) {
    const o = {...(options || {})};
    const h = resolveUaNames({...(ctx.headers || {}), ...(ctx.fetchParams && ctx.fetchParams.headers || {}), ...(o.headers || {})});
    if (!hasHeader(h, 'user-agent')) h['User-Agent'] = UA.MOBILE_UA;
    if (!hasHeader(h, 'referer')) h['Referer'] = getHome(url);
    o.headers = h;
    if (o.timeout == null && ctx.fetchParams && ctx.fetchParams.timeout != null) o.timeout = ctx.fetchParams.timeout;
    if (o.encoding == null && ctx.fetchParams && ctx.fetchParams.encoding) o.encoding = ctx.fetchParams.encoding;
    return o;
}

export function makeNet(rt, ctx) {
    const net = {
        /** 单次请求：返回 {content, headers}。buffer:1→Uint8Array / 2→base64 / 缺省→文本（§6.2） */
        async req(url, options) {
            if (!url) return {content: '', headers: {}};
            const fn = rt.resolve('req');
            if (typeof fn !== 'function') {
                throw new Drpy3Error('net', 'req', 'HostEnv 缺少必注入项 req()——壳子未提供 HTTP 能力');
            }
            const res = await fn(url, mergeOptions(ctx, url, options));
            if (res && typeof res === 'object' && 'content' in res) return res;
            throw new Drpy3Error('net', 'req', `HostEnv req 返回契约不合法（需 {content, headers}），实际: ${typeof res}`);
        },
        /** drpy2 老名 request：便捷封装（fetch_params 默认语义已并入 req 的 headers 合并） */
        request(url, options) {
            return net.req(url, options);
        },
        /** 快捷 POST（drpy2 post 语义） */
        post(url, options) {
            return net.req(url, {...(options || {}), method: 'POST'});
        },
        /** 搜索过验证：返回 {cookie, html}（drpy2 reqCookie 语义，withHeaders） */
        async reqCookie(url, options, allCookie = false) {
            const res = await net.req(url, {...(options || {}), withHeaders: true});
            let headers = res.headers || {};
            if (options && options.withHeaders && typeof res.content === 'string' && res.content.trim().startsWith('{')) {
                try {
                    headers = JSON.parse(res.content); // drpy2: withHeaders 时 request 返回 headers+body 的 JSON 串
                } catch { /* 保持 headers */ }
            }
            const ckKey = Object.keys(headers).find((k) => k.toLowerCase() === 'set-cookie');
            let cookie = ckKey ? headers[ckKey] : '';
            if (Array.isArray(cookie)) cookie = cookie.join(';');
            cookie = String(cookie || '');
            const html = headers.body != null ? headers.body : res.content;
            return {cookie: allCookie ? cookie : cookie.split(';')[0], html};
        },
        /** 并发请求（Promise.all 语义化，§5.2） */
        all: (promisesOrItems) => Promise.all(promisesOrItems),
        /** 正式并发批量 API（§9）：[{url, options}] → 按序对齐的响应"文本"数组；单项失败返 '' 不中断 */
        async batchFetch(items) {
            const hostFn = rt.resolve('batchFetch');
            if (typeof hostFn === 'function') {
                return await hostFn(items);
            }
            // 框架内置兜底：req + Promise.all（§7 附录 A：宿主原生实现可随时覆盖拿更快路径）
            if (!Array.isArray(items) || items.length === 0) return [];
            return await Promise.all(items.map(async (it) => {
                try {
                    const res = await net.req(it.url, it.options);
                    return res.content;
                } catch {
                    return '';
                }
            }));
        },
        /** 下载为 base64（原 buffer:2 约定的显式化，§9） */
        async download(url, options) {
            const res = await net.req(url, {...(options || {}), buffer: 2});
            return res.content;
        },
    };
    return net;
}
