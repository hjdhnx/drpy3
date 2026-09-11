/*
 * drpy3.js —— drpy3 引擎单文件形态（可读版，drpy2.js 同款用法）
 *
 * ⚠️ 本文件由 cli/build-drpy3.mjs 从 src/drpy3/** 打包生成——请勿手改；维护请改源码后重新构建：
 *     npm run build:drpy3
 *
 * 用法（与 drpy2.js 双文件形态一致，引擎与库包同目录分发）：
 *   你的目录/
 *   ├── drpy3.js                    ← 本文件
 *   ├── drpy-core-lite.min.js       ← 库全局包（CryptoJS/jinja/模板/pako/gbkTool…，peer 引用）
 *   ├── drpy3-peer.js / drpy3-globals-capture.js ← peer 装载链（原生全局守卫，构建时生成）
 *
 *   import { Runtime } from './drpy3.js';
 *   const rt = new Runtime({ req, pdfh, pdfa, pd });   // HostEnv 注入，详见设计文档 §7
 *   const src = await rt.load(sourceCode, { key: '_x' });
 *   const home = await src.home('');
 *
 * 设计唯一真相源：docs/drpy3-设计文档.md；执行手册：docs/drpy3-实现任务书.md
 * 模块索引（对应 src/drpy3/ 下同名源文件）：
 *   runtime.js   Runtime：HostEnv 校验/use()/capabilities
 *   lifecycle.js Source 实例与生命周期治理（LRU/signature 热更/快照复温）
 *   context.js   两层上下文的调用态（ctx 构造与快捷别名投影）
 *   lib/net.js lib/parse.js lib/crypto.js lib/text.js lib/utils.js lib/store.js lib/cache.js lib/wasm.js
 *   rules/parseRule.js rules/jsFragment.js rules/defaults.js（声明式默认引擎）
 *   modules/loader.js（模式 A/B/C 源装载）compat/drpy2.js（load2x 兼容层）errors.js（工程化报错）
 */

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/drpy3/lib/store.js
function memoryStore() {
  const m = /* @__PURE__ */ new Map();
  return {
    get(ns, k, def = void 0) {
      const key = ns + "|" + k;
      return m.has(key) ? m.get(key) : def;
    },
    set(ns, k, v) {
      m.set(ns + "|" + k, v);
      return v;
    },
    delete(ns, k) {
      m.delete(ns + "|" + k);
    }
  };
}
function makeStore(medium, ns) {
  return {
    get(k, def = void 0) {
      return medium.get(ns, k, def);
    },
    set(k, v) {
      return medium.set(ns, k, v);
    },
    delete(k) {
      return medium.delete(ns, k);
    }
  };
}

// src/drpy3/lib/peer.js
var peer_exports = {};

// src/drpy3/lib/native-globals.js
var nativeWasm = globalThis.WebAssembly;
var nativeUint8ArrayFromBase64 = typeof Uint8Array.fromBase64 === "function" ? Uint8Array.fromBase64 : null;
if (!nativeUint8ArrayFromBase64) {
  const B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const B64_LOOKUP = new Int8Array(128).fill(-1);
  for (let i = 0; i < 64; i++) B64_LOOKUP[B64_ALPHABET.charCodeAt(i)] = i;
  B64_LOOKUP["-".charCodeAt(0)] = 62;
  B64_LOOKUP["_".charCodeAt(0)] = 63;
  const B64_RE = /^(?:[A-Za-z0-9+/-]{4})*(?:[A-Za-z0-9+/-]{2}==|[A-Za-z0-9+/-]{3}=)?$/;
  Uint8Array.fromBase64 = function(string, options) {
    const clean2 = String(string).replace(/\s/g, "");
    if (!B64_RE.test(clean2)) throw new TypeError("Invalid base64 string");
    const stripPad = clean2.replace(/=+$/, "");
    const out = new Uint8Array(Math.floor(stripPad.length * 3 / 4));
    let o = 0, buffer = 0, bits = 0;
    for (const ch of stripPad) {
      buffer = buffer << 6 | B64_LOOKUP[ch.charCodeAt(0)];
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        out[o++] = buffer >> bits & 255;
      }
    }
    return out;
  };
}
var nativeFetch = globalThis.fetch;
var nativeTextEncoder = globalThis.TextEncoder;
var nativeConsoleError = console.error;
console.error = function drpy3QuietConsoleError(...args) {
  if (typeof args[0] === "string" && args[0].startsWith("[Script Loader]")) return;
  return nativeConsoleError.apply(this, args);
};

// src/drpy3/lib/peer.js
__reExport(peer_exports, drpy_core_lite_min_star);
import * as drpy_core_lite_min_star from "./drpy3-peer.js";
if (nativeWasm && globalThis.WebAssembly !== nativeWasm) globalThis.WebAssembly = nativeWasm;
if (nativeFetch && globalThis.fetch !== nativeFetch) globalThis.fetch = nativeFetch;
if (nativeTextEncoder && globalThis.TextEncoder !== nativeTextEncoder) globalThis.TextEncoder = nativeTextEncoder;
console.error = nativeConsoleError;

// src/drpy3/lib/utils.js
var UA = {
  MOBILE_UA: "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
  PC_UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
  IOS_UA: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
  UC_UA: "Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36",
  UA: "Mozilla/5.0"
};
function resolveUaConstants(headers) {
  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === "user-agent" && UA[headers[k]] !== void 0) headers[k] = UA[headers[k]];
  }
  return headers;
}
function builtinJoinUrl(base, path) {
  try {
    return new URL(path, base || void 0).href;
  } catch {
    return (base || "") + path;
  }
}
function getHome(url2) {
  if (!url2) return "";
  const tmp = String(url2).split("//");
  let home = tmp[0] + "//" + (tmp[1] || "").split("/")[0];
  try {
    home = decodeURIComponent(home);
  } catch {
  }
  return home;
}
function urlencode(str) {
  str = (str + "").toString();
  return encodeURIComponent(str).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
}
function buildUrl(url2, obj) {
  obj = obj || {};
  if (url2.indexOf("?") < 0) url2 += "?";
  const keys = Object.keys(obj);
  const prs = keys.map((k) => k + "=" + obj[k]).join("&");
  if (keys.length > 0 && !url2.endsWith("?")) url2 += "&";
  return url2 + prs;
}
function buildQueryString(params) {
  const arr = [];
  for (const key of Object.keys(params)) {
    let v = params[key];
    if (v === void 0 || v === null) v = "";
    else v = v.toString();
    arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
  }
  return arr.join("&");
}
function \u662F\u5426\u6B63\u7248(vipUrl) {
  return /qq\.com|iqiyi\.com|youku\.com|mgtv\.com|bilibili\.com|sohu\.com|ixigua\.com|pptv\.com|miguvideo\.com|le\.com|1905\.com|fun\.tv/.test(vipUrl);
}
function urlDeal(vipUrl) {
  if (!vipUrl) return "";
  if (!\u662F\u5426\u6B63\u7248(vipUrl)) return vipUrl;
  if (!/miguvideo/.test(vipUrl)) vipUrl = vipUrl.split("#")[0].split("?")[0];
  return vipUrl;
}
function forceOrder(lists, key, option) {
  const start = Math.floor(lists.length / 2);
  const end = Math.min(lists.length - 1, start + 1);
  if (start >= end) return lists;
  let first = lists[start];
  let second = lists[end];
  if (key) {
    try {
      first = first[key];
      second = second[key];
    } catch {
    }
  }
  if (option && typeof option === "function") {
    try {
      first = option(first);
      second = option(second);
    } catch {
    }
  }
  first += "";
  second += "";
  const m1 = first.match(/(\d+)/);
  const m2 = second.match(/(\d+)/);
  if (m1 && m2 && Number(m1[1]) > Number(m2[1])) lists.reverse();
  return lists;
}
function makeUtils(rt) {
  return {
    UA,
    joinUrl: (base, path) => rt.resolve("joinUrl")(base, path),
    getHome,
    urlencode,
    encodeUrl: (str) => encodeURI(str),
    buildUrl,
    buildQueryString,
    forceOrder,
    \u662F\u5426\u6B63\u7248,
    urlDeal,
    // proxy 类源取本地代理地址（HostEnv getProxy 的包装，§9 utils）
    getProxyUrl: async () => {
      const gp = rt.resolve("getProxy");
      const url2 = typeof gp === "function" ? await gp(true) : "";
      return url2 || "http://127.0.0.1:9978/proxy?do=js";
    }
  };
}

// src/drpy3/errors.js
var Drpy3Error = class extends Error {
  /**
   * @param stage 环节：home/category/search/detail/play/proxy/action/init...
   * @param rule 规则字段：一级/二级/搜索/lazy/proxy_rule...（钩子错误为 hook 名）
   * @param err 原始错误
   * @param source 源标识（meta.title 或 key）
   * @param hint 修复提示（常见映射内置，可显式覆盖）
   */
  constructor(stage, rule2, err, source = "", hint = "") {
    const msg = err && err.message ? err.message : String(err);
    super(`[drpy3:${stage}${rule2 ? "/" + rule2 : ""}] ${msg}${source ? ` @${source}` : ""}`);
    this.name = "Drpy3Error";
    this.stage = stage;
    this.rule = rule2 || "";
    this.error = msg;
    this.source = source;
    this.hint = hint || guessHint(msg);
    if (err && err.stack) this.cause = err;
  }
  /** §14.4 结构化形态（drpy3 test 与日志同用一份诊断） */
  toJSON() {
    return { ok: false, stage: this.stage, rule: this.rule, error: this.error, hint: this.hint, source: this.source };
  }
};
function guessHint(msg) {
  const m = String(msg || "");
  if (/JSON(\.parse)?|Unexpected (end|token)/i.test(m)) return "JSON \u89E3\u6790\u5931\u8D25\u2014\u2014\u54CD\u5E94\u4F53\u4E3A\u7A7A\u6216\u975E JSON\uFF1A\u68C0\u67E5\u8BF7\u6C42 URL/headers\uFF0C\u7591\u4F3C\u98CE\u63A7\u6216\u8D85\u65F6";
  if (/undefined is not an object|Cannot read propert/i.test(m)) return "\u8BFB\u53D6\u4E86 undefined \u7684\u5B57\u6BB5\u2014\u2014\u68C0\u67E5 json \u8DEF\u5F84\u6216\u9009\u62E9\u5668\u662F\u5426\u4E0E\u54CD\u5E94\u7ED3\u6784\u5339\u914D";
  if (/is not a function/i.test(m)) return "\u8C03\u7528\u4E86\u4E0D\u5B58\u5728\u7684\u51FD\u6570\u2014\u2014\u5BF9\u7167 ctx.lib API \u9762\u68C0\u67E5\u62FC\u5199";
  if (/timeout|abort|ETIMEDOUT|ECONNREFUSED|fetch failed/i.test(m)) return "\u7F51\u7EDC\u5931\u8D25\u2014\u2014\u68C0\u67E5\u76EE\u6807\u7AD9\u53EF\u8FBE\u6027\u3001\u8D85\u65F6\u914D\u7F6E\u4E0E headers\uFF08UA/Referer\uFF09";
  if (/WebAssembly|wasm/i.test(m)) return "wasm \u52A0\u8F7D\u5931\u8D25\u2014\u2014\u68C0\u67E5\u8D44\u4EA7\u8DEF\u5F84\u968F\u6E90\u5206\u53D1\u3001\u5F15\u64CE WebAssembly \u80FD\u529B\uFF08capabilities.wasm\uFF09";
  return "";
}

