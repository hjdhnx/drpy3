// W3 验收：生命周期治理——LRU+水位驱逐、signature 惰性热更、headers 快照恢复、in-flight 排空（§4.6）
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Runtime} from '../src/drpy3/index.js';

const HOST_ENV = {
    req: async (url) => ({content: `resp:${url}`, headers: {}}),
    pdfh: (h, p) => '',
    pdfa: () => [],
    pd: () => '',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function factory(name) {
    return {
        meta: {title: name, host: 'https://w.com'},
        async init(ctx) {
            this.inited = (this.inited || 0) + 1;
            if (ctx.resumed) {
                // 复温：headers 已快照回填，跳过登录预处理（§4.6 场景示例）
                return;
            }
            ctx.headers.Cookie = 'ck=' + name + ':' + this.inited;
        },
        async search(ctx, wd) {
            return {name, v: this.inited, ck: ctx.headers.Cookie, resumed: ctx.resumed, wd};
        },
    };
}

test('W3 in-flight 排空：有调用未完成不驱逐，排空后可驱逐/pendingEvict 自动生效', async () => {
    const rt = new Runtime(HOST_ENV);
    let release;
    const gate = new Promise((r) => (release = r));
    const src = await rt.load({
        meta: {title: 'IF'},
        async search(ctx) {
            await gate;
            return {};
        },
    }, {key: '_if'});
    const p = src.search('x'); // in-flight 中
    await sleep(5);
    assert.equal(await src.evict(), false, 'in-flight 中驱逐被拒');
    release();
    await p;
    assert.equal(await src.evict(), true, '排空后驱逐成功');
});

test('W3 pendingEvict：in-flight 期间请求驱逐 → 排空后自动驱逐', async () => {
    const rt = new Runtime(HOST_ENV);
    let release;
    const gate = new Promise((r) => (release = r));
    const src = await rt.load({meta: {title: 'PE'}, async search(ctx) { await gate; return {}; }}, {key: '_pe'});
    const p = src.search('x');
    await sleep(5);
    await src.evict(); // false，但标记 pendingEvict
    release();
    await p;
    assert.equal(src.hot, false, '排空后 pendingEvict 自动生效');
});

test('W3 signature 惰性热更：改源内容 → 下次调用强制驱逐重建（新行为生效）', async () => {
    let V = 1;
    const gen = () => `export default {meta:{title:'HU'}, async init(ctx){ if(!ctx.resumed) ctx.headers.Cookie='ck=' + ${V}; }, async search(c){return {v:${V}, ck:c.headers.Cookie, resumed:c.resumed};}};`;
    const rt = new Runtime({...HOST_ENV, loadAsset: async () => gen()});
    const src = await rt.load(gen(), {path: 'mem://hu.js', key: '_hu'});
    const r1 = await src.search('a');
    assert.equal(r1.v, 1);
    assert.equal(r1.resumed, false);
    V = 2; // "改源文件"
    const r2 = await src.search('b'); // 下次调用前惰性比对 → 重建
    assert.equal(r2.v, 2, '热更后新代码生效');
    assert.equal(r2.resumed, true, '热更重建走快照复温');
    assert.equal(r2.ck, 'ck=1', 'headers 快照回填（旧 cookie 保留）');
});

test('W3 headers 快照恢复：驱逐复温 → ctx.resumed=true 且快照 headers 已回填（层次 B）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load(factory('CK'), {key: '_ck'});
    const r1 = await src.search('a');
    assert.equal(r1.resumed, false);
    assert.equal(r1.ck, 'ck=CK:1');
    await src.evict();
    const r2 = await src.search('b');
    assert.equal(r2.resumed, true, '复温标记');
    assert.equal(r2.v, 2, '复温会重跑 init');
    assert.equal(r2.ck, 'ck=CK:1', 'headers 快照回填且 init 跳过登录（cookie 未被覆盖为新值）');
});

test('W3 LRU 空闲驱逐 + maxHot 上限 + pin 豁免', async () => {
    const rt = new Runtime({...HOST_ENV, lifecycle: {idleTTL: 0.05, maxHot: 3}});
    const hot = [];
    for (let i = 0; i < 5; i++) {
        const s = await rt.load(factory('L' + i), {key: '_l' + i});
        await s.init('');
        hot.push(s);
    }
    hot[0].pin(); // pin 豁免
    await sleep(80);
    const report = await rt.sweep();
    assert.ok(hot.slice(1).every((s) => !s.hot), '超时实例全部驱逐');
    assert.equal(hot[0].hot, true, 'pin 实例豁免');
    // maxHot: 再建 5 个热实例 → sweep 后最多保留 maxHot 个
    const more = [];
    for (let i = 0; i < 5; i++) {
        const s = await rt.load(factory('M' + i), {key: '_m' + i});
        await s.init('');
        more.push(s);
    }
    await rt.sweep();
    const alive = rt.lifecycle.sourcesList().filter((s) => s.hot);
    assert.ok(alive.length <= 3, `maxHot=3 生效，实际 ${alive.length}`);
});

test('W3 水位驱逐：usage 超限 → 驱逐最冷实例至目标水位；initCost 高者受保护', async () => {
    const rt = new Runtime({
        ...HOST_ENV,
        lifecycle: {memUsage: () => (rt.lifecycle.sourcesList().filter((s) => s.hot).length > 1 ? 0.8 : 0.3), watermark: 0.7, watermarkTarget: 0.5},
    });
    const cheap = await rt.load({meta: {title: 'CHEAP'}, async search(ctx) { return {}; }}, {key: '_cheap'});
    const expensive = await rt.load({meta: {title: 'EXP', initCost: 'high'}, async search(ctx) { return {}; }}, {key: '_exp'});
    await cheap.init('');
    await expensive.init('');
    await rt.sweep();
    assert.equal(cheap.hot, false, '便宜的先驱逐');
    assert.equal(expensive.hot, true, 'initCost=high 受保护');
    await rt.sweep();
    assert.equal(expensive.hot, true, '水位回落不驱逐');
});

test('W3 复温/init 失败不拖垮引擎：热更后新代码 init 抛错 → 保留旧实例继续服务', async () => {
    let broken = false;
    const gen = () => broken
        ? `export default {meta:{title:'BF'}, async init(){throw new Error('broken init');}, async search(c){return {v:2};}};`
        : `export default {meta:{title:'BF'}, async search(c){return {v:1};}};`;
    const rt = new Runtime({...HOST_ENV, loadAsset: async () => gen()});
    const src = await rt.load(gen(), {path: 'mem://bf.js', key: '_bf'});
    assert.equal((await src.search('x')).v, 1);
    broken = true;
    const r = await src.search('y'); // 新代码 init 失败 → 回退旧实例
    assert.equal(r.v, 1, '旧实例继续服务');
    assert.equal(src.hot, true);
    assert.ok(src.lastError, '失败已记录上报');
});

test('W3 并发复温排队：冷实例并发调用只触发一次 init', async () => {
    const rt = new Runtime(HOST_ENV);
    let initCount = 0;
    const src = await rt.load({
        meta: {title: 'CC'},
        async init() {
            initCount++;
            await sleep(20);
        },
        async search(ctx, wd) {
            return {wd};
        },
    }, {key: '_cc'});
    const [a, b] = await Promise.all([src.search('a'), src.search('b')]);
    assert.equal(initCount, 1, 'init 仅一次');
    assert.deepEqual([a.wd, b.wd], ['a', 'b']);
});
