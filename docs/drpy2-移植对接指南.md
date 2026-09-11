# drpy2.js 移植对接指南（宿主/壳子实现规范）

> 分析基准：`src/drpy2.js`（VERSION `drpy2 3.9.52beta3 20250801`）
> 参考宿主：`hipy-server`（Python + quickjs）：`app/t4/qjs_drpy/qjs_drpy.py`、`app/utils/quickjs_ctx.py`
> 目标读者：想用任意语言（Python / Java / C# / C++ / Node / Go ...）给 drpy2.js 写宿主（壳子）的开发者。

---

## 0. TL;DR —— 最小对接清单

除 QuickJS 引擎本身外，宿主只需要做三件事：

1. **注入 7 个全局**（在加载 drpy2.js 之前放到引擎全局对象上）：

| # | 名称 | 形态 | 一句话作用 |
|---|------|------|-----------|
| 1 | `req` | 函数 | HTTP 请求，**唯一网络出口**，返回 `{content, headers}` 对象 |
| 2 | `pdfh` | 函数 | jsoup 实例方法：HTML 选择器取**单个值**（`body&&.title&&Text`） |
| 3 | `pdfa` | 函数 | jsoup 实例方法：HTML 选择器取**元素列表** |
| 4 | `pd` | 函数 | jsoup 实例方法：取值 + 自动补全相对 URL |
| 5 | `joinUrl` | 函数 | URL 拼接（python `urljoin` 语义） |
| 6 | `local` | 对象 | 按源隔离的持久 KV：`{get, set, delete}` |
| 7 | `batchFetch` | 函数 | 并发批量请求（大量 drpy2 源直调的事实标准能力） |
| + | `console` | 对象 | 至少要有 `console.log`（日志出口） |

2. **带上核心依赖包** `dist/drpy-core-lite.min.js`（CryptoJS / cheerio / 模板 / pako / gbkTool / JSEncrypt / NODERSA / JSON5 / jinja / WXXH 全部打包在内，drpy2.js 通过 ES import 引用它）。

3. **调用约定**：`init(源码字符串)` 之后按需调用 `home / homeVod / category / detail / play / search / proxy / sniffer / isVideo`，除 `sniffer/isVideo/getRule/runMain` 外全部返回 **JSON 字符串**，宿主自行 `JSON.parse`。

可选注入（建议但非必须）：`getProxy`（本地代理地址）、`key`（源唯一标识）、`pdfl`（加速解析）、`atob/btoa`（有内置兜底）、`_debug`（调试开关）。

---

## 1. drpy2.js 是什么，整体架构

