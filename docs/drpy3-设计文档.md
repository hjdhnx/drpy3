# drpy3 设计文档 —— 站在 drpy2 肩膀上的下一代源规则框架

> 状态：设计稿 v0.3（2026-09-11 评审定稿）
> 前置阅读：[drpy2-移植对接指南.md](./drpy2-移植对接指南.md)
> 设计基准：`src/drpy2.js`（3.9.52beta3）+ 标杆源 [百忙无果[官].js](<./百忙无果[官].js>)（已在 drpy2 下实测通过 init/home/category/search/detail/play 六环节端到端冒烟验证，见附录 C）

---

## 0. 继承：drpy2 的设计哲学不变

drpy2 的成功建立在一条朴素的路线上，drpy3 **完整继承**：

1. **源 = 爬虫，公共需求极多**。把公共需求沉淀成标准库，源作者只写"这个站特有的那点逻辑"：
   - 注入能力：`req`（网络）、`pdfh/pdfa/pd`（jsoup 解析三件套）、`batchFetch`（并发请求）
   - 框架内置：`request/post/reqCookie`、`base64Encode/base64Decode/md5`、`gzip/ungzip`、`AES/RSA`、`urlencode/joinUrl/getHome`、`setResult` 系列、UA 常量、OCR 过验证、去广告 `fixAdM3u8(Ai)`、模板 `模板.getMubans()`……
2. **一份源，多壳运行**。源不关心宿主是 Android 壳、Python 服务还是 Node 服务；宿主侧注入面保持最小、语义稳定。
3. **TVBox 数据结构不动摇**。`class/list/vod_*`、`vod_play_url` 的 `名称$链接#名称$链接$$$线路2`、`vod_id` 的 `分类$id` 拼接约定、`play` 返回 `{parse, url, jx, flag}`——这些是生态兼容的根基，drpy3 原样保留。
4. **声明式规则优先，js: 片段兜底**。能一行选择器解决的（`json:data.list;title;img`）不写代码；`js:` 片段依然是一等公民。

---

## 1. 为什么要 drpy3：drpy2 的结构性痛点

以下痛点均来自 drpy2 的实际架构（`src/drpy2.js` 通读 + 对接实测），不是猜测：

| # | 痛点 | 根因 |
|---|------|------|
| 1 | **全局状态串数据**：`rule / MY_URL / VODS / VOD / TABS / LISTS / fetch_params / oheaders` 全是模块级可变全局 | 一次调用改全局，另一次调用（或另一个线程挤进同一 Context）读到脏数据。壳子被迫"一源一 Context + 单线程串行 + 大锁"（hipy 的 `ThreadPoolExecutor(max_workers=1)` 模式），高并发场景吞吐上不去 |
| 2 | **同步阻塞 IO**：`request()` 同步等 `req()` 返回 | 引擎在等网络时完全空转；一个 5 秒超时的死链会卡住整个队列。没有 `Promise.all`，多请求只能 for 循环串行累加 |
| 3 | **注入靠全局变量名约定**：`req/pdfh/...` 挂在 globalThis | 装了没有回执、缺了运行期才炸、无法版本化、无法按源覆写；对接方只能靠文档对照（见对接指南附录 A 的考古表） |
| 4 | **无模块化**：源是单文件 | 复用靠复制粘贴或 `$require(远程url)`（网络依赖 + 无版本锁定）；无法把签名算法、通用爬虫逻辑抽成共享模块 |
| 5 | **wasm 是补丁**：core-lite 用 polywasm 软解释兜底 | 性能差几个数量级；源作者想正经用 wasm 做加密/解协议没有顺手的通道 |

---

## 2. 设计目标

| 目标 | 手段 |
|------|------|
| G1 源作者体验不降级 | 标准库只增不减；声明式规则语法全保留；js: 片段保留 |
| G2 高并发不串数据 | **消灭全局可变状态**：实例模型 + 调用级 ctx（§4） |
| G3 性能提升 | async/await 全异步 IO（§5）；wasm 一等公民（§6）；单引擎多实例 |
| G4 注入灵活明确 | 唯一注入面 HostEnv：构造期校验 + 运行时可覆盖（§7） |
| G5 模块化源 | 源文件头部可直接 `import`/`require` 相对路径的 ESM/CJS 模块（§8） |
| G6 生态平滑迁移 | drpy2 兼容层：老源零改动运行（§11） |
| G7 AI/Agent 原生 | 零样板纯声明式源、单页契约规范、官方自测 CLI、工程化报错（§14）——未来大部分人写源的方式是"对 AI 说需求"，框架把 agent 当一等公民客户 |

**非目标**（明确不做，避免过度设计）：
- 不做源代码安全沙箱——爬虫源天然需要全权网络与加解密能力，隔离的目标是**状态隔离与故障隔离**，不是权限沙箱。
- 不改 TVBox 数据结构、不改源分发形态（单个 js 文件仍是标准分发物）。
- 不引入构建强依赖——不打包也能跑（§8 模式 A/C），打包只是推荐优化（模式 B）。

---

## 3. 总体架构

```
┌─────────────────────────── 壳子（宿主）───────────────────────────┐
│  业务/UI/播放器                                                    │
│      │ 调用 await source.search(...)，拿对象或 JSON 串             │
│      ▼                                                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Runtime（drpy3-core，ESM 类库，一次加载常驻）                │  │
│  │   ├ HostEnv  ←—— 壳子注入的唯一能力集合（req/pdf/store/...）│  │
│  │   ├ 标准库 lib（net/parse/crypto/text/utils/wasm/store）    │  │
│  │   ├ 规则引擎（一级/二级/搜索字符串规则解析器 + js: 片段执行）│  │
│  │   ├ 模块加载器（ESM loader / CJS shim / 预打包直跑）        │  │
│  │   └ 兼容层 load2x()（drpy2 老源包装器）                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│      │ load()                          │ load2x()                 │
│      ▼                                ▼                          │
│   Source 实例（drpy3 新源，可并发）   Source2x 实例（老源，自动串行）│
└──────────────────────────────────────────────────────────────────┘
```

三角色：

- **源作者**：面对的是 `defineSource()` + `ctx.lib` 标准库，写"一个站怎么爬"。
- **框架（drpy3-core）**：面对的是 TVBox 结构与源语义，负责调度、隔离、序列化、规则解析。
- **壳子**：面对的是 `Runtime` 构造参数（HostEnv），只实现自己平台擅长的原语（HTTP、HTML 解析、存储），其余全部有框架 JS 兜底。

---

## 4. 核心变更一：消灭全局 —— 实例模型与两层上下文

### 4.1 源的新写法

```js
// 示例源：sources/示例[官].js（lang: dr3）
import { defineSource } from 'drpy3';
import { mgtvSign } from './lib/mgtv-sign.mjs';   // ← 相对路径模块，§8
const CACHE_KEY = require('./lib/keys.js').key;   // ← CJS 风格也支持

export default defineSource({
    meta: {                       // 原 @header({...}) 的结构化等价物
        title: '示例[官]',
        host: 'https://example.com',
        searchable: 2, filterable: 1, quickSearch: 0,
        lang: 'dr3',
    },
    rule: {                       // 声明式规则：与 drpy2 语法完全一致，全保留
        url: '/api/list?channelId=fyclass&pn=fypage',
        一级: 'json:data.hitDocs;title;img;updateInfo;playPartId',
        二级: 'js: ...',          // js: 片段仍是合法兜底手段
        filter_url: 'year={{fl.year or "all"}}',
    },
    // 生命周期钩子全部可选、全部 async；不想用声明式规则的字段可以整段自己写
    async init(ctx, ext) { /* 换源/extend 预处理；不写则框架走默认初始化 */ },
    async home(ctx, filter) { /* 不写则走 rule.class_parse 默认解析 */ },
    async category(ctx, tid, pg, extend) { },
    async detail(ctx, id) { },              // id 透传规则：源声明 rule.detailUrl（声明式路由，分类时引擎加「分类$」）→ 引擎剥除自己加的前缀（drpy2 同语义往返）；否则 vod_id 属于源自有的任意文本（drpyS 式 ### 拼装等），引擎原样透传不加工
    async play(ctx, flag, id) { },
    async search(ctx, wd, quick, pg) { },
    async proxy(ctx, params) { },
    async action(ctx, action, value) { },   // 源内交互通道（设置中心/推送/对话，自 drpyS 生态转正，见 §10.2）
    async sniffer(ctx) { },
    async isVideo(ctx, url) { },
});
```

对源作者来说变化只有三点：**钩子是 async 函数**、**第一个参数是 ctx**、**不再有任何全局依赖**。而且这三点全部是可选的——**纯声明式源可以一个钩子都不写**：

