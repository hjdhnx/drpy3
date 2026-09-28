// drpy3-qjs bundle 端到端冒烟（node 模拟 so 全局）：
//   ① 模拟 libquickjs_bridge.so 注入的全局（cheerio/zlib/Buffer/TextEncoder(GBK via
//     iconv-lite)/TextDecoder(原生 GBK)/WebAssembly）后加载 hosts/fjs/assets/drpy3-qjs.bundle.js；
//   ② 百忙无果1.js（mgtv 重写本地 mock）六环节跑通——覆盖 pako shim（gzip filter）、
//     cheerio shim（search HTML 解析）、声明式引擎全链；
//   ③ core-qjs 的 gbkTool 与原版 gb18030 对拍（encode/decode 逐字节一致）；
//   ④ getProxy 桥不注入时 getProxyUrl 恒空串（9978 兜底废除回归）。
// 前置：drpy-webpack 同级仓库已构建（node hosts/fjs/tools/build-qjs.mjs）。
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';
import nodeZlib from 'node:zlib';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const iconv = require('iconv-lite');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PORT = 19790; // 勿与其他 test 文件撞端口（node --test 并行；w6=19772 / w10=19774）
const B = `http://127.0.0.1:${PORT}`;
const CORE_QJS = path.resolve(ROOT, '..', 'drpy-webpack', 'dist', 'drpy-core-qjs.min.js');
const BUNDLE = path.join(ROOT, 'hosts', 'fjs', 'assets', 'drpy3-qjs.bundle.js');

/** 轮询等待 mock 端口就绪 */
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

// ═══ 模拟 so 全局（必须在 import bundle/core-qjs 之前）═══
const cheerioMod = await import('cheerio');
globalThis.cheerio = cheerioMod;
globalThis.zlib = {
    gzip: (d) => nodeZlib.gzipSync(d),
    gunzip: (d) => nodeZlib.gunzipSync(d),
    unzip: (d) => nodeZlib.unzipSync(d),
    inflate: (d) => nodeZlib.inflateSync(d),
    deflate: (d) => nodeZlib.deflateSync(d),
};
// node 原生 Buffer/WebAssembly/TextDecoder（支持 GBK decode）直接用；
// TextEncoder node 原生不支持 GBK 编码，用 iconv-lite 模拟 so 扩展版
class MockSoTextEncoder {
    constructor(encoding) {
        this.enc = encoding && /gb/i.test(String(encoding)) ? 'gbk' : 'utf8';
    }
    encode(str) {
        return iconv.encode(String(str), this.enc);
    }
}
globalThis.TextEncoder = MockSoTextEncoder;

// ── 同步 WebCrypto mock（crypto-d2 的 C 覆盖路径按同步取值，node 原生 subtle
// 是异步的测不了；用 node:crypto 的同步 API 等价模拟 so 的同步 C 桥）──
// 覆盖面 = 测试消费面：AES-CBC importKey/encrypt/decrypt + getRandomValues +
// createHash/createHmac（node 风格）。GCM/PBKDF2 未实现（测试不消费）。
const nodeCryptoMod = await import('node:crypto');
const _syncCrypto = (() => {
    const nodeCrypto = nodeCryptoMod.webcrypto;
    const keyBytes = (key) => (key instanceof Uint8Array ? key : new Uint8Array(key));
    const cbcAlgo = (keyBytesLen) => ({16: 'aes-128-cbc', 24: 'aes-192-cbc', 32: 'aes-256-cbc'}[keyBytesLen]);
    return {
        getRandomValues: (arr) => nodeCrypto.getRandomValues(arr),
        createHash: (name) => nodeCryptoMod.createHash(name.toLowerCase().replace('-', '')),
        createHmac: (name, key) => nodeCryptoMod.createHmac(name.toLowerCase(), key),
        subtle: {
            importKey: (fmt, data) => keyBytes(data), // mock：透传原始字节
            encrypt: (cfg, key, data) => {
                if (cfg.name !== 'AES-CBC') throw new Error('mock subtle: 仅实现 AES-CBC');
                const c = nodeCryptoMod.createCipheriv(cbcAlgo(key.length), key, new Uint8Array(cfg.iv));
                return new Uint8Array(Buffer.concat([c.update(data), c.final()]));
            },
            decrypt: (cfg, key, data) => {
                if (cfg.name !== 'AES-CBC') throw new Error('mock subtle: 仅实现 AES-CBC');
                const d = nodeCryptoMod.createDecipheriv(cbcAlgo(key.length), key, new Uint8Array(cfg.iv));
                return new Uint8Array(Buffer.concat([d.update(data), d.final()]));
            },
        },
    };
})();
// node 22 的 globalThis.crypto 是 getter-only，defineProperty 强制覆盖
Object.defineProperty(globalThis, 'crypto', {value: _syncCrypto, configurable: true});