```
┌─────────────────────────── 宿主进程（你的 App / 服务） ───────────────────────────┐
│                                                                                  │
│  你的业务代码 ──调用──▶ globalThis.<key>.init / home / search ...                │
│                            ▲                                                     │
│                            │ 导出（drpy2.js 末尾 export default {...}）          │
│  ┌─────────────────────────┴───────────────────────────┐                         │
│  │            QuickJS 引擎（一个 Context ≈ 一个源）      │                         │
│  │                                                     │                         │
│  │   全局注入: req / pdfh / pdfa / pd / joinUrl /        │                         │
│  │             local / console / (getProxy, key ...)    │                         │
│  │                                                     │                         │
│  │   drpy2.js（规则引擎：init/home/category/detail/     │                         │
│  │             search/play/proxy/... 全部解析逻辑）      │                         │
│  │        └─ import ─▶ dist/drpy-core-lite.min.js       │                         │
│  │           (cheerio+模板+CryptoJS+pako+gbk+RSA+JSON5) │                         │
│  └─────────────────────────────────────────────────────┘                         │
│       │ req()                          │ local.get/set/delete                    │
│       ▼                                ▼                                         │
│   你的 HTTP 客户端（带 UA/超时/编码）      你的 KV 存储（内存/数据库均可）             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

分工非常清晰：

- **drpy2.js 负责**：解析用户写的 `rule` 规则（首页/一级/二级/搜索/播放/本地代理），调度 HTML 解析、加密解密、模板渲染，拼装 TVBox 标准的 JSON 返回结构。
- **宿主只负责**：给它网络、HTML 解析、URL 拼接、KV 存储、日志这五样"系统能力"，然后把导出函数的 JSON 结果透传给 UI/播放器。

---

## 2. 引擎层要求

| 要求 | 说明 |
|------|------|
| QuickJS（或同等 ES 引擎） | 官方 quickjs、quickjs-ng、各类语言绑定均可（Python `quickjs` 包、Java `quickjs-java`、C# `QuickJS.NET`、Node `quickjs-emscripten` 等） |
| `eval` 必须 | `init()` 用 eval 加载源码（`drpy2.js:3438,3453`），规则里的 `js:` 片段全部靠 eval 执行（一级/二级/搜索/免嗅/代理/二级访问前/图片替换……约 10 处） |
| ES Module 加载 **或** 预打包 | drpy2.js 顶部有 `import {cheerio, 模板} from '../dist/drpy-core-lite.min.js'`，末尾有 `export default {...}`。见第 3 节三种加载方案 |
| 标准内建 | `encodeURIComponent/decodeURIComponent`、`JSON`、`RegExp`、`Date`、`Math`、`Array.prototype.includes` 等（drpy2.js 自带部分 ES5 polyfill，低版本引擎也能跑） |
| `atob/btoa` | **可不给**：`drpy2.js:497-499` 有纯 JS 兜底实现（`window_b64()`） |
| `WebAssembly` | **强烈建议引擎原生支持**：core-lite 内置 polywasm 兜底（`drpy-core-lite.js:16`，检测到引擎已有 WebAssembly 则直接用原生），但 polywasm 是纯 JS 软解释执行，很慢。越来越多 drpy2 源直接用 wasm 做加解密（WXXH / xxhash-wasm 等），选原生支持 WebAssembly 的引擎（如 quickjs-ng）性能好得多 |
| 上下文生命周期 | **一个源一个 Context 常驻**，不要每次调用新建（`rule`、`RKEY`、`local` 缓存需要跨调用保留）。换源直接对同一 Context 重新 `init(新源码)` 即可，`init()` 开头会重置状态（`drpy2.js:3408-3410`） |
| 线程安全 | QuickJS Context 非线程安全。hipy 的做法：每个源一个 `max_workers=1` 线程池 + 锁，所有调用串行化，每次调用后 `gc()`（`qjs_drpy.py:26-32, 89-93, 119-131`） |

---

## 3. 加载 drpy2.js 的三种方案

### 方案 A：ES Module 双文件（官方形态，推荐）

引擎需支持模块加载（如 quickjs-ng 的 `JS_SetModuleLoaderFunc`，或你的绑定暴露 `module()`/import 支持并把两个文件放进同一目录）：

```
你的目录/
├── dist/drpy-core-lite.min.js   ← 核心依赖包（仓库自带）
└── drpy2.js                     ← src/drpy2.js 原样使用
```

加载 drpy2.js 后它自带 `export default {runMain, getRule, init, home, homeVod, category, detail, play, search, proxy, sniffer, isVideo, fixAdM3u8Ai, DRPY}`（`drpy2.js:3944-3959`），取模块默认导出即可调用。

### 方案 B：预打包单文件（引擎不支持 ESM 时最省事）

用仓库自带的 esbuild 把两个文件打成一个 IIFE 脚本（改 `esbuild.config.cjs` 的入口与 `format: 'iife'`，或自己写三行配置），产物无 import/export，直接 `eval` / `JS_Eval` 执行，从全局取导出对象。

### 方案 C：hipy 拼接式（老 quickjs 绑定无模块支持时，hipy 实测路线）

hipy 的做法（`qjs_drpy.py:34-87`），不使用 ES module：

1. 依次 `ctx.module()` 加载 9 个库脚本（把库挂到全局）：
   `muban(模板)` → `cheerio` → `jinja2` → `json5` → `gbk` → `crypto` → `jsencrypt` → `nodersa` → `pako`
   （这些文件即 hipy 仓库 `app/t4/qjs_drpy/qjs_module_*.js`，可整体搬走复用；注意其 cheerio 模块只提供 cheerio 对象（含 jinja2/jp），**pdfh/pdfa/pd 不在其中**，仍需按 4.2 由宿主提供）
2. 执行前缀补丁，把 jinja 接到 cheerio 上：
   ```js
   cheerio.jinja2 = function (template, obj) { return jinja.render(template, obj); };
   ```
3. drpy2.js 源码**去掉首行 import**（`export default` 在 module 加载下合法，可保留）后加载，并在末尾拼接导出绑定：
   ```js
   globalThis.<key> = { getRule, runMain, init, home, homeVod, category, detail, play, search, proxy, sniffer, isVideo, fixAdM3u8Ai };
   ```
4. 之后统一通过 `globalThis.<key>.<函数名>(args)` 调用。

> 注意：方案 A 下 `cheerio.jinja2` 已在 core-lite 内部接好，无需第 2 步补丁。

---

## 4. 必须注入的 API 详解

> 以下 6 项缺任何一个，drpy2.js 都无法正常工作。它们在 drpy2.js 中**从未声明**，直接引用全局；而 `MY_URL/HOST/RKEY/fetch/print/log/fetch_params` 等是模块内 `var` 自管理的（会被模块作用域遮蔽，注入了也用不上，详见第 6 节避坑表）。

### 4.1 `req(url, obj)` —— HTTP 请求（最重要）

- **定义位置**：唯一调用点 `drpy2.js:1887`；`request()/post()/reqCookie()` 都封装到它为止。
- **参考实现**：hipy `app/utils/vod_tool.py` 的 `req()` → `base_request(_url, _object, 1)`。

#### 入参

```js
req(url, obj)
// url: string，完整请求地址
// obj: object，drpy2.js 已整理好的请求参数：
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `headers` | object | 请求头。drpy2.js 已补默认 `User-Agent`（手机 UA）和 `Referer`（目标站点首页），你只需透传 |
| `method` | string | `GET`（默认）/`POST`/`PUT`/`DELETE`/`HEAD` |
| `timeout` | number | **毫秒**（rule.timeout 默认 5000）。实现时建议设上限并做容错（hipy 把 >100 的值当毫秒/1000 处理） |
| `encoding` | string | 响应体解码编码，默认 `utf-8`。GBK 源靠它；若响应头 `content-type` 带 `charset=`，以响应头为准 |
| `body` | string | 表单字符串（`a=1&b=2`），drpy2.js 已自动配好 `Content-Type: application/x-www-form-urlencoded` |
| `data` | object | GET 时作为 query 参数；非 GET 时作为请求体（若 `content-type` 含 json 则序列化为 JSON） |
| `buffer` | number | `= 2` 时 `content` 返回**二进制响应的 base64 字符串**（请求图片/验证码用，来自 `toBase64` 转换，`drpy2.js:1864-1866`） |
| `redirect` | number | `= 0` 时禁止跟随 30x 重定向（`drpy2.js:1868-1870`） |

