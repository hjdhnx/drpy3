// W4 验收：标准库 net/utils/store/cache——req 同步宿主适配、all、batchFetch 兜底、getProxyUrl（§9 net）
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/drpy3/index.js';

const HOST_ENV = {
    pdfh: (h, p) => '',
    pdfa: () => [],
    pd: () => '',
};

function makeSource(rt) {
    return rt.load({
        meta: {title: 'N'},
        async run(ctx, url, opts) {
            return {req: await ctx.req(url, opts)};
        },
    }, {key: '_net'});
}

test('W4 req 适配：同步宿主 req 自动被 await 适配（§5.4 档 C）', async () => {
    const rt = new Runtime({...HOST_ENV, req: (url, options) => ({content: 'sync:' + url, headers: {x: '1'}})});
    const src = await makeSource(rt);
    const r = await src.callStage('run', 'https://a.com', {});
    assert.equal(r.req.content, 'sync:https://a.com');
    assert.equal(r.req.headers.x, '1');
});

test('W4 req 适配：异步宿主 req（档 A）同样可用；缺 req 注入报工程化错误', async () => {
    const rt = new Runtime({...HOST_ENV, req: async (url) => ({content: 'async:' + url, headers: {}})});
    const src = await makeSource(rt);
    const r = await src.callStage('run', 'https://b.com', {});
    assert.equal(r.req.content, 'async:https://b.com');

    const rt2 = new Runtime(HOST_ENV);
    const src2 = await rt2.load({meta: {title: 'X'}, async run(ctx) { return await ctx.req('u'); }}, {key: '_x'});
    await assert.rejects(() => src2.callStage('run'), (e) => e.name === 'Drpy3Error' && /req/.test(e.message));
});

test('W4 net.all：并发请求，结果按序对齐（§5.2）', async () => {
    const delays = [30, 10, 20];
    const rt = new Runtime({...HOST_ENV, req: async (url) => {
        const d = delays[Number(url.slice(-1))] || 0;
        await new Promise((r) => setTimeout(r, d));
        return {content: 'c' + url.slice(-1), headers: {}};
    }});
    const src = await rt.load({
        meta: {title: 'A'},
        async run(ctx) {
            const {all, req} = ctx.lib.net;
            return await all([0, 1, 2].map((i) => req('u' + i)));
        },
    }, {key: '_all'});
    const rs = await src.callStage('run');
    assert.deepEqual(rs.map((r) => r.content), ['c0', 'c1', 'c2'], '最慢的 30ms 内全回，顺序不变');
});

test('W4 batchFetch 兜底：按序对齐 / 单项失败返空串不中断 / 空入参返 []', async () => {
    const rt = new Runtime({...HOST_ENV, req: async (url) => {
        if (url.includes('bad')) throw new Error('boom');
        return {content: 'ok:' + url, headers: {}};
    }});
    const src = await rt.load({
        meta: {title: 'B'},
        async run(ctx) {
            return await ctx.lib.net.batchFetch([
                {url: 'u1'},
                {url: 'bad'},
                {url: 'u3', options: {headers: {A: '1'}}},
            ]);
        },
    }, {key: '_bf'});
    const rs = await src.callStage('run');
    assert.deepEqual(rs, ['ok:u1', '', 'ok:u3']);
    const empty = await rt.load({meta: {title: 'B2'}, async run(ctx) { return await ctx.lib.net.batchFetch([]); }}, {key: '_bf2'});
    assert.deepEqual(await empty.callStage('run'), []);
});

test('W4 batchFetch：宿主注入原生实现优先（线程池/协程加速位）', async () => {
    const native = async (items) => items.map((it) => 'native:' + it.url);
    const rt = new Runtime({...HOST_ENV, req: async () => ({content: '', headers: {}}), batchFetch: native});
    assert.equal(rt.capabilities.batchFetch, 'host');
    const src = await rt.load({meta: {title: 'C'}, async run(ctx) { return await ctx.lib.net.batchFetch([{url: 'a'}]); }}, {key: '_nbf'});
    assert.deepEqual(await src.callStage('run'), ['native:a']);
});

test('W4 getProxyUrl：HostEnv getProxy 优先，缺省兜底 9978 地址', async () => {
    const rt1 = new Runtime({...HOST_ENV, req: async () => ({content: '', headers: {}}), getProxy: () => 'http://127.0.0.1:5707/api/v1/vod?do=js'});
    const s1 = await rt1.load({meta: {title: 'P'}, async run(ctx) { return await ctx.lib.utils.getProxyUrl(); }}, {key: '_p1'});
    assert.equal(await s1.callStage('run'), 'http://127.0.0.1:5707/api/v1/vod?do=js');

    const rt2 = new Runtime({...HOST_ENV, req: async () => ({content: '', headers: {}})});
    const s2 = await rt2.load({meta: {title: 'P'}, async run(ctx) { return await ctx.getProxyUrl(); }}, {key: '_p2'});
    assert.equal(await s2.callStage('run'), 'http://127.0.0.1:9978/proxy?do=js');
});

test('W4 store：自定义介质（HostEnv 注入）按源命名空间隔离 + delete', async () => {
    const medium = new Map();
    const rt = new Runtime({...HOST_ENV, req: async () => ({content: '', headers: {}}),
        store: {get: (ns, k) => medium.get(ns + '|' + k), set: (ns, k, v) => medium.set(ns + '|' + k, v), delete: (ns, k) => medium.delete(ns + '|' + k)}});
    assert.equal(rt.capabilities.store, 'host');
    const a = await rt.load({meta: {title: 'S'}, async run(ctx) { await ctx.store.set('k', 'va'); }}, {key: '_sa'});
    const b = await rt.load({meta: {title: 'S'}, async run(ctx) { await ctx.store.set('k', 'vb'); }}, {key: '_sb'});
    await a.callStage('run');
    await b.callStage('run');
    assert.equal(await a.store.get('k'), 'va');
    await a.store.delete('k');
    assert.equal(await a.store.get('k'), undefined);
    assert.equal(await b.store.get('k'), 'vb', 'delete 只影响自己命名空间');
});

test('W4 cache：TTL 过期与命中（实例级）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({
        meta: {title: 'CC'},
        async run(ctx) {
            await ctx.cache.set('k', {v: 1}, 0.05); // 50ms
            const hit1 = await ctx.cache.get('k');
            await new Promise((r) => setTimeout(r, 80));
            const hit2 = await ctx.cache.get('k');
            return {hit1, hit2};
        },
    }, {key: '_cc'});
    const r = await src.callStage('run');
    assert.deepEqual(r.hit1, {v: 1});
    assert.equal(r.hit2, undefined, 'TTL 过期');
});

test('W4 download：base64 语义（buffer:2 显式化）', async () => {
    const seen = [];
    const rt = new Runtime({...HOST_ENV, req: async (url, o) => {
        seen.push(o);
        return {content: 'B64DATA', headers: {}};
    }});
    const src = await rt.load({meta: {title: 'D'}, async run(ctx) { return await ctx.lib.net.download('pic'); }}, {key: '_d'});
    assert.equal(await src.callStage('run'), 'B64DATA');
    assert.equal(seen[0].buffer, 2);
});