// 宿主桥：req → 本地 mock；evalModule → data URL 动态 import（模拟 Dart declareNewModule）；
// getProxy 刻意不注入（验 9978 空串兜底）
globalThis.fjs = {
    bridge_call: async (msg) => {
        if (msg.action === 'req') {
            const res = await fetch(msg.url, {headers: (msg.options && msg.options.headers) || {}});
            const content = await res.text();
            return {content, headers: Object.fromEntries(res.headers)};
        }
        if (msg.action === 'evalModule') {
            return 'data:text/javascript;base64,' + Buffer.from(msg.code, 'utf8').toString('base64');
        }
        return null;
    },
};

const bundle = await import(pathToFileURL(BUNDLE).href);

test('qjs bundle：加载即完成 drpy3Setup（core-qjs 的 so 全局检查通过）', () => {
    const check = bundle.drpy3Setup(JSON.stringify({fjsVersion: 'node-test'}));
    assert.ok(check, 'setup 返回 check 清单');
});

test('qjs bundle：百忙无果1.js 六环节端到端（mgtv 重写本地 mock）', {timeout: 60000}, async () => {
    const mock = spawn(process.execPath, [path.join(HERE, 'helpers', 'mock-server.mjs')], {
        env: {...process.env, MOCK_PORT: String(PORT)}, stdio: 'ignore',
    });
    try {
        await waitMockReady(B);
        let code = fs.readFileSync(path.join(ROOT, 'docs', '百忙无果1.js'), 'utf8');
        for (const h of ['https://pianku.api.%6d%67%74%76.com', 'https://mobileso.bz.%6d%67%74%76.com',
            'https://pcweb.api.mgtv.com', 'https://www.mgtv.com']) code = code.replaceAll(h, B);

        assert.ok(await bundle.drpy3Load(code, '_bm1qjs', '', '', ''), 'load 成功');

        // ═══ init / home（gzip filter 走 pako→so zlib 路径）═══
        await bundle.drpy3Call('_bm1qjs', 'init', '[""]');
        const homeRaw = await bundle.drpy3Call('_bm1qjs', 'home', '[""]');
        const home = JSON.parse(homeRaw);
        assert.ok(home.class, `home：出分类（raw=${String(homeRaw).slice(0, 200)}）`);
        assert.equal(home.class.length, 7, 'home：静态分类 7 个');
        assert.equal(home.class[0].type_id, '2');
        assert.ok(home.filters && Object.keys(home.filters).length >= 6, 'home：gzip filter 解压');

        // ═══ category（声明式 json: 一级）═══
        const cate = JSON.parse(await bundle.drpy3Call('_bm1qjs', 'category', '["3","1",false,"{}"]'));
        assert.equal(cate.list.length, 3, 'category：json:一级 3 条');
        assert.equal(cate.list[0].vod_id, '3$vid1');
        assert.equal(cate.list[0].vod_name, '影片1');

        // ═══ search（钩子 + HTML 解析走 cheerio shim）═══
        const search = JSON.parse(await bundle.drpy3Call('_bm1qjs', 'search', '["斗罗大陆",false,"1"]'));
        assert.equal(search.list.length, 1, 'search：imgo 过滤后 1 条');
        assert.equal(search.list[0].vod_name, '斗罗大陆');
        assert.equal(search.list[0].vod_id, '50$vid9');

        // ═══ detail / play ═══
        const detail = JSON.parse(await bundle.drpy3Call('_bm1qjs', 'detail', '["3$vid1"]'));
        const vod = detail.list[0];
        assert.equal(vod.vod_name, '测试影片全名', 'detail：pdfh .vt-txt');
        assert.equal(vod.vod_actor, '主演：张三 李四 王五', 'detail：p:eq(4)');
        assert.equal(vod.vod_pic, 'http://img.example.com/pic.jpg', 'detail：pd 协议相对补全');
        assert.equal(vod.vod_play_from, 'mgtv');
        const eps = String(vod.vod_play_url).split('#');
        assert.equal(eps.length, 2, 'detail：2 集列表');
        assert.ok(eps[0].startsWith('第1集$' + B + '/b/999/vid1.html'), 'detail：选集拼装');
        const play = JSON.parse(await bundle.drpy3Call('_bm1qjs', 'play',
            JSON.stringify([vod.vod_play_from, eps[0].split('$').slice(1).join('$'), []])));
        assert.equal(play.url, eps[0].split('$').slice(1).join('$'), 'play：url 透传');
        assert.equal(play.parse, 1, 'play：默认 parse=1（待嗅探）');
        assert.equal(play.flag, 'mgtv');
    } finally {
        mock.kill();
    }
});

