// drpy3 × fjs bundle 构建（esbuild）：引擎本体（peer 链 + 库包）+ pdf 四件套 + 胶水
// → 单文件 ESM（assets/drpy3-fjs.bundle.js），fjs 中以模块名 'drpy3' 一次性装载。
// 产物已提交仓库；改了引擎/胶水后重跑：node hosts/fjs/tools/build.mjs
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', 'assets', 'drpy3-fjs.bundle.js');

await esbuild.build({
    entryPoints: [path.resolve(HERE, '..', 'glue.mjs')],
    bundle: true,
    format: 'esm',
    platform: 'browser', // cheerio 走 browser 导出（无 node:stream）；引擎本体平台中性不受影响
    target: 'es2022',
    outfile: OUT,
    legalComments: 'none',
    logLevel: 'info',
});
console.log(`[drpy3-fjs] bundle 完成: ${OUT}`);
