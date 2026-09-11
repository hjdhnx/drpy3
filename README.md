# drpy3 —— 站在 drpy2 肩膀上的下一代源规则引擎

> 设计文档：[docs/drpy3-设计文档.md](docs/drpy3-设计文档.md)（唯一真相源）｜
> 执行手册：[docs/drpy3-实现任务书.md](docs/drpy3-实现任务书.md)（W0-W13 工作包 + 进度表）

drpy3 完整继承 drpy2 的设计哲学（源=爬虫、标准库沉淀、TVBox 数据结构不动摇、声明式规则优先），
并解决 drpy2 的五大结构性痛点：

| 能力 | 说明 |
|---|---|
| **消灭全局** | 实例模型 + 两层上下文（实例态/调用态），同引擎多实例并发不串数据 |
| **async/await** | 全异步 IO（档 A 原生并发 / 档 C 同步宿主自动 await 适配，源代码无感） |
| **模块化** | 源目录包：相对路径 ESM/CJS、`?bytes` 资产导入；模式 A 原生 loader / B 预打包 / C 内置 CJS shim |
| **wasm 一等公民** | `ctx.lib.wasm.load` 托管 emscripten 胶水（识别/垫片/就绪等待/按路径缓存），引擎原生 wasm 优先 |
| **drpy2 兼容层** | `rt.load2x()` 老源零改动运行（伪全局映射 + 自动串行） |

另有：实例生命周期治理（LRU/水位/signature 热更/快照复温）、工程化报错、`drpy3 test` 自测 CLI、
Agent-Native（零样板纯声明式源 + 单页契约 + 写-测-修闭环）。

## 快速开始

```bash
npm install          # 安装 esbuild（仅构建用）
npm test             # 58 个用例（六环节金标准 A/B/C + 各工作包验收）
npm run build        # 生成 dist/drpy3.js（可读单文件）+ dist/drpy3.esm.min.js（压缩）
```

## 引擎形态（drpy2.js 同款双文件用法）

```
你的目录/
├── drpy3.js                    ← 可读单文件引擎
├── drpy3-peer.js               ← peer 装载链（原生全局守卫，随包分发）
├── drpy3-globals-capture.js    ← 同上
└── drpy-core-lite.min.js       ← 库全局包（CryptoJS/jinja/模板/pako/gbkTool…）
```

```js
import { Runtime } from './drpy3.js';

const rt = new Runtime({ req, pdfh, pdfa, pd });        // HostEnv 注入（§7）
const src = await rt.load(sourceCode, { key: '_x' });
await src.init('');
const home = await src.home('');
const list = await src.search('斗罗大陆', false, 1);
```

宿主只需注入 `req / pdfh / pdfa / pd` 四项（其余能力有内置兜底，能力表 `rt.capabilities` 可查）。

## 源作者

- 零样板：`export default { meta, rule, ...钩子 }`，纯声明式源一个钩子都不用写；
- 标准库经 `ctx.lib.*`（或解构/快捷别名）使用，见设计文档 §4.5/§9；
- **自测闭环**：`node cli/drpy3-test.mjs 源.js --replay`（六环节冒烟，fixtures 离线回放）；
  看数据用 `node cli/drpy3-inspect.mjs 源.js`。
- 标杆源：[docs/百忙无果1.js](docs/百忙无果1.js)（零样板）、[docs/央视频-dr3.js](docs/央视频-dr3.js)
  （wasm 解密播放，由 drpyS 原版忠实移植）、[docs/百忙无果[官].js](docs/百忙无果[官].js)
  （drpy2 原版，经 load2x 零改动跑通）。

## 目录结构

```
src/drpy3/        引擎源码（宿主无关 ESM，唯一真相源）
  runtime.js        Runtime：HostEnv 校验/use()/capabilities
  lifecycle.js      Source 实例与生命周期治理（LRU/signature 热更/快照复温）
  context.js        两层上下文（ctx 构造与快捷别名投影）
  lib/              标准库（net/parse/crypto/text/utils/store/cache/wasm）
  rules/            字符串规则解析器 / js: 片段执行器 / 声明式默认引擎
  modules/          源装载（模式 A 原生 ESM / C 内置 CJS shim）
  compat/drpy2.js   load2x 兼容层
  errors.js         工程化报错 {stage, rule, error, hint}
cli/              Node HostEnv + 自测 CLI + 数据查看器 + 构建脚本
dist/             构建产物（drpy3.js 可读单文件 / esm.min.js / peer 链 / core-lite 库包）
docs/             设计文档、任务书、标杆源、fixtures
test/             node:test 单测（58 用例）
```

## 测试

- 金标准 A：百忙无果1（零样板）六环节；B：央视频-1（wasm 解密播放，fixtures 回放）；C：百忙无果[官]
  drpy2 原版零改动经 load2x；
- `test/helpers/mock-server.mjs` 为独立进程 mock（同步 req 会阻塞事件循环）；
- pdf 三件套复用 drpy-node 生产实现（`DRPY_HTML_PARSER` 环境变量可指定 htmlParser.js 路径，
  默认 `file:///E:/gitwork/drpy-node/libs_drpy/htmlParser.js`）。

## 许可

MIT（继承 drpy2 生态）