test('qjs bundle：getProxy 桥不注入时 getProxyUrl 恒空串（9978 兜底废除）', {timeout: 30000}, async () => {
    const code = `const meta={title:'P',type:0,direct:true};
export default {meta, async home(ctx){ return await ctx.lib.utils.getProxyUrl(); }}`;
    assert.ok(await bundle.drpy3Load(code, '_gpqjs', '', '', ''), 'load 成功');
    const url = JSON.parse(await bundle.drpy3Call('_gpqjs', 'home', '[""]'));
    assert.equal(url, '', 'getProxyUrl 返回空串，不编造 9978');
});

test('qjs bundle：aesX 往返（crypto-d2 C 覆盖走同步 subtle mock）+ md5', {timeout: 30000}, async () => {
    const code = `const meta={title:'cry',type:0,direct:true};
export default {meta, async home(ctx){
    const key = '0123456789abcdef', iv = 'abcdef9876543210';
    const ct = ctx.lib.crypto.aesX('aes-plain', key, iv, {method: 'enc', utf8: 1});
    const pt = ctx.lib.crypto.aesX(ct, key, iv, {method: 'dec', utf8: 1});
    return { aes: pt, md5: ctx.lib.crypto.md5('abc') };
}}`;
    assert.ok(await bundle.drpy3Load(code, '_cryqjs', '', '', ''), 'load 成功');
    const r = JSON.parse(await bundle.drpy3Call('_cryqjs', 'home', '[""]'));
    assert.equal(r.aes, 'aes-plain', 'aesX 往返');
    assert.equal(r.md5, '900150983cd24fb0d6963f7d28e17f72', 'md5 标准向量');
});

test('core-qjs：gbkTool 与原版 gb18030 逐字节对拍', async () => {
    assert.ok(fs.existsSync(CORE_QJS), 'core-qjs 产物存在（先跑 build-qjs.mjs 前置的 drpy-webpack 构建）');
    const coreQjs = await import(pathToFileURL(CORE_QJS).href);

    // 原版 gb18030.min.js（UMD）以 Function 求值挂 globalThis.gbkTool——先清掉防串
    const savedGbk = globalThis.gbkTool;
    delete globalThis.gbkTool;
    const umd = fs.readFileSync(path.resolve(ROOT, '..', 'drpy-webpack', 'src', 'libs', 'gb18030.min.js'), 'utf8');
    new Function(umd)(); // browser 分支：globalThis.gbkTool = factory()
    const orig = globalThis.gbkTool;
    globalThis.gbkTool = savedGbk;
    assert.ok(orig && orig.encode && orig.decode, '原版 gbkTool 就位');

    const cases = [
        'hello', '', 'a',                                   // ASCII / 空
        '斗罗大陆', '百忙无果', '动作片',                     // 纯中文
        'search?q=斗罗&page=1', '综艺/纪录片 免费看',          // 混合 + 空格斜杠
        'éü', '＄￥',                                        // Latin-1 补充（GBK 有映射）/ 全角
        '𠀀𠀁', '👍',                                     // astral（代理项→双方回退原样）
        '生僻字㐀㔄', '书名号《论语》',                        // GBK 表外 / 边界
    ];
    for (const s of cases) {
        const a = orig.encode(s);
        const b = coreQjs.gbkTool.encode(s);
        assert.equal(b, a, `encode 对拍：${JSON.stringify(s)}\n  原版=${a}\n  qjs  =${b}`);
    }
    // decode 往返 + 原版输出喂给 qjs decode。
    // decodeURIComponent 的严格性两侧共享：原版 decode 对某些序列（如 q=&percent 组合、
    // € 三字节 percent）本就抛 URIError——断言「要么都成功且相等，要么都炸」即契约一致。
    for (const s of cases) {
        const encoded = orig.encode(s);
        let qjsBack, qjsErr, origBack, origErr;
        try { qjsBack = coreQjs.gbkTool.decode(encoded); } catch (e) { qjsErr = e.message; }
        try { origBack = orig.decode(encoded); } catch (e) { origErr = e.message; }
        if (qjsErr || origErr) {
            assert.ok(qjsErr && origErr, `decode 同炸：${JSON.stringify(s)} qjs=${qjsErr} orig=${origErr}`);
        } else {
            assert.equal(qjsBack, origBack, `decode 对拍：${JSON.stringify(s)}`);
        }
    }
    // € 单独验证 encode 形态一致（原版 encodeURIComponent 输出三字节 UTF-8 percent）
    assert.equal(coreQjs.gbkTool.encode('€'), orig.encode('€'), 'encode：€ 彩蛋形态一致');
});