```js
// 最简源：default export 直接是 rule 对象，零包装（行数与 drpy2 的 var rule 持平）
export default {
    meta: { title: '最简示例[官]', host: 'https://example.com', lang: 'dr3' },
    rule: {
        class_name: '电影&剧集', class_url: '1&2',
        url: '/api/list?cid=fyclass&pg=fypage',
        一级: 'json:data.list;name;cover;remark;id',
    },
}
```

框架按 default export 形态自动判定：**纯对象 = 纯声明式源**（全部生命周期走内置规则解析，无代码可写错）；**含钩子/包了 defineSource = 增强源**。`defineSource` 运行时是恒等函数，唯一作用是给 IDE/TS 提供类型提示——用不用都不影响行为。

### 4.2 两层上下文（这是"不串数据"的关键）

| 层 | 载体 | 生命周期 | 内容 | 替代的 drpy2 全局 |
|----|------|----------|------|-------------------|
| 实例态 | `Source` 实例 | load 到 destroy | `rule`（init 后定稿）、`store`（持久 KV，接壳子数据库）、`cache`（TTL 内存缓存）、`meta`、`key`(RKEY) | `rule`（跨调用的部分）、`RKEY`、`oheaders` |
| 调用态 | `ctx` | 单次 home/search/... 调用 | `ctx.rule`（实例 rule 的只读引用）、`ctx.url`（MY_URL）、`ctx.fl`（筛选）、`ctx.scratch`（临时篮子）、`ctx.input/flag/wd` 等入参回显、`ctx.lib`、`ctx.log` | `MY_URL`、`VODS/VOD/TABS/LISTS`、`fetch_params`、`input`、`TYPE/MY_PAGE/KEY` 等 js: 片段变量 |

```js
// ctx 的完整形态（框架构造，源只读）
ctx = {
    // —— 调用态（每次调用全新对象，天然隔离）——
    url: 'https://...',        // 本次请求目标（原 MY_URL）
    input: '...', flag: '...', // play 场景入参回显
    wd: '...', pg: 1,          // search 场景
    fl: {...},                 // category 场景的筛选条件（原 extend）
    scratch: {},               // js: 片段/钩子间传临时数据的篮子（原 VODS/VOD/TABS/LISTS 归宿）
    fetchParams: {...},        // 本次调用的请求参数基线（原 fetch_params）
    // —— 实例态的只读投影 ——
    rule: {...}, key: '_md5', meta: {...},
    headers: {...},            // 实例请求头基线（**可变**：init/任意调用中更新后，实例内后续请求自动携带，§4.4）
    resumed: false,            // 复温标记：本次 init 由驱逐后恢复触发（headers 已按快照回填），源可跳过登录预处理（§4.6）
    // —— 能力 ——
    lib: {...标准库，见 §9}, log: fn, store: {...}, cache: {...},
    capabilities: {...},       // 本 Runtime 能力表（wasm 档位/action 通道等，源可据此降级）
    // —— 高频快捷别名（lib 的投影，见 §4.5）——
    req, request, post,        // = ctx.lib.net.*
    pdfh, pdfa, pd,            // = ctx.lib.parse.*
    md5, base64Encode, base64Decode, joinUrl, getProxyUrl, ...
}
```

### 4.3 并发契约（写进规范，框架保证）

1. 同一 `Runtime` 可 load **任意多个** Source 实例（drpy2 做不到：一源一 Context）；实例之间零共享可变状态。
2. **同一实例的多个调用可并发**执行（async 交错），互不可见：它们各持独立 `ctx`，实例态 `rule` 约定 init 后只读——框架在 dev 模式冻结 `ctx.rule` 帮助源作者及时发现违规写入。
3. 需要"跨调用共享的可变状态"必须显式走 `store`（持久）或 `cache`（TTL），语义清晰、由壳子决定是否真持久。
4. js: 片段在 `with(ctx.scratch)` + `new Function` 参数注入的作用域里执行（§5.3），不触碰 globalThis。
5. 兼容层的 drpy2 老源不满足以上假设 → 框架自动给老源实例加**串行队列**（§11），保证老语义，同时不影响同引擎里其他实例并发。
6. 各钩子以**源实例为 `this`** 调用——实例上自定义的辅助方法与字段可在钩子间直接复用（如 init 预热时调 this.category 灌缓存），这是"有状态源"的归宿之一（§4.4）。

### 4.4 状态管理：drpy2/drpyS"有状态源"的归宿

drpy2/drpyS 的源普遍是**有状态的**：init 里预取的数据（央视频源在模块顶层 `let columns = {}`，
init 的 readColumns() 灌入、search 直接读）、init 算好后续用的 `js2Base`、预处理累积的 cookie、
`rule` 本身——这些"生命周期 = 从 init 到销毁"的实例状态是真实需求，drpy3 **全部保留**并明确分层：

| 状态 | drpy2/drpyS 写法 | drpy3 归宿 | 生命周期 |
|------|-----------------|-----------|---------|
| 规则与配置 | `rule`（模块全局） | `ctx.rule`（只读投影） | init 后固定 |
| 跨调用自由变量 | 模块顶层 `let columns / js2Base` | **`this.columns = ...`**（实例自定义字段/方法） | 实例存活期 |
| 跨调用临时篮子 | `VODS / VOD / TABS / LISTS` | `ctx.scratch` | 单次调用 |
| 持久化 KV | `setItem / getItem / local` | `ctx.store` | 跨重启（壳子决定介质） |
| 进程内热缓存 | 无（各源自造轮子） | `ctx.cache`（TTL） | 进程存活 |
| 本次请求参数 | `fetch_params / MY_URL / input` | `ctx.fetchParams / ctx.url / ctx.input` | 单次调用 |

对模块顶层 `let` 的兼容说明：模块加载下源文件顶层 `let` 依然可用——但语义是 **per-module**
（同源多实例共享同一份）而非 per-instance，因此只适合放不可变常量与派生表；可变的每源状态请用
`this.xxx`（实例隔离）或 `ctx.store/cache`。dev 模式下框架做"同源双实例对拍"检测状态串写并告警。

**典型场景：预处理拿 cookie，后续所有请求自动携带。** 这是 drpy2 时代最常见的有状态源写法
（`预处理` js 改 `rule_headers/fetch_params` 的 Cookie）——本质是"跨调用的实例级请求头"，drpy3
给了专用归属：**实例请求头基线 `ctx.headers`**（init 时从 `rule.headers` 拷贝创建，可变）。
请求头合并优先级：`本次 options.headers > ctx.fetchParams.headers > ctx.headers`（实例基线）。

```js
async init(ctx, ext) {
    // 预处理：请求拿 cookie → 写入实例基线，本实例之后的一切请求自动携带
    const res = await ctx.req(loginUrl);
    ctx.headers.Cookie = parseCookie(res.headers);
    await ctx.store.set('cookie', ctx.headers.Cookie);      // 可选：持久化，跨重启免重登
}

// cookie 过期自愈：任意调用中发现失效 → 就地更新，后续所有调用立即可见（实例态天然可见）
ctx.headers.Cookie = newCk;
await ctx.store.set('cookie', newCk);

// init 回填：配合 store 实现"跨重启免重登"
ctx.headers.Cookie = await ctx.store.get('cookie') || '';
```

### 4.5 API 手感：短名从哪来（对抗"ctx.lib.net.request 又丑又长"）

`ctx.lib.*` 是**权威命名空间**（类型、文档、capabilities 只维护这一份），但源作者日常不需要写全名——三条等价路径：

**① 钩子顶部解构（官方推荐惯用法）——解构之后与 drpy2 写法完全一致：**

```js
async search(ctx, wd, quick, pg) {
    const { request, post, all } = ctx.lib.net;           // 一行解构 = 依赖清单
    const { pdfa, pdfh } = ctx.lib.parse;
    const { base64Encode, md5 } = ctx.lib.crypto;
    let html = await request(url);                        // ← 和 drpy2 一模一样的短名
    return { list: pdfa(html, '.list').map(/*...*/) };
}
```

**② ctx 顶层快捷别名**——高频约 20 个函数提升到 ctx 一层，一景点用：

```js
await ctx.req(url);             // = ctx.lib.net.req
ctx.pdfh(html, '.t&&Text');     // = ctx.lib.parse.pdfh
ctx.md5(s); ctx.base64Encode(s); ctx.joinUrl(a, b);
```

**③ js: 片段内老名字全量原名注入**——request/fetch/pdfa/base64Encode/setResult 等 drpy2
全部全局名按原名可用（§5.3），老肌肉记忆零迁移。

