#!/usr/bin/env node
// drpy3 test（§14.3 官方自测 CLI）：六环节冒烟 init/home/category/search/detail/play
//   node cli/drpy3-test.mjs <源.js> [--wd 关键词] [--tid 分类id] [--record] [--replay]
//                           [--lib <文件=目标相对路径>]... [--asset <文件=目标相对路径>]...
//   --record  启动本地 mock（无网环境）录制请求/响应到 docs/fixtures/<源名>.fixtures.json
//   --replay  离线回放 fixtures（CI/无网，零网络）
// 输出：机器可读 {stage, ok, ...} JSON + 人类可读摘要，退出码 0/1。
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const {makeNodeHost} = await import(pathToFileURL(path.join(HERE, 'node-host.mjs')).href);
const {Runtime} = await import(pathToFileURL(path.join(ROOT, 'src', 'drpy3', 'index.js')).href);

// 标杆源已知宿主域名 → 本地 mock（--record 时改写；生产 --record 直连真站无需改写）
const BENCH_HOSTS = [
    'https://pianku.api.%6d%67%74%76.com', 'https://mobileso.bz.%6d%67%74%76.com',
    'https://mobileso.bz.mgtv.com', 'https://pcweb.api.mgtv.com', 'https://www.mgtv.com',
    'https://api.cntv.cn', 'https://pcweb.api.cntv.cn', 'https://vdn.apps.cntv.cn',
    'https://search.cctv.com', 'https://tv.cctv.com',
];

function parseArgs(argv) {
    const opts = {libs: [], assets: [], wd: '斗罗大陆'};
    opts.source = argv[0];
    for (let i = 1; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--wd') opts.wd = argv[++i];
        else if (a === '--tid') opts.tid = argv[++i];
        else if (a === '--record') opts.record = true;
        else if (a === '--replay') opts.replay = true;
        else if (a === '--lib' || a === '--asset') opts[a.slice(2) + 's'].push(argv[++i]);
        else if (a === '--fixtures') opts.fixtures = argv[++i];
    }
    return opts;
}

function stageSource(opts, code) {
    const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drpy3-test-'));
    fs.writeFileSync(path.join(stageDir, 'source.js'), code);
    for (const spec of opts.libs) stageCopy(spec, stageDir);
    for (const spec of opts.assets) stageCopy(spec, stageDir);
    return stageDir;
}

function stageCopy(spec, stageDir) {
    const [src, dst] = spec.split('=');
    const dstAbs = path.join(stageDir, dst);
    fs.mkdirSync(path.dirname(dstAbs), {recursive: true});
    fs.copyFileSync(src, dstAbs);
}

