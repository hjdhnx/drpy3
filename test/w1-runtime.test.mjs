// W1 验收：Runtime/HostEnv——构造期校验、use() 覆盖、能力查找顺序、capabilities（§7）
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/drpy3/index.js';

const FULL = {
    req: (url, options) => ({content: '', headers: {}}),
    pdfh: (html, parse) => '',
    pdfa: (html, parse) => [],
    pd: (html, parse, base) => '',
};

test('W1 构造期校验：缺必注入项 → check() 打印清单 + capabilities 标 missing', () => {
    const logs = [];
    const rt = new Runtime({log: (...a) => logs.push(a.join(' '))});
    const rep = rt.check();
    assert.deepEqual(rep.missing.sort(), ['pd', 'pdfa', 'pdfh', 'req'].sort());
    // 打印清单：日志中能看到缺失项（不再"缺了运行期才炸"）
    assert.ok(logs.some((l) => l.includes('req') && l.includes('pdfh')), '日志含缺失清单');
    assert.equal(rt.capabilities.req, 'missing');
    assert.equal(rt.capabilities.pdfh, 'missing');
});

test('W1 必注入齐全 → capabilities 全 host', () => {
    const rt = new Runtime(FULL);
    assert.equal(rt.check().missing.length, 0);
    assert.equal(rt.capabilities.req, 'host');
    assert.equal(rt.capabilities.pdfh, 'host');
    assert.equal(rt.capabilities.pdfa, 'host');
    assert.equal(rt.capabilities.pd, 'host');
});

test('W1 use() 覆盖生效：能力标 use-override，查找返回覆盖函数', () => {
    const rt = new Runtime(FULL);
    const myPdfh = (html, parse) => 'X';
    rt.use({pdfh: myPdfh});
    assert.equal(rt.capabilities.pdfh, 'use-override');
    assert.equal(rt.resolve('pdfh'), myPdfh);
    // 整包覆盖也可以
    rt.use({pdfh: (h, p) => 'Y', pd: (h, p, b) => 'Z'});
    assert.equal(rt.resolve('pdfh')('a', 'b'), 'Y');
});

test('W1 三层查找顺序：use 覆盖 > 构造注入 > 框架内置兜底', () => {
    const joinUrlHost = (a, b) => 'HOST';
    const rt = new Runtime({...FULL, joinUrl: joinUrlHost});
    assert.equal(rt.capabilities.joinUrl, 'host');
    assert.equal(rt.resolve('joinUrl'), joinUrlHost);
    // use 覆盖构造注入
    const joinUrlUse = (a, b) => 'USE';
    rt.use({joinUrl: joinUrlUse});
    assert.equal(rt.capabilities.joinUrl, 'use-override');
    assert.equal(rt.resolve('joinUrl'), joinUrlUse);
    // 无注入无覆盖 → 内置兜底（行为可用：URL 解析语义）
    const rt2 = new Runtime(FULL);
    assert.equal(rt2.capabilities.joinUrl, 'builtin');
    assert.equal(rt2.resolve('joinUrl')('https://a.com/x/y.html', '../z/1.mp4'), 'https://a.com/z/1.mp4');
});

test('W1 store 未注入 → memory-fallback 且可用；log 未注入 → 兜底 console', () => {
    const rt = new Runtime(FULL);
    assert.equal(rt.capabilities.store, 'memory-fallback');
    const store = rt.resolve('store');
    store.set('ns', 'k', 'v');
    assert.equal(store.get('ns', 'k'), 'v');
    assert.equal(rt.capabilities.log, 'builtin');
    assert.equal(typeof rt.resolve('log'), 'function');
});

test('W1 batchFetch/pdfl 未注入 → builtin 兜底', () => {
    const rt = new Runtime(FULL);
    assert.equal(rt.capabilities.batchFetch, 'builtin');
    assert.equal(rt.capabilities.pdfl, 'builtin');
});

test('W1 wasm 能力检测：Node 原生 → native；HostEnv 可显式声明 polyfill/none', () => {
    const rt = new Runtime(FULL);
    assert.equal(rt.capabilities.wasm, 'native');
    const rt2 = new Runtime({...FULL, wasm: 'polyfill'});
    assert.equal(rt2.capabilities.wasm, 'polyfill');
});

test('W1 capabilities 冻结 + env/engine 透传', () => {
    const rt = new Runtime({...FULL, engine: 'node22', version: '1.0', env: {foo: 1}});
    assert.ok(Object.isFrozen(rt.capabilities));
    assert.equal(rt.capabilities.engine, 'node22');
    assert.deepEqual(rt.hostEnv.env, {foo: 1});
});