约束：快捷别名与解构只是 `ctx.lib.*` 的**投影**，避免双源漂移；首推 ①（解构）——既短，又让每个
钩子顶部的依赖一目了然，对 AI 写源尤其友好（依赖即声明，静态可分析）。

### 4.6 实例生命周期：热更新、驱逐与聚合场景的资源治理

源实例不是"加载了就永远活着"的。drpy3 把实例建模为一个小的**状态机**，由 Runtime 按
**空闲度 + 内存水位 + 重建成本** 自动治理，壳子零管理成本：

| 状态 | 含义 | 持有 |
|------|------|------|
| Cold | 未实例化（默认态）。保留轻量句柄：源路径 / key / extend / 内容签名 | 几百字节 |
| Hot | 已实例化并 init 完成：`this.xxx`、headers 基线、cache、wasm 就绪 | 引擎堆内存 |
| 驱逐中 | in-flight 调用排空后释放 | — |

- **Cold → Hot**：按需复温（调用到达时触发）——eval 源码 + `init()`。
- **Hot → Cold**：两类触发：① 空闲 LRU 超时（默认 120s，可配）；② 引擎内存水位超限
  （默认堆 70% → 驱逐最冷实例至 50%）。驱逐按**重建成本评分**从便宜的开始：纯声明式源 <
  普通 async 源 < 预热过 wasm / 登录过 cookie 的源（后者支持壳子 pin）。
- **热更新 = 强制驱逐**：源文件（或其依赖树，§8）内容签名变化 → 该实例无论多新都强制驱逐重建。
  触发是内容哈希惰性校验（对标 drpy-node `moduleCache` 的 fileHash 机制，不强制文件 watcher），
  每次调用前比对；壳子也可用 `src.signature()`（内容指纹）主动轮询。与常规驱逐共用同一条
  机制，不另起炉灶。
- **并发与失败安全**：有 in-flight 调用的实例不驱逐；复温请求到达时若正在重建则排队；
  复温/init 失败 → 保留旧实例继续服务（或标记错误态上报），绝不因一次改坏源拖垮同引擎其他实例。
- drpy2 兼容层（§11）同样适用：老源本就是整文件 eval，重载即重建，零额外成本。

**聚合搜索场景：壳子批量搜 200 个源 → 用户选择性进某个详情**

关键认知：**搜索结果与实例解耦**。search 返回的是纯数据（vod 列表 JSON），由壳子持有——
200 份结果数据也就几 MB，不需要任何活实例陪跑；进详情只需要 `(源key, vod_id)`。而且 drpy
协议天然配合：`vod_id` 自带上下文（`分类$id`、`@@`拼装的名称/图片），detail 不依赖搜索时的
实例内存状态。

于是策略是——**数据常驻、实例按需**：

1. 批量搜索期间 Runtime 内活性实例数随调度起伏（搜索是短调用，跑完即闲）；
2. 搜索潮退去，空闲超时/水位触发批量驱逐 → 200 个实例回到 Cold，内存里只剩结果数据；
3. 用户点进某个详情 → 该源从 Cold 复温：重跑 eval + init（轻则几十毫秒，重则秒级）；
4. 用户聚合浏览的少数源自然留在 Hot（LRU 保热点），内存始终有界。

对比两个极端：*无状态、每次进详情都全量重初始化*——功能可行但重 init 源（wasm 预热、登录）
每次全量重来，体验差；*200 源全常驻*——共享引擎下轻实例也许只占几十 MB，但 wasm/缓存随之
驻留、GC 压力大，且没有任何收益（detail 并不需要搜索时的实例内存）。drpy3 的答案：中间态
交给状态机自动治理。

**快速复温的四个抓手（让"重新初始化"尽量便宜）**：

1. **Runtime 级缓存跨实例存活**：wasm 模块（按内容哈希）、模板/CryptoJS/cheerio 单例
   不随实例驱逐——央视频复温时 wasm 零重编译；
2. **store 跨驱逐存活**：cookie/配置从 store 回填 `ctx.headers`（§4.4），登录态免重跑；
3. **官方写法引导：重预取一律 lazy + cache**——init 只做必须的鉴权，大表数据首次访问时
   取并写 cache（央视频-2 的栏目表即此写法）。init 越轻，复温越快；
4. **可选 `resume` 钩子**：重 init 代价高的源可声明 `async resume(ctx)`，复温时框架优先调它
   （从 store/cache 恢复状态、跳过全量预处理）；未声明则照常 init。配 `meta.stateVersion`
   字段防止旧状态误恢复。

**"进详情必须先有 cookie"的场景——复温时 cookie 的三层命运：**

批搜 200 源时每个源本来就 init 过（拿 cookie 才能搜），这笔成本在搜索阶段已经付出；生命周期
设计只影响搜索之后。实例被驱逐后再进详情，复温 init 的 cookie 从哪来分三层，**功能任何一层都
不会失效**：

| 层 | 条件 | 复温行为 | 额外网络成本 |
|----|------|----------|-------------|
| A | 源按 §4.4 把 cookie 写入了 `store` | init 从 store 回填 `ctx.headers` | **0**（免重登） |
| B | 框架自动快照 | 驱逐时框架快照 `ctx.headers`（含 stateVersion），复温时回填并置 **`ctx.resumed = true`**；init 见该标记可跳过登录预处理 | 0（快照恢复） |
| C | 源什么都没做 | init 原样重跑，重新请求登录 | 1 次请求（保底，延迟换内存） |

```js
async init(ctx, ext) {
    if (!ctx.resumed) {                                    // 冷启动才登录；复温时 headers 已快照回填
        const res = await ctx.req(loginUrl);
        ctx.headers.Cookie = parseCookie(res.headers);
    }
    // 恢复的 cookie 若已过期：不 special-case，走 §4.4 自愈——请求失效就地刷新并更新 store
}
```

正确性从不依赖"恢复的 cookie 一定有效"——三层恢复是**优化**，§4.4 的过期自愈才是**正确性
保证**。配套：`meta.initCost: 'low'|'high'` 让源声明 init 重量（wasm 预热/登录类标 high），
驱逐评分优先保护；壳子 `pinList` 可钉住高频重 init 源。

**默认参数**（壳子可配）：`idleTTL=120s`、`maxHot=16`、`memWatermark=70%/50%`、
`pinList=[]`（壳子钉住的高频源）。

---

## 5. 核心变更二：async / await

### 5.1 原则

- **框架对源暴露的 API 全部返回 Promise**：钩子可 async 可同步（框架统一 `await`）。
- **标准库里所有可能 IO 的函数都 async**：`lib.net.req/get/post/all/download`；纯 CPU 函数保持同步（`pdfh/pdfa/pd/md5/base64/...`），避免无谓的 await 噪音。
- **宿主注入函数同步异步皆可**：框架统一 `await` 处理。返回普通值 = 立即完成的 Promise。

### 5.2 并发写法（性能收益所在）

```js
// 详情页：选集接口 + 详情页 + 猜你喜欢 三路并发（drpy2 里只能串行累加）
const [epJson, html, guess] = await ctx.lib.net.all([
    ctx.lib.net.req(epUrl),
    ctx.lib.net.req(pageUrl),
    ctx.lib.net.req(guessUrl),
]);

// 分类页并发拉 3 页
const pages = await ctx.lib.net.all(urls.map(u => ctx.lib.net.req(u)));
```

`lib.net.all = Promise.all` 的语义化别名。墙钟时间从"各请求耗时之和"变成"最慢的那个"。

### 5.3 js: 片段的异步化

drpy2 的 js: 片段靠 `eval` 在全局作用域展开（靠全局变量传值）。drpy3 改为受控包装：

```js
// 框架内部实现（示意）
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const fn = new AsyncFunction('ctx', 'lib', 'input', 'MY_URL', ...片段需要的形参列表, 片段代码);
await fn(ctx, ctx.lib, ...);
```

- 片段里可以 `await ctx.lib.net.req(...)`；
- `setResult/VOD/input/MY_URL/pdfl/batchFetch` 这些老名字由框架作为形参/访问器**参数化注入**，不再是全局；
- 片段语法异常时错误信息携带片段名（`二级` / `搜索`），定位不靠猜。

### 5.4 嵌入式宿主的异步桥接（关键工程决策）

QuickJS 引擎本身没有事件循环，async 的落地分三档，**壳子按能力自选，源代码无感**：

| 档 | 宿主形态 | 效果 |
|----|----------|------|
| A | Node / 浏览器 / Deno / Bun 宿主，或 quickjs-ng + 自研 loop | 完整体：真并发 IO，await 挂起不阻塞引擎 |
| B | 嵌入式绑定支持 job 泵（quickjs `JS_ExecutePendingJob` 循环 + 宿主异步调用回填 Promise，Java/C 绑定层可实现） | 完整体，多一步桥接开发 |
| C | 传统同步宿主（如 hipy 的 python quickjs 同步桥） | **降级兼容**：宿主 req 同步阻塞实现，`await req()` 的 Promise 立即 resolve，功能 100% 可用，只是没有并发收益（性能不低于 drpy2） |