#### 返回值（关键契约）

必须是 **JS 对象**（不是字符串！），且必须**同步返回**——drpy2 的 `request()` 调用后立即读取 `res.content`（`drpy2.js:1887-1888`），不支持异步 Promise（实测确认：返回 Promise 时 `res.content` 为 undefined，所有请求拿空）。网络 IO 允许阻塞，参考宿主（quickjs 原生/python 桥/Android/Node 的 XMLHttpRequest 实现）全部是同步调用：

```js
{
  content: "响应文本",     // buffer=2 时为二进制内容的 base64；失败时为 ''
  headers: { ... }        // 响应头普通对象，键名保持服务端原样
}
```

- drpy2.js 后续只读 `res.content` 和 `res.headers`（`drpy2.js:1888-1896`）。
- `withHeaders` 模式由 drpy2.js 自己处理：它会直接在 `res.headers` 对象上**追加 `body` 属性**再序列化，所以 `headers` 必须是普通可写对象。
- `reqCookie()`（搜索过验证）会从 `headers` 里做大小写无关的 `set-cookie` 查找，值可能是字符串或数组，原样返回即可。
- **出错不要抛异常**：返回 `{content:'', headers:{error:'...'}}`，否则个别带 try/catch 的源会被打断。

#### 伪代码（任意语言）

```
function req(url, obj):
    method  = obj.method ?? "GET"
    headers = obj.headers ?? {}
    timeout = obj.timeout ?? 5000          // 毫秒
    resp    = http_request(url, method, headers, obj.data, obj.body,
                           timeout_ms=timeout,
                           follow_redirects = obj.redirect != 0,
                           decode_charset   = obj.encoding ?? "utf-8")
    if obj.buffer == 2:
        text = base64_encode(resp.raw_bytes)
    else:
        text = resp.text(decoded by charset)
    return { content: text, headers: resp.headers_as_plain_object }
```

### 4.2 `pdfh(html, parse)` / `pdfa(html, parse)` / `pd(html, parse, base_url)` —— HTML 解析三件套

- **引用位置**：`drpy2.js:1341-1345` 的 `defaultParser` 直接引用这三个全局。
- **本质**：这三个函数就是 **jsoup 实例对象的方法**（`jsp.pdfh / jsp.pdfa / jsp.pd`）。core-lite 打包的 cheerio 只保留 `jinja2` 和 `jp`（jsonpath）两个函数，源码注释原话"其他 pdf 系列交给壳子"（`drpy-core-lite.js:37`）——所以宿主必须自己提供。
- **务必复用现成实现，不要自己手写解析器**：选择器语法边界非常多（嵌套元素、`:eq/:lt/:gt/:first/:last/:not/:even/:odd/:has/:contains/:matches` 索引与筛选、`Text/Html` 取值、属性 `||` 回退、大小写、HTML 转义还原……），各语言生态都有成熟移植，直接拿来用：
  - **Python**：hipy `app/t4/base/htmlParser.py` —— 单文件 378 行的纯 Python jsoup 封装，`jsoup(MY_URL='')` 实例类，无包内依赖（只需 `pip install pyquery jsonpath ujson`），拷走即用；
  - **Java / Kotlin（Android 壳子）**：基于 `org.jsoup:jsoup` 封装同名三函数（TVBox 系壳子的通用做法）；
  - **JS / Node 宿主**：cheario（drpy-node 项目所用）；
  - **C# / Go 等**：基于 HtmlAgilityPack / goquery 等成熟解析库封装，或直接移植 htmlParser.py。
- **参考实现（语义基准）**：hipy `htmlParser.py` 的方法签名与 drpy2 的调用方式完全对齐：`pdfh(html, parse)`、`pdfa(html, parse)`（返回元素 HTML 字符串数组）、`pd(html, parse, base_url='')`。

#### 选择器语法（drpy 规则的 `一级/二级/搜索/推荐` 字段全靠它）

链式选择器，用 `&&` 分段：

```
body&&.module&&a&&href     ← 取 body 下 class=module 的块里所有 a 的 href
ul&&li:eq(0)&&Text          ← 第一个 li 的文本
.class-name&&img&&data-src ← 取 data-src 属性
```

- 中间各段：定位元素。支持 `tag`、`.class`、`#id`、`tag.class` 组合，以及索引修饰 `:eq(N)`（第 N 个）、`:lt(N)`、`:gt(N)`。
- **最后一段是取值器**：
  - `Text` → 元素文本（去标签）
  - `Html`/`html` → innerHTML
  - 其他任何字符串 → 当作**属性名**（`href`、`src`、`content`、`data-src`、`style`、`value`……）
