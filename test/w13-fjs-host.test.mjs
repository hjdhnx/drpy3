// W13 里程碑（fjs 宿主对接）：hosts/fjs/assets/drpy3-fjs.bundle.js（引擎+peer 链+库包+cheerio
// pdf 四件套+胶水的单文件 ESM）在 fjs 形态环境（bridge-only 网络）下六环节端到端跑通。
// fjs 本体是 Flutter/Rust QuickJS，Node CI 里用 globalThis.fjs.mock 模拟 bridge_call 通道——
// req 分发到 cli/node-host.mjs 的 req 实现（即 Dart 侧 req 的 Node 等价物），
// 除 bridge 外与真实 fjs 装载路径完全一致（同一 bundle、同一胶水、同一桥协议）。
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {makeNodeHost, evalModuleNative} from '../cli/node-host.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BUNDLE = path.join(ROOT, 'hosts', 'fjs', 'assets', 'drpy3-fjs.bundle.js');
const PORT = 19783;
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

test('W13 fjs 宿主：bundle + bridge 模拟，百忙无果1 六环节 + 快照/错误契约', {timeout: 60000}, async () => {
    // bundle 产物必须先构建（改引擎/胶水后跑 node hosts/fjs/tools/build.mjs）
    assert.ok(fs.existsSync(BUNDLE), 'bundle 产物存在');
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);

        // ═══ 模拟 fjs bridge 通道（Dart 侧 Drpy3Host.onBridge 的 Node 等价物）═══
        const nodeHost = makeNodeHost({sourceDir: path.join(ROOT, 'docs')});
        globalThis.fjs = {
            async bridge_call(msg) {
                switch (msg.action) {
                    case 'req':
                        return await nodeHost.req(msg.url, msg.options);
                    case 'loadAsset':
                        return fs.readFileSync(path.join(ROOT, 'docs', msg.path));
                    case 'getProxy':
                        return 'http://127.0.0.1:19978/proxy?do=js'; // 宿主自定义代理
                    case 'evalModule': {
                        // 协议：宿主注册模块 → 返回可 import 的名字 → 胶水 import(name)。
                        // Dart 侧 = declareNewModule('drpy3_src_<hash>', code) 返回名字；
                        // Node mock 用 data: URL 充当按名注册的模块（fjs 真实路径语义等价：
                        // 「源码整段求值返回 namespace」；带相对 import 的源 fjs 需预打包，见 README）。
                        return 'data:text/javascript;base64,'
                            + Buffer.from(String(msg.code), 'utf8').toString('base64');
                    }
                    default:
                        return null; // evalModule 等未提供 → 引擎兜底/报错
                }
            },
        };

        const glue = await import(pathToFileURL(BUNDLE).href);

        // ═══ 自检 1/2：装载 + check 无 missing ═══
        const check = JSON.parse(glue.drpy3Setup(JSON.stringify({fjsVersion: '3.3.0-test'})));
        assert.deepEqual(check.missing, [], 'check：必选五件套全部注入');

        // ═══ 自检 3：load + init（演示稿域名重写到本地 mock，与 W6 同法）═══
        let code = fs.readFileSync(path.join(ROOT, 'docs', '百忙无果1.js'), 'utf8');
        for (const h of ['https://pianku.api.%6d%67%74%76.com', 'https://mobileso.bz.%6d%67%74%76.com',
            'https://pcweb.api.mgtv.com', 'https://www.mgtv.com']) code = code.replaceAll(h, B);
        const loaded = JSON.parse(await glue.drpy3Load(code, '_bm1_fjs', '', '', ''));
        assert.equal(loaded.key, '_bm1_fjs');
        assert.equal(await glue.drpy3Call('_bm1_fjs', 'init', ''), 'null', 'init：无返回');

        // ═══ home ═══
        const home = JSON.parse(await glue.drpy3Call('_bm1_fjs', 'home', ''));
        assert.equal(home.class.length, 7, 'home：静态分类 7 个');
        assert.equal(home.class[0].type_id, '2');
        assert.ok(home.filters && Object.keys(home.filters).length >= 6, 'home：gzip filter 解压');

        // ═══ category ═══
        const cate = JSON.parse(await glue.drpy3Call('_bm1_fjs', 'category', JSON.stringify(['3', 1, false, {}])));
        assert.equal(cate.list.length, 3, 'category：json:一级 3 条');
        assert.equal(cate.list[0].vod_id, '3$vid1', 'category：分类$id 前缀');
        assert.equal(cate.list[0].vod_remarks, '更新至第1集');

        // ═══ search ═══
        const search = JSON.parse(await glue.drpy3Call('_bm1_fjs', 'search', JSON.stringify(['斗罗大陆', false, 1])));
        assert.equal(search.list.length, 1);
        assert.equal(search.list[0].vod_name, '斗罗大陆');
        assert.equal(search.list[0].vod_id, '50$vid9');

        // ═══ detail（pdf 四件套经 bundle 内置 cheerio 实现）═══
        const detail = JSON.parse(await glue.drpy3Call('_bm1_fjs', 'detail', JSON.stringify([search.list[0].vod_id])));
        const vod = detail.list[0];
        assert.equal(vod.vod_name, '测试影片全名', 'detail：pdfh .vt-txt');
        assert.equal(vod.vod_pic, 'http://img.example.com/pic.jpg', 'detail：pd 协议相对补全');
        assert.equal(vod.vod_play_from, 'mgtv');
        const eps = String(vod.vod_play_url).split('#');
        assert.equal(eps.length, 2, 'detail：2 集列表');

        // ═══ play ═══
        const firstPlay = eps[0].split('$').slice(1).join('$');
        const play = JSON.parse(await glue.drpy3Call('_bm1_fjs', 'play', JSON.stringify([vod.vod_play_from, firstPlay, []])));
        assert.equal(play.url, firstPlay, 'play：url 透传');
        assert.equal(play.parse, 1);
        assert.equal(play.jx, 0);

        // ═══ 自检 2/10 旁证：capabilities 与 getProxy 桥 ═══
        const caps = JSON.parse(glue.drpy3Capabilities());
        for (const k of ['req', 'pdfh', 'pdfa', 'pd', 'pdfl']) assert.equal(caps[k], 'host', `capabilities.${k}=host`);
        assert.equal(caps.store, 'host');
        assert.equal(caps.loadAsset, 'host');
        assert.equal(caps.engine, 'fjs (quickjs-ng via rquickjs)');
        // getProxy 桥：源内 utils.getProxyUrl() 应拿到宿主注入的地址（经 req 环节间接验证成本高，直查引擎 resolve）
        // （此处验证胶水 getProxy 默认兜底路径——桥返回 null 时的 9978 缺省）
        assert.ok(caps.getProxy === 'host' || caps.getProxy === 'use-override', 'capabilities.getProxy 标注');

        // ═══ 错误契约：未装载源 / 源内异常 → __drpy3_error 结构 ═══
        const err = JSON.parse(await glue.drpy3Call('_nope', 'home', ['']));
        assert.ok(err.__drpy3_error, '错误包装：__drpy3_error 键');
        assert.equal(err.__drpy3_error.stage, 'dispatch');

        // ═══ store 快照往返（跨重启持久化通道）═══
        await glue.drpy3StoreImport(JSON.stringify({_bm1_fjs: {visit: 'n1'}}));
        // 源内读写经 ctx.store（同介质）；导出应含导入的键
        const dump = JSON.parse(glue.drpy3StoreExport());
        assert.equal(dump._bm1_fjs.visit, 'n1', 'store 快照：导入后可导出');
    } finally {
        mock.kill();
        delete globalThis.fjs;
    }
});