> 这条是 drpy3 能平滑落地的前提：**任何能跑 drpy2 的壳子，都能原样跑 drpy3**，先享受架构红利（隔离、模块化、单引擎多源），再按需升级到 A/B 档拿并发。

---

## 6. 核心变更三：wasm 一等公民

### 6.1 引擎层（壳子责任）

- **首选引擎原生 WebAssembly**（quickjs-ng 已内置）：执行性能比 JS 软解释（polywasm）高几个数量级。壳子选型时把"原生 wasm"作为硬指标。
- 引擎无 wasm 时框架自动回落 polywasm 兜底（继承 core-lite 现状，只保证"能跑"，不保证性能）。
- 检测接口：`rt.capabilities.wasm = 'native' | 'polyfill' | 'none'`，源可据此降级算法。

### 6.2 框架层（源作者接口）

```js
// ① 加载 wasm：三种来源，带模块级缓存（同一路径只实例化一次）
const mod  = await ctx.lib.wasm.load('./crypto.wasm');            // 随源分发的相对路径（走 host.loadAsset）
const mod2 = await ctx.lib.wasm.load(bytes);                       // Uint8Array
const mod3 = await ctx.lib.wasm.load('https://cdn/x.wasm');       // 远程（走 req，buffer=2 语义）

// ② 标准加密套件：wasm 优先、JS 回退，源作者无感
await ctx.lib.crypto.ready();
ctx.lib.crypto.xxh64(str, seed);        // WXXH 的正规化替代，原生 wasm 时性能大幅提升
ctx.lib.crypto.aes decrypt(...)

// ③ Emscripten 胶水模块（JS 工厂 + 内嵌 wasm，如 CNTVModule 这类大模块）——load 自动识别并托管
const mod = await ctx.lib.wasm.load('./cntv-wasm.cjs');
// 框架职责：提供 emscripten 环境垫片（引擎里没有 window/process/XMLHttpRequest）、
// 调用工厂、等待 onRuntimeInitialized、按路径缓存实例——源里不再手写单例管理
// （drpy2/drpyS 时代每个源要自己写 initWasmModule/wasmInitPromise/onRuntimeInitialized 那一套）
mod._jsmalloc(n); mod.HEAP8.set(bytes, addr); mod._CNTV_InitPlayer(addr); mod._jsfree(addr);  // 低层 API 原样可用

// ④ 配套的二进制 IO 契约（wasm 解密场景的主要消费方）：
const tsBytes = (await ctx.lib.net.req(tsUrl, { buffer: 1 })).content;   // buffer:1 → content 为 Uint8Array（原始字节）
//  buffer:2 → base64 字符串；缺省 → 文本
// proxy 返回五元组 [status, mediaType, content, headers?, toBytes?] —— toBytes: 1=base64 转字节 /
// 2=URL 302 重定向流 / 3=服务端内联流式，完整契约见 §10.1（对标 drpy-node）
```

> **真实案例演示**：央视频（CNTV）源的 wasm 解密播放已按上述契约产出四种形态的改造演示稿——
> [央视频-1.js](<./央视频-1.js>)（零样板：一行 `lib.wasm.load` 替代手写单例管理）、
> [央视频-2.js](<./央视频-2.js>)（全钩子完美体：wasm 预热 + 栏目表 6 页并发 + cache）、
> [央视频-3.js](<./央视频-3.js>) + [央视频-3.lib.js](<./央视频-3.lib.js>)（解密算法独立成模块 + `?bytes` 资产导入）、
> [央视频-4.js](<./央视频-4.js>)（drpyS 平滑迁移：解密算法一行不动，仅改导出/加 ctx）。
> 原型为 docs/央视频.js（drpyS 风格，Emscripten 胶水模块 CNTVModule 手工单例管理）。

### 6.3 生态层

- `.wasm` 文件作为源的同目录资产随源分发（打包模式下由 esbuild 的 asset loader 一起出包）；
- 热门 wasm 库（xxhash、各类站点加密协议库等）官方维护"审核过的 wasm 资产清单"，源作者按路径引用，不重复内嵌。

---

## 7. 核心变更四：唯一注入面 HostEnv

### 7.1 从"N 个全局"到"1 个构造参数"

```js
import { Runtime } from 'drpy3';

const rt = new Runtime({
    // ═══ 必须注入（框架无法兜底的系统能力）═══
    req(url, options) {...},               // HTTP。可同步可异步，返回 {content, headers}（契约同 drpy2，但允许 Promise）
    pdfh(html, parse), pdfa(html, parse),  // jsoup 封装三件套（继承"pdf 系列交给壳子"的既定设计）
    pd(html, parse, base_url),

    // ═══ 可选注入（不给则框架用内置 JS 实现兜底，能跑但可能不如原生）═══
    batchFetch(items),                     // 默认：框架用 req + Promise.all 实现
    pdfl(html, parse, list_text, list_url, my_url),  // 默认：框架用 pdfa+pdfh/pd 逐元素回退（语义基准 drpy-node htmlParser.js:228）
    joinUrl(base, path),                   // 默认：内置 URL 解析实现
    store: {get, set, delete},             // 默认：内存 Map（重启丢失）
    log(...args),                          // 默认：console
    getProxy(isPublic),                    // proxy 类源才需要
    loadAsset(path),                       // wasm/随源资产读取；默认：宿主环境 fs 或 http
    env: {...},                            // 壳子自定义配置透传

    // ═══ 元信息 ═══
    engine: 'quickjs-ng 1.x', version: '1.0',
});

// 构造期一次性自检：缺什么、什么走了兜底，立刻打印清楚——不再"缺了运行期才炸"
rt.capabilities
// => { req: 'host', pdfh: 'host', pd: 'host', joinUrl: 'builtin',
//      store: 'memory-fallback', batchFetch: 'builtin', wasm: 'native', ... }
```

### 7.2 灵活注入：运行时覆盖与扩展

```js
rt.use({ pdfh: myFasterPdfh });          // 随时覆盖单项（壳子原生 ↔ JS 自实现互换，粒度到函数）
rt.use(await import('./my-parser.mjs')); // 也可以整包覆盖
```

- 注入来源三类等价：**壳子原生函数**（性能优先）、**标准 JS 模块**（cheario/htmlParser 移植）、**源自带模块**（源内 `lib/` 目录，随源分发）；
- 能力查找顺序：`source 自带 > rt.use 覆盖 > 构造注入 > 框架内置兜底`，每一层在 `capabilities` 可查——对接方从"考古全局名"变成"读一张能力表"。

### 7.3 与 drpy2 注入面的对照

| drpy2（全局） | drpy3（HostEnv 字段） | 变化 |
|---|---|---|
| `req` | `req` | 签名同，允许返回 Promise |
| `pdfh/pdfa/pd` | `pdfh/pdfa/pd` | 不变（仍是 jsoup 实例语义，各语言现成实现照用） |
| `batchFetch` | `batchFetch` | 从"源码事实标准"转正为正式 API，且框架可兜底 |
| `joinUrl` | `joinUrl` | 有内置兜底 |
| `local` | `store` | 改名并按源隔离（框架保证命名空间，壳子不再自己拼 key） |
| `console` | `log` | 可选，有兜底 |
| `getProxy` | `getProxy` | 不变 |
| `key` / `_debug` / `pdfl` | 并入 `meta` / `env` / 标准库 | 名词不再游离 |

---

## 8. 核心变更五：源内模块化（相对路径 ESM / CJS）

### 8.1 源作者视角

```js
// sources/示例[官].js 的开头 —— 相对路径基于【源文件自身位置】解析
import { defineSource } from 'drpy3';
import { mgtvSign } from './lib/sign.mjs';        // ESM 风格
const { UA_POOL } = require('./lib/ua.js');       // CJS 风格（同一源里混用合法）
import wasmBytes from './lib/prot.wasm?bytes';    // 打包模式下资产导入（模式 B 专属糖）
```

- 模块文件与源同目录分发（源目录 = 一个可含子目录的包），共享逻辑（签名、cookie 维持、通用列表解析）一处维护；
- 模块代码同样**没有全局**：需要标准库时以参数注入或显式 `import { lib } from 'drpy3'`。

### 8.2 三种运行模式（按壳子引擎能力自选，源代码不变）

