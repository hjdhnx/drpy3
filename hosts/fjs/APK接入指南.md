# drpy3 × fjs：APK 集成执行指南

> **读者**：负责把 drpy3 源运行时集成进 Flutter App（Android APK）的 agent / 开发者。
> 本文档自包含——不要求读过 drpy3 设计文档或任何对话上下文，照做即可跑通。
> 集成对象：drpy3 仓库 `hosts/fjs/` 套件。已验证状态：Windows 真机（真实 fjs 引擎）六环节全绿 + Node CI 59/59 全绿。
> 进阶契约（proxy 五元组 / action 通道 / sniffer / 生命周期细节）见 `docs/宿主对接指南.md`。

**执行顺序建议**：读完 §1 → 按 §2 接依赖 → §4 环境检查 → §3 最小代码接入一个测试源 → §7 验收清单逐项打勾 → 按需做 §5/§6 的定制。

---

## 1. 30 秒理解架构

```
Dart UI（你的 App）
  │  Drpy3Host.callSource(key, 'category', [...])          ← async Future，不卡 UI
  ▼  engine.call('drpy3', 'drpy3Call', [key, method, JSON字符串])   ← flutter_rust_bridge 进 QuickJS
  │
  │  ┌───────────── QuickJS 引擎（fjs 提供，全部 JS 自包含）─────────────┐
  │  │ drpy3-fjs.bundle.js = drpy3 引擎 + peer 守卫链 + 库包             │
  │  │   （CryptoJS/jinja2/jsonpathplus）+ cheerio pdf 四件套 + 胶水     │
  │  │ 源.js 在这里被装载执行，六环节逻辑全在 JS 侧完成                  │
  │  └──────────────┬──────────────────────────────────────────────┘
  │                 │ 唯一开口：HostEnv.req → fjs.bridge_call
  ▼                 ▼
Dart 桥回调（req/loadAsset/getProxy/evalModule 四个 action）
  │  默认实现 Drpy3IoHandlers：dart:io HttpClient（零三方依赖）
  ▼
网站
```

要点：

- **JS 侧自包含**：解析（jsoup 语义四件套）、加密（CryptoJS）、模板、jsonpath 全在 bundle 里，Dart 侧**不需要**任何 HTML 解析 / 加密依赖。
- **Dart 只出两样东西**：网络（req 桥）和持久化（store 快照存盘）。默认实现已给全，可整体替换（§5.5）。
- **桥上只有四个 action**，值全部走 JSON 字符串边界（规避 JsValue 深层转换边角，错误结构化透传）。
- **异步档 A**：fjs 内部自动泵 Promise/timer，真并发，无需任何手动驱动。
- **实测能力**：`capabilities.wasm = native`（quickjs-ng 带 WebAssembly，wasm 解密类源可直接跑）。

## 2. 集成方式 A：包依赖（推荐）

### 2.1 你的 app 的 `pubspec.yaml` 只加一行依赖

```yaml
dependencies:
  drpy3_fjs_host:
    git:
      url: https://github.com/hjdhnx/drpy3.git
      path: hosts/fjs
```

fjs 引擎、flutter_rust_bridge 版本钉制**已由宿主包内部处理**（fjs 锁 commit `8195d78` = v3.3.0；frb 钉 2.12.0），你的 app 不需要重复声明，也不要用 `dependency_overrides` 动它们。

### 2.2 注册资产（无需操作）

bundle 已是宿主包的打包资产，包依赖方式下 App 自动可用，资产路径为
`packages/drpy3_fjs_host/assets/drpy3-fjs.bundle.js`（`createWithAsset` 默认值，不用手写）。

### 2.3 最小可用代码（可直接抄）

```dart
import 'package:drpy3_fjs_host/drpy3_host.dart';

/// 全 app 单例：一个引擎承载全部源（引擎内建 LRU/水位自动管理多源实例）
class Drpy3 {
  static Drpy3Host? _host;

  static Future<Drpy3Host> _get() async {
    if (_host != null) return _host!;
    // 启动时先灌回上次退出前导出的 store 快照（可选，见 §5.1 持久化）
    _host = await Drpy3Host.createWithAsset(
      fjsVersion: 'myapp-1.0',
      handlers: Drpy3IoHandlers(), // 默认网络实现；定制见 §5.5
    );
    return _host!;
  }

  /// 示例：装载源 + 六环节
  static Future<void> demo(String sourceCode) async {
    final host = await _get();
    await host.storeImport(lastSavedDumpJson);            // 可选：恢复 KV 快照
    await host.loadSource(sourceCode, '_mysite');          // key 全局唯一即可
    await host.callSource('_mysite', 'init', ['']);
    final home = await host.callSource('_mysite', 'home', ['']);
    // home = {class: [{type_id, type_name}], filters: {...}} → 渲染分类页签与筛选
    final cate = await host.callSource('_mysite', 'category', ['3', 1, false, {}]);
    // cate = {page, pagecount, limit, total, list: [vod]} → vod_id 直接透传给 detail
  }

  /// App 退出 / 源批量更新时
  static Future<void> shutdown() async {
    final h = _host;
    if (h == null) return;
    final dump = await h.storeExport();                    // ⚠️ 必须 close 前导出
    await saveToDisk(dump);                                // shared_preferences / 文件自选
    await h.close();
    _host = null;
  }
}
```

