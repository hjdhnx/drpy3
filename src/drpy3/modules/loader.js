// modules/loader：源内模块化（设计 §8）。三种运行模式 A 原生 ESM / B 预打包 / C 内置 CJS shim。
// W2 先提供零依赖形态的中性求值（evalSourceNeutral）；W8 补齐三模式与 CJS shim。
import {Drpy3Error} from '../errors.js';

const ASYNC_FN = Object.getPrototypeOf(async function () {
}).constructor;

/**
 * 中性求值（平台无关兜底，无需引擎模块能力）：
 * 支持 `import {defineSource} from 'drpy3'` + `export default <对象/函数>` 的零相对依赖形态
 * （覆盖 百忙无果1/2/4、央视频-1/2/4 等演示稿）。含相对路径 import 的源请走模式 A/B/C（W8）。
 */
export async function evalSourceNeutral(code, opts = {}) {
    const src = String(code);
    const hasRelativeImport = /(?:^|\n)\s*import\s+[^'"]*['"]\.\.?\/([^'"]*)['"]/.test(src)
        || /(?:^|\n)\s*import\s+['"]\.\.?\/([^'"]*)['"]/.test(src);
    if (hasRelativeImport) {
        throw new Drpy3Error('load', 'module',
            `源含相对路径模块 import（${opts.path || '未命名源'}），当前引擎无模块能力——请使用模式 A 原生 loader / 模式 B 预打包 / 模式 C CJS shim（设计 §8.2）`);
    }
    let body = src
        .replace(/^[ \t]*import[ \t]+[^;'"]*['"]drpy3['"][ \t]*;?[ \t]*$/gm, '')   // import {defineSource} from 'drpy3'
        .replace(/^[ \t]*import[ \t]*['"]drpy3['"][ \t]*;?[ \t]*$/gm, '');        // import 'drpy3'
    // esbuild 预打包形态：export { source_default as default };（须先于 export default 处理）
    const asDefaultRe = /(?:^|\n)[ \t]*export[ \t]*\{[^}]*?([A-Za-z_$][\w$]*)[ \t]+as[ \t]+default[^}]*\}[ \t]*;?[ \t]*(?=\n|$)/;
    const asDefault = body.match(asDefaultRe);
    if (asDefault) body = body.replace(asDefaultRe, '\nreturn ' + asDefault[1] + ';');
    const hasExportDefault = /(?:^|\n)[ \t]*export[ \t]+default[ \t]/.test(body) || !!asDefault;
    body = body.replace(/(?:^|\n)[ \t]*export[ \t]+default[ \t]*/g, '\nreturn ');
    // 其余命名导出（import 它们的源走打包模式，中性求值仅兜底 default 导出形态）
    body = body.replace(/(?:^|\n)[ \t]*export[ \t]+\{[^}]*\}[ \t]*;?[ \t]*(?=\n|$)/g, '\n');
    if (!hasExportDefault) {
        throw new Drpy3Error('load', 'module', `源未找到 export default（${opts.path || '未命名源'}）——drpy3 源必须 default 导出 rule 对象或 defineSource 包装`);
    }
    try {
        const fn = new ASYNC_FN('defineSource', 'lib', body);
        return await fn(_neutralDefineSource, undefined);
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new Drpy3Error('load', 'module', `源语法错误: ${e.message}（若源使用 require/ESM 混合语法，请走模式 B 预打包 §8.2）`);
        }
        throw e;
    }
}

// 中性求值里的 defineSource（恒等，§4.1）
function _neutralDefineSource(source) {
    return source;
}

// ═══════════════ 模式 C：内置 CJS shim（§8.2）═══════════════
// 无模块能力的老引擎兜底：require(spec) → host.loadAsset 读文件 → new Function 包装执行，
// 带模块缓存与循环依赖检测；兼容性红线：require('https://...') 一律拒绝（模块必须随源分发）。
// 简单 ESM 形态（import {a} from './x' / export const|function NAME / export default）加载期
// 预转换为 CJS 等价物；复杂形态报错提示走模式 B 预打包。