// src/drpy3/lib/net.js
function hasHeader(headers, name) {
  return Object.keys(headers || {}).some((k) => k.toLowerCase() === name.toLowerCase());
}
function resolveUaNames(headers) {
  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === "user-agent" && UA[headers[k]] !== void 0) headers[k] = UA[headers[k]];
  }
  return headers;
}
function mergeOptions(ctx2, url2, options) {
  const o = { ...options || {} };
  const h = resolveUaNames({ ...ctx2.headers || {}, ...ctx2.fetchParams && ctx2.fetchParams.headers || {}, ...o.headers || {} });
  if (!hasHeader(h, "user-agent")) h["User-Agent"] = UA.MOBILE_UA;
  if (!hasHeader(h, "referer")) h["Referer"] = getHome(url2);
  o.headers = h;
  if (o.timeout == null && ctx2.fetchParams && ctx2.fetchParams.timeout != null) o.timeout = ctx2.fetchParams.timeout;
  if (o.encoding == null && ctx2.fetchParams && ctx2.fetchParams.encoding) o.encoding = ctx2.fetchParams.encoding;
  return o;
}
function makeNet(rt, ctx2) {
  const net = {
    /** 单次请求：返回 {content, headers}。buffer:1→Uint8Array / 2→base64 / 缺省→文本（§6.2） */
    async req(url2, options) {
      if (!url2) return { content: "", headers: {} };
      const fn = rt.resolve("req");
      if (typeof fn !== "function") {
        throw new Drpy3Error("net", "req", "HostEnv \u7F3A\u5C11\u5FC5\u6CE8\u5165\u9879 req()\u2014\u2014\u58F3\u5B50\u672A\u63D0\u4F9B HTTP \u80FD\u529B");
      }
      const res = await fn(url2, mergeOptions(ctx2, url2, options));
      if (res && typeof res === "object" && "content" in res) return res;
      throw new Drpy3Error("net", "req", `HostEnv req \u8FD4\u56DE\u5951\u7EA6\u4E0D\u5408\u6CD5\uFF08\u9700 {content, headers}\uFF09\uFF0C\u5B9E\u9645: ${typeof res}`);
    },
    /** drpy2 老名 request：便捷封装（fetch_params 默认语义已并入 req 的 headers 合并） */
    request(url2, options) {
      return net.req(url2, options);
    },
    /** 快捷 POST（drpy2 post 语义） */
    post(url2, options) {
      return net.req(url2, { ...options || {}, method: "POST" });
    },
    /** 搜索过验证：返回 {cookie, html}（drpy2 reqCookie 语义，withHeaders） */
    async reqCookie(url2, options, allCookie = false) {
      const res = await net.req(url2, { ...options || {}, withHeaders: true });
      let headers = res.headers || {};
      if (options && options.withHeaders && typeof res.content === "string" && res.content.trim().startsWith("{")) {
        try {
          headers = JSON.parse(res.content);
        } catch {
        }
      }
      const ckKey = Object.keys(headers).find((k) => k.toLowerCase() === "set-cookie");
      let cookie = ckKey ? headers[ckKey] : "";
      if (Array.isArray(cookie)) cookie = cookie.join(";");
      cookie = String(cookie || "");
      const html = headers.body != null ? headers.body : res.content;
      return { cookie: allCookie ? cookie : cookie.split(";")[0], html };
    },
    /** 并发请求（Promise.all 语义化，§5.2） */
    all: (promisesOrItems) => Promise.all(promisesOrItems),
    /** 正式并发批量 API（§9）：[{url, options}] → 按序对齐的响应"文本"数组；单项失败返 '' 不中断 */
    async batchFetch(items) {
      const hostFn = rt.resolve("batchFetch");
      if (typeof hostFn === "function") {
        return await hostFn(items);
      }
      if (!Array.isArray(items) || items.length === 0) return [];
      return await Promise.all(items.map(async (it) => {
        try {
          const res = await net.req(it.url, it.options);
          return res.content;
        } catch {
          return "";
        }
      }));
    },
    /** 下载为 base64（原 buffer:2 约定的显式化，§9） */
    async download(url2, options) {
      const res = await net.req(url2, { ...options || {}, buffer: 2 });
      return res.content;
    }
  };
  return net;
}

// src/drpy3/rules/parseRule.js
function dealJson(html) {
  if (typeof html !== "string") return html;
  try {
    return JSON.parse(html);
  } catch {
  }
  const m = html.match(/\{[\s\S]*\}/) || html.match(/\[[\s\S]*\]/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch {
    }
  }
  throw new Drpy3Error("parse", "parseRule", "\u54CD\u5E94\u4F53\u4E0D\u662F\u5408\u6CD5 JSON");
}
function jsonPdfh(data, parse, jp) {
  if (!parse || !parse.trim()) return "";
  let path = parse.trim();
  if (!path.startsWith("$.")) path = "$." + path;
  for (const ps of path.split("||")) {
    let ret = jp(ps, data);
    if (Array.isArray(ret)) ret = ret[0] || "";
    else ret = ret == null ? "" : ret;
    if (ret && typeof ret !== "string") ret = String(ret);
    if (ret) return ret;
  }
  return "";
}
function clean(s) {
  return String(s == null ? "" : s).replace(/\n|\t/g, "").trim();
}
async function parseRule(ruleStr, ctx2, opts = {}) {
  const rule2 = String(ruleStr == null ? "" : ruleStr).trim();
  if (!rule2) return [];
  const p2 = rule2.split(";");
  if (p2.length < 5) return [];
  let p0 = p2[0];
  const kind = p0.startsWith("jsp:") ? "jsp" : p0.startsWith("json:") ? "json" : "jq";
  p0 = p0.replace(/^(jsp:|json:|jq:)/, "");
  const MY_URL = ctx2.url || "";
  const parse = ctx2.lib.parse;
  const detailUrl = ctx2.rule && ctx2.rule.detailUrl || "";
  let html = opts.html;
  if (html == null) {
    const res = await ctx2.lib.net.req(MY_URL);
    html = res.content;
  }
  if (kind === "json") html = dealJson(html);
  let list;
  if (kind === "json") {
    let path = p0.trim();
    if (!path) return [];
    if (!path.startsWith("$.")) path = "$." + path;
    let ret = parse.jp(path, html);
    if (Array.isArray(ret) && Array.isArray(ret[0]) && ret.length === 1) ret = ret[0];
    list = ret || [];
  } else {
    list = parse.pdfa(html, p0) || [];
  }
  if (!Array.isArray(list)) return [];
  const prefix = opts.catePrefix != null && opts.catePrefix !== "" && detailUrl ? opts.catePrefix + "$" : "";
  const out = [];
  for (const it of list) {
    try {
      const nameOf = (sel) => kind === "json" ? jsonPdfh(it, sel, parse.jp) : clean(parse.pdfh(it, sel));
      const picOf = (sel) => {
        if (kind === "json") {
          const r = jsonPdfh(it, sel, parse.jp);
          return r ? ctx2.lib.utils.joinUrl(MY_URL, r) : "";
        }
        return parse.pd(it, sel, MY_URL);
      };
      const idOf = (sel) => detailUrl ? nameOf(sel) : kind === "json" ? picOf(sel) : parse.pd(it, sel, MY_URL);
      const links = p2[4].split("+").map(idOf);
      out.push({
        vod_id: prefix + links.join("$"),
        vod_name: nameOf(p2[1]),
        vod_pic: picOf(p2[2]),
        vod_remarks: nameOf(p2[3])
      });
    } catch {
    }
  }
  return out;
}

// src/drpy3/lib/parse.js
function makeParse(rt) {
  const parse = {
    pdfh: (html, parseRule2, baseUrl = "") => rt.resolve("pdfh")(html, parseRule2, baseUrl),
    pdfa: (html, parseRule2) => rt.resolve("pdfa")(html, parseRule2),
    pd: (html, parseRule2, baseUrl = "") => rt.resolve("pd")(html, parseRule2, baseUrl),
    // HostEnv 未注入 pdfl 时框架回退：pdfa 取列表 + 逐元素 pdfh/pd（§9，正确性不受影响）
    pdfl: (html, parseRule2, listText, listUrl, myUrl) => {
      const host = rt.resolve("pdfl");
      if (typeof host === "function") {
        return host(html, parseRule2, listText, listUrl, myUrl);
      }
      const items = rt.resolve("pdfa")(html, parseRule2) || [];
      return items.map((it) => `${rt.resolve("pdfh")(it, listText)}$${rt.resolve("pd")(it, listUrl, myUrl)}`);
    },
    // jsonpath（peer cheerio.jp：jp(path, json)）
    jp: (path, json) => peer_exports.cheerio.jp(path, json),
    jinja2: (tpl, obj) => peer_exports.cheerio.jinja2(tpl, obj),
    \u6A21\u677F: peer_exports.\u6A21\u677F,
    // 'json:...;title;img' 字符串规则解析成数据（§9）：语义基准 drpy2 categoryParse 列表分支
    parseRule(ruleStr, ctx2, opts) {
      return parseRule(ruleStr, ctx2, opts);
    }
  };
  return parse;
}

// src/drpy3/lib/crypto.js
function md5(text) {
  return peer_exports.CryptoJS.MD5(String(text)).toString();
}
function base64Encode(text) {
  return peer_exports.CryptoJS.enc.Base64.stringify(peer_exports.CryptoJS.enc.Utf8.parse(text));
}
function base64Decode(text) {
  return peer_exports.CryptoJS.enc.Utf8.stringify(peer_exports.CryptoJS.enc.Base64.parse(text));
}
function bytesToWordArray(bytes) {
  return peer_exports.CryptoJS.lib.WordArray.create(bytes);
}
function wordArrayToBytes(wa) {
  const words = wa.words;
  const sigBytes = wa.sigBytes;
  const out = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    out[i] = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
  }
  return out;
}
function gzip(str) {
  return bytesToWordArray(peer_exports.pako.gzip(String(str))).toString(peer_exports.CryptoJS.enc.Base64);
}
function ungzip(b64Data) {
  const bytes = wordArrayToBytes(peer_exports.CryptoJS.enc.Base64.parse(String(b64Data).trim()));
  return peer_exports.pako.inflate(bytes, { to: "string" });
}
function cipherX(algo, padding, mode, input, key, iv, option) {
  option = option || {};
  const keyWA = peer_exports.CryptoJS.enc.Utf8.parse(key);
  const ivWA = iv ? peer_exports.CryptoJS.enc.Utf8.parse(iv) : algo === "AES" ? peer_exports.CryptoJS.enc.Utf8.parse(key.substr(0, 16)) : void 0;
  const cfg = { padding: peer_exports.CryptoJS.pad[padding] || peer_exports.CryptoJS.pad.Pkcs7, mode: peer_exports.CryptoJS.mode[mode || "CBC"], iv: ivWA };
  if ((option.mode || mode) === "ECB") delete cfg.iv;
  if (/^enc/i.test(option.method || "enc")) {
    const data2 = option.utf8 ? peer_exports.CryptoJS.enc.Utf8.parse(input) : peer_exports.CryptoJS.enc.Base64.parse(input);
    return peer_exports.CryptoJS[algo].encrypt(data2, keyWA, cfg).ciphertext.toString(peer_exports.CryptoJS.enc.Base64);
  }
  const data = peer_exports.CryptoJS.enc.Base64.parse(input);
  const dec = peer_exports.CryptoJS[algo].decrypt({ ciphertext: data }, keyWA, cfg);
  return dec.toString(peer_exports.CryptoJS.enc.Utf8);
}
function aesX(input, key, iv, option) {
  try {
    return cipherX("AES", "Pkcs7", "CBC", input, key, iv, option);
  } catch (e) {
    throw new Drpy3Error("crypto", "aesX", e);
  }
}
function desX(input, key, iv, option) {
  try {
    return cipherX("DES", "Pkcs7", "CBC", input, key, iv, option);
  } catch (e) {
    throw new Drpy3Error("crypto", "desX", e);
  }
}
function rc4(input, key, option) {
  option = option || {};
  const keyWA = peer_exports.CryptoJS.enc.Utf8.parse(key);
  if (/^dec/i.test(option.method || "")) {
    const data2 = peer_exports.CryptoJS.enc.Base64.parse(input);
    const dec = peer_exports.CryptoJS.RC4.decrypt({ ciphertext: data2 }, keyWA);
    return dec.toString(peer_exports.CryptoJS.enc.Utf8);
  }
  const data = peer_exports.CryptoJS.enc.Utf8.parse(input);
  return peer_exports.CryptoJS.RC4.encrypt(data, keyWA).ciphertext.toString(peer_exports.CryptoJS.enc.Base64);
}
function rsaX(data, key, option = {}) {
  const method = (option.method || (key && key.includes("BEGIN") ? "decode" : "encode")).toLowerCase();
  if (method.startsWith("dec")) {
    if (typeof peer_exports.JSEncrypt === "function") {
      const dec = new peer_exports.JSEncrypt();
      dec.setPrivateKey(key);
      const fn = dec[option.long ? "decryptUnicodeLong" : "decrypt"];
      const r = fn.call(dec, data);
      return r || "";
    }
    return peer_exports.NODERSA.decode({ data, key, option });
  }
  if (typeof peer_exports.JSEncrypt === "function") {
    const enc = new peer_exports.JSEncrypt();
    enc.setPublicKey(key);
    const fn = enc[option.long ? "encryptUnicodeLong" : "encrypt"];
    const r = fn.call(enc, data);
    return r || "";
  }
  return peer_exports.NODERSA.encode({ data, key, option });
}
function makeCrypto(rt) {
  return {
    md5,
    base64Encode,
    base64Decode,
    gzip,
    ungzip,
    aesX,
    desX,
    rc4,
    rsaX,
    async ready() {
      return true;
    }
  };
}

