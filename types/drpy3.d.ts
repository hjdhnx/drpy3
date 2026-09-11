// drpy3 类型面（§14.2 单页契约的 TS 形态）——宿主/源作者/IDE 共用。
// 引擎运行时为纯 JS ESM；本文件只声明类型，不含运行时。
// 契约详情见 docs/宿主对接指南.md（跨语言适配规范）与 docs/drpy3-设计文档.md §7/§9/§10。

/** HTTP 请求选项（HostEnv.req 的 options） */
export interface ReqOptions {
    headers?: Record<string, string>;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
    timeout?: number;                 // 毫秒
    encoding?: string;                // 响应解码字符集，缺省 utf-8
    body?: string;                    // 字符串请求体
    data?: Record<string, unknown>;   // GET 拼 query / 非 GET 请求体
    buffer?: 1 | 2;                   // 1→content 为 Uint8Array；2→content 为 base64；缺省文本
    redirect?: number;                // 0 禁止跟随 30x
    withHeaders?: boolean;            // 响应头+body 一起返回
}

/** HTTP 响应（buffer 语义见 ReqOptions.buffer） */
export interface ReqResponse {
    content: string | Uint8Array;
    headers: Record<string, string>;
}

/** jsoup 语义解析四件套（HostEnv 必注入，参考实现 cli/htmlParser.js） */
export interface PdfSuite {
    pdfh(html: string, parse: string, baseUrl?: string): string;
    pdfa(html: string, parse: string): string[];
    pd(html: string, parse: string, baseUrl?: string): string;
    pdfl(html: string, parse: string, listText: string, listUrl: string, myUrl: string): string[];
}

/** 持久 KV 介质（HostEnv 可注入；框架按源 key 拼命名空间 ns） */
export interface StoreMedium {
    get(ns: string, k: string, def?: unknown): unknown;
    set(ns: string, k: string, v: unknown): unknown;
    delete(ns: string, k: string): void;
}

/** 实例生命周期治理参数（hostEnv.lifecycle） */
export interface LifecycleOptions {
    idleTTL?: number;                            // 秒，默认 120
    maxHot?: number;                             // 默认 16
    memUsage?: () => number;                     // 0..1
    watermark?: number;                          // 默认 0.7
    watermarkTarget?: number;                    // 默认 0.5
}

/** HostEnv —— 宿主注入引擎的唯一注入面（§7） */
export interface HostEnv {
    // 必选五件套
    req(url: string, options?: ReqOptions): ReqResponse | Promise<ReqResponse>;
    pdfh(html: string, parse: string, baseUrl?: string): string;
    pdfa(html: string, parse: string): string[];
    pd(html: string, parse: string, baseUrl?: string): string;
    pdfl(html: string, parse: string, listText: string, listUrl: string, myUrl: string): string[];

    // 可选（缺省有内置兜底）
    batchFetch?(items: {url: string; options?: ReqOptions}[]): Promise<string[]>;
    joinUrl?(base: string, path: string): string;
    store?: StoreMedium;
    log?(...args: unknown[]): void;
    getProxy?(isPublic: boolean): string | Promise<string>;
    loadAsset?(path: string): string | Uint8Array | Promise<string | Uint8Array>;
    syncReq?(url: string, options?: ReqOptions): ReqResponse;   // 档 C 同步桥（load2x 必需）
    evalModule?(code: string, path?: string): Promise<{default?: unknown} | Record<string, unknown>>; // 模式 A

    // 元信息与行为开关
    env?: Record<string, unknown>;
    engine?: string;
    version?: string;
    wasm?: 'native' | 'polyfill' | 'none';
    action?: boolean;
    actionTimeoutMs?: number;
    lifecycle?: LifecycleOptions;
    pinList?: string[];
}