### 2.4 错误处理

六环节失败抛 `Drpy3Exception`，**取结构化字段**（勿裸抛引擎栈）：

```dart
try {
  final detail = await host.callSource(key, 'detail', [vodId]);
} on Drpy3Exception catch (e) {
  // e.stage（失败环节）、e.error（信息）、e.hint（引擎内置修复建议）、e.rule（源规则名）
  logger.warning('drpy3 ${e.stage} 失败: ${e.error} hint=${e.hint}');
}
```

## 3. 集成方式 B：直接拷文件（不想引包依赖时）

1. 拷两个文件进你的 app：
   - `hosts/fjs/lib/drpy3_host.dart` → `lib/drpy3/drpy3_host.dart`
   - `hosts/fjs/assets/drpy3-fjs.bundle.js` → `assets/drpy3-fjs.bundle.js`
2. 你的 app `pubspec.yaml` 补依赖与资产（版本必须照抄，原因见 §6 红线 1/2）：

```yaml
dependencies:
  fjs:
    git:
      url: https://github.com/fluttercandies/fjs.git
      ref: 8195d78bc0335045fd62bcf4835c3e889b54c77b # v3.3.0
  flutter_rust_bridge: 2.12.0   # fjs 3.3.0 生成代码带 codegen 版本检查，2.13 会拒载

flutter:
  assets:
    - assets/drpy3-fjs.bundle.js
```

3. 装配时传自定义资产路径：`Drpy3Host.createWithAsset(assetPath: 'assets/drpy3-fjs.bundle.js')`。

> **不要手工编辑 bundle**。它是 `node hosts/fjs/tools/build.mjs` 的产物（需 Node 22 + drpy3 仓库 `npm i`），
> 与胶水/引擎版本绑定；改了引擎或胶水后重跑该命令再同步文件。

## 4. 构建环境（Windows 构建 Android APK）

fjs 的 Rust 静态库由 cargokit 在 `flutter build` 时**从源码现场编译**（不依赖任何预编译 release），因此构建机需要：

| 依赖 | 要求 | 说明 |
|---|---|---|
| Flutter / Dart | ≥ 3.24 / ≥ 3.5 | fjs 3.3.0 的工具链底线 |
| Rust stable | ≥ 1.95（`rustup update stable`） | `cargo` 必须在 PATH；cargokit 自动选 rustup 工具链 |
| LLVM（libclang） | 任意新版 | rquickjs 的 bindgen 依赖 `libclang.dll`。`winget install LLVM.LLVM`，然后设**系统级**环境变量 `LIBCLANG_PATH=C:\Program Files\LLVM\bin`（必须系统级——gradle 守护进程要能读到，设完重启终端/IDE） |
| Android SDK/NDK/CMake | Android Studio 标准安装 | Gradle 8/9 均兼容（fjs 3.3.0 已修复 Gradle 9） |
| minSdk / ABI | 无需调整 | cargokit 底线 minSdk 21；按 arm64-v8a / armeabi-v7a / x64 自动分别编译 |

首次构建会下载约 400 个 Rust crate 并编译三份 ABI（10–20 分钟），之后有增量缓存。CI 上注意把 `%USERPROFILE%\.cargo` 与 pub cache 纳入缓存。

**Windows 专属坑（pub-cache 是 junction 重定向的机器）**：若 `C:\Users\<你>\AppData\Local\Pub\Cache` 是指向别处的 junction（如 `E:\MovedCaches\pub-cache`），cargokit 的 symlink 解析会产出不存在的假路径，报 `MSB8066`。解法：在 **app 工程**放 `pubspec_overrides.yaml`（不提交）：

```yaml
dependency_overrides:
  fjs:
    path: <fjs 本地真实检出路径>          # git clone https://github.com/fluttercandies/fjs
  drpy3_fjs_host:
    path: <drpy3 仓库>\hosts\fjs
```

构建验证：`flutter build apk --release`，或接真机 `flutter run`。

## 5. App 侧完整参考

### 5.1 生命周期与持久化

