#!/usr/bin/env node
// drpy3 源数据查看器：拿 dist/drpy3.js 单文件（可读版产物）顺序调用六环节，
// 每个接口打印输入与返回数据（util.inspect 自动截断：数组前几条/长串截断/限深度），看大概即可。
//
// 用法：
//   node cli/drpy3-inspect.mjs                       # 默认跑两个标杆源（live 真网）
//   node cli/drpy3-inspect.mjs docs/央视频-1.js      # 指定单个源
//   node cli/drpy3-inspect.mjs docs/百忙无果1.js --wd 斗罗大陆
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import util from 'node:util';
import fs from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

// ═══ 引擎：dist/drpy3.js 单文件形态（drpy2.js 同款双文件用法，peer 引用旁边的 core-lite）═══
// core-lite 的 script-loader chunk 在 Node 上有一条已知非致命告警（附录 C），导入窗口内静音
const _nativeError = console.error;
console.error = (...a) => (typeof a[0] === 'string' && a[0].startsWith('[Script Loader]') ? undefined : _nativeError(...a));
const {Runtime} = await import(pathToFileURL(path.join(ROOT, 'dist', 'drpy3.js')).href);
console.error = _nativeError;
// ═══ Node 宿主环境：HTTP（node:http）+ jsoup 解析三件套（drpy-node 生产实现）═══
const {makeNodeHost} = await import(pathToFileURL(path.join(HERE, 'node-host.mjs')).href);

const BENCHMARKS = [
    'docs/百忙无果1.js',
    'docs/央视频-1.js',
];

const args = process.argv.slice(2);
const wdIdx = args.indexOf('--wd');
const WD = wdIdx > -1 ? args[wdIdx + 1] : '斗罗大陆';
const sources = args.length && !args[0].startsWith('--') ? [args[0]] : BENCHMARKS;

const line = (s = '') => console.log(s);
const head = (s) => line(`\n\x1b[1;36m${'═'.repeat(8)} ${s} ${'═'.repeat(8)}\x1b[0m`);

/** 截断展示：数组前 3 条、字符串 60 字符、对象深度 2 */
function fmt(value) {
    return util.inspect(value, {
        depth: 2, maxArrayLength: 3, maxStringLength: 60, breakLength: 110, colors: process.stdout.isTTY,
    });
}

async function inspectSource(relFile) {
    const file = path.isAbsolute(relFile) ? relFile : path.join(ROOT, relFile);
    const srcName = path.basename(file);
    head(`源：${srcName}（引擎：dist/drpy3.js 单文件）`);
    const code = fs.readFileSync(file, 'utf8');

    const host = makeNodeHost({
        sourceDir: path.dirname(file),
        log: () => {}, // 引擎内部日志不刷屏
    });
    // 逐条显示每个环节实际发出的 HTTP 请求
    const innerReq = host.req;
    host.req = async (url, options) => {
        const res = await innerReq(url, options);
        const size = typeof res.content === 'string' ? `${res.content.length} 字符` : `${res.content.byteLength} 字节`;
        line(`   \x1b[2m→ HTTP ${url.slice(0, 110)}（${size}${res.headers.error ? `，错误: ${res.headers.error}` : ''}）\x1b[0m`);
        return res;
    };

    const rt = new Runtime(host);
    let vodId = '';
    let playFrom = '';
    let playUrl = '';

    // ① init
    head('① init（装载源码并初始化）');
    const src = await rt.load(code, {key: '_inspect_' + srcName});
    await src.init('');
    line(`← rule.host = ${fmt(src.rule.host)}`);
    line(`← meta.title = ${fmt(src.meta.title)}`);
    line(`← capabilities = ${fmt({wasm: src.rt.capabilities.wasm, engine: src.rt.capabilities.engine})}`);

    // ② home
    head('② home（分类 + 筛选）');
    const home = await src.home('');
    line(`← ${fmt(home)}`);

    // ③ category：逐个分类试到有数据为止（有的分类在真站就是空集）
    const cateIds = (home.class || []).map((c) => c.type_id);
    if (!cateIds.length) cateIds.push('1');
    let cate = {list: []};
    let tid = cateIds[0];
    for (const cid of cateIds) {
        tid = cid;
        head(`③ category（一级列表，tid=${cid}）`);
        cate = await src.category(cid, 1, false, {});
        line(`← 共 ${cate.list?.length ?? 0} 条，page=${cate.page} pagecount=${cate.pagecount}`);
        line(`← 前 2 条：${fmt(cate.list?.slice(0, 2))}`);
        if (cate.list?.length) break;
        line(`\x1b[2m（该分类真站返回空，试下一个分类）\x1b[0m`);
    }
    vodId = cate.list?.[0]?.vod_id || '';

    // ④ search
    head(`④ search（搜索「${WD}」）`);
    const search = await src.search(WD, false, 1);
    const searchCount = search?.list?.length ?? 0;
    line(`← ${fmt(search)}`);
    if (searchCount > 0 && !vodId.includes('$') && !vodId.includes('###')) vodId = search.list[0].vod_id;
    if (searchCount === 0) {
        const noCap = !search || Object.keys(search).length === 0;
        line(`\x1b[2m（${noCap ? '源未提供搜索规则/钩子，返回空对象' : '0 条：live 真站搜索可能加验/风控'}；下面用 category 的 vod_id 继续）\x1b[0m`);
    }

    // ⑤ detail（网络级失败优雅显示，不中断整个源）
    head(`⑤ detail（二级详情，vod_id=${String(vodId).slice(0, 60) || '（无）'}）`);
    if (!vodId) {
        line(`\x1b[33m⚠ search/category 均未取得 vod_id，跳过 detail/play\x1b[0m`);
        line(`\x1b[2m说明：live 真站对该源的请求返回了空数据（演示稿取参与真站实际接口不匹配，或本机网络对该接口不可达）。\x1b[0m`);
        line(`\x1b[2m查看标准数据形态可跑离线回放：node cli/drpy3-test.mjs ${relFile} --replay\x1b[0m`);
        head(`⚠️ ${srcName} 无可用 vod_id，终止后续环节`);
        return;
    }
    let vod = null;
    try {
        const detail = await src.detail(vodId);
        vod = detail.list?.[0];
    } catch (e) {
        line(`\x1b[31m✗ detail 失败：${e.error || e.message}\x1b[0m`);
        line(`\x1b[2m提示：${e.hint || '常见原因是目标站接口在本机网络不可达（如 TLS 被断）或返回结构变化'}\x1b[0m`);
        head(`⚠️ ${srcName} detail 不可用，终止后续环节`);
        return;
    }
    if (!vod) throw new Error('detail 未返回 vod');
    const {vod_play_url, ...vodFields} = vod; // vod_play_url 单独展示（选集行）
    line(`← vod 字段：${fmt(vodFields)}`);
    const eps = String(vod_play_url || '').split('#');
    line(`← 选集共 ${eps.length} 条，前 2 条：${fmt(eps.slice(0, 2))}`);
    playFrom = vod.vod_play_from || '';
    playUrl = eps[0]?.split('$').slice(1).join('$') || '';

    // ⑥ play
    head(`⑥ play（播放，flag=${playFrom}）`);
    const play = await src.play(playFrom, playUrl, []);
    line(`← ${fmt(play)}`);

    head(`✅ ${srcName} 六环节完成`);
}

for (const s of sources) {
    try {
        await inspectSource(s);
    } catch (e) {
        head(`❌ ${s} 中断`);
        line(`错误：${e.message}`);
        if (e.hint) line(`提示：${e.hint}`);
    }
}
line('');
