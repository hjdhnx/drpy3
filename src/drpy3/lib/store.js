// store：源级持久 KV（设计 §9 store / §4.4）。
// 介质由 HostEnv.store 决定（壳子数据库/文件），未注入时内存 Map 兜底（重启丢失）。
// 框架保证按源 key 隔离命名空间——壳子不再自己拼 RKEY（设计 §7.3 local → store）。

/** 内置兜底介质：内存 Map（Runtime 级单例） */
export function memoryStore() {
    const m = new Map(); // `${ns}|${k}` -> value
    return {
        get(ns, k, def = undefined) {
            const key = ns + '|' + k;
            return m.has(key) ? m.get(key) : def;
        },
        set(ns, k, v) {
            m.set(ns + '|' + k, v);
            return v;
        },
        delete(ns, k) {
            m.delete(ns + '|' + k);
        },
    };
}

/** 组装某源的 store 投影：ctx.store.get(k) —— 命名空间由框架按源 key 拼（§9） */
export function makeStore(medium, ns) {
    return {
        get(k, def = undefined) {
            return medium.get(ns, k, def);
        },
        set(k, v) {
            return medium.set(ns, k, v);
        },
        delete(k) {
            return medium.delete(ns, k);
        },
    };
}