- `pdfa` 返回**每个匹配元素的 HTML 字符串数组**（后续代码会再对每个元素递归调 `pdfh/pd`）。
- `pd` = `pdfh` 取值后，若取值器是 URL 类属性（`src/href/url/style/...`）且结果是相对地址，则 `joinUrl(base_url, 值)` 补全。`base_url` 为空时原样返回即可。

> 说明：`json:` / `jsp:` / `jq:` 前缀的解析调度在 drpy2.js 内部完成（json 路径走打包好的 `cheerio.jp`，jsp/jq 路径才落到你注入的三件套），你只需要实现上面这套 HTML 选择器。`style` 属性里的 `url(...)` 提取也由 drpy2.js 的 `pdfh2` 处理（`drpy2.js:1354-1374`），你返回原始属性文本即可。

### 4.3 `joinUrl(fromPath, nowPath)` —— URL 拼接

- **引用位置**：`drpy2.js:1311-1314`，drpy2.js 自己的 `urljoin()` 包装了它。
- 语义 = Python `urllib.parse.urljoin` / WHATWG URL 解析：
  - `joinUrl('https://a.com/x/y.html', '../z/1.mp4')` → `https://a.com/z/1.mp4`
  - `nowPath` 是绝对地址时直接返回 `nowPath`。
  - 可能收到空串入参（包装层做了 `|| ''`），返回一个 sane 值即可。
- 各语言现成实现：Python `urllib.parse.urljoin`、Java `java.net.URI.resolve`、JS `new URL(ref, base).href`、C# `new Uri(base, rel).ToString()`。

### 4.4 `local` —— 持久 KV 存储

- **引用位置**：`drpy2.js:1648-1668`（`setItem/getItem/clearItem`）。
- **形态**：

```js
local = {
  get(key, k, v),    // 取：命名空间 key 下字段 k 的值；没有返回 v（或 null/undefined，js 端有 || v 兜底）
  set(key, k, v),    // 存
  delete(key, k)     // 删
}
```

- `key` 是源唯一标识（`RKEY`，见 5.2），用于多源隔离；`v` 的值**全是字符串**（过验证的 cookie、用户配置等）。
- 不注入的话 `setItem/getItem` 一调用就 ReferenceError；功能上只需要"能存能取"，内存 Map 都能过，持久化（数据库/文件）能让验证 cookie 跨重启生效（hipy 用 MySQL：`app/utils/local_cache.py`）。

### 4.5 `console` —— 日志出口

- drpy2.js 内 js 层的 `print/log` 最终全部落到 `console.log`（`drpy2.js:1941-1958`），全文几十处调用。
- 至少提供 `console.log`；建议把 `error/warn/info` 也映射到同一出口。可以像 hipy 一样配合 `_debug` 开关决定是否真的输出（`quickjs_ctx.py:105` 的 `const console = {log}`）。

### 4.6 `batchFetch(items)` —— 并发批量请求

- **为什么必须**：drpy2.js 本体不调用它，但它已成长为**源码事实标准**——大量 drpy2 源直接调用做并发请求（首页聚合、多线路/多页探测等），不注入这些源一进来就 `ReferenceError`。
- **参考实现**：hipy `app/utils/vod_tool.py:185`（`ThreadPoolExecutor` 并发 + 结果按序对齐）。
- **契约**：

```js
// 入参：数组，每项 {url, options}，options 与 req 的参数一致（可整体省略）
batchFetch([
  {url: 'http://www.a.cn', options: {headers: {}, body: 'a=1&b=2', method: 'POST'}},
  {url: 'http://www.b.cn'},
])
// 返回：数组，与入参顺序一一对齐；每项为对应请求的响应"文本"
// 空入参返回 []；单项失败返回 ''（不能让整批抛异常中断其他请求）
```

- 各语言实现套路相同——"并发地调你的单次请求函数，按序收集结果"：Python `ThreadPoolExecutor`/`asyncio`、Java `ExecutorService`、Go goroutine + channel、C# `Task.WhenAll`、Node `Promise.all`。

---

## 5. 可选注入的 API

### 5.1 `getProxy(is_public)` —— 本地代理地址

- **引用位置**：`drpy2.js:1006-1012`。`getProxyUrl()` 判断 `typeof getProxy === 'function'`，有则 `getProxy(true)`，无则退回默认 `http://127.0.0.1:9978/proxy?do=js`。
- 不注入只能跑"直连"源；要支持带 `proxy_rule` 的源（网盘、加密播放地址等），必须注入并实现下面的**代理回环**：

```
源在详情/播放里返回 getProxyUrl()+自定义参数 的链接
        │ 播放器请求该地址
        ▼
宿主的本地 HTTP 服务收到请求，解析 query 为 params 对象
        │
        ▼
调用 drpy2.js 导出的 proxy(params)  →  返回 [状态码, content-type, 内容体] 三元组
        │
        ▼
宿主按该状态码/类型把内容回给播放器
```

hipy 参考：`qjs_drpy.py:76`（注入）、`qjs_drpy.py:159-169`（地址生成）、`qjs_drpy.py:162`（返回 `http://127.0.0.1:5707/api/v1/vod/<源>?pwd=...&do=js`）。

### 5.2 `key` —— 源唯一标识（变量）