// src/drpy3/lib/text.js
function cut(text, start, end, method = "", All = false) {
  try {
    const lr = new RegExp(String.raw`${start}`.toString());
    const rr = new RegExp(String.raw`${end}`.toString());
    const segments = String(text).split(lr);
    if (segments.length < 2) return "";
    const cutSegments = segments.slice(1).map((segment) => {
      const parts = segment.split(rr);
      return parts.length < 2 ? void 0 : parts[0] + end;
    }).filter(Boolean);
    return All ? `[${cutSegments.join(",")}]` : cutSegments[0] || "";
  } catch {
    return "";
  }
}
function encodeStr(input, encoding = "gbk") {
  if (String(encoding).startsWith("gb") && peer_exports.gbkTool) return peer_exports.gbkTool.encode(input);
  return input;
}
function decodeStr(input, encoding = "gbk") {
  if (String(encoding).startsWith("gb") && peer_exports.gbkTool) return peer_exports.gbkTool.decode(input);
  return input;
}
function installStringUtils() {
  if (String.prototype.replaceX) return;
  Object.defineProperties(String.prototype, {
    replaceX: {
      value: function(regex, replacement) {
        const hasCaptureGroup = /\$\d/.test(replacement);
        return this.replace(regex, hasCaptureGroup ? replacement : (m, p1) => m.replace(new RegExp(p1), replacement));
      },
      configurable: true,
      enumerable: false,
      writable: true
    },
    parseX: {
      get() {
        try {
          return JSON.parse(this.toString());
        } catch {
          return this.startsWith("[") ? [] : {};
        }
      },
      configurable: true,
      enumerable: false
    }
  });
}
function makeText() {
  return {
    UA,
    urlencode,
    cut,
    encodeStr,
    decodeStr,
    stringUtils: installStringUtils
  };
}

// src/drpy3/lib/wasm.js
function isWasmBytes(bytes) {
  return bytes && bytes.length >= 4 && bytes[0] === 0 && bytes[1] === 97 && bytes[2] === 115 && bytes[3] === 109;
}
function b64ToBytes(b64) {
  return wordArrayToBytes(peer_exports.CryptoJS.enc.Base64.parse(String(b64)));
}
function bytesHash(bytes) {
  let s = "";
  const CHUNK = 32768;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return hashStr(s);
}
function withTimeout(promise, ms, msg) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Drpy3Error("wasm", "load", msg)), ms))
  ]);
}
function makeShim() {
  const noop = () => {
  };
  const atobShim = (s) => {
    const bytes = b64ToBytes(s);
    let out = "";
    for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
    return out;
  };
  const btoaShim = (s) => peer_exports.CryptoJS.enc.Base64.stringify(peer_exports.CryptoJS.enc.Utf8.parse(s));
  return {
    window: {},
    process: { env: {}, platform: "drpy3", nextTick: (fn) => setTimeout(fn, 0) },
    XMLHttpRequest: function() {
      this.open = noop;
      this.send = noop;
      this.setRequestHeader = noop;
      this.addEventListener = noop;
    },
    document: { createElement: () => ({ style: {}, setAttribute: noop, appendChild: noop }), currentScript: { src: "" } },
    location: { href: "file:///drpy3/", protocol: "file:" },
    Script: function() {
    },
    require: (name) => {
      throw new Error(`emscripten \u57AB\u7247\u4E0D\u5141\u8BB8\u5916\u90E8 require("${name}")\u2014\u2014wasm \u8D44\u4EA7\u5FC5\u987B\u81EA\u6D3D\u968F\u6E90\u5206\u53D1\uFF08\xA78 \u517C\u5BB9\u6027\u7EA2\u7EBF\uFF09`);
    },
    atob: atobShim,
    btoa: btoaShim
  };
}
async function compileWasmBytes(bytes) {
  if (typeof WebAssembly === "undefined" || !WebAssembly.instantiate) {
    throw new Drpy3Error("wasm", "load", "\u5F15\u64CE\u65E0 WebAssembly \u80FD\u529B\u2014\u2014\u68C0\u67E5 capabilities.wasm\uFF08native/polyfill/none\uFF09");
  }
  const result = await WebAssembly.instantiate(bytes);
  const instance = result.instance || result;
  return { exports: instance.exports };
}
async function loadEmscriptenGlue(code, key) {
  const shim = makeShim();
  const module_ = { exports: {} };
  const globalSnap = new Set(Object.getOwnPropertyNames(globalThis).filter((k) => typeof globalThis[k] === "function"));
  let factory;
  try {
    const fn = new Function(
      "module",
      "exports",
      "require",
      "window",
      "process",
      "XMLHttpRequest",
      "document",
      "location",
      "Script",
      "globalThis",
      "console",
      "WebAssembly",
      "TextEncoder",
      "TextDecoder",
      "atob",
      "btoa",
      code
    );
    fn(
      module_,
      module_.exports,
      shim.require,
      shim.window,
      shim.process,
      shim.XMLHttpRequest,
      shim.document,
      shim.location,
      shim.Script,
      globalThis,
      console,
      WebAssembly,
      TextEncoder,
      TextDecoder,
      shim.atob,
      shim.btoa
    );
  } catch (e) {
    throw new Drpy3Error("wasm", "load", `emscripten \u80F6\u6C34\u6267\u884C\u5931\u8D25: ${e.message} @${key}`);
  }
  let exported = module_.exports;
  const emptyExports = !exported || typeof exported === "object" && Object.keys(exported).length === 0;
  if (emptyExports) {
    const newFns = Object.getOwnPropertyNames(globalThis).filter((k) => !globalSnap.has(k) && typeof globalThis[k] === "function");
    if (newFns.length === 1) exported = globalThis[newFns[0]];
  }
  if (typeof exported === "function") {
    let settled = false;
    const ready = new Promise((resolve, reject) => {
      const arg = {
        onRuntimeInitialized() {
          settled = true;
          setImmediate(() => resolve(inst));
        }
      };
      let inst;
      try {
        inst = exported(arg);
      } catch (e) {
        reject(new Drpy3Error("wasm", "load", `emscripten \u5DE5\u5382\u8C03\u7528\u5931\u8D25: ${e && e.message ? e.message : String(e)} @${key}`));
        return;
      }
      if (inst && typeof inst === "object" && typeof inst._jsmalloc === "function" && inst.HEAP8) {
        settled = true;
        resolve(inst);
        return;
      }
      if (inst && typeof inst.then === "function") {
        Promise.resolve(inst).then((m) => {
          settled = true;
          resolve(m);
        }, (e) => reject(new Drpy3Error("wasm", "load", `emscripten \u5B9E\u4F8B\u5316 rejected: ${e && e.message || e} @${key}`)));
      } else if (inst && typeof inst.onRuntimeInitialized === "function" && !arg.onRuntimeInitialized) {
        inst.onRuntimeInitialized = () => {
          settled = true;
          resolve(inst);
        };
      } else {
        Promise.resolve().then(() => {
          if (!settled) resolve(inst);
        });
      }
    });
    return await withTimeout(ready, 3e4, `emscripten \u8FD0\u884C\u65F6\u5C31\u7EEA\u8D85\u65F6(30s) @${key}`);
  }
  if (exported && typeof exported === "object") return exported;
  throw new Drpy3Error("wasm", "load", `\u65E0\u6CD5\u8BC6\u522B\u7684 wasm \u8D44\u4EA7\u5F62\u6001: ${typeof exported} @${key}`);
}
function makeWasm(rt) {
  const cache = rt.__wasmCache || (rt.__wasmCache = /* @__PURE__ */ new Map());
  async function loadCached(key, produce) {
    if (cache.has(key)) return cache.get(key);
    const mod = await produce();
    cache.set(key, mod);
    return mod;
  }
  async function load(source) {
    try {
      if (source instanceof Uint8Array) {
        return await loadCached("bytes:" + bytesHash(source), () => compileWasmBytes(source));
      }
      if (typeof source !== "string" || !source) {
        throw new Drpy3Error("wasm", "load", "wasm.load \u53C2\u6570\u9700\u4E3A\u8DEF\u5F84\u5B57\u7B26\u4E32\u6216 Uint8Array");
      }
      if (/^https?:\/\//.test(source)) {
        const req = rt.resolve("req");
        const res = await req(source, { buffer: 2 });
        return await loadCached("url:" + source, async () => {
          const bytes = b64ToBytes(res.content);
          if (isWasmBytes(bytes)) return await compileWasmBytes(bytes);
          return await loadEmscriptenGlue(
            new TextDecoder().decode(bytes),
            "url:" + source
          );
        });
      }
      const loader = rt.resolve("loadAsset");
      if (typeof loader !== "function") {
        throw new Drpy3Error("wasm", "load", `HostEnv \u672A\u6CE8\u5165 loadAsset\u2014\u2014\u65E0\u6CD5\u8BFB\u53D6\u968F\u6E90 wasm \u8D44\u4EA7: ${source}`);
      }
      return await loadCached("path:" + source, async () => {
        let content = await loader(source);
        if (content instanceof Uint8Array) {
          if (isWasmBytes(content)) return await compileWasmBytes(content);
          content = new TextDecoder().decode(content);
        }
        if (typeof content !== "string") {
          throw new Drpy3Error("wasm", "load", `loadAsset \u8FD4\u56DE\u7C7B\u578B\u4E0D\u652F\u6301: ${typeof content}`);
        }
        const trimmed = content.trimStart();
        if (trimmed.startsWith("{") || trimmed.startsWith("asm")) {
          try {
            const bytes = b64ToBytes(content);
            if (isWasmBytes(bytes)) return await compileWasmBytes(bytes);
          } catch {
          }
        }
        return await loadEmscriptenGlue(content, source);
      });
    } catch (e) {
      if (e instanceof Drpy3Error) throw e;
      throw new Drpy3Error("wasm", "load", e);
    }
  }
  return { load };
}

// src/drpy3/context.js
var NET_ALIASES = ["req", "request", "post", "reqCookie", "batchFetch", "all", "download"];
var PARSE_ALIASES = ["pdfh", "pdfa", "pd", "pdfl", "jp", "jinja2", "parseRule"];
var CRYPTO_ALIASES = ["md5", "base64Encode", "base64Decode", "gzip", "ungzip", "aesX", "desX", "rc4", "rsaX"];
var UTILS_ALIASES = ["joinUrl", "getHome", "urlencode", "buildUrl", "buildQueryString", "forceOrder", "\u662F\u5426\u6B63\u7248", "urlDeal", "getProxyUrl"];
function runtimeNs(rt, name, factory) {
  if (!rt.__libCache) rt.__libCache = {};
  if (!rt.__libCache[name]) rt.__libCache[name] = factory(rt);
  return rt.__libCache[name];
}
function pick(ns, names) {
  const out = {};
  for (const n of names) if (ns[n] !== void 0) out[n] = ns[n];
  return out;
}
function buildCtx(instance, call = {}) {
  const rt = instance.rt;
  const ctx2 = {
    // ═══ 调用态（每次调用全新，天然隔离 §4.3）═══
    stage: call.stage || "",
    url: call.url || "",
    // 原 MY_URL
    input: call.input !== void 0 ? call.input : "",
    // play/search 场景入参回显
    flag: call.flag !== void 0 ? call.flag : "",
    wd: call.wd !== void 0 ? call.wd : "",
    pg: call.pg !== void 0 ? call.pg : 1,
    fl: call.fl || {},
    // category 场景筛选（原 extend）
    scratch: {},
    // 临时篮子（原 VODS/VOD/TABS/LISTS 归宿）
    fetchParams: JSON.parse(JSON.stringify(instance.fetchParamsBaseline)),
    // 调用级请求参数基线
    // ═══ 实例态的只读投影（headers 例外：可变实例基线 §4.4）═══
    get rule() {
      return instance.rule;
    },
    key: instance.key,
    meta: instance.meta,
    headers: instance.headers,
    // 可变：init/任意调用中更新，实例内后续请求自动携带
    resumed: !!call.resumed,
    // 复温标记（§4.6 层次 B）
    // ═══ 能力 ═══
    log: (...args) => rt.resolve("log")(...args),
    store: instance.store,
    cache: instance.cache,
    capabilities: rt.capabilities,
    __sync: !!instance.is2x,
    // load2x 片段作用域开关：request 走同步桥（drpy2 同步语义）
    __rt: rt
    // 片段同步桥需要 rt 解析 syncReq
  };
  ctx2.lib = {
    net: makeNet(rt, ctx2),
    // net 绑定调用态（headers 合并需要 ctx）
    parse: runtimeNs(rt, "parse", makeParse),
    crypto: runtimeNs(rt, "crypto", makeCrypto),
    text: runtimeNs(rt, "text", makeText),
    utils: runtimeNs(rt, "utils", makeUtils),
    wasm: runtimeNs(rt, "wasm", makeWasm),
    store: instance.store,
    cache: instance.cache
  };
  Object.assign(ctx2, pick(ctx2.lib.net, NET_ALIASES));
  Object.assign(ctx2, pick(ctx2.lib.parse, PARSE_ALIASES));
  Object.assign(ctx2, pick(ctx2.lib.crypto, CRYPTO_ALIASES));
  Object.assign(ctx2, pick(ctx2.lib.utils, UTILS_ALIASES));
  return ctx2;
}