- **单例**：全 app 一个 `Drpy3Host`。引擎常驻，多源实例由引擎自动治理（空闲 120s / maxHot 16 / 内存水位自动驱逐，有在途调用的实例不驱逐）。
- **store 持久化**：源的 KV（`ctx.store`）活 在 JS 侧，`close()` 即丢。流程固定为：**退出/切后台前 `storeExport()` → 存盘；启动 `create` 后 `storeImport(dump)`**。值必须 JSON 可序列化。
- **后台错误排空**：未 catch 的定时器/Promise 错误会排队，建议定时（如每 30s）调 `host.drainUnhandledJobErrors()` 收集上报。
- **退出**：直接 `close()`（即时取消语义，在途操作收 cancelled）；只有"必须把手头任务做完"才用底层 `closeGracefully()`（当前未透出，需要再加）。
- **源热更/批量换源**：fjs 的动态模块不可替换，源代码更新后最简单的正确做法是**重建宿主**（§2.3 的 `shutdown()` → 重新 `createWithAsset` → 重新 `loadSource`；bundle 重求值约几百毫秒，可接受）。

### 5.2 六环节调用签名（`callSource(key, method, args)`，args 按位 JSON 序列化）

| method | args | 返回（TVBox 结构） |
|---|---|---|
| `init` | `[extend]`（`''` 或筛选透传对象） | 无返回（`null`） |
| `home` | `['']` | `{class:[{type_id,type_name}], filters}` |
| `homeVod` | `['']` | `{list:[vod]}`（首页推荐，源可选实现） |
| `category` | `[tid, pg, filter布尔, extend对象]` | `{page,pagecount,limit,total,list:[vod]}` |
| `search` | `[wd, quick布尔, pg]` | 同 category；源无搜索时返回 `{}` 合法 |
| `detail` | `[vod_id]` | `{list:[vod]}`；`vod_play_url: '第1集$url1#第2集$url2$$$线路2…'` |
| `play` | `[flag, id, flags数组]` | `{parse:0/1, jx, url}` 或 `{parse:0, urls:[线路,url,…], header}` |
| `action` | `[action, value]` | 字符串提示或播放结构（源内交互通道） |

`vod_id` 按 category/detail 返回的原样透传即可（含 `分类$id` 前缀的加工/剥除引擎自动做）。
`parse:1` 表示地址待嗅探/需要 App 侧网页解析——这是壳子播放器的事，不在本套件范围。

### 5.3 源的分发与装载形态（重要，决定你能不能跑某个源）

| 源形态 | 判别 | fjs 上能否跑 | 处理 |
|---|---|---|---|
| 无 import 的 drpy3 源（声明式 `{meta,rule}` 或 `defineSource` 式） | 源码无 `import '...'` | ✅ 直接 `loadSource` | 引擎自动剥掉 bare `import … from 'drpy3'` |
| 带**相对** import 的源（`import './lib/xx.js'`） | 源码有相对路径 import | ⚠️ 需预打包 | 发布端跑 `node cli/drpy3-build.mjs 源.js -o 源.bundle.js`（esbuild 内联全部相对模块），产物照常 `loadSource` |
| drpy2 老源 | 源码含 `var rule =` 或 `lang:'dr2'` | ❌ 不支持 | **分发端过滤掉**（fjs 档 A 无同步 HTTP 原语，load2x 兼容层跑不了） |

源代码来源随意（内置 assets / 服务端下载 / 用户导入），`loadSource(code, key)` 只认字符串。同一 `key` 重复 load 会替换实例（用于 extend 变化后的重初始化）。

### 5.4 UI 对接速查

- `home.class` → 底部分类页签；`home.filters[tid]` → 该分类的筛选面板（连动 `category` 的 `extend`）。
- `category.list` → 海报网格；`vod_name/vod_pic/vod_remarks` 直接绑 UI。
- `detail.list[0]` → 详情页；`vod_play_from` 按 `$$$` 拆线路，`vod_play_url` 按 `$$$` 拆线路、按 `#` 拆集、每集 `名称$url`。
- `play` 返回 `url` 直接喂播放器；`header` 有值时作为播放请求头（Referer/UA 防盗链场景常见）。

### 5.5 定制网络（Drpy3BridgeHandlers）

默认 `Drpy3IoHandlers` 覆盖绝大多数站点。出现以下情况才整体替换（实现抽象类，传入 `createWithAsset(handlers: …)`）：