- **引用位置**：`drpy2.js:3595`：`RKEY = typeof(key)!=='undefined' && key ? key : 'drpy_' + (rule.title || rule.host)`。
- hipy 传 `'_' + md5(源api路径)`。不注入也能跑（自动降级），但多源共享 `local` 存储时建议注入以保证命名空间稳定。

### 5.3 `pdfl(html, parse, list_text, list_url, my_url)` —— drpy2.1 加速解析

- **引用位置**：`drpy2.js:4`（版本号探测）、`drpy2.js:2950-2954`（二级选集列表解析）。
- 存在时版本标识为 drpy2.1、列表解析走它（一次调用出整条列表）；不存在走 `pdfa + pdfh/pd` 逐条循环，只是慢些。不注入完全可用。
- **现成实现**：drpy-node `libs_drpy/htmlParser.js:228`（JS/Node 宿主直接搬）；语义 = 整段列表 HTML 一次解析出 `标题$链接` 数组，批量模式单次 `cheerio.load` + DOM 索引标记，复杂选择器回退逐元素循环。

### 5.4 其他

| 项 | 说明 |
|----|------|
| `atob` / `btoa` | 可不给，`window_b64()` 兜底（`drpy2.js:419-499`） |
| `_debug` | hipy 侧的调试开关，配合 `console` 决定是否输出日志 |
| `fetch` / `print` / `log` / `urljoin` | hipy 注入了，但 drpy2.js 模块内用 `var` 声明并用 JS 自实现遮蔽了它们（`fetch=request`、`print=js实现`、`urljoin=joinUrl包装`），**对 drpy2.js 非必需**；只有兼容 hipy 系老源码时才需要 |

---

## 6. 避坑表：哪些东西**不用**注入

### 6.1 会被模块作用域遮蔽的（注入了也白注入）

drpy2.js 是 ES Module，模块内 `var` 声明会遮蔽同名全局（`drpy2.js:387-401`）：

`MY_URL`、`HOST`、`RKEY`、`fetch`、`print`、`log`、`rule_fetch_params`、`fetch_params`、`oheaders`、`_pdfh`、`_pdfa`、`_pd` —— 全部由 drpy2.js 自己赋值管理。

### 6.2 hipy initContext 注入了、但 drpy2.js 根本没引用的

这些是 hipy 生态里**其他源码 js** 用的，对接 drpy2.js 时可以全部不做：

`snifferMediaUrl`（浏览器嗅探）、`fetCodeByWebView`、`getParams`、`params`、`env`、`toast`、`image`、`重定向`、`vipUrl`、`realUrl`、`input`（全局初始值）、`fetch_params`（初始值）、`os`（只有从未被调用的 `readFile` 用到）、`getCryptoJS`（drpy2.js 内部自有实现）。

> 注意：`batchFetch` 原本也在"drpy2.js 本体不用"之列，但它已成为源码事实标准，**必须注入**——见 4.6。

### 6.3 打包在 core-lite 里、不需要你实现的

`CryptoJS`（base64/md5/AES，`drpy2.js:826-838` 等处）、`pako`（gzip/ungzip）、`gbkTool`（GBK 搜索编码）、`JSEncrypt` + `NODERSA`（RSA）、`JSON5`、`jinja`（模板渲染）、`cheerio`（含 jsonpath `cheerio.jp`、`cheerio.jinja2`）、`模板`（`模板.getMubans()`，`init()` 必用，`drpy2.js:3421`）、`WXXH`、`TextEncoder/TextDecoder`。
—— 条件是按第 3 节方案 A/B 引入 `dist/drpy-core-lite.min.js`；走方案 C 才需要逐个注入这些库。

---

## 7. 导出函数调用规范

### 7.1 生命周期

```
创建引擎 Context
   → 注入全局（第 4/5 节）
   → 加载 drpy2.js（+ core-lite）
   → 取导出对象（ESM 默认导出 / globalThis.<key>）
   → init(源码字符串)                    ← 必须最先调用；可重复调用换源/换 extend
   → home() / homeVod() / category(...) / detail(...) / search(...) / play(...) / proxy(...) ...
```

`init(ext)` 的 `ext` 支持：**源码字符串**（推荐，宿主自己读文件传入）、`http(s)://` 或 `file://` 地址（init 内部会用你注入的 `req` 自己下载，`drpy2.js:3428-3448`）、rule 对象。它内部会自动完成：解密（gzip/base64/AES/RSA 加密的源）、模板继承、host/homeUrl/searchUrl 拼接、headers 处理、`RKEY` 计算、预处理（`rule.预处理`）。

### 7.2 各函数签名与返回结构

除特别注明外，**返回值均为 JSON 字符串**，宿主 JSON 解析后即 TVBox 标准结构：