| 模式 | 适用壳子 | 机制 | 备注 |
|------|----------|------|------|
| **A 原生模块** | quickjs-ng（`JS_SetModuleLoaderFunc`）、Node、浏览器 bundler | 引擎原生 ESM；壳子注入 loader：`(spec, importerPath) => sourceCode`，框架负责把相对 spec 解析为源目录内的路径 | 性能最好；需引擎支持 |
| **B 预打包（推荐默认）** | 一切壳子 | 官方 CLI `drpy3 build 源.js`（esbuild，仓库附带配置）把源+相对模块+资产打成**单文件**，产物仍是一个标准 js 源 | 确定性最高、加载最快、对加密源友好；drpy-webpack 仓库已有全套工具链基础 |
| **C 内置 CJS shim** | 无模块能力的老引擎（含 hipy 式同步 quickjs） | 框架内置微型模块系统：`require(spec)` → `host.loadAsset` 读文件 → `new Function('exports','require','module', code)` 包装执行，带循环依赖检测 | 只支持 CJS 语法；源含 ESM import 时构建期/加载期报错并提示走 B |

> 兼容性红线：**不做远端自动模块解析**（`require('https://...')` 一律拒绝），模块必须随源包分发——源包是自洽的，这是可审计、可离线的底线（老 `$require(远程)` 在兼容层保留，仅老源可用）。

---

## 9. 标准库清单（lib.*）

继承 drpy2 全部公开函数，按域归组；标 🔵 = 新增，标 ♻️ = 由全局函数改为 ctx/lib 方法，语义不变。

### net（全部 async）
- ♻️ `req(url, options)` → `{content, headers}`（同步宿主实现自动被 await 适配）
- ♻️ `request / post / reqCookie`（便捷封装，保留老名字）
- ♻️ `batchFetch(items)`：**正式并发批量请求 API**，语义与 drpy2 完全兼容——入参 `[{url, options}]`（options 同 req），返回**与入参顺序一一对应**的响应文本数组；空入参返 `[]`，单项失败返 `''` 不中断整批。宿主可注入原生实现（线程池/协程）加速，默认框架基于 `req` 并发兜底（js: 片段内老名字直调可用）
- 🔵 `all(promisesOrItems)` = 并发请求（Promise.all 语义化；与 batchFetch 的分工：`all` 面向 Promise 组合编程，`batchFetch` 面向"一批 url 拿一批文本"的批量语义）
- 🔵 `download(url, options)` → base64（原 `buffer:2` 约定的显式化）
- ♻️ `fixAdM3u8Ai(m3u8Url, headers)`

### parse（纯 CPU，同步）
- ♻️ `pdfh / pdfa / pd`（jsoup 语义，宿主注入；语法基准 = hipy htmlParser / drpy-node cheario，**不重造**）
- ♻️ `pdfl(html, parse, list_text, list_url, my_url)`：整列表一次解析（drpy2.1 加速语义，选集/列表页性能关键）。HostEnv **可注入**现成实现加速（drpy-node `htmlParser.js:228` 有生产级实现：批量模式单次 `cheerio.load` + DOM 索引标记）；未注入时框架自动回退"pdfa + 逐元素 pdfh/pd"组合（与 drpy2 无 pdfl 时的行为一致，正确性不受影响）
- ♻️ `jp(json, path)`（jsonpath，core 内置）
- ♻️ `jinja2(tpl, obj)`、`模板.getMubans()`
- 🔵 `parseRule(ruleStr, ctx)`：把 `'json:...;title;img'` 字符串规则解析成数据——高级源直接调它组合自定义逻辑

### crypto（纯 CPU，同步；`await crypto.ready()` 预热 wasm）
- ♻️ `md5 / base64Encode / base64Decode`、`aesX/desX`（CryptoJS）、`rsaX`（JSEncrypt/NODERSA 合一）、`rc4`
- ♻️ `gzip / ungzip`（pako）
- 🔵 `xxh64/xxh32`（wasm 优先）
- ♻️ `getOriginalJs`（源解密）、`OcrApi/verifyCode`（async 化）

### text / utils（同步）
- ♻️ `urlencode / encodeStr / decodeStr / cut / stringUtils`
- ♻️ `joinUrl / getHome / buildUrl / buildQueryString / forceOrder / 是否正版 / urlDeal / getProxyUrl`（getProxyUrl 为 HostEnv `getProxy` 的包装，proxy 类源取本地代理地址）
- ♻️ UA 常量：`MOBILE_UA / PC_UA / IOS_UA / UC_UA`
- ♻️ `setResult / setResult2 / setHomeResult` → 改为**写 ctx.scratch 并返回标准 list 结构**的纯函数

### 🔵 store / cache
- `store.get/set/delete`：源级持久 KV（壳子数据库 / 内存兜底；框架自动按源 key 隔离，壳子不再自己拼 RKEY）
- `cache.get/set(key, value, ttl)`：进程内 TTL 缓存（drpy2 完全没有，搜索/详情提速利器）

### 🔵 wasm
- `wasm.load(source)`：三态来源（相对路径 / 字节 / URL）、emscripten 胶水自动识别托管、按路径缓存——完整契约见 §6.2

---

## 10. 返回值与壳子桥接

- **源内部**：钩子返回 **JS 对象**（`{class:[]}` / `{list:[]}` / `{parse,url,...}`），不再 JSON 字符串——序列化只发生在壳子边界一次。
- **壳子桥接层**：`JSON.stringify(await source.xxx())`，得到的字符串结构与 drpy2 完全一致 → 现有 TVBox 前端/播放器零改动。

Node 壳最小桥接（完整壳子示例约 40 行）：

```js
import { Runtime } from 'drpy3';
const rt = new Runtime({ req, pdfh, pdfa, pd, store, log });   // node: fetch/cheario/...
const src = await rt.load(await fs.readFile('源.js', 'utf8'), { path: '源.js', key: '_src' });
await src.init('');
app.get('/api/search/:wd', async (req, res) =>
    res.type('json').send(await src.search(req.params.wd, false, 1)));   // 对象直发
```

Python 同步壳（降级档 C，hipy 改造路径）：

```python
rt = runtime_from_quickjs(ctx, host_env)          # req 仍为同步桥
src = rt.load(source_code, path='sources/x.js', key='_x')
src.init('')                                      # 框架同步外观；await 在无事件循环宿主上立即完成
data = src.search('斗罗大陆', False, 1)            # 返回 JSON 字符串（桥接层配置）
```

### 10.1 `proxy`：本地代理出口（对标 drpy-node 现行契约）

- 源内签名：`async proxy(ctx, params)`，`params` = 代理请求的 query 对象（含 `__range`/`__mediaProxy` 等壳子注入字段）；返回**响应数组**，缺省 `[404,'text/plain','Not Found']`。
- 响应数组契约（与 drpy-node `controllers/api.js` 逐位对齐）：

```
[statusCode, mediaType, content, headers?, toBytes?]
  [0] statusCode      数字
  [1] mediaType       MIME，缺省 application/octet-stream
  [2] content         内容（形态由 toBytes 决定）
  [3] headers?        附加响应头（可选对象）
  [4] toBytes?        内容语义标记（可选）：
      缺省  → 文本回包（text/json 补 UTF-8 编码）
      1     → content 为 base64（兼容 data:...;base64, 前缀）→ 解码为字节回包
      2     → content 为 http URL → 302 重定向到媒体代理服务（Range 透传）
      3     → content 为 http URL → 服务端内联流式 pipe（边收边吐，206/Range 语义，
              规避播放器不支持 302、跳转丢 header 的兼容问题）
```

- `toBytes=2/3` 是流媒体播放的关键档位：源解密完可把"解密后可直连的地址"交给壳子流式转发，也可对无需解密的直播流直接 pipe，避免 base64 大对象过桥的性能损耗。
- 用途：网盘直链代理播放、m3u8 去广告、TS 解密（toBytes=1）、大码率直播流转发（toBytes=2/3）。
- 参考：drpy-node `controllers/api.js` proxy 路由（`backRespList` 解析段）、`mediaProxy.js`；drpy2 的 `proxyParse` 仅覆盖到三/四元组，drpy3 以 drpy-node 五元组为准。

### 10.2 `action`：源内交互通道（自 drpyS/drpy-node 生态转正）

drpy2 没有这个函数；它是 drpy-node ds 源生态验证过的"源内 UI"机制，drpy3 将其纳入正式契约。

