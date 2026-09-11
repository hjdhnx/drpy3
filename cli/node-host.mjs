// Node HostEnv 最小实现（W11 的"Node 完全体"前置；本会话仅作开发验证介质）。
// 异步档位 A（原生 loop 真并发，§5.4）。
// ⚠️ req 必须用 node:http 实现：dist/drpy-core-lite.min.js 会用自带 node-fetch polyfill 覆盖
// globalThis.fetch，且其 http 底座是浏览器 shim（对本地端口连接失败）——原生 http 不可被污染。
// pdf 三件套复用 drpy-node 生产实现 htmlParser.js（cheerio 版 jsoup 封装）——严禁手写解析器。
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import {execFileSync} from 'node:child_process';
import {pathToFileURL, fileURLToPath} from 'node:url';

// pdf 三件套实现位置：默认 drpy-node 生产实现（DRPY_HTML_PARSER 环境变量可覆盖）
const PARSER_URL = process.env.DRPY_HTML_PARSER
    ? pathToFileURL(process.env.DRPY_HTML_PARSER).href
    : 'file:///E:/gitwork/drpy-node/libs_drpy/htmlParser.js';
const nativeLog = console.log;
console.log = () => {}; // 仅解析器模块求值窗口内静默初始化日志
const _parserMod = await import(PARSER_URL);
console.log = nativeLog;
const jsoup = _parserMod.jsoup;

const HERE_DIR = path.dirname(fileURLToPath(import.meta.url));
const CORE_INDEX_URL = pathToFileURL(path.resolve(HERE_DIR, '..', 'src', 'drpy3', 'index.js')).href;

const BINARY_EXT = new Set(['.wasm', '.ts', '.mp4', '.m4s', '.jpg', '.png', '.gif', '.webp']);

/** 单次 HTTP 请求（node:http，重定向不跟随）→ {status, headers, body:Buffer} */
function rawRequest(url, {method = 'GET', headers = {}, body = null, timeoutMs = 5000}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const mod = u.protocol === 'https:' ? https : http;
        const req = mod.request(
            {
                protocol: u.protocol,
                hostname: u.hostname,
                port: u.port || (u.protocol === 'https:' ? 443 : 80),
                path: u.pathname + u.search,
                method,
                headers,
            },
            (res) => {
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => resolve({status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks)}));
            },
        );
        req.setTimeout(timeoutMs, () => req.destroy(new Error(`timeout ${timeoutMs}ms`)));
        req.on('error', reject);
        if (body != null && method !== 'GET' && method !== 'HEAD') req.write(body);
        req.end();
    });
}

/** fetch 语义的请求：跟随重定向（≤5 跳），返回 {status, headers(普通对象), body:Buffer} */
async function httpRequest(url, init = {}) {
    let current = String(url);
    let method = (init.method || 'GET').toUpperCase();
    const headers = {...(init.headers || {})};
    let body = init.body != null ? init.body : null;
    for (let hop = 0; hop < 5; hop++) {
        const res = await rawRequest(current, {method, headers, body, timeoutMs: init.timeoutMs});
        if ([301, 302, 303, 307, 308].includes(res.status) && res.headers.location) {
            const next = new URL(res.headers.location, current).href;
            if (res.status === 303 || ((res.status === 301 || res.status === 302) && method === 'POST')) {
                method = 'GET';
                body = null;
            }
            current = next;
            continue;
        }
        const flat = {};
        for (const [k, v] of Object.entries(res.headers)) flat[k] = Array.isArray(v) ? v.join(', ') : v;
        return {status: res.status, headers: flat, body: res.body};
    }
    throw new Error('too many redirects');
}

/**
 * 组装 Node HostEnv
 * @param opts {sourceDir: 源文件目录（相对资产解析基准）, store: 可选持久介质, log: 可选日志}
 */
