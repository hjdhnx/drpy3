// W7 验收：proxy 五元组（§10.1）+ action 通道（§10.2）——toBytes 分支透传、缺省 404、action 超时与返回透传
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/drpy3/index.js';

const HOST_ENV = {
    req: async () => ({content: '', headers: {}}),
    pdfh: () => '',
    pdfa: () => [],
    pd: () => '',
};

test('W7 proxy：源返回五元组原样透传（toBytes 1/2/3 三档形状）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({
        meta: {title: 'PX'},
        async proxy(ctx, params) {
            if (params.mode === 'b64') return [200, 'video/MP2T', 'QUJD', {'Content-Type': 'video/MP2T'}, 1]; // base64→字节
            if (params.mode === 'redirect') return [302, 'text/plain', 'http://cdn.example.com/live.m3u8', {}, 2]; // 302
            if (params.mode === 'pipe') return [200, 'video/MP2T', 'http://up.example.com/seg0.ts', {}, 3]; // 内联流式
            return [200, 'application/vnd.apple.mpegurl', '#EXTM3U'];
        },
    }, {key: '_px'});
    assert.deepEqual(await src.proxy({mode: 'b64'}), [200, 'video/MP2T', 'QUJD', {'Content-Type': 'video/MP2T'}, 1]);
    assert.deepEqual(await src.proxy({mode: 'redirect'}), [302, 'text/plain', 'http://cdn.example.com/live.m3u8', {}, 2]);
    assert.deepEqual(await src.proxy({mode: 'pipe'}), [200, 'video/MP2T', 'http://up.example.com/seg0.ts', {}, 3]);
    const plain = await src.proxy({});
    assert.equal(plain.length, 3, '无 toBytes → 文本回包三元组');
});

test('W7 proxy：未实现 proxy 钩子/proxy_rule → 缺省 404', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({meta: {title: 'PX2'}}, {key: '_px2'});
    assert.deepEqual(await src.proxy({}), [404, 'text/plain', 'Not Found']);
});

test('W7 proxy：声明式 proxy_rule js 片段（drpy2 proxyParse 语义，input 改写为响应数组）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({
        meta: {title: 'PX3'},
        rule: {proxy_rule: 'js:\ninput = [200, "text/plain", "from-rule:" + input.do];'},
    }, {key: '_px3'});
    assert.deepEqual(await src.proxy({do: 'ping'}), [200, 'text/plain', 'from-rule:ping']);
});

test('W7 action：返回透传（提示串/播放结构）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({
        meta: {title: 'AC'},
        async action(ctx, action, value) {
            if (action === 'set-timeout') return `已保存：${value}`;
            if (action === 'push') return {parse: 1, url: value, jx: 0};
            return '未知动作';
        },
    }, {key: '_ac'});
    assert.equal(await src.action('set-timeout', '9000'), '已保存：9000');
    assert.deepEqual(await src.action('push', 'http://x.com/a.m3u8'), {parse: 1, url: 'http://x.com/a.m3u8', jx: 0});
    assert.equal(await src.action('nope', ''), '未知动作');
});

test('W7 action：专用长超时（默认 60s，可配）；超时报工程化错误', async () => {
    const rt = new Runtime({...HOST_ENV, actionTimeoutMs: 80});
    const src = await rt.load({
        meta: {title: 'ACT'},
        async action(ctx) {
            await new Promise((r) => setTimeout(r, 500)); // 模拟多轮输入卡住
            return 'late';
        },
    }, {key: '_act'});
    await assert.rejects(() => src.action('dialog', 'x'), (e) => /action/.test(e.message) && /超时|timeout/i.test(e.message + (e.hint || '')));
    // 正常返回不受影响
    const src2 = await rt.load({meta: {title: 'ACT2'}, async action() { return 'ok'; }}, {key: '_act2'});
    assert.equal(await src2.action('a', ''), 'ok');
});

test('W7 action：capabilities.action=false 时源可感知降级；未实现 action 缺省返回空串', async () => {
    const rt = new Runtime({...HOST_ENV, action: false});
    assert.equal(rt.capabilities.action, false);
    const src = await rt.load({meta: {title: 'ACD'}}, {key: '_acd'});
    assert.equal(await src.action('x', ''), '');
});