| 函数 | 入参 | 返回（JSON 解析后） |
|------|------|--------------------|
| `init(ext)` | 源码字符串/url/对象 | 无返回值（undefined），失败只打日志 |
| `home(filter, home_html?, class_parse?)` | filter 可传 `''`/`{}`；后两个是 hipy 自动匹配模板用的可选参数 | `{"class":[{"type_id":"1","type_name":"电影"}], "filters":{...}}` |
| `homeVod(params)` | 通常传 `''` | `{"list":[{vod_id, vod_name, vod_pic, vod_remarks, vod_content}]}` |
| `category(tid, pg, filter, extend)` | 分类 id、页码(数字)、是否筛选(bool)、筛选条件对象 | `{"page":1,"pagecount":999,"limit":20,"total":999,"list":[同上]}`；无数据时返回防崩溃占位条目 |
| `detail(vod_url)` | 一级/搜索列表里的 `vod_id` 字符串 | `{"list":[vod]}`，vod 含 `vod_play_from:"线路1$$$线路2"`、`vod_play_url:"第1集$url1#第2集$url2$$$第1集$url3"` |
| `play(flag, id, flags)` | 线路名、选集链接、flags 数组 | `{"parse":0/1, "jx":0/1, "url":"播放地址", "flag":...}`（parse=1 表示需要宿主/网页嗅探，parse=0 直连） |
| `search(wd, quick, pg)` | 关键字、是否快速搜索、页码 | 同 category 结构 |
| `proxy(params)` | query 参数对象 | **三元组数组** `[200, "application/octet-stream", 内容]`，或 `[404,"text/plain","Not Found"]`（`drpy2.js:3176-3194`） |
| `sniffer()` | 无 | boolean，是否启用辅助嗅探 |
| `isVideo(url)` | 候选播放地址 | boolean，是否判定为视频 |
| `getRule(key?)` | 可选字段名 | 不传返回整个 rule 对象；传 `key` 返回 `rule[key]`（hipy 用 `getRule('is_video')` 取嗅探配置，`qjs_drpy.py:171-184`） |
| `runMain(code, arg)` | 源内 main 函数代码、参数 | string（少数源用它做壳层数据交换） |
| `fixAdM3u8Ai(m3u8_url, headers?)` | m3u8 地址 | 处理完广告的 m3u8 **文本**（去广告，可选功能） |

### 7.3 跨语言传参注意

- **参数尽量传字符串 / 数字 / 布尔 / 纯 JSON 对象**。hipy 的做法是复杂对象先 `ujson.dumps` → `ctx.parse_json` 转成 JS 对象再传入（`qjs_drpy.py:101-104,119-125`）。
- **返回值统一拿字符串**：JS 对象若不能直接过桥（多数 quickjs 绑定给的是 opaque 对象），对它调 `.json()` 再 `JSON.parse`（hipy `toDict`：`qjs_drpy.py:106-110`）。
- 编码全程 UTF-8，源文件按 UTF-8 读入。

---

## 8. 工程实践建议

1. **一源一 Context 常驻**：缓存 `init` 后的 rule 状态；换源 = 同 Context 重新 `init(新源码)`，或直接销毁重建（重建时记得重新注入全部全局）。
2. **调用串行化**：QuickJS Context 不能多线程同时进。单 worker 队列 / 互斥锁保护，hipy 模式：`ThreadPoolExecutor(max_workers=1)` + `Lock` + 每次调用后 `gc()`（`qjs_drpy.py:89-93`）。
3. **内存**：drpy2.js 一次搜索/详情会拉多页 HTML，及时 `gc()`；长驻进程给 Context 加使用次数上限，超限重建。
4. **超时**：`req` 内部务必实现超时（rule 默认 5000ms），否则一个卡死的源会拖死整个串行队列。
5. **本地代理服务**（可选）：实现 `getProxy` 时，宿主要起一个 HTTP 端口承接 `do=js` 回环（见 5.1），返回 `proxy()` 的三元组。
6. **调试**：先把 `_debug`/console 打开，drpy2.js 的 `init_test()`（init 末尾自动执行）会打印注入项自检信息（`getProxyUrl()`、`RKEY`、rule 内容）。若看到 `xxx is not defined` 即对应注入项缺失。

---

## 9. 最小可运行示例（Python 3 + `quickjs` 包）

> 演示"注入 → 加载 → init → home/category → 搜索"全流程。`pdfh/pdfa/pd` 直接复用 hipy 的 `htmlParser.py`（纯 Python jsoup 封装，单文件拷走即用）；`batchFetch` 用线程池并发。**切勿自己手写 HTML 解析器**（理由见 4.2）。

