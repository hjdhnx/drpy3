// W6 里程碑（金标准 A）：docs/百忙无果1.js（零样板·纯声明式 + 两钩子）在 drpy3 + Node HostEnv 上
// 六环节端到端跑通（init/home/category/search/detail/play，对照附录 C 数据形状）。
// 演示稿是可执行规范：原样加载（仅把 mgtv 域名重写到本地 mock），不改一行迁就实现。
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
const PORT = 19772;
const B = `http://127.0.0.1:${PORT}`;

/** 轮询等待 mock 端口就绪（http.get 探活：globalThis.fetch 会被 core-lite 的 node-fetch polyfill 污染） */
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

test('W6 金标准A：百忙无果1.js 六环节（drpy3-core 真实代码路径 + 本地 mock）', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        let code = fs.readFileSync(path.join(ROOT, 'docs', '百忙无果1.js'), 'utf8');
        for (const h of ['https://pianku.api.%6d%67%74%76.com', 'https://mobileso.bz.%6d%67%74%76.com',
            'https://pcweb.api.mgtv.com', 'https://www.mgtv.com']) code = code.replaceAll(h, B);

        const rt = new Runtime(makeNodeHost({sourceDir: path.join(ROOT, 'docs')}));
        // 注：不传 path——传入 path 会让 signature 惰性热更读到磁盘上的未重写源码而触发热更重建
        // （W3 机制验证：改源文件 → 下次调用前自动重建，此处演示稿内容与磁盘不一致属测试特例）
        const src = await rt.load(code, {key: '_bm1'});

        // ═══ init ═══
        await src.init('');
        assert.equal(src.rule.host, B, 'init：host 定稿');
        assert.equal(src.rule.url, B + '/rider/list/pcweb/v3?platform=pcweb&channelId=fyclass&pn=fypage&pc=80&hudong=1&_support=10000000&kind=a1&area=a1', 'init：host+url 拼接');
        assert.equal(src.rule.headers['User-Agent'], 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', 'init：PC_UA 常量解析');

        // ═══ home ═══
        const home = await src.home('');
        assert.equal(home.class.length, 7, 'home：静态分类 7 个');
        assert.equal(home.class[0].type_id, '2');
        assert.equal(home.class[0].type_name, '电视剧');
        assert.ok(home.filters && Object.keys(home.filters).length >= 6, 'home：gzip filter 解压');

        // ═══ category（声明式 json: 一级）═══
        const cate = await src.category('3', 1, false, {});
        assert.equal(cate.list.length, 3, 'category：json:一级 3 条');
        assert.equal(cate.list[0].vod_id, '3$vid1', 'category：分类$id 前缀');
        assert.equal(cate.list[0].vod_name, '影片1');
        assert.equal(cate.list[0].vod_remarks, '更新至第1集', 'category：|| 回退取 updateInfo');
        assert.equal(cate.page, 1);
        // filter_url 渲染：筛选条件经 jinja2
        const cate2 = await src.category('3', 1, true, {year: '2023'});
        assert.equal(cate2.list.length, 3, 'category：带筛选仍正常');

        // ═══ search（钩子：搜索嵌套取值）═══
        const search = await src.search('斗罗大陆', false, 1);
        assert.equal(search.list.length, 1, 'search：imgo 过滤后 1 条');
        assert.equal(search.list[0].vod_name, '斗罗大陆', 'search：<B> 清洗');
        assert.equal(search.list[0].vod_id, '50$vid9', 'search：rpt idx$id');
        assert.equal(search.list[0].vod_remarks, '2023,动漫');

        // ═══ detail（钩子：选集 JSON → 详情页 HTML 两段式 + all 并发）═══
        const detail = await src.detail(search.list[0].vod_id);
        const vod = detail.list[0];
        assert.equal(vod.vod_name, '测试影片全名', 'detail：pdfh .vt-txt');
        assert.equal(vod.type_name, '类型：国产动', 'detail：p:eq(0) slice');
        assert.equal(vod.vod_actor, '主演：张三 李四 王五', 'detail：p:eq(4)');
        assert.equal(vod.vod_director, '导演：测试导演', 'detail：p:eq(3)');
        assert.equal(vod.vod_pic, 'http://img.example.com/pic.jpg', 'detail：pd 协议相对补全');
        assert.equal(vod.vod_content, '这是一个用于冒烟测试的影片简介。', 'detail：简介切分');
        assert.equal(vod.vod_play_from, 'mgtv');
        const eps = String(vod.vod_play_url).split('#');
        assert.equal(eps.length, 2, 'detail：2 集列表');
        assert.ok(eps[0].startsWith('第1集$' + B + '/b/999/vid1.html'), 'detail：选集拼装');

        // ═══ play（默认引擎：common_play）═══
        const firstPlay = eps[0].split('$').slice(1).join('$');
        const play = await src.play(vod.vod_play_from, firstPlay, []);
        assert.equal(play.url, firstPlay, 'play：url 透传');
        assert.equal(play.parse, 1, 'play：默认 parse=1（待嗅探）');
        assert.equal(play.jx, 0, 'play：非正版域名 jx=0');
        assert.equal(play.flag, 'mgtv');
    } finally {
        mock.kill();
    }
});
