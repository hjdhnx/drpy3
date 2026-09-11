// W5 验收：标准库 parse/crypto/wasm——parseRule（'json:...' 规则解析）、pdfl 回退、jp/jinja2/模板接入、
// ungzip、wasm.load（emscripten 胶水识别/垫片/就绪等待/按路径缓存）（§9 parse/crypto/wasm、§6.2）
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Runtime} from '../src/drpy3/index.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HOST_ENV = {
    req: async () => ({content: '', headers: {}}),
    pdfh: (html, parse) => '',
    pdfa: () => [],
    pd: (html, parse, base) => '',
};

// 极简 wasm 模块：func add(i32,i32)->i32（手写二进制，验证原生编译路径）
const WASM_ADD = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01,
    0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09,
    0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b,
]);

// ══════════ parseRule ══════════
test('W5 parseRule：json: 一级规则解析（drpy2 categoryParse 语义）', async () => {
    const docs = {data: {hitDocs: [1, 2, 3].map((i) => ({
        title: `影片${i}`, img: `img/${i}.jpg`, updateInfo: `更新${i}`, rightCorner: {text: 'HD'}, playPartId: `vid${i}`,
    }))}};
    const rt = new Runtime({...HOST_ENV, req: async (url) => ({content: JSON.stringify(docs), headers: {}})});
    const src = await rt.load({
        meta: {title: 'PR'},
        rule: {detailUrl: 'https://x.com/ep?id=fyid'},
        async run(ctx) {
            ctx.url = 'https://x.com/list';
            return await ctx.lib.parse.parseRule('json:data.hitDocs;title;img;updateInfo||rightCorner.text;playPartId', ctx);
        },
    }, {key: '_pr'});
    const list = await src.callStage('run');
    assert.equal(list.length, 3);
    assert.deepEqual(list[0], {
        vod_id: 'vid1',
        vod_name: '影片1',
        vod_pic: 'https://x.com/img/1.jpg',   // json pd：MY_URL 自动拼接
        vod_remarks: '更新1',                  // '||' 第一路命中
    });
    // 第二路回退：updateInfo 缺失时取 rightCorner.text
    docs.data.hitDocs[0].updateInfo = '';
    const list2 = await src.callStage('run');
    assert.equal(list2[0].vod_remarks, 'HD');
});

test('W5 parseRule：jq: 前缀走注入 pdf 三件套；字段不足返 []', async () => {
    const rt = new Runtime({...HOST_ENV,
        pdfh: (html, parse) => `<${parse}>`,
        pdfa: (html, sel) => ['<it1>', '<it2>'],
        pd: (html, parse, base) => `${parse}@${base || ''}`,
    });
    const src = await rt.load({
        meta: {title: 'JQ'},
        async run(ctx) {
            ctx.url = 'https://j.com/';
            return await ctx.lib.parse.parseRule('jq:.list;a&&Text;img&&src;.desc&&Text;a&&href', ctx);
        },
    }, {key: '_jq'});
    const list = await src.callStage('run');
    assert.equal(list.length, 2);
    assert.equal(list[0].vod_name, '<a&&Text>');
    assert.equal(list[0].vod_pic, 'img&&src@https://j.com/');

    const src2 = await rt.load({meta: {title: 'J2'}, async run(ctx) { return await ctx.lib.parse.parseRule('json:a;b', ctx); }}, {key: '_j2'});
    assert.deepEqual(await src2.callStage('run'), [], '少于 5 段返回空');
});

// ══════════ pdfl 回退 ══════════
test('W5 pdfl：HostEnv 未注入 → pdfa+逐元素 pdfh/pd 回退；注入 → 直接使用', async () => {
    const rt = new Runtime({...HOST_ENV,
        pdfh: (html, parse) => (parse === 't&&Text' ? '标题' + html.slice(-1) : ''),
        pdfa: () => ['x1', 'x2', 'x3'],
        pd: (html, parse, base) => 'https://u.com/' + html.slice(-1),
    });
    const src = await rt.load({
        meta: {title: 'F'},
        async run(ctx) {
            return ctx.lib.parse.pdfl('<list></list>', '.item', 't&&Text', 'a&&href', 'https://u.com/');
        },
    }, {key: '_f'});
    assert.deepEqual(await src.callStage('run'), ['标题1$https://u.com/1', '标题2$https://u.com/2', '标题3$https://u.com/3']);

    const hostPdfl = (html, p, lt, lu, mu) => ['host$host'];
    rt.use({pdfl: hostPdfl});
    const src2 = await rt.load({meta: {title: 'F2'}, async run(ctx) { return ctx.lib.parse.pdfl('h', 'p', 't', 'u', 'm'); }}, {key: '_f2'});
    assert.deepEqual(await src2.callStage('run'), ['host$host']);
});

