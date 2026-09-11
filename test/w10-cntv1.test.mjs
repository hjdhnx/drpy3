// W10 验收（金标准 B）：docs/央视频-1.js（wasm 解密播放形态）六环节 + 本地代理解密链路。
// wasm 用桩（test/fixtures/cntv-wasm-stub.cjs，Emscripten MODULARIZE 胶水形态），
// 但 lib.wasm.load 的托管语义（胶水识别/垫片/就绪等待/按路径缓存）是真实现（W5 单测覆盖）。
// 源码原样加载（仅把 cntv 域名重写到本地 mock），不改一行迁就实现。
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Runtime} from '../src/drpy3/index.js';
import {makeNodeHost} from '../cli/node-host.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PORT = 19774;
const B = `http://127.0.0.1:${PORT}`;

async function waitMockReady(base, timeoutMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const ok = await new Promise((resolve) => {
            const req = http.get(base + '/rider/list?probe=1', (res) => {
                res.resume();
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.setTimeout(1000, () => { req.destroy(); resolve(false); });
        });
        if (ok) return;
        await new Promise((r) => setTimeout(r, 150));
    }
    throw new Error('mock 服务器未就绪: ' + base);
}

/** staged 源目录：源.js（重写域名）+ cntv-wasm.cjs（wasm 桩）——镜像"源目录包"分发形态 */
function stageSource(stageDir) {
    fs.mkdirSync(stageDir, {recursive: true});
    let code = fs.readFileSync(path.join(ROOT, 'docs', '央视频-1.js'), 'utf8');
    for (const h of ['https://api.cntv.cn', 'https://pcweb.api.cntv.cn', 'https://vdn.apps.cntv.cn',
        'https://search.cctv.com', 'https://tv.cctv.com']) code = code.replaceAll(h, B);
    fs.writeFileSync(path.join(stageDir, 'source.js'), code);
    fs.copyFileSync(path.join(HERE, 'fixtures', 'cntv-wasm-stub.cjs'), path.join(stageDir, 'cntv-wasm.cjs'));
}

test('W10 金标准B：央视频-1.js 六环节（wasm 解密播放形态）', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drpy3-cntv-'));
        stageSource(stageDir);
        const code = fs.readFileSync(path.join(stageDir, 'source.js'), 'utf8');

        const rt = new Runtime(makeNodeHost({sourceDir: stageDir}));
        const src = await rt.load(code, {key: '_cntv1'});
        assert.equal(src.form, 'enhanced', '含钩子 → 增强源');

        // ═══ init（默认：无 init 钩子）═══
        await src.init('');
        assert.equal(src.rule.headers['user-agent'], 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1', 'init：headers 基线（iPad UA）');

        // ═══ home（声明式：class_name/class_url + 原生 JSON filter）═══
        const home = await src.home('');
        assert.equal(home.class.length, 5, 'home：5 个分类');
        assert.deepEqual(home.class.map((c) => c.type_id), ['column', 'tv', 'zy', 'jl', 'live']);
        assert.ok(home.filters.tv && home.filters.tv['年份'], 'home：原生 JSON filter');

        // ═══ category（钩子：片库 API）═══
        const cate = await src.category('电视剧', 1, false, {});
        assert.equal(cate.list.length, 2, 'category：2 条');
        assert.equal(cate.list[0].vod_name, '央视影片1');
        const vodId = cate.list[0].vod_id;
        assert.equal(vodId.split('###').length, 7, 'category：vod_id 自带 ### 上下文');

        // ═══ search（无 searchUrl/搜索 → 空对象，能力声明 searchable=2 属源配置）═══
        const search = await src.search('新闻', false, 1);
        assert.deepEqual(search, {});

        // ═══ detail（钩子：episodesList → 选集）═══
        const detail = await src.detail(vodId);
        const vod = detail.list[0];
        assert.equal(vod.vod_name, '央视影片1', 'detail：vod_name 透传');
        assert.equal(vod.vod_play_from, 'cntv');
        const eps = String(vod.vod_play_url).split('#');
        assert.equal(eps.length, 2, 'detail：2 集');
        assert.ok(eps[0].startsWith('第1集$http://127.0.0.1'), 'detail：第N集$链接');

        // ═══ play（钩子：高清 2000 走本地代理 + 850/450 直连）═══
        const play = await src.play(vod.vod_play_from, eps[0].split('$')[1], []);
        assert.equal(play.parse, 0, 'play：parse=0 直连');
        assert.equal(play.urls.length, 6, 'play：3 线路 6 项');
        assert.equal(play.urls[0], '2000Proxy');
        const proxyBase = 'http://127.0.0.1:9978/proxy?do=js';
        assert.ok(play.urls[1].startsWith(proxyBase + '&url=' + encodeURIComponent(B + '/hls/2000.m3u8')), 'play：2000 代理地址');
        assert.ok(play.urls[1].includes('_type=m3u8'), 'play：m3u8 标记');
        assert.equal(play.urls[2], '850');
        assert.ok(play.urls[3].includes('/850'), 'play：850 直连');
        assert.equal(play.header['user-agent'], 'Dalvik/2.1.0 (Linux; U; Android 7.0)');

        // ═══ proxy（五元组契约 §10.1）：m3u8 重写 ═══
        const m3u8Resp = await src.proxy({url: B + '/hls/2000/ep1.m3u8', _type: 'm3u8'});
        assert.equal(m3u8Resp[0], 200);
        assert.equal(m3u8Resp[1], 'application/vnd.apple.mpegurl');
        const lines = m3u8Resp[2].split('\n');
        assert.ok(lines[4].startsWith(proxyBase + '&url=' + encodeURIComponent(B + '/hls/2000/seg0.ts')), 'proxy：相对分片改写回代理');
        assert.ok(lines[6].includes(encodeURIComponent('https://cdn.example.com/abs/seg1.ts')), 'proxy：绝对分片改写');
        assert.ok(lines[8].includes('_type=m3u8'), 'proxy：子列表标记 m3u8');

        // ═══ proxy：TS 分片 wasm 解密（toBytes=1，base64 转字节回包）═══
        const tsResp = await src.proxy({url: B + '/seg/seg0.ts'});
        assert.equal(tsResp[0], 200);
        assert.equal(tsResp[1], 'video/MP2T');
        assert.equal(tsResp[4], 1, 'proxy：toBytes=1（base64→字节）');
        const tsBytes = Buffer.from(tsResp[2], 'base64');
        assert.equal(tsBytes.length % 188, 0, 'proxy：解密回包为完整 TS 包');
        assert.equal(tsBytes[0], 0x47, 'proxy：TS 同步字节完好');

        fs.rmSync(stageDir, {recursive: true, force: true});
    } finally {
        mock.kill();
    }
});