```python
# pip install quickjs pyquery jsonpath ujson requests
import json, re, base64
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin
import requests
import quickjs

# ---------- 4.1/4.6 单次请求（req 与 batchFetch 共用） ----------
def _do_request(url, obj):
    """返回 (text_or_b64, headers, error)；obj.buffer==2 时 text 为二进制 base64"""
    obj = obj or {}
    method = (obj.get('method') or 'GET').upper()
    timeout = min((obj.get('timeout') or 5000) / 1000, 30)
    charset = obj.get('encoding') or 'utf-8'
    headers = {str(k): str(v) for k, v in (obj.get('headers') or {}).items()}
    if headers.get('content-type') and 'charset=' in headers['content-type'].lower():
        charset = re.search(r'charset=([\w-]+)', headers['content-type'], re.I).group(1)
    allow_redirect = obj.get('redirect') != 0
    try:
        if method == 'GET':
            r = requests.get(url, params=obj.get('data') or None, headers=headers,
                             timeout=timeout, allow_redirects=allow_redirect)
        else:
            r = requests.request(method, url, data=obj.get('body') or obj.get('data'),
                                 headers=headers, timeout=timeout, allow_redirects=allow_redirect)
        r.encoding = charset
        text = base64.b64encode(r.content).decode() if obj.get('buffer') == 2 else r.text
        return text, {str(k): str(v) for k, v in r.headers.items()}, None
    except Exception as e:
        return '', {}, str(e)

def make_req(ctx):
    def req(_url, _object):
        obj = json.loads(_object.json())            # JS 对象 -> dict
        text, hd, err = _do_request(_url, obj)
        if err:
            hd['error'] = err
        return ctx.parse_json(json.dumps({'content': text, 'headers': hd}))  # 必须 JS 对象
    return req

# ---------- 4.6 batchFetch：并发批量请求（源直调的事实标准） ----------
def make_batchFetch(ctx):
    def batchFetch(_items):
        items = json.loads(_items.json()) if not isinstance(_items, list) else _items
        if not items:
            return ctx.parse_json('[]')
        def one(it):
            text, _, _ = _do_request(it.get('url'), it.get('options'))
            return text                              # 与 hipy fetch 一致：返回响应文本
        with ThreadPoolExecutor(max_workers=min(len(items), 16)) as pool:
            return ctx.parse_json(json.dumps(list(pool.map(one, items))))  # 顺序与入参对齐
    return batchFetch

# ---------- 4.2 pdfh/pdfa/pd：直接复用现成 jsoup 封装（切勿手写解析器） ----------
# htmlParser.py 取自 hipy-server/app/t4/base/（单文件、无包内依赖，拷进项目即可）
from htmlParser import jsoup
jsp = jsoup('')          # jsoup 实例实例化一次即可；pd 的 base_url 由调用方逐次传入

# ---------- 4.4 local ----------
_STORE = {}
def local_get(key, k, v=None):     return _STORE.get((key, k), v)
def local_set(key, k, v):          _STORE[(key, k)] = str(v)
def local_delete(key, k):          _STORE.pop((key, k), None)

# ---------- 组装宿主 ----------
class Drpy:
    def __init__(self, source_code, key='_demo'):
        self.ctx = quickjs.Context()
        c = self.ctx
        c.add_callable('log', lambda *a: print('[drpy]', *a))
        c.eval('var console = {log: log};')
        c.add_callable('req', make_req(c))
        c.add_callable('batchFetch', make_batchFetch(c))
        c.add_callable('pdfh', jsp.pdfh)                                           # jsoup 实例方法直挂
        c.add_callable('pdfa', lambda h, p: c.parse_json(json.dumps(jsp.pdfa(h, p))))  # list 转 JS 数组
        c.add_callable('pd', jsp.pd)                                               # 签名 (html, parse, base_url='') 正好匹配
        c.add_callable('joinUrl', urljoin)
        c.add_callable('local_get', local_get)
        c.add_callable('local_set', local_set)
        c.add_callable('local_delete', local_delete)
        c.eval('var local = {get: local_get, set: local_set, delete: local_delete};')
        c.set('key', key)                       # 可选：源唯一标识
        # c.add_callable('getProxy', lambda pub: 'http://127.0.0.1:9978/proxy?do=js')  # 可选
        # 方案 C 式加载：只去 import（export default 在 module 加载下合法），末尾拼全局导出
        code = self._strip_esm(source_code)
        c.module(f'{code}\nglobalThis.{key} = '
                 '{ getRule,runMain,init,home,homeVod,category,detail,play,search,proxy,sniffer,isVideo,fixAdM3u8Ai };')
        self.key = key

    @staticmethod
    def _strip_esm(code):
        return re.sub(r'^\s*import[^\n]*$', '', code, flags=re.M)  # 去掉 core-lite 的 import 行

    def call(self, fn, *args):
        r = self.ctx.eval(f'globalThis.{self.key}.{fn}')(*args)
        return json.loads(r) if isinstance(r, str) else r   # init 无返回值，原样透传

# ---------- 用法 ----------
# with open('src/drpy2.js', encoding='utf-8') as f:
#     drpy = Drpy(f.read())          # 注意：方案C还需把 core-lite 的库全局先注入，见第3节
# drpy.call('init', open('你的源.js', encoding='utf-8').read())
# print(drpy.call('home', ''))
# print(drpy.call('search', '斗罗大陆', False, 1))
```

### Node.js 宿主速记

Node 下几乎所有注入项都有现成实现：`req` 用 `fetch`/`axios`，`joinUrl` 用 `new URL(ref, base).href`，`pdfh/pdfa/pd` 用 npm `cheario`（drpy-node 同款），`local` 用 `fs` + JSON 文件，引擎用 `quickjs-emscripten` / `wasmer` 或干脆直接跑在 Node 全局里（drpy-node 就是这么做的）。

### Java / C# / Go

契约完全相同：选择对应 QuickJS 绑定（如 `quickjs-java`、`QuickJS.NET`），按第 4 节注册 6 个回调（HTTP 回调用该语言生态的网络库，JSON 桥接用各自的序列化器），`String` 进出即可。

---

## 10. 对接自检清单

按顺序验证，每步通过再进下一步：

