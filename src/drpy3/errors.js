// 工程化报错（设计 §14.4）：{stage, rule, line, error, hint} —— 禁止裸抛引擎栈
export class Drpy3Error extends Error {
    /**
     * @param stage 环节：home/category/search/detail/play/proxy/action/init...
     * @param rule 规则字段：一级/二级/搜索/lazy/proxy_rule...（钩子错误为 hook 名）
     * @param err 原始错误
     * @param source 源标识（meta.title 或 key）
     * @param hint 修复提示（常见映射内置，可显式覆盖）
     */
    constructor(stage, rule, err, source = '', hint = '') {
        const msg = err && err.message ? err.message : String(err);
        super(`[drpy3:${stage}${rule ? '/' + rule : ''}] ${msg}${source ? ` @${source}` : ''}`);
        this.name = 'Drpy3Error';
        this.stage = stage;
        this.rule = rule || '';
        this.error = msg;
        this.source = source;
        this.hint = hint || guessHint(msg);
        if (err && err.stack) this.cause = err;
    }

    /** §14.4 结构化形态（drpy3 test 与日志同用一份诊断） */
    toJSON() {
        return {ok: false, stage: this.stage, rule: this.rule, error: this.error, hint: this.hint, source: this.source};
    }
}

/** 常见错误 → 修复提示映射（§14.4） */
export function guessHint(msg) {
    const m = String(msg || '');
    if (/JSON(\.parse)?|Unexpected (end|token)/i.test(m)) return 'JSON 解析失败——响应体为空或非 JSON：检查请求 URL/headers，疑似风控或超时';
    if (/undefined is not an object|Cannot read propert/i.test(m)) return '读取了 undefined 的字段——检查 json 路径或选择器是否与响应结构匹配';
    if (/is not a function/i.test(m)) return '调用了不存在的函数——对照 ctx.lib API 面检查拼写';
    if (/timeout|abort|ETIMEDOUT|ECONNREFUSED|fetch failed/i.test(m)) return '网络失败——检查目标站可达性、超时配置与 headers（UA/Referer）';
    if (/WebAssembly|wasm/i.test(m)) return 'wasm 加载失败——检查资产路径随源分发、引擎 WebAssembly 能力（capabilities.wasm）';
    return '';
}
