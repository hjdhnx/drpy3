# AGENTS.md — drpy3 仓库协作须知

## 本仓库是什么

drpy3 的专属仓库：下一代 drpy 源规则引擎（从 drpy-webpack 仓库独立而来）。
`src/drpy3/` 为引擎源码（宿主无关 ESM），`cli/` 为 Node HostEnv 与工具，`docs/` 为设计文档与标杆源。

## 必读顺序

1. AGENTS.md（本文件）
2. `docs/drpy3-实现任务书.md` —— 执行手册：W0-W13 工作包、§4 进度表（跨会话真相源）、§5 工作法纪律
3. `docs/drpy3-设计文档.md` —— 设计唯一真相源（附录 A = 已否决决策清单，禁止重提）
4. `docs/drpy2-移植对接指南.md` —— drpy2 契约参考（load2x 兼容层基准）

## 关键事实

- **源码唯一真相源是 `src/drpy3/**`**；`dist/drpy3.js`、`dist/drpy3.esm.min.js`、
  `dist/drpy3-peer.js`、`dist/drpy3-globals-capture.js` 是构建产物（`npm run build` 生成），勿手改。
- **`dist/drpy-core-lite.min.js` 是 peer 库包**（CryptoJS/jinja/模板/pako/gbkTool…），
  引擎经 peer 装载链（drpy3-peer.js → drpy3-globals-capture.js）引用，随仓库分发，勿重造勿替换。
- **铁律：src/drpy3/** 禁止任何平台专属导入**（node: 等）——`npm run build`（esbuild
  --platform=neutral）通过为准。Node 专属代码只允许在 `cli/` 与 `test/`。
- **演示稿是可执行规范**（docs/百忙无果1-4.js、央视频-dr3.js 等），不得修改演示稿迁就实现。
  `docs/央视频-1/2.js` 为设计阶段演示稿（有省略），真源以 `docs/央视频-dr3.js` 为准。
- **测试纪律**：`npm test`（node --test test/*.test.mjs，当前 58 用例）。pdf 三件套（pdfh/pdfa/
  pd/pdfl）为仓库内置 `cli/htmlParser.js`（自 drpy-node 生产实现移植，cheerio 版 jsoup 封装，
  解析逻辑逐字一致）；`DRPY_HTML_PARSER` 环境变量可替换为其他实现。pdfl 语义：HostEnv 可注入
  加速（批量模式），未注入时框架自动回退 pdfa+逐元素 pdfh/pd（设计文档 §9 parse）。
- mock 必须独立进程（`test/helpers/mock-server.mjs`）：同步 req 会阻塞事件循环。
- 完成 WP：更新 `docs/drpy3-实现任务书.md` §4 进度表 + commit（前缀 `drpy3(W#):`）+ push。
- 设计变更：先改 `docs/drpy3-设计文档.md`（附录 A 记录理由）再改代码。

## 工具

```bash
npm test                                  # 全量用例
node cli/drpy3-test.mjs 源.js --replay    # 六环节冒烟（fixtures 离线回放）
node cli/drpy3-test.mjs 源.js --record    # 录制 fixtures（本地 mock）
node cli/drpy3-inspect.mjs 源.js          # 逐接口查看返回数据（live）
npm run build                             # 重新生成 dist 产物
```