- [ ] 1. 引擎能加载 drpy2.js 且导出可用：`typeof getRule === 'function'`、`typeof init === 'function'`
- [ ] 2. `console.log` 有输出到宿主日志
- [ ] 3. 注入项齐全：调用 `getProxyUrl()`（需 `getProxy`）与 `init_test()` 自动打印不报 `xxx is not defined`
- [ ] 4. `init(源码字符串)` 后 `getRule('host')` 返回该源 host
- [ ] 5. `home('')` 返回带 `class` 数组的 JSON
- [ ] 6. `category(tid, 1, false, {})` 返回带 `list` 的 JSON
- [ ] 7. `detail(vod_id)` 返回带 `vod_play_from` / `vod_play_url` 的 JSON
- [ ] 8. `play(flag, url, [])` 返回 `{parse, url}`；parse=0 的源直接可播
- [ ] 9. `search(wd, false, 1)` 返回结果列表（GBK 源验证 `encoding` 解码）
- [ ] 10. `req` 两条特殊路径：`withHeaders`（过验证源拿 set-cookie）、`buffer=2`（图片 base64）
- [ ] 11. 直接调用 `batchFetch` 的源能并发取数，且返回数组顺序与请求一一对应
- [ ] 12. `setItem/getItem`（local）在 Context 重建后仍能读到（持久化验证）
- [ ] 13. （可选）`getProxy` + 本地端口回环：`proxy(params)` 三元组正确回包

---

## 附录 A：hipy `initContext` 全量注入对照表（考古结论）

`quickjs_ctx.py:30-136` 共注入 4 类；"drpy2 需要"列基于对 `src/drpy2.js` 全文标识符逐一 grep 的结论：

| 注入项 | 类型 | drpy2.js 是否用到 | 备注 |
|--------|------|------------------|------|
| `req` | callable | ✅ 必须 | 返回 `{content, headers}` 对象 |
| `pdfh` / `pdfa` / `pd` | callable | ✅ 必须 | `defaultParser` 直接引用 |
| `joinUrl` | callable | ✅ 必须 | `urljoin` 同注入但被模块内同名函数遮蔽 |
| `local`（get/set/delete 拼装） | eval 拼装对象 | ✅ 必须 | setItem/getItem/clearItem 依赖 |
| `console = {log}` | eval 拼装对象 | ✅ 必须 | print/log 的最终出口 |
| `batchFetch` | callable | ✅ 必须 | drpy2.js 本体不调用，但大量源直调（事实标准）；入参 `[{url, options}]`，返回按序对齐的响应文本数组 |
| `getProxy` | callable（qjs_drpy.py:76 单独注入） | ⭕ 建议 | 无则退默认 9978 地址 |
| `key` | 变量（qjs_drpy.py:25 计算） | ⭕ 建议 | RKEY 命名空间 |
| `pdfl` | callable | ⭕ 可选 | drpy2.1 加速，hipy 未注入 |
| `_debug` | 变量 | ⭕ 可选 | hipy 日志开关 |
| `fetch` | callable | ❌ | 被模块内 `fetch=request` 遮蔽 |
| `print` / `log` | callable | ❌ | 被模块内 js 实现遮蔽 |
| `urljoin` | callable | ❌ | 同名遮蔽，实际用 joinUrl |
| `atob`/`btoa` | 引擎级 | ❌ | window_b64 兜底 |
| `snifferMediaUrl` | callable | ❌ | hipy 生态源用 |
| `fetCodeByWebView` | callable | ❌ | 同上 |
| `getParams` / `params` | callable/变量 | ❌ | 同上 |
| `env` / `input` / `vipUrl` / `realUrl` / `fetch_params`(初始值) | 变量 | ❌ | 同上 |
| `toast` / `image` / `重定向` | callable | ❌ | 同上 |
| `os` | 引擎内建 | ❌ | 仅 readFile 引用且 readFile 无调用方 |
| `getCryptoJS` | callable | ❌ | drpy2.js 内部自有实现返回字符串 |
| 库全局：cheerio/模板/CryptoJS/pako/gbkTool/JSEncrypt/NODERSA/JSON5/jinja | module 脚本 | ✅(方案C) | 方案 A/B 由 core-lite 打包提供；其中 WXXH 走 wasm，引擎原生 WebAssembly 支持性能最佳（见第 2 节） |

## 附录 B：相关文件索引

| 文件 | 内容 |
|------|------|
| `E:\gitwork\drpy-webpack\src\drpy2.js` | 被对接的规则引擎（本指南主角） |
| `E:\gitwork\drpy-webpack\dist\drpy-core-lite.min.js` | 核心依赖包（必须随包分发） |
| `E:\gitwork\drpy-webpack\esbuild.config.cjs` | core 包构建配置（可仿写单文件打包） |
| `E:\gitwork\hipy-server\app\t4\qjs_drpy\qjs_drpy.py` | 参考宿主：Context 生命周期、模块加载、调用桥 |
| `E:\gitwork\hipy-server\app\utils\quickjs_ctx.py` | 参考宿主：initContext 全量注入清单 |
| `E:\gitwork\hipy-server\app\utils\vod_tool.py` | `req/fetch/batchFetch` 参考实现（`base_request`） |
| `E:\gitwork\hipy-server\app\utils\local_cache.py` | `local` KV 参考实现（MySQL） |
| `E:\gitwork\hipy-server\app\t4\base\htmlParser.py` | `pdfh/pdfa/pd` 参考实现（纯 Python jsoup） |
| `E:\gitwork\hipy-server\app\t4\qjs_drpy\qjs_module_*.js` | 方案 C 所需的 9 个库脚本 + 适配版 drpy2 |
