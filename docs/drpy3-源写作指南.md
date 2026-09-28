# drpy3 源写作指南（写给源作者的唯一一份完整文档）

> 读者：想给 DsPlayer（或其他 drpy3 宿主）写影视源的人。不需要了解壳子内部，照本文从零写到精通。
> 配套阅读：[drpy3-设计文档.md](drpy3-设计文档.md)（框架设计）、[宿主对接指南.md](宿主对接指南.md)（壳子开发者向）。
> 本文档描述的运行环境基准：DsPlayer（QJS 引擎 + libquickjs_bridge.so，含库全局与裸名工具面完整支持）。

---

## 一、drpy3 是什么

drpy3 是 **drpy2 的声明式继任格式**：同一个影视源要做的「分类 → 列表 → 详情 → 播放 → 搜索」五件事，能用配置说清的全部用配置声明（`rule` 字段），只有接口真正需要写代码的地方才写 async 函数（钩子）。对比 dr2：

| | drpy2 | drpy3 |
|---|---|---|
| 源形态 | 一个大对象，靠 `class_parse`/`一级` 等字符串规则 + 全局函数 | `{meta, rule, 钩子...}` 声明式优先 + async 钩子 |
| 环境 | 源与引擎代码拍平同作用域，一切裸名 | ES Module `export default`，全局面显式可控（见 §八） |
| 网络请求 | 裸名 `req()`（同步语义） | `await ctx.req()`（异步），js: 片段内仍是 `request()` 老写法 |
| 代码执行 | 单线程同步 | async/await，支持 `batchFetch` 并发 |

**运行环境**：源是标准 ESM 单文件（`.js`），`export default` 一个对象。宿主用支持 ESM 的 JS 引擎加载它——DsPlayer 用 QuickJS（libquickjs_bridge.so，自带 cheerio/GBK/zlib/WebAssembly 等 C 级能力，见 §8.3）。

**核心心智模型（一句话）**：能声明的全部声明（§五）；js: 字符串片段里是 drpy2 全兼容老写法（§8.4）；真正复杂的逻辑写成 async 钩子用 `ctx`（§七）。

---

## 二、30 秒上手：最小可跑的源

```js
/*
@header({
  title: '示例源',
  lang: 'dr3',
  searchable: 2, filterable: 1, quickSearch: 0,
})
*/
export default {
  meta: {
    title: '示例源',
    host: 'https://api.example.com',
    searchable: 2, filterable: 1, quickSearch: 0,
  },
  rule: {
    // 静态分类：home 零代码
    class_name: '电影&剧集',
    class_url: '1&2',
    // 列表地址模板：fyclass=分类id，fypage=页码
    url: 'https://api.example.com/list?cid=fyclass&page=fypage',
    // 声明式一级：json 五段式（列表路径;标题;图片;备注;id）
    一级: 'json:data.list;name;pic;remark;id',
    // 详情直连：点进详情直接嗅探播放
    二级: '*',
  },
};
```

这 20 行就是一个能浏览、能点进去播放的完整源。下面把每一块讲透。

---

## 三、源的三种形态

`export default` 的对象按内容自动判定形态（框架 `detectForm`）：

| 形态 | 判定 | 说明 |
|---|---|---|
| **纯声明式** | 对象里没有任何钩子函数 | 全生命周期走内置默认引擎（`rules/defaults.js`），零样板 |
| **增强式** | 含任意钩子函数（`home`/`category`/…） | 钩子优先；没写的环节仍走声明式默认引擎 |
| **defineSource 包装** | `defineSource({...})` | 恒等函数（原样返回），只为 IDE 类型提示，**用不用都不影响行为** |

同一源内混用是常态：`rule.一级` 声明列表解析，`detail` 写 async 钩子处理特殊接口——**钩子存在时优先走钩子，没写的环节回退声明式**。

---

## 四、meta 字段

```js
meta: {
  title: '源名',            // 必填：源显示名（也是实例 key 的兜底）
  host: 'https://xx.com',   // 站点根：rule.host 缺省时的兜底
  searchable: 2,            // 搜索能力：0 不支持 / 1 部分 / 2 全量（惯例值，壳子展示用）
  filterable: 1,            // 是否有筛选
  quickSearch: 0,           // 是否支持快搜
  multi: 1,                 // 可选：多线路标记（惯例值）
  stateVersion: 'v1',       // 可选：实例状态版本号——改动实例态结构时升一位，旧快照不复活
  initCost: 'high',         // 可选：init 昂贵时标注，宿主 LRU 驱逐权重提高
}
```

---

## 五、rule 声明式字段全集

### 5.1 站点骨架

| 字段 | 说明 |
|---|---|
| `host` | 站点根地址（末尾 `/` 自动剥除；缺省取 `meta.host`） |
| `homeUrl` | 首页/分类页基准（`class_parse` 选择器形态请求它；`detail` 里作 urljoin 基准） |
| `url` | 一级列表地址模板，支持占位符（见 5.4） |
| `searchUrl` | 搜索地址模板，`**` = 关键词，`fypage` = 页码；`;post` 后缀切 POST |
| `detailUrl` | 详情地址模板，`fyid` = 详情 id（声明式二级的详情页地址） |
| `headers` | 全源请求头基线；`'User-Agent': 'MOBILE_UA'` 写 UA 常量名会自动解析成真实 UA |
| `timeout` | 默认请求超时 ms |
| `encoding` | 默认响应编码（`gbk` 等） |

