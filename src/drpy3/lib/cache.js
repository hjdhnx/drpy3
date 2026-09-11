// cache：进程内 TTL 缓存（设计 §9 store/cache）——drpy2 完全没有，搜索/详情提速利器。
// 实例级存活（驱逐即丢），进程内不持久（持久走 store）。

export function makeCache({defaultTtl = 300, sweepInterval = 60} = {}) {
    const m = new Map(); // key -> {value, expireAt}
    let lastSweep = Date.now();

    function sweepIfNeeded() {
        const now = Date.now();
        if (now - lastSweep < sweepInterval * 1000) return;
        lastSweep = now;
        for (const [k, v] of m) if (v.expireAt <= now) m.delete(k);
    }

    return {
        async get(key) {
            const e = m.get(key);
            if (!e) return undefined;
            if (e.expireAt <= Date.now()) {
                m.delete(key);
                return undefined;
            }
            return e.value;
        },
        async set(key, value, ttl = defaultTtl) {
            sweepIfNeeded();
            m.set(key, {value, expireAt: Date.now() + ttl * 1000});
            return value;
        },
        async delete(key) {
            m.delete(key);
        },
    };
}