export function makeNodeHost(opts = {}) {
    const sourceDir = opts.sourceDir ? path.resolve(opts.sourceDir) : process.cwd();
    const host = {
        engine: 'node',
        version: process.version,

        // ═══ req：异步 HTTP（drpy3 契约 {content, headers}；buffer:1→Uint8Array / 2→base64）═══
        async req(url, obj = {}) {
            const o = obj || {};
            try {
                let finalUrl = String(url);
                const method = (o.method || 'GET').toUpperCase();
                const headers = {...(o.headers || {})};
                let body = null;
                if (o.data && method === 'GET') {
                    const u = new URL(finalUrl);
                    for (const [k, v] of Object.entries(o.data)) u.searchParams.set(k, String(v));
                    finalUrl = u.href;
                } else if (o.body != null && o.body !== '' && method !== 'GET') {
                    body = String(o.body);
                } else if (o.data && method !== 'GET') {
                    const hasCt = Object.keys(headers).some((k) => k.toLowerCase() === 'content-type');
                    const ctKey = Object.keys(headers).find((k) => k.toLowerCase() === 'content-type') || '';
                    if (String(headers[ctKey] || '').includes('json')) {
                        body = JSON.stringify(o.data);
                    } else {
                        body = new URLSearchParams(o.data).toString();
                        if (!hasCt) headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                }
                const res = await httpRequest(finalUrl, {method, headers, body, timeoutMs: Math.min(o.timeout || 5000, 60000)});
                const outHeaders = {status: `HTTP/1.1 ${res.status}`};
                Object.assign(outHeaders, res.headers);
                let content;
                if (o.buffer === 1) {
                    content = new Uint8Array(res.body);
                } else if (o.buffer === 2) {
                    content = res.body.toString('base64');
                } else {
                    const charset =
                        (String(res.headers['content-type'] || '').match(/charset=([\w-]+)/i) || [])[1]
                        || o.encoding || 'utf-8';
                    try {
                        content = new TextDecoder(charset).decode(res.body);
                    } catch {
                        content = res.body.toString('utf8');
                    }
                }
                return {content, headers: outHeaders};
            } catch (e) {
                // 出错不抛：返回 {content:'', headers:{error}}（drpy2 契约，个别源 try/catch 依赖）
                return {content: '', headers: {error: String(e && e.message || e)}};
            }
        },

        // ═══ syncReq：同步 HTTP 桥（load2x 兼容层片段用，档 C 契约）——curl 子进程模拟原生同步 req ═══
        syncReq: (url, obj = {}) => {
            const o = obj || {};
            const args = ['-sS', '-i', '--max-time', String(Math.min((o.timeout || 5000) / 1000, 30))];
            if (o.redirect !== 0) args.push('-L');
            for (const [k, v] of Object.entries(o.headers || {})) args.push('-H', `${k}: ${v}`);
            const method = (o.method || 'GET').toUpperCase();
            if (method !== 'GET') {
                args.push('-X', method);
                if (o.body != null && o.body !== '') args.push('--data-binary', String(o.body));
                else if (o.data && Object.keys(o.data).length) args.push('--data-binary', JSON.stringify(o.data));
            }
            args.push(encodeURI(url)); // curl 不接受原始非 ASCII URL；encodeURI 保留 ?&= 与已有 %xx
            try {
                const buf = execFileSync('curl', args, {encoding: 'buffer', maxBuffer: 64 * 1024 * 1024});
                const SEP = Buffer.from('\r\n\r\n');
                let pos = 0, bodyStart = 0, headerLines = [];
                while (true) {
                    const idx = buf.indexOf(SEP, pos);
                    if (idx < 0) break;
                    const section = buf.slice(pos, idx).toString('latin1');
                    if (/^HTTP\/[\d.]+\s/.test(section)) {
                        headerLines = section.split('\r\n');
                        bodyStart = idx + 4;
                        pos = bodyStart;
                    } else break;
                }
                const raw = buf.slice(bodyStart);
                const headers = {status: headerLines[0] || ''};
                for (const line of headerLines.slice(1)) {
                    const i = line.indexOf(':');
                    if (i > 0) headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
                }
                const charset =
                    (String(headers['content-type'] || '').match(/charset=([\w-]+)/i) || [])[1] || o.encoding || 'utf-8';
                let content;
                try {
                    content = new TextDecoder(charset).decode(raw);
                } catch {
                    content = raw.toString('utf8');
                }
                return {content: o.buffer === 2 ? raw.toString('base64') : content, headers};
            } catch (e) {
                return {content: '', headers: {error: String(e && e.message || e)}};
            }
        },

        // ═══ pdf 三件套：drpy-node 生产实现 ═══
        pdfh: (html, parse, base_url = '') => new jsoup(base_url || '').pdfh(html, parse, base_url || ''),
        pdfa: (html, parse) => new jsoup('').pdfa(html, parse),
        pd: (html, parse, base_url = '') => new jsoup(base_url || '').pd(html, parse, base_url || ''),
        pdfl: (html, parse, list_text, list_url, my_url) => new jsoup(my_url || '').pdfl(html, parse, list_text, list_url, my_url),

        // ═══ 随源资产（wasm 等）：相对源目录读文件；二进制扩展名按字节读 ═══
        // 同步返回（fs）：模式 C 的 require 语义要求同步读；wasm.load 等 await 处同样兼容
        loadAsset: (p) => {
            const abs = path.isAbsolute(p) ? p : path.join(sourceDir, p);
            if (BINARY_EXT.has(path.extname(abs).toLowerCase())) {
                return new Uint8Array(fs.readFileSync(abs));
            }
            return fs.readFileSync(abs, 'utf8');
        },

        // ═══ 模式 A：原生 ESM 模块装载（nativeEsm:false 关闭，用于模式 B 纯净装载）═══
        evalModule: opts.nativeEsm === false ? undefined : (code, srcPath) => evalModuleNative(code, srcPath, sourceDir),

        // ═══ 持久介质：内存兜底（壳子可换成文件/数据库）═══
        store: opts.store || undefined,
        log: opts.log || ((...args) => console.log('[drpy3]', ...args)),
        getProxy: () => 'http://127.0.0.1:9978/proxy?do=js',
        env: {},
    };
    return host;
}

/** 文本读取（测试/CLI 用） */
export function readSourceFile(p) {
    return fs.readFileSync(p, 'utf8');
}

// ═══════════════ 模式 A：原生 ESM 模块装载（§8.2，Node staging 实现）═══════════════
// 引擎原生 import：入口写到源目录（相对 import './lib/*' 原样可解析），bare 'drpy3' 经
// 源目录 node_modules 别名指回 drpy3-core 本体；'?bytes' 资产导入改写到生成的资产模块。
import crypto from 'node:crypto';


function hash8(s) {
    return crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
}

/** 模式 A 装载：返回源模块的 namespace（runtime 取 .default） */
export async function evalModuleNative(code, srcPath, sourceDir) {
    const base = (srcPath && !path.isAbsolute(srcPath)) ? path.join(sourceDir, srcPath) : (srcPath || path.join(sourceDir, 'source.js'));
    const dir = path.dirname(base);
    const h = hash8(String(code));

    // 1) drpy3 别名（node_modules 就近解析）
    const nmDir = path.join(dir, 'node_modules', 'drpy3');
    fs.mkdirSync(nmDir, {recursive: true});
    fs.writeFileSync(path.join(nmDir, 'package.json'), JSON.stringify({name: 'drpy3', type: 'module', main: 'index.js'}));
    fs.writeFileSync(path.join(nmDir, 'index.js'), `export * from ${JSON.stringify(CORE_INDEX_URL)};\n`);

    // 2) '?bytes' 资产导入改写 + 资产模块生成
    let out = String(code);
    const bytesImports = [...out.matchAll(/^[ \t]*import\s+([A-Za-z_$][\w$]*)\s+from\s*['"](\.[^'"]*\?bytes)['"][ \t]*;?[ \t]*$/gm)];
    if (bytesImports.length) {
        const assetsName = `.__drpy3_assets_${h}.mjs`;
        const lines = ["import {readFileSync} from 'node:fs';"];
        const named = [];
        bytesImports.forEach((m, i) => {
            const local = m[1];
            const spec = m[2].replace(/\?bytes$/, '');
            const fileUrl = pathToFileURL(path.resolve(dir, spec)).href;
            lines.push(`export const __asset_${i} = new Uint8Array(readFileSync(new URL(${JSON.stringify(fileUrl)})));`);
            named.push(`__asset_${i} as ${local}`);
            out = out.replace(m[0], `import {${named[i]}} from './${assetsName}';`);
        });
        fs.writeFileSync(path.join(dir, assetsName), lines.join('\n') + '\n');
    }

    // 3) 写入口 → 原生动态 import
    const entry = path.join(dir, `.__drpy3_entry_${h}.mjs`);
    fs.writeFileSync(entry, out);
    return await import(pathToFileURL(entry).href);
}
