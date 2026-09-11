# drpy3 实现任务书（跨会话执行手册）

> 读者：任何要实现 drpy3 引擎的新会话 agent / 开发者。
> 配套：[drpy3-设计文档.md](./drpy3-设计文档.md)（**设计唯一真相源**，本文只管"怎么干"）。
> 用法：新会话开场说"按 docs/drpy3-实现任务书.md 继续执行 W<N>"即可无缝续作。

---

## 0. 使命与边界

**使命**：实现 drpy3-core（ESM 类库 `src/drpy3/`），使三份演示稿可真实运行：
`docs/百忙无果1-4.js`（声明式/全钩子/模块化/js:片段四形态）、`docs/央视频-1-4.js`（wasm 解密/生命周期/proxy 五元组/action）。

**边界（不做）**：不做 UI；不做源安全沙箱；不做远端 require；不改 TVBox 返回结构；
不重新发明 pdfh/pdfa/pd（HostEnv 注入，参考实现见 drpy2 对接指南 §4.2）。

**铁律**：
1. 设计冲突时以设计文档为准；要改设计先改文档再改码（附录 A 记录了已否决策，禁止重提）。
2. 每个工作包（W）先写验收测试再实现；完成一个提交一个（commit 前缀 `drpy3(W#):`）。
3. 进度表（§4）用 ✅/🚧/⬜ 维护——它是跨会话的唯一进度真相源。
4. **drpy3-core 禁止任何平台专属导入**（`node:`、Deno/浏览器专属 API 等）——W0-W10 的验收虽
   在 Node 上跑，但产物必须宿主无关；CI 以 `esbuild --platform=neutral` 打包通过为准
   （凡 import 了 node: 内建即打包报错）。Node 仅是 HostEnv 的第一个实现，属于 W11。

**产物边界（先做什么后做什么）**：**W0-W10 = drpy3.js 本体**（宿主无关纯 JS ESM 库；开发验证
在 Node 上进行，但产物不含 Node 依赖）；**W11-W14 = 各运行时的 HostEnv 皮肤**（Node/QuickJS
同步桥/fjs/QuickJS Android 2026），同一份 drpy3.js 换注入即可，互不阻塞、可并行。
最终产物清单：`dist/drpy3.js`（可读可维护单文件，drpy2.js 同款双文件用法）、`dist/drpy3.esm.min.js`
（压缩单文件；两者均 peer 引用 dist/drpy-core-lite.min.js 拿库全局，`npm run build:drpy3` 产出）、
`dist/drpy3.iife.min.js`（无模块能力引擎直接 eval，未做）、`types/drpy3.d.ts`（未做）、`cli/`+`fixtures/`。

---

## 1. 仓库结构规划

```
src/drpy3/
  index.js            # 导出 Runtime/defineSource/lib
  runtime.js          # Runtime：HostEnv 校验/use()/capabilities（§7）
  lifecycle.js        # 状态机 Cold/Hot/驱逐：LRU+水位+signature 惰性热更（§4.6）
  context.js          # ctx 构造：调用态/实例投影/快捷别名（§4.2/4.5）
  lib/
    net.js parse.js crypto.js text.js utils.js store.js cache.js wasm.js
  rules/
    parseRule.js      # 字符串规则解析器（json:/jsp:/jq:/js: + 一级/二级/搜索语义）
    jsFragment.js     # js: 片段 AsyncFunction 包装 + 老名字参数化注入（§5.3）
  modules/
    loader.js         # 模式 A 原生 loader 接口 / 模式 C 内置 CJS shim（§8）
  compat/
    drpy2.js          # load2x：伪全局映射 + 串行队列（§11）
  errors.js           # 工程化报错 {stage, rule, line, error, hint}（§14.4）
  types/drpy3.d.ts    # 类型面（§14.2）
cli/
  drpy3-test.mjs      # drpy3 test 六环节冒烟 + --record/--replay（§14.3）
test/                 # node:test 单测（每 W 一个测试文件）
docs/fixtures/        # drpy3 test --record 的录制回放数据
```

依赖决策：**库全局复用 `dist/drpy-core-lite.min.js`**（CryptoJS/cheerio/模板/pako/gbkTool/
JSEncrypt/NODERSA/JSON5/jinja 是 drpy2 生态资产，不重造）；drpy3-core 以 peer 方式引用，
纯声明式/增强源经 `import 'drpy3'` 获得封装后的 `lib`。