// src/drpy3/lib/cache.js
function makeCache({ defaultTtl = 300, sweepInterval = 60 } = {}) {
  const m = /* @__PURE__ */ new Map();
  let lastSweep = Date.now();
  function sweepIfNeeded() {
    const now = Date.now();
    if (now - lastSweep < sweepInterval * 1e3) return;
    lastSweep = now;
    for (const [k, v] of m) if (v.expireAt <= now) m.delete(k);
  }
  return {
    async get(key) {
      const e = m.get(key);
      if (!e) return void 0;
      if (e.expireAt <= Date.now()) {
        m.delete(key);
        return void 0;
      }
      return e.value;
    },
    async set(key, value, ttl = defaultTtl) {
      sweepIfNeeded();
      m.set(key, { value, expireAt: Date.now() + ttl * 1e3 });
      return value;
    },
    async delete(key) {
      m.delete(key);
    }
  };
}

// src/drpy3/lifecycle.js
var HOOKS = ["init", "home", "homeVod", "category", "detail", "play", "search", "proxy", "action", "sniffer", "isVideo"];
function hashStr(str, seed = 0) {
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
function detectForm(def) {
  if (!def || typeof def !== "object") throw new Drpy3Error("load", "", "\u6E90\u5FC5\u987B\u5BFC\u51FA\u5BF9\u8C61\uFF08{meta, rule, ...\u94A9\u5B50}\uFF09");
  for (const h of HOOKS) {
    if (typeof def[h] === "function") return "enhanced";
  }
  return "declarative";
}
var sourceProto = {
  /** 实例状态字段初始化（由 createSource 调用） */
  initFields(rt, def, opts = {}) {
    this.rt = rt;
    this.def = def;
    this.form = detectForm(def);
    this.path = opts.path || "";
    this.extend = opts.extend;
    this.meta = def.meta || {};
    this.rawRule = def.rule || {};
    this.key = opts.key || "drpy_" + (this.meta.title || this.meta.host || Math.random().toString(36).slice(2));
    this.rule = null;
    this.headers = {};
    this.fetchParamsBaseline = { headers: {}, timeout: 5e3, encoding: "utf-8" };
    this.cache = makeCache();
    this.store = makeStore(rt.resolve("store"), this.key);
    this.hot = false;
    this.lastUsed = 0;
    this.inFlight = 0;
    this.signature = opts.signature || "";
    this.headersSnapshot = null;
    this.stateVersion = this.meta.stateVersion || "";
    this.pinned = (rt.pinList || []).includes(this.key);
    this.destroying = false;
    this._resumed = false;
    this._warming = null;
    this._rebuilding = null;
  },
  /** Cold → Hot 复温（调用到达时触发）：signature 惰性比对 → 快照复温/冷启动 → 并发复温排队 */
  async ensureHot() {
    this.lastUsed = Date.now();
    if (this.hot && this.rt.lifecycle) {
      try {
        await this.rt.lifecycle.checkHotUpdate(this);
      } catch {
      }
    }
    if (this.hot) return;
    if (this._warming) return this._warming;
    this._warming = (async () => {
      const resumed = !!(this.headersSnapshot && this.headersSnapshot.headers);
      await this._warm(resumed);
      this.headersSnapshot = null;
    })();
    try {
      await this._warming;
    } finally {
      this._warming = null;
    }
  },
  /** rule 定稿 ①②（host/url 拼接 + headers 基线/fetchParams 基线），_warm 与热更失败回退共用 */
  _finalizeRule() {
    const rule2 = { ...this.rawRule };
    const join = (base, u) => this.rt.resolve("joinUrl")(base, u);
    const joinMaybe = (u) => {
      if (!u) return "";
      const str = String(u);
      if (str.includes("[") && str.includes("]")) {
        const u1 = str.split("[")[0];
        const u2 = str.split("[")[1].split("]")[0];
        return (rule2.host ? join(rule2.host, u1) : u1) + "[" + (rule2.host ? join(rule2.host, u2) : u2) + "]";
      }
      return rule2.host ? join(rule2.host, str) : str;
    };
    rule2.host = String(rule2.host || this.meta.host || "").replace(/\/+$/, "");
    rule2.homeUrl = rule2.host && rule2.homeUrl ? join(rule2.host, rule2.homeUrl) : rule2.homeUrl || rule2.host;
    rule2.detailUrl = rule2.host && rule2.detailUrl ? join(rule2.host, rule2.detailUrl) : rule2.detailUrl || "";
    rule2.url = joinMaybe(rule2.url || "");
    rule2.searchUrl = joinMaybe(rule2.searchUrl || "");
    rule2.headers = resolveUaConstants({ ...rule2.headers && typeof rule2.headers === "object" ? rule2.headers : {} });
    rule2.timeout = rule2.timeout || 5e3;
    rule2.encoding = rule2.encoding || rule2.\u7F16\u7801 || "utf-8";
    this.rule = rule2;
    this.headers = { ...rule2.headers };
    this.fetchParamsBaseline = { headers: { ...this.headers }, timeout: rule2.timeout, encoding: rule2.encoding };
  },
  async _warm(resumed = false) {
    const snap = this.headersSnapshot;
    const canResume = !!(resumed && snap && snap.stateVersion === (this.def.meta && this.def.meta.stateVersion || ""));
    this._finalizeRule();
    if (canResume && snap) Object.assign(this.headers, snap.headers);
    if (typeof this.def.init === "function") {
      const ctx2 = buildCtx(this, { stage: "init", resumed: canResume });
      await this.def.init.call(this, ctx2, this.extend);
    }
    this.hot = true;
    this._resumed = canResume;
  },
  /** 驱逐（§4.6）：in-flight 排空才释放（未排空则挂 pendingEvict）；headers 快照存档供复温回填 */
  async evict() {
    if (!this.hot) return true;
    if (this.inFlight > 0) {
      this.pendingEvict = true;
      return false;
    }
    this.headersSnapshot = { headers: { ...this.headers }, stateVersion: this.stateVersion };
    this.hot = false;
    this.cache = makeCache();
    this.rule = null;
    return true;
  },
  /** 壳子钉住（§4.6 pinList）：驱逐豁免 */
  pin() {
    this.pinned = true;
  },
  unpin() {
    this.pinned = false;
  },
  /** 通用调度：ensureHot → 构造 ctx → 钩子(优先)/声明式默认实现 → 工程化报错包装。
   *  action 通道挂专用长超时（§10.2，默认 60s，HostEnv.actionTimeoutMs 可配） */
  async _dispatch(stage, args, callCtx, hook) {
    await this.ensureHot();
    this.inFlight++;
    try {
      const ctx2 = buildCtx(this, { stage, resumed: !!this._resumed, ...callCtx });
      const invoke = async () => {
        const fn = hook && typeof this.def[hook] === "function" ? this.def[hook] : null;
        if (fn) {
          const r = await fn.call(this, ctx2, ...args);
          return r === void 0 ? {} : r;
        }
        const defaults2 = this.rt.defaults;
        if (defaults2 && typeof defaults2[stage] === "function") {
          const r = await defaults2[stage].call(this, ctx2, ...args);
          return r === void 0 ? {} : r;
        }
        if (stage === "action") return "";
        throw new Drpy3Error(stage, "", `\u6E90\u672A\u5B9E\u73B0 ${hook || stage} \u94A9\u5B50\uFF0C\u4E14\u65E0\u58F0\u660E\u5F0F\u9ED8\u8BA4\u5B9E\u73B0`);
      };
      if (stage === "action") {
        const timeoutMs = this.rt.actionTimeoutMs || 6e4;
        return await Promise.race([
          invoke(),
          new Promise((_, reject) => setTimeout(() => reject(new Drpy3Error(
            "action",
            "",
            `action \u901A\u9053\u54CD\u5E94\u8D85\u65F6(${timeoutMs}ms)\u2014\u2014\u591A\u8F6E\u4EA4\u4E92/\u8F93\u5165\u7C7B\u52A8\u4F5C\u9700\u5728\u65F6\u9650\u5185\u8FD4\u56DE`
          )), timeoutMs))
        ]);
      }
      return await invoke();
    } catch (e) {
      if (e instanceof Drpy3Error) throw e;
      throw new Drpy3Error(stage, "", e, this.meta.title || this.key);
    } finally {
      this.inFlight--;
      this.lastUsed = Date.now();
      if (this.pendingEvict && this.inFlight === 0) {
        this.pendingEvict = false;
        this.evict();
      }
    }
  },
  // ═══ 六环节 + 扩展通道（壳子签名；createSource 绑定为实例自身属性）═══
  async init(extend2) {
    if (extend2 !== void 0) this.extend = extend2;
    this.hot = false;
    await this.ensureHot();
  },
  /** 通用环节调用（CLI drpy3 test / 壳子动态分发共用）：按 stage 组装调用态并调度 */
  async callStage(stage, ...args) {
    const fn = stage;
    const ctxMap = {
      home: () => ({}),
      homeVod: () => ({}),
      category: () => ({ fl: args[3] || {}, pg: args[1] || 1 }),
      detail: () => ({ input: args[0], url: "" }),
      play: () => ({ flag: args[0], input: args[1], url: args[1] }),
      search: () => ({ wd: args[0], quick: !!args[1], pg: args[2] || 1 }),
      proxy: () => ({ input: args[0] }),
      action: () => ({ input: args[1] }),
      sniffer: () => ({}),
      isVideo: () => ({ input: args[0], url: args[0] })
    };
    const build = ctxMap[stage] || (() => ({}));
    return this._dispatch(stage, args, build(), fn);
  },
  async home(filter2) {
    return this.callStage("home", filter2);
  },
  async homeVod(params) {
    return this.callStage("homeVod", params);
  },
  async category(tid2, pg2, filter2, extend2) {
    return this.callStage("category", tid2, pg2, filter2, extend2);
  },
  async detail(id) {
    await this.ensureHot();
    const raw = String(id == null ? "" : id);
    const hookId = this.rule && this.rule.detailUrl && raw.includes("$") ? raw.slice(raw.indexOf("$") + 1) : raw;
    return this._dispatch("detail", [hookId, raw], { input: raw, url: "" }, "detail");
  },
  async play(flag, id, flags) {
    return this.callStage("play", flag, id, flags);
  },
  async search(wd, quick, pg2) {
    return this.callStage("search", wd, quick, pg2);
  },
  async proxy(params) {
    return this.callStage("proxy", params);
  },
  async action(action, value) {
    return this.callStage("action", action, value);
  },
  async sniffer() {
    return this.callStage("sniffer");
  },
  async isVideo(url2) {
    return this.callStage("isVideo", url2);
  }
};
var SHELL_METHODS = ["init", "home", "homeVod", "category", "detail", "play", "search", "proxy", "action", "sniffer", "isVideo"];
function createSource(rt, def, opts = {}) {
  const proto = Object.assign(Object.create(sourceProto), def);
  const inst = Object.create(proto);
  sourceProto.initFields.call(inst, rt, def, opts);
  for (const name of SHELL_METHODS) {
    inst[name] = sourceProto[name].bind(inst);
  }
  return inst;
}
var DEFAULT_LIFECYCLE = { idleTTL: 120, maxHot: 16, watermark: 0.7, watermarkTarget: 0.5 };
var LifecycleManager = class {
  /**
   * @param rt Runtime
   * @param opts {idleTTL 秒, maxHot, memUsage:()=>0..1, watermark, watermarkTarget}
   */
  constructor(rt, opts = {}) {
    this.rt = rt;
    this.idleTTL = opts.idleTTL != null ? opts.idleTTL : DEFAULT_LIFECYCLE.idleTTL;
    this.maxHot = opts.maxHot != null ? opts.maxHot : DEFAULT_LIFECYCLE.maxHot;
    this.memUsage = typeof opts.memUsage === "function" ? opts.memUsage : null;
    this.watermark = opts.watermark != null ? opts.watermark : DEFAULT_LIFECYCLE.watermark;
    this.watermarkTarget = opts.watermarkTarget != null ? opts.watermarkTarget : DEFAULT_LIFECYCLE.watermarkTarget;
    this.sources = /* @__PURE__ */ new Map();
  }
  register(src) {
    this.sources.set(src.key, src);
  }
  sourcesList() {
    return [...this.sources.values()];
  }
  /** 重建成本评分（§4.6）：声明式(0) < 普通异步(1) < initCost=high(2)——从便宜的开始驱逐 */
  _score(src) {
    if (src.meta && src.meta.initCost === "high") return 2;
    return src.form === "declarative" ? 0 : 1;
  }
  _victims() {
    return this.sourcesList().filter((s) => s.hot && !s.pinned && s.inFlight === 0).sort((a, b) => this._score(a) - this._score(b) || a.lastUsed - b.lastUsed);
  }
  /** signature 惰性热更（每次调用前比对，不强制 watcher）：内容指纹变化 = 强制驱逐重建 */
  async checkHotUpdate(src) {
    const loadAsset = this.rt.hostEnv.loadAsset;
    if (!src.path || typeof loadAsset !== "function") return;
    let content;
    try {
      content = await loadAsset(src.path);
    } catch {
      return;
    }
    if (typeof content !== "string") return;
    const sig = hashStr(content);
    if (sig === src.signature) return;
    if (src._rebuilding) {
      await src._rebuilding;
      return;
    }
    src._rebuilding = this._rebuild(src, content, sig).finally(() => {
      src._rebuilding = null;
    });
    await src._rebuilding;
  }
  /** 原子替换重建；失败 → 保留旧实例继续服务（§4.6），错误挂 src.lastError 上报 */
  async _rebuild(src, code, sig) {
    const old = {
      def: src.def,
      meta: src.meta,
      rawRule: src.rawRule,
      form: src.form,
      signature: src.signature,
      stateVersion: src.stateVersion
    };
    try {
      const def = await this.rt.evaluateSource(code, { path: src.path, key: src.key });
      src.def = def;
      src.meta = def.meta || {};
      src.rawRule = def.rule || {};
      src.form = detectForm(def);
      src.signature = sig;
      src.stateVersion = src.meta.stateVersion || "";
      src.hot = false;
      if (!src.headersSnapshot) {
        src.headersSnapshot = { headers: { ...src.headers }, stateVersion: old.stateVersion };
      }
      await src._warm(true);
      src.headersSnapshot = null;
      this._log(`[drpy3] \u6E90\u70ED\u66F4\u5B8C\u6210: ${src.key}`);
    } catch (e) {
      Object.assign(src, old);
      src._finalizeRule();
      src.hot = true;
      src.lastError = e;
      this._log(`[drpy3] \u6E90\u70ED\u66F4\u5931\u8D25\uFF0C\u4FDD\u7559\u65E7\u5B9E\u4F8B\u7EE7\u7EED\u670D\u52A1: ${src.key} \u2014 ${e.message}`);
    }
  }
  _log(...args) {
    try {
      const log = this.rt.resolve("log");
      if (typeof log === "function") log(...args);
    } catch {
    }
  }
  /** 自动治理：空闲 LRU → maxHot 上限 → 内存水位（驱逐最冷至目标水位）。壳子零管理成本 */
  async sweep({ force = false } = {}) {
    const report = { evicted: [] };
    const now = Date.now();
    for (const src of this.sourcesList()) {
      if (!src.hot || src.pinned || src.inFlight > 0) continue;
      if (force || now - src.lastUsed > this.idleTTL * 1e3) {
        if (await src.evict()) report.evicted.push(src.key);
      }
    }
    let hotCount = this.sourcesList().filter((s) => s.hot).length;
    for (const v of this._victims()) {
      if (hotCount <= this.maxHot) break;
      if (await v.evict()) {
        report.evicted.push(v.key);
        hotCount--;
      }
    }
    if (this.memUsage) {
      while (this.memUsage() > this.watermark) {
        const victims = this._victims();
        if (!victims.length) break;
        if (!await victims[0].evict()) break;
        report.evicted.push(victims[0].key);
        if (this.memUsage() <= this.watermarkTarget) break;
      }
    }
    return report;
  }
};

// src/drpy3/compat/drpy2.js
function makeJsUtil() {
  return {
    toString(func) {
      return func.toString().replace(/^\(\)(\s+)?=>(\s+)?\{/, "js:").replace(/\}$/, "");
    }
  };
}
function evalDrpy2Rule(code) {
  const fn = new Function("$js", String(code) + "\n;return rule;");
  return fn(makeJsUtil());
}
function looksLikeDrpy2(code) {
  const head = String(code).slice(0, 2500);
  return /lang['"]?\s*:\s*['"]dr2['"]/.test(head) || /^\s*var\s+rule\s*=/m.test(String(code));
}
var SERIAL_METHODS = ["init", "home", "homeVod", "category", "detail", "play", "search", "proxy", "action", "sniffer", "isVideo"];
function createSource2x(rt, code, opts = {}) {
  const rule2 = evalDrpy2Rule(code);
  if (!rule2 || typeof rule2 !== "object") {
    throw new Error("load2x\uFF1A\u6E90\u7801\u672A\u5B9A\u4E49 var rule \u5BF9\u8C61");
  }
  if (!Object.prototype.hasOwnProperty.call(rule2, "play_json")) rule2.play_json = [];
  const meta = {
    title: rule2.title || "",
    host: rule2.host || "",
    searchable: rule2.searchable,
    filterable: rule2.filterable,
    quickSearch: rule2.quickSearch,
    lang: "dr2"
  };
  const src = createSource(rt, { meta, rule: rule2 }, { ...opts, key: opts.key || "drpy_" + (rule2.title || rule2.host) });
  src.is2x = true;
  let chain = Promise.resolve();
  for (const name of SERIAL_METHODS) {
    const orig = src[name];
    src[name] = (...args) => {
      const run = () => orig.apply(src, args);
      chain = chain.then(run, run);
      return chain;
    };
  }
  return src;
}

// src/drpy3/modules/loader.js
var ASYNC_FN = Object.getPrototypeOf(async function() {
}).constructor;
async function evalSourceNeutral(code, opts = {}) {
  const src = String(code);
  const hasRelativeImport = /(?:^|\n)\s*import\s+[^'"]*['"]\.\.?\/([^'"]*)['"]/.test(src) || /(?:^|\n)\s*import\s+['"]\.\.?\/([^'"]*)['"]/.test(src);
  if (hasRelativeImport) {
    throw new Drpy3Error(
      "load",
      "module",
      `\u6E90\u542B\u76F8\u5BF9\u8DEF\u5F84\u6A21\u5757 import\uFF08${opts.path || "\u672A\u547D\u540D\u6E90"}\uFF09\uFF0C\u5F53\u524D\u5F15\u64CE\u65E0\u6A21\u5757\u80FD\u529B\u2014\u2014\u8BF7\u4F7F\u7528\u6A21\u5F0F A \u539F\u751F loader / \u6A21\u5F0F B \u9884\u6253\u5305 / \u6A21\u5F0F C CJS shim\uFF08\u8BBE\u8BA1 \xA78.2\uFF09`
    );
  }
  let body = src.replace(/^[ \t]*import[ \t]+[^;'"]*['"]drpy3['"][ \t]*;?[ \t]*$/gm, "").replace(/^[ \t]*import[ \t]*['"]drpy3['"][ \t]*;?[ \t]*$/gm, "");
  const asDefaultRe = /(?:^|\n)[ \t]*export[ \t]*\{[^}]*?([A-Za-z_$][\w$]*)[ \t]+as[ \t]+default[^}]*\}[ \t]*;?[ \t]*(?=\n|$)/;
  const asDefault = body.match(asDefaultRe);
  if (asDefault) body = body.replace(asDefaultRe, "\nreturn " + asDefault[1] + ";");
  const hasExportDefault = /(?:^|\n)[ \t]*export[ \t]+default[ \t]/.test(body) || !!asDefault;
  body = body.replace(/(?:^|\n)[ \t]*export[ \t]+default[ \t]*/g, "\nreturn ");
  body = body.replace(/(?:^|\n)[ \t]*export[ \t]+\{[^}]*\}[ \t]*;?[ \t]*(?=\n|$)/g, "\n");
  if (!hasExportDefault) {
    throw new Drpy3Error("load", "module", `\u6E90\u672A\u627E\u5230 export default\uFF08${opts.path || "\u672A\u547D\u540D\u6E90"}\uFF09\u2014\u2014drpy3 \u6E90\u5FC5\u987B default \u5BFC\u51FA rule \u5BF9\u8C61\u6216 defineSource \u5305\u88C5`);
  }
  try {
    const fn = new ASYNC_FN("defineSource", "lib", body);
    return await fn(_neutralDefineSource, void 0);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Drpy3Error("load", "module", `\u6E90\u8BED\u6CD5\u9519\u8BEF: ${e.message}\uFF08\u82E5\u6E90\u4F7F\u7528 require/ESM \u6DF7\u5408\u8BED\u6CD5\uFF0C\u8BF7\u8D70\u6A21\u5F0F B \u9884\u6253\u5305 \xA78.2\uFF09`);
    }
    throw e;
  }
}
function _neutralDefineSource(source) {
  return source;
}
function resolveRel(fromDir, spec) {
  const raw = spec.replace(/^\.\//, "");
  const parts = (fromDir ? fromDir.split("/") : []).filter(Boolean);
  for (const seg of raw.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return parts.join("/");
}
function transformEsmToCjs(src) {
  const names = [];
  for (const m of src.matchAll(/^[ \t]*export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm)) names.push(m[1]);
  for (const m of src.matchAll(/^[ \t]*export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm)) names.push(m[1]);
  let out = src.replace(
    /^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm,
    (m, clause, spec) => `const {${clause.trim()}} = require('${spec}');`
  ).replace(
    /^[ \t]*import\s+([A-Za-z_$][\w$]*)\s+from\s*['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm,
    (m, local, spec) => `const ${local} = require('${spec}');`
  ).replace(
    /^[ \t]*import\s*['"]([^'"]+)['"][ \t]*;?[ \t]*$/gm,
    (m, spec) => `require('${spec}');`
  ).replace(/^[ \t]*export\s+(?=(?:async\s+)?function\b|(?:const|let|var)\b)/gm, "");
  out = out.replace(/(^[ \t]*)export[ \t]+default[ \t]*/m, "$1module.exports.default = ");
  if (names.length) out += `
;Object.assign(module.exports, {${names.join(", ")}});`;
  return out;
}
async function evalSourceCjs(code, opts, rt) {
  const loadAsset = rt.resolve("loadAsset");
  if (typeof loadAsset !== "function") {
    throw new Drpy3Error("load", "module", "\u6A21\u5F0F C \u9700\u8981 HostEnv \u6CE8\u5165 loadAsset(path)\u2014\u2014\u8BFB\u53D6\u968F\u6E90\u6A21\u5757\u6587\u4EF6");
  }
  const cache = /* @__PURE__ */ new Map();
  const entryDir = opts && opts.path ? opts.path.replace(/[^/]*$/, "") : "";
  function makeRequire(dir) {
    return (spec) => {
      if (spec === "drpy3") return { defineSource: (s) => s };
      if (/^(https?:)?\/\//.test(spec)) {
        throw new Drpy3Error("load", "module", `\u8FDC\u7AEF require \u88AB\u62D2\u7EDD\uFF08\xA78.2 \u7EA2\u7EBF\uFF09: ${spec}\u2014\u2014\u6A21\u5757\u5FC5\u987B\u968F\u6E90\u5206\u53D1`);
      }
      if (!spec.startsWith(".")) {
        throw new Drpy3Error("load", "module", `\u6A21\u5F0F C \u4EC5\u652F\u6301\u76F8\u5BF9\u8DEF\u5F84\u6A21\u5757: ${spec}`);
      }
      const bytes = spec.endsWith("?bytes");
      const clean2 = bytes ? spec.slice(0, -"?bytes".length) : spec;
      const rel = resolveRel(dir, clean2);
      if (cache.has(rel)) return cache.get(rel);
      let content;
      try {
        content = loadAsset(rel);
      } catch (e) {
        throw new Drpy3Error("load", "module", `\u6A21\u5757\u8BFB\u53D6\u5931\u8D25: ${rel} \u2014 ${e.message}`);
      }
      if (content && typeof content.then === "function") {
        throw new Drpy3Error("load", "module", "\u6A21\u5F0F C \u9700\u8981\u540C\u6B65 loadAsset\uFF08CJS require \u4E3A\u540C\u6B65\u8BED\u4E49\uFF0C\xA78.2 \u6863 C \u5BBF\u4E3B\uFF09");
      }
      if (bytes) {
        const mod0 = { exports: content instanceof Uint8Array ? content : new TextEncoder().encode(String(content)) };
        cache.set(rel, mod0.exports);
        return mod0.exports;
      }
      if (typeof content !== "string") content = new TextDecoder().decode(content);
      const transformed2 = transformEsmToCjs(content);
      const module_ = { exports: {} };
      cache.set(rel, module_.exports);
      const fn = new Function("require", "module", "exports", transformed2);
      fn(makeRequire(rel.replace(/[^/]*$/, "")), module_, module_.exports);
      return module_.exports;
    };
  }
  let transformed;
  try {
    transformed = transformEsmToCjs(String(code));
    const module_ = { exports: {} };
    const fn = new Function("require", "module", "exports", transformed);
    fn(makeRequire(entryDir), module_, module_.exports);
    return module_.exports.default !== void 0 ? module_.exports.default : module_.exports;
  } catch (e) {
    if (e instanceof Drpy3Error) throw e;
    if (/import.{0,10}outside a module|Unexpected token/.test(String(e.message))) {
      throw new Drpy3Error("load", "module", `\u6A21\u5F0F C \u65E0\u6CD5\u89E3\u6790\u8BE5\u6E90\uFF08${e.message}\uFF09\u2014\u2014\u8BF7\u4F7F\u7528\u6A21\u5F0F B \u9884\u6253\u5305\uFF08drpy3 build\uFF0C\xA78.2\uFF09`);
    }
    throw new Drpy3Error("load", "module", e);
  }
}

// src/drpy3/rules/jsFragment.js
var ASYNC_FN2 = Object.getPrototypeOf(async function() {
}).constructor;
function mapSetResult(d2) {
  if (!Array.isArray(d2)) return [];
  return d2.map((it) => {
    const obj = {
      vod_id: it.url || "",
      vod_name: it.title || "",
      vod_remarks: it.desc || "",
      vod_content: it.content || "",
      vod_pic: it.pic_url || it.img || ""
    };
    if ("tname" in it) obj.type_name = it.tname || "";
    if ("tid" in it) obj.type_id = it.tid || "";
    if ("year" in it) obj.vod_year = it.year || "";
    if ("actor" in it) obj.vod_actor = it.actor || "";
    if ("director" in it) obj.vod_director = it.director || "";
    if ("area" in it) obj.vod_area = it.area || "";
    return obj;
  });
}
function makeSyncNet(rt, ctx2) {
  return (u, o, method) => {
    const syncReq = rt.resolve("syncReq");
    if (typeof syncReq !== "function") {
      throw new Error("load2x \u7247\u6BB5\u9700\u8981 HostEnv \u6CE8\u5165 syncReq(url, options)\u2014\u2014\u540C\u6B65 HTTP \u6865\uFF08\xA75.4 \u6863 C \u5951\u7EA6\uFF09");
    }
    const merged = mergeOptions(ctx2, u, { ...o || {}, ...method ? { method } : {} });
    const res = syncReq(u, merged);
    if (o && o.withHeaders) {
      return JSON.stringify({ ...res && res.headers || {}, body: res && res.content || "" });
    }
    return res && res.content || "";
  };
}
function buildFragmentScope(ctx2, extra = {}) {
  const syncCall = ctx2.__sync ? makeSyncNet(ctx2.__rt, ctx2) : null;
  const unwrap = (res, o) => {
    if (o && o.withHeaders && res && typeof res === "object") {
      return JSON.stringify({ ...res.headers || {}, body: res.content == null ? "" : String(res.content) });
    }
    return res && typeof res === "object" && "content" in res ? res.content : res;
  };
  const asyncReq = async (u, o, method) => {
    const res = await ctx2.lib.net.req(u, { ...o || {}, ...method ? { method } : {} });
    return unwrap(res, o);
  };
  const request = (u, o) => syncCall ? syncCall(u, o, "GET") : asyncReq(u, o, "GET");
  const post = (u, o) => syncCall ? syncCall(u, o, "POST") : asyncReq(u, o, "POST");
  const scope = {
    // ═══ 调用态回显（drpy2 全局名）═══
    input: ctx2.input !== void 0 ? ctx2.input : ctx2.url || "",
    MY_URL: ctx2.url || "",
    MY_FLAG: ctx2.flag || "",
    flag: ctx2.flag || "",
    KEY: ctx2.wd || "",
    wd: ctx2.wd || "",
    MY_PAGE: ctx2.pg || 1,
    MY_FL: ctx2.fl || {},
    fetch_params: ctx2.fetchParams,
    // ═══ net（老名 request/fetch/post；片段内保持 drpy2 老语义——request() 即响应文本，
    //     withHeaders 时为 headers+body 的 JSON 串；load2x 片段走同步桥 §5.4 档 C）═══
    request,
    fetch: request,
    post,
    reqCookie: (u, o, a) => ctx2.lib.net.reqCookie(u, o, a),
    batchFetch: (items) => ctx2.lib.net.batchFetch(items),
    // ═══ parse（pdf 三件套 + jsp/jq 句柄 + pdfl）═══
    pdfh: (h, p2, b) => ctx2.lib.parse.pdfh(h, p2, b),
    pdfa: (h, p2) => ctx2.lib.parse.pdfa(h, p2),
    pd: (h, p2, b) => ctx2.lib.parse.pd(h, p2, b || ctx2.url),
    // drpy2 pd2 语义：缺省 base 回退 MY_URL
    pdfl: (h, p2, lt, lu, mu) => ctx2.lib.parse.pdfl(h, p2, lt, lu, mu || ctx2.url),
    jsp: {
      pdfh: (h, p2, b) => ctx2.lib.parse.pdfh(h, p2, b),
      pdfa: (h, p2) => ctx2.lib.parse.pdfa(h, p2),
      pd: (h, p2, b) => ctx2.lib.parse.pd(h, p2, b || ctx2.url),
      jj: (p2, j) => ctx2.lib.parse.jp(p2, j)
    },
    jq: {
      pdfh: (h, p2, b) => ctx2.lib.parse.pdfh(h, p2, b),
      pdfa: (h, p2) => ctx2.lib.parse.pdfa(h, p2),
      pd: (h, p2, b) => ctx2.lib.parse.pd(h, p2, b || ctx2.url)
    },
    jinja2: (t, o) => ctx2.lib.parse.jinja2(t, o),
    jp: (p2, j) => ctx2.lib.parse.jp(p2, j),
    // ═══ setResult 系列（写 scope.VODS，不碰全局）═══
    setResult: (d2) => {
      scope.VODS = mapSetResult(d2);
      return scope.VODS;
    },
    setResult2: (res) => {
      scope.VODS = res && res.list || [];
      return scope.VODS;
    },
    setHomeResult: (res) => {
      scope.VODS = mapSetResult(res && res.list || []);
      return scope.VODS;
    },
    VOD: {},
    VODS: [],
    TABS: [],
    LISTS: [],
    // ═══ crypto/text/utils（drpy2 全局名）═══
    md5,
    base64Encode,
    base64Decode,
    gzip,
    ungzip,
    aesX,
    desX,
    rc4,
    rsaX,
    cut,
    urlencode,
    encodeUrl: (s) => encodeURI(s),
    joinUrl: (a, b) => ctx2.lib.utils.joinUrl(a, b),
    urljoin: (a, b) => ctx2.lib.utils.joinUrl(a, b),
    getHome: (u) => ctx2.lib.utils.getHome(u),
    urlDeal,
    \u662F\u5426\u6B63\u7248,
    forceOrder,
    stringUtils: () => ctx2.lib.text.stringUtils(),
    getProxyUrl: () => ctx2.lib.utils.getProxyUrl(),
    // ═══ UA 常量 ═══
    MOBILE_UA: UA.MOBILE_UA,
    PC_UA: UA.PC_UA,
    IOS_UA: UA.IOS_UA,
    UC_UA: UA.UC_UA,
    UA: UA.UA,
    // ═══ drpy3 能力 ═══
    lib: ctx2.lib,
    ctx: ctx2,
    log: (...a) => ctx2.log(...a),
    print: (...a) => ctx2.log(...a)
  };
  Object.assign(scope, extra);
  return scope;
}
async function runJsFragment(code, ctx2, extra = {}) {
  const scope = buildFragmentScope(ctx2, extra);
  const body = "with(__scope) {\n" + code + "\n}";
  const fn = new ASYNC_FN2("__scope", body);
  await fn(scope);
  return scope;
}

// src/drpy3/rules/defaults.js
var SPECIAL_URL = /^(ftp|magnet|thunder|ws):/;
function tellIsJx(url2) {
  try {
    return !/\.(m3u8|mp4|m4a)$/.test(url2.split("?")[0]) && \u662F\u5426\u6B63\u7248(url2) ? 1 : 0;
  } catch {
    return 1;
  }
}
async function evalFragment(name, code, ctx2, extra) {
  try {
    return await runJsFragment(code, ctx2, extra);
  } catch (e) {
    e.message = `\u7247\u6BB5[${name}]\u6267\u884C\u9519\u8BEF: ${e.message}`;
    throw e;
  }
}
var defaults = {
  async init(ctx2, ext) {
  },
  /** 首页：class_name/class_url 静态分类 + class_parse(js/选择器) + filter 解压（homeParse 语义） */
  async home(ctx2, filter2) {
    const rule2 = ctx2.rule;
    let classes = [];
    if (rule2.class_name && rule2.class_url) {
      const names = String(rule2.class_name).split("&");
      const urls = String(rule2.class_url).split("&");
      const cnt = Math.min(names.length, urls.length);
      for (let i = 0; i < cnt; i++) classes.push({ type_id: urls[i], type_name: names[i] });
    }
    if (rule2.class_parse && typeof rule2.class_parse === "string" && rule2.class_parse.startsWith("js:")) {
      const scope = await evalFragment("class_parse", stripJs(rule2.class_parse), ctx2, { input: rule2.homeUrl || "" });
      if (Array.isArray(scope.input)) classes = scope.input;
    } else if (rule2.class_parse) {
      try {
        const parts = String(rule2.class_parse).split(";");
        const res = await ctx2.lib.net.req(rule2.homeUrl || rule2.host);
        const list = ctx2.lib.parse.pdfa(res.content, parts[0]) || [];
        for (const it of list) {
          const name = ctx2.lib.parse.pdfh(it, parts[1] || "").trim();
          let url2 = ctx2.lib.parse.pd(it, parts[2] || "", rule2.homeUrl || rule2.host);
          if (parts[3]) url2 = (url2.match(new RegExp(parts[3])) || [])[1] || url2;
          classes.push({ type_id: url2.trim(), type_name: name.trim() });
        }
      } catch (e) {
        ctx2.log(`class_parse \u89E3\u6790\u5931\u8D25: ${e.message}`);
      }
    }
    if (rule2.cate_exclude) classes = classes.filter((it) => !new RegExp(rule2.cate_exclude).test(it.type_name));
    const resp = { class: classes };
    if (rule2.filter && typeof rule2.filter === "string" && rule2.filter.trim()) {
      try {
        rule2.filter = JSON.parse(ungzip(rule2.filter.trim()));
      } catch {
        rule2.filter = {};
      }
    }
    if (rule2.filter) resp.filters = rule2.filter;
    return resp;
  },
  /** 首页推荐：声明式 推荐 规则（缺省空列表） */
  async homeVod(ctx2) {
    const rule2 = ctx2.rule;
    if (!rule2.\u63A8\u8350 || typeof rule2.\u63A8\u8350 !== "string") return { list: [] };
    return await defaults.category(ctx2, "", 1, false, {}, rule2.\u63A8\u8350);
  },
  /**
   * 一级分类页：url 渲染（fyclass/fypage/[区间]/filter_url×jinja2）+ 'json:...' 或 js: 片段
   * @param ruleOverride 供 homeVod 复用（推荐 规则替代 一级）
   */
  async category(ctx, tid, pg, filter, extend, ruleOverride) {
    const rule = ctx.rule;
    let p = ruleOverride || rule.\u4E00\u7EA7;
    if (!p || typeof p !== "string") return {};
    const d = [];
    let url = rule.url.replaceAll("fyclass", tid);
    if (pg === 1 && url.includes("[") && url.includes("]")) {
      url = url.split("[")[1].split("]")[0];
    } else if (pg > 1 && url.includes("[") && url.includes("]")) {
      url = url.split("[")[0];
    }
    if (rule.filter_url) {
      if (!/fyfilter/.test(url)) {
        if (!url.endsWith("&") && !rule.filter_url.startsWith("&")) url += "&";
        url += rule.filter_url;
      } else {
        url = url.replace("fyfilter", rule.filter_url);
      }
      url = url.replaceAll("fyclass", tid);
      let fl = filter ? extend || {} : {};
      if (rule.filter_def && typeof rule.filter_def === "object" && rule.filter_def[tid]) {
        fl = Object.assign(JSON.parse(JSON.stringify(rule.filter_def[tid])), fl);
      }
      url = ctx.lib.parse.jinja2(url, { fl, fyclass: tid });
    }
    if (/fypage/.test(url)) {
      if (url.includes("(") && url.includes(")")) {
        const urlRep = url.match(/.*?\((.*)\)/)[1];
        const cntPg = urlRep.replaceAll("fypage", pg);
        url = url.replaceAll(urlRep, eval(cntPg)).replaceAll("(", "").replaceAll(")", "");
      } else {
        url = url.replaceAll("fypage", pg);
      }
    }
    ctx.url = url;
    ctx.input = url;
    p = p.trim();
    if (p.startsWith("js:")) {
      const scope = await evalFragment("\u4E00\u7EA7", stripJs(p), ctx, { TYPE: "cate" });
      d.push(...scope.VODS || []);
    } else {
      const list = await parseRule(p, ctx, { catePrefix: tid });
      d.push(...list);
    }
    if (d.length < 1) {
      return {
        list: [{ vod_name: "\u65E0\u6570\u636E,\u9632\u65E0\u9650\u8BF7\u6C42", vod_id: "no_data", vod_remarks: "\u4E0D\u8981\u70B9,\u4F1A\u5D29\u7684", vod_pic: "" }],
        total: 1,
        pagecount: 1,
        page: 1,
        limit: 1
      };
    }
    let pagecount = 999;
    if (rule.pagecount && typeof rule.pagecount === "object" && rule.pagecount[tid] != null) {
      pagecount = parseInt(rule.pagecount[tid]);
    }
    return { page: parseInt(pg) || 1, pagecount, limit: 20, total: 999, list: d };
  },
  /** 二级详情：js: 片段（VOD）/ '*'直连 / 对象形态（title/desc/tabs/lists，drpy2 detailParse 语义）。
   *  id=壳子按透传规则给出的 id（仅 detailUrl 路由源剥「分类$」，其余原样）；fullId=原始全文（vod_id 还原用） */
  async detail(ctx2, id, fullId) {
    const rule2 = ctx2.rule;
    const orId = String(id == null ? "" : id);
    const detailId = orId.split("@@")[0];
    let url2;
    if (!detailId.startsWith("http") && !detailId.includes("/")) {
      url2 = (rule2.detailUrl || "").replaceAll("fyid", detailId).replaceAll("fyclass", "");
    } else if (detailId.includes("/")) {
      url2 = ctx2.lib.utils.joinUrl(rule2.homeUrl || rule2.host, detailId);
    } else {
      url2 = detailId;
    }
    ctx2.url = url2;
    ctx2.input = url2;
    const p2 = rule2.\u4E8C\u7EA7;
    let vod = {
      vod_id: fullId != null ? fullId : id,
      vod_name: "\u7247\u540D",
      vod_pic: "",
      type_name: "\u7C7B\u578B",
      vod_year: "\u5E74\u4EFD",
      vod_area: "\u5730\u533A",
      vod_remarks: "\u66F4\u65B0\u4FE1\u606F",
      vod_actor: "\u4E3B\u6F14",
      vod_director: "\u5BFC\u6F14",
      vod_content: "\u7B80\u4ECB"
    };
    if (rule2.\u4E8C\u7EA7\u8BBF\u95EE\u524D && typeof rule2.\u4E8C\u7EA7\u8BBF\u95EE\u524D === "string") {
      await evalFragment("\u4E8C\u7EA7\u8BBF\u95EE\u524D", stripJs(rule2.\u4E8C\u7EA7\u8BBF\u95EE\u524D), ctx2, {});
    }
    if (p2 === "*") {
      vod.vod_play_from = "\u9053\u957F\u5728\u7EBF";
      vod.vod_remarks = rule2.detailUrl || "";
      vod.vod_content = url2;
      vod.vod_play_url = "\u55C5\u63A2\u64AD\u653E$" + String(id).split("@@")[0];
      return { list: [vod] };
    }
    if (typeof p2 === "string" && p2.trim().startsWith("js:")) {
      const scope = await evalFragment("\u4E8C\u7EA7", stripJs(p2), ctx2, { TYPE: "detail", play_url: "" });
      vod = scope.VOD || vod;
      if (!vod.vod_id || fullId && vod.vod_id !== fullId) vod.vod_id = fullId != null ? fullId : id;
      return { list: [vod] };
    }
    if (p2 && typeof p2 === "object") {
      const res = await ctx2.lib.net.req(url2);
      const html = res.content;
      const field = (sel) => ctx2.lib.parse.pdfh(html, sel).replace(/\n|\t/g, "").trim();
      if (p2.title) {
        const t = String(p2.title).split(";");
        vod.vod_name = field(t[0]);
        vod.type_name = t.length > 1 ? field(t[1]).replace(/ /g, "") : vod.type_name;
      }
      if (p2.desc) {
        const t = String(p2.desc).split(";");
        vod.vod_remarks = field(t[0] || "");
        vod.vod_year = t[1] ? field(t[1]) : vod.vod_year;
        vod.vod_area = t[2] ? field(t[2]) : vod.vod_area;
        vod.vod_actor = t[3] ? field(t[3]) : vod.vod_actor;
        vod.vod_director = t[4] ? field(t[4]) : vod.vod_director;
      }
      if (p2.content) vod.vod_content = field(String(p2.content).split(";")[0]);
      if (p2.img) vod.vod_pic = ctx2.lib.parse.pd(html, String(p2.img).split(";")[0], url2);
      let playFrom = ["\u9053\u957F\u5728\u7EBF"];
      const listsOut = [];
      if (p2.tabs) {
        playFrom = (ctx2.lib.parse.pdfa(html, String(p2.tabs).split(";")[0]) || []).map((v, i) => {
          let t = ctx2.lib.parse.pdfh(v, p2.tab_text || "body&&Text").trim() || "\u7EBF\u8DEF\u7A7A";
          return t;
        });
        if (!playFrom.length) playFrom = ["\u9053\u957F\u5728\u7EBF"];
      }
      if (p2.lists) {
        const listText = p2.list_text || "body&&Text";
        const listUrl = p2.list_url || "a&&href";
        for (let i = 0; i < playFrom.length; i++) {
          const p1 = String(p2.lists).replaceAll("#idv", playFrom[i]).replaceAll("#id", i);
          let newVodList = [];
          if (typeof ctx2.lib.parse.pdfl === "function") {
            newVodList = ctx2.lib.parse.pdfl(html, p1, listText, listUrl, url2);
          } else {
            const vodList = ctx2.lib.parse.pdfa(html, p1) || [];
            newVodList = vodList.map((it) => `${ctx2.lib.parse.pdfh(it, listText).trim()}$${ctx2.lib.parse.pd(it, listUrl, url2)}`);
          }
          listsOut.push(forceOrder(newVodList, "", (x) => x.split("$")[0]).join("#"));
        }
      }
      vod.vod_play_from = playFrom.join("$$$");
      vod.vod_play_url = listsOut.join("$$$") || "\u55C5\u63A2\u64AD\u653E$" + url2;
      if (!vod.vod_id) vod.vod_id = fullId != null ? fullId : id;
      return { list: [vod] };
    }
    vod.vod_play_from = "\u9053\u957F\u5728\u7EBF";
    vod.vod_play_url = "\u55C5\u63A2\u64AD\u653E$" + url2;
    return { list: [vod] };
  },
  /** 播放：play_parse+lazy js 免嗅，缺省 common_play（playParse 语义，play_json 默认 [] 不覆盖） */
  async play(ctx2, flag, id, flags) {
    const rule2 = ctx2.rule;
    let myUrl = String(id == null ? "" : id);
    if (!/http/.test(myUrl)) {
      try {
        myUrl = ctx2.lib.crypto.base64Decode(myUrl);
      } catch {
      }
    }
    try {
      myUrl = decodeURIComponent(myUrl);
    } catch {
    }
    ctx2.url = myUrl;
    ctx2.input = myUrl;
    const commonPlay = {
      parse: SPECIAL_URL.test(myUrl) || /^(push:)/.test(myUrl) ? 0 : 1,
      url: myUrl,
      flag,
      jx: tellIsJx(myUrl)
    };
    let lazyPlay = commonPlay;
    if (rule2.play_parse && rule2.lazy && typeof rule2.lazy === "string") {
      try {
        const scope = await evalFragment("lazy", stripJs(rule2.lazy), ctx2, { flag });
        lazyPlay = scope.input && typeof scope.input === "object" ? scope.input : {
          parse: SPECIAL_URL.test(scope.input) || /^(push:)/.test(scope.input) ? 0 : 1,
          jx: tellIsJx(scope.input),
          url: scope.input
        };
      } catch (e) {
        ctx2.log(`js\u514D\u55C5\u9519\u8BEF:${e.message}`);
        lazyPlay = commonPlay;
      }
    }
    if (Array.isArray(rule2.play_json) && rule2.play_json.length > 0) {
      for (const pjson of rule2.play_json) {
        if (pjson.re && (pjson.re === "*" || lazyPlay.url.match(new RegExp(pjson.re)))) {
          if (pjson.json && typeof pjson.json === "object") {
            lazyPlay = Object.assign(lazyPlay, pjson.json);
            break;
          }
        }
      }
    } else if (rule2.play_json && !Array.isArray(rule2.play_json)) {
      lazyPlay = Object.assign(lazyPlay, { jx: 1, parse: 1 });
    } else if (!rule2.play_json) {
      lazyPlay = Object.assign(lazyPlay, { jx: 0, parse: 1 });
    }
    return lazyPlay;
  },
  /** 搜索：searchUrl 渲染（双星号替换、fypage、区间、;post）+ '搜索' 规则或 js: 片段（searchParse 语义） */
  async search(ctx2, wd, quick, pg2) {
    const rule2 = ctx2.rule;
    if (!rule2.searchUrl) return {};
    if (rule2.searchNoPage && Number(pg2) > 1) return {};
    let p2 = rule2.\u641C\u7D22 === "*" && rule2.\u4E00\u7EA7 ? rule2.\u4E00\u7EA7 : rule2.\u641C\u7D22;
    if (!p2 || typeof p2 !== "string") return {};
    const d2 = [];
    let url2 = rule2.searchUrl.replaceAll("**", wd);
    if (pg2 === 1 && url2.includes("[") && url2.includes("]") && !url2.includes("#")) {
      url2 = url2.split("[")[1].split("]")[0];
    } else if (pg2 > 1 && url2.includes("[") && url2.includes("]") && !url2.includes("#")) {
      url2 = url2.split("[")[0];
    }
    if (/fypage/.test(url2)) {
      if (url2.includes("(") && url2.includes(")")) {
        const urlRep2 = url2.match(/.*?\((.*)\)/)[1];
        url2 = url2.replaceAll(urlRep2, urlRep2.replaceAll("fypage", pg2)).replaceAll("(", "").replaceAll(")", "");
      } else {
        url2 = url2.replaceAll("fypage", pg2);
      }
    }
    ctx2.url = url2;
    ctx2.input = url2;
    p2 = p2.trim();
    if (p2.startsWith("js:")) {
      const scope = await evalFragment("\u641C\u7D22", stripJs(p2), ctx2, { TYPE: "search", detailUrl: rule2.detailUrl || "" });
      d2.push(...scope.VODS || []);
    } else {
      const pp = rule2.\u4E00\u7EA7 ? rule2.\u4E00\u7EA7.split(";") : [];
      const parts = p2.split(";");
      if (parts.length < 5) return {};
      const getPP = (i) => parts[i] === "*" && pp.length > i ? pp[i] : parts[i];
      const reqMethod = url2.split(";").length > 1 ? url2.split(";")[1].toLowerCase() : "get";
      let html;
      if (reqMethod === "post" || reqMethod === "postjson") {
        const rurls = url2.split(";")[0].split("#");
        const body = rurls.length > 1 ? rurls[1] : "";
        if (reqMethod === "postjson") {
          let params = {};
          try {
            params = JSON.parse(body);
          } catch {
          }
          html = (await ctx2.lib.net.req(rurls[0], { method: "POST", data: params })).content;
        } else {
          html = (await ctx2.lib.net.req(rurls[0], { method: "POST", body })).content;
        }
      } else {
        html = (await ctx2.lib.net.req(url2)).content;
      }
      const res = await parseRule(getPP(0) + ";" + getPP(1) + ";" + getPP(2) + ";" + getPP(3) + ";" + getPP(4) + (parts[5] ? ";" + getPP(5) : ""), ctx2, { html });
      d2.push(...res.map((it) => ({ ...it, vod_content: it.vod_content || "" })));
    }
    return { page: parseInt(pg2) || 1, pagecount: 10, limit: 20, total: 100, list: d2 };
  },
  /** 本地代理默认：未实现 proxy_rule 时 404（§10.1） */
  async proxy(ctx2, params) {
    const rule2 = ctx2.rule;
    if (rule2.proxy_rule && typeof rule2.proxy_rule === "string" && rule2.proxy_rule.trim()) {
      let code = rule2.proxy_rule.trim().replace(/^js:/, "").trim();
      const scope = await evalFragment("proxy", code, ctx2, { input: params });
      if (scope.input && scope.input !== params && Array.isArray(scope.input) && scope.input.length >= 3) {
        return scope.input;
      }
      return [404, "text/plain", "Not Found"];
    }
    return [404, "text/plain", "Not Found"];
  },
  /** 交互通道默认（§10.2）：无钩子返回空提示 */
  async action(ctx2, action, value) {
    return "";
  },
  async sniffer(ctx2) {
    return !!ctx2.rule.sniffer;
  },
  async isVideo(ctx2, url2) {
    const rule2 = ctx2.rule;
    let pattern = rule2.isVideo || "";
    if (pattern && String(pattern).startsWith("js:")) {
      const scope = await evalFragment("isVideo", stripJs(pattern), ctx2, { input: url2 });
      return !!scope.input;
    }
    if (!pattern) return false;
    return new RegExp(pattern).test(url2);
  }
};
function stripJs(s) {
  return String(s).trim().replace(/^js:/, "").trim();
}

// src/drpy3/runtime.js
var REQUIRED = ["req", "pdfh", "pdfa", "pd"];
var BUILTINS = {
  joinUrl: () => builtinJoinUrl,
  store: () => memoryStore(),
  log: () => (...args) => console.log(...args),
  getProxy: () => () => "http://127.0.0.1:9978/proxy?do=js",
  // batchFetch / pdfl 兜底依赖 net/parse 上下文，在 lib/net.js、lib/parse.js 中组装（W4/W5），
  // 这里先声明存在性供 capabilities 标注；resolve('batchFetch'/'pdfl') 由 net/parse 层拦截。
  batchFetch: null,
  pdfl: null,
  loadAsset: null
  // 无兜底：随源资产（wasm 等）必须有宿主实现才可用
};
function detectWasm() {
  try {
    return typeof WebAssembly !== "undefined" && WebAssembly.compile && WebAssembly.instantiate ? "native" : "none";
  } catch {
    return "none";
  }
}
var _overrides, _sourceCaps, _memStore, _Runtime_instances, raw_fn, capOf_fn, builtin_fn, wasmMode_fn;
var Runtime = class {
  // memory-fallback store 单例（多源共享介质，按源 key 隔离命名空间）
  constructor(hostEnv = {}) {
    __privateAdd(this, _Runtime_instances);
    __privateAdd(this, _overrides, {});
    // rt.use() 覆盖层
    __privateAdd(this, _sourceCaps, {});
    // source 自带层（per-source，W8 模块化接入；运行时层为空默认）
    __privateAdd(this, _memStore, null);
    this.hostEnv = hostEnv;
    this.hostEnv.env = hostEnv.env || {};
    __privateSet(this, _memStore, memoryStore());
    this.pinList = hostEnv.pinList || [];
    this.defaults = defaults;
    this.lifecycle = new LifecycleManager(this, hostEnv.lifecycle || {});
    this.actionTimeoutMs = hostEnv.actionTimeoutMs || 6e4;
    this.check();
  }
  /** 自动治理入口（壳子可定期调用/测试直调）：LRU+水位+maxHot 驱逐 */
  sweep(opts) {
    return this.lifecycle.sweep(opts);
  }
  /** 源装载（附录 D 阶段1）：drpy2 特征自动走兼容层；对象直接建实例；字符串源码走模块求值 */
  async load(sourceLike, opts = {}) {
    let def = sourceLike;
    const code = typeof sourceLike === "string" ? sourceLike : null;
    if (code !== null) {
      if (!opts.drpy3 && looksLikeDrpy2(code)) {
        return this.load2x(code, opts);
      }
      def = await this.evaluateSource(code, opts);
    }
    const src = createSource(this, def, opts);
    if (code !== null && !src.signature) src.signature = hashStr(code);
    this.lifecycle.register(src);
    return src;
  }
  /** 源码字符串求值：opts.mode==='cjs' → 内置 CJS shim（模式 C）；宿主 evalModule（模式 A）；默认中性形态 */
  async evaluateSource(code, opts = {}) {
    if (opts.mode === "cjs") {
      return await evalSourceCjs(code, opts, this);
    }
    if (typeof this.hostEnv.evalModule === "function") {
      const mod = await this.hostEnv.evalModule(code, opts.path || "");
      return mod && mod.default !== void 0 ? mod.default : mod;
    }
    return await evalSourceNeutral(code, opts);
  }
  /** drpy2 兼容装载（§11）：伪全局映射 + 自动串行；同引擎其他实例并发不受影响 */
  load2x(code, opts = {}) {
    return createSource2x(this, code, opts);
  }
  /** 形态判定（§4.1）：纯对象=纯声明式 / defineSource=增强 / drpy2 特征=兼容层 */
  _detectForm(def) {
    return detectForm(def);
  }
  /** 运行时覆盖单项或整包（§7.2）：rt.use({pdfh: myFasterPdfh}) */
  use(overrides) {
    if (!overrides || typeof overrides !== "object") throw new TypeError("rt.use(obj): \u9700\u8981\u5BF9\u8C61");
    Object.assign(__privateGet(this, _overrides), overrides);
    return this;
  }
  /** 构造期一次性自检：缺什么、什么走了兜底，立刻打印清楚（§7.1） */
  check() {
    const missing = [];
    const fallbacks = {};
    for (const name of REQUIRED) {
      if (typeof __privateMethod(this, _Runtime_instances, raw_fn).call(this, name) !== "function") missing.push(name);
    }
    for (const name of Object.keys(BUILTINS)) {
      if (typeof __privateMethod(this, _Runtime_instances, raw_fn).call(this, name) !== "function" && BUILTINS[name] !== void 0) fallbacks[name] = "builtin";
    }
    const report = { missing, fallbacks, wasm: __privateMethod(this, _Runtime_instances, wasmMode_fn).call(this), engine: this.hostEnv.engine || "" };
    try {
      const log = typeof __privateMethod(this, _Runtime_instances, raw_fn).call(this, "log") === "function" ? __privateMethod(this, _Runtime_instances, raw_fn).call(this, "log") : console.log;
      if (missing.length) {
        log(`[drpy3] HostEnv \u7F3A\u5C11\u5FC5\u6CE8\u5165\u9879: ${missing.join(", ")} \u2014\u2014 \u8FD0\u884C\u671F\u8C03\u7528\u5C06\u62A5\u9519\u3002\u8BF7\u6CE8\u5165: ${missing.map((m) => `${m}()`).join(" / ")}`);
      }
      if (Object.keys(fallbacks).length) {
        log(`[drpy3] HostEnv \u8D70\u5185\u7F6E\u515C\u5E95: ${Object.keys(fallbacks).join(", ")}`);
      }
    } catch {
    }
    return report;
  }
  /** 本 Runtime 能力表（§7.1）：对接方从"考古全局名"变成"读一张能力表" */
  get capabilities() {
    const cap = {
      wasm: __privateMethod(this, _Runtime_instances, wasmMode_fn).call(this),
      action: this.hostEnv.action === false ? false : true,
      engine: this.hostEnv.engine || "unknown",
      version: this.hostEnv.version || ""
    };
    for (const name of ["req", "pdfh", "pdfa", "pd", "pdfl", "batchFetch", "joinUrl", "store", "log", "getProxy", "loadAsset"]) {
      cap[name] = __privateMethod(this, _Runtime_instances, capOf_fn).call(this, name);
    }
    return Object.freeze(cap);
  }
  /** 能力解析：source 自带 > use 覆盖 > 构造注入 > 内置兜底（§7.2） */
  resolve(name, sourceCaps = null) {
    const layers = [sourceCaps, __privateGet(this, _overrides), this.hostEnv];
    for (const layer of layers) {
      const v = layer && layer[name];
      if (v !== void 0 && v !== null) return v;
    }
    return __privateMethod(this, _Runtime_instances, builtin_fn).call(this, name);
  }
};
_overrides = new WeakMap();
_sourceCaps = new WeakMap();
_memStore = new WeakMap();
_Runtime_instances = new WeakSet();
// ─── 内部 ───
raw_fn = function(name) {
  for (const layer of [__privateGet(this, _overrides), this.hostEnv]) {
    const v = layer[name];
    if (v !== void 0 && v !== null) return v;
  }
  return void 0;
};
capOf_fn = function(name) {
  if (__privateGet(this, _overrides)[name] !== void 0 && __privateGet(this, _overrides)[name] !== null) return "use-override";
  if (this.hostEnv[name] !== void 0 && this.hostEnv[name] !== null) return "host";
  if (name === "store") return "memory-fallback";
  if (BUILTINS[name] !== void 0) return "builtin";
  return "missing";
};
builtin_fn = function(name) {
  if (name === "store") return __privateGet(this, _memStore);
  const f = BUILTINS[name];
  if (typeof f === "function") return f(this.hostEnv);
  return void 0;
};
wasmMode_fn = function() {
  const declared = this.hostEnv.wasm;
  return declared === "native" || declared === "polyfill" || declared === "none" ? declared : detectWasm();
};

// src/drpy3/index.js
var VERSION = "drpy3 0.1.0";
function defineSource(source) {
  return source;
}
var index_default = { Runtime, defineSource, VERSION };
export {
  Runtime,
  VERSION,
  index_default as default,
  defineSource
};