### 5.2 分类与筛选

| 字段 | 说明 |
|---|---|
| `class_name` / `class_url` | 静态分类名/id，`&` 分隔，一一对应——**有这对字段 home 就零代码** |
| `class_parse` | 动态分类：`js:...` 片段（`input` 里放数组）或选择器 `'列表;名称;链接[;正则]'`（自动请求 homeUrl） |
| `cate_exclude` | 分类名正则黑名单 |
| `filter` | 筛选数据：**gzip→base64 的 JSON**（`{分类id: [{k,n,v[]}]}` 结构）；home 时自动解压，源内声明即可 |
| `filter_url` | 筛选参数模板，jinja2 渲染：`year={{fl.year or "all"}}`；配 `fyfilter` 占位或直接拼接 |
| `filter_def` | `{分类id: {默认筛选}}` 各分类默认值 |

### 5.3 列表/详情/播放解析

| 字段 | 说明 |
|---|---|
| `一级` | 分类列表解析规则：`json:...` / 选择器五段式 / `js:` 片段（§十） |
| `推荐` | 首页推荐解析规则（形态同一级；homeVod 缺省用它，没有则空列表） |
| `搜索` | 搜索解析规则；写 `'*'` 复用 `一级` |
| `二级` | 详情解析：`js:` 片段（`VOD` 回写）/ `'*'` 直连嗅探 / **对象形态** `{title,desc,content,img,tabs,tab_text,lists,list_text,list_url}`（CMS 模板源）/ 缺省 = 一级链接直接嗅探 |
| `二级访问前` | `js:` 片段，详情请求前执行（改 header/登录等预处理） |
| `play_parse` | `true` 时启用 `lazy` js 免嗅探 |
| `lazy` | `js:` 片段，`input` 回放播放地址或 `{parse,jx,url}` 对象 |
| `play_json` | `[{re:'正则', json:{...}}]` 按 url 正则覆盖播放返回（`re:'*'` 兜底） |
| `pagecount` | `{分类id: 总页数}` 声明式各分类页数 |
| `sniffer` | `true` 时声明源需要嗅探 |
| `isVideo` | 播放地址判定正则或 `js:` 片段 |
| `proxy_rule` | `js:` 片段本地代理（§十四） |

### 5.4 地址模板占位符（url / searchUrl 通用）

| 占位符 | 含义 |
|---|---|
| `fyclass` | 分类 id（searchUrl 无） |
| `fypage` | 页码 |
| `[...]` | 首页取 `[` 内地址、翻页取 `[` 前地址（很多站第一页地址不同的套路） |
| `(表达式)` | url 内小表达式，`fypage` 参与运算，如 `(fypage - 1)` |
| `**` | 搜索关键词（searchUrl） |
| `;post` / `;postjson` | searchUrl 后缀：POST 表单 / POST JSON（`#` 前地址 `#` 后 body） |
| `fyfilter` | `filter_url` 插入点（缺省尾部拼接） |

---

## 六、钩子（十一个）签名与返回协议

钩子都是 async，第一个参数恒为 `ctx`（§七）。**壳子按环节调用，返回值协议如下**。

### 6.1 init — `async init(ctx, ext)`

装载后调用一次。`ext` = 源配置的扩展参数（壳子导入时填的 extend）。适合登录、拿 token、预处理 rule。**返回值被忽略**——要存状态用 `ctx.store` 或写 `ctx.rule`/`ctx.headers`。

### 6.2 home — `async home(ctx, filter)` → `{class, filters?}`

```js
async home(ctx, filter) {
  return {
    class: [{ type_id: '1', type_name: '电影' }],
    filters: { '1': [{ k: 'year', n: '年份', v: [{n:'全部',v:'all'}, {n:'2024',v:'2024'}] }] },
  };
}
```

纯声明式源不需要写——`class_name/class_url` 自动生成 `class`，`rule.filter` 自动解压成 `filters`。

### 6.3 homeVod — `async homeVod(ctx)` → `{list: [vod...]}`

首页推荐。vod 条目字段见 6.9。

### 6.4 category — `async category(ctx, tid, pg, filter, extend)` → 分页对象

```js
async category(ctx, tid, pg, filter, extend) {
  return {
    page: pg, pagecount: 10,     // pagecount 写 999 = 未知总页数（一直可翻）
    limit: 20, total: 999,
    list: [ { vod_id: '...', vod_name: '...', vod_pic: '...', vod_remarks: '更新至x集' } ],
  };
}
```

⚠️ **没有数据时返回 `list: []` 即可，不要自己造空对象返回 `{}`**——声明式默认引擎在空结果时会自动返回 `no_data` 哨兵（`vod_id: 'no_data'`），壳子靠它判定「到底了」终止分页。你手写钩子时也应在真没数据时返回含 `no_data` 哨兵的结构（或空 list，由壳子兜底）。

### 6.5 detail — `async detail(ctx, id, fullId)` → `{list: [vod]}`

