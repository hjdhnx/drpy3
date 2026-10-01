/*
@header({
  title: 'dr3能力探针',
  lang: 'dr3',
  searchable: 0, filterable: 0, quickSearch: 0,
})

【drpy3 能力探针】—— 点一下就知道引擎里有什么
- 分类 = 《drpy3 源写作指南》章节；条目 = 函数/对象名
- 点条目（action 条目）实测：typeof 存在性 + 最小冒烟调用
  · toast 弹一行摘要（✅ 成功 / ⚠ 缺失 / ❌ 报错）
  · logcat 打全量：tag=flutter，前缀 [drpy3-console]，搜 [probe]
- 「0·说明」组有一条图文用法说明（进详情查看）
- 全程零网络依赖；写源时怀疑「壳子有没有这个函数」就用它逐个验证
- 探测源码本身就是标准写法示范，抄对应条目的写法进你的源即可
*/

// ═══ 探测表：键 = 探测键（action 通道原样回传），值 = (ctx) => 结果串 ═══
// 统一模式：①typeof 存在性 → ②最小冒烟调用 → ③返回结果样例（可多行）
const PROBES = {
    // ── 1·裸名加密 ──
    'md5': () => {
        const t = typeof md5;
        if (t !== 'function') return 'typeof md5 = ' + t + '（缺失）';
        return "md5('dr3') = " + md5('dr3');
    },
    'base64Encode': () => {
        if (typeof base64Encode !== 'function') return '缺失';
        return "base64Encode('dr3') = " + base64Encode('dr3');
    },
    'base64Decode': () => {
        if (typeof base64Decode !== 'function') return '缺失';
        return "base64Decode('ZHIz') = " + base64Decode('ZHIz');
    },
    'gzip': () => {
        if (typeof gzip !== 'function') return '缺失';
        return "gzip('dr3') = " + gzip('dr3');
    },
    'ungzip': () => {
        if (typeof ungzip !== 'function') return '缺失';
        const gz = gzip('dr3探针');
        return "ungzip(gzip('dr3探针')) = " + ungzip(gz);
    },
    'aesX': () => {
        if (typeof aesX !== 'function') return '缺失';
        const key = '0123456789abcdef', iv = 'abcdef9876543210';
        const ct = aesX('dr3探针', key, iv, {method: 'enc', utf8: 1});
        const pt = aesX(ct, key, iv, {method: 'dec', utf8: 1});
        return 'CBC+utf8 往返 = ' + pt + '（密文前12位 ' + ct.substring(0, 12) + '…）';
    },
    'desX': () => {
        if (typeof desX !== 'function') return '缺失';
        const key = '01234567', iv = '12345678';
        const ct = desX('dr3', key, iv, {method: 'enc', utf8: 1});
        const pt = desX(ct, key, iv, {method: 'dec', utf8: 1});
        return 'DES 往返 = ' + pt;
    },
    'rc4': () => {
        if (typeof rc4 !== 'function') return '缺失';
        const ct = rc4('dr3', 'key123', {method: 'enc'});
        const pt = rc4(ct, 'key123', {method: 'dec'});
        return 'RC4 往返 = ' + pt;
    },
    'rsaX': () => {
        const t = typeof rsaX;
        if (t !== 'function') return 'typeof rsaX = ' + t + '（缺失）';
        if (typeof JSEncrypt !== 'function') return 'rsaX 在但 JSEncrypt 缺';
        const j = new JSEncrypt();
        return 'rsaX=function，new JSEncrypt().encrypt = ' + typeof j.encrypt;
    },

    // ── 2·裸名文本与URL ──
    'cut': () => {
        if (typeof cut !== 'function') return '缺失';
        return "cut('a#hello#b', '#', '#') = " + cut('a#hello#b', '#', '#');
    },
    'encodeStr': () => {
        if (typeof encodeStr !== 'function') return '缺失';
        return "encodeStr('中', 'gbk') = " + encodeStr('中', 'gbk');
    },
    'decodeStr': () => {
        if (typeof decodeStr !== 'function') return '缺失';
        return "decodeStr('%D6%D0', 'gbk') = " + decodeStr('%D6%D0', 'gbk');
    },
    'joinUrl': () => {
        if (typeof joinUrl !== 'function') return '缺失';
        return "joinUrl('http://a.com/x/', 'y.jpg') = " + joinUrl('http://a.com/x/', 'y.jpg');
    },
    'urljoin': () => {
        const t = typeof urljoin;
        if (t !== 'function') return 'typeof urljoin = ' + t + '（缺失）';
        return "urljoin('http://a.com/x/', '../y.jpg') = " + urljoin('http://a.com/x/', '../y.jpg');
    },
    'getHome': () => {
        if (typeof getHome !== 'function') return '缺失';
        return "getHome('https://a.com/b/c?d=1') = " + getHome('https://a.com/b/c?d=1');
    },
    'urlencode': () => {
        if (typeof urlencode !== 'function') return '缺失';
        return "urlencode('a b&c') = " + urlencode('a b&c');
    },
    'encodeUrl': () => {
        if (typeof encodeUrl !== 'function') return '缺失';
        return "encodeUrl('a b') = " + encodeUrl('a b');
    },
    'buildUrl': () => {
        if (typeof buildUrl !== 'function') return '缺失';
        return "buildUrl('http://a.com/x', {p:1}) = " + buildUrl('http://a.com/x', {p: 1});
    },
    'buildQueryString': () => {
        if (typeof buildQueryString !== 'function') return '缺失';
        return "buildQueryString({a:1,b:'x'}) = " + buildQueryString({a: 1, b: 'x'});
    },

    // ── 3·裸名解析与杂项 ──
    'pdfh': () => {
        if (typeof pdfh !== 'function') return '缺失';
        const r = pdfh('<a href="http://b.com/z">标题</a>', 'a&&href');
        return "pdfh('<a href=…>标题</a>', 'a&&href') = " + r;
    },
    'pdfa': () => {
        if (typeof pdfa !== 'function') return '缺失';
        return "pdfa('<ul><li>1</li><li>2</li></ul>', 'ul&&li').length = " +
            pdfa('<ul><li>1</li><li>2</li></ul>', 'ul&&li').length;
    },
    'pd': () => {
        if (typeof pd !== 'function') return '缺失';
        return "pd('<a href=\"/x\">t</a>', 'a&&href', 'http://base.com/') = " +
            pd('<a href="/x">t</a>', 'a&&href', 'http://base.com/');
    },
    'pdfl': () => {
        if (typeof pdfl !== 'function') return '缺失';
        const r = pdfl('<li><a href="/1">a</a></li><li><a href="/2">b</a></li>',
            'li', 'a&&Text', 'a&&href', 'http://base.com/');
        return 'pdfl 整表 = ' + JSON.stringify(r);
    },
    'jp': () => {
        if (typeof jp !== 'function') return '缺失';
        return "jp('$.a', {a: 42}) = " + jp('$.a', {a: 42});
    },
    'forceOrder': () => {
        if (typeof forceOrder !== 'function') return '缺失';
        const r = forceOrder(['第2集$2', '第1集$1', '第10集$10'], '');
        return 'forceOrder 选集排序 = ' + JSON.stringify(r);
    },
    '是否正版': () => {
        const t = typeof 是否正版;
        if (t !== 'function') return 'typeof 是否正版 = ' + t + '（缺失）';
        return "是否正版('http://x.com/v/1') = " + 是否正版('http://x.com/v/1');
    },
    'urlDeal': () => {
        if (typeof urlDeal !== 'function') return '缺失';
        return "urlDeal('https://www.iqiyi.com/v/abc') = " + urlDeal('https://www.iqiyi.com/v/abc');
    },
    'MOBILE_UA': () => {
        const t = typeof MOBILE_UA;
        if (t !== 'string') return 'typeof MOBILE_UA = ' + t + '（缺失）';
        return 'MOBILE_UA = ' + MOBILE_UA.substring(0, 40) + '…';
    },
    'print/log': (ctx) => {
        const tp = typeof print, tl = typeof log;
        print('[probe] 这条来自 print()');
        log('[probe] 这条来自 log()');
        ctx.log('[probe] 这条来自 ctx.log()');
        return 'print=' + tp + ' log=' + tl + '（三条已打 logcat，搜 [probe]）';
    },

    // ── 4·库全局 CryptoJS ──
    'CryptoJS': () => {
        const t = typeof CryptoJS;
        if (t !== 'object') return 'typeof CryptoJS = ' + t + '（缺失）';
        return "CryptoJS.MD5('dr3') = " + CryptoJS.MD5('dr3').toString();
    },
    'CryptoJS.AES': () => {
        if (typeof CryptoJS === 'undefined') return 'CryptoJS 缺失';
        const key = CryptoJS.enc.Utf8.parse('0123456789abcdef');
        const ct = CryptoJS.AES.encrypt('dr3探针', key,
            {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString();
        const pt = CryptoJS.AES.decrypt(ct, key,
            {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
        return 'AES-ECB 往返 = ' + pt + '（密文前12位 ' + ct.substring(0, 12) + '…）';
    },
    'CryptoJS.MD5': () => {
        if (typeof CryptoJS === 'undefined') return 'CryptoJS 缺失';
        return "CryptoJS.MD5('dr3').toString() = " + CryptoJS.MD5('dr3').toString();
    },
    'CryptoJS.enc.Utf8': () => {
        if (typeof CryptoJS === 'undefined') return 'CryptoJS 缺失';
        return "enc.Utf8.parse('dr3').toString() = " + CryptoJS.enc.Utf8.parse('dr3').toString();
    },
    'CryptoJS.enc.Base64': () => {
        if (typeof CryptoJS === 'undefined') return 'CryptoJS 缺失';
        return "enc.Base64.stringify(Utf8.parse('hi')) = " +
            CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('hi'));
    },
    'CryptoJS.mode.ECB': () => {
        if (typeof CryptoJS === 'undefined') return 'CryptoJS 缺失';
        return 'typeof CryptoJS.mode.ECB = ' + typeof CryptoJS.mode.ECB;
    },
    'CryptoJS.pad.Pkcs7': () => {
        if (typeof CryptoJS === 'undefined') return 'CryptoJS 缺失';
        return 'typeof CryptoJS.pad.Pkcs7 = ' + typeof CryptoJS.pad.Pkcs7;
    },

    // ── 5·库全局其他 ──
    'JSEncrypt': () => {
        const t = typeof JSEncrypt;
        if (t !== 'function') return 'typeof JSEncrypt = ' + t + '（缺失）';
        const j = new JSEncrypt();
        return 'JSEncrypt 实例化 OK，encrypt=' + typeof j.encrypt + ' decrypt=' + typeof j.decrypt;
    },
    'pako': () => {
        const t = typeof pako;
        if (t !== 'object') return 'typeof pako = ' + t + '（缺失）';
        const gz = pako.gzip('dr3');
        return 'pako.gzip("dr3") = ' + gz.length + ' 字节（首字节 ' + gz[0] + '）';
    },
    'gbkTool': () => {
        const t = typeof gbkTool;
        if (t !== 'object') return 'typeof gbkTool = ' + t + '（缺失）';
        return "gbkTool.encode('中') = " + gbkTool.encode('中');
    },
    '模板': () => {
        const t = typeof 模板;
        if (t !== 'object') return 'typeof 模板 = ' + t + '（缺失）';
        return '模板.getMubans = ' + typeof 模板.getMubans;
    },
    'cheerio': () => {
        const t = typeof cheerio;
        if (t === 'undefined') return 'typeof cheerio = undefined（缺失）';
        const kind = typeof cheerio.jp === 'function' ? 'bundle 补丁版' : 'so C 版(Lexbor)';
        return 'cheerio = ' + t + '（' + kind + '）';
    },
    'jinja': () => {
        const t = typeof jinja;
        if (t !== 'object') return 'typeof jinja = ' + t + '（缺失）';
        return "jinja.render('{{ x }}!', {x: 'dr3'}) = " + jinja.render('{{ x }}!', {x: 'dr3'});
    },
    'JSONPath': () => {
        const t = typeof JSONPath;
        if (t === 'undefined') return 'typeof JSONPath = undefined（缺失）';
        return "JSONPath({path:'$.a', json:{a:1}})[0] = " + JSONPath.JSONPath({path: '$.a', json: {a: 1}})[0];
    },

    // ── 6·引擎全局 so ──
    'Buffer': () => {
        const t = typeof Buffer;
        if (t !== 'function') return 'typeof Buffer = ' + t + '（缺失）';
        return "Buffer.from('dr3').toString('base64') = " + Buffer.from('dr3').toString('base64');
    },
    'TextEncoder(GBK)': () => {
        const t = typeof TextEncoder;
        if (t !== 'function') return 'typeof TextEncoder = ' + t + '（缺失）';
        const b = new TextEncoder('gbk').encode('中');
        const hex = Array.from(b).map((x) => x.toString(16)).join(' ');
        return "new TextEncoder('gbk').encode('中') = " + hex + "（D6 D0 = so 扩展版 ✓）";
    },
    'TextDecoder': () => {
        const t = typeof TextDecoder;
        if (t !== 'function') return 'typeof TextDecoder = ' + t + '（缺失）';
        const d = new TextDecoder('utf-8').decode(Buffer.from('dr3'));
        return "TextDecoder('utf-8').decode = " + d;
    },
    'zlib': () => {
        const t = typeof zlib;
        if (t !== 'object') return 'typeof zlib = ' + t + '（缺失）';
        const gz = zlib.gzip(Buffer.from('dr3'));
        return 'zlib.gzip = ' + gz.length + ' 字节（C 实现）';
    },
    'crypto.subtle': () => {
        const t = typeof crypto;
        if (t !== 'object') return 'typeof crypto = ' + t + '（缺失）';
        return 'crypto.subtle = ' + typeof crypto.subtle +
            '；注意：so 的 subtle 是同步 C 桥（非浏览器异步）';
    },
    'crypto.createHash': () => {
        if (typeof crypto !== 'object') return 'crypto 缺失';
        return "crypto.createHash('md5').update('dr3') = " +
            crypto.createHash('md5').update('dr3').digest('hex');
    },
    'WebAssembly': () => {
        const t = typeof WebAssembly;
        if (t !== 'object') return 'typeof WebAssembly = ' + t + '（缺失）';
        return 'WebAssembly = object（wasm3 原生，wasm 解密可用）';
    },
    'URL': () => {
        const t = typeof URL;
        if (t !== 'function') return 'typeof URL = ' + t + '（缺失）';
        return "new URL('http://a.com/b?c=1').search = " + new URL('http://a.com/b?c=1').search;
    },
    'URLSearchParams': () => {
        const t = typeof URLSearchParams;
        if (t !== 'function') return 'typeof URLSearchParams = ' + t + '（缺失）';
        return 'new URLSearchParams("a=1&b=x").get("b") = ' + new URLSearchParams('a=1&b=x').get('b');
    },
    'atob/btoa': () => {
        const ta = typeof atob, tb = typeof btoa;
        if (ta !== 'function' || tb !== 'function') return 'atob=' + ta + ' btoa=' + tb;
        return "btoa('dr3') = " + btoa('dr3') + " atob('" + btoa('dr3') + "') = " + atob(btoa('dr3'));
    },
    'performance': () => {
        const t = typeof performance;
        if (t === 'undefined') return 'typeof performance = undefined（缺失）';
        const n = performance.now();
        return 'performance.now() = ' + Math.round(n) + 'ms（引擎内时钟）';
    },
    'fs': () => 'typeof fs = ' + typeof fs + '（so 宿主沙箱内文件）',
    'path': () => 'typeof path = ' + typeof path,
    'DataBase': () => 'typeof DataBase = ' + typeof DataBase + '（SQLite）',

    // ── 7·ctx 能力 ──
    'ctx.req': (ctx) => 'typeof ctx.req = ' + typeof ctx.req +
        '（异步网络，用 await ctx.req(url)；req 契约 {content, headers}）',
    'ctx.post': (ctx) => 'typeof ctx.post = ' + typeof ctx.post + '（= req + method POST）',
    'ctx.batchFetch': (ctx) => 'typeof ctx.batchFetch = ' + typeof ctx.batchFetch +
        '（并发批量，单项失败返空串）',
    'ctx.download': (ctx) => 'typeof ctx.download = ' + typeof ctx.download + '（下载为 base64）',
    'ctx.pdfh': (ctx) => {
        const t = typeof ctx.pdfh;
        if (t !== 'function') return 'typeof ctx.pdfh = ' + t;
        return "ctx.pdfh('<b>hi</b>', 'b&&Text') = " + ctx.pdfh('<b>hi</b>', 'b&&Text');
    },
    'ctx.jp': (ctx) => 'typeof ctx.jp = ' + typeof ctx.jp +
        "（jsonpath：ctx.jp('$.a', {a:1})）",
    'ctx.md5': (ctx) => {
        const t = typeof ctx.md5;
        if (t !== 'function') return 'typeof ctx.md5 = ' + t;
        return "ctx.md5('dr3') = " + ctx.md5('dr3') + '（与裸名 md5 同实现）';
    },
    'ctx.aesX': (ctx) => 'typeof ctx.aesX = ' + typeof ctx.aesX,
    'ctx.store': (ctx) => {
        const t = typeof ctx.store;
        if (t !== 'object') return 'typeof ctx.store = ' + t;
        ctx.store.set('probe_ts', 'v-' + (ctx.pg || 1));
        const back = ctx.store.get('probe_ts', '');
        return 'store 写读回环 = ' + back + '（跨重启持久，壳子快照）';
    },
    'ctx.cache': async (ctx) => {
        const t = typeof ctx.cache;
        if (t !== 'object') return 'typeof ctx.cache = ' + t;
        await ctx.cache.set('probe_k', 'cache-v1', 60);
        return 'cache 写读回环 = ' + await ctx.cache.get('probe_k') + '（进程内 TTL）';
    },
    'ctx.headers': (ctx) => {
        const t = typeof ctx.headers;
        if (t !== 'object') return 'typeof ctx.headers = ' + t;
        return 'ctx.headers keys = ' + JSON.stringify(Object.keys(ctx.headers)) +
            '（实例级请求头基线，写它全源生效）';
    },
    'ctx.fetchParams': (ctx) => {
        const t = typeof ctx.fetchParams;
        if (t !== 'object') return 'typeof ctx.fetchParams = ' + t;
        return 'ctx.fetchParams keys = ' + JSON.stringify(Object.keys(ctx.fetchParams)) +
            '（调用级基线：headers/timeout/encoding）';
    },
    'ctx.capabilities': (ctx) => {
        const c = ctx.capabilities;
        if (!c) return 'ctx.capabilities 缺失';
        return '能力表 = ' + JSON.stringify(c);
    },
    'ctx.lib.wasm': (ctx) => {
        const lib = ctx.lib || {};
        return 'typeof ctx.lib.wasm = ' + typeof lib.wasm +
            '（wasm 加载域：load/crypt，Runtime 级缓存）';
    },
};

// ═══ 分组表：tid / 组名 / [探测键, 条目备注] ═══
const GROUPS = [
    ['g0', '0·说明', [['about', '点进详情看用法']]],
    ['g1', '1·裸名加密', [
        ['md5', '裸名哈希'], ['base64Encode', '编码'], ['base64Decode', '解码'],
        ['gzip', '压缩→base64'], ['ungzip', 'base64→解压'], ['aesX', 'AES-CBC 往返'],
        ['desX', 'DES 往返'], ['rc4', 'RC4 往返'], ['rsaX', 'RSA（typeof 级）'],
    ]],
    ['g2', '2·裸名文本与URL', [
        ['cut', '正则裁切'], ['encodeStr', 'GBK 编码'], ['decodeStr', 'GBK 解码'],
        ['joinUrl', '拼接URL'], ['urljoin', '拼接URL·dr2老名'], ['getHome', '取站点根'],
        ['urlencode', 'URL编码'], ['encodeUrl', 'encodeURI'], ['buildUrl', '拼query'],
        ['buildQueryString', '对象→query'],
    ]],
    ['g3', '3·裸名解析与杂项', [
        ['pdfh', '取单值'], ['pdfa', '取数组'], ['pd', '取值+补全地址'],
        ['pdfl', '批量整表'], ['jp', 'jsonpath'], ['forceOrder', '选集排序'],
        ['是否正版', 'VIP站判定'], ['urlDeal', 'VIP链接处理'], ['MOBILE_UA', 'UA 常量'],
        ['print/log', '日志三通道'],
    ]],
    ['g4', '4·库全局 CryptoJS', [
        ['CryptoJS', 'MD5 快测'], ['CryptoJS.AES', 'ECB 往返'], ['CryptoJS.MD5', '哈希'],
        ['CryptoJS.enc.Utf8', '编码器'], ['CryptoJS.enc.Base64', 'Base64'],
        ['CryptoJS.mode.ECB', 'ECB 模式'], ['CryptoJS.pad.Pkcs7', 'Pkcs7 填充'],
    ]],
    ['g5', '5·库全局其他', [
        ['JSEncrypt', 'RSA 实例化'], ['pako', 'gzip 库'], ['gbkTool', 'GBK 工具'],
        ['模板', 'dr2 模板基建'], ['cheerio', 'DOM 解析'], ['jinja', '模板渲染'],
        ['JSONPath', 'JSON 路径'],
    ]],
    ['g6', '6·引擎全局 so', [
        ['Buffer', 'Node 风格字节'], ['TextEncoder(GBK)', 'GBK 编码器'],
        ['TextDecoder', '解码器'], ['zlib', 'C 压缩'], ['crypto.subtle', '同步 C 桥'],
        ['crypto.createHash', 'C 哈希'], ['WebAssembly', 'wasm3'],
        ['URL', 'WHATWG URL'], ['URLSearchParams', 'query 解析'],
        ['atob/btoa', 'base64 快捷'], ['performance', '引擎时钟'],
        ['fs', '文件（存在性）'], ['path', '路径（存在性）'], ['DataBase', 'SQLite（存在性）'],
    ]],
    ['g7', '7·ctx 能力', [
        ['ctx.req', '异步网络'], ['ctx.post', '快捷POST'], ['ctx.batchFetch', '并发批量'],
        ['ctx.download', '下载base64'], ['ctx.pdfh', '解析'], ['ctx.jp', 'jsonpath'],
        ['ctx.md5', '哈希'], ['ctx.aesX', 'AES'], ['ctx.store', '持久KV'],
        ['ctx.cache', 'TTL缓存'], ['ctx.headers', '实例头基线'],
        ['ctx.fetchParams', '调用基线'], ['ctx.capabilities', '能力表'],
        ['ctx.lib.wasm', 'wasm 域'],
    ]],
];

const HELP_TEXT = [
    '【drpy3 能力探针 · 使用说明】',
    '',
    '这是一个「引擎能力实测」工具源：每组条目 = 一个函数/对象，',
    '点击条目立即实测——typeof 存在性 + 最小冒烟调用，',
    '结果以 toast 弹出，全量细节打进 logcat（搜 [probe]）。',
    '',
    '写源时怀疑「壳子里有没有这个函数、返回长什么样」，',
    '点对应条目即可验证；探测代码本身就是标准写法，',
    '可对照《drpy3 源写作指南》直接抄进你的源。',
    '',
    '图例：✅ 存在且调用成功；⚠ 存在性缺失（宿主版本过老或引擎不支持）；',
    '❌ 存在但调用报错（多半是你源里的用法问题，看 logcat 详情）。',
    '',
    '全部探测零网络依赖；「6·引擎全局 so」组的 fs/path/DataBase 等',
    '仅做存在性探测——不同宿主能力有差异，探针本身就是诊断工具。',
].join('\n');

export default {
    meta: {
        title: 'dr3能力探针',
        host: 'http://127.0.0.1:9',
        searchable: 0, filterable: 0, quickSearch: 0,
    },
    rule: {
        class_name: GROUPS.map((g) => g[1]).join('&'),
        class_url: GROUPS.map((g) => g[0]).join('&'),
    },

    async category(ctx, tid, pg, filter, extend) {
        const g = GROUPS.find((x) => x[0] === tid);
        if (!g) return {list: []};
        const list = g[2].map(([k, d]) => ({
            vod_id: k,
            vod_name: k,
            vod_remarks: d,
            // action 条目：点击不进详情，直接执行源 action 钩子（壳子 toast 返回文本）
            vod_tag: k === 'about' ? '' : 'action',
        }));
        return {page: 1, pagecount: 1, limit: list.length, total: list.length, list};
    },

    async action(ctx, action, value) {
        const probe = PROBES[action];
        if (!probe) return '未知探针: ' + action;
        const t0 = Date.now();
        try {
            const out = String(await probe(ctx));
            const ms = Date.now() - t0;
            const missing = out.indexOf('缺失') >= 0;
            const mark = missing ? '⚠' : '✓';
            console.log('[probe] ' + action + ' ' + mark + ' (' + ms + 'ms)\n' + out);
            const head = out.split('\n')[0];
            const tag = missing ? '⚠ ' : '✅ ';
            const line = tag + action + ' (' + ms + 'ms) ' + head;
            return line.length > 110 ? line.substring(0, 110) + '…' : line;
        } catch (e) {
            console.log('[probe] ' + action + ' ✗ ' + e.message + '\n' + (e.stack || ''));
            const line = '❌ ' + action + ': ' + e.message;
            return line.length > 110 ? line.substring(0, 110) + '…' : line;
        }
    },

    async detail(ctx, id) {
        // ⚠️ vod_play_url 不能为空：壳子对 lines=0 的源直接呈现「没有可
        // 播放的线路」错误态（影视源语义正确），图文内容会被整个盖掉——
        // 给一条伪线路让详情页正常渲染，play 钩子兜底
        if (id === 'about') {
            return {list: [{
                vod_id: 'about',
                vod_name: 'dr3能力探针 · 使用说明',
                vod_content: HELP_TEXT,
                vod_play_from: '探针',
                vod_play_url: '📖 查看说明$about',
            }]};
        }
        // 兜底：普通条目被点进详情 → 直接呈现探测结果
        const probe = PROBES[id];
        if (!probe) return {list: []};
        let out;
        try {
            out = String(await probe(ctx));
        } catch (e) {
            out = '❌ ' + e.message;
        }
        return {list: [{
            vod_id: id,
            vod_name: '探针结果 · ' + id,
            vod_content: out,
            vod_play_from: '探针',
            vod_play_url: '📖 查看结果$' + id,
        }]};
    },

    async play(ctx, flag, id, flags) {
        // 探针源无视频：说明/结果条目走 novel:// 阅读视图（壳子识别该前缀
        // 改写 PlayType.novel，不加载视频播放器）。载荷 = JSON {title, content}
        if (id === 'about') {
            return {
                parse: 0, jx: 0, header: {},
                url: 'novel://' + JSON.stringify({
                    title: 'drpy3 能力探针 · 使用说明',
                    content: HELP_TEXT,
                }),
            };
        }
        const probe = PROBES[id];
        let out;
        try {
            out = probe ? String(await probe(ctx)) : '未知探针: ' + id;
        } catch (e) {
            out = '❌ ' + e.message;
        }
        console.log('[probe] play ' + id + '\n' + out);
        return {
            parse: 0, jx: 0, header: {},
            url: 'novel://' + JSON.stringify({
                title: '探针 · ' + id,
                content: '[probe] 实测结果（logcat 有全量）\n\n' + out,
            }),
        };
    },
};