// ══════════ jp / jinja2 / 模板 / crypto ══════════
test('W5 jp/jinja2/模板接入（peer cheerio.jinja2/jp + jinja + 模板.getMubans）', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({
        meta: {title: 'JJ'},
        async run(ctx) {
            const {jp, jinja2, 模板} = ctx.lib.parse;
            return {
                jp: jp('$.a[0].b', {a: [{b: 42}]}),
                jinja2: jinja2('year={{fl.year or "all"}}&x={{fl.sort}}', {fl: {year: 2024, sort: 'c2'}}),
                mubans: typeof 模板.getMubans,
            };
        },
    }, {key: '_jj'});
    const r = await src.callStage('run');
    assert.equal(r.jp, 42);
    assert.equal(r.jinja2, 'year=2024&x=c2');
    assert.equal(r.mubans, 'function');
});

test('W5 crypto：md5/base64/ungzip（含 百忙无果 真实 filter 串解压）', async () => {
    const rt = new Runtime(HOST_ENV);
    const filterGz = 'H4sIAAAAAAAAA+2XvUrDUBSA3+XOHc65adraN+jm5CIdYok/GFupWiilIBalIFYoIh1EBxEKIih0MOZ1msS+hbc1yTni4mKms6XfIbnnC/mG9hSq6mZP7btdVVWNXae949aa2y1VUE3nwDVsHkw+Z378FoT3l4Z2HO/EXd3SNMPwfLoYTJfY/HA8T/UL6eDK3JUMtjDjnb3DFOoMbtTW45tpOHxPR1Y2Sk4/86PxSzotqn59Of/e+ajVPqZto9E4/Lj+tWd0dxrdviYPaNA6hseD9MEN2ih+eJr7o8XzJBxepNOfx3Zdp03Hhv5sHjz+/fVo0MUEry4Zt4hbnGvimnMkjpwDcWAc1zJuLhmvEK9wXiZe5rxEvMS5TdzmnHyR+yL5IvdF8kXui+SL3BfJF7kvkC9wXyBf4L5AvsB9gXyB+wL5AvcF8oXVl1MvKC2pSWqSWh6pWZKapCap5ZGaDdKatCat5dKa/FuT1qS1XFpD80YkNolNYvv32PpfCLkneIcUAAA=';
    const src = await rt.load({
        meta: {title: 'CR'},
        async run(ctx) {
            const c = ctx.lib.crypto;
            return {
                md5: c.md5('abc'),
                b64: c.base64Decode(c.base64Encode('中文内容abc')),
                roundtrip: c.ungzip(c.gzip('gzip-roundtrip-数据')),
                filter: Object.keys(JSON.parse(c.ungzip(filterGz))),
                ready: await c.ready(),
            };
        },
    }, {key: '_cr'});
    const r = await src.callStage('run');
    assert.equal(r.md5, '900150983cd24fb0d6963f7d28e17f72');
    assert.equal(r.b64, '中文内容abc');
    assert.equal(r.roundtrip, 'gzip-roundtrip-数据');
    assert.ok(r.filter.includes('2'), '真实 filter 解压出分类维度（键为分类 id）');
    assert.equal(r.ready, true);
});

// ══════════ wasm.load ══════════
function makeWasmRt(loadAsset) {
    return new Runtime({...HOST_ENV, loadAsset, wasm: 'native'});
}