`id` 是列表页传来的 vod_id（壳子可能剥过「分类$」前缀），`fullId` 是原始全文——**回写 `vod_id` 时用 fullId 保真**（框架已兜底）。

vod 条目关键字段：

| 字段 | 说明 |
|---|---|
| `vod_id` | 详情 id（原样回传，播放时壳子再传回 play） |
| `vod_name` / `vod_pic` / `vod_remarks` | 片名 / 海报 / 角标（更新至x集） |
| `type_name` / `vod_year` / `vod_area` / `vod_actor` / `vod_director` / `vod_content` | 详情页元信息 |
| `vod_play_from` | 线路名，多线 `$$$` 分隔：`线路1$$$线路2` |
| `vod_play_url` | 选集，与线路一一对应：每线 `集名$集地址#集名$集地址`，线间 `$$$` |

### 6.6 play — `async play(ctx, flag, id, flags)` → 播放对象

`flag` = 线路名，`id` = detail 里 `$` 后的集地址，`flags` = 全部线路名。返回 **TVBox 形态**：

```js
async play(ctx, flag, id, flags) {
  return {
    parse: 0,          // 1=需要壳子网页嗅探；0=直接播 url
    jx: 0,             // 1=走壳子 json 解析（jx 接口）；常规直链写 0
    url: id,           // 播放地址（直链/m3u8）
    header: { 'User-Agent': 'xxx', Referer: 'https://xx.com' },  // 可选：随播放下发的请求头
  };
}
```

- 特殊协议（磁力/`push:`）`parse` 写 0 让壳子走对应通道。
- 纯声明式默认：非 m3u8/mp4/m4a 后缀且非正版站自动 `jx:1`（tellIsJx 语义）。

### 6.7 search — `async search(ctx, wd, quick, pg)` → 分页对象（同 category）

`wd` = 关键词，`quick` = 是否快搜。

### 6.8 proxy — `async proxy(ctx, params)` → 响应数组

本地代理钩子。`params` 是查询参数对象。返回：

```js
return [200, 'image/png', bytesUint8Array];        // 三元组
return [200, 'text/plain', 'ok', { 'Cache-Control': 'no' }, false]; // 五元组：+响应头 + body 是否按 bytes 处理
return [404, 'text/plain', 'Not Found'];           // 缺省兜底
```

壳子侧路由（DsPlayer）：`http://127.0.0.1:9978/api/<siteKey>/?do=drpy3&...` → 进源 proxy 钩子。适合图片防盗链中转、分段解密等。

### 6.9 action — `async action(ctx, action, value)` → 字符串

交互通道（壳子的源动作按钮）。返回字符串文案（壳子 toast 展示）或按壳子约定的动作 JSON。

### 6.10 sniffer — `async sniffer(ctx)` → bool

声明本源播放需要网页嗅探（缺省读 `rule.sniffer`）。

### 6.11 isVideo — `async isVideo(ctx, url)` → bool

播放地址判定（缺省读 `rule.isVideo` 正则）。

---

## 七、ctx 参考（钩子的全部世界）

```js
async detail(ctx, id) {
  ctx.log('正在解析', id);          // 日志 → 壳子控制台
  ctx.fetchParams.headers.Referer = 'https://xx.com';  // 本次调用链的请求头基线
  const res = await ctx.req(url);   // ctx.req === ctx.lib.net.req
  const list = ctx.pdfa(res.content, 'ul&&li');  // ctx.pdfa === ctx.lib.parse.pdfa
  ...
}
```

### 7.1 调用态字段（每次调用全新）

| 字段 | 说明 |
|---|---|
| `ctx.stage` | 当前环节名（home/category/detail/...） |
| `ctx.url` / `ctx.input` | 本环节当前地址（框架维护，js: 片段里叫 `MY_URL`/`input`） |
| `ctx.flag` / `ctx.wd` / `ctx.pg` / `ctx.fl` | 线路名 / 关键词 / 页码 / 筛选对象 |
| `ctx.scratch` | 调用内临时篮子（想跨子步骤传值放这里，替代 dr2 的全局变量习惯） |
| `ctx.fetchParams` | `{headers, timeout, encoding}` 调用级请求基线，**改它影响本次调用链内所有后续请求**（会话 cookie/Referer 场景） |
| `ctx.resumed` | 实例是否从休眠快照复温（长任务跨调用感知） |

### 7.2 实例态（源实例生命周期内共享）

| 字段 | 说明 |
|---|---|
| `ctx.rule` | 解析后的 rule 对象（可写——声明式 filter 解压就是写回它） |
| `ctx.headers` | 实例级请求头基线：**写这里的头对实例后续所有调用生效**（登录 token 场景） |
| `ctx.key` / `ctx.meta` | 实例 key / meta 只读投影 |

### 7.3 方法与能力

| 成员 | 说明 |
|---|---|
| `ctx.log(...args)` | 日志（DsPlayer 里进 logcat `[drpy3-console]`） |
| `ctx.store` | 命名空间 KV（§十二）；跨重启持久化（壳子快照） |
| `ctx.cache` | 进程内 TTL 缓存 |
| `ctx.capabilities` | 能力表：`{req:'host', pdfh:'host', ..., wasm:'native', engine, version}` |
| `ctx.lib.net` / `parse` / `crypto` / `text` / `utils` / `wasm` | 六组标准库（下表） |

