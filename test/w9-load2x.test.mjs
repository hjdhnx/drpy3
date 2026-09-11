// W9 验收（金标准 C）：docs/百忙无果[官].js 原版零改动经 load2x 兼容层六环节跑通
// （对照附录 C / .smoke 基准；演示稿一行不改，仅域名重写到本地 mock）。
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Runtime} from '../src/drpy3/index.js';
import {makeNodeHost} from '../cli/node-host.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PORT = 19773;
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

test('W9 金标准C：百忙无果[官].js（drpy2 原版）经 load2x 六环节零改动跑通', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        let code = fs.readFileSync(path.join(ROOT, 'docs', '百忙无果[官].js'), 'utf8');
        for (const h of ['https://pianku.api.%6d%67%74%76.com', 'https://mobileso.bz.%6d%67%74%76.com',
            'https://pcweb.api.mgtv.com', 'https://www.mgtv.com']) code = code.replaceAll(h, B);

        const rt = new Runtime(makeNodeHost({sourceDir: path.join(ROOT, 'docs')}));
        // 原样字符串装载——drpy2 特征自动路由到兼容层（也可显式 rt.load2x）
        const src = await rt.load(code, {key: '_bm0'});
        assert.equal(src.is2x, true, '自动识别为 drpy2 兼容实例');

        // ═══ init+getRule ═══
        await src.init('');
        assert.equal(src.rule.title, '百忙无果[官]', 'init：rule.title');
        assert.equal(src.rule.host, B, 'init：host 定稿');
        assert.equal(src.is2x, true);

        // ═══ home（class_name/class_url + gzip filter）═══
        const home = await src.home('');
        assert.equal(home.class.length, 7, 'home：7 个静态分类');
        assert.equal(home.class[2].type_name, '综艺');
        assert.ok(home.filters && Object.keys(home.filters).length >= 6, 'home：filter 解压');

        // ═══ category（json: 一级 → 分类$id）═══
        const cate = await src.category('3', 1, false, {});
        assert.equal(cate.list.length, 3, 'category：3 条');
        assert.equal(cate.list[0].vod_id, '3$vid1', 'category：3$vid1 前缀语义');
        assert.equal(cate.list[0].vod_pic, 'http://img.example.com/1.jpg');
        assert.equal(cate.list[0].vod_remarks, '更新至第1集', 'category：|| 回退');

        // ═══ search（搜索 js: 片段 + setResult）═══
        const search = await src.search('斗罗大陆', false, 1);
        assert.equal(search.list.length, 1, 'search：1 条');
        assert.equal(search.list[0].vod_name, '斗罗大陆', 'search：<B> 清洗');
        assert.equal(search.list[0].vod_id, '50$vid9', 'search：rpt idx$id');

        // ═══ detail（二级 js: 片段：选集 JSON → 详情页 HTML → pdfh/pd → VOD 组装）═══
        const detail = await src.detail(search.list[0].vod_id);
        const vod = detail.list[0];
        assert.equal(vod.vod_name, '测试影片全名', 'detail：.vt-txt');
        assert.equal(vod.vod_pic, 'http://img.example.com/pic.jpg', 'detail：pd 补全');
        assert.equal(vod.vod_remarks, '已完结', 'detail：非播出时间模板');
        assert.ok(String(vod.vod_play_url).startsWith('第1集$' + B + '/b/999/vid1.html'), 'detail：选集 $ 链接');
        assert.equal(String(vod.vod_play_url).split('#').length, 2, 'detail：2 集');

        // ═══ play（play_parse → common_play）═══
        const firstPlay = String(vod.vod_play_url).split('#')[0].split('$').slice(1).join('$');
        const play = await src.play(vod.vod_play_from, firstPlay, []);
        assert.equal(play.url, firstPlay, 'play：url');
        assert.equal(play.parse, 1, 'play：parse=1');
        assert.equal(play.jx, 0, 'play：jx=0');
        assert.equal(play.flag, 'mgtv', 'play：flag');

        // ═══ 串行验证：并发调用被排队（drpy2 时序语义）═══
        const order = [];
        await Promise.all([
            src.search('a', false, 1).then(() => order.push(1)),
            src.search('b', false, 1).then(() => order.push(2)),
        ]);
        assert.deepEqual(order, [1, 2], '兼容实例自动串行');
    } finally {
        mock.kill();
    }
});