/** 相对路径解析（平台无关字符串拼接）：'./lib/a.js' 相对 fromDir（相对源根目录） */
function resolveRel(fromDir, spec) {
    const raw = spec.replace(/^\.\//, '');
    const parts = (fromDir ? fromDir.split('/') : []).filter(Boolean);
    for (const seg of raw.split('/')) {
        if (seg === '' || seg === '.') continue;
        if (seg === '..') parts.pop();
        else parts.push(seg);
    }
    return parts.join('/');
}

/** 简单 ESM → CJS 预转换 */
export function transformEsmToCjs(src) {
    const names = [];
    for (const m of src.matchAll(/^[ \t]*export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm)) names.push(m[1]);
    for (const m of src.matchAll(/^[ \t]*export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) names.push(m[1]);
    let out = src
        .replace(/^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm,
            (m, clause, spec) => `const {${clause.trim()}} = require('${spec}');`)
        .replace(/^[ \t]*import\s+([A-Za-z_$][\w$]*)\s+from\s*['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm,
            (m, local, spec) => `const ${local} = require('${spec}');`)
        .replace(/^[ \t]*import\s*['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm,
            (m, spec) => `require('${spec}');`)
        .replace(/^[ \t]*export\s+(?=(?:async\s+)?function\b|(?:const|let|var)\b)/gm, '');
    out = out.replace(/(^[ \t]*)export[ \t]+default[ \t]*/m, '$1module.exports.default = ');
    if (names.length) out += `\n;Object.assign(module.exports, {${names.join(', ')}});`;
    return out;
}

/**
 * 模式 C 加载：源码（含相对路径 require/import）→ 默认导出对象
 * @param rt Runtime（loadAsset 能力由宿主注入）
 * @param code 源码字符串
 * @param opts {path: 相对源根的入口路径}
 */
export async function evalSourceCjs(code, opts, rt) {
    const loadAsset = rt.resolve('loadAsset');
    if (typeof loadAsset !== 'function') {
        throw new Drpy3Error('load', 'module', '模式 C 需要 HostEnv 注入 loadAsset(path)——读取随源模块文件');
    }
    const cache = new Map();
    const entryDir = ((opts && opts.path) ? opts.path.replace(/[^/]*$/, '') : '');

    function makeRequire(dir) {
        return (spec) => {
            if (spec === 'drpy3') return {defineSource: (s) => s};
            if (/^(https?:)?\/\//.test(spec)) {
                throw new Drpy3Error('load', 'module', `远端 require 被拒绝（§8.2 红线）: ${spec}——模块必须随源分发`);
            }
            if (!spec.startsWith('.')) {
                throw new Drpy3Error('load', 'module', `模式 C 仅支持相对路径模块: ${spec}`);
            }
            const bytes = spec.endsWith('?bytes');
            const clean = bytes ? spec.slice(0, -'?bytes'.length) : spec;
            const rel = resolveRel(dir, clean);
            if (cache.has(rel)) return cache.get(rel);
            let content;
            try {
                content = loadAsset(rel);
            } catch (e) {
                throw new Drpy3Error('load', 'module', `模块读取失败: ${rel} — ${e.message}`);
            }
            if (content && typeof content.then === 'function') {
                throw new Drpy3Error('load', 'module', '模式 C 需要同步 loadAsset（CJS require 为同步语义，§8.2 档 C 宿主）');
            }
            if (bytes) {
                const mod0 = {exports: content instanceof Uint8Array ? content : new TextEncoder().encode(String(content))};
                cache.set(rel, mod0.exports);
                return mod0.exports;
            }
            if (typeof content !== 'string') content = new TextDecoder().decode(content);
            const transformed = transformEsmToCjs(content);
            const module_ = {exports: {}};
            cache.set(rel, module_.exports); // 先占位，循环依赖检测（§8.2）
            const fn = new Function('require', 'module', 'exports', transformed);
            fn(makeRequire(rel.replace(/[^/]*$/, '')), module_, module_.exports);
            return module_.exports;
        };
    }

    let transformed;
    try {
        transformed = transformEsmToCjs(String(code));
        const module_ = {exports: {}};
        const fn = new Function('require', 'module', 'exports', transformed);
        fn(makeRequire(entryDir), module_, module_.exports);
        return module_.exports.default !== undefined ? module_.exports.default : module_.exports;
    } catch (e) {
        if (e instanceof Drpy3Error) throw e;
        if (/import.{0,10}outside a module|Unexpected token/.test(String(e.message))) {
            throw new Drpy3Error('load', 'module', `模式 C 无法解析该源（${e.message}）——请使用模式 B 预打包（drpy3 build，§8.2）`);
        }
        throw new Drpy3Error('load', 'module', e);
    }
}