### 7.4 ctx 顶层快捷别名（≈ 30 个高频函数提升到 ctx 一层）

`ctx.req` `ctx.request` `ctx.post` `ctx.reqCookie` `ctx.batchFetch` `ctx.all` `ctx.download` ｜ `ctx.pdfh` `ctx.pdfa` `ctx.pd` `ctx.pdfl` `ctx.jp` `ctx.jinja2` `ctx.parseRule` ｜ `ctx.md5` `ctx.base64Encode` `ctx.base64Decode` `ctx.gzip` `ctx.ungzip` `ctx.aesX` `ctx.desX` `ctx.rc4` `ctx.rsaX` ｜ `ctx.joinUrl` `ctx.getHome` `ctx.urlencode` `ctx.buildUrl` `ctx.buildQueryString` `ctx.forceOrder` `ctx.是否正版` `ctx.urlDeal` `ctx.getProxyUrl`

（同一函数引用，`ctx.req === ctx.lib.net.req`。）

### 7.5 ctx.lib 六组完整函数表

**net**（全 async）

| 函数 | 签名 | 说明 |
|---|---|---|
| `req` | `req(url, options?) → {content, headers}` | 基础请求，§九详解 |
| `request` | 同 req | drpy2 老名别名 |
| `post` | `post(url, options?)` | = req + method POST |
| `reqCookie` | `reqCookie(url, options?, allCookie?) → {cookie, html}` | 过验证搜索场景 |
| `batchFetch` | `batchFetch([{url, options}]) → string[]` | 并发批量，单项失败返 `''` 不中断 |
| `all` | `all(promises)` | Promise.all 语义化 |
| `download` | `download(url, options?) → base64` | buffer:2 显式化 |

**parse**（解析四件套语法见 §十）

| 函数 | 签名 |
|---|---|
| `pdfh` / `pdfa` / `pd` / `pdfl` | `(html, rule[, baseUrl])`；pdfl 批量整表 `(html, rule, listText, listUrl, myUrl)` |
| `jp` | `jp(path, json)` jsonpath 取值 |
| `jinja2` | `jinja2(tpl, obj)` 模板渲染 |
| `parseRule` | `parseRule(ruleStr, ctx, opts)` 高级源直接组合列表规则 |

**crypto**（全同步）

| 函数 | 签名 | 说明 |
|---|---|---|
| `md5` | `md5(text) → hex` | |
| `base64Encode` / `base64Decode` | `(text)` | UTF-8 语义 |
| `gzip` / `ungzip` | `(str)` / `(b64) → str` | gzip→base64（filter 用） |
| `aesX` / `desX` | `(input, key, iv, option)` | §十一详解 |
| `rc4` | `(input, key, option)` | |
| `rsaX` | `(data, key, option)` | key 含 `BEGIN` 自动判私钥解密；`option.long` 分段长文 |

**text**

| 函数 | 说明 |
|---|---|
| `cut(text, start, end, method?, All?)` | 正则裁切：取 start~end 之间文本（含 end）；`All=true` 返回全部命中的 JSON 数组串 |
| `encodeStr` / `decodeStr` | `(input, 'gbk')` GBK 搜索编码（so C 实现） |

**utils**

`joinUrl(base, path)`、`getHome(url)`（取 scheme://host）、`urlencode`、`encodeUrl`、`buildUrl(url, obj)`、`buildQueryString(obj)`、`forceOrder(lists, key, option)`（选集排序）、`是否正版(vipUrl)`、`urlDeal(vipUrl)`、`getProxyUrl()`（async，取壳子代理地址）

**wasm**

| 函数 | 说明 |
|---|---|
| `ctx.lib.wasm.load(source)` | 加载 wasm：Uint8Array / 路径（`loadAsset` 通道）都行；Runtime 级缓存跨实例存活 |
| `ctx.lib.wasm.crypt(...)` | 常用 wasm 解密桥（央视频等标杆源用法，见演示源） |

---

## 八、全局函数参考（源内裸名能直接用什么）

### 8.1 裸名工具面（32 项，Runtime 级纯函数自动挂全局）

```js
export default {
  async category(ctx) {
    const sign = md5('a=1&key=' + KEY);          // ✅ 裸名直接用
    const full = urljoin('https://x.com/a/', 'b.png');
    return {...};
  },
};
```

| 组 | 裸名 |
|---|---|
| crypto 9 | `md5` `base64Encode` `base64Decode` `gzip` `ungzip` `aesX` `desX` `rc4` `rsaX` |
| text 3 | `cut` `encodeStr` `decodeStr` |
| utils 10 | `joinUrl` **`urljoin`**（dr2 老名）/ `getHome` `urlencode` `encodeUrl` `buildUrl` `buildQueryString` `forceOrder` `是否正版` `urlDeal` |
| parse 5 | `pdfh` `pdfa` `pd` `pdfl` `jp` |
| UA 4 | `MOBILE_UA` `PC_UA` `IOS_UA` `UC_UA` |
| 日志 | `print` `log`（→ 壳子控制台） |

