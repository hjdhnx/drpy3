# drpy3 × fjs 宿主（Flutter）

> **要把这套东西集成进你的 App（APK）？直接看 [APK接入指南.md](APK接入指南.md)**——面向执行 agent 的自包含交接文档（依赖引入 / 构建环境 / 最小代码 / 源分发形态 / 踩坑红线 / 验收清单）。

drpy3 引擎在 [fjs](https://github.com/fluttercandies/fjs)（Rust QuickJS + flutter_rust_bridge）
上的宿主实现——**异步档 A**（fjs 内部驱动器自动泵 Promise/timer，原生真并发 IO）。
对应设计文档对接矩阵 §2「Flutter (fjs)」行、任务书 W13、宿主对接指南 §5/§6。

```
drpy3 源.js ──rt.load──▶ 引擎(bundle 内) ──req──▶ fjs.bridge_call ──▶ Dart HttpClient ──▶ 网站
   ◀── TVBox 结构(JSON) ── 六环节 ──▶                    ◀── {content, headers} ──┘
```

## 文件清单

| 文件 | 说明 |
|---|---|
| `glue.mjs` | JS 胶水源：bridge → HostEnv → Runtime → 六环节 JSON 入口 |
| `tools/build.mjs` | esbuild 打包：引擎 + peer 链 + 库包 + cheerio pdf 四件套 + 胶水 → 单文件 ESM |
| `assets/drpy3-fjs.bundle.js` | 打包产物（已提交；改引擎/胶水后 `node tools/build.mjs` 重新生成） |
| `lib/drpy3_host.dart` | Dart 宿主类：引擎装配、bridge 分发、`dart:io` HttpClient req（零三方依赖） |
| `integration_test/smoke_test.dart` | 真实 fjs 引擎六环节验收（百忙无果1，含本地 mock server） |
| `pubspec.yaml` | Flutter 包（依赖 `fjs` git 版） |

pdf 四件套（pdfh/pdfa/pd/pdfl）在 **JS 侧 bundle 内**实现——与 Node 参考宿主
`cli/htmlParser.js` 逐字同源（cheerio 版），Dart 侧不需要任何 HTML 解析器。

## 快速接入

```bash
# 1) 把 hosts/fjs 作为包引入你的 app（git 依赖或直接拷贝目录）
# 2) pubspec.yaml:  assets: [ 'assets/drpy3-fjs.bundle.js' ]（或经本包间接引用）
```

```dart
final bundle = await rootBundle.loadString('assets/drpy3-fjs.bundle.js');
final host = await Drpy3Host.create(
    bundleSource: bundle,
    handlers: Drpy3IoHandlers(proxyAddress: () => myLocalProxy));

await host.storeImport(lastSessionDump);          // 可选：恢复上次 store 快照
await host.loadSource(sourceCode, '_mysite');      // 装载源（drpy3 新源）
await host.callSource('_mysite', 'init', ['']);
final home = await host.callSource('_mysite', 'home', ['']);
// home / category / search / detail / play 返回 TVBox 结构 Map；
// 源内异常抛 Drpy3Exception（stage/error/hint 结构化字段，勿裸抛引擎栈）
```

桥处理器可整体替换（实现 `Drpy3BridgeHandlers`）：如 req 换带 cookie 持久化的实现、
`loadAsset` 读应用文档目录的 wasm 资产、`getProxy` 返回壳子本地代理地址。

## 桥协议（fjs.bridge_call 消息）

| action | 入参 | 返回 | 缺省行为 |
|---|---|---|---|
| `req` | `{url, options}`（宿主对接指南 §2.1） | `{content, headers}`（buffer:1→bytes） | 必需，无兜底 |
| `loadAsset` | `{path}` | 文本 / bytes | 空（capabilities.loadAsset=missing） |
| `getProxy` | `{isPublic}` | 地址字符串 | 引擎兜底 `127.0.0.1:9978` |
| `evalModule` | `{code, path}` | 模块名 | 报错（源带模块能力时才触发） |

store 不走桥（引擎 store 契约是同步介质）：进程内 Map + `storeExport/storeImport`
快照通道实现跨重启持久化（值须 JSON 可序列化）。

## 验证

```bash
npm test                                        # Node 侧：同一 bundle + bridge 模拟（CI 稳定）
node hosts/fjs/tools/build.mjs                  # 改引擎/胶水后重新打包
cd hosts/fjs && flutter test integration_test/smoke_test.dart -d windows   # 真实 fjs 引擎
```

宿主对接指南 §7 自检清单对照：1-8（六环节最小对接）✅ 两套验证全绿；
9（req buffer/withHeaders）由引擎层单测覆盖 ✅；10（batchFetch）引擎 req+Promise.all 兜底 ✅；
11（store 跨重启）快照通道 ✅（值须 JSON 可序列化）；12（load2x）❌ 见下；
13（proxy 五元组）/14（生命周期）引擎层契约，宿主侧随六环节间接覆盖。

## 已知限制（均源于 fjs 引擎形态，接入前必读）

1. **wasm = native（实测）**：fjs 内置的 quickjs-ng 带 WebAssembly，
   `capabilities.wasm` 实测报 `native`，wasm 解密类源可直接跑（Windows integration test 验证）。
2. **drpy2 老源不支持**：load2x 兼容层需要同步 HTTP 桥（`syncReq`），fjs 档 A
   的 JS 沙箱内没有同步网络原语。drpy3 新源不受影响。
3. **模块不可替换**：fjs 的动态模块一经加载无法清除。含相对 `import` 的源推荐
   **模式 B 预打包**（`node cli/drpy3-build.mjs 源.js`）后装载；确需 evalModule 热更时
   必须重建引擎（`Drpy3Host.close` 后重新 `create`）。
4. **非 latin1/utf8 编码**：`Drpy3IoHandlers` 默认按响应头 charset 解码，
   Dart 内置仅支持 utf8/ascii/latin1——gbk 站点请替换 handlers（如挂 charset_converter）。
5. **fjs 非沙箱**：bundle 与源码均为受信输入（fjs 官方立场），勿加载不可信来源的源。
6. **Windows + fjs git 依赖的 cargokit 坑**：pub cache 若位于 junction 重定向目录
   （如 `Pub\Cache → E:\MovedCaches\pub-cache`），cargokit 的 symlink 解析可能产出失效路径
   （MSB8066：`run_build_tool.cmd 找不到`）。解法：用 `pubspec_overrides.yaml` 把 fjs 指向
   本地真实检出（该文件不提交），或 `flutter clean` 后重试。另需 rustc ≥1.95 与
   `LIBCLANG_PATH`（rquickjs bindgen 依赖 libclang，`winget install LLVM.LLVM` 即可）。