/** 请求上下文（每次调用全新对象，实例态只读投影） */
export interface Ctx {
    stage: string;
    url: string;                      // 原 MY_URL
    input: unknown;                   // play/search 入参回显
    flag: string;
    wd: string;
    pg: number;
    fl: Record<string, unknown>;      // 筛选条件
    scratch: Record<string, unknown>; // 临时篮子
    fetchParams: {headers: Record<string, string>; timeout: number; encoding: string};
    rule: Record<string, unknown>;    // 定稿后规则（init 后只读约定）
    key: string;
    meta: Record<string, unknown>;
    headers: Record<string, string>;  // 实例请求头基线（可变）
    resumed: boolean;                 // 复温标记
    capabilities: Readonly<Record<string, unknown>>;
    log(...args: unknown[]): void;
    store: {get(k: string, def?: unknown): unknown; set(k: string, v: unknown): unknown; delete(k: string): void};
    cache: {get(key: string): Promise<unknown>; set(key: string, v: unknown, ttl?: number): Promise<unknown>; delete(key: string): Promise<void>};
    lib: {
        net: {
            req(url: string, options?: ReqOptions): Promise<ReqResponse>;
            request(url: string, options?: ReqOptions): Promise<ReqResponse>;
            post(url: string, options?: ReqOptions): Promise<ReqResponse>;
            reqCookie(url: string, options?: ReqOptions, all?: boolean): Promise<{cookie: string; html: string}>;
            all(items: Promise<unknown>[]): Promise<unknown[]>;
            batchFetch(items: {url: string; options?: ReqOptions}[]): Promise<string[]>;
            download(url: string, options?: ReqOptions): Promise<string>;
        };
        parse: {
            pdfh(html: string, parse: string, baseUrl?: string): string;
            pdfa(html: string, parse: string): string[];
            pd(html: string, parse: string, baseUrl?: string): string;
            pdfl(html: string, parse: string, listText: string, listUrl: string, myUrl: string): string[];
            jp(path: string, json: unknown): unknown;
            jinja2(template: string, obj: unknown): string;
            parseRule(ruleStr: string, ctx: Ctx, opts?: {html?: string; catePrefix?: string}): Promise<VodItem[]>;
            模板: {getMubans(): Record<string, unknown>};
        };
        crypto: {
            md5(text: string): string;
            base64Encode(text: string): string;
            base64Decode(text: string): string;
            gzip(str: string): string;
            ungzip(b64: string): string;
            aesX(input: string, key: string, iv?: string, option?: Record<string, unknown>): string;
            desX(input: string, key: string, iv?: string, option?: Record<string, unknown>): string;
            rc4(input: string, key: string, option?: Record<string, unknown>): string;
            rsaX(data: string, key: string, option?: Record<string, unknown>): string;
            ready(): Promise<boolean>;
        };
        text: Record<string, unknown>;
        utils: {
            UA: Record<string, string>;
            joinUrl(base: string, path: string): string;
            getHome(url: string): string;
            urlencode(str: string): string;
            buildUrl(url: string, obj: Record<string, unknown>): string;
            buildQueryString(params: Record<string, unknown>): string;
            forceOrder(list: unknown[], key?: string, option?: (v: unknown) => unknown): unknown[];
            是否正版(url: string): boolean;
            urlDeal(vipUrl: string): string;
            getProxyUrl(): Promise<string>;
        };
        wasm: {load(source: string | Uint8Array): Promise<{exports?: Record<string, unknown>; [k: string]: unknown}>};
        store: Ctx['store'];
        cache: Ctx['cache'];
    };
    capabilities: Readonly<Record<string, unknown>>;
    get rule(): Record<string, unknown>;
    get headers(): Record<string, string>;
    get cache(): CacheApi;
    get store(): StoreApi;
}

export interface VodItem {
    vod_id: string;
    vod_name: string;
    vod_pic?: string;
    vod_remarks?: string;
    vod_content?: string;
    [k: string]: unknown;
}

export interface HomeResult {
    class: {type_id: string; type_name: string; type_flag?: string}[];
    filters?: Record<string, unknown> | null;
    type_flag?: string;
}

export interface CategoryResult {
    page: number;
    pagecount: number;
    limit: number;
    total: number;
    list: VodItem[];
}

export interface DetailResult {
    list: Record<string, unknown>[];
}

export interface PlayResult {
    parse: 0 | 1;
    jx?: 0 | 1;
    url?: string;
    flag?: string;
    urls?: string[];   // [线路名, url, 线路名, url, …]
    header?: Record<string, string>;
}

export type ProxyResult = [number, string, string | Uint8Array, Record<string, string>?, (1 | 2 | 3)?];

/** 源实例（rt.load 返回）——六环节 + 扩展通道，返回 JS 对象 */
export interface Source {
    readonly key: string;
    readonly meta: Record<string, unknown>;
    readonly rule: Record<string, unknown>;
    readonly form: 'declarative' | 'enhanced';
    readonly is2x?: boolean;
    readonly hot: boolean;
    lastError?: Error;
    init(extend?: unknown): Promise<void>;
    home(filter?: unknown): Promise<HomeResult>;
    homeVod(params?: unknown): Promise<{list: VodItem[]}>;
    category(tid: string, pg?: number, filter?: boolean, extend?: Record<string, unknown>): Promise<CategoryResult>;
    search(wd: string, quick?: boolean, pg?: number): Promise<CategoryResult | Record<string, never>>;
    detail(id: string): Promise<DetailResult>;
    play(flag: string, id: string, flags?: unknown[]): Promise<PlayResult>;
    proxy(params: Record<string, string>): Promise<ProxyResult>;
    action(action: string, value?: string): Promise<string | Record<string, unknown>>;
    sniffer(): Promise<boolean>;
    isVideo(url: string): Promise<boolean>;
    callStage(stage: string, ...args: unknown[]): Promise<unknown>;
    pin(): void;
    unpin(): void;
    evict(): Promise<boolean>;
}

export declare class Runtime {
    constructor(hostEnv?: HostEnv);
    check(): {missing: string[]; fallbacks: Record<string, string>; wasm: string; engine: string};
    readonly capabilities: Readonly<Record<string, unknown>>;
    use(overrides: Partial<HostEnv>): Runtime;
    resolve(name: string, sourceCaps?: Record<string, unknown> | null): unknown;
    load(sourceLike: string | Record<string, unknown>, opts?: {
        key?: string; path?: string; extend?: unknown; signature?: string;
        mode?: 'cjs'; drpy3?: boolean;
    }): Promise<Source>;
    load2x(code: string, opts?: {key?: string; path?: string}): Promise<Source>;
    evaluateSource(code: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    sweep(opts?: {force?: boolean}): Promise<{evicted: string[]}>;
    actionTimeoutMs: number;
    hostEnv: HostEnv;
    defaults: Record<string, ((ctx: Ctx, ...args: unknown[]) => unknown) | null> | null;
}

/** defineSource 运行时恒等（仅为 IDE/TS 提供类型提示） */
export declare function defineSource<T extends Record<string, unknown>>(source: T): T;

export declare const VERSION: string;
declare const _default: {Runtime: typeof Runtime; defineSource: typeof defineSource; VERSION: string};
export default _default;