### 8.2 库全局

| 全局 | 说明 |
|---|---|
| `CryptoJS` | 完整 CryptoJS 兼容层：`CryptoJS.AES`（CBC/**ECB**）/DES、`CryptoJS.MD5`/SHA 族、HMAC、PBKDF2、`enc.Utf8/enc.Base64/enc.Hex`、`mode.*`/`pad.*`。AES-CBC/GCM、MD5/SHA 走 so 的 C 实现（快）；ECB/DES/RC4 纯 JS 回退 |
| `JSEncrypt` | RSA：`new JSEncrypt()` + `setPublicKey/setPrivateKey` + `encrypt/decrypt`（自带 UTF-8 长文分段，`encryptUnicodeLong` 是别名） |
| `pako` | `gzip/ungzip/deflate/inflate/unzip/crc32...`（so zlib C 实现） |
| `gbkTool` | `encode/decode`（GBK ↔ URL 编码） |
| `模板` | `模板.getMubans()` drpy2 模板源基建 |
| `cheerio` | `{jinja2(tpl,obj), jp(path,json)}`（DOM 走 so 的 Lexbor C 实现；选择器解析用 pdfh 四件套，别拿 cheerio 手爬） |
| `jinja` | `jinja.render(tpl, obj)` |
| `JSONPath` | jsonpath plus |

### 8.3 引擎全局（QuickJS so 启动即注入）

| 全局 | 说明 |
|---|---|
| `Buffer` | Node 风格：`Buffer.from(str,'utf8'/...)'、`buf.toString('base64'/'hex'/'utf8')`、`Buffer.concat` |
| `TextEncoder` / `TextDecoder` | **so 扩展版**：`new TextEncoder('gbk')` / `new TextDecoder('gbk',{fatal:true})`——非 WHATWG 仅 UTF-8 |
| `crypto` | WebCrypto `subtle`（**同步** C 桥，与浏览器 async 不同！）+ `crypto.createHash('md5'/'sha1'/...)` + `createHmac` |
| `WebAssembly` | 原生 wasm3（快路径，源内 wasm 解密直接用） |
| `zlib` | `gzip/gunzip/unzip/inflate/deflate/crc32/adler32` |
| `URL` / `URLSearchParams` | WHATWG 标准 |
| `fs` / `path` / `DataBase` | 文件 / 路径 / SQLite（宿主沙箱内） |
| `atob` / `btoa` / `performance` | 标准 |

### 8.4 js: 片段内 = drpy2 全兼容环境（重要）

`class_parse`/`一级`/`二级`/`搜索`/`lazy`/`二级访问前`/`proxy_rule`/`isVideo` 的 `js:` 字符串片段里，**drpy2 老名字全量原名注入**（`with(scope)` 受控包装，不碰 globalThis），老源作者零学习成本：

| 类别 | 片段内可用名 |
|---|---|
| 调用态回显 | `input` `MY_URL` `MY_FLAG` `flag` `KEY` `wd` `MY_PAGE` `MY_FL` `fetch_params` |
| 网络 | `request(url, opts)`（**返回响应文本**，drpy2 老语义）/ `fetch` = request / `post` / `reqCookie` / `batchFetch` |
| 解析 | `pdfh` `pdfa` `pd`（缺省 base=MY_URL）`pdfl` `jsp.{pdfh,pdfa,pd,jj}` `jq.{pdfh,pdfa,pd}` `jinja2` `jp` |
| 结果回写 | `setResult([{title,url,desc,content,pic_url}])` → `VODS`（自动映射 vod 条目）/ `setResult2(res)` / `setHomeResult`；直接操作 `VOD` `VODS` `TABS` `LISTS` |
| 工具 | §8.1 全部裸名 + `stringUtils()` + `getProxyUrl()` |
| drpy3 能力 | `lib`（=ctx.lib）`ctx` `log` `print` |
| 环节专属 | 一级片段 `TYPE:'cate'`；二级片段 `TYPE:'detail'` `play_url`；搜索片段 `TYPE:'search'` `detailUrl`；lazy 片段 `flag` |

片段内可以 `await`（AsyncFunction 执行）。回写约定：列表类片段写 `VODS`；二级片段写 `VOD`（整个 vod 对象）；class_parse 片段写 `input`（分类数组）；lazy 片段写 `input`（播放地址或播放对象）。

### 8.5 刻意不提供的（设计红线，别找）

| 名字 | 原因 | 替代 |
|---|---|---|
| 裸名 `req`/`request`/`post` | 绑定每次调用的 ctx（headers 合并/调用态隔离），挂全局会跨调用串态 | `ctx.req`；js: 片段里的 `request()` 是片段作用域注入，可用 |
| 裸名 `store`/`cache` | 实例态 | `ctx.store` |
| 裸名 `getProxyUrl` | dr2 是字符串常量、dr3 是 async 函数，裸名易误用 | `await ctx.getProxyUrl()` |
| `require` / `import` 相对路径 | 模块必须随源分发，禁止运行时拉远端 | 代码全写一个文件；大资产走 `loadAsset`/`evalModule`（壳子支持时） |

---

## 九、网络请求详解

### 9.1 基本契约

```js
const res = await ctx.req('https://api.xx.com/list', {
  method: 'GET',                  // GET/POST（默认 GET）
  headers: { 'User-Agent': 'MOBILE_UA' },
  timeout: 10000,                 // ms
  encoding: 'gbk',                // 响应编码（不填自动 UTF-8）
  buffer: 0,                      // 0/缺省=文本；1=Uint8Array；2=base64
  body: 'a=1&b=2',                // POST 体（字符串，原样发）
  data: {a: 1},                   // 对象形态：GET 时拼 query；POST 时按 content-type 序列化
});                               //   （json 头 → JSON；否则表单）
// res.content → 响应体；res.headers → 响应头
```

### 9.2 请求头三层合并（框架自动做）

优先级：**本次 `options.headers` > `ctx.fetchParams.headers` > `ctx.headers`（实例基线）**。合并后自动补：

- 无 `User-Agent` → 默认 `MOBILE_UA`
- 无 `Referer` → 自动取目标地址的 scheme://host

**UA 常量名自动解析**：header 值恰为 `'MOBILE_UA'/'PC_UA'/'IOS_UA'/'UC_UA'` 时替换为真实 UA——所以 rule.headers 和每次请求都能写常量名。

### 9.3 并发

```js
// 批量：单项失败返 '' 不中断（首页多板块聚合常用）
const htmls = await ctx.batchFetch([{url: u1}, {url: u2, options: {headers: h2}}]);
// 任意并发：
const [a, b] = await ctx.all([ctx.req(u1), ctx.req(u2)]);
```

---

## 十、解析器语法

### 10.1 pdfh 四件套（drpy jsoup 语义，so 的 Lexbor C 实现）

| 函数 | 说明 |
|---|---|
| `pdfh(html, rule)` | 取单个值：`'div.main&&h1&&Text'` 取文本；`'img&&src'` 取属性；`'body&&a:eq(0)&&href'` 索引 |
| `pdfa(html, rule)` | 取数组：`'ul.list&&li'` → 元素 HTML 片段数组，逐个再 pdfh |
| `pd(html, rule, baseUrl)` | pdfh + 自动 urljoin 补全相对地址 |
| `pdfl(html, rule, listText, listUrl, myUrl)` | 批量整表：一次解析整个列表（比 pdfa+循环快） |

规则语法要点：

- `&&` 逐层下钻；`Text` 取文本；属性名直接写（`src`/`href`/`data-original`…）
- `:eq(n)` `:lt(n)` `:gt(n)` 索引；`body` = 整个文档
- `--` 后缀排除选择器；`||` 回退：`'.a&&Text||.b&&Text'`
- 属性自动补全：`src`/`href`/`-original` 等结尾的取值自动 urljoin（pd 场景）

### 10.2 `json:` 规则（声明式一级/搜索）

```
一级: 'json:data.list;name;pic;remark;id'
//      └列表路径   └标题 └图 └备注 └id（;后可加第6段:分类id）
```

- 路径是 `$.` 开头的 jsonpath（`$.` 可省），支持 `||` 回退
- 五段式：列表路径;标题;图片;备注;id（搜索场景第 5 段可写 `id;id2` 双段拼 id）
- 配合 `detailUrl` 时声明式一级自动给 vod_id 加 `分类$` 前缀做路由

### 10.3 选择器五段式（声明式 HTML 列表）

```
一级: 'ul&&li;h3&&Text;img&&data-src;span&&Text;a&&href'
//      列表   ;标题   ;图片           ;备注      ;id
```

### 10.4 js: 片段（复杂接口）

```js
一级: 'js:'
   + 'const res = request(MY_URL);'        // 响应文本
   + 'const d = JSON.parse(res).data;'
   + 'setResult(d.map(x => ({title: x.name, url: x.id, img: x.cover})));'
```

### 10.5 jinja2 模板（filter_url / 动态 url）

```js
filter_url: 'year={{fl.year or "all"}}&sort={{fl.sort or "all"}}',
// 也支持 cheerio.jinja2(tpl, obj) 在片段内手动渲染
```

---

## 十一、加解密与 wasm

### 11.1 aesX / desX（最常用，注意 utf8 标志）

```js
// 加密：明文入参（method 缺省 'enc'）
const ct = aesX(plainJson, key16, iv16, {method: 'enc', utf8: 1});
// 解密：base64 密文入参
const pt = aesX(ct, key16, iv16, {method: 'dec', utf8: 1});
```

| option | 说明 |
|---|---|
| `method` | `'enc'`（缺省）/ `'dec'` |
| `utf8` | **⚠️ 最重要的坑**：`utf8: 1` = 输入按 UTF-8 解析（加密明文/解密出明文都要它）；**不写 = 按 base64 解析输入**——加密明文忘写 `utf8:1` 会得到乱码密文、解密会报 Malformed UTF-8 |
| `mode` | 缺省 `'CBC'`；`'ECB'` 时 iv 忽略（ECB 场景 iv 传 `''` 或同 key 长度占位） |
| iv | CBC 必传（AES 16 字符）；缺省时 AES 取 key 前 16 字符、DES 无 iv |

需要任意模式/填充组合时直接用裸名 `CryptoJS.AES.encrypt(plain, CryptoJS.enc.Utf8.parse(key), {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})`。

### 11.2 rsaX

```js
const ct = rsaX(plain, pubKeyPem, {method: 'encode'});       // 公钥加密
const pt = rsaX(ct, privKeyPem, {method: 'decode'});         // 私钥解密
const ct2 = rsaX(longText, pubKeyPem, {method: 'encode', long: 1}); // 长文分段
// key 含 'BEGIN' 时 method 可省（自动判方向）
```

### 11.3 wasm 解密（加密视频流场景）

```js
async detail(ctx, id) {
  const mod = await ctx.lib.wasm.load(wasmBytes);   // Uint8Array 或路径
  // mod 导出即用；Runtime 级缓存，第二次调用零成本
}
```

标杆参考：demo-sources 的央视频d3（CNTV wasm TS 流解密全链）。emscripten 胶水源注意：`Module.then` 是非标准 thenable 要剥掉、`noInitialRun` 等坑在 demo 源里已处理，拿现成 worker 模板改。

---

## 十二、存储与缓存

```js
// store：实例命名空间 KV，同步 API；壳子定期快照持久化——源重装/重启后仍在
ctx.store.set('token', 'xxx');
ctx.store.get('token', '');            // 第二个参数 = 缺省值
ctx.store.delete('token');

// cache：进程内 TTL 缓存（不持久化，实例驱逐即丢），async API
await ctx.cache.set('k', v, 300);      // TTL 秒（缺省 300）
await ctx.cache.get('k');
await ctx.cache.delete('k');
```

实例态会话保持（cookie/token 自动携带）：登录成功后写 `ctx.headers['Cookie'] = ck`——实例存活期间后续所有请求自动带；配合 `meta.stateVersion` 管理状态兼容。

---

## 十三、播放链路专题（play 返回怎么选）

| 场景 | play 返回 |
|---|---|
| 直链 m3u8/mp4 | `{parse: 0, jx: 0, url: 直链, header: {...防盗链}}` |
| 网页内嵌播放器（地址是网页） | `{parse: 1, url: 网页地址}`——壳子起 WebView 嗅探真实流 |
| 需要 jx 接口解析的（正版站） | `{jx: 1, url: ...}`（缺省 tellIsJx 会自动判） |
| 磁力/ed2k/push | `{parse: 0, url: 原串}`（壳子识别特殊协议前缀） |
| 接口要现请求拿真地址 | 钩子里先 `await ctx.req(...)` 再返回 `{parse: 0, url: 真地址, header: {...}}` |
| 声明式免嗅 | `rule.play_parse: true` + `rule.lazy: 'js:...'`（片段 input 回地址或 {parse,jx,url}） |

`header` 字段会随播放下发到播放器（UA/Referer 防盗链必备）。

---

## 十四、代理专题

```js
async proxy(ctx, params) {
  // 壳子路由: http://127.0.0.1:9978/api/<siteKey>/?do=drpy3&do2=...
  if (params.do2 === 'img') {
    const res = await ctx.req(params.url, {buffer: 1});   // Uint8Array
    return [200, 'image/png', res.content];
  }
  return [404, 'text/plain', 'Not Found'];
}
```

- 返回三元组 `[status, contentType, body]` 或五元组 `[status, contentType, body, headers, toBytes]`
- 用途：图片防盗链中转、m3u8 改写、分段解密流
- 源内要拿自己的代理地址：`await ctx.getProxyUrl()`（壳子是唯一事实源，别写死 9978——不同宿主端口不同）

---

## 十五、调试与常见坑

### 15.1 日志

```js
ctx.log('解析开始', id);   // 或 print(...) / log(...)
console.log('也能用');
```
DsPlayer 中全部进 logcat，tag `flutter`，前缀 `[drpy3-console]`。手机上用 `adb logcat | grep drpy3` 或壳子的悬浮日志查看。

### 15.2 坑清单（按踩坑频率排序）

1. **aesX 忘 `utf8: 1`** → 加密出乱码 / 解密报 `Malformed UTF-8 data`（§11.1）
2. **异步钩子忘 `await`** → 拿到 Promise，字段全 undefined。dr3 全链 async，请求必须 await
3. **返回 `{}` 当空数据处理** → 壳子把 `{}` 当异常。空列表返回 `{list: []}` 或含 `no_data` 哨兵的标准分页对象
4. **vod_id 不稳定** → 列表页与详情页两次生成必须一致，否则「点进去是别的片」。别用数组下标当 id
5. **分页不终止** → 最后一页之后必须停止增长：`pg > pagecount` 时返回空 list（壳子判 `no_data`/空列表收手）
6. **so 全局缺失报 `缺少 so 全局 xxx`** → 源用了宿主没跑在 QJS so 环境（比如自定义 node 宿主），换 QJS 宿主或降级用纯 JS 方案
7. **`No crypto library available`** → 壳子版本过老（库全局未挂），升级壳子
8. **GBK 搜索乱码** → 搜索词先 `encodeStr(wd, 'gbk')`
9. **CryptoJS AES 加密返回空** → 多半输入给了 undefined（前一步 await 漏了），不是库的问题

### 15.3 「成功但全空」的自愈

壳子对「home 成功但分类/列表全空」有退避自愈重试（服务冷启动窗口场景）。源作者看到偶发的空态自动恢复不是 bug——但**持续空**就要查自己的钩子了。

---

## 十六、dr2 → dr3 迁移对照表

| dr2 写法 | dr3 对应 |
|---|---|
| `req(url, opts)`（同步返回文本） | `await ctx.req(url, opts)`（返回 `{content, headers}`）；js: 片段内 `request(url)` 仍是老语义 |
| `pdfh/pdfa/pd` 裸名 | 裸名仍可用 ✅（`pd` 缺省 base 是 `''`，片段内是 `MY_URL`；钩子里建议 `ctx.pd(h, r, url)` 显式传基准） |
| `setResult([...])` | js: 片段内可用 ✅；async 钩子里直接 `return {list: [...]}` |
| `md5/base64Encode/aesX/...` 裸名 | 裸名可用 ✅（§8.1） |
| `MOBILE_UA` 等常量 | 裸名可用 ✅；rule.headers 里写常量名也自动解析 |
| `HOST` / `RKEY` | `ctx.rule.host` / `ctx.key` |
| `fetch_params` 全局 | `ctx.fetchParams` |
| `VODS` / `VOD` / `TABS` / `LISTS` | js: 片段内可用 ✅；钩子里直接构造返回值 |
| `getCryptoJS()` | 裸名 `CryptoJS` |
| `jsp.jj(path, json)` | `ctx.jp(path, json)` |
| `input` 全局 | `ctx.input`（片段内 `input` 可用） |
| 源头 `function init() {...}` 顶层钩子 | 对象内 `async init(ctx, ext)` |
| `$.exports` / `var rule = {...}` | `export default {meta, rule, ...钩子}` |

**迁移最小动作**：老 dr2 源把顶层函数包进 `export default` 对象、全局请求改 `await ctx.req`、`init/home/...` 改 async 钩子签名——其余工具函数基本原样。

---

## 十七、完整示例（真实源精简讲解）

demo-sources 包里的 `百忙无果d3.js` 是官方推荐范本，核心骨架：

```js
export default {
  meta: {
    title: '百忙无果[官]',
    host: 'https://pianku.api.xxx.com',
    searchable: 2, filterable: 1, quickSearch: 0, multi: 1,
  },
  rule: {
    searchUrl: 'https://mobileso.bz.xxx.com/msite/search/v2?q=**&pn=fypage&pc=10',
    detailUrl: 'https://pcweb.api.xxx.com/episode/list?...&video_id=fyid',
    url: '/rider/list/pcweb/v3?...&channelId=fyclass&pn=fypage&...',
    filter_url: 'year={{fl.year or "all"}}&sort={{fl.sort or "all"}}',
    headers: { 'User-Agent': 'PC_UA' },
    class_name: '电视剧&电影&综艺&动漫',          // 静态分类 → home 零代码
    class_url: '2&3&1&50',
    filter: 'H4sIAAAA...',                       // gzip base64 筛选 → 自动解压
    一级: 'json:data.hitDocs;title;img;updateInfo||rightCorner.text;playPartId',
  },

  // 接口真正需要代码的两处才写钩子：
  async search(ctx, wd, quick, pg) {
    const res = await ctx.req(
      ctx.rule.searchUrl.replaceAll('**', wd).replaceAll('fypage', pg),
      { headers: { 'User-Agent': 'MOBILE_UA', Referer: 'https://www.xxx.com' } },
    );
    const list = [];
    for (const data of (JSON.parse(res.content).data.contents || [])) {
      if (data.type !== 'media') continue;
      const item = data.data[0];
      list.push({
        vod_id: item.url.match(/.*\/(.*?)\.html/)[1],
        vod_name: item.title.replace(/<B>|<\/B>/g, ''),
        vod_pic: item.img || '',
        vod_remarks: (item.desc || []).join(','),
      });
    }
    return { list };
  },

  async detail(ctx, id) {
    ctx.fetchParams.headers.Referer = 'https://www.xxx.com';  // 调用链会话头
    // 选集接口(JSON) + 详情页(HTML) 两段式组装 → return {list: [vod]}
    ...
  },
};
```

学习路径建议：先抄这个骨架改接口 → 遇到复杂解析看 §10 的 js: 片段 → 加密站看 §十一 → 防盗链/流处理看 §十四。demo-sources 包里有纯声明式（百忙无果）、wasm 解密（央视频d3）、多平台聚合加解密签名（七星猫短剧d3）三类标杆可直接对照。

---

## 附：能力速查（壳子需要什么版本）

| 特性 | 依赖 |
|---|---|
| §8.1 裸名工具面 / §8.2 库全局 | DsPlayer ≥ 2026-09-28 版（exposeRuntimeGlobals + 库全局挂载）；老版本只认 `ctx.*` |
| §8.3 引擎全局 | QJS so 宿主（libquickjs_bridge.so，plugin_qjs 1.0.3+） |
| wasm 解密 | 同上（原生 wasm3） |
| proxy 钩子 | 壳子网关运行时（默认开启） |
