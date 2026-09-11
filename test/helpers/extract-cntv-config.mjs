// 一次性工具：从 docs/央视频.js 提取静态配置 → docs/fixtures/cntv-dr3-config.json
import fs from 'node:fs';
const raw = fs.readFileSync('docs/央视频.js', 'utf8');
const code = raw
    .replace("import './_lib.cntvParse.js';", '')
    .replace('export function __jsEvalReturn() {', 'function __jsEvalReturn_unused() {');
const factory = new Function(code + '\n;return {categoryConfig, filterConfig, liveChannels, liveCdnMap, getLiveUrlSrc: getLiveUrl.toString(), header};');
const out = factory();
fs.writeFileSync('docs/fixtures/cntv-dr3-config.json', JSON.stringify(out, null, 2));
console.log('提取 OK: 分类', out.categoryConfig.length, '| 筛选键', Object.keys(out.filterConfig).join(','), '| 直播频道', out.liveChannels.length);