async function startMock() {
    const port = 19000 + Math.floor(Math.random() * 2000);
    const child = spawn(process.execPath, [path.join(HERE, '..', 'test', 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(port)}, stdio: 'ignore',
    });
    const base = `http://127.0.0.1:${port}`;
    const start = Date.now();
    while (Date.now() - start < 10000) {
        const ok = await new Promise((resolve) => {
            const req = http.get(base + '/rider/list?probe=1', (res) => {
                res.resume();
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.setTimeout(800, () => { req.destroy(); resolve(false); });
        });
        if (ok) return {child, base};
        await new Promise((r) => setTimeout(r, 120));
    }
    child.kill();
    throw new Error('mock 服务器启动失败');
}

const toB64 = (u8) => Buffer.from(u8).toString('base64');
const fromB64 = (b64) => new Uint8Array(Buffer.from(b64, 'base64'));

const MOCK_BASE = 'http://drpy3.mock';

const VOLATILE_QUERY = /([?&])(ts|sign|timestamp|nonce|_t)=[^&]*/g;

/** 回放 key：剔除易变 query（ts/sign 等签名时间戳），其余 URL 全匹配 */
function reqKey(url, options) {
    const norm = String(url).replace(VOLATILE_QUERY, '$1');
    return `${(options && options.method) || 'GET'}|b${(options && options.buffer) || 0}|${norm}`;
}

function serializeResponse(res) {
    const content = res && res.content;
    const out = {content: content instanceof Uint8Array ? undefined : (content == null ? '' : String(content)), headers: (res && res.headers) || {}};
    if (content instanceof Uint8Array) out.__bytes_b64 = toB64(content);
    return out;
}

function wrapReqForRecord(reqImpl, store) {
    return async (url, options) => {
        const res = await reqImpl(url, options);
        store.push({key: reqKey(url, options), url, ...serializeResponse(res)});
        return res;
    };
}

function wrapReqForReplay(store) {
    const byKey = new Map(store.map((e) => [e.key, e]));
    return async (url, options) => {
        const hit = byKey.get(reqKey(url, options));
        if (!hit) return {content: '', headers: {error: `[replay miss] ${url}`}};
        const content = hit.__bytes_b64 !== undefined ? fromB64(hit.__bytes_b64) : hit.content;
        return {content, headers: hit.headers || {}};
    };
}

// ═══ 六环节（§14.3）═══
async function main() {
    const opts = parseArgs(process.argv.slice(2));
    if (!opts.source) {
        console.error('用法: drpy3 test <源.js> [--wd 词] [--tid id] [--record|--replay] [--lib a=b]... [--asset a=b]...');
        process.exit(2);
    }
    const srcName = path.basename(opts.source);
    const fixturesPath = opts.fixtures || path.join(ROOT, 'docs', 'fixtures', srcName.replace(/\.(m?js)$/, '') + '.fixtures.json');

    let mock = null;
    let code = fs.readFileSync(opts.source, 'utf8');
    // 已知宿主域名 → 规范 mock 域（record/replay 一致，fixtures 存规范 URL，回放零网络）
    if (opts.record || opts.replay) {
        for (const h of BENCH_HOSTS) code = code.split(h).join(MOCK_BASE);
    }
    if (opts.record) mock = await startMock();

    const stageDir = stageSource(opts, code);
    let rawReq = null;
    let fixtureStore = [];
    if (opts.record) {
        rawReq = null; // 用宿主 req（直连 mock）
    } else if (opts.replay) {
        fixtureStore = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
        rawReq = wrapReqForReplay(fixtureStore);
    }

    // 宿主日志全部走 stderr——stdout 只承载机器可读 JSON（§14.3）
    const host = makeNodeHost({sourceDir: stageDir, log: (...args) => console.error('[drpy3]', ...args)});
    if (opts.record) {
        const inner = host.req;
        const recorded = [];
        host.req = async (url, options) => {
            // 规范 mock 域 → 真实本地 mock 端口；fixtures 记录规范 URL
            const real = await inner(String(url).replace(MOCK_BASE, mock.base), options);
            recorded.push({key: reqKey(url, options), url, ...serializeResponse(real)});
            return real;
        };
        host.__recorded = recorded;
    } else if (opts.replay) {
        host.req = rawReq;
    }

    const rt = new Runtime(host);
    const results = [];
    const t0 = Date.now();
    let src = null;
    let vodId = opts.tid || '';
    let playFrom = '';
    let playUrl = '';

    const step = async (stage, fn) => {
        const s = Date.now();
        try {
            const out = await fn();
            results.push({stage, ok: true, ms: Date.now() - s, out});
            return out;
        } catch (e) {
            const diag = {stage, ok: false, ms: Date.now() - s, error: e.message, hint: e.hint || '', rule: e.rule || '', source: src ? (src.meta && src.meta.title) || src.key : srcName};
            if (e.toJSON) Object.assign(diag, e.toJSON());
            results.push(diag);
            return null;
        }
    };

    await step('init', async () => {
        src = await rt.load(code, {key: '_cli_' + srcName});
        await src.init('');
        return {host: src.rule.host, title: src.meta.title};
    });
    if (results.every((r) => r.ok)) {
        await step('home', async () => {
            const home = await src.home('');
            if (!Array.isArray(home.class)) throw new Error('home 未返回 class 数组');
            if (!vodId && home.class[0]) vodId = home.class[0].type_id;
            return {class: home.class.length, filters: Object.keys(home.filters || {}).length};
        });
        await step('category', async () => {
            const cate = await src.category(vodId || '1', 1, false, {});
            if (!cate || !Array.isArray(cate.list)) throw new Error('category 未返回 list');
            if (cate.list[0]) { vodId = cate.list[0].vod_id; playFrom = cate.list[0].vod_play_from || ''; }
            return {list: cate.list.length, first: cate.list[0] && cate.list[0].vod_id};
        });
        await step('search', async () => {
            const search = await src.search(opts.wd, false, 1);
            if (!search || typeof search !== 'object') throw new Error('search 返回非对象');
            // search 有结果且当前 vodId 尚未带路由上下文时优先用搜索结果；否则沿用 home/category 的 vod_id
            if (search.list && search.list[0] && !vodId.includes('$') && !vodId.includes('###')) {
                vodId = search.list[0].vod_id || vodId;
            }
            return {list: search.list ? search.list.length : 0};
        });
        const stepSkippable = async (stage, fn, reason) => {
            if (reason) {
                results.push({stage, ok: true, skip: reason});
                return null;
            }
            return await step(stage, fn);
        };
        await stepSkippable('detail', async () => {
            const detail = await src.detail(vodId);
            const vod = detail && detail.list && detail.list[0];
            if (!vod) throw new Error('detail 未返回 vod');
            playFrom = vod.vod_play_from || playFrom;
            playUrl = String(vod.vod_play_url || '').split('#')[0].split('$').slice(1).join('$');
            return {name: vod.vod_name, eps: String(vod.vod_play_url || '').split('#').length};
        }, !vodId ? 'search/category 均无 vod_id，无法测 detail' : '');
        await stepSkippable('play', async () => {
            const play = await src.play(playFrom, playUrl, []);
            if (!play || !('url' in play) && !('urls' in play)) throw new Error('play 未返回 url/urls');
            return {parse: play.parse, jx: play.jx, url: (play.url || (play.urls && play.urls[1]) || '').slice(0, 80)};
        }, !playUrl ? '无有效选集链接' : '');
    }
    if (mock) mock.child.kill();
    fs.rmSync(stageDir, {recursive: true, force: true});

    // 产出
    const failed = results.filter((r) => !r.ok);
    const out = {source: srcName, mode: opts.record ? 'record' : (opts.replay ? 'replay' : 'live'), ok: failed.length === 0 && results.length >= 6, stages: results, totalMs: Date.now() - t0};
    console.log('===DRPY3_RESULT===');
    console.log(JSON.stringify(out));
    for (const r of results) {
        const note = r.skip ? ` — ${r.skip}` : (r.error ? ` — ${r.error}` : '');
        console.error(`${r.ok ? (r.skip ? 'SKIP' : 'PASS') : 'FAIL'} ${r.stage}${r.ms != null ? ` (${r.ms}ms)` : ''}${note}`);
    }
    if (opts.record && host.__recorded) {
        fs.mkdirSync(path.dirname(fixturesPath), {recursive: true});
        fs.writeFileSync(fixturesPath, JSON.stringify(host.__recorded, null, 1));
        console.error(`fixtures 已录制: ${fixturesPath}（${host.__recorded.length} 条请求）`);
    }
    process.exit(out.ok ? 0 : 1);
}

main().catch((e) => {
    console.error('[drpy3] test 运行失败:', e.message);
    process.exit(1);
});