- **入口（数据侧）**：源在 home/category/search 的列表数据里输出 `vod_tag: 'action'` 的条目，`vod_id` 为动作标识或一段弹窗描述 JSON；壳子把它渲染成可点按钮/卡片。
- **处理（回调侧）**：用户点击后，壳子调用 `async action(ctx, action, value)`——`action` 为动作标识、`value` 为用户输入/选择；返回处理结果（提示消息字符串、或播放结构直接起播、或刷新后的数据）。框架给该通道**专用长超时**（默认 60s，可按动作指定），因为交互可能包含多轮输入。
- **弹窗描述协议**（壳子原生 UI，字段自 drpyS 实践标准化）：`{actionId, type:'input', title, tip, value, selectData:'标签:=值,...', imageUrl, imageHeight, imageClickCoord, keep, width, msgType}`——覆盖输入框、下拉选择、图片坐标选点、连续对话等形态。
- 典型用途：源内设置中心（改 cookie/域名/超时并 `ctx.store` 持久化）、推送播放、AI 对话、扫码登录。
- 参考：drpy-node `controllers/api.js` 的 `?ac=action&action=&value=` 路由、`spider/js/_lib.action.js`、`spider/js/设置中心.js`。
- 降级：壳子未实现 action 通道时（`rt.capabilities.action === false`），源可据此不输出 action 条目；框架对 action 钩子缺省返回空。

---

## 11. drpy2 兼容层（生态延续的生命线）

```js
const src = await rt.load2x(drpy2SourceCode);        // 识别 lang: dr2 / var rule 特征自动走兼容层
```

实现要点：

1. **隔离加载**：老源代码在 `new Function('ctx2x', code)` 的闭包作用域 eval（drpy2 老源依赖 `var rule` + 全局注入，包装器在该作用域内提供同名"伪全局"：`request/post/fetch`、`pdfh/pdfa/pd/jsp`、`setResult 系列`、`VODS/VOD/TABS/LISTS`、`MY_URL/input/fetch_params/MOBILE_UA/...`——全部映射到包装器实例的局部对象，**不再触碰 globalThis**）。
2. **自动串行**：老源实例内部调用排队（保持 drpy2 的时序语义）；同引擎内的其他实例（新老均可）不受影响并发。
3. **验收基准**：以 [百忙无果[官].js](<./百忙无果[官].js>) 为冒烟基准（附录 C 的六环节用例照搬），兼容层跑不过 = 不能发布。
4. **不做**：老源 async 化改写、老源并发加速——保持行为完全一致优先，源作者愿意迁移时用 §4 新写法（改动量：包一层 defineSource + 加 await）。

---

## 12. 性能模型（收益从哪来）

| 优化点 | drpy2 现状 | drpy3 | 预期收益 |
|--------|-----------|-------|----------|
| IO 模式 | 同步阻塞，串行累加 | async 并发（A/B 档宿主） | 多请求场景墙钟 ≈ max(各请求)，理论 2~5× |
| 引擎占用 | 一源一 Context，core-lite（736KB JS）每源重复解析执行 | 单引擎多实例，框架与模板/CryptoJS/cheerio 只加载一次 | N 源常驻内存与启动时间近似 1/N |
| 同 Context 大锁 | 必须（全局会串数据） | 取消（调用态隔离） | 高并发吞吐不再被串行化封顶 |
| 实例常驻 | 一源一 Context 常驻（聚合 200 源不敢想） | 生命周期状态机：数据常驻、实例按需（LRU+水位驱逐+复温） | 聚合 200 源内存有界；热点源复温秒级 |
| wasm | polywasm 软解释 | 引擎原生 | 加密/哈希类操作 1~2 个数量级 |
| 缓存 | 无 | store/cache 分层 | 重复搜索/详情命中缓存，直接省网络 |
| 老源 | — | 兼容层不变慢（串行语义保留） | 0 退化 |

### 12.1 三轴自评与已知短板（诚实版）

| 轴 | 评分 | 依据 | 短板 |
|----|------|------|------|
| 写法简单 | 生态内 9/10；绝对 7/10 | 零样板纯声明式 + 解构短名 + js: 老名字，生态肌肉记忆零迁移 | 规则字符串迷你语言本身拗口（`;`/`\|\|`/`&&`/`js:` 混排，生态资产动不得）；两层上下文有概念成本（90% 源只需 ctx） |
| 性能 | 8/10 | IO 密集（源负载大头）async 并发已到设计天花板；wasm native；单引擎多实例 | **CPU 密集盲区**：单引擎单线程，wasm 解密分片时事件循环停摆——`net.all` 并发拉 10 个分片，解密仍逐个阻塞 |
| 内存 | 7/10 | 状态机（数据常驻实例按需）+ Runtime 级共享缓存 | **共享堆回收非确定性**：驱逐实例后 QuickJS 堆未必还给系统；wasm 模块缓存 Runtime 级"永活"，无引用也没有淘汰 |

**三个已采纳的增量改进**（按收益排序）：

1. **引擎分组 + 代际回收**（补内存确定性）：新实例进"年轻引擎"，水位到线时把幸存实例重新实例化
   进主引擎、整体销毁年轻引擎——整堆释放，内存回收从"概率"变"确定"。可行性由状态分层保证：
   跨引擎重建的前提是状态在 store/cache（§4.4），带 `resume` 的源迁移时框架自动调用。
2. **CPU 热路径性能阶梯**（补性能天花板）：JS 实现 → wasm（引擎原生）→ **宿主原生注入**
   （HostEnv 允许壳子注入 native `decrypt`，比 wasm-in-JS 更快）；重解密可派发独立 worker
   引擎执行，主引擎事件循环不停摆；配合 proxy `toBytes=3` 流式避免 base64 大对象过桥。
3. **wasm 缓存引用计数 + 空闲淘汰**：无 Hot 实例引用且超时的 wasm 模块可回收，"跨驱逐存活"
   不等于"永活"。

**被否决的范式**（记录以防重提）：全 native 化（源编译原生插件）性能/内存最优，但杀死 JS 源
生态、AI 写源与热更新——与 drpy3 存在理由冲突；纯配置化 DSL——表达力天花板过低（签名/加密/
代理流写不了）。结论：当前"声明式规则 + async 实例 + 生命周期治理"混合范式在给定约束下没有
范式级更优解，上述三项是把三条轴各自再抬一档的增量（对应路线图 M4.5）。

---

## 13. 与 drpy2 的差异对照表（源作者速查）

| drpy2 写法 | drpy3 写法 |
|-----------|-----------|
| `var rule = {...}` + `@header` | `export default defineSource({ meta, rule, ...钩子 })` |
| 全局 `request(input)` | `await ctx.lib.net.request(ctx.url)`（js: 片段内 `request(input)` 仍可用，由形参注入） |
| 全局 `pdfh/pdfa/pd/jsp` | `ctx.lib.parse.pdfh/...`（js: 片段内老名字仍可用） |
| `setResult(d)` 写全局 VODS | `return {list: 映射后的列表}` 或继续用注入的 `setResult`（写 ctx.scratch） |
| `MY_URL / input / fetch_params` | `ctx.url / ctx.input / ctx.fetchParams` |
| 全局 `base64Encode / request / fetch / pdfa / md5` | 钩子顶部解构 `const { request } = ctx.lib.net` 后**写法不变**；js: 片段内原名直接可用（§4.5） |
| 模块顶层 `let` 有状态变量（如缓存表、init 预取数据） | `this.xxx` 实例字段（per-instance），或 `ctx.cache / store`（§4.4） |
| `VODS/VOD/TABS/LISTS` | `ctx.scratch.vods/...` 或直接 return |
| `setItem/getItem/clearItem(RKEY,...)` | `ctx.store.get/set/delete(k)`（无需 RKEY） |
| 同步函数、串行 | async 函数、可并发 |
| 单文件源、`$require(url)` | 源目录包 + 相对路径 `import/require` |
| `pdfl`、全局 `key` | `ctx.lib.parse.pdfl`（HostEnv 可注入加速，框架有逐元素回退）；key 由框架按源生成 |
| （drpy2 无）`action` | `action` 钩子正式转正：源内交互通道（设置中心/推送/对话），契约见 §10.2 |

---

## 14. 面向 AI 时代的写源体验（Agent-Native）

前提判断：未来大部分人写源的方式是"对 AI 说需求 → AI 出源 → 人验收"。因此 drpy3 有**两个一等公民客户**：源作者和 LLM agent。面向 agent 的衡量标准只有两条：

1. **完整契约能否装进一个 prompt**（agent 的理解上限 = 它能一次性看到的契约完整度）；
2. **写完能否不经人介入自证对错**（agent 写源的成败从来不在"写出代码"，而在"验证对错"）。

本章四项能力就是围绕这两条设计的，与 G7 对应。

### 14.1 零样板：纯声明式源零包装

见 §4.1。这是"最简写法"的底线：纯声明式源没有代码可写错，恰好也是 LLM 出错率最低的形态——**人的最优解和 agent 的最优解重合**。衡量指标：最简源 ≤ drpy2 同功能源的行数。

