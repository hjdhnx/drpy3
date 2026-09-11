// W2 验收：ctx 与生命周期——defineSource/纯对象判定/ctx 构造/this 绑定/并发契约/headers 基线（§4.2-4.5）
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Runtime, defineSource} from '../src/drpy3/index.js';

const HOST_ENV = {
    req: async (url, options) => ({content: `resp:${url}`, headers: {}}),
    pdfh: (html, parse) => `h:${parse}`,
    pdfa: (html, parse) => ['a', 'b'],
    pd: (html, parse, base) => `d:${parse}`,
};

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

test('W2 钩子 this=源实例：实例自定义字段/方法跨调用可复用（§4.3.6/§4.4）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load(defineSource({
        meta: {title: 'T1', host: 'https://a.com'},
        async init(ctx, ext) {
            this.tag = 'instance-tag';
            this.ctxKey = ctx.key;
            this.initedAt = Date.now();
        },
        async search(ctx, wd) {
            return {wd, tag: this.tag, viaHelper: this.helper(), inited: this.initedAt > 0};
        },
        helper() {
            return 'helper-' + this.tag;
        },
    }), {key: '_t1'});
    await src.init('');
    this_tag_check: {
        const r = await src.search('kw', false, 1);
        assert.equal(r.tag, 'instance-tag');
        assert.equal(r.viaHelper, 'helper-instance-tag');
        assert.equal(r.inited, true);
        assert.equal(src.ctxKey, '_t1');
    }
});

test('W2 同源双实例对拍不串数据（§4.3.1 并发交错）', async () => {
    const rt = new Runtime(HOST_ENV);
    const factory = () => ({
        meta: {title: 'T2', host: 'https://b.com'},
        async init(ctx, ext) {
            this.who = ext; // 实例态
        },
        async search(ctx, wd) {
            const mine = this.who;
            ctx.scratch.n = 1;
            await sleep(10); // 制造交错窗口
            // 交错后仍读到自己的实例态与自己的调用态
            return {who: mine, scratch: ctx.scratch.n, mine: this.who === mine};
        },
    });
    const a = await rt.load(factory(), {key: '_a'});
    const b = await rt.load(factory(), {key: '_b'});
    await Promise.all([a.init('A'), b.init('B')]);
    const [ra, rb] = await Promise.all([a.search('x'), b.search('y')]);
    assert.equal(ra.who, 'A');
    assert.equal(rb.who, 'B');
    assert.equal(ra.mine, true);
    assert.equal(rb.mine, true);
});

test('W2 调用态隔离：并发调用各持独立 ctx（scratch/fetchParams 互不可见）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({
        meta: {title: 'T3', host: 'https://c.com'},
        async search(ctx, wd) {
            ctx.scratch.step = 's1';
            ctx.fetchParams.headers.Referer = 'https://per-call/' + wd;
            await sleep(5);
            return {step: ctx.scratch.step, ref: ctx.fetchParams.headers.Referer, ua: ctx.fetchParams.headers['User-Agent']};
        },
    }, {key: '_t3'});
    const [r1, r2] = await Promise.all([src.search('one'), src.search('two')]);
    assert.equal(r1.ref, 'https://per-call/one');
    assert.equal(r2.ref, 'https://per-call/two');
    assert.equal(r1.step, 's1');
});

test('W2 headers 基线：UA 常量解析 + 实例级可变（后续调用自动携带）', async () => {
    const rt = new Runtime(HOST_ENV);
    const seen = [];
    const req = async (url, options) => {
        seen.push({...((options && options.headers) || {})});
        return {content: '', headers: {}};
    };
    rt.use({req});
    const src = await rt.load({
        meta: {title: 'T4', host: 'https://d.com'},
        rule: {headers: {'User-Agent': 'PC_UA', Referer: 'https://d.com'}},
        async init(ctx) {
            ctx.headers.Cookie = 'ck=1'; // 实例基线：之后所有请求自动携带
        },
        async search(ctx, wd) {
            await ctx.req('https://d.com/api');  // ctx 顶层快捷别名
            ctx.headers.Cookie = 'ck=2';        // 就地更新，后续调用可见
            return {};
        },
        async detail(ctx) {
            await ctx.lib.net.req('https://d.com/api2'); // 实例基线已被上一调用更新
            return {};
        },
    }, {key: '_t4'});
    await src.init('');
    await src.search('x');
    assert.equal(seen[0]['User-Agent'], 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', 'PC_UA 已解析为常量');
    assert.equal(seen[0].Cookie, 'ck=1', 'init 写入的实例基线自动携带');
    await src.detail('1');
    assert.equal(seen[1].Cookie, 'ck=2', '实例 headers 更新对后续调用可见');
});

test('W2 ctx 快捷别名 = lib 投影（同一函数引用，§4.5）', async () => {
    const rt = new Runtime(HOST_ENV);
    let cap = null;
    const src = await rt.load({
        meta: {title: 'T5', host: 'https://e.com'},
        async category(ctx) {
            cap = ctx.capabilities;
            assert.equal(ctx.req, ctx.lib.net.req);
            assert.equal(ctx.request, ctx.lib.net.request);
            assert.equal(ctx.pdfh, ctx.lib.parse.pdfh);
            assert.equal(ctx.md5, ctx.lib.crypto.md5);
            assert.equal(ctx.base64Encode, ctx.lib.crypto.base64Encode);
            assert.equal(ctx.joinUrl, ctx.lib.utils.joinUrl);
            assert.equal(ctx.getProxyUrl, ctx.lib.utils.getProxyUrl);
            assert.equal(typeof ctx.log, 'function');
            return {};
        },
    }, {key: '_t5'});
    await src.category('1', 1, {});
    assert.ok(cap && cap.wasm, 'capabilities 已投影到 ctx');
});

test('W2 store 按源隔离：同引擎双实例命名空间互不可见', async () => {
    const rt = new Runtime(HOST_ENV);
    const a = await rt.load({meta: {title: 'SA'}, async init(ctx) { await ctx.store.set('k', 'va'); }}, {key: '_sa'});
    const b = await rt.load({meta: {title: 'SB'}, async init(ctx) { await ctx.store.set('k', 'vb'); }}, {key: '_sb'});
    await Promise.all([a.init(''), b.init('')]);
    assert.equal((await a.store.get('k')), 'va');
    assert.equal((await b.store.get('k')), 'vb');
});

test('W2 形态判定：纯对象=纯声明式（无钩子）；defineSource 恒等', () => {
    const rt = new Runtime(HOST_ENV);
    const pure = rt._detectForm({meta: {title: 'P'}, rule: {}});
    assert.equal(pure, 'declarative');
    const enhanced = rt._detectForm(defineSource({meta: {title: 'E'}, async search() {}}));
    assert.equal(enhanced, 'enhanced');
});

test('W2 ctx.resumed 默认 false（复温标记 W3 启用）', async () => {
    const rt = new Runtime(HOST_ENV);
    let resumed = null;
    const src = await rt.load({meta: {title: 'T6'}, async init(ctx) { resumed = ctx.resumed; }}, {key: '_t6'});
    await src.init('');
    assert.equal(resumed, false);
});