| 场景 | 换法 |
|---|---|
| gbk/gb2312 站点乱码 | Dart 内置仅 utf8/latin1——挂 `charset_converter` 包按 charset 解码 |
| 需要全局 Cookie 持久化 / 抓包代理 / 统一 UA | 在 `req` 实现里包一层 |
| 源带 wasm/本地资产（`loadAsset`） | 默认返回空（capabilities.loadAsset=missing）；有需求时从文档目录读文件返回 `String` 或 `Uint8List` |
| 自有本地代理（`getProxy`） | 返回壳子代理地址；缺省引擎兜底 `http://127.0.0.1:9978/proxy?do=js` |

`req` 契约（options 入参 / 返回结构）与 Node 参考宿主逐字一致，字段表见 `docs/宿主对接指南.md` §2.1。
`evalModule` **不要**自己实现——Dart 侧已内置 `declareNewModule` 完成模式 A 装载。

## 6. 踩坑红线（agent 逐条确认）

1. **flutter_rust_bridge 必须 2.12.0**——fjs 3.3.0 生成代码带 codegen 版本 sanity check，2.13.x 直接拒载（`_sanityCheckCodegenVersion` 异常）。宿主包已钉，勿 override。
2. **`LibFjs.init()` 时序**——必须先于 `JsEngine.create`。`Drpy3Host.create` 内部已处理，**不要绕过 Drpy3Host 自己 new 引擎**。
3. **req 不要改用 fjs 内置 fetch**——drpy3 契约需要 charset 协商 / buffer 语义 / 出错不抛（返回 `{content:'', headers:{error}}`）的控制权，llrt fetch 给不了。
4. **store 值 JSON 可序列化**；**close 前 export**（close 即丢）。
5. **fjs 模块不可替换**——源热更 = 重建宿主；带相对 import 的源必须发布端预打包（§5.3）。
6. **drpy2 老源不支持**——分发端按 §5.3 特征过滤，不要等运行时报错。
7. **Windows junction pub-cache** → `MSB8066` 假路径 → §4 的 `pubspec_overrides.yaml` 解法。
8. **POST 遇 30x 不自动跟随**（dart:io 只自动跟随 GET/HEAD）——默认实现与 Node 参考宿主的已知差异，金标源未踩到；若某源搜索是 POST+302 再补手动跟随。
9. **线程/并发**：所有 Drpy3Host 方法是 async，引擎跑在独立 Rust 执行器上，不卡 UI 线程；同一源的高频调用建议调用方自行 await 串行。
10. **升级 fjs 版本** = 三件事一起做：改 pubspec ref → 重跑两套测试（§7）→ 核对 fjs CHANGELOG 的 BREAKING（3.2.0 起 close 语义、3.0.0 起 JsError 类型都变过）。

## 7. 验收清单（照此逐项打勾）

- [ ] `flutter build apk --release` 成功（首建含 Rust 编译，见 §4）
- [ ] 装载后能力表正确：`capabilities()` 返回 `req/pdfh/pdfa/pd/pdfl = host`、`store = host`、`wasm = native`
- [ ] 用一个声明式 drpy3 源（无 import）跑通：`init` → `home`（有 class）→ `category`（list 非空，`vod_id` 带前缀）→ `detail`（`vod_play_url` 非空）→ `play`（有 `url` 或 `urls`）
- [ ] `search` 正常（源无搜索时返回 `{}` 也算过）
- [ ] 故意断网调一次 `category`：不崩溃、`Drpy3Exception` 有 stage/error
- [ ] `storeExport` → 杀进程 → 重启 `storeImport` → 源内 KV 可读
- [ ] 回归（可选但推荐）：
  - `cd drpy3 && npm test` → 59/59（Node 侧 bundle+桥协议）
  - `cd drpy3/hosts/fjs && flutter test integration_test/smoke_test.dart -d windows` → All tests passed（真实 fjs 引擎六环节）

## 8. 文件与文档索引

| 路径 | 作用 |
|---|---|
| `hosts/fjs/lib/drpy3_host.dart` | Dart 宿主类（本指南 §2/§3 引入的就是它） |
| `hosts/fjs/assets/drpy3-fjs.bundle.js` | 引擎+库包+胶水的单文件 ESM（预生成，随包分发） |
| `hosts/fjs/glue.mjs` | JS 胶水源（bridge→HostEnv→Runtime→六环节；改它后需重跑 tools/build.mjs） |
| `hosts/fjs/tools/build.mjs` | bundle 重打包脚本（Node 22，仓库根 `npm i` 后执行） |
| `hosts/fjs/integration_test/smoke_test.dart` | 真机六环节验收（最完整的调用示例代码） |
| `hosts/fjs/README.md` | 套件速览与已知限制 |
| `docs/宿主对接指南.md` | drpy3 宿主契约唯一规范（req 字段表 / 六环节返回结构 / 自检清单） |
| `types/drpy3.d.ts` | 六环节返回结构的完整 TS 类型（UI 对接照抄字段） |
