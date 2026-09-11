// drpy3 build（模式 B 预打包，§8.2）：源 + 相对模块 + ?bytes 资产 → 单文件 ESM（drpy3 保持 external）。
// 用法：node cli/drpy3-build.mjs <源.js> [-o 输出.js]
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

const CORE_INDEX = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'drpy3', 'index.js');

const bytesPlugin = {
    name: 'drpy3-bytes',
    setup(build) {
        build.onResolve({filter: /\?bytes$/}, (args) => {
            const spec = args.path.replace(/\?bytes$/, '');
            return {
                path: path.resolve(path.dirname(args.importer), spec),
                namespace: 'drpy3-bytes',
            };
        });
        build.onLoad({filter: /.*/, namespace: 'drpy3-bytes'}, (args) => {
            const bytes = fs.readFileSync(args.path);
            return {
                contents: `export default new Uint8Array([${Array.from(bytes).join(',')}]);`,
                loader: 'js',
            };
        });
    },
};

export async function buildSource(entry, outfile) {
    const result = await esbuild.build({
        entryPoints: [entry],
        bundle: true,
        format: 'esm',
        platform: 'neutral',
        target: 'es2020',
        external: ['drpy3'], // drpy3 运行时注入（中性求值剥除 import 并注入 defineSource）
        plugins: [bytesPlugin],
        outfile,
        write: true,
        logLevel: 'silent',
    });
    return outfile;
}

// CLI 入口
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const entry = args[0];
    if (!entry) {
        console.error('用法: node cli/drpy3-build.mjs <源.js> [-o 输出.js]');
        process.exit(1);
    }
    const outIdx = args.indexOf('-o');
    const outfile = outIdx > -1 ? args[outIdx + 1] : entry.replace(/\.(m?js)$/, '.bundle.js');
    await buildSource(path.resolve(entry), path.resolve(outfile));
    console.log(`[drpy3] 预打包完成: ${outfile}（drpy3 external——引擎注入运行时）`);
}