### 14.2 单页契约：给 AI 的那一页纸

两个正式交付物，与引擎同权重发布、版本锁定：

1. **`drpy3.d.ts`**（等价的全量 JSDoc）：`ctx.lib` 全 API 面、各钩子签名、TVBox 返回结构、错误码——一个文件装下全部类型，agent 与 IDE 共用。
2. **《drpy3 源编写规范》单文件**，固定结构：
   - 源骨架（最简版 + 增强版）
   - `ctx.lib` API 全表（签名一行一个）
   - **三个标杆范例**：json API 源 / HTML 解析源 / 复杂 js 源（以百忙无果[官]为原型改写，与附录 C 冒烟用例联动）
     —— 首批演示稿已就位：[百忙无果1.js](<./百忙无果1.js>)（零样板·纯声明式优先）、[百忙无果2.js](<./百忙无果2.js>)（全钩子异步增强源）、[百忙无果3.js](<./百忙无果3.js>) + [百忙无果3.lib.js](<./百忙无果3.lib.js>)（模块化工程源 + wasm 签名）、[百忙无果4.js](<./百忙无果4.js>)（js: 片段混用·drpy2 平滑迁移）
   - 常见配方：POST 搜索、翻页区间 `[1,]`、过验证 cookie、免嗅 lazy、图片防盗链、wasm 调用
   - 提交前自检清单
- 硬指标：规范单文件 ≤ 一个 system prompt 的体积（数千 token 级），agent 挂载后即达到"读过全部文档"的效果。
- 维护规则：改 API 而不改规范的 PR 不许合并——规范与实现同仓同步演进，防止文档漂移（drpy2 时代"文档与注入面脱节、要靠考古"的教训写进流程）。

### 14.3 官方自测 CLI：`drpy3 test`（写-测-修闭环）

**对"大部分人用 AI 写源"这个未来而言，这是价值最大的单件交付物。**

```bash
drpy3 test 源.js                       # 六环节冒烟：init/home/category/search/detail/play
drpy3 test 源.js --wd 斗罗大陆 --tid 3  # 指定搜索词 / 分类 id
drpy3 test 源.js --record              # 录制真实 HTTP 响应到 fixtures/（仅第一次需要真网）
drpy3 test 源.js --replay              # 离线回放 fixtures（CI / 无网环境）
```

- 输出机器可读：`{stage, ok, expect, actual, diff}` 的 PASS/FAIL JSON + 人类可读摘要，退出码 0/1；
- agent 的标准工作流：**写 → test → 读结构化报错 → 修 → 再 test**，全自动循环，人只验收最终结果；
- `--record/--replay` 的意义：目标站层失败（反爬、选择器猜错）从"盲猜"变成"可复现迭代"，且源分发时可附带 fixtures 作为质检凭证；
- 可行性已验证：本仓库 `.smoke/`（test.mjs + mock.mjs）即雏形，标杆源六环节冒烟全通过（附录 C），CLI 化是工程收尾。

### 14.4 错误工程化

async + 显式 ctx 之后框架完全掌控执行栈，报错必须按规范输出，禁止裸抛引擎栈：

```json
{
  "ok": false,
  "stage": "detail",
  "rule": "二级",
  "line": 6,
  "error": "JSON.parse: Unexpected end of input",
  "hint": "响应体为空——检查 request(input) 的 URL 与 headers，疑似风控或超时",
  "source": "示例[官]"
}
```

- 定位三要素：**环节**（home/detail/...）、**规则字段**（一级/二级/搜索/lazy）、**js 片段行号**；
- 必附 `hint` 修复提示（空响应→风控/超时、undefined 字段→json 路径错误、选择器空→结构变化……常见映射内置）；
- 同一份报错同时进日志与 `drpy3 test` 输出——人和 agent 用同一份诊断。

### 14.5 能力边界（诚实声明）

框架只能消灭**框架层失败**（API 用错、结构不对、变量丢失、时序问题）；**目标站层失败**（选择器猜错、反爬、参数签名）不属于任何框架能解决的范围，只能靠 14.3 的录制回放让 agent 快速试错收敛。预期管理：drpy3 工具链把 AI 写源从"碰运气"提升到"常规可迭代"，不承诺零人工。

---

## 15. 路线图

| 里程碑 | 内容 | 验收 |
|--------|------|------|
| M1 运行时核心 | Runtime/HostEnv/两层 ctx/标准库/proxy 与 action 通道/实例请求头基线/实例生命周期治理（LRU+水位驱逐+复温+源热更新）/降级档 C 同步宿主 | drpy2 对接指南的 13 项自检在 drpy3 上重跑通过；action 通道对照 drpy-node 设置中心源走通；改源后下次调用自动重初始化；200 源聚合搜索压测内存有界、进详情复温正常 |
| M2 兼容层 | load2x + 伪全局映射 + 串行队列 | 百忙无果[官].js 六环节冒烟通过（基准照搬附录 C） |
| M3 模块化 | CJS shim + `drpy3 build` 预打包 CLI + 原生 loader 对接样例 | 拆分出 ./lib 模块的示例源三模式均可跑 |
| M3.5 AI 写源工具链 | `drpy3.d.ts` + 《源编写规范》单文件 + `drpy3 test`（含 --record/--replay）+ 工程化报错 | agent 仅凭规范单文件写出 1 个全新源，test 全绿，人工介入 ≤1 轮 |
| M4 async 完全体 | A/B 档宿主样例（Node 官方壳 + 一个嵌入式 job 泵样例）、lib.net.all | 多请求并发基准：墙钟 ≤ 串行版 50% |
| M4.5 引擎分组与代际回收 | 年轻引擎/主引擎分组、跨引擎复温（resume 联动）、wasm 缓存引用计数淘汰、CPU 热路径性能阶梯（JS→wasm→宿主原生注入 + worker 引擎派发） | 200 源聚合长跑 24h 内存曲线平稳（水位触发后整堆确定性回落）；wasm 解密不再阻塞主引擎搜索 |
| M5 wasm 套件 | lib.wasm.load + xxhash/aes wasm 资产清单 | 原生 vs polyfill 性能报告 |
| M6 生态迁移 | 模板库转换工具 + 官方源批量迁移到 dr3 | 头部 20 个常用源提供 dr3 版 |

---

## 附录 A：设计决策记录（为什么不……）

- **为什么不继续用全局注入 + 命名约定**：实测确认 drpy2 的 `req` 必须同步、`pdfh` 在模块加载期就被引用（`defaultParser`），全局方案把"装载时序、命名冲突、无法多实例"三个问题焊死在架构上；HostEnv 构造期校验 + 能力表是对症下药。
- **为什么保留字符串规则而不全部 class 化**：`一级:'json:...;title;img'` 是 drpy 生态的表达力根基，源作者迁移成本必须趋近于零；class/钩子只是增量逃生舱。
- **为什么源内返回对象而不是 JSON 串**：序列化一次即可（壳子边界）；内部传对象让并发组合（`Promise.all` 后再聚合）自然成立。
- **为什么 batchFetch 从"必须注入"变为"可选注入"**：它仍是 `lib.net` 的正式 API（drpy2 契约语义原样保留，老源零改动），变化的只是**提供方**——drpy2 时代壳子必须实现它（没有统一并发原语）；drpy3 框架可基于 `req` + Promise.all 内置兜底，宿主原生实现（线程池/协程）随时覆盖拿更快路径。能力查找顺序见 §7.2。
- **为什么推荐"钩子顶部解构"而不是把全局名重新挂回 globalThis**：解构让依赖显式声明在钩子签名区——人读得清爽，AI 与静态工具可确定性分析；挂回 globalThis 则重蹈 drpy2"隐式注入面"覆辙。ctx 顶层快捷别名保留一跳的便利，但权威源始终是 `ctx.lib.*` 命名空间（§4.5）。
- **为什么保留"有状态源"而不强制无状态**：状态是爬虫源的真实需求（init 预取表、累积 cookie、签名上下文），强行无状态会把简单源逼复杂。drpy3 的做法是给状态**分层定语义**（调用态/实例态/持久态）而非消灭状态——串数据的根源是"全局单份 + 并发无界"，不是状态本身（§4.4）。
- **为什么要求模块随源分发、拒绝远端 require**：自洽、可审计、可离线；远端执行已经在 `$require` 上证明了它的不可维护性。
- **为什么 default export 允许纯对象（零样板）**：零样板是"最简写法"的底线；纯声明式源没有代码可写错，恰好也是 LLM 出错率最低的形态——人和 agent 的最优解在这一点上重合，没有理由让仪式感挡在中间（`defineSource` 只是类型糖，运行时恒等）。
- **为什么把 `drpy3 test` 当核心交付物而非周边工具**：AI 写源的瓶颈从来不是"写出代码"，而是"验证对错"。drpy2 生态没有任何本地验证手段，agent 写完只能盲发。写-测-修闭环存在的第一天，框架才算真正面向 AI 时代设计——这也是附录 C 冒烟脚手架被提升为官方 CLI 的原因。