---

## 2. 运行时对接矩阵（多样化保证）

| 运行时 | 异步档位（§5.4） | 模块模式（§8） | wasm（§6） | store 介质 | 对接顺序 |
|--------|------------------|----------------|-----------|-----------|----------|
| Node ≥22 | 档 A（原生 loop，真并发） | 模式 A（原生 ESM） | native | 文件 JSON | **第 1 个**（开发主环境） |
| QuickJS + python 同步桥（hipy 系） | 档 C（req 同步桥，功能全可用） | 模式 C shim / 预打包 | polywasm | 内存/SQLite | 第 2 个 |
| quickjs-ng | 档 A/B（job 泵） | 模式 A（JS_SetModuleLoaderFunc） | native | 宿主定 | 可选样例 |
| Flutter [fjs](https://github.com/fluttercandies/fjs) | **近档 A**：内置 Promise/timer/fetch 驱动（`JsEvalOptions.withPromise` + `drainUnhandledJobErrors`） | 模式 A 变体：`declareNewModule` 逐个注册模块 | **预计 none**（QuickJS 本体无 wasm）：polywasm 兜底，或 §12.1 性能阶梯第三级——Dart/Rust 原生解密经 bridge 注入 | shared_prefs/SQLite | 第 3 个（跨平台终态） |
| **QuickJS Android 2026**（用户自有 so + C 扩展源码，DsPlayer 系，JNI 暴露 QuickJSContext） | 档 A/B：Promise API 齐全（WebCrypto / fs.promises / WebAssembly.compile 均返回 Promise），timers"若启用事件循环"可用——pump 形态 W14 实测 | ESM + import attributes（引擎自带，待实测） | **native**：C 实现 WebAssembly 全 API（compile/instantiate/Memory/Table/validate） | **DataBase（SQLite）原生** | **R1 路线：Android 全原生能力档（能力对照见 §2.1）** |

fjs 对接要点（已核实其 Cargo.toml 与 README）：
- **底座**：QuickJS C 源码经 **rquickjs**（DelSkayn/rquickjs @0.12.1 锁 rev 04e2734）编译进 Rust
  crate `libfjs`；rquickjs 0.9+ 内嵌的是 **quickjs-ng** 分支（非 Bellard 原版仓库直引，与 AWS
  LLRT 同源——fjs 直接复用了约 30 个 `llrt_*` 模块 crate）。
- **二进制形态**：libfjs（Rust，tokio full 驱动）→ Cargokit 编译 → Android `.so` /
  iOS-macOS XCFramework / Windows `.dll` / Linux `.so`，QuickJS C 代码**静态链接**在 Rust
  动态库里，Dart 经 flutter_rust_bridge(=2.12.0) FFI 调用。
- **异步**：tokio + rquickjs futures 在 Rust 侧驱动 Promise/job（`JsEvalOptions.withPromise` +
  `drainUnhandledJobErrors`）——接近档 A；drpy3 的 ensureHot/钩子 Promise 链原生可用。
- **HostEnv 注入**：`engine.init(bridge:)` 承接全部 HostEnv 函数（JS 侧 `fjs.bridge_call` 进
  Dart），签名对齐契约即可，drpy3-core 零改动；另可直接用 LLRT 原生模块：`llrt:fetch`
  （Rust http 实现）、zlib/compression（gzip 原生）、crypto——drpy2 的 gzip/ungzip 在
  Flutter 上白得原生性能。
- **模块**：`declareNewModule` 把源文件与 `./lib/*` 依赖逐个预注册（把 §8 模式 A 的 loader
  语义平移成"宿主预注册"）；支持字节码预编译（版本绑定）→ 预打包源可进一步预编译加速启动。
- **wasm**：README 未提及（quickjs-ng 分支近年已加 wasm 支持，但 fjs 锁定的 rquickjs rev
  是否暴露 `WebAssembly` 需实测 `typeof WebAssembly` 后回填 capabilities）；按 'none' 规划：
  polywasm 兜底，或 §12.1 阶梯第三级——Dart/Rust 原生解密经 bridge 注入（推荐）。
- **内存治理**：engine 级 memoryLimit/gcThreshold 可配 → §4.6 水位信号有抓手；官方声明
  "非 hostile-code 沙箱"——与 drpy3"只做状态/故障隔离"立场一致。

### 2.1 专用运行时：QuickJS Android 2026（用户自有 so + C 扩展源码）

文档：`E:\gitwork\DsPlayer\docs\quickjs-android-api-docs.html`（引擎版本 QuickJS 2026-06-04
+ Lexbor C 解析器，JNI 暴露 `QuickJSContext`，面向 Android，源码在手）。

**能力对照（drpy3 需求 → so 原生提供 → capabilities 结果）**：

| drpy3 需求 | so 原生提供 | capabilities |
|-----------|-------------|--------------|
| pdfh/pdfa/pd 底座 | **cheerio 全局（Lexbor C 实现）**+ JS 语义包装（drpy-node htmlParser.js 适配） | native（解析快约一个量级） |
| wasm | **WebAssembly 全 API**（compile/instantiate/Memory/Table/validate，Promise 齐全） | **native**（央视频解密满速，无 polywasm） |
| store | DataBase（SQLite） | native 持久化 |
| crypto/gzip | Hash/HMAC + WebCrypto（Promise）+ zlib | native |
| joinUrl | URL/URLSearchParams | native |
| console/atob/btoa/TextEncoder/Buffer/performance | 原生注入 | native |
| 异步 | Promise API 齐全（WebCrypto/fs.promises/wasm.compile）；timers"若启用事件循环" | 档 A/B（pump 形态 W14 实测） |

**三条路线**：

- **R1（最快见效，Android 先行）**：直接对接 so——JNI 桥（Java `QuickJSContext`，或 Dart 侧
  jni/ffi 包）→ 写 HostEnv 映射层（含 pdfh 语义包装）。drpy3-core 零改动，capabilities 表
  几乎全绿，央视频全链路（wasm 解密 + C 解析）达到原生性能。
- **R2（跨平台终态）**：C 扩展源码融入 fjs 的 rquickjs 构建——Lexbor cheerio/zlib/fs/sqlite/
  atob/performance 等多为独立 C 模块，可直接编译挂为 rquickjs 全局/原生模块；**wasm 是核内
  补丁**（其 fork 为 Bellard 系日期版本，fjs 内嵌 quickjs-ng），核内补丁跨分支移植 = 深度
  专项，单列评估（若其 wasm 实为独立 C 库绑定则可直接挂）。
- **R3（兜底）**：fjs 原生 + polywasm，现在就能写，性能差。

**建议节奏**：R1 验证全链路与真实性能基线 → R3 补非 Android 平台先跑通 → R2 按模块逐步融合
（每个模块融合后 R1 与 R2 跑同一基准对比）。

---

## 3. 工作包分解（严格按序）

| WP | 内容 | 设计依据 | 验收（可执行） | 状态 |
|----|------|----------|----------------|------|
| W0 | 工程脚手架：`src/drpy3/` 骨架 + node:test 基建 + 复刻 `.smoke/` 为 `test/smoke.mjs`（附录 C 六环节，跑 drpy2 当回归锚） | 附录 C | `node --test test/` 通过（空壳+锚点用例） | ⬜ |
| W1 | Runtime/HostEnv：构造期校验、use() 覆盖、能力查找顺序、capabilities | §7 | 单测：缺注入打印清单；use 覆盖生效；三层查找顺序正确 | ⬜ |
| W2 | ctx 与生命周期：defineSource/纯对象判定/ctx 构造/this 绑定/并发契约/headers 基线/resumed | §4.2-4.5 | 单测：同源双实例对拍不串数据；钩子 this=实例；ctx 快捷别名=lib 投影 | ⬜ |
| W3 | 生命周期治理：LRU+水位驱逐、signature 惰性热更、headers 快照恢复、in-flight 排空 | §4.6 | 单测：驱逐后排空；改源内容→下次调用重建；快照恢复置 resumed | ⬜ |
| W4 | 标准库 net/utils/store/cache：req 适配（同步宿主自动 await）、all、batchFetch 兜底、getProxyUrl | §9 net | 单测：mock req 下 all/batchFetch 语义（按序对齐/单项失败不中断） | ⬜ |
| W5 | 标准库 parse/crypto/wasm：parseRule、pdfl 回退、jp/jinja2/模板接入、ungzip、wasm.load（含 emscripten 垫片接口） | §9/§6 | 单测：'json:...' 规则解析；wasm.load 缓存命中 | ⬜ |
| W6 | 规则引擎 + js: 片段：一级/二级/搜索/lazy 语义 + 老名字参数化注入 + 工程化报错 | §5.3/§9/§14.4 | **里程碑**：百忙无果1.js 六环节跑通（对照附录 C 金标准） | ⬜ |
| W7 | proxy 五元组 + action 通道 | §10.1/§10.2 | 单测：toBytes 1/2/3 分支路由；action 超时与返回透传 | ⬜ |
| W8 | 模块化：CJS shim + 原生 loader 接口 + esbuild `drpy3 build` | §8 | 百忙无果3.js（依赖 ./lib）三模式均可跑 | ⬜ |
| W9 | 兼容层 load2x：伪全局映射 + 串行队列 | §11 | **金标准**：`docs/百忙无果[官].js` 零改动六环节通过 | ⬜ |
| W10 | `drpy3 test` CLI：六环节 + record/replay + 结构化报错 | §14.3 | 百忙无果1-4 与央视频-1/2 全部 test 全绿（fixtures 录制） | ⬜ |
| W11 | 运行时对接：Node 完全体（fetch+cheario+fs store，档 A 真并发） | §5.4 | 并发基准：多请求墙钟 ≤ 串行 50% | ⬜ |
| W12 | 运行时对接：QuickJS 同步桥（档 C；python 或 quickjs 绑定） | §5.4 档C | 百忙无果1 六环节在 QuickJS 内跑通 | ⬜ |
| W13 | 运行时对接：Flutter fjs（bridge 注入 HostEnv + declareNewModule 模块 + polywasm/原生解密决策） | §5.4/§8/§12.1 | 央视频-1 六环节在 fjs 模拟器跑通；capabilities.wasm 报告正确 | ⬜ |
| W14 | 运行时对接：QuickJS Android 2026（R1 路线，§2.1）——JNI/FFI 桥 + HostEnv 全原生映射 + pdfh 语义包装 + 事件循环 pump 实测 | §2.1 | 央视频-1 在 Android 真机跑通且 capabilities.wasm='native'；与 fjs+polywasm 跑同一解密基准对比 | ⬜ |

依赖链：W0→W1→W2→W3→(W4,W5)→W6→(W7,W8,W9)→W10→(W11,W12,W13,W14 可并行)。

---

## 4. 进度表（跨会话唯一真相源）

> 完成一个 WP：把 ⬜ 改 ✅（部分完成 🚧 并注明余项），随该 WP 的 commit 一起提交。

- W0 ✅ ｜ W1 ✅ ｜ W2 ✅ ｜ W3 ✅ ｜ W4 ✅ ｜ W5 ✅ ｜ W6 ✅
- W7 ✅ ｜ W8 ✅ ｜ W9 ✅ ｜ W10 ✅ ｜ W11 ⬜ ｜ W12 ⬜ ｜ W13 ⬜ ｜ W14 ⬜

> W0 备注：`src/drpy3/` 骨架 + `test/smoke.test.mjs`（drpy2 附录 C 六环节回归锚，独立进程 mock
> 复刻自 .smoke/ 并扩展了央视频形状）。本机（Git Bash）`node --test test/` 目录参数有兼容问题，
> 验证命令用 `node --test test/*.test.mjs`（bash 展开）。
>
> **W0-W10 会话完成注记（2026-09-12）**：三个金标准全绿——A 百忙无果1（test/w6-bm1.test.mjs）、
> B 央视频-1 六环节 + wasm 代理解密（test/w10-cntv1.test.mjs）、C 百忙无果[官] 原版零改动经
> load2x（test/w9-load2x.test.mjs）；六标杆源 `drpy3 test --record/--replay` 全绿，fixtures 入库
> docs/fixtures/。产物 `dist/drpy3.esm.min.js`（esbuild --platform=neutral 通过，npm run build:drpy3）。
> 实现注意：① core-lite 的 polywasm/node-fetch 覆盖全局 → src/drpy3/lib/peer.js + native-globals.js
> 装载守卫恢复原生全局（Node undici 依赖原生 WebAssembly）；② js: 片段内 request() 为 drpy2 老语义
> （返回响应文本，withHeaders 为 JSON 串）；③ load2x 需宿主注入 syncReq 同步桥（Node 用 curl 子进程）；
> ④ 模式 C 需同步 loadAsset。余项（非阻塞，W11-W14 对接时按需补）：对象形态二级 tabs/lists 完整
> 语义、fixAdM3u8Ai、getOriginalJs/OcrApi、types/drpy3.d.ts、GBK 搜索编码。
>
> **补充契约决策（2026-09-12，live 真网实测驱动，经项目主修正）**：vod_id 透传规则为**对称往返、
> 按需剥离**——源声明 `rule.detailUrl`（声明式路由，分类时引擎加「分类$」，附录 C 的 3$vid1 形状）
> → 引擎剥除自己加的前缀再进二级（drpy2 `detail()` 同语义往返）；源无 detailUrl（drpyS 式，如
> 央视频的 ### 拼装）→ vod_id 属源自有任意文本，**引擎原样透传不加工**。vod_id 原始全文经第二参
> 供声明式 defaults 还原。live 模式六环节实测：真网分类 80 条 → detail 101 集真实选集 → play
> 真实链接全 PASS（search 因真站 v2 接口加验为 0 条，属站点层漂移，CLI 以 search/category 兜底）。

> **央视频真实源移植（2026-09-12）**：`docs/央视频-dr3.js` 为 `docs/央视频.js`（drpyS 原版 1099 行）
> 的忠实 dr3 移植——同端点同参数同 guid 格式（栏目表预取/直播频道/栏目大全/点播专辑/搜索/播放
> 质量线/proxy TS 解密 + m3u8 重写全量保留），静态配置经 test/helpers/extract-cntv-config.mjs
> 程序化提取（零手抄）。live 实测：init 栏目表 4 页真实数据 / 分类 30 条真实专辑 / detail 30 集 /
> play 真实 cntv CDN 地址 / proxy m3u8 重写 553 行全通；TS wasm 解密代码路径已触达，但真实胶水为
> pthread/worker 构建，纯 Node 垫片下初始化会等待（原版同样需真壳环境），留待 W13/W14 原生宿主。
> wasm.load 增强：识别脚本形态胶水（挂 globalThis 的工厂）、native-globals 补 Uint8Array.fromBase64
> 垫片（新版 emscripten 解码内嵌 wasm 依赖）、同步就绪快路径与非标准 then 适配。
> 注意：`docs/央视频-1/2.js` 为设计阶段演示稿（解密与取参有省略），不能当真源用——真源以
> 央视频-dr3.js 为准。

---

## 5. 新会话工作法（给 agent 的纪律）

1. **必读顺序**：设计文档 §0-§4（模型）→ §7（注入）→ §9（标准库）→ 本任务书；§5/§6/§8/§10-§15
   按所在 WP 查阅。演示稿 `docs/百忙无果1-4.js`、`docs/央视频-1-4.js` 是 API 的**可执行规范**
   ——实现必须让它们原样跑通，不得改动演示稿来迁就实现。
2. **先测后码**：每个 WP 先把"验收"列翻译成 node:test 用例（先红后绿）。
3. **金标准不可妥协**：W6 百忙无果1、W9 原版百忙无果[官].js、W10 央视频-1——这三个跑不过
   就是不完成，没有"基本能用"。
4. **防跑偏**：附录 A 是已否决策清单（全 native 化/纯配置化 DSL/全局注入回归/把全局名挂回
   globalThis……）；提议与之冲突时先停下向用户说明。
5. **fjs 专项注意**（W13）：其 QuickJS 无原生 wasm（以实测为准，跑 `typeof WebAssembly` 探测
   后回填 capabilities）；异步靠内置驱动，宿主桥只需对齐 HostEnv 契约；模块用 declareNewModule
   预注册而非 loader 回调。
6. **跨会话续作**：本文件 §4 进度表 + git log（`drpy3(W#):` 前缀）即是断点；开场白模板：
   "读 docs/drpy3-实现任务书.md，从进度表第一个 ⬜ 的 WP 继续"。