test('W5 wasm.load：emscripten 胶水识别 + 垫片 + 就绪等待 + 按路径缓存（金标准 B 托管语义）', async () => {
    let loads = 0;
    const rt = makeWasmRt(async (p) => {
        loads++;
        return fs.readFileSync(path.join(HERE, 'fixtures', 'cntv-wasm-stub.cjs'), 'utf8');
    });
    const src = await rt.load({
        meta: {title: 'W'},
        async run(ctx) {
            const mod1 = await ctx.lib.wasm.load('./cntv-wasm.cjs');
            const mod2 = await ctx.lib.wasm.load('./cntv-wasm.cjs');   // 第二次 → 缓存命中
            const a = mod1._jsmalloc(64);
            mod1.HEAP8.set(Array.from('20260911', (ch) => ch.charCodeAt(0)), a);
            mod1._CNTV_InitPlayer(a);
            const dAddr = mod1._jsmalloc(16);
            mod1.HEAP8.set(Array.from('datestr', (ch) => ch.charCodeAt(0)), dAddr);
            const nalAddr = mod1._jsmalloc(16);
            mod1.HEAP8.set([0x65, 0x88, 0x84, 0x21, 0x6c], nalAddr);
            const ret = mod1._jsdecVOD(dAddr, nalAddr, 5, 18);
            const out = Array.from(mod1.HEAP8.subarray(nalAddr, nalAddr + ret));
            const tag = mod1._CNTV_UpdatePlayer(nalAddr);
            mod1._jsfree(nalAddr);
            return {cached: mod1 === mod2, date: mod1.__date, out, tag, ready: mod1.ready === true};
        },
    }, {key: '_w'});
    const r = await src.callStage('run');
    assert.equal(loads, 1, 'loadAsset 只读一次（按路径缓存）');
    assert.equal(r.cached, true, '同路径缓存命中');
    assert.equal(r.ready, true, 'onRuntimeInitialized 就绪等待完成');
    assert.equal(r.date, '20260911', '低层 API 原样可用');
    assert.equal(r.out.length, 5);
    const k = 'datestr'.length & 0xff;
    assert.deepEqual(r.out, [0x65 ^ k, 0x88 ^ k, 0x84 ^ k, 0x21 ^ k, 0x6c ^ k], '_jsdecVOD 解密语义');
    assert.ok(r.tag > 0);
});

test('W5 wasm.load：Uint8Array 原生编译（0asm 魔数）+ 按字节哈希缓存', async () => {
    const rt = makeWasmRt(async () => {
        throw new Error('不应走 loadAsset');
    });
    const src = await rt.load({
        meta: {title: 'WB'},
        async run(ctx) {
            const m1 = await ctx.lib.wasm.load(WASM_ADD);
            const m2 = await ctx.lib.wasm.load(WASM_ADD);
            return {sum: m1.exports.add(20, 22), cached: m1 === m2};
        },
    }, {key: '_wb'});
    const r = await src.callStage('run');
    assert.equal(r.sum, 42);
    assert.equal(r.cached, true);
});

test('W5 wasm.load：远程 URL 走 req（buffer:2 base64 语义）', async () => {
    const urls = [];
    const rt = new Runtime({...HOST_ENV, wasm: 'native', req: async (url, o) => {
        urls.push({url, buffer: o && o.buffer});
        return {content: Buffer.from(WASM_ADD).toString('base64'), headers: {}};
    }});
    const src = await rt.load({
        meta: {title: 'WR'},
        async run(ctx) {
            const m = await ctx.lib.wasm.load('https://cdn.example.com/add.wasm');
            return m.exports.add(1, 2);
        },
    }, {key: '_wr'});
    assert.equal(await src.callStage('run'), 3);
    assert.deepEqual(urls[0], {url: 'https://cdn.example.com/add.wasm', buffer: 2});
});

test('W5 wasm.load：缺 loadAsset 注入 → 工程化报错', async () => {
    const rt = new Runtime(HOST_ENV);
    const src = await rt.load({meta: {title: 'WE'}, async run(ctx) { return await ctx.lib.wasm.load('./x.cjs'); }}, {key: '_we'});
    await assert.rejects(() => src.callStage('run'), (e) => e.name === 'Drpy3Error' && /loadAsset/.test(e.message));
});