## 附录 B：风险与开放问题

1. **嵌入式宿主 async 桥**（§5.4 B 档）是最大的工程变数，M4 前需要一个 Java(Javet/quickjs-java) 样例验证 Promise 回填延迟在可接受范围。
2. **规则字符串里的 js: 片段参数化**需要逐个核对 drpy2 十余处 eval 点位（一级/二级/搜索/免嗅/二级访问前/图片替换/预处理/代理/嗅探），防止漏传老变量导致老源在兼容层外无法运行。
3. **多实例共享引擎的内存回收**：实例 destroy 时需清空 store 投影/缓存/模块缓存引用，防止长驻进程缓慢膨胀（drpy2 的 ctx.gc() 经验沿用）。
4. `dr3` 的 `lang` 标识与现有壳的 `lang: dr2/drpy` 路由如何共存，需与主流壳子（FongMi 系/hipy 系）对齐接入协议。

## 附录 C：drpy2 基准冒烟（已执行，作为 drpy3 的回归锚点）

- 对象：`docs/百忙无果[官].js`（芒果 TV 官方源：class_name 静态分类 + `json:` 一级 + `js:` 二级/搜索 + pdfh/pd 详情页解析）
- 环境：Node 22 + `src/drpy2.js` + `dist/drpy-core-lite.min.js`；注入与对接指南契约一致（`req` 同步 curl 实现、`pdfh/pdfa/pd` 复用 drpy-node 生产实现 `htmlParser.js`、`joinUrl/local` 内置）
- 说明：本机沙箱无法直连 mgtv（直接 fetch 失败），故以独立进程本地 mock（按源码期望的数据形状）做端到端验证；脚手架为本地工作区 `.smoke/`（test.mjs / mock.mjs，不入库，可依 §14.3 的 CLI 规格复刻）
- 结果：**六环节全部 PASS** ✅

| 环节 | 验证点 | 结果 |
|------|--------|------|
| init+getRule | rule 解析、host/url 拼接、jinja2 渲染、headers 处理 | PASS |
| home | class_name/class_url 静态分类 + filter gzip 解压（CryptoJS/pako） | PASS |
| category | `json:` 一级 → cheerio.jp 解析、`3$vid1` 分类前缀 id | PASS |
| search | `js:` 搜索规则 eval、`setResult`、`50$vid9` 线路前缀 | PASS |
| detail | 二级 js：选集 JSON → 详情页 HTML → `pdfh/pd`（p:eq(n)/.vt-txt/.video-img）→ VOD 组装、2 集列表 | PASS |
| play | play_parse → `{parse:1, url, flag, jx:0}` | PASS |

> 冒烟过程中反向确认的两个契约事实已回写进对接指南：① `req` 必须**同步**返回（drpy2 `request()` 立即消费 `res.content`）；② core-lite 在 Node 环境存在一个非关键 chunk 的 Script Loader 告警，所有导出功能完好，QuickJS 宿主不受影响。

## 附录 D：全生命周期调用链（初始化 → 播放）

九个阶段一张图。每个阶段标注：壳子调用什么、框架内部发生什么、源作者写什么、实例状态。

```
阶段0 壳子启动
  HostEnv(req/pdfh/pdfa/pd + 可选 batchFetch/store/getProxy/loadAsset/env)
  → new Runtime(hostEnv) → capabilities 自检表
    {req:'host', pdfh:'host', joinUrl:'builtin', store:'memory-fallback', wasm:'native', action:true}
  → (可选) rt.use({...}) 运行时覆盖
  → drpy3-core 常驻：模板/CryptoJS/cheerio 单例 + wasm 模块缓存【Runtime级，跨实例存活】

阶段1 源装载
  rt.load(code, {path, key, extend})
    ├ 内容哈希 signature 比对 → 未变化且有热实例 = 幂等复用
    ├ 形态判定：纯对象→纯声明式 │ defineSource→增强 │ drpy2特征→兼容层 load2x
    ├ 模块解析(§8)：import/require 相对路径 → 记录依赖树清单+哈希【供热更新】
    └ 创建 Source 实例 = Cold（仅句柄：路径/key/extend/signature，几百字节）

阶段2 初始化（Cold → Hot 复温）
  src.init(extend) 触发 ensureHot：
    ① 复温判断：驱逐恢复？→ headers 快照回填 + ctx.resumed=true（跳过登录预处理，§4.6）
               冷启动？→ ctx.headers = rule.headers 拷贝（实例请求头基线，§4.4）
    ② 构造 ctx：调用态(url/input/scratch/fetchParams/fl) + 实例投影(rule/key/meta/lib/
       log/store/cache/capabilities)
    ③ 纯声明式源：框架直接处理 rule，无钩子
       增强源：await source.init(ctx, ext)（this=实例）→ 典型：预处理拿cookie写
       ctx.headers + store.set；crypto.ready() wasm 预热
       兼容层源：伪全局映射 + eval + 串行队列（§11）
    ④ rule 定稿：模板继承/静态分类/filter解压/url拼接/jinja2/UA常量解析 → ctx.rule 只读投影
    ⑤ 进入 Hot；headers 快照存档【驱逐恢复的层次 B】

阶段3-4 首页 → 一级
  src.home(filter)：声明式 class_name/class_url + filter 自动生成；钩子源自定义
  src.category(tid, pg, extend)：ctx.url = rule.url 渲染(fyclass/fypage/filter_url×jinja2)
    → 声明式 'json:...'(parseRule) │ js:片段(AsyncFunction 注入老名字) │ 钩子自定义
    → {page, pagecount, list} → 壳子 JSON.stringify → UI

阶段5 聚合搜索（200 源）
  壳子并发 src.search(wd) ×200 → 各实例 ensureHot（init 在此期间发生/或此前已发生）
  → 结果 = 纯数据，由壳子持有（200 份 ≈ 几 MB）
  → 潮退：空闲实例 LRU/水位驱逐 Hot→Cold【数据常驻、实例按需，§4.6】

阶段6 详情（复温场景）
  用户点结果 → src.detail(vod_id)（vod_id 自带上下文：分类$id / @@拼装）
    ├ Cold？→ 复温：signature 比对(变了=强制重建) → headers 快照/store 回填
    │         → ctx.resumed=true → init 跳过登录预处理 → 原子替换
    └ Hot？→ 直接调用
  内部：ctx.lib.net.all 并发(选集接口+详情页+余页) → pdfh/pd 解析 → vod_play_* 组装
  cookie 失效？→ §4.4 自愈：就地刷新 ctx.headers + store（正确性保证）

阶段7 播放 + 本地代理
  src.play(flag, id) → {parse:0/1, url, jx, header}
    url = getProxyUrl()+'&url=...' → 播放器回访本地端口
  壳子组装 params(+__range/__mediaProxy) → src.proxy(params) → 五元组（§10.1）
    TS 分片: req(buffer:1) → wasm 解密 → [200, ctype, base64, headers, 1]
    免解密流: toBytes=3 服务端 pipe │ toBytes=2 302 重定向
    m3u8: 分片地址改写回代理

阶段8 交互 / 辅助
  vod_tag:'action' 条目点击 → src.action(action, value)（60s 长超时，§10.2）
  嗅探: sniffer() / isVideo(url)；源解密: runMain；设置中心读写 store

阶段9 生命周期治理（贯穿全程，每次调用前）
  signature(源+依赖树) 变化 → 强制驱逐重建（热更新 = 驱逐的特例，§4.6）
  空闲 LRU(120s) / 内存水位(70%→50%) → Hot→Cold 驱逐
    in-flight 排空才驱逐；重建成本评分(声明式<普通<wasm预热/登录源)；pin 豁免
  存活分区：store 永活 │ Runtime 缓存(wasm/模板)跨驱逐 │ 实例态随驱逐丢弃
```

**贯穿全程的三条暗线**：

1. **报错线**：任何阶段失败都产出工程化报错 `{stage, rule, line, error, hint}`（§14.4），`drpy3 test` 与线上壳子用同一份诊断；
2. **调用级隔离线**：每次调用新建 ctx（scratch/url/fetchParams 全新），实例内并发调用互不可见——这是"200 源聚合 + 单源并发"能同时开启的前提（§4.3）；
3. **降级线**：同步宿主（§5.4 档 C）下所有 await 立即完成，整条链路功能不变，只是并发收益归零。
