var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/drpy3-peer.js
var drpy3_peer_exports = {};
__export(drpy3_peer_exports, {
  Buffer: () => an,
  CryptoJS: () => ht,
  JSEncrypt: () => pt,
  JSON5: () => dt,
  JSONPath: () => Kn,
  NODERSA: () => ft,
  TextDecoder: () => qn,
  TextEncoder: () => Hn,
  WebAssembly: () => gt,
  cheerio: () => mt,
  gbkTool: () => _t,
  jinja: () => Jn,
  pako: () => yt,
  \u6A21\u677F: () => Ln
});

// dist/drpy3-globals-capture.js
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

// ../drpy-webpack/dist/drpy-core-qjs.min.js
var g = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : globalThis;
var dn = Object.defineProperty;
var Cn = Object.getOwnPropertyDescriptor;
var On = Object.getOwnPropertyNames;
var Rn = Object.prototype.hasOwnProperty;
var r = (Y, M) => dn(Y, "name", { value: M, configurable: true });
var mn = ((Y) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(Y, { get: (M, $) => (typeof __require < "u" ? __require : M)[$] }) : Y)(function(Y) {
  if (typeof __require < "u") return __require.apply(this, arguments);
  throw Error('Dynamic require of "' + Y + '" is not supported');
});
var Tn = (Y, M) => () => (Y && (M = Y(Y = 0)), M);
var In = (Y, M) => () => (M || Y((M = { exports: {} }).exports, M), M.exports);
var Fn = (Y, M) => {
  for (var $ in M) dn(Y, $, { get: M[$], enumerable: true });
};
var kn = (Y, M, $, C) => {
  if (M && typeof M == "object" || typeof M == "function") for (let j of On(M)) !Rn.call(Y, j) && j !== $ && dn(Y, j, { get: () => M[j], enumerable: !(C = Cn(M, j)) || C.enumerable });
  return Y;
};
var Pn = (Y) => kn(dn({}, "__esModule", { value: true }), Y);
var vn = {};
Fn(vn, { default: () => Mn });
var Mn;
var bn = Tn(() => {
  Mn = {};
});
var En = In((Zn, gn) => {
  var Qe = (bn(), Pn(vn));
  if (Qe && Qe.default) {
    gn.exports = Qe.default;
    for (let Y in Qe) gn.exports[Y] = Qe[Y];
  } else Qe && (gn.exports = Qe);
});
typeof Object.assign != "function" && (Object.assign = function() {
  let Y = arguments[0];
  for (let M = 1; M < arguments.length; M++) {
    let $ = arguments[M];
    for (let C in $) Object.prototype.hasOwnProperty.call($, C) && (Y[C] = $[C]);
  }
  return Y;
});
var Ke = `js:
  let html = request(input);
  let hconf = html.match(/r player_.*?=(.*?)</)[1];
  let json = JSON5.parse(hconf);
  let url = json.url;
  if (json.encrypt == '1') {
    url = unescape(url);
  } else if (json.encrypt == '2') {
    url = unescape(base64Decode(url));
  }
  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {
    input = {
      parse: 0,
      jx: 0,
      url: url,
    };
  } else {
    input = url && url.startsWith('http') && tellIsJx(url) ? {parse:0,jx:1,url:url}:input;
  }`;
var Nn = `js:
  input = { parse: 1, url: input, js: '' };`;
var jn = `js:
  if (/\\.(m3u8|mp4)/.test(input)) {
    input = { parse: 0, url: input };
  } else {
    if (rule.parse_url.startsWith('json:')) {
      let purl = rule.parse_url.replace('json:', '') + input;
      let html = request(purl);
      let json = JSON.parse(html);
      if (json.url) {
        input = { parse: 0, url: json.url };
      }
    } else {
      input = rule.parse_url + input;
    }
  }`;
function yn() {
  return JSON.parse(JSON.stringify({ mx: { title: "", host: "", url: "/vodshow/fyclass--------fypage---/", searchUrl: "/vodsearch/**----------fypage---/", class_parse: ".top_nav li;a&&Text;a&&href;.*/(.*?)/", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: ".cbox_list;*;*;*;*;*", \u4E00\u7EA7: "ul.vodlist li;a&&title;a&&data-original;.pic_text&&Text;a&&href", \u4E8C\u7EA7: { title: "h2&&Text;.content_detail:eq(1)&&li&&a:eq(2)&&Text", img: ".vodlist_thumb&&data-original", desc: ".content_detail:eq(1)&&li:eq(1)&&Text;.content_detail:eq(1)&&li&&a&&Text;.content_detail:eq(1)&&li&&a:eq(1)&&Text;.content_detail:eq(1)&&li:eq(2)&&Text;.content_detail:eq(1)&&li:eq(3)&&Text", content: ".content_desc&&span&&Text", tabs: ".play_source_tab&&a", lists: ".content_playlist:eq(#id) li" }, \u641C\u7D22: "*" }, mxpro: { title: "", host: "", url: "/vodshow/fyclass--------fypage---.html", searchUrl: "/vodsearch/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, class_parse: ".navbar-items li:gt(0):lt(10);a&&Text;a&&href;/(\\d+)", play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: ".tab-list.active;a.module-poster-item.module-item;.module-poster-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href", \u4E00\u7EA7: "body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href", \u4E8C\u7EA7: { title: "h1&&Text;.module-info-tag-link:eq(-1)&&Text", img: ".lazyload&&data-original||data-src||src", desc: ".module-info-item:eq(-2)&&Text;.module-info-tag-link&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text", content: ".module-info-introduction&&Text", tabs: ".module-tab-item", lists: ".module-play-list:eq(#id) a", tab_text: "div--small&&Text" }, \u641C\u7D22: "body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text" }, mxone5: { title: "", host: "", url: "/show/fyclass--------fypage---.html", searchUrl: "/search/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, class_parse: ".nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html", play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: ".module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href", \u4E00\u7EA7: ".module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href", \u4E8C\u7EA7: { title: "h1&&Text;.tag-link&&Text", img: ".module-item-pic&&img&&data-src", desc: ".video-info-items:eq(3)&&Text;.tag-link:eq(2)&&Text;.tag-link:eq(1)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(0)&&Text", content: ".vod_content&&Text", tabs: ".module-tab-item", lists: ".module-player-list:eq(#id)&&.scroll-content&&a", tab_text: "div--small&&Text" }, \u641C\u7D22: ".module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href" }, \u9996\u56FE: { title: "", host: "", url: "/vodshow/fyclass--------fypage---/", searchUrl: "/vodsearch/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, class_parse: ".myui-header__menu li.hidden-sm:gt(0):lt(7);a&&Text;a&&href;/(\\d+).html", play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: "ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href", \u4E00\u7EA7: ".myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href", \u4E8C\u7EA7: { title: ".myui-content__detail .title--span&&Text;.myui-content__detail p.data:eq(3)&&Text", img: ".myui-content__thumb .lazyload&&data-original", desc: ".myui-content__detail p.otherbox&&Text;.year&&Text;.myui-content__detail p.data:eq(4)&&Text;.myui-content__detail p.data:eq(2)&&Text;.myui-content__detail p.data:eq(0)&&Text", content: ".content&&Text", tabs: ".myui-panel__head&&li", lists: ".myui-content__list:eq(#id) li" }, \u641C\u7D22: "#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&Text" }, \u9996\u56FE2: { title: "", host: "", url: "/list/fyclass-fypage.html", searchUrl: "/vodsearch/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "UC_UA" }, class_parse: ".stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;.*/(.*?).html", play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: "ul.stui-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href", \u4E00\u7EA7: ".stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href", \u4E8C\u7EA7: { title: ".stui-content__detail .title&&Text;.stui-content__detail&&p:eq(-2)&&a&&Text", title1: ".stui-content__detail .title&&Text;.stui-content__detail&&p&&Text", img: ".stui-content__thumb .lazyload&&data-original", desc: ".stui-content__detail p&&Text;.stui-content__detail&&p:eq(-2)&&a:eq(2)&&Text;.stui-content__detail&&p:eq(-2)&&a:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text;.stui-content__detail p:eq(1)&&Text", desc1: ".stui-content__detail p:eq(4)&&Text;;;.stui-content__detail p:eq(1)&&Text", content: ".detail&&Text", tabs: ".stui-pannel__head h3", tabs1: ".stui-vodlist__head h3", lists: ".stui-content__playlist:eq(#id) li" }, \u641C\u7D22: "ul.stui-vodlist__media,ul.stui-vodlist,#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&Text" }, \u9ED8\u8BA4: { title: "", host: "", url: "", searchUrl: "", searchable: 2, quickSearch: 0, filterable: 0, filter: "", filter_url: "", filter_def: {}, headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "#side-menu li;a&&Text;a&&href;/(.*?).html", cate_exclude: "", play_parse: true, lazy: Nn, double: true, \u63A8\u8350: "\u5217\u88681;\u5217\u88682;\u6807\u9898;\u56FE\u7247;\u63CF\u8FF0;\u94FE\u63A5;\u8BE6\u60C5", \u4E00\u7EA7: "\u5217\u8868;\u6807\u9898;\u56FE\u7247;\u63CF\u8FF0;\u94FE\u63A5;\u8BE6\u60C5", \u4E8C\u7EA7: { title: "vod_name;vod_type", img: "\u56FE\u7247\u94FE\u63A5", desc: "\u4E3B\u8981\u4FE1\u606F;\u5E74\u4EE3;\u5730\u533A;\u6F14\u5458;\u5BFC\u6F14", content: "\u7B80\u4ECB", tabs: "", lists: "xx:eq(#id)&&a", tab_text: "body&&Text", list_text: "body&&Text", list_url: "a&&href" }, \u641C\u7D22: "\u5217\u8868;\u6807\u9898;\u56FE\u7247;\u63CF\u8FF0;\u94FE\u63A5;\u8BE6\u60C5" }, vfed: { title: "", host: "", url: "/index.php/vod/show/id/fyclass/page/fypage.html", searchUrl: "/index.php/vod/search/page/fypage/wd/**.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "UC_UA" }, class_parse: ".fed-pops-navbar&&ul.fed-part-rows&&a;a&&Text;a&&href;.*/(.*?).html", play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: "ul.fed-list-info.fed-part-rows;li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href", \u4E00\u7EA7: ".fed-list-info&&li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href", \u4E8C\u7EA7: { title: "h1.fed-part-eone&&Text;.fed-deta-content&&.fed-part-rows&&li&&Text", img: ".fed-list-info&&a&&data-original", desc: ".fed-deta-content&&.fed-part-rows&&li:eq(1)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(2)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(3)&&Text", content: ".fed-part-esan&&Text", tabs: ".fed-drop-boxs&&.fed-part-rows&&li", lists: ".fed-play-item:eq(#id)&&ul:eq(1)&&li" }, \u641C\u7D22: ".fed-deta-info;h1&&Text;.lazyload&&data-original;.fed-list-remarks&&Text;a&&href;.fed-deta-content&&Text" }, \u6D77\u87BA3: { title: "", host: "", searchUrl: "/v_search/**----------fypage---.html", url: "/vod_____show/fyclass--------fypage---.html", headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "body&&.hl-nav li:gt(0);a&&Text;a&&href;.*/(.*?).html", cate_exclude: "\u660E\u661F|\u4E13\u9898|\u6700\u65B0|\u6392\u884C", limit: 40, play_parse: true, lazy: Ke, double: true, \u63A8\u8350: ".hl-vod-list;li;a&&title;a&&data-original;.remarks&&Text;a&&href", \u4E00\u7EA7: ".hl-vod-list&&.hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href", \u4E8C\u7EA7: { title: ".hl-dc-title&&Text;.hl-dc-content&&li:eq(6)&&Text", img: ".hl-lazy&&data-original", desc: ".hl-dc-content&&li:eq(10)&&Text;.hl-dc-content&&li:eq(4)&&Text;.hl-dc-content&&li:eq(5)&&Text;.hl-dc-content&&li:eq(2)&&Text;.hl-dc-content&&li:eq(3)&&Text", content: ".hl-content-text&&Text", tabs: ".hl-tabs&&a", tab_text: "a--span&&Text", lists: ".hl-plays-list:eq(#id)&&li" }, \u641C\u7D22: ".hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href", searchable: 2, quickSearch: 0, filterable: 0 }, \u6D77\u87BA2: { title: "", host: "", searchUrl: "/index.php/vod/search/page/fypage/wd/**/", url: "/index.php/vod/show/id/fyclass/page/fypage/", headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "#nav-bar li;a&&Text;a&&href;id/(.*?)/", limit: 40, play_parse: true, lazy: Ke, double: true, \u63A8\u8350: ".list-a.size;li;a&&title;.lazy&&data-original;.bt&&Text;a&&href", \u4E00\u7EA7: ".list-a&&li;a&&title;.lazy&&data-original;.list-remarks&&Text;a&&href", \u4E8C\u7EA7: { title: "h2&&Text;.deployment&&Text", img: ".lazy&&data-original", desc: ".deployment&&Text", content: ".ec-show&&Text", tabs: "#tag&&a", lists: ".play_list_box:eq(#id)&&li" }, \u641C\u7D22: ".search-list;a&&title;.lazy&&data-original;.deployment&&Text;a&&href", searchable: 2, quickSearch: 0, filterable: 0 }, \u77ED\u89C6: { title: "", host: "", url: "/channel/fyclass-fypage.html", searchUrl: "/search.html?wd=**", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, class_parse: ".menu_bottom ul li;a&&Text;a&&href;.*/(.*?).html", cate_exclude: "\u89E3\u6790|\u52A8\u6001", play_parse: true, lazy: Ke, limit: 6, double: true, \u63A8\u8350: ".indexShowBox;ul&&li;a&&title;img&&data-src;.s1&&Text;a&&href", \u4E00\u7EA7: ".pic-list&&li;a&&title;img&&data-src;.s1&&Text;a&&href", \u4E8C\u7EA7: { title: "h1&&Text;.content-rt&&p:eq(0)&&Text", img: ".img&&img&&data-src", desc: ".content-rt&&p:eq(1)&&Text;.content-rt&&p:eq(2)&&Text;.content-rt&&p:eq(3)&&Text;.content-rt&&p:eq(4)&&Text;.content-rt&&p:eq(5)&&Text", content: ".zkjj_a&&Text", tabs: ".py-tabs&&option", lists: ".player:eq(#id) li" }, \u641C\u7D22: ".sr_lists&&ul&&li;h3&&Text;img&&data-src;.int&&p:eq(0)&&Text;a&&href" }, \u77ED\u89C62: { title: "", host: "", class_name: "\u7535\u5F71&\u7535\u89C6\u5267&\u7EFC\u827A&\u52A8\u6F2B", class_url: "1&2&3&4", searchUrl: "/index.php/ajax/suggest?mid=1&wd=**&limit=50", searchable: 2, quickSearch: 0, headers: { "User-Agent": "MOBILE_UA" }, url: "/index.php/api/vod#type=fyclass&page=fypage", filterable: 0, filter_url: "", filter: {}, filter_def: {}, detailUrl: "/index.php/vod/detail/id/fyid.html", play_parse: true, lazy: Ke, limit: 6, \u63A8\u8350: ".list-vod.flex .public-list-box;a&&title;.lazy&&data-original;.public-list-prb&&Text;a&&href", \u4E00\u7EA7: 'js:let body=input.split("#")[1];let t=Math.round(new Date/1e3).toString();let key=md5("DS"+t+"DCC147D11943AF75");let url=input.split("#")[0];body=body+"&time="+t+"&key="+key;print(body);fetch_params.body=body;let html=post(url,fetch_params);let data=JSON.parse(html);VODS=data.list.map(function(it){it.vod_pic=urljoin2(input.split("/i")[0],it.vod_pic);return it});', \u4E8C\u7EA7: { title: ".slide-info-title&&Text;.slide-info:eq(2)--strong&&Text", img: ".detail-pic&&data-original", desc: ".slide-info-remarks&&Text;.slide-info-remarks:eq(1)&&Text;.slide-info-remarks:eq(2)&&Text;.slide-info:eq(1)--strong&&Text;.info-parameter&&ul&&li:eq(3)&&Text", content: "#height_limit&&Text", tabs: ".anthology.wow.fadeInUp.animated&&.swiper-wrapper&&a", tab_text: "a--span&&Text", lists: ".anthology-list-box:eq(#id) li" }, \u641C\u7D22: "json:list;name;pic;;id" }, \u91C7\u96C61: { title: "", host: "", homeTid: "13", homeUrl: "/api.php/provide/vod/?ac=detail&t={{rule.homeTid}}", detailUrl: "/api.php/provide/vod/?ac=detail&ids=fyid", searchUrl: "/api.php/provide/vod/?wd=**&pg=fypage", url: "/api.php/provide/vod/?ac=detail&pg=fypage&t=fyclass", headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "json:class;", limit: 20, multi: 1, searchable: 2, quickSearch: 1, filterable: 0, play_parse: true, parse_url: "", lazy: jn, \u63A8\u8350: "*", \u4E00\u7EA7: "json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from", \u4E8C\u7EA7: `js:
            let html=request(input);
            html=JSON.parse(html);
            let data=html.list;
            VOD=data[0];`, \u641C\u7D22: "*" } }));
}
r(yn, "getMubans");
var Gn = yn();
var Un = yn();
var Ln = { muban: Un, getMubans: yn };
r(function(M, $) {
  typeof exports == "object" && typeof module == "object" ? module.exports = exports = $() : typeof define == "function" && define.amd ? define([], $) : globalThis.JSEncrypt = $();
}, "webpackUniversalModuleDefinition")(void 0, () => (() => {
  var __webpack_modules__ = { "./lib/JSEncrypt.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSEncrypt": () => (/* binding */ JSEncrypt)
/* harmony export */ });
/* harmony import */ var _lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/jsbn/base64 */ "./lib/lib/jsbn/base64.js");
/* harmony import */ var _JSEncryptRSAKey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSEncryptRSAKey */ "./lib/JSEncryptRSAKey.js");
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");
var _a;


var version = typeof process !== 'undefined'
    ? (_a = process.env) === null || _a === void 0 ? void 0 : "3.3.2"
    : undefined;
/**
 *
 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
 * possible parameters are:
 * - default_key_size        {number}  default: 1024 the key size in bit
 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
 * - log                     {boolean} default: false whether log warn/error or not
 * @constructor
 */
var JSEncrypt = /** @class */ (function () {
    function JSEncrypt(options) {
        if (options === void 0) { options = {}; }
        options = options || {};
        this.default_key_size = options.default_key_size
            ? parseInt(options.default_key_size, 10)
            : 1024;
        this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
        this.log = options.log || false;
        // The private and public key.
        this.key = null;
    }
    /**
     * Method to set the rsa key parameter (one method is enough to set both the public
     * and the private key, since the private key contains the public key paramenters)
     * Log a warning if logs are enabled
     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
     * @public
     */
    JSEncrypt.prototype.setKey = function (key) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.");
        }
        this.key = new _JSEncryptRSAKey__WEBPACK_IMPORTED_MODULE_1__.JSEncryptRSAKey(key);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPrivateKey = function (privkey) {
        // Create the key.
        this.setKey(privkey);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPublicKey = function (pubkey) {
        // Sets the public key.
        this.setKey(pubkey);
    };
    /**
     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str base64 encoded crypted string to decrypt
     * @return {string} the decrypted string
     * @public
     */
    JSEncrypt.prototype.decrypt = function (str) {
        // Return the decrypted string.
        try {
            return this.getKey().decrypt((0,_lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__.b64tohex)(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str the string to encrypt
     * @return {string} the encrypted string encoded in base64
     * @public
     */
    JSEncrypt.prototype.encrypt = function (str) {
        // Return the encrypted string.
        try {
            return (0,_lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__.hex2b64)(this.getKey().encrypt(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's sign.
     * @param {string} str the string to sign
     * @param {function} digestMethod hash method
     * @param {string} digestName the name of the hash algorithm
     * @return {string} the signature encoded in base64
     * @public
     */
    JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
        // return the RSA signature of 'str' in 'hex' format.
        try {
            return (0,_lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__.hex2b64)(this.getKey().sign(str, digestMethod, digestName));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's verify.
     * @param {string} str the string to verify
     * @param {string} signature the signature encoded in base64 to compare the string to
     * @param {function} digestMethod hash method
     * @return {boolean} whether the data and signature match
     * @public
     */
    JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
        // Return the decrypted 'digest' of the signature.
        try {
            return this.getKey().verify(str, (0,_lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__.b64tohex)(signature), digestMethod);
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
     * will be created and returned
     * @param {callback} [cb] the callback to be called if we want the key to be generated
     * in an async fashion
     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
     * @public
     */
    JSEncrypt.prototype.getKey = function (cb) {
        // Only create new if it does not exist.
        if (!this.key) {
            // Get a new private key.
            this.key = new _JSEncryptRSAKey__WEBPACK_IMPORTED_MODULE_1__.JSEncryptRSAKey();
            if (cb && {}.toString.call(cb) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                return;
            }
            // Generate the key.
            this.key.generate(this.default_key_size, this.default_public_exponent);
        }
        return this.key;
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateKey();
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateBaseKeyB64();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicKey();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicBaseKeyB64();
    };
var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var b64pad="=";var base64DecodeChars=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);function btoa(str){var out,i,len;var c1,c2,c3;len=str.length;i=0;out="";while(i<len){c1=str.charCodeAt(i++)&255;if(i==len){out+=b64map.charAt(c1>>2);out+=b64map.charAt((c1&3)<<4);out+="==";break}c2=str.charCodeAt(i++);if(i==len){out+=b64map.charAt(c1>>2);out+=b64map.charAt((c1&3)<<4|(c2&240)>>4);out+=b64map.charAt((c2&15)<<2);out+="=";break}c3=str.charCodeAt(i++);out+=b64map.charAt(c1>>2);out+=b64map.charAt((c1&3)<<4|(c2&240)>>4);out+=b64map.charAt((c2&15)<<2|(c3&192)>>6);out+=b64map.charAt(c3&63)}return out}function atob(str){var c1,c2,c3,c4;var i,len,out;len=str.length;i=0;out="";while(i<len){do{c1=base64DecodeChars[str.charCodeAt(i++)&255]}while(i<len&&c1==-1);if(c1==-1)break;do{c2=base64DecodeChars[str.charCodeAt(i++)&255]}while(i<len&&c2==-1);if(c2==-1)break;out+=String.fromCharCode(c1<<2|(c2&48)>>4);do{c3=str.charCodeAt(i++)&255;if(c3==61)return out;c3=base64DecodeChars[c3]}while(i<len&&c3==-1);if(c3==-1)break;out+=String.fromCharCode((c2&15)<<4|(c3&60)>>2);do{c4=str.charCodeAt(i++)&255;if(c4==61)return out;c4=base64DecodeChars[c4]}while(i<len&&c4==-1);if(c4==-1)break;out+=String.fromCharCode((c3&3)<<6|c4)}return out}function hex2b64(h){var i;var c;var ret="";for(i=0;i+3<=h.length;i+=3){c=parseInt(h.substring(i,i+3),16);ret+=b64map.charAt(c>>6)+b64map.charAt(c&63)}if(i+1==h.length){c=parseInt(h.substring(i,i+1),16);ret+=b64map.charAt(c<<2)}else if(i+2==h.length){c=parseInt(h.substring(i,i+2),16);ret+=b64map.charAt(c>>2)+b64map.charAt((c&3)<<4)}while((ret.length&3)>0)ret+=b64pad;return ret}function hexToBytes(hex){for(var bytes=[],c=0;c<hex.length;c+=2)bytes.push(parseInt(hex.substr(c,2),16));return bytes}function bytesToHex(bytes){for(var hex=[],i=0;i<bytes.length;i++){hex.push((bytes[i]>>>4).toString(16));hex.push((bytes[i]&15).toString(16))}return hex.join("")}function b64tohex(str){for(var i=0,bin=atob(str.replace(/[ \\r\\n]+$/,"")),hex=[];i<bin.length;++i){var tmp=bin.charCodeAt(i).toString(16);if(tmp.length===1)tmp="0"+tmp;hex[hex.length]=tmp}return hex.join("")}function addPreZero(num,length){var t=(num+"").length,s="";for(var i=0;i<length-t;i++){s+="0"}return s+num}JSEncrypt.prototype.getkeylength=function(){return this.key.n.bitLength()+7>>3};JSEncrypt.prototype.decryptUnicodeLong=function(string){var k=this.getKey();var maxLength=(k.n.bitLength()+7>>3)*2;try{var hexString=b64tohex(string);var decryptedString="";var rexStr=".{1,"+maxLength+"}";var rex=new RegExp(rexStr,"g");var subStrArray=hexString.match(rex);if(subStrArray){subStrArray.forEach(function(entry){decryptedString+=k.decrypt(entry)});return decryptedString}}catch(ex){console.log("\u52A0\u5BC6\u9519\u8BEF:"+ex.message);return false}};JSEncrypt.prototype.encryptUnicodeLong=function(string){var k=this.getKey();var maxLength=(k.n.bitLength()+7>>3)-11;try{var subStr="",encryptedString="";var subStart=0,subEnd=0;var bitLen=0,tmpPoint=0;for(var i=0,len=string.length;i<len;i++){var charCode=string.charCodeAt(i);if(charCode<=127){bitLen+=1}else if(charCode<=2047){bitLen+=2}else if(charCode<=65535){bitLen+=3}else{bitLen+=4}if(bitLen>maxLength){subStr=string.substring(subStart,subEnd);encryptedString+=k.encrypt(subStr);subStart=subEnd;bitLen=bitLen-tmpPoint}else{subEnd=i;tmpPoint=bitLen}}subStr=string.substring(subStart,len);encryptedString+=k.encrypt(subStr);return hex2b64(encryptedString)}catch(ex){console.log("\u89E3\u5BC6\u9519\u8BEF:"+ex.message);return false}};    JSEncrypt.version = version;
    return JSEncrypt;
}());



//# sourceURL=webpack://JSEncrypt/./lib/JSEncrypt.js?`);
  }, "./lib/JSEncrypt.js"), "./lib/JSEncryptRSAKey.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSEncryptRSAKey": () => (/* binding */ JSEncryptRSAKey)
/* harmony export */ });
/* harmony import */ var _lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/jsbn/base64 */ "./lib/lib/jsbn/base64.js");
/* harmony import */ var _lib_asn1js_hex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/asn1js/hex */ "./lib/lib/asn1js/hex.js");
/* harmony import */ var _lib_asn1js_base64__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/asn1js/base64 */ "./lib/lib/asn1js/base64.js");
/* harmony import */ var _lib_asn1js_asn1__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/asn1js/asn1 */ "./lib/lib/asn1js/asn1.js");
/* harmony import */ var _lib_jsbn_rsa__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/jsbn/rsa */ "./lib/lib/jsbn/rsa.js");
/* harmony import */ var _lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/jsbn/jsbn */ "./lib/lib/jsbn/jsbn.js");
/* harmony import */ var _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/jsrsasign/asn1-1.0 */ "./lib/lib/jsrsasign/asn1-1.0.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = /** @class */ (function (_super) {
    __extends(JSEncryptRSAKey, _super);
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        // Call the super constructor.
        //  RSAKey.call(this);
        // If a key key was provided.
        if (key) {
            // If this is a string...
            if (typeof key === "string") {
                _this.parseKey(key);
            }
            else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                // Set the values for the key.
                _this.parsePropertiesFrom(key);
            }
        }
        return _this;
    }
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    JSEncryptRSAKey.prototype.parseKey = function (pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\\s*)+$/;
            var der = reHex.test(pem) ? _lib_asn1js_hex__WEBPACK_IMPORTED_MODULE_1__.Hex.decode(pem) : _lib_asn1js_base64__WEBPACK_IMPORTED_MODULE_2__.Base64.unarmor(pem);
            var asn1 = _lib_asn1js_asn1__WEBPACK_IMPORTED_MODULE_3__.ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(coefficient, 16);
            }
            else if (asn1.sub.length === 2) {
                if (asn1.sub[0].sub) {
                    // Parse ASN.1 SubjectPublicKeyInfo type as defined by X.509
                    var bit_string = asn1.sub[1];
                    var sequence = bit_string.sub[0];
                    modulus = sequence.sub[0].getHexStringValue();
                    this.n = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(modulus, 16);
                    public_exponent = sequence.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
                else {
                    // Parse ASN.1 RSAPublicKey type as defined by PKCS #1
                    modulus = asn1.sub[0].getHexStringValue();
                    this.n = (0,_lib_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_5__.parseBigInt)(modulus, 16);
                    public_exponent = asn1.sub[1].getHexStringValue();
                    this.e = parseInt(public_exponent, 16);
                }
            }
            else {
                return false;
            }
            return true;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
        var options = {
            array: [
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ int: 0 }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.n }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ int: this.e }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.d }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.p }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.q }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.coeff }),
            ],
        };
        var seq = new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERSequence(options);
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
        return (0,_lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__.hex2b64)(this.getPrivateBaseKey());
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
        var first_sequence = new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERSequence({
            array: [
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERNull(),
            ],
        });
        var second_sequence = new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERSequence({
            array: [
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ bigint: this.n }),
                new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERInteger({ int: this.e }),
            ],
        });
        var bit_string = new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex(),
        });
        var seq = new _lib_jsrsasign_asn1_1_0__WEBPACK_IMPORTED_MODULE_6__.KJUR.asn1.DERSequence({
            array: [first_sequence, bit_string],
        });
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
        return (0,_lib_jsbn_base64__WEBPACK_IMPORTED_MODULE_0__.hex2b64)(this.getPublicBaseKey());
    };
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    JSEncryptRSAKey.wordwrap = function (str, width) {
        width = width || 64;
        if (!str) {
            return str;
        }
        var regex = "(.{1," + width + "})( +|$\\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\\n");
    };
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateKey = function () {
        var key = "-----BEGIN RSA PRIVATE KEY-----\\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key;
    };
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicKey = function () {
        var key = "-----BEGIN PUBLIC KEY-----\\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\\n";
        key += "-----END PUBLIC KEY-----";
        return key;
    };
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
        obj = obj || {};
        return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
    };
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff"));
    };
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
        }
    };
    return JSEncryptRSAKey;
}(_lib_jsbn_rsa__WEBPACK_IMPORTED_MODULE_4__.RSAKey));



//# sourceURL=webpack://JSEncrypt/./lib/JSEncryptRSAKey.js?`);
  }, "./lib/JSEncryptRSAKey.js"), "./lib/index.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSEncrypt": () => (/* reexport safe */ _JSEncrypt__WEBPACK_IMPORTED_MODULE_0__.JSEncrypt),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _JSEncrypt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JSEncrypt */ "./lib/JSEncrypt.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_JSEncrypt__WEBPACK_IMPORTED_MODULE_0__.JSEncrypt);


//# sourceURL=webpack://JSEncrypt/./lib/index.js?`);
  }, "./lib/index.js"), "./lib/lib/asn1js/asn1.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ASN1": () => (/* binding */ ASN1),
/* harmony export */   "ASN1Tag": () => (/* binding */ ASN1Tag),
/* harmony export */   "Stream": () => (/* binding */ Stream)
/* harmony export */ });
/* harmony import */ var _int10__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./int10 */ "./lib/lib/asn1js/int10.js");
// ASN.1 JavaScript decoder
// Copyright (c) 2008-2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
/*global oids */

var ellipsis = "\\u2026";
var reTimeS = /^(\\d\\d)(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])([01]\\d|2[0-3])(?:([0-5]\\d)(?:([0-5]\\d)(?:[.,](\\d{1,3}))?)?)?(Z|[-+](?:[0]\\d|1[0-2])([0-5]\\d)?)?$/;
var reTimeL = /^(\\d\\d\\d\\d)(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])([01]\\d|2[0-3])(?:([0-5]\\d)(?:([0-5]\\d)(?:[.,](\\d{1,3}))?)?)?(Z|[-+](?:[0]\\d|1[0-2])([0-5]\\d)?)?$/;
function stringCut(str, len) {
    if (str.length > len) {
        str = str.substring(0, len) + ellipsis;
    }
    return str;
}
var Stream = /** @class */ (function () {
    function Stream(enc, pos) {
        this.hexDigits = "0123456789ABCDEF";
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        }
        else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
        }
    }
    Stream.prototype.get = function (pos) {
        if (pos === undefined) {
            pos = this.pos++;
        }
        if (pos >= this.enc.length) {
            throw new Error("Requesting byte offset ".concat(pos, " on a stream of length ").concat(this.enc.length));
        }
        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
    };
    Stream.prototype.hexByte = function (b) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    };
    Stream.prototype.hexDump = function (start, end, raw) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true) {
                switch (i & 0xF) {
                    case 0x7:
                        s += "  ";
                        break;
                    case 0xF:
                        s += "\\n";
                        break;
                    default:
                        s += " ";
                }
            }
        }
        return s;
    };
    Stream.prototype.isASCII = function (start, end) {
        for (var i = start; i < end; ++i) {
            var c = this.get(i);
            if (c < 32 || c > 176) {
                return false;
            }
        }
        return true;
    };
    Stream.prototype.parseStringISO = function (start, end) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
        }
        return s;
    };
    Stream.prototype.parseStringUTF = function (start, end) {
        var s = "";
        for (var i = start; i < end;) {
            var c = this.get(i++);
            if (c < 128) {
                s += String.fromCharCode(c);
            }
            else if ((c > 191) && (c < 224)) {
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            }
            else {
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
            }
        }
        return s;
    };
    Stream.prototype.parseStringBMP = function (start, end) {
        var str = "";
        var hi;
        var lo;
        for (var i = start; i < end;) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
        }
        return str;
    };
    Stream.prototype.parseTime = function (start, end, shortYear) {
        var s = this.parseStringISO(start, end);
        var m = (shortYear ? reTimeS : reTimeL).exec(s);
        if (!m) {
            return "Unrecognized time: " + s;
        }
        if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
            m[1] = +m[1];
            m[1] += (+m[1] < 70) ? 2000 : 1900;
        }
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7]) {
                    s += "." + m[7];
                }
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != "Z") {
                s += m[8];
                if (m[9]) {
                    s += ":" + m[9];
                }
            }
        }
        return s;
    };
    Stream.prototype.parseInteger = function (start, end) {
        var v = this.get(start);
        var neg = (v > 127);
        var pad = neg ? 255 : 0;
        var len;
        var s = "";
        // skip unuseful bits (not allowed in DER)
        while (v == pad && ++start < end) {
            v = this.get(start);
        }
        len = end - start;
        if (len === 0) {
            return neg ? -1 : 0;
        }
        // show bit length of huge integers
        if (len > 4) {
            s = v;
            len <<= 3;
            while (((+s ^ pad) & 0x80) == 0) {
                s = +s << 1;
                --len;
            }
            s = "(" + len + " bit)\\n";
        }
        // decode the integer
        if (neg) {
            v = v - 256;
        }
        var n = new _int10__WEBPACK_IMPORTED_MODULE_0__.Int10(v);
        for (var i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
        }
        return s + n.toString();
    };
    Stream.prototype.parseBitString = function (start, end, maxLength) {
        var unusedBit = this.get(start);
        var lenBit = ((end - start - 1) << 3) - unusedBit;
        var intro = "(" + lenBit + " bit)\\n";
        var s = "";
        for (var i = start + 1; i < end; ++i) {
            var b = this.get(i);
            var skip = (i == end - 1) ? unusedBit : 0;
            for (var j = 7; j >= skip; --j) {
                s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
                return intro + stringCut(s, maxLength);
            }
        }
        return intro + s;
    };
    Stream.prototype.parseOctetString = function (start, end, maxLength) {
        if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
        }
        var len = end - start;
        var s = "(" + len + " byte)\\n";
        maxLength /= 2; // we work in bytes
        if (len > maxLength) {
            end = start + maxLength;
        }
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
        }
        if (len > maxLength) {
            s += ellipsis;
        }
        return s;
    };
    Stream.prototype.parseOID = function (start, end, maxLength) {
        var s = "";
        var n = new _int10__WEBPACK_IMPORTED_MODULE_0__.Int10();
        var bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n.mulAdd(128, v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) { // finished
                if (s === "") {
                    n = n.simplify();
                    if (n instanceof _int10__WEBPACK_IMPORTED_MODULE_0__.Int10) {
                        n.sub(80);
                        s = "2." + n.toString();
                    }
                    else {
                        var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                        s = m + "." + (n - m * 40);
                    }
                }
                else {
                    s += "." + n.toString();
                }
                if (s.length > maxLength) {
                    return stringCut(s, maxLength);
                }
                n = new _int10__WEBPACK_IMPORTED_MODULE_0__.Int10();
                bits = 0;
            }
        }
        if (bits > 0) {
            s += ".incomplete";
        }
        return s;
    };
    return Stream;
}());

var ASN1 = /** @class */ (function () {
    function ASN1(stream, header, length, tag, sub) {
        if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
        }
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }
    ASN1.prototype.typeName = function () {
        switch (this.tag.tagClass) {
            case 0: // universal
                switch (this.tag.tagNumber) {
                    case 0x00:
                        return "EOC";
                    case 0x01:
                        return "BOOLEAN";
                    case 0x02:
                        return "INTEGER";
                    case 0x03:
                        return "BIT_STRING";
                    case 0x04:
                        return "OCTET_STRING";
                    case 0x05:
                        return "NULL";
                    case 0x06:
                        return "OBJECT_IDENTIFIER";
                    case 0x07:
                        return "ObjectDescriptor";
                    case 0x08:
                        return "EXTERNAL";
                    case 0x09:
                        return "REAL";
                    case 0x0A:
                        return "ENUMERATED";
                    case 0x0B:
                        return "EMBEDDED_PDV";
                    case 0x0C:
                        return "UTF8String";
                    case 0x10:
                        return "SEQUENCE";
                    case 0x11:
                        return "SET";
                    case 0x12:
                        return "NumericString";
                    case 0x13:
                        return "PrintableString"; // ASCII subset
                    case 0x14:
                        return "TeletexString"; // aka T61String
                    case 0x15:
                        return "VideotexString";
                    case 0x16:
                        return "IA5String"; // ASCII
                    case 0x17:
                        return "UTCTime";
                    case 0x18:
                        return "GeneralizedTime";
                    case 0x19:
                        return "GraphicString";
                    case 0x1A:
                        return "VisibleString"; // ASCII subset
                    case 0x1B:
                        return "GeneralString";
                    case 0x1C:
                        return "UniversalString";
                    case 0x1E:
                        return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();
            case 1:
                return "Application_" + this.tag.tagNumber.toString();
            case 2:
                return "[" + this.tag.tagNumber.toString() + "]"; // Context
            case 3:
                return "Private_" + this.tag.tagNumber.toString();
        }
    };
    ASN1.prototype.content = function (maxLength) {
        if (this.tag === undefined) {
            return null;
        }
        if (maxLength === undefined) {
            maxLength = Infinity;
        }
        var content = this.posContent();
        var len = Math.abs(this.length);
        if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(content, content + len, maxLength);
        }
        switch (this.tag.tagNumber) {
            case 0x01: // BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02: // INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len, maxLength);
            case 0x04: // OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len, maxLength);
            // case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                else {
                    return "(no elem)";
                }
            case 0x0C: // UTF8String
                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1A: // VisibleString
                // case 0x1B: // GeneralString
                // case 0x1C: // UniversalString
                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
            case 0x1E: // BMPString
                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
        }
        return null;
    };
    ASN1.prototype.toString = function () {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
    };
    ASN1.prototype.toPrettyString = function (indent) {
        if (indent === undefined) {
            indent = "";
        }
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0) {
            s += "+";
        }
        s += this.length;
        if (this.tag.tagConstructed) {
            s += " (constructed)";
        }
        else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
            s += " (encapsulates)";
        }
        s += "\\n";
        if (this.sub !== null) {
            indent += "  ";
            for (var i = 0, max = this.sub.length; i < max; ++i) {
                s += this.sub[i].toPrettyString(indent);
            }
        }
        return s;
    };
    ASN1.prototype.posStart = function () {
        return this.stream.pos;
    };
    ASN1.prototype.posContent = function () {
        return this.stream.pos + this.header;
    };
    ASN1.prototype.posEnd = function () {
        return this.stream.pos + this.header + Math.abs(this.length);
    };
    ASN1.prototype.toHexString = function () {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };
    ASN1.decodeLength = function (stream) {
        var buf = stream.get();
        var len = buf & 0x7F;
        if (len == buf) {
            return len;
        }
        // no reason to use Int10, as it would be a huge buffer anyways
        if (len > 6) {
            throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
        }
        if (len === 0) {
            return null;
        } // undefined
        buf = 0;
        for (var i = 0; i < len; ++i) {
            buf = (buf * 256) + stream.get();
        }
        return buf;
    };
    /**
     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
     * @returns {string}
     * @public
     */
    ASN1.prototype.getHexStringValue = function () {
        var hexString = this.toHexString();
        var offset = this.header * 2;
        var length = this.length * 2;
        return hexString.substr(offset, length);
    };
    ASN1.decode = function (str) {
        var stream;
        if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
        }
        else {
            stream = str;
        }
        var streamStart = new Stream(stream);
        var tag = new ASN1Tag(stream);
        var len = ASN1.decodeLength(stream);
        var start = stream.pos;
        var header = start - streamStart.pos;
        var sub = null;
        var getSub = function () {
            var ret = [];
            if (len !== null) {
                // definite length
                var end = start + len;
                while (stream.pos < end) {
                    ret[ret.length] = ASN1.decode(stream);
                }
                if (stream.pos != end) {
                    throw new Error("Content size is not correct for container starting at offset " + start);
                }
            }
            else {
                // undefined length
                try {
                    for (;;) {
                        var s = ASN1.decode(stream);
                        if (s.tag.isEOC()) {
                            break;
                        }
                        ret[ret.length] = s;
                    }
                    len = start - stream.pos; // undefined lengths are represented as negative values
                }
                catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
            }
            return ret;
        };
        if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
        }
        else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
                if (tag.tagNumber == 0x03) {
                    if (stream.get() != 0) {
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    }
                }
                sub = getSub();
                for (var i = 0; i < sub.length; ++i) {
                    if (sub[i].tag.isEOC()) {
                        throw new Error("EOC is not supposed to be actual content.");
                    }
                }
            }
            catch (e) {
                // but silently ignore when they don't
                sub = null;
            }
        }
        if (sub === null) {
            if (len === null) {
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
            }
            stream.pos = start + Math.abs(len);
        }
        return new ASN1(streamStart, header, len, tag, sub);
    };
    return ASN1;
}());

var ASN1Tag = /** @class */ (function () {
    function ASN1Tag(stream) {
        var buf = stream.get();
        this.tagClass = buf >> 6;
        this.tagConstructed = ((buf & 0x20) !== 0);
        this.tagNumber = buf & 0x1F;
        if (this.tagNumber == 0x1F) { // long tag
            var n = new _int10__WEBPACK_IMPORTED_MODULE_0__.Int10();
            do {
                buf = stream.get();
                n.mulAdd(128, buf & 0x7F);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
        }
    }
    ASN1Tag.prototype.isUniversal = function () {
        return this.tagClass === 0x00;
    };
    ASN1Tag.prototype.isEOC = function () {
        return this.tagClass === 0x00 && this.tagNumber === 0x00;
    };
    return ASN1Tag;
}());



//# sourceURL=webpack://JSEncrypt/./lib/lib/asn1js/asn1.js?`);
  }, "./lib/lib/asn1js/asn1.js"), "./lib/lib/asn1js/base64.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Base64": () => (/* binding */ Base64)
/* harmony export */ });
// Base64 JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Base64 = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var ignore = "= \\f\\n\\r\\t\\u00A0\\u2028\\u2029";
            decoder = Object.create(null);
            for (i = 0; i < 64; ++i) {
                decoder[b64.charAt(i)] = i;
            }
            decoder['-'] = 62; //+
            decoder['_'] = 63; //-
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 4) {
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                out[out.length] = bits & 0xFF;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 6;
            }
        }
        switch (char_count) {
            case 1:
                throw new Error("Base64 encoding incomplete: at least 2 bits missing");
            case 2:
                out[out.length] = (bits >> 10);
                break;
            case 3:
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                break;
        }
        return out;
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\\/=\\s]+)-----END [^-]+-----|begin-base64[^\\n]+\\n([A-Za-z0-9+\\/=\\s]+)====/,
    unarmor: function (a) {
        var m = Base64.re.exec(a);
        if (m) {
            if (m[1]) {
                a = m[1];
            }
            else if (m[2]) {
                a = m[2];
            }
            else {
                throw new Error("RegExp out of sync");
            }
        }
        return Base64.decode(a);
    }
};


//# sourceURL=webpack://JSEncrypt/./lib/lib/asn1js/base64.js?`);
  }, "./lib/lib/asn1js/base64.js"), "./lib/lib/asn1js/hex.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hex": () => (/* binding */ Hex)
/* harmony export */ });
// Hex JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Hex = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var hex = "0123456789ABCDEF";
            var ignore = " \\f\\n\\r\\t\\u00A0\\u2028\\u2029";
            decoder = {};
            for (i = 0; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            hex = hex.toLowerCase();
            for (i = 10; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 2) {
                out[out.length] = bits;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 4;
            }
        }
        if (char_count) {
            throw new Error("Hex encoding incomplete: 4 bits missing");
        }
        return out;
    }
};


//# sourceURL=webpack://JSEncrypt/./lib/lib/asn1js/hex.js?`);
  }, "./lib/lib/asn1js/hex.js"), "./lib/lib/asn1js/int10.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Int10": () => (/* binding */ Int10)
/* harmony export */ });
// Big integer base-10 printing library
// Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
var Int10 = /** @class */ (function () {
    function Int10(value) {
        this.buf = [+value || 0];
    }
    Int10.prototype.mulAdd = function (m, c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] * m + c;
            if (t < max) {
                c = 0;
            }
            else {
                c = 0 | (t / max);
                t -= c * max;
            }
            b[i] = t;
        }
        if (c > 0) {
            b[i] = c;
        }
    };
    Int10.prototype.sub = function (c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] - c;
            if (t < 0) {
                t += max;
                c = 1;
            }
            else {
                c = 0;
            }
            b[i] = t;
        }
        while (b[b.length - 1] === 0) {
            b.pop();
        }
    };
    Int10.prototype.toString = function (base) {
        if ((base || 10) != 10) {
            throw new Error("only base 10 is supported");
        }
        var b = this.buf;
        var s = b[b.length - 1].toString();
        for (var i = b.length - 2; i >= 0; --i) {
            s += (max + b[i]).toString().substring(1);
        }
        return s;
    };
    Int10.prototype.valueOf = function () {
        var b = this.buf;
        var v = 0;
        for (var i = b.length - 1; i >= 0; --i) {
            v = v * max + b[i];
        }
        return v;
    };
    Int10.prototype.simplify = function () {
        var b = this.buf;
        return (b.length == 1) ? b[0] : this;
    };
    return Int10;
}());



//# sourceURL=webpack://JSEncrypt/./lib/lib/asn1js/int10.js?`);
  }, "./lib/lib/asn1js/int10.js"), "./lib/lib/jsbn/base64.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b64toBA": () => (/* binding */ b64toBA),
/* harmony export */   "b64tohex": () => (/* binding */ b64tohex),
/* harmony export */   "hex2b64": () => (/* binding */ hex2b64)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./lib/lib/jsbn/util.js");

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}
// convert a base64 string to hex
function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(slop);
            ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)((slop << 2) | (v >> 4));
            ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(slop << 2);
    }
    return ret;
}
// convert a base64 string to a byte/number array
function b64toBA(s) {
    // piggyback on b64tohex for now, optimize later
    var h = b64tohex(s);
    var i;
    var a = [];
    for (i = 0; 2 * i < h.length; ++i) {
        a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
    }
    return a;
}


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsbn/base64.js?`);
  }, "./lib/lib/jsbn/base64.js"), "./lib/lib/jsbn/jsbn.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BigInteger": () => (/* binding */ BigInteger),
/* harmony export */   "intAt": () => (/* binding */ intAt),
/* harmony export */   "nbi": () => (/* binding */ nbi),
/* harmony export */   "nbits": () => (/* binding */ nbits),
/* harmony export */   "nbv": () => (/* binding */ nbv),
/* harmony export */   "parseBigInt": () => (/* binding */ parseBigInt)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./lib/lib/jsbn/util.js");
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;
// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
//#region
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
//#endregion
// (public) Constructor
var BigInteger = /** @class */ (function () {
    function BigInteger(a, b, c) {
        if (a != null) {
            if ("number" == typeof a) {
                this.fromNumber(a, b, c);
            }
            else if (b == null && "string" != typeof a) {
                this.fromString(a, 256);
            }
            else {
                this.fromString(a, b);
            }
        }
    }
    //#region PUBLIC
    // BigInteger.prototype.toString = bnToString;
    // (public) return string representation in given radix
    BigInteger.prototype.toString = function (b) {
        if (this.s < 0) {
            return "-" + this.negate().toString(b);
        }
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            return this.toRadix(b);
        }
        var km = (1 << k) - 1;
        var d;
        var m = false;
        var r = "";
        var i = this.t;
        var p = this.DB - (i * this.DB) % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += this.DB - k);
                }
                else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0) {
                    m = true;
                }
                if (m) {
                    r += (0,_util__WEBPACK_IMPORTED_MODULE_0__.int2char)(d);
                }
            }
        }
        return m ? r : "0";
    };
    // BigInteger.prototype.negate = bnNegate;
    // (public) -this
    BigInteger.prototype.negate = function () {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    };
    // BigInteger.prototype.abs = bnAbs;
    // (public) |this|
    BigInteger.prototype.abs = function () {
        return (this.s < 0) ? this.negate() : this;
    };
    // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal
    BigInteger.prototype.compareTo = function (a) {
        var r = this.s - a.s;
        if (r != 0) {
            return r;
        }
        var i = this.t;
        r = i - a.t;
        if (r != 0) {
            return (this.s < 0) ? -r : r;
        }
        while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) {
                return r;
            }
        }
        return 0;
    };
    // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"
    BigInteger.prototype.bitLength = function () {
        if (this.t <= 0) {
            return 0;
        }
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
    };
    // BigInteger.prototype.mod = bnMod;
    // (public) this mod a
    BigInteger.prototype.mod = function (a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            a.subTo(r, r);
        }
        return r;
    };
    // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32
    BigInteger.prototype.modPowInt = function (e, m) {
        var z;
        if (e < 256 || m.isEven()) {
            z = new Classic(m);
        }
        else {
            z = new Montgomery(m);
        }
        return this.exp(e, z);
    };
    // BigInteger.prototype.clone = bnClone;
    // (public)
    BigInteger.prototype.clone = function () {
        var r = nbi();
        this.copyTo(r);
        return r;
    };
    // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer
    BigInteger.prototype.intValue = function () {
        if (this.s < 0) {
            if (this.t == 1) {
                return this[0] - this.DV;
            }
            else if (this.t == 0) {
                return -1;
            }
        }
        else if (this.t == 1) {
            return this[0];
        }
        else if (this.t == 0) {
            return 0;
        }
        // assumes 16 < DB < 32
        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    };
    // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte
    BigInteger.prototype.byteValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
    };
    // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)
    BigInteger.prototype.shortValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
    };
    // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0
    BigInteger.prototype.signum = function () {
        if (this.s < 0) {
            return -1;
        }
        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
            return 0;
        }
        else {
            return 1;
        }
    };
    // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array
    BigInteger.prototype.toByteArray = function () {
        var i = this.t;
        var r = [];
        r[0] = this.s;
        var p = this.DB - (i * this.DB) % 8;
        var d;
        var k = 0;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                r[k++] = d | (this.s << (this.DB - p));
            }
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
                    d |= this[--i] >> (p += this.DB - 8);
                }
                else {
                    d = (this[i] >> (p -= 8)) & 0xff;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0) {
                    d |= -256;
                }
                if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                    ++k;
                }
                if (k > 0 || d != this.s) {
                    r[k++] = d;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.equals = function (a) {
        return (this.compareTo(a) == 0);
    };
    // BigInteger.prototype.min = bnMin;
    BigInteger.prototype.min = function (a) {
        return (this.compareTo(a) < 0) ? this : a;
    };
    // BigInteger.prototype.max = bnMax;
    BigInteger.prototype.max = function (a) {
        return (this.compareTo(a) > 0) ? this : a;
    };
    // BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.and = function (a) {
        var r = nbi();
        this.bitwiseTo(a, _util__WEBPACK_IMPORTED_MODULE_0__.op_and, r);
        return r;
    };
    // BigInteger.prototype.or = bnOr;
    BigInteger.prototype.or = function (a) {
        var r = nbi();
        this.bitwiseTo(a, _util__WEBPACK_IMPORTED_MODULE_0__.op_or, r);
        return r;
    };
    // BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.xor = function (a) {
        var r = nbi();
        this.bitwiseTo(a, _util__WEBPACK_IMPORTED_MODULE_0__.op_xor, r);
        return r;
    };
    // BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.andNot = function (a) {
        var r = nbi();
        this.bitwiseTo(a, _util__WEBPACK_IMPORTED_MODULE_0__.op_andnot, r);
        return r;
    };
    // BigInteger.prototype.not = bnNot;
    // (public) ~this
    BigInteger.prototype.not = function () {
        var r = nbi();
        for (var i = 0; i < this.t; ++i) {
            r[i] = this.DM & ~this[i];
        }
        r.t = this.t;
        r.s = ~this.s;
        return r;
    };
    // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n
    BigInteger.prototype.shiftLeft = function (n) {
        var r = nbi();
        if (n < 0) {
            this.rShiftTo(-n, r);
        }
        else {
            this.lShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n
    BigInteger.prototype.shiftRight = function (n) {
        var r = nbi();
        if (n < 0) {
            this.lShiftTo(-n, r);
        }
        else {
            this.rShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)
    BigInteger.prototype.getLowestSetBit = function () {
        for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) {
                return i * this.DB + (0,_util__WEBPACK_IMPORTED_MODULE_0__.lbit)(this[i]);
            }
        }
        if (this.s < 0) {
            return this.t * this.DB;
        }
        return -1;
    };
    // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits
    BigInteger.prototype.bitCount = function () {
        var r = 0;
        var x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i) {
            r += (0,_util__WEBPACK_IMPORTED_MODULE_0__.cbit)(this[i] ^ x);
        }
        return r;
    };
    // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set
    BigInteger.prototype.testBit = function (n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t) {
            return (this.s != 0);
        }
        return ((this[j] & (1 << (n % this.DB))) != 0);
    };
    // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)
    BigInteger.prototype.setBit = function (n) {
        return this.changeBit(n, _util__WEBPACK_IMPORTED_MODULE_0__.op_or);
    };
    // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)
    BigInteger.prototype.clearBit = function (n) {
        return this.changeBit(n, _util__WEBPACK_IMPORTED_MODULE_0__.op_andnot);
    };
    // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)
    BigInteger.prototype.flipBit = function (n) {
        return this.changeBit(n, _util__WEBPACK_IMPORTED_MODULE_0__.op_xor);
    };
    // BigInteger.prototype.add = bnAdd;
    // (public) this + a
    BigInteger.prototype.add = function (a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
    };
    // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a
    BigInteger.prototype.subtract = function (a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
    };
    // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a
    BigInteger.prototype.multiply = function (a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
    };
    // BigInteger.prototype.divide = bnDivide;
    // (public) this / a
    BigInteger.prototype.divide = function (a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
    };
    // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a
    BigInteger.prototype.remainder = function (a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
    };
    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]
    BigInteger.prototype.divideAndRemainder = function (a) {
        var q = nbi();
        var r = nbi();
        this.divRemTo(a, q, r);
        return [q, r];
    };
    // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)
    BigInteger.prototype.modPow = function (e, m) {
        var i = e.bitLength();
        var k;
        var r = nbv(1);
        var z;
        if (i <= 0) {
            return r;
        }
        else if (i < 18) {
            k = 1;
        }
        else if (i < 48) {
            k = 3;
        }
        else if (i < 144) {
            k = 4;
        }
        else if (i < 768) {
            k = 5;
        }
        else {
            k = 6;
        }
        if (i < 8) {
            z = new Classic(m);
        }
        else if (m.isEven()) {
            z = new Barrett(m);
        }
        else {
            z = new Montgomery(m);
        }
        // precomputation
        var g = [];
        var n = 3;
        var k1 = k - 1;
        var km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
                g[n] = nbi();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
            }
        }
        var j = e.t - 1;
        var w;
        var is1 = true;
        var r2 = nbi();
        var t;
        i = nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1) {
                w = (e[j] >> (i - k1)) & km;
            }
            else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0) {
                    w |= e[j - 1] >> (this.DB + i - k1);
                }
            }
            n = k;
            while ((w & 1) == 0) {
                w >>= 1;
                --n;
            }
            if ((i -= n) < 0) {
                i += this.DB;
                --j;
            }
            if (is1) { // ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
            }
            else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0) {
                    z.sqrTo(r, r2);
                }
                else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                    i = this.DB - 1;
                    --j;
                }
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)
    BigInteger.prototype.modInverse = function (m) {
        var ac = m.isEven();
        if ((this.isEven() && ac) || m.signum() == 0) {
            return BigInteger.ZERO;
        }
        var u = m.clone();
        var v = this.clone();
        var a = nbv(1);
        var b = nbv(0);
        var c = nbv(0);
        var d = nbv(1);
        while (u.signum() != 0) {
            while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                    if (!a.isEven() || !b.isEven()) {
                        a.addTo(this, a);
                        b.subTo(m, b);
                    }
                    a.rShiftTo(1, a);
                }
                else if (!b.isEven()) {
                    b.subTo(m, b);
                }
                b.rShiftTo(1, b);
            }
            while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                    if (!c.isEven() || !d.isEven()) {
                        c.addTo(this, c);
                        d.subTo(m, d);
                    }
                    c.rShiftTo(1, c);
                }
                else if (!d.isEven()) {
                    d.subTo(m, d);
                }
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) {
                    a.subTo(c, a);
                }
                b.subTo(d, b);
            }
            else {
                v.subTo(u, v);
                if (ac) {
                    c.subTo(a, c);
                }
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0) {
            return BigInteger.ZERO;
        }
        if (d.compareTo(m) >= 0) {
            return d.subtract(m);
        }
        if (d.signum() < 0) {
            d.addTo(m, d);
        }
        else {
            return d;
        }
        if (d.signum() < 0) {
            return d.add(m);
        }
        else {
            return d;
        }
    };
    // BigInteger.prototype.pow = bnPow;
    // (public) this^e
    BigInteger.prototype.pow = function (e) {
        return this.exp(e, new NullExp());
    };
    // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)
    BigInteger.prototype.gcd = function (a) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            return x;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
        }
        if (g > 0) {
            y.lShiftTo(g, y);
        }
        return y;
    };
    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t
    BigInteger.prototype.isProbablePrime = function (t) {
        var i;
        var x = this.abs();
        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i) {
                if (x[0] == lowprimes[i]) {
                    return true;
                }
            }
            return false;
        }
        if (x.isEven()) {
            return false;
        }
        i = 1;
        while (i < lowprimes.length) {
            var m = lowprimes[i];
            var j = i + 1;
            while (j < lowprimes.length && m < lplim) {
                m *= lowprimes[j++];
            }
            m = x.modInt(m);
            while (i < j) {
                if (m % lowprimes[i++] == 0) {
                    return false;
                }
            }
        }
        return x.millerRabin(t);
    };
    //#endregion PUBLIC
    //#region PROTECTED
    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r
    BigInteger.prototype.copyTo = function (r) {
        for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
        }
        r.t = this.t;
        r.s = this.s;
    };
    // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV
    BigInteger.prototype.fromInt = function (x) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0) {
            this[0] = x;
        }
        else if (x < -1) {
            this[0] = x + this.DV;
        }
        else {
            this.t = 0;
        }
    };
    // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix
    BigInteger.prototype.fromString = function (s, b) {
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 256) {
            k = 8;
            /* byte array */
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length;
        var mi = false;
        var sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") {
                    mi = true;
                }
                continue;
            }
            mi = false;
            if (sh == 0) {
                this[this.t++] = x;
            }
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (this.DB - sh));
            }
            else {
                this[this.t - 1] |= x << sh;
            }
            sh += k;
            if (sh >= this.DB) {
                sh -= this.DB;
            }
        }
        if (k == 8 && ((+s[0]) & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) {
                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
        }
        this.clamp();
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words
    BigInteger.prototype.clamp = function () {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
        }
    };
    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB
    BigInteger.prototype.dlShiftTo = function (n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
        }
        for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r.t = this.t + n;
        r.s = this.s;
    };
    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB
    BigInteger.prototype.drShiftTo = function (n, r) {
        for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
        }
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    };
    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n
    BigInteger.prototype.lShiftTo = function (n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB);
        var c = (this.s << bs) & this.DM;
        for (var i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (var i = ds - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    };
    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n
    BigInteger.prototype.rShiftTo = function (n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) {
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        }
        r.t = this.t - ds;
        r.clamp();
    };
    // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a
    BigInteger.prototype.subTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c < -1) {
            r[i++] = this.DV + c;
        }
        else if (c > 0) {
            r[i++] = c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyTo = function (a, r) {
        var x = this.abs();
        var y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        }
        r.s = 0;
        r.clamp();
        if (this.s != a.s) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)
    BigInteger.prototype.squareTo = function (r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) {
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        }
        r.s = 0;
        r.clamp();
    };
    // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    BigInteger.prototype.divRemTo = function (m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) {
            return;
        }
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) {
                q.fromInt(0);
            }
            if (r != null) {
                this.copyTo(r);
            }
            return;
        }
        if (r == null) {
            r = nbi();
        }
        var y = nbi();
        var ts = this.s;
        var ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        }
        else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) {
            return;
        }
        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt;
        var d2 = (1 << this.F1) / yt;
        var e = 1 << this.F2;
        var i = r.t;
        var j = i - ys;
        var t = (q == null) ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys) {
            y[y.t++] = 0;
        }
        while (--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) {
                    r.subTo(t, r);
                }
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) {
                BigInteger.ZERO.subTo(q, q);
            }
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) {
            r.rShiftTo(nsh, r);
        } // Denormalize remainder
        if (ts < 0) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.invDigit = bnpInvDigit;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    BigInteger.prototype.invDigit = function () {
        if (this.t < 1) {
            return 0;
        }
        var x = this[0];
        if ((x & 1) == 0) {
            return 0;
        }
        var y = x & 3; // y == 1/x mod 2^2
        y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
        y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y > 0) ? this.DV - y : -y;
    };
    // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even
    BigInteger.prototype.isEven = function () {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    };
    // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    BigInteger.prototype.exp = function (e, z) {
        if (e > 0xffffffff || e < 1) {
            return BigInteger.ONE;
        }
        var r = nbi();
        var r2 = nbi();
        var g = z.convert(this);
        var i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0) {
                z.mulTo(r2, g, r);
            }
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV
    BigInteger.prototype.chunkSize = function (r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
    };
    // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string
    BigInteger.prototype.toRadix = function (b) {
        if (b == null) {
            b = 10;
        }
        if (this.signum() == 0 || b < 2 || b > 36) {
            return "0";
        }
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a);
        var y = nbi();
        var z = nbi();
        var r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
    };
    // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string
    BigInteger.prototype.fromRadix = function (s, b) {
        this.fromInt(0);
        if (b == null) {
            b = 10;
        }
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs);
        var mi = false;
        var j = 0;
        var w = 0;
        for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-" && this.signum() == 0) {
                    mi = true;
                }
                continue;
            }
            w = b * w + x;
            if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
            }
        }
        if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
        }
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor
    BigInteger.prototype.fromNumber = function (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    // force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), _util__WEBPACK_IMPORTED_MODULE_0__.op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                } // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a) {
                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                    }
                }
            }
        }
        else {
            // new BigInteger(int,RNG)
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)
    BigInteger.prototype.bitwiseTo = function (a, op, r) {
        var i;
        var f;
        var m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
        }
        if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) {
                r[i] = op(this[i], f);
            }
            r.t = this.t;
        }
        else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) {
                r[i] = op(f, a[i]);
            }
            r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    };
    // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)
    BigInteger.prototype.changeBit = function (n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    };
    // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a
    BigInteger.prototype.addTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c += a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c > 0) {
            r[i++] = c;
        }
        else if (c < -1) {
            r[i++] = this.DV + c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV
    BigInteger.prototype.dMultiply = function (n) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    };
    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0
    BigInteger.prototype.dAddOffset = function (n, w) {
        if (n == 0) {
            return;
        }
        while (this.t <= w) {
            this[this.t++] = 0;
        }
        this[w] += n;
        while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) {
                this[this.t++] = 0;
            }
            ++this[w];
        }
    };
    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0) {
            r[--i] = 0;
        }
        for (var j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        }
        for (var j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
        }
        r.clamp();
    };
    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        }
        r.clamp();
        r.drShiftTo(1, r);
    };
    // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26
    BigInteger.prototype.modInt = function (n) {
        if (n <= 0) {
            return 0;
        }
        var d = this.DV % n;
        var r = (this.s < 0) ? n - 1 : 0;
        if (this.t > 0) {
            if (d == 0) {
                r = this[0] % n;
            }
            else {
                for (var i = this.t - 1; i >= 0; --i) {
                    r = (d * r + this[i]) % n;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    BigInteger.prototype.millerRabin = function (t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) {
            return false;
        }
        var r = n1.shiftRight(k);
        t = (t + 1) >> 1;
        if (t > lowprimes.length) {
            t = lowprimes.length;
        }
        var a = nbi();
        for (var i = 0; i < t; ++i) {
            // Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0) {
                        return false;
                    }
                }
                if (y.compareTo(n1) != 0) {
                    return false;
                }
            }
        }
        return true;
    };
    // BigInteger.prototype.square = bnSquare;
    // (public) this^2
    BigInteger.prototype.square = function () {
        var r = nbi();
        this.squareTo(r);
        return r;
    };
    //#region ASYNC
    // Public API method
    BigInteger.prototype.gcda = function (a, callback) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            callback(x);
            return;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
        var gcda1 = function () {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
            if (!(x.signum() > 0)) {
                if (g > 0) {
                    y.lShiftTo(g, y);
                }
                setTimeout(function () { callback(y); }, 0); // escape
            }
            else {
                setTimeout(gcda1, 0);
            }
        };
        setTimeout(gcda1, 10);
    };
    // (protected) alternate constructor
    BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
        if ("number" == typeof b) {
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), _util__WEBPACK_IMPORTED_MODULE_0__.op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                }
                var bnp_1 = this;
                var bnpfn1_1 = function () {
                    bnp_1.dAddOffset(2, 0);
                    if (bnp_1.bitLength() > a) {
                        bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                    }
                    if (bnp_1.isProbablePrime(b)) {
                        setTimeout(function () { callback(); }, 0); // escape
                    }
                    else {
                        setTimeout(bnpfn1_1, 0);
                    }
                };
                setTimeout(bnpfn1_1, 0);
            }
        }
        else {
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    return BigInteger;
}());

//#region REDUCERS
//#region NullExp
var NullExp = /** @class */ (function () {
    function NullExp() {
    }
    // NullExp.prototype.convert = nNop;
    NullExp.prototype.convert = function (x) {
        return x;
    };
    // NullExp.prototype.revert = nNop;
    NullExp.prototype.revert = function (x) {
        return x;
    };
    // NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
    };
    // NullExp.prototype.sqrTo = nSqrTo;
    NullExp.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
    };
    return NullExp;
}());
// Modular reduction using "classic" algorithm
var Classic = /** @class */ (function () {
    function Classic(m) {
        this.m = m;
    }
    // Classic.prototype.convert = cConvert;
    Classic.prototype.convert = function (x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) {
            return x.mod(this.m);
        }
        else {
            return x;
        }
    };
    // Classic.prototype.revert = cRevert;
    Classic.prototype.revert = function (x) {
        return x;
    };
    // Classic.prototype.reduce = cReduce;
    Classic.prototype.reduce = function (x) {
        x.divRemTo(this.m, null, x);
    };
    // Classic.prototype.mulTo = cMulTo;
    Classic.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Classic.prototype.sqrTo = cSqrTo;
    Classic.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Classic;
}());
//#endregion
//#region Montgomery
// Montgomery reduction
var Montgomery = /** @class */ (function () {
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }
    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    Montgomery.prototype.convert = function (x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(r, r);
        }
        return r;
    };
    // Montgomery.prototype.revert = montRevert;
    // x/R mod m
    Montgomery.prototype.revert = function (x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    };
    // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)
    Montgomery.prototype.reduce = function (x) {
        while (x.t <= this.mt2) {
            // pad x so am has enough room later
            x[x.t++] = 0;
        }
        for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r
    Montgomery.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r
    Montgomery.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Montgomery;
}());
//#endregion Montgomery
//#region Barrett
// Barrett modular reduction
var Barrett = /** @class */ (function () {
    function Barrett(m) {
        this.m = m;
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
    }
    // Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.convert = function (x) {
        if (x.s < 0 || x.t > 2 * this.m.t) {
            return x.mod(this.m);
        }
        else if (x.compareTo(this.m) < 0) {
            return x;
        }
        else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    };
    // Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.revert = function (x) {
        return x;
    };
    // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)
    Barrett.prototype.reduce = function (x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
        }
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r
    Barrett.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r
    Barrett.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Barrett;
}());
//#endregion
//#endregion REDUCERS
// return new, unset BigInteger
function nbi() { return new BigInteger(null); }
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}
// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
var inBrowser = typeof navigator !== "undefined";
if (inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    BigInteger.prototype.am = function am2(i, x, w, j, c, n) {
        var xl = x & 0x7fff;
        var xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 0x7fff;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 0x3fffffff;
        }
        return c;
    };
    dbits = 30;
}
else if (inBrowser && j_lm && (navigator.appName != "Netscape")) {
    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    BigInteger.prototype.am = function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    };
    dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    BigInteger.prototype.am = function am3(i, x, w, j, c, n) {
        var xl = x & 0x3fff;
        var xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 0x3fff;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 0xfffffff;
        }
        return c;
    };
    dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
// Digit conversions
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}
// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}
// returns bit length of the integer x
function nbits(x) {
    var r = 1;
    var t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}
// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsbn/jsbn.js?`);
  }, "./lib/lib/jsbn/jsbn.js"), "./lib/lib/jsbn/prng4.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Arcfour": () => (/* binding */ Arcfour),
/* harmony export */   "prng_newstate": () => (/* binding */ prng_newstate),
/* harmony export */   "rng_psize": () => (/* binding */ rng_psize)
/* harmony export */ });
// prng4.js - uses Arcfour as a PRNG
var Arcfour = /** @class */ (function () {
    function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = [];
    }
    // Arcfour.prototype.init = ARC4init;
    // Initialize arcfour context from key, an array of ints, each from [0..255]
    Arcfour.prototype.init = function (key) {
        var i;
        var j;
        var t;
        for (i = 0; i < 256; ++i) {
            this.S[i] = i;
        }
        j = 0;
        for (i = 0; i < 256; ++i) {
            j = (j + this.S[i] + key[i % key.length]) & 255;
            t = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t;
        }
        this.i = 0;
        this.j = 0;
    };
    // Arcfour.prototype.next = ARC4next;
    Arcfour.prototype.next = function () {
        var t;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        t = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = t;
        return this.S[(t + this.S[this.i]) & 255];
    };
    return Arcfour;
}());

// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}
// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsbn/prng4.js?`);
  }, "./lib/lib/jsbn/prng4.js"), "./lib/lib/jsbn/rng.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SecureRandom": () => (/* binding */ SecureRandom)
/* harmony export */ });
/* harmony import */ var _prng4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prng4 */ "./lib/lib/jsbn/prng4.js");
// Random number generator - requires a PRNG backend, e.g. prng4.js

var rng_state;
var rng_pool = null;
var rng_pptr;
// Initialize the pool with junk if needed.
if (rng_pool == null) {
    rng_pool = [];
    rng_pptr = 0;
    var t = void 0;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        // Extract entropy (2048 bits) from RNG if available
        var z = new Uint32Array(256);
        window.crypto.getRandomValues(z);
        for (t = 0; t < z.length; ++t) {
            rng_pool[rng_pptr++] = z[t] & 255;
        }
    }
    // Use mouse events for entropy, if we do not have enough entropy by the time
    // we need it, entropy will be generated by Math.random.
    var count = 0;
    var onMouseMoveListener_1 = function (ev) {
        count = count || 0;
        if (count >= 256 || rng_pptr >= _prng4__WEBPACK_IMPORTED_MODULE_0__.rng_psize) {
            if (window.removeEventListener) {
                window.removeEventListener("mousemove", onMouseMoveListener_1, false);
            }
            else if (window.detachEvent) {
                window.detachEvent("onmousemove", onMouseMoveListener_1);
            }
            return;
        }
        try {
            var mouseCoordinates = ev.x + ev.y;
            rng_pool[rng_pptr++] = mouseCoordinates & 255;
            count += 1;
        }
        catch (e) {
            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
        }
    };
    if (typeof window !== 'undefined') {
        if (window.addEventListener) {
            window.addEventListener("mousemove", onMouseMoveListener_1, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onmousemove", onMouseMoveListener_1);
        }
    }
}
function rng_get_byte() {
    if (rng_state == null) {
        rng_state = (0,_prng4__WEBPACK_IMPORTED_MODULE_0__.prng_newstate)();
        // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
        while (rng_pptr < _prng4__WEBPACK_IMPORTED_MODULE_0__.rng_psize) {
            var random = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = random & 255;
        }
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
            rng_pool[rng_pptr] = 0;
        }
        rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}
var SecureRandom = /** @class */ (function () {
    function SecureRandom() {
    }
    SecureRandom.prototype.nextBytes = function (ba) {
        for (var i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
        }
    };
    return SecureRandom;
}());



//# sourceURL=webpack://JSEncrypt/./lib/lib/jsbn/rng.js?`);
  }, "./lib/lib/jsbn/rng.js"), "./lib/lib/jsbn/rsa.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RSAKey": () => (/* binding */ RSAKey)
/* harmony export */ });
/* harmony import */ var _jsbn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jsbn */ "./lib/lib/jsbn/jsbn.js");
/* harmony import */ var _rng__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng */ "./lib/lib/jsbn/rng.js");
// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object


// function linebrk(s,n) {
//   var ret = "";
//   var i = 0;
//   while(i + n < s.length) {
//     ret += s.substring(i,i+n) + "\\n";
//     i += n;
//   }
//   return ret + s.substring(i,s.length);
// }
// function byte2Hex(b) {
//   if(b < 0x10)
//     return "0" + b.toString(16);
//   else
//     return b.toString(16);
// }
function pkcs1pad1(s, n) {
    if (n < s.length + 22) {
        console.error("Message too long for RSA");
        return null;
    }
    var len = n - s.length - 6;
    var filler = "";
    for (var f = 0; f < len; f += 2) {
        filler += "ff";
    }
    var m = "0001" + filler + "00" + s;
    return (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(m, 16);
}
// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
        console.error("Message too long for RSA");
        return null;
    }
    var ba = [];
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) { // encode using utf-8
            ba[--n] = c;
        }
        else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        }
        else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new _rng__WEBPACK_IMPORTED_MODULE_1__.SecureRandom();
    var x = [];
    while (n > 2) { // random non-zero pad
        x[0] = 0;
        while (x[0] == 0) {
            rng.nextBytes(x);
        }
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new _jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(ba);
}
// "empty" RSA key constructor
var RSAKey = /** @class */ (function () {
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }
    //#region PROTECTED
    // protected
    // RSAKey.prototype.doPublic = RSADoPublic;
    // Perform raw public operation on "x": return x^e (mod n)
    RSAKey.prototype.doPublic = function (x) {
        return x.modPowInt(this.e, this.n);
    };
    // RSAKey.prototype.doPrivate = RSADoPrivate;
    // Perform raw private operation on "x": return x^d (mod n)
    RSAKey.prototype.doPrivate = function (x) {
        if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n);
        }
        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
        while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p);
        }
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    //#endregion PROTECTED
    //#region PUBLIC
    // RSAKey.prototype.setPublic = RSASetPublic;
    // Set the public key fields N and e from hex strings
    RSAKey.prototype.setPublic = function (N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(N, 16);
            this.e = parseInt(E, 16);
        }
        else {
            console.error("Invalid RSA public key");
        }
    };
    // RSAKey.prototype.encrypt = RSAEncrypt;
    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    RSAKey.prototype.encrypt = function (text) {
        var maxLength = (this.n.bitLength() + 7) >> 3;
        var m = pkcs1pad2(text, maxLength);
        if (m == null) {
            return null;
        }
        var c = this.doPublic(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        var length = h.length;
        // fix zero before result
        for (var i = 0; i < maxLength * 2 - length; i++) {
            h = "0" + h;
        }
        return h;
    };
    // RSAKey.prototype.setPrivate = RSASetPrivate;
    // Set the private key fields N, e, and d from hex strings
    RSAKey.prototype.setPrivate = function (N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(N, 16);
            this.e = parseInt(E, 16);
            this.d = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(D, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
    // Set the private key fields N, e, d and CRT params from hex strings
    RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(N, 16);
            this.e = parseInt(E, 16);
            this.d = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(D, 16);
            this.p = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(P, 16);
            this.q = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(Q, 16);
            this.dmp1 = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(DP, 16);
            this.dmq1 = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(DQ, 16);
            this.coeff = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(C, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.generate = RSAGenerate;
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generate = function (B, E) {
        var rng = new _rng__WEBPACK_IMPORTED_MODULE_1__.SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new _jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(E, 16);
        for (;;) {
            for (;;) {
                this.p = new _jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(B - qs, 1, rng);
                if (this.p.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE).gcd(ee).compareTo(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                    break;
                }
            }
            for (;;) {
                this.q = new _jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(qs, 1, rng);
                if (this.q.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE).gcd(ee).compareTo(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                    break;
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p;
                this.p = this.q;
                this.q = t;
            }
            var p1 = this.p.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE);
            var q1 = this.q.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    };
    // RSAKey.prototype.decrypt = RSADecrypt;
    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    RSAKey.prototype.decrypt = function (ctext) {
        var c = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(ctext, 16);
        var m = this.doPrivate(c);
        if (m == null) {
            return null;
        }
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
    };
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generateAsync = function (B, E, callback) {
        var rng = new _rng__WEBPACK_IMPORTED_MODULE_1__.SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new _jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(E, 16);
        var rsa = this;
        // These functions have non-descript names because they were originally for(;;) loops.
        // I don't know about cryptography to give them better names than loop1-4.
        var loop1 = function () {
            var loop4 = function () {
                if (rsa.p.compareTo(rsa.q) <= 0) {
                    var t = rsa.p;
                    rsa.p = rsa.q;
                    rsa.q = t;
                }
                var p1 = rsa.p.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE);
                var q1 = rsa.q.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE) == 0) {
                    rsa.n = rsa.p.multiply(rsa.q);
                    rsa.d = ee.modInverse(phi);
                    rsa.dmp1 = rsa.d.mod(p1);
                    rsa.dmq1 = rsa.d.mod(q1);
                    rsa.coeff = rsa.q.modInverse(rsa.p);
                    setTimeout(function () { callback(); }, 0); // escape
                }
                else {
                    setTimeout(loop1, 0);
                }
            };
            var loop3 = function () {
                rsa.q = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.nbi)();
                rsa.q.fromNumberAsync(qs, 1, rng, function () {
                    rsa.q.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                            setTimeout(loop4, 0);
                        }
                        else {
                            setTimeout(loop3, 0);
                        }
                    });
                });
            };
            var loop2 = function () {
                rsa.p = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.nbi)();
                rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                    rsa.p.subtract(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                            setTimeout(loop3, 0);
                        }
                        else {
                            setTimeout(loop2, 0);
                        }
                    });
                });
            };
            setTimeout(loop2, 0);
        };
        setTimeout(loop1, 0);
    };
    RSAKey.prototype.sign = function (text, digestMethod, digestName) {
        var header = getDigestHeader(digestName);
        var digest = header + digestMethod(text).toString();
        var m = pkcs1pad1(digest, this.n.bitLength() / 4);
        if (m == null) {
            return null;
        }
        var c = this.doPrivate(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h;
        }
        else {
            return "0" + h;
        }
    };
    RSAKey.prototype.verify = function (text, signature, digestMethod) {
        var c = (0,_jsbn__WEBPACK_IMPORTED_MODULE_0__.parseBigInt)(signature, 16);
        var m = this.doPublic(c);
        if (m == null) {
            return null;
        }
        var unpadded = m.toString(16).replace(/^1f+00/, "");
        var digest = removeDigestHeader(unpadded);
        return digest == digestMethod(text).toString();
    };
    return RSAKey;
}());

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
// https://tools.ietf.org/html/rfc3447#page-43
var DIGEST_HEADERS = {
    md2: "3020300c06082a864886f70d020205000410",
    md5: "3020300c06082a864886f70d020505000410",
    sha1: "3021300906052b0e03021a05000414",
    sha224: "302d300d06096086480165030402040500041c",
    sha256: "3031300d060960864801650304020105000420",
    sha384: "3041300d060960864801650304020205000430",
    sha512: "3051300d060960864801650304020305000440",
    ripemd160: "3021300906052b2403020105000414"
};
function getDigestHeader(name) {
    return DIGEST_HEADERS[name] || "";
}
function removeDigestHeader(str) {
    for (var name_1 in DIGEST_HEADERS) {
        if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
            var header = DIGEST_HEADERS[name_1];
            var len = header.length;
            if (str.substr(0, len) == header) {
                return str.substr(len);
            }
        }
    }
    return str;
}
// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
// function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
// }
// public
// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsbn/rsa.js?`);
  }, "./lib/lib/jsbn/rsa.js"), "./lib/lib/jsbn/util.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cbit": () => (/* binding */ cbit),
/* harmony export */   "int2char": () => (/* binding */ int2char),
/* harmony export */   "lbit": () => (/* binding */ lbit),
/* harmony export */   "op_and": () => (/* binding */ op_and),
/* harmony export */   "op_andnot": () => (/* binding */ op_andnot),
/* harmony export */   "op_or": () => (/* binding */ op_or),
/* harmony export */   "op_xor": () => (/* binding */ op_xor)
/* harmony export */ });
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) {
    return BI_RM.charAt(n);
}
//#region BIT_OPERATIONS
// (public) this & a
function op_and(x, y) {
    return x & y;
}
// (public) this | a
function op_or(x, y) {
    return x | y;
}
// (public) this ^ a
function op_xor(x, y) {
    return x ^ y;
}
// (public) this & ~a
function op_andnot(x, y) {
    return x & ~y;
}
// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
    if (x == 0) {
        return -1;
    }
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
    }
    if ((x & 1) == 0) {
        ++r;
    }
    return r;
}
// return number of 1 bits in x
function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r;
    }
    return r;
}
//#endregion BIT_OPERATIONS


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsbn/util.js?`);
  }, "./lib/lib/jsbn/util.js"), "./lib/lib/jsrsasign/asn1-1.0.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KJUR": () => (/* binding */ KJUR)
/* harmony export */ });
/* harmony import */ var _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../jsbn/jsbn */ "./lib/lib/jsbn/jsbn.js");
/* harmony import */ var _yahoo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./yahoo */ "./lib/lib/jsrsasign/yahoo.js");
/* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
/*
 * asn1.js - ASN.1 DER encoder classes
 *
 * Copyright (c) 2013-2017 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * https://kjur.github.io/jsrsasign/license
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 */


/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */
/**
 * kjur's class library name space
 * <p>
 * This name space provides following name spaces:
 * <ul>
 * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
 * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
 * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
 * class and utilities</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name KJUR
 * @namespace kjur's class library name space
 */
var KJUR = {};
/**
 * kjur's ASN.1 class library name space
 * <p>
 * This is ITU-T X.690 ASN.1 DER encoder class library and
 * class structure and methods is very similar to
 * org.bouncycastle.asn1 package of
 * well known BouncyCaslte Cryptography Library.
 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
 * Here are ASN.1 DER primitive classes.
 * <ul>
 * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
 * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
 * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
 * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
 * <li>0x05 {@link KJUR.asn1.DERNull}</li>
 * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
 * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
 * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
 * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
 * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
 * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
 * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
 * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
 * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
 * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
 * <li>0x31 {@link KJUR.asn1.DERSet}</li>
 * </ul>
 * <h4>OTHER ASN.1 CLASSES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.ASN1Object}</li>
 * <li>{@link KJUR.asn1.DERAbstractString}</li>
 * <li>{@link KJUR.asn1.DERAbstractTime}</li>
 * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
 * <li>{@link KJUR.asn1.DERTaggedObject}</li>
 * </ul>
 * <h4>SUB NAME SPACES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
 * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
 * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
 * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
 * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace.
 * This caused by a bug of jsdoc2.
 * @name KJUR.asn1
 * @namespace
 */
if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1)
    KJUR.asn1 = {};
/**
 * ASN1 utilities class
 * @name KJUR.asn1.ASN1Util
 * @class ASN1 utilities class
 * @since asn1 1.0.2
 */
KJUR.asn1.ASN1Util = new function () {
    this.integerToByteHex = function (i) {
        var h = i.toString(16);
        if ((h.length % 2) == 1)
            h = '0' + h;
        return h;
    };
    this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
        var h = bigIntegerValue.toString(16);
        if (h.substr(0, 1) != '-') {
            if (h.length % 2 == 1) {
                h = '0' + h;
            }
            else {
                if (!h.match(/^[0-7]/)) {
                    h = '00' + h;
                }
            }
        }
        else {
            var hPos = h.substr(1);
            var xorLen = hPos.length;
            if (xorLen % 2 == 1) {
                xorLen += 1;
            }
            else {
                if (!h.match(/^[0-7]/)) {
                    xorLen += 2;
                }
            }
            var hMask = '';
            for (var i = 0; i < xorLen; i++) {
                hMask += 'f';
            }
            var biMask = new _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(hMask, 16);
            var biNeg = biMask.xor(bigIntegerValue).add(_jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger.ONE);
            h = biNeg.toString(16).replace(/^-/, '');
        }
        return h;
    };
    /**
     * get PEM string from hexadecimal data and header string
     * @name getPEMStringFromHex
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {String} dataHex hexadecimal string of PEM body
     * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
     * @return {String} PEM formatted string of input data
     * @description
     * This method converts a hexadecimal string to a PEM string with
     * a specified header. Its line break will be CRLF("\\r\\n").
     * @example
     * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
     * // value of pem will be:
     * -----BEGIN PRIVATE KEY-----
     * YWFh
     * -----END PRIVATE KEY-----
     */
    this.getPEMStringFromHex = function (dataHex, pemHeader) {
        return hextopem(dataHex, pemHeader);
    };
    /**
     * generate ASN1Object specifed by JSON parameters
     * @name newObject
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return {KJUR.asn1.ASN1Object} generated object
     * @since asn1 1.0.3
     * @description
     * generate any ASN1Object specified by JSON param
     * including ASN.1 primitive or structured.
     * Generally 'param' can be described as follows:
     * <blockquote>
     * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
     * </blockquote>
     * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
     * <ul>
     * <li>'bool' - DERBoolean</li>
     * <li>'int' - DERInteger</li>
     * <li>'bitstr' - DERBitString</li>
     * <li>'octstr' - DEROctetString</li>
     * <li>'null' - DERNull</li>
     * <li>'oid' - DERObjectIdentifier</li>
     * <li>'enum' - DEREnumerated</li>
     * <li>'utf8str' - DERUTF8String</li>
     * <li>'numstr' - DERNumericString</li>
     * <li>'prnstr' - DERPrintableString</li>
     * <li>'telstr' - DERTeletexString</li>
     * <li>'ia5str' - DERIA5String</li>
     * <li>'utctime' - DERUTCTime</li>
     * <li>'gentime' - DERGeneralizedTime</li>
     * <li>'seq' - DERSequence</li>
     * <li>'set' - DERSet</li>
     * <li>'tag' - DERTaggedObject</li>
     * </ul>
     * @example
     * newObject({'prnstr': 'aaa'});
     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
     * // ASN.1 Tagged Object
     * newObject({'tag': {'tag': 'a1',
     *                    'explicit': true,
     *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
     * // more simple representation of ASN.1 Tagged Object
     * newObject({'tag': ['a1',
     *                    true,
     *                    {'seq': [
     *                      {'int': 3},
     *                      {'prnstr': 'aaa'}]}
     *                   ]});
     */
    this.newObject = function (param) {
        var _KJUR = KJUR, _KJUR_asn1 = _KJUR.asn1, _DERBoolean = _KJUR_asn1.DERBoolean, _DERInteger = _KJUR_asn1.DERInteger, _DERBitString = _KJUR_asn1.DERBitString, _DEROctetString = _KJUR_asn1.DEROctetString, _DERNull = _KJUR_asn1.DERNull, _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier, _DEREnumerated = _KJUR_asn1.DEREnumerated, _DERUTF8String = _KJUR_asn1.DERUTF8String, _DERNumericString = _KJUR_asn1.DERNumericString, _DERPrintableString = _KJUR_asn1.DERPrintableString, _DERTeletexString = _KJUR_asn1.DERTeletexString, _DERIA5String = _KJUR_asn1.DERIA5String, _DERUTCTime = _KJUR_asn1.DERUTCTime, _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime, _DERSequence = _KJUR_asn1.DERSequence, _DERSet = _KJUR_asn1.DERSet, _DERTaggedObject = _KJUR_asn1.DERTaggedObject, _newObject = _KJUR_asn1.ASN1Util.newObject;
        var keys = Object.keys(param);
        if (keys.length != 1)
            throw "key of param shall be only one.";
        var key = keys[0];
        if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
            throw "undefined key: " + key;
        if (key == "bool")
            return new _DERBoolean(param[key]);
        if (key == "int")
            return new _DERInteger(param[key]);
        if (key == "bitstr")
            return new _DERBitString(param[key]);
        if (key == "octstr")
            return new _DEROctetString(param[key]);
        if (key == "null")
            return new _DERNull(param[key]);
        if (key == "oid")
            return new _DERObjectIdentifier(param[key]);
        if (key == "enum")
            return new _DEREnumerated(param[key]);
        if (key == "utf8str")
            return new _DERUTF8String(param[key]);
        if (key == "numstr")
            return new _DERNumericString(param[key]);
        if (key == "prnstr")
            return new _DERPrintableString(param[key]);
        if (key == "telstr")
            return new _DERTeletexString(param[key]);
        if (key == "ia5str")
            return new _DERIA5String(param[key]);
        if (key == "utctime")
            return new _DERUTCTime(param[key]);
        if (key == "gentime")
            return new _DERGeneralizedTime(param[key]);
        if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSequence({ 'array': a });
        }
        if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSet({ 'array': a });
        }
        if (key == "tag") {
            var tagParam = param[key];
            if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
                tagParam.length == 3) {
                var obj = _newObject(tagParam[2]);
                return new _DERTaggedObject({ tag: tagParam[0],
                    explicit: tagParam[1],
                    obj: obj });
            }
            else {
                var newParam = {};
                if (tagParam.explicit !== undefined)
                    newParam.explicit = tagParam.explicit;
                if (tagParam.tag !== undefined)
                    newParam.tag = tagParam.tag;
                if (tagParam.obj === undefined)
                    throw "obj shall be specified for 'tag'.";
                newParam.obj = _newObject(tagParam.obj);
                return new _DERTaggedObject(newParam);
            }
        }
    };
    /**
     * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
     * @name jsonToASN1HEX
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return hexadecimal string of ASN1Object
     * @since asn1 1.0.4
     * @description
     * As for ASN.1 object representation of JSON object,
     * please see {@link newObject}.
     * @example
     * jsonToASN1HEX({'prnstr': 'aaa'});
     */
    this.jsonToASN1HEX = function (param) {
        var asn1Obj = this.newObject(param);
        return asn1Obj.getEncodedHex();
    };
};
/**
 * get dot noted oid number string from hexadecimal value of OID
 * @name oidHexToInt
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} hex hexadecimal value of object identifier
 * @return {String} dot noted string of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from hexadecimal string representation of
 * ASN.1 value of object identifier to oid number string.
 * @example
 * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
 */
KJUR.asn1.ASN1Util.oidHexToInt = function (hex) {
    var s = "";
    var i01 = parseInt(hex.substr(0, 2), 16);
    var i0 = Math.floor(i01 / 40);
    var i1 = i01 % 40;
    var s = i0 + "." + i1;
    var binbuf = "";
    for (var i = 2; i < hex.length; i += 2) {
        var value = parseInt(hex.substr(i, 2), 16);
        var bin = ("00000000" + value.toString(2)).slice(-8);
        binbuf = binbuf + bin.substr(1, 7);
        if (bin.substr(0, 1) == "0") {
            var bi = new _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
        }
    }
    ;
    return s;
};
/**
 * get hexadecimal value of object identifier from dot noted oid value
 * @name oidIntToHex
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * @example
 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
 */
KJUR.asn1.ASN1Util.oidIntToHex = function (oidString) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1)
            h = '0' + h;
        return h;
    };
    var roidtox = function (roid) {
        var h = '';
        var bi = new _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7)
            padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++)
            bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7)
                b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };
    if (!oidString.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + oidString;
    }
    var h = '';
    var a = oidString.split('.');
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
        h += roidtox(a[i]);
    }
    return h;
};
// ********************************************************************
//  Abstract ASN.1 Classes
// ********************************************************************
// ********************************************************************
/**
 * base class for ASN.1 DER encoder object
 * @name KJUR.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 * @description
 */
KJUR.asn1.ASN1Object = function () {
    var isModified = true;
    var hTLV = null;
    var hT = '00';
    var hL = '00';
    var hV = '';
    /**
     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
     * @name getLengthHexFromValue
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV length(L)
     */
    this.getLengthHexFromValue = function () {
        if (typeof this.hV == "undefined" || this.hV == null) {
            throw "this.hV is null or undefined.";
        }
        if (this.hV.length % 2 == 1) {
            throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
        }
        var n = this.hV.length / 2;
        var hN = n.toString(16);
        if (hN.length % 2 == 1) {
            hN = "0" + hN;
        }
        if (n < 128) {
            return hN;
        }
        else {
            var hNlen = hN.length / 2;
            if (hNlen > 15) {
                throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
        }
    };
    /**
     * get hexadecimal string of ASN.1 TLV bytes
     * @name getEncodedHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     */
    this.getEncodedHex = function () {
        if (this.hTLV == null || this.isModified) {
            this.hV = this.getFreshValueHex();
            this.hL = this.getLengthHexFromValue();
            this.hTLV = this.hT + this.hL + this.hV;
            this.isModified = false;
            //alert("first time: " + this.hTLV);
        }
        return this.hTLV;
    };
    /**
     * get hexadecimal string of ASN.1 TLV value(V) bytes
     * @name getValueHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
     */
    this.getValueHex = function () {
        this.getEncodedHex();
        return this.hV;
    };
    this.getFreshValueHex = function () {
        return '';
    };
};
// == BEGIN DERAbstractString ================================================
/**
 * base class for ASN.1 DER string classes
 * @name KJUR.asn1.DERAbstractString
 * @class base class for ASN.1 DER string classes
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @property {String} s internal string of value
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERAbstractString = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var s = null;
    var hV = null;
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @return {String} string value of this string object
     */
    this.getString = function () {
        return this.s;
    };
    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newS value by a string to set
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(this.s);
    };
    /**
     * set value by a hexadecimal string
     * @name setStringHex
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newHexString value by a hexadecimal string to set
     */
    this.setStringHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params == "string") {
            this.setString(params);
        }
        else if (typeof params['str'] != "undefined") {
            this.setString(params['str']);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setStringHex(params['hex']);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
// == END   DERAbstractString ================================================
// == BEGIN DERAbstractTime ==================================================
/**
 * base class for ASN.1 DER Generalized/UTCTime class
 * @name KJUR.asn1.DERAbstractTime
 * @class base class for ASN.1 DER Generalized/UTCTime class
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractTime = function (params) {
    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
    var s = null;
    var date = null;
    // --- PRIVATE METHODS --------------------
    this.localDateToUTC = function (d) {
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var utcDate = new Date(utc);
        return utcDate;
    };
    /*
     * format date string by Data object
     * @name formatDate
     * @memberOf KJUR.asn1.AbstractTime;
     * @param {Date} dateObject
     * @param {string} type 'utc' or 'gen'
     * @param {boolean} withMillis flag for with millisections or not
     * @description
     * 'withMillis' flag is supported from asn1 1.0.6.
     */
    this.formatDate = function (dateObject, type, withMillis) {
        var pad = this.zeroPadding;
        var d = this.localDateToUTC(dateObject);
        var year = String(d.getFullYear());
        if (type == 'utc')
            year = year.substr(2, 2);
        var month = pad(String(d.getMonth() + 1), 2);
        var day = pad(String(d.getDate()), 2);
        var hour = pad(String(d.getHours()), 2);
        var min = pad(String(d.getMinutes()), 2);
        var sec = pad(String(d.getSeconds()), 2);
        var s = year + month + day + hour + min + sec;
        if (withMillis === true) {
            var millis = d.getMilliseconds();
            if (millis != 0) {
                var sMillis = pad(String(millis), 3);
                sMillis = sMillis.replace(/[0]+$/, "");
                s = s + "." + sMillis;
            }
        }
        return s + "Z";
    };
    this.zeroPadding = function (s, len) {
        if (s.length >= len)
            return s;
        return new Array(len - s.length + 1).join('0') + s;
    };
    // --- PUBLIC METHODS --------------------
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @return {String} string value of this time object
     */
    this.getString = function () {
        return this.s;
    };
    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {String} newS value by a string to set such like "130430235959Z"
     */
    this.setString = function (newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(newS);
    };
    /**
     * set value by a Date object
     * @name setByDateValue
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Integer} year year of date (ex. 2013)
     * @param {Integer} month month of date between 1 and 12 (ex. 12)
     * @param {Integer} day day of month
     * @param {Integer} hour hours of date
     * @param {Integer} min minutes of date
     * @param {Integer} sec seconds of date
     */
    this.setByDateValue = function (year, month, day, hour, min, sec) {
        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
        this.setByDate(dateObject);
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
// == END   DERAbstractTime ==================================================
// == BEGIN DERAbstractStructured ============================================
/**
 * base class for ASN.1 DER structured class
 * @name KJUR.asn1.DERAbstractStructured
 * @class base class for ASN.1 DER structured class
 * @property {Array} asn1Array internal array of ASN1Object
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractStructured = function (params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
    var asn1Array = null;
    /**
     * set value by array of ASN1Object
     * @name setByASN1ObjectArray
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {array} asn1ObjectArray array of ASN1Object to set
     */
    this.setByASN1ObjectArray = function (asn1ObjectArray) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array = asn1ObjectArray;
    };
    /**
     * append an ASN1Object to internal array
     * @name appendASN1Object
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {ASN1Object} asn1Object to add
     */
    this.appendASN1Object = function (asn1Object) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(asn1Object);
    };
    this.asn1Array = new Array();
    if (typeof params != "undefined") {
        if (typeof params['array'] != "undefined") {
            this.asn1Array = params['array'];
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);
// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************
// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name KJUR.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERBoolean = function () {
    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
    this.hT = "01";
    this.hTLV = "0101ff";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER Integer
 * @name KJUR.asn1.DERInteger
 * @class class for ASN.1 DER Integer
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERInteger = function (params) {
    KJUR.asn1.DERInteger.superclass.constructor.call(this);
    this.hT = "02";
    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };
    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DERInteger
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };
    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     * @example
     * new KJUR.asn1.DERInteger(123);
     * new KJUR.asn1.DERInteger({'int': 123});
     * new KJUR.asn1.DERInteger({'hex': '1fad'});
     */
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['bigint'] != "undefined") {
            this.setByBigInteger(params['bigint']);
        }
        else if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        }
        else if (typeof params == "number") {
            this.setByInteger(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER encoded BitString primitive
 * @name KJUR.asn1.DERBitString
 * @class class for ASN.1 DER encoded BitString primitive
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>bin - specify binary string (ex. '10111')</li>
 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
 * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
 * argument for "BitString encapsulates" structure.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: 'obj' parameter have been supported since
 * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
 * @example
 * // default constructor
 * o = new KJUR.asn1.DERBitString();
 * // initialize with binary string
 * o = new KJUR.asn1.DERBitString({bin: "1011"});
 * // initialize with boolean array
 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
 * // initialize with hexadecimal string (04 is unused bits)
 * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
 * // initialize with ASN1Util.newObject argument for encapsulated
 * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // BIT STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DERBitString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = "00" + o.getEncodedHex();
    }
    KJUR.asn1.DERBitString.superclass.constructor.call(this);
    this.hT = "03";
    /**
     * set ASN.1 value(V) by a hexadecimal string including unused bits
     * @name setHexValueIncludingUnusedBits
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} newHexStringIncludingUnusedBits
     */
    this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = newHexStringIncludingUnusedBits;
    };
    /**
     * set ASN.1 value(V) by unused bit and hexadecimal string of value
     * @name setUnusedBitsAndHexValue
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {Integer} unusedBits
     * @param {String} hValue
     */
    this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
        if (unusedBits < 0 || 7 < unusedBits) {
            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
        }
        var hUnusedBits = "0" + unusedBits;
        this.hTLV = null;
        this.isModified = true;
        this.hV = hUnusedBits + hValue;
    };
    /**
     * set ASN.1 DER BitString by binary string<br/>
     * @name setByBinaryString
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} binaryString binary value string (i.e. '10111')
     * @description
     * Its unused bits will be calculated automatically by length of
     * 'binaryValue'. <br/>
     * NOTE: Trailing zeros '0' will be ignored.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray("01011");
     */
    this.setByBinaryString = function (binaryString) {
        binaryString = binaryString.replace(/0+$/, '');
        var unusedBits = 8 - binaryString.length % 8;
        if (unusedBits == 8)
            unusedBits = 0;
        for (var i = 0; i <= unusedBits; i++) {
            binaryString += '0';
        }
        var h = '';
        for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substr(i, 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1)
                x = '0' + x;
            h += x;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = '0' + unusedBits + h;
    };
    /**
     * set ASN.1 TLV value(V) by an array of boolean<br/>
     * @name setByBooleanArray
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {array} booleanArray array of boolean (ex. [true, false, true])
     * @description
     * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray([false, true, false, true, true]);
     */
    this.setByBooleanArray = function (booleanArray) {
        var s = '';
        for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
                s += '1';
            }
            else {
                s += '0';
            }
        }
        this.setByBinaryString(s);
    };
    /**
     * generate an array of falses with specified length<br/>
     * @name newFalseArray
     * @memberOf KJUR.asn1.DERBitString
     * @function
     * @param {Integer} nLength length of array to generate
     * @return {array} array of boolean falses
     * @description
     * This static method may be useful to initialize boolean array.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.newFalseArray(3) &rarr; [false, false, false]
     */
    this.newFalseArray = function (nLength) {
        var a = new Array(nLength);
        for (var i = 0; i < nLength; i++) {
            a[i] = false;
        }
        return a;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
            this.setHexValueIncludingUnusedBits(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setHexValueIncludingUnusedBits(params['hex']);
        }
        else if (typeof params['bin'] != "undefined") {
            this.setByBinaryString(params['bin']);
        }
        else if (typeof params['array'] != "undefined") {
            this.setByBooleanArray(params['array']);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER OctetString<br/>
 * @name KJUR.asn1.DEROctetString
 * @class class for ASN.1 DER OctetString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * This class provides ASN.1 OctetString simple type.<br/>
 * Supported "params" attributes are:
 * <ul>
 * <li>str - to set a string as a value</li>
 * <li>hex - to set a hexadecimal string as a value</li>
 * <li>obj - to set a encapsulated ASN.1 value by JSON object
 * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
 * </ul>
 * NOTE: A parameter 'obj' have been supported
 * for "OCTET STRING, encapsulates" structure.
 * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
 * @see KJUR.asn1.DERAbstractString - superclass
 * @example
 * // default constructor
 * o = new KJUR.asn1.DEROctetString();
 * // initialize with string
 * o = new KJUR.asn1.DEROctetString({str: "aaa"});
 * // initialize with hexadecimal string
 * o = new KJUR.asn1.DEROctetString({hex: "616161"});
 * // initialize with ASN1Util.newObject argument
 * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // OCTET STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DEROctetString = function (params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = o.getEncodedHex();
    }
    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
    this.hT = "04";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name KJUR.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERNull = function () {
    KJUR.asn1.DERNull.superclass.constructor.call(this);
    this.hT = "05";
    this.hTLV = "0500";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name KJUR.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERObjectIdentifier = function (params) {
    var itox = function (i) {
        var h = i.toString(16);
        if (h.length == 1)
            h = '0' + h;
        return h;
    };
    var roidtox = function (roid) {
        var h = '';
        var bi = new _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7)
            padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++)
            bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7)
                b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };
    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
    this.hT = "06";
    /**
     * set value by a hexadecimal string
     * @name setValueHex
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} newHexString hexadecimal value of OID bytes
     */
    this.setValueHex = function (newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };
    /**
     * set value by a OID string<br/>
     * @name setValueOidString
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidString OID string (ex. 2.5.4.13)
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueOidString("2.5.4.13");
     */
    this.setValueOidString = function (oidString) {
        if (!oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
        }
        var h = '';
        var a = oidString.split('.');
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = h;
    };
    /**
     * set value by a OID name
     * @name setValueName
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidName OID name (ex. 'serverAuth')
     * @since 1.0.1
     * @description
     * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
     * Otherwise raise error.
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueName("serverAuth");
     */
    this.setValueName = function (oidName) {
        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
        if (oid !== '') {
            this.setValueOidString(oid);
        }
        else {
            throw "DERObjectIdentifier oidName undefined: " + oidName;
        }
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (params !== undefined) {
        if (typeof params === "string") {
            if (params.match(/^[0-2].[0-9.]+$/)) {
                this.setValueOidString(params);
            }
            else {
                this.setValueName(params);
            }
        }
        else if (params.oid !== undefined) {
            this.setValueOidString(params.oid);
        }
        else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
        }
        else if (params.name !== undefined) {
            this.setValueName(params.name);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER Enumerated
 * @name KJUR.asn1.DEREnumerated
 * @class class for ASN.1 DER Enumerated
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * @example
 * new KJUR.asn1.DEREnumerated(123);
 * new KJUR.asn1.DEREnumerated({int: 123});
 * new KJUR.asn1.DEREnumerated({hex: '1fad'});
 */
KJUR.asn1.DEREnumerated = function (params) {
    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
    this.hT = "0a";
    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function (bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };
    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function (intValue) {
        var bi = new _jsbn_jsbn__WEBPACK_IMPORTED_MODULE_0__.BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };
    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     */
    this.setValueHex = function (newHexString) {
        this.hV = newHexString;
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        }
        else if (typeof params == "number") {
            this.setByInteger(params);
        }
        else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);
// ********************************************************************
/**
 * class for ASN.1 DER UTF8String
 * @name KJUR.asn1.DERUTF8String
 * @class class for ASN.1 DER UTF8String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERUTF8String = function (params) {
    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
    this.hT = "0c";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER NumericString
 * @name KJUR.asn1.DERNumericString
 * @class class for ASN.1 DER NumericString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERNumericString = function (params) {
    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
    this.hT = "12";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER PrintableString
 * @name KJUR.asn1.DERPrintableString
 * @class class for ASN.1 DER PrintableString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERPrintableString = function (params) {
    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
    this.hT = "13";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER TeletexString
 * @name KJUR.asn1.DERTeletexString
 * @class class for ASN.1 DER TeletexString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERTeletexString = function (params) {
    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
    this.hT = "14";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER IA5String
 * @name KJUR.asn1.DERIA5String
 * @class class for ASN.1 DER IA5String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERIA5String = function (params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "16";
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);
// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name KJUR.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * <h4>EXAMPLES</h4>
 * @example
 * d1 = new KJUR.asn1.DERUTCTime();
 * d1.setString('130430125959Z');
 *
 * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
 * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
 * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
 */
KJUR.asn1.DERUTCTime = function (params) {
    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
    this.hT = "17";
    /**
     * set value by a Date object<br/>
     * @name setByDate
     * @memberOf KJUR.asn1.DERUTCTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * o = new KJUR.asn1.DERUTCTime();
     * o.setByDate(new Date("2016/12/31"));
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'utc');
        this.hV = stohex(this.s);
    };
    this.getFreshValueHex = function () {
        if (typeof this.date == "undefined" && typeof this.s == "undefined") {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'utc');
            this.hV = stohex(this.s);
        }
        return this.hV;
    };
    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        }
        else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
            this.setString(params);
        }
        else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        }
        else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);
// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name KJUR.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @property {Boolean} withMillis flag to show milliseconds or not
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
 */
KJUR.asn1.DERGeneralizedTime = function (params) {
    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
    this.hT = "18";
    this.withMillis = false;
    /**
     * set value by a Date object
     * @name setByDate
     * @memberOf KJUR.asn1.DERGeneralizedTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * When you specify UTC time, use 'Date.UTC' method like this:<br/>
     * o1 = new DERUTCTime();
     * o1.setByDate(date);
     *
     * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
     */
    this.setByDate = function (dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'gen', this.withMillis);
        this.hV = stohex(this.s);
    };
    this.getFreshValueHex = function () {
        if (this.date === undefined && this.s === undefined) {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'gen', this.withMillis);
            this.hV = stohex(this.s);
        }
        return this.hV;
    };
    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        }
        else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
            this.setString(params);
        }
        else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        }
        else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
        if (params.millis === true) {
            this.withMillis = true;
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);
// ********************************************************************
/**
 * class for ASN.1 DER Sequence
 * @name KJUR.asn1.DERSequence
 * @class class for ASN.1 DER Sequence
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERSequence = function (params) {
    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
    this.hT = "30";
    this.getFreshValueHex = function () {
        var h = '';
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.getEncodedHex();
        }
        this.hV = h;
        return this.hV;
    };
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);
// ********************************************************************
/**
 * class for ASN.1 DER Set
 * @name KJUR.asn1.DERSet
 * @class class for ASN.1 DER Set
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: sortflag is supported since 1.0.5.
 */
KJUR.asn1.DERSet = function (params) {
    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
    this.hT = "31";
    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
    this.getFreshValueHex = function () {
        var a = new Array();
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.getEncodedHex());
        }
        if (this.sortFlag == true)
            a.sort();
        this.hV = a.join('');
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params.sortflag != "undefined" &&
            params.sortflag == false)
            this.sortFlag = false;
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);
// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name KJUR.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>obj - specify ASN1Object which is tagged</li>
 * </ul>
 * @example
 * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.getEncodedHex();
 */
KJUR.asn1.DERTaggedObject = function (params) {
    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
    this.hT = "a0";
    this.hV = '';
    this.isExplicit = true;
    this.asn1Object = null;
    /**
     * set value by an ASN1Object
     * @name setString
     * @memberOf KJUR.asn1.DERTaggedObject#
     * @function
     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
     */
    this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
        this.hT = tagNoHex;
        this.isExplicit = isExplicitFlag;
        this.asn1Object = asn1Object;
        if (this.isExplicit) {
            this.hV = this.asn1Object.getEncodedHex();
            this.hTLV = null;
            this.isModified = true;
        }
        else {
            this.hV = null;
            this.hTLV = asn1Object.getEncodedHex();
            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
            this.isModified = false;
        }
    };
    this.getFreshValueHex = function () {
        return this.hV;
    };
    if (typeof params != "undefined") {
        if (typeof params['tag'] != "undefined") {
            this.hT = params['tag'];
        }
        if (typeof params['explicit'] != "undefined") {
            this.isExplicit = params['explicit'];
        }
        if (typeof params['obj'] != "undefined") {
            this.asn1Object = params['obj'];
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
        }
    }
};
_yahoo__WEBPACK_IMPORTED_MODULE_1__.YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsrsasign/asn1-1.0.js?`);
  }, "./lib/lib/jsrsasign/asn1-1.0.js"), "./lib/lib/jsrsasign/yahoo.js": r((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    eval(`__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YAHOO": () => (/* binding */ YAHOO)
/* harmony export */ });
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
var YAHOO = {};
YAHOO.lang = {
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass
     *                              if present.
     */
    extend: function (subc, superc, overrides) {
        if (!superc || !subc) {
            throw new Error("YAHOO.lang.extend failed, please check that " +
                "all dependencies are included.");
        }
        var F = function () { };
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }
        if (overrides) {
            var i;
            for (i in overrides) {
                subc.prototype[i] = overrides[i];
            }
            /*
             * IE will not enumerate native functions in a derived object even if the
             * function was overridden.  This is a workaround for specific functions
             * we care about on the Object prototype.
             * @property _IEEnumFix
             * @param {Function} r  the object to receive the augmentation
             * @param {Function} s  the object that supplies the properties to augment
             * @static
             * @private
             */
            var _IEEnumFix = function () { }, ADD = ["toString", "valueOf"];
            try {
                if (/MSIE/.test(navigator.userAgent)) {
                    _IEEnumFix = function (r, s) {
                        for (i = 0; i < ADD.length; i = i + 1) {
                            var fname = ADD[i], f = s[fname];
                            if (typeof f === 'function' && f != Object.prototype[fname]) {
                                r[fname] = f;
                            }
                        }
                    };
                }
            }
            catch (ex) { }
            ;
            _IEEnumFix(subc.prototype, overrides);
        }
    }
};


//# sourceURL=webpack://JSEncrypt/./lib/lib/jsrsasign/yahoo.js?`);
  }, "./lib/lib/jsrsasign/yahoo.js"), "./node_modules/process/browser.js": r((module) => {
    eval(`// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


//# sourceURL=webpack://JSEncrypt/./node_modules/process/browser.js?`);
  }, "./node_modules/process/browser.js") }, __webpack_module_cache__ = {};
  function __webpack_require__(Y) {
    var M = __webpack_module_cache__[Y];
    if (M !== void 0) return M.exports;
    var $ = __webpack_module_cache__[Y] = { exports: {} };
    return __webpack_modules__[Y]($, $.exports, __webpack_require__), $.exports;
  }
  r(__webpack_require__, "__webpack_require__"), __webpack_require__.d = (Y, M) => {
    for (var $ in M) __webpack_require__.o(M, $) && !__webpack_require__.o(Y, $) && Object.defineProperty(Y, $, { enumerable: true, get: M[$] });
  }, __webpack_require__.o = (Y, M) => Object.prototype.hasOwnProperty.call(Y, M), __webpack_require__.r = (Y) => {
    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(Y, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(Y, "__esModule", { value: true });
  };
  var __webpack_exports__ = __webpack_require__("./lib/index.js");
  return __webpack_exports__ = __webpack_exports__.default, __webpack_exports__;
})());
(function(Y, M) {
  typeof exports == "object" ? module.exports = exports = M() : typeof define == "function" && define.amd ? define([], M) : globalThis.CryptoJS = M();
})(void 0, function() {
  var Y = Y || (function(M, $) {
    var C;
    if (typeof window < "u" && window.crypto && (C = window.crypto), typeof self < "u" && self.crypto && (C = self.crypto), typeof globalThis < "u" && globalThis.crypto && (C = globalThis.crypto), !C && typeof window < "u" && window.msCrypto && (C = window.msCrypto), !C && typeof globalThis < "u" && globalThis.crypto && (C = globalThis.crypto), !C && typeof mn == "function") try {
      C = En();
    } catch {
    }
    var j = r(function() {
      if (C) {
        if (typeof C.getRandomValues == "function") try {
          return C.getRandomValues(new Uint32Array(1))[0];
        } catch {
        }
        if (typeof C.randomBytes == "function") try {
          return C.randomBytes(4).readInt32LE();
        } catch {
        }
      }
      throw new Error("Native crypto module could not be used to get secure random number.");
    }, "cryptoSecureRandomInt"), b = Object.create || (function() {
      function s() {
      }
      return r(s, "F"), function(h) {
        var p2;
        return s.prototype = h, p2 = new s(), s.prototype = null, p2;
      };
    })(), f = {}, u = f.lib = {}, m = u.Base = (function() {
      return { extend: r(function(s) {
        var h = b(this);
        return s && h.mixIn(s), (!h.hasOwnProperty("init") || this.init === h.init) && (h.init = function() {
          h.$super.init.apply(this, arguments);
        }), h.init.prototype = h, h.$super = this, h;
      }, "extend"), create: r(function() {
        var s = this.extend();
        return s.init.apply(s, arguments), s;
      }, "create"), init: r(function() {
      }, "init"), mixIn: r(function(s) {
        for (var h in s) s.hasOwnProperty(h) && (this[h] = s[h]);
        s.hasOwnProperty("toString") && (this.toString = s.toString);
      }, "mixIn"), clone: r(function() {
        return this.init.prototype.extend(this);
      }, "clone") };
    })(), d2 = u.WordArray = m.extend({ init: r(function(s, h) {
      s = this.words = s || [], h != $ ? this.sigBytes = h : this.sigBytes = s.length * 4;
    }, "init"), toString: r(function(s) {
      return (s || g2).stringify(this);
    }, "toString"), concat: r(function(s) {
      var h = this.words, p2 = s.words, S = this.sigBytes, B = s.sigBytes;
      if (this.clamp(), S % 4) for (var w = 0; w < B; w++) {
        var P = p2[w >>> 2] >>> 24 - w % 4 * 8 & 255;
        h[S + w >>> 2] |= P << 24 - (S + w) % 4 * 8;
      }
      else for (var F = 0; F < B; F += 4) h[S + F >>> 2] = p2[F >>> 2];
      return this.sigBytes += B, this;
    }, "concat"), clamp: r(function() {
      var s = this.words, h = this.sigBytes;
      s[h >>> 2] &= 4294967295 << 32 - h % 4 * 8, s.length = M.ceil(h / 4);
    }, "clamp"), clone: r(function() {
      var s = m.clone.call(this);
      return s.words = this.words.slice(0), s;
    }, "clone"), random: r(function(s) {
      for (var h = [], p2 = 0; p2 < s; p2 += 4) h.push(j());
      return new d2.init(h, s);
    }, "random") }), t = f.enc = {}, g2 = t.Hex = { stringify: r(function(s) {
      for (var h = s.words, p2 = s.sigBytes, S = [], B = 0; B < p2; B++) {
        var w = h[B >>> 2] >>> 24 - B % 4 * 8 & 255;
        S.push((w >>> 4).toString(16)), S.push((w & 15).toString(16));
      }
      return S.join("");
    }, "stringify"), parse: r(function(s) {
      for (var h = s.length, p2 = [], S = 0; S < h; S += 2) p2[S >>> 3] |= parseInt(s.substr(S, 2), 16) << 24 - S % 8 * 4;
      return new d2.init(p2, h / 2);
    }, "parse") }, i = t.Latin1 = { stringify: r(function(s) {
      for (var h = s.words, p2 = s.sigBytes, S = [], B = 0; B < p2; B++) {
        var w = h[B >>> 2] >>> 24 - B % 4 * 8 & 255;
        S.push(String.fromCharCode(w));
      }
      return S.join("");
    }, "stringify"), parse: r(function(s) {
      for (var h = s.length, p2 = [], S = 0; S < h; S++) p2[S >>> 2] |= (s.charCodeAt(S) & 255) << 24 - S % 4 * 8;
      return new d2.init(p2, h);
    }, "parse") }, o = t.Utf8 = { stringify: r(function(s) {
      try {
        return decodeURIComponent(escape(i.stringify(s)));
      } catch {
        throw new Error("Malformed UTF-8 data");
      }
    }, "stringify"), parse: r(function(s) {
      return i.parse(unescape(encodeURIComponent(s)));
    }, "parse") }, y = u.BufferedBlockAlgorithm = m.extend({ reset: r(function() {
      this._data = new d2.init(), this._nDataBytes = 0;
    }, "reset"), _append: r(function(s) {
      typeof s == "string" && (s = o.parse(s)), this._data.concat(s), this._nDataBytes += s.sigBytes;
    }, "_append"), _process: r(function(s) {
      var h, p2 = this._data, S = p2.words, B = p2.sigBytes, w = this.blockSize, P = w * 4, F = B / P;
      s ? F = M.ceil(F) : F = M.max((F | 0) - this._minBufferSize, 0);
      var I = F * w, k = M.min(I * 4, B);
      if (I) {
        for (var A = 0; A < I; A += w) this._doProcessBlock(S, A);
        h = S.splice(0, I), p2.sigBytes -= k;
      }
      return new d2.init(h, k);
    }, "_process"), clone: r(function() {
      var s = m.clone.call(this);
      return s._data = this._data.clone(), s;
    }, "clone"), _minBufferSize: 0 }), l = u.Hasher = y.extend({ cfg: m.extend(), init: r(function(s) {
      this.cfg = this.cfg.extend(s), this.reset();
    }, "init"), reset: r(function() {
      y.reset.call(this), this._doReset();
    }, "reset"), update: r(function(s) {
      return this._append(s), this._process(), this;
    }, "update"), finalize: r(function(s) {
      s && this._append(s);
      var h = this._doFinalize();
      return h;
    }, "finalize"), blockSize: 512 / 32, _createHelper: r(function(s) {
      return function(h, p2) {
        return new s.init(p2).finalize(h);
      };
    }, "_createHelper"), _createHmacHelper: r(function(s) {
      return function(h, p2) {
        return new v.HMAC.init(s, p2).finalize(h);
      };
    }, "_createHmacHelper") }), v = f.algo = {};
    return f;
  })(Math);
  return (function(M) {
    var $ = Y, C = $.lib, j = C.Base, b = C.WordArray, f = $.x64 = {}, u = f.Word = j.extend({ init: r(function(d2, t) {
      this.high = d2, this.low = t;
    }, "init") }), m = f.WordArray = j.extend({ init: r(function(d2, t) {
      d2 = this.words = d2 || [], t != M ? this.sigBytes = t : this.sigBytes = d2.length * 8;
    }, "init"), toX32: r(function() {
      for (var d2 = this.words, t = d2.length, g2 = [], i = 0; i < t; i++) {
        var o = d2[i];
        g2.push(o.high), g2.push(o.low);
      }
      return b.create(g2, this.sigBytes);
    }, "toX32"), clone: r(function() {
      for (var d2 = j.clone.call(this), t = d2.words = this.words.slice(0), g2 = t.length, i = 0; i < g2; i++) t[i] = t[i].clone();
      return d2;
    }, "clone") });
  })(), (function() {
    if (typeof ArrayBuffer == "function") {
      var M = Y, $ = M.lib, C = $.WordArray, j = C.init, b = C.init = function(f) {
        if (f instanceof ArrayBuffer && (f = new Uint8Array(f)), (f instanceof Int8Array || typeof Uint8ClampedArray < "u" && f instanceof Uint8ClampedArray || f instanceof Int16Array || f instanceof Uint16Array || f instanceof Int32Array || f instanceof Uint32Array || f instanceof Float32Array || f instanceof Float64Array) && (f = new Uint8Array(f.buffer, f.byteOffset, f.byteLength)), f instanceof Uint8Array) {
          for (var u = f.byteLength, m = [], d2 = 0; d2 < u; d2++) m[d2 >>> 2] |= f[d2] << 24 - d2 % 4 * 8;
          j.call(this, m, u);
        } else j.apply(this, arguments);
      };
      b.prototype = C;
    }
  })(), (function() {
    var M = Y, $ = M.lib, C = $.WordArray, j = M.enc, b = j.Utf16 = j.Utf16BE = { stringify: r(function(u) {
      for (var m = u.words, d2 = u.sigBytes, t = [], g2 = 0; g2 < d2; g2 += 2) {
        var i = m[g2 >>> 2] >>> 16 - g2 % 4 * 8 & 65535;
        t.push(String.fromCharCode(i));
      }
      return t.join("");
    }, "stringify"), parse: r(function(u) {
      for (var m = u.length, d2 = [], t = 0; t < m; t++) d2[t >>> 1] |= u.charCodeAt(t) << 16 - t % 2 * 16;
      return C.create(d2, m * 2);
    }, "parse") };
    j.Utf16LE = { stringify: r(function(u) {
      for (var m = u.words, d2 = u.sigBytes, t = [], g2 = 0; g2 < d2; g2 += 2) {
        var i = f(m[g2 >>> 2] >>> 16 - g2 % 4 * 8 & 65535);
        t.push(String.fromCharCode(i));
      }
      return t.join("");
    }, "stringify"), parse: r(function(u) {
      for (var m = u.length, d2 = [], t = 0; t < m; t++) d2[t >>> 1] |= f(u.charCodeAt(t) << 16 - t % 2 * 16);
      return C.create(d2, m * 2);
    }, "parse") };
    function f(u) {
      return u << 8 & 4278255360 | u >>> 8 & 16711935;
    }
    r(f, "swapEndian");
  })(), (function() {
    var M = Y, $ = M.lib, C = $.WordArray, j = M.enc, b = j.Base64 = { stringify: r(function(u) {
      var m = u.words, d2 = u.sigBytes, t = this._map;
      u.clamp();
      for (var g2 = [], i = 0; i < d2; i += 3) for (var o = m[i >>> 2] >>> 24 - i % 4 * 8 & 255, y = m[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255, l = m[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255, v = o << 16 | y << 8 | l, s = 0; s < 4 && i + s * 0.75 < d2; s++) g2.push(t.charAt(v >>> 6 * (3 - s) & 63));
      var h = t.charAt(64);
      if (h) for (; g2.length % 4; ) g2.push(h);
      return g2.join("");
    }, "stringify"), parse: r(function(u) {
      var m = u.length, d2 = this._map, t = this._reverseMap;
      if (!t) {
        t = this._reverseMap = [];
        for (var g2 = 0; g2 < d2.length; g2++) t[d2.charCodeAt(g2)] = g2;
      }
      var i = d2.charAt(64);
      if (i) {
        var o = u.indexOf(i);
        o !== -1 && (m = o);
      }
      return f(u, m, t);
    }, "parse"), _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    function f(u, m, d2) {
      for (var t = [], g2 = 0, i = 0; i < m; i++) if (i % 4) {
        var o = d2[u.charCodeAt(i - 1)] << i % 4 * 2, y = d2[u.charCodeAt(i)] >>> 6 - i % 4 * 2, l = o | y;
        t[g2 >>> 2] |= l << 24 - g2 % 4 * 8, g2++;
      }
      return C.create(t, g2);
    }
    r(f, "parseLoop");
  })(), (function() {
    var M = Y, $ = M.lib, C = $.WordArray, j = M.enc, b = j.Base64url = { stringify: r(function(u, m = true) {
      var d2 = u.words, t = u.sigBytes, g2 = m ? this._safe_map : this._map;
      u.clamp();
      for (var i = [], o = 0; o < t; o += 3) for (var y = d2[o >>> 2] >>> 24 - o % 4 * 8 & 255, l = d2[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255, v = d2[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, s = y << 16 | l << 8 | v, h = 0; h < 4 && o + h * 0.75 < t; h++) i.push(g2.charAt(s >>> 6 * (3 - h) & 63));
      var p2 = g2.charAt(64);
      if (p2) for (; i.length % 4; ) i.push(p2);
      return i.join("");
    }, "stringify"), parse: r(function(u, m = true) {
      var d2 = u.length, t = m ? this._safe_map : this._map, g2 = this._reverseMap;
      if (!g2) {
        g2 = this._reverseMap = [];
        for (var i = 0; i < t.length; i++) g2[t.charCodeAt(i)] = i;
      }
      var o = t.charAt(64);
      if (o) {
        var y = u.indexOf(o);
        y !== -1 && (d2 = y);
      }
      return f(u, d2, g2);
    }, "parse"), _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" };
    function f(u, m, d2) {
      for (var t = [], g2 = 0, i = 0; i < m; i++) if (i % 4) {
        var o = d2[u.charCodeAt(i - 1)] << i % 4 * 2, y = d2[u.charCodeAt(i)] >>> 6 - i % 4 * 2, l = o | y;
        t[g2 >>> 2] |= l << 24 - g2 % 4 * 8, g2++;
      }
      return C.create(t, g2);
    }
    r(f, "parseLoop");
  })(), (function(M) {
    var $ = Y, C = $.lib, j = C.WordArray, b = C.Hasher, f = $.algo, u = [];
    (function() {
      for (var o = 0; o < 64; o++) u[o] = M.abs(M.sin(o + 1)) * 4294967296 | 0;
    })();
    var m = f.MD5 = b.extend({ _doReset: r(function() {
      this._hash = new j.init([1732584193, 4023233417, 2562383102, 271733878]);
    }, "_doReset"), _doProcessBlock: r(function(o, y) {
      for (var l = 0; l < 16; l++) {
        var v = y + l, s = o[v];
        o[v] = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360;
      }
      var h = this._hash.words, p2 = o[y + 0], S = o[y + 1], B = o[y + 2], w = o[y + 3], P = o[y + 4], F = o[y + 5], I = o[y + 6], k = o[y + 7], A = o[y + 8], n = o[y + 9], c = o[y + 10], _ = o[y + 11], e = o[y + 12], a = o[y + 13], E = o[y + 14], O = o[y + 15], T = h[0], L = h[1], N = h[2], U = h[3];
      T = d2(T, L, N, U, p2, 7, u[0]), U = d2(U, T, L, N, S, 12, u[1]), N = d2(N, U, T, L, B, 17, u[2]), L = d2(L, N, U, T, w, 22, u[3]), T = d2(T, L, N, U, P, 7, u[4]), U = d2(U, T, L, N, F, 12, u[5]), N = d2(N, U, T, L, I, 17, u[6]), L = d2(L, N, U, T, k, 22, u[7]), T = d2(T, L, N, U, A, 7, u[8]), U = d2(U, T, L, N, n, 12, u[9]), N = d2(N, U, T, L, c, 17, u[10]), L = d2(L, N, U, T, _, 22, u[11]), T = d2(T, L, N, U, e, 7, u[12]), U = d2(U, T, L, N, a, 12, u[13]), N = d2(N, U, T, L, E, 17, u[14]), L = d2(L, N, U, T, O, 22, u[15]), T = t(T, L, N, U, S, 5, u[16]), U = t(U, T, L, N, I, 9, u[17]), N = t(N, U, T, L, _, 14, u[18]), L = t(L, N, U, T, p2, 20, u[19]), T = t(T, L, N, U, F, 5, u[20]), U = t(U, T, L, N, c, 9, u[21]), N = t(N, U, T, L, O, 14, u[22]), L = t(L, N, U, T, P, 20, u[23]), T = t(T, L, N, U, n, 5, u[24]), U = t(U, T, L, N, E, 9, u[25]), N = t(N, U, T, L, w, 14, u[26]), L = t(L, N, U, T, A, 20, u[27]), T = t(T, L, N, U, a, 5, u[28]), U = t(U, T, L, N, B, 9, u[29]), N = t(N, U, T, L, k, 14, u[30]), L = t(L, N, U, T, e, 20, u[31]), T = g2(T, L, N, U, F, 4, u[32]), U = g2(U, T, L, N, A, 11, u[33]), N = g2(N, U, T, L, _, 16, u[34]), L = g2(L, N, U, T, E, 23, u[35]), T = g2(T, L, N, U, S, 4, u[36]), U = g2(U, T, L, N, P, 11, u[37]), N = g2(N, U, T, L, k, 16, u[38]), L = g2(L, N, U, T, c, 23, u[39]), T = g2(T, L, N, U, a, 4, u[40]), U = g2(U, T, L, N, p2, 11, u[41]), N = g2(N, U, T, L, w, 16, u[42]), L = g2(L, N, U, T, I, 23, u[43]), T = g2(T, L, N, U, n, 4, u[44]), U = g2(U, T, L, N, e, 11, u[45]), N = g2(N, U, T, L, O, 16, u[46]), L = g2(L, N, U, T, B, 23, u[47]), T = i(T, L, N, U, p2, 6, u[48]), U = i(U, T, L, N, k, 10, u[49]), N = i(N, U, T, L, E, 15, u[50]), L = i(L, N, U, T, F, 21, u[51]), T = i(T, L, N, U, e, 6, u[52]), U = i(U, T, L, N, w, 10, u[53]), N = i(N, U, T, L, c, 15, u[54]), L = i(L, N, U, T, S, 21, u[55]), T = i(T, L, N, U, A, 6, u[56]), U = i(U, T, L, N, O, 10, u[57]), N = i(N, U, T, L, I, 15, u[58]), L = i(L, N, U, T, a, 21, u[59]), T = i(T, L, N, U, P, 6, u[60]), U = i(U, T, L, N, _, 10, u[61]), N = i(N, U, T, L, B, 15, u[62]), L = i(L, N, U, T, n, 21, u[63]), h[0] = h[0] + T | 0, h[1] = h[1] + L | 0, h[2] = h[2] + N | 0, h[3] = h[3] + U | 0;
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var o = this._data, y = o.words, l = this._nDataBytes * 8, v = o.sigBytes * 8;
      y[v >>> 5] |= 128 << 24 - v % 32;
      var s = M.floor(l / 4294967296), h = l;
      y[(v + 64 >>> 9 << 4) + 15] = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360, y[(v + 64 >>> 9 << 4) + 14] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360, o.sigBytes = (y.length + 1) * 4, this._process();
      for (var p2 = this._hash, S = p2.words, B = 0; B < 4; B++) {
        var w = S[B];
        S[B] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360;
      }
      return p2;
    }, "_doFinalize"), clone: r(function() {
      var o = b.clone.call(this);
      return o._hash = this._hash.clone(), o;
    }, "clone") });
    function d2(o, y, l, v, s, h, p2) {
      var S = o + (y & l | ~y & v) + s + p2;
      return (S << h | S >>> 32 - h) + y;
    }
    r(d2, "FF");
    function t(o, y, l, v, s, h, p2) {
      var S = o + (y & v | l & ~v) + s + p2;
      return (S << h | S >>> 32 - h) + y;
    }
    r(t, "GG");
    function g2(o, y, l, v, s, h, p2) {
      var S = o + (y ^ l ^ v) + s + p2;
      return (S << h | S >>> 32 - h) + y;
    }
    r(g2, "HH");
    function i(o, y, l, v, s, h, p2) {
      var S = o + (l ^ (y | ~v)) + s + p2;
      return (S << h | S >>> 32 - h) + y;
    }
    r(i, "II"), $.MD5 = b._createHelper(m), $.HmacMD5 = b._createHmacHelper(m);
  })(Math), (function() {
    var M = Y, $ = M.lib, C = $.WordArray, j = $.Hasher, b = M.algo, f = [], u = b.SHA1 = j.extend({ _doReset: r(function() {
      this._hash = new C.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
    }, "_doReset"), _doProcessBlock: r(function(m, d2) {
      for (var t = this._hash.words, g2 = t[0], i = t[1], o = t[2], y = t[3], l = t[4], v = 0; v < 80; v++) {
        if (v < 16) f[v] = m[d2 + v] | 0;
        else {
          var s = f[v - 3] ^ f[v - 8] ^ f[v - 14] ^ f[v - 16];
          f[v] = s << 1 | s >>> 31;
        }
        var h = (g2 << 5 | g2 >>> 27) + l + f[v];
        v < 20 ? h += (i & o | ~i & y) + 1518500249 : v < 40 ? h += (i ^ o ^ y) + 1859775393 : v < 60 ? h += (i & o | i & y | o & y) - 1894007588 : h += (i ^ o ^ y) - 899497514, l = y, y = o, o = i << 30 | i >>> 2, i = g2, g2 = h;
      }
      t[0] = t[0] + g2 | 0, t[1] = t[1] + i | 0, t[2] = t[2] + o | 0, t[3] = t[3] + y | 0, t[4] = t[4] + l | 0;
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var m = this._data, d2 = m.words, t = this._nDataBytes * 8, g2 = m.sigBytes * 8;
      return d2[g2 >>> 5] |= 128 << 24 - g2 % 32, d2[(g2 + 64 >>> 9 << 4) + 14] = Math.floor(t / 4294967296), d2[(g2 + 64 >>> 9 << 4) + 15] = t, m.sigBytes = d2.length * 4, this._process(), this._hash;
    }, "_doFinalize"), clone: r(function() {
      var m = j.clone.call(this);
      return m._hash = this._hash.clone(), m;
    }, "clone") });
    M.SHA1 = j._createHelper(u), M.HmacSHA1 = j._createHmacHelper(u);
  })(), (function(M) {
    var $ = Y, C = $.lib, j = C.WordArray, b = C.Hasher, f = $.algo, u = [], m = [];
    (function() {
      function g2(l) {
        for (var v = M.sqrt(l), s = 2; s <= v; s++) if (!(l % s)) return false;
        return true;
      }
      r(g2, "isPrime");
      function i(l) {
        return (l - (l | 0)) * 4294967296 | 0;
      }
      r(i, "getFractionalBits");
      for (var o = 2, y = 0; y < 64; ) g2(o) && (y < 8 && (u[y] = i(M.pow(o, 1 / 2))), m[y] = i(M.pow(o, 1 / 3)), y++), o++;
    })();
    var d2 = [], t = f.SHA256 = b.extend({ _doReset: r(function() {
      this._hash = new j.init(u.slice(0));
    }, "_doReset"), _doProcessBlock: r(function(g2, i) {
      for (var o = this._hash.words, y = o[0], l = o[1], v = o[2], s = o[3], h = o[4], p2 = o[5], S = o[6], B = o[7], w = 0; w < 64; w++) {
        if (w < 16) d2[w] = g2[i + w] | 0;
        else {
          var P = d2[w - 15], F = (P << 25 | P >>> 7) ^ (P << 14 | P >>> 18) ^ P >>> 3, I = d2[w - 2], k = (I << 15 | I >>> 17) ^ (I << 13 | I >>> 19) ^ I >>> 10;
          d2[w] = F + d2[w - 7] + k + d2[w - 16];
        }
        var A = h & p2 ^ ~h & S, n = y & l ^ y & v ^ l & v, c = (y << 30 | y >>> 2) ^ (y << 19 | y >>> 13) ^ (y << 10 | y >>> 22), _ = (h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25), e = B + _ + A + m[w] + d2[w], a = c + n;
        B = S, S = p2, p2 = h, h = s + e | 0, s = v, v = l, l = y, y = e + a | 0;
      }
      o[0] = o[0] + y | 0, o[1] = o[1] + l | 0, o[2] = o[2] + v | 0, o[3] = o[3] + s | 0, o[4] = o[4] + h | 0, o[5] = o[5] + p2 | 0, o[6] = o[6] + S | 0, o[7] = o[7] + B | 0;
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var g2 = this._data, i = g2.words, o = this._nDataBytes * 8, y = g2.sigBytes * 8;
      return i[y >>> 5] |= 128 << 24 - y % 32, i[(y + 64 >>> 9 << 4) + 14] = M.floor(o / 4294967296), i[(y + 64 >>> 9 << 4) + 15] = o, g2.sigBytes = i.length * 4, this._process(), this._hash;
    }, "_doFinalize"), clone: r(function() {
      var g2 = b.clone.call(this);
      return g2._hash = this._hash.clone(), g2;
    }, "clone") });
    $.SHA256 = b._createHelper(t), $.HmacSHA256 = b._createHmacHelper(t);
  })(Math), (function() {
    var M = Y, $ = M.lib, C = $.WordArray, j = M.algo, b = j.SHA256, f = j.SHA224 = b.extend({ _doReset: r(function() {
      this._hash = new C.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
    }, "_doReset"), _doFinalize: r(function() {
      var u = b._doFinalize.call(this);
      return u.sigBytes -= 4, u;
    }, "_doFinalize") });
    M.SHA224 = b._createHelper(f), M.HmacSHA224 = b._createHmacHelper(f);
  })(), (function() {
    var M = Y, $ = M.lib, C = $.Hasher, j = M.x64, b = j.Word, f = j.WordArray, u = M.algo;
    function m() {
      return b.create.apply(b, arguments);
    }
    r(m, "X64Word_create");
    var d2 = [m(1116352408, 3609767458), m(1899447441, 602891725), m(3049323471, 3964484399), m(3921009573, 2173295548), m(961987163, 4081628472), m(1508970993, 3053834265), m(2453635748, 2937671579), m(2870763221, 3664609560), m(3624381080, 2734883394), m(310598401, 1164996542), m(607225278, 1323610764), m(1426881987, 3590304994), m(1925078388, 4068182383), m(2162078206, 991336113), m(2614888103, 633803317), m(3248222580, 3479774868), m(3835390401, 2666613458), m(4022224774, 944711139), m(264347078, 2341262773), m(604807628, 2007800933), m(770255983, 1495990901), m(1249150122, 1856431235), m(1555081692, 3175218132), m(1996064986, 2198950837), m(2554220882, 3999719339), m(2821834349, 766784016), m(2952996808, 2566594879), m(3210313671, 3203337956), m(3336571891, 1034457026), m(3584528711, 2466948901), m(113926993, 3758326383), m(338241895, 168717936), m(666307205, 1188179964), m(773529912, 1546045734), m(1294757372, 1522805485), m(1396182291, 2643833823), m(1695183700, 2343527390), m(1986661051, 1014477480), m(2177026350, 1206759142), m(2456956037, 344077627), m(2730485921, 1290863460), m(2820302411, 3158454273), m(3259730800, 3505952657), m(3345764771, 106217008), m(3516065817, 3606008344), m(3600352804, 1432725776), m(4094571909, 1467031594), m(275423344, 851169720), m(430227734, 3100823752), m(506948616, 1363258195), m(659060556, 3750685593), m(883997877, 3785050280), m(958139571, 3318307427), m(1322822218, 3812723403), m(1537002063, 2003034995), m(1747873779, 3602036899), m(1955562222, 1575990012), m(2024104815, 1125592928), m(2227730452, 2716904306), m(2361852424, 442776044), m(2428436474, 593698344), m(2756734187, 3733110249), m(3204031479, 2999351573), m(3329325298, 3815920427), m(3391569614, 3928383900), m(3515267271, 566280711), m(3940187606, 3454069534), m(4118630271, 4000239992), m(116418474, 1914138554), m(174292421, 2731055270), m(289380356, 3203993006), m(460393269, 320620315), m(685471733, 587496836), m(852142971, 1086792851), m(1017036298, 365543100), m(1126000580, 2618297676), m(1288033470, 3409855158), m(1501505948, 4234509866), m(1607167915, 987167468), m(1816402316, 1246189591)], t = [];
    (function() {
      for (var i = 0; i < 80; i++) t[i] = m();
    })();
    var g2 = u.SHA512 = C.extend({ _doReset: r(function() {
      this._hash = new f.init([new b.init(1779033703, 4089235720), new b.init(3144134277, 2227873595), new b.init(1013904242, 4271175723), new b.init(2773480762, 1595750129), new b.init(1359893119, 2917565137), new b.init(2600822924, 725511199), new b.init(528734635, 4215389547), new b.init(1541459225, 327033209)]);
    }, "_doReset"), _doProcessBlock: r(function(i, o) {
      for (var y = this._hash.words, l = y[0], v = y[1], s = y[2], h = y[3], p2 = y[4], S = y[5], B = y[6], w = y[7], P = l.high, F = l.low, I = v.high, k = v.low, A = s.high, n = s.low, c = h.high, _ = h.low, e = p2.high, a = p2.low, E = S.high, O = S.low, T = B.high, L = B.low, N = w.high, U = w.low, X = P, Q = F, W = I, J = k, V = A, z = n, D = c, x = _, R = e, K = a, H = E, G = O, ne = T, ie = L, te = N, se = U, re = 0; re < 80; re++) {
        var le, me, Ee = t[re];
        if (re < 16) me = Ee.high = i[o + re * 2] | 0, le = Ee.low = i[o + re * 2 + 1] | 0;
        else {
          var De = t[re - 15], _e = De.high, ce = De.low, he = (_e >>> 1 | ce << 31) ^ (_e >>> 8 | ce << 24) ^ _e >>> 7, Ce = (ce >>> 1 | _e << 31) ^ (ce >>> 8 | _e << 24) ^ (ce >>> 7 | _e << 25), Oe = t[re - 2], pe = Oe.high, Fe = Oe.low, ke = (pe >>> 19 | Fe << 13) ^ (pe << 3 | Fe >>> 29) ^ pe >>> 6, ee = (Fe >>> 19 | pe << 13) ^ (Fe << 3 | pe >>> 29) ^ (Fe >>> 6 | pe << 26), Ve = t[re - 7], ye = Ve.high, Re = Ve.low, en = t[re - 16], nn = en.high, He = en.low;
          le = Ce + Re, me = he + ye + (le >>> 0 < Ce >>> 0 ? 1 : 0), le = le + ee, me = me + ke + (le >>> 0 < ee >>> 0 ? 1 : 0), le = le + He, me = me + nn + (le >>> 0 < He >>> 0 ? 1 : 0), Ee.high = me, Ee.low = le;
        }
        var cn = R & H ^ ~R & ne, We = K & G ^ ~K & ie, qe = X & W ^ X & V ^ W & V, ve = Q & J ^ Q & z ^ J & z, Ne = (X >>> 28 | Q << 4) ^ (X << 30 | Q >>> 2) ^ (X << 25 | Q >>> 7), Pe = (Q >>> 28 | X << 4) ^ (Q << 30 | X >>> 2) ^ (Q << 25 | X >>> 7), ln = (R >>> 14 | K << 18) ^ (R >>> 18 | K << 14) ^ (R << 23 | K >>> 9), $e = (K >>> 14 | R << 18) ^ (K >>> 18 | R << 14) ^ (K << 23 | R >>> 9), Je = d2[re], hn = Je.high, tn = Je.low, Ae = se + $e, je = te + ln + (Ae >>> 0 < se >>> 0 ? 1 : 0), Ae = Ae + We, je = je + cn + (Ae >>> 0 < We >>> 0 ? 1 : 0), Ae = Ae + tn, je = je + hn + (Ae >>> 0 < tn >>> 0 ? 1 : 0), Ae = Ae + le, je = je + me + (Ae >>> 0 < le >>> 0 ? 1 : 0), q = Pe + ve, Z = Ne + qe + (q >>> 0 < Pe >>> 0 ? 1 : 0);
        te = ne, se = ie, ne = H, ie = G, H = R, G = K, K = x + Ae | 0, R = D + je + (K >>> 0 < x >>> 0 ? 1 : 0) | 0, D = V, x = z, V = W, z = J, W = X, J = Q, Q = Ae + q | 0, X = je + Z + (Q >>> 0 < Ae >>> 0 ? 1 : 0) | 0;
      }
      F = l.low = F + Q, l.high = P + X + (F >>> 0 < Q >>> 0 ? 1 : 0), k = v.low = k + J, v.high = I + W + (k >>> 0 < J >>> 0 ? 1 : 0), n = s.low = n + z, s.high = A + V + (n >>> 0 < z >>> 0 ? 1 : 0), _ = h.low = _ + x, h.high = c + D + (_ >>> 0 < x >>> 0 ? 1 : 0), a = p2.low = a + K, p2.high = e + R + (a >>> 0 < K >>> 0 ? 1 : 0), O = S.low = O + G, S.high = E + H + (O >>> 0 < G >>> 0 ? 1 : 0), L = B.low = L + ie, B.high = T + ne + (L >>> 0 < ie >>> 0 ? 1 : 0), U = w.low = U + se, w.high = N + te + (U >>> 0 < se >>> 0 ? 1 : 0);
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var i = this._data, o = i.words, y = this._nDataBytes * 8, l = i.sigBytes * 8;
      o[l >>> 5] |= 128 << 24 - l % 32, o[(l + 128 >>> 10 << 5) + 30] = Math.floor(y / 4294967296), o[(l + 128 >>> 10 << 5) + 31] = y, i.sigBytes = o.length * 4, this._process();
      var v = this._hash.toX32();
      return v;
    }, "_doFinalize"), clone: r(function() {
      var i = C.clone.call(this);
      return i._hash = this._hash.clone(), i;
    }, "clone"), blockSize: 1024 / 32 });
    M.SHA512 = C._createHelper(g2), M.HmacSHA512 = C._createHmacHelper(g2);
  })(), (function() {
    var M = Y, $ = M.x64, C = $.Word, j = $.WordArray, b = M.algo, f = b.SHA512, u = b.SHA384 = f.extend({ _doReset: r(function() {
      this._hash = new j.init([new C.init(3418070365, 3238371032), new C.init(1654270250, 914150663), new C.init(2438529370, 812702999), new C.init(355462360, 4144912697), new C.init(1731405415, 4290775857), new C.init(2394180231, 1750603025), new C.init(3675008525, 1694076839), new C.init(1203062813, 3204075428)]);
    }, "_doReset"), _doFinalize: r(function() {
      var m = f._doFinalize.call(this);
      return m.sigBytes -= 16, m;
    }, "_doFinalize") });
    M.SHA384 = f._createHelper(u), M.HmacSHA384 = f._createHmacHelper(u);
  })(), (function(M) {
    var $ = Y, C = $.lib, j = C.WordArray, b = C.Hasher, f = $.x64, u = f.Word, m = $.algo, d2 = [], t = [], g2 = [];
    (function() {
      for (var y = 1, l = 0, v = 0; v < 24; v++) {
        d2[y + 5 * l] = (v + 1) * (v + 2) / 2 % 64;
        var s = l % 5, h = (2 * y + 3 * l) % 5;
        y = s, l = h;
      }
      for (var y = 0; y < 5; y++) for (var l = 0; l < 5; l++) t[y + 5 * l] = l + (2 * y + 3 * l) % 5 * 5;
      for (var p2 = 1, S = 0; S < 24; S++) {
        for (var B = 0, w = 0, P = 0; P < 7; P++) {
          if (p2 & 1) {
            var F = (1 << P) - 1;
            F < 32 ? w ^= 1 << F : B ^= 1 << F - 32;
          }
          p2 & 128 ? p2 = p2 << 1 ^ 113 : p2 <<= 1;
        }
        g2[S] = u.create(B, w);
      }
    })();
    var i = [];
    (function() {
      for (var y = 0; y < 25; y++) i[y] = u.create();
    })();
    var o = m.SHA3 = b.extend({ cfg: b.cfg.extend({ outputLength: 512 }), _doReset: r(function() {
      for (var y = this._state = [], l = 0; l < 25; l++) y[l] = new u.init();
      this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    }, "_doReset"), _doProcessBlock: r(function(y, l) {
      for (var v = this._state, s = this.blockSize / 2, h = 0; h < s; h++) {
        var p2 = y[l + 2 * h], S = y[l + 2 * h + 1];
        p2 = (p2 << 8 | p2 >>> 24) & 16711935 | (p2 << 24 | p2 >>> 8) & 4278255360, S = (S << 8 | S >>> 24) & 16711935 | (S << 24 | S >>> 8) & 4278255360;
        var B = v[h];
        B.high ^= S, B.low ^= p2;
      }
      for (var w = 0; w < 24; w++) {
        for (var P = 0; P < 5; P++) {
          for (var F = 0, I = 0, k = 0; k < 5; k++) {
            var B = v[P + 5 * k];
            F ^= B.high, I ^= B.low;
          }
          var A = i[P];
          A.high = F, A.low = I;
        }
        for (var P = 0; P < 5; P++) for (var n = i[(P + 4) % 5], c = i[(P + 1) % 5], _ = c.high, e = c.low, F = n.high ^ (_ << 1 | e >>> 31), I = n.low ^ (e << 1 | _ >>> 31), k = 0; k < 5; k++) {
          var B = v[P + 5 * k];
          B.high ^= F, B.low ^= I;
        }
        for (var a = 1; a < 25; a++) {
          var F, I, B = v[a], E = B.high, O = B.low, T = d2[a];
          T < 32 ? (F = E << T | O >>> 32 - T, I = O << T | E >>> 32 - T) : (F = O << T - 32 | E >>> 64 - T, I = E << T - 32 | O >>> 64 - T);
          var L = i[t[a]];
          L.high = F, L.low = I;
        }
        var N = i[0], U = v[0];
        N.high = U.high, N.low = U.low;
        for (var P = 0; P < 5; P++) for (var k = 0; k < 5; k++) {
          var a = P + 5 * k, B = v[a], X = i[a], Q = i[(P + 1) % 5 + 5 * k], W = i[(P + 2) % 5 + 5 * k];
          B.high = X.high ^ ~Q.high & W.high, B.low = X.low ^ ~Q.low & W.low;
        }
        var B = v[0], J = g2[w];
        B.high ^= J.high, B.low ^= J.low;
      }
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var y = this._data, l = y.words, v = this._nDataBytes * 8, s = y.sigBytes * 8, h = this.blockSize * 32;
      l[s >>> 5] |= 1 << 24 - s % 32, l[(M.ceil((s + 1) / h) * h >>> 5) - 1] |= 128, y.sigBytes = l.length * 4, this._process();
      for (var p2 = this._state, S = this.cfg.outputLength / 8, B = S / 8, w = [], P = 0; P < B; P++) {
        var F = p2[P], I = F.high, k = F.low;
        I = (I << 8 | I >>> 24) & 16711935 | (I << 24 | I >>> 8) & 4278255360, k = (k << 8 | k >>> 24) & 16711935 | (k << 24 | k >>> 8) & 4278255360, w.push(k), w.push(I);
      }
      return new j.init(w, S);
    }, "_doFinalize"), clone: r(function() {
      for (var y = b.clone.call(this), l = y._state = this._state.slice(0), v = 0; v < 25; v++) l[v] = l[v].clone();
      return y;
    }, "clone") });
    $.SHA3 = b._createHelper(o), $.HmacSHA3 = b._createHmacHelper(o);
  })(Math), (function(M) {
    var $ = Y, C = $.lib, j = C.WordArray, b = C.Hasher, f = $.algo, u = j.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), m = j.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), d2 = j.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]), t = j.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), g2 = j.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), i = j.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), o = f.RIPEMD160 = b.extend({ _doReset: r(function() {
      this._hash = j.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
    }, "_doReset"), _doProcessBlock: r(function(S, B) {
      for (var w = 0; w < 16; w++) {
        var P = B + w, F = S[P];
        S[P] = (F << 8 | F >>> 24) & 16711935 | (F << 24 | F >>> 8) & 4278255360;
      }
      var I = this._hash.words, k = g2.words, A = i.words, n = u.words, c = m.words, _ = d2.words, e = t.words, a, E, O, T, L, N, U, X, Q, W;
      N = a = I[0], U = E = I[1], X = O = I[2], Q = T = I[3], W = L = I[4];
      for (var J, w = 0; w < 80; w += 1) J = a + S[B + n[w]] | 0, w < 16 ? J += y(E, O, T) + k[0] : w < 32 ? J += l(E, O, T) + k[1] : w < 48 ? J += v(E, O, T) + k[2] : w < 64 ? J += s(E, O, T) + k[3] : J += h(E, O, T) + k[4], J = J | 0, J = p2(J, _[w]), J = J + L | 0, a = L, L = T, T = p2(O, 10), O = E, E = J, J = N + S[B + c[w]] | 0, w < 16 ? J += h(U, X, Q) + A[0] : w < 32 ? J += s(U, X, Q) + A[1] : w < 48 ? J += v(U, X, Q) + A[2] : w < 64 ? J += l(U, X, Q) + A[3] : J += y(U, X, Q) + A[4], J = J | 0, J = p2(J, e[w]), J = J + W | 0, N = W, W = Q, Q = p2(X, 10), X = U, U = J;
      J = I[1] + O + Q | 0, I[1] = I[2] + T + W | 0, I[2] = I[3] + L + N | 0, I[3] = I[4] + a + U | 0, I[4] = I[0] + E + X | 0, I[0] = J;
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var S = this._data, B = S.words, w = this._nDataBytes * 8, P = S.sigBytes * 8;
      B[P >>> 5] |= 128 << 24 - P % 32, B[(P + 64 >>> 9 << 4) + 14] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360, S.sigBytes = (B.length + 1) * 4, this._process();
      for (var F = this._hash, I = F.words, k = 0; k < 5; k++) {
        var A = I[k];
        I[k] = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360;
      }
      return F;
    }, "_doFinalize"), clone: r(function() {
      var S = b.clone.call(this);
      return S._hash = this._hash.clone(), S;
    }, "clone") });
    function y(S, B, w) {
      return S ^ B ^ w;
    }
    r(y, "f1");
    function l(S, B, w) {
      return S & B | ~S & w;
    }
    r(l, "f2");
    function v(S, B, w) {
      return (S | ~B) ^ w;
    }
    r(v, "f3");
    function s(S, B, w) {
      return S & w | B & ~w;
    }
    r(s, "f4");
    function h(S, B, w) {
      return S ^ (B | ~w);
    }
    r(h, "f5");
    function p2(S, B) {
      return S << B | S >>> 32 - B;
    }
    r(p2, "rotl"), $.RIPEMD160 = b._createHelper(o), $.HmacRIPEMD160 = b._createHmacHelper(o);
  })(Math), (function() {
    var M = Y, $ = M.lib, C = $.Base, j = M.enc, b = j.Utf8, f = M.algo, u = f.HMAC = C.extend({ init: r(function(m, d2) {
      m = this._hasher = new m.init(), typeof d2 == "string" && (d2 = b.parse(d2));
      var t = m.blockSize, g2 = t * 4;
      d2.sigBytes > g2 && (d2 = m.finalize(d2)), d2.clamp();
      for (var i = this._oKey = d2.clone(), o = this._iKey = d2.clone(), y = i.words, l = o.words, v = 0; v < t; v++) y[v] ^= 1549556828, l[v] ^= 909522486;
      i.sigBytes = o.sigBytes = g2, this.reset();
    }, "init"), reset: r(function() {
      var m = this._hasher;
      m.reset(), m.update(this._iKey);
    }, "reset"), update: r(function(m) {
      return this._hasher.update(m), this;
    }, "update"), finalize: r(function(m) {
      var d2 = this._hasher, t = d2.finalize(m);
      d2.reset();
      var g2 = d2.finalize(this._oKey.clone().concat(t));
      return g2;
    }, "finalize") });
  })(), (function() {
    var M = Y, $ = M.lib, C = $.Base, j = $.WordArray, b = M.algo, f = b.SHA1, u = b.HMAC, m = b.PBKDF2 = C.extend({ cfg: C.extend({ keySize: 128 / 32, hasher: f, iterations: 1 }), init: r(function(d2) {
      this.cfg = this.cfg.extend(d2);
    }, "init"), compute: r(function(d2, t) {
      for (var g2 = this.cfg, i = u.create(g2.hasher, d2), o = j.create(), y = j.create([1]), l = o.words, v = y.words, s = g2.keySize, h = g2.iterations; l.length < s; ) {
        var p2 = i.update(t).finalize(y);
        i.reset();
        for (var S = p2.words, B = S.length, w = p2, P = 1; P < h; P++) {
          w = i.finalize(w), i.reset();
          for (var F = w.words, I = 0; I < B; I++) S[I] ^= F[I];
        }
        o.concat(p2), v[0]++;
      }
      return o.sigBytes = s * 4, o;
    }, "compute") });
    M.PBKDF2 = function(d2, t, g2) {
      return m.create(g2).compute(d2, t);
    };
  })(), (function() {
    var M = Y, $ = M.lib, C = $.Base, j = $.WordArray, b = M.algo, f = b.MD5, u = b.EvpKDF = C.extend({ cfg: C.extend({ keySize: 128 / 32, hasher: f, iterations: 1 }), init: r(function(m) {
      this.cfg = this.cfg.extend(m);
    }, "init"), compute: r(function(m, d2) {
      for (var t, g2 = this.cfg, i = g2.hasher.create(), o = j.create(), y = o.words, l = g2.keySize, v = g2.iterations; y.length < l; ) {
        t && i.update(t), t = i.update(m).finalize(d2), i.reset();
        for (var s = 1; s < v; s++) t = i.finalize(t), i.reset();
        o.concat(t);
      }
      return o.sigBytes = l * 4, o;
    }, "compute") });
    M.EvpKDF = function(m, d2, t) {
      return u.create(t).compute(m, d2);
    };
  })(), Y.lib.Cipher || (function(M) {
    var $ = Y, C = $.lib, j = C.Base, b = C.WordArray, f = C.BufferedBlockAlgorithm, u = $.enc, m = u.Utf8, d2 = u.Base64, t = $.algo, g2 = t.EvpKDF, i = C.Cipher = f.extend({ cfg: j.extend(), createEncryptor: r(function(A, n) {
      return this.create(this._ENC_XFORM_MODE, A, n);
    }, "createEncryptor"), createDecryptor: r(function(A, n) {
      return this.create(this._DEC_XFORM_MODE, A, n);
    }, "createDecryptor"), init: r(function(A, n, c) {
      this.cfg = this.cfg.extend(c), this._xformMode = A, this._key = n, this.reset();
    }, "init"), reset: r(function() {
      f.reset.call(this), this._doReset();
    }, "reset"), process: r(function(A) {
      return this._append(A), this._process();
    }, "process"), finalize: r(function(A) {
      A && this._append(A);
      var n = this._doFinalize();
      return n;
    }, "finalize"), keySize: 128 / 32, ivSize: 128 / 32, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: (function() {
      function A(n) {
        return typeof n == "string" ? k : P;
      }
      return r(A, "selectCipherStrategy"), function(n) {
        return { encrypt: r(function(c, _, e) {
          return A(_).encrypt(n, c, _, e);
        }, "encrypt"), decrypt: r(function(c, _, e) {
          return A(_).decrypt(n, c, _, e);
        }, "decrypt") };
      };
    })() }), o = C.StreamCipher = i.extend({ _doFinalize: r(function() {
      var A = this._process(true);
      return A;
    }, "_doFinalize"), blockSize: 1 }), y = $.mode = {}, l = C.BlockCipherMode = j.extend({ createEncryptor: r(function(A, n) {
      return this.Encryptor.create(A, n);
    }, "createEncryptor"), createDecryptor: r(function(A, n) {
      return this.Decryptor.create(A, n);
    }, "createDecryptor"), init: r(function(A, n) {
      this._cipher = A, this._iv = n;
    }, "init") }), v = y.CBC = (function() {
      var A = l.extend();
      A.Encryptor = A.extend({ processBlock: r(function(c, _) {
        var e = this._cipher, a = e.blockSize;
        n.call(this, c, _, a), e.encryptBlock(c, _), this._prevBlock = c.slice(_, _ + a);
      }, "processBlock") }), A.Decryptor = A.extend({ processBlock: r(function(c, _) {
        var e = this._cipher, a = e.blockSize, E = c.slice(_, _ + a);
        e.decryptBlock(c, _), n.call(this, c, _, a), this._prevBlock = E;
      }, "processBlock") });
      function n(c, _, e) {
        var a, E = this._iv;
        E ? (a = E, this._iv = M) : a = this._prevBlock;
        for (var O = 0; O < e; O++) c[_ + O] ^= a[O];
      }
      return r(n, "xorBlock"), A;
    })(), s = $.pad = {}, h = s.Pkcs7 = { pad: r(function(A, n) {
      for (var c = n * 4, _ = c - A.sigBytes % c, e = _ << 24 | _ << 16 | _ << 8 | _, a = [], E = 0; E < _; E += 4) a.push(e);
      var O = b.create(a, _);
      A.concat(O);
    }, "pad"), unpad: r(function(A) {
      var n = A.words[A.sigBytes - 1 >>> 2] & 255;
      A.sigBytes -= n;
    }, "unpad") }, p2 = C.BlockCipher = i.extend({ cfg: i.cfg.extend({ mode: v, padding: h }), reset: r(function() {
      var A;
      i.reset.call(this);
      var n = this.cfg, c = n.iv, _ = n.mode;
      this._xformMode == this._ENC_XFORM_MODE ? A = _.createEncryptor : (A = _.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == A ? this._mode.init(this, c && c.words) : (this._mode = A.call(_, this, c && c.words), this._mode.__creator = A);
    }, "reset"), _doProcessBlock: r(function(A, n) {
      this._mode.processBlock(A, n);
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var A, n = this.cfg.padding;
      return this._xformMode == this._ENC_XFORM_MODE ? (n.pad(this._data, this.blockSize), A = this._process(true)) : (A = this._process(true), n.unpad(A)), A;
    }, "_doFinalize"), blockSize: 128 / 32 }), S = C.CipherParams = j.extend({ init: r(function(A) {
      this.mixIn(A);
    }, "init"), toString: r(function(A) {
      return (A || this.formatter).stringify(this);
    }, "toString") }), B = $.format = {}, w = B.OpenSSL = { stringify: r(function(A) {
      var n, c = A.ciphertext, _ = A.salt;
      return _ ? n = b.create([1398893684, 1701076831]).concat(_).concat(c) : n = c, n.toString(d2);
    }, "stringify"), parse: r(function(A) {
      var n, c = d2.parse(A), _ = c.words;
      return _[0] == 1398893684 && _[1] == 1701076831 && (n = b.create(_.slice(2, 4)), _.splice(0, 4), c.sigBytes -= 16), S.create({ ciphertext: c, salt: n });
    }, "parse") }, P = C.SerializableCipher = j.extend({ cfg: j.extend({ format: w }), encrypt: r(function(A, n, c, _) {
      _ = this.cfg.extend(_);
      var e = A.createEncryptor(c, _), a = e.finalize(n), E = e.cfg;
      return S.create({ ciphertext: a, key: c, iv: E.iv, algorithm: A, mode: E.mode, padding: E.padding, blockSize: A.blockSize, formatter: _.format });
    }, "encrypt"), decrypt: r(function(A, n, c, _) {
      _ = this.cfg.extend(_), n = this._parse(n, _.format);
      var e = A.createDecryptor(c, _).finalize(n.ciphertext);
      return e;
    }, "decrypt"), _parse: r(function(A, n) {
      return typeof A == "string" ? n.parse(A, this) : A;
    }, "_parse") }), F = $.kdf = {}, I = F.OpenSSL = { execute: r(function(A, n, c, _) {
      _ || (_ = b.random(64 / 8));
      var e = g2.create({ keySize: n + c }).compute(A, _), a = b.create(e.words.slice(n), c * 4);
      return e.sigBytes = n * 4, S.create({ key: e, iv: a, salt: _ });
    }, "execute") }, k = C.PasswordBasedCipher = P.extend({ cfg: P.cfg.extend({ kdf: I }), encrypt: r(function(A, n, c, _) {
      _ = this.cfg.extend(_);
      var e = _.kdf.execute(c, A.keySize, A.ivSize);
      _.iv = e.iv;
      var a = P.encrypt.call(this, A, n, e.key, _);
      return a.mixIn(e), a;
    }, "encrypt"), decrypt: r(function(A, n, c, _) {
      _ = this.cfg.extend(_), n = this._parse(n, _.format);
      var e = _.kdf.execute(c, A.keySize, A.ivSize, n.salt);
      _.iv = e.iv;
      var a = P.decrypt.call(this, A, n, e.key, _);
      return a;
    }, "decrypt") });
  })(), Y.mode.CFB = (function() {
    var M = Y.lib.BlockCipherMode.extend();
    M.Encryptor = M.extend({ processBlock: r(function(C, j) {
      var b = this._cipher, f = b.blockSize;
      $.call(this, C, j, f, b), this._prevBlock = C.slice(j, j + f);
    }, "processBlock") }), M.Decryptor = M.extend({ processBlock: r(function(C, j) {
      var b = this._cipher, f = b.blockSize, u = C.slice(j, j + f);
      $.call(this, C, j, f, b), this._prevBlock = u;
    }, "processBlock") });
    function $(C, j, b, f) {
      var u, m = this._iv;
      m ? (u = m.slice(0), this._iv = void 0) : u = this._prevBlock, f.encryptBlock(u, 0);
      for (var d2 = 0; d2 < b; d2++) C[j + d2] ^= u[d2];
    }
    return r($, "generateKeystreamAndEncrypt"), M;
  })(), Y.mode.CTR = (function() {
    var M = Y.lib.BlockCipherMode.extend(), $ = M.Encryptor = M.extend({ processBlock: r(function(C, j) {
      var b = this._cipher, f = b.blockSize, u = this._iv, m = this._counter;
      u && (m = this._counter = u.slice(0), this._iv = void 0);
      var d2 = m.slice(0);
      b.encryptBlock(d2, 0), m[f - 1] = m[f - 1] + 1 | 0;
      for (var t = 0; t < f; t++) C[j + t] ^= d2[t];
    }, "processBlock") });
    return M.Decryptor = $, M;
  })(), Y.mode.CTRGladman = (function() {
    var M = Y.lib.BlockCipherMode.extend();
    function $(b) {
      if ((b >> 24 & 255) === 255) {
        var f = b >> 16 & 255, u = b >> 8 & 255, m = b & 255;
        f === 255 ? (f = 0, u === 255 ? (u = 0, m === 255 ? m = 0 : ++m) : ++u) : ++f, b = 0, b += f << 16, b += u << 8, b += m;
      } else b += 1 << 24;
      return b;
    }
    r($, "incWord");
    function C(b) {
      return (b[0] = $(b[0])) === 0 && (b[1] = $(b[1])), b;
    }
    r(C, "incCounter");
    var j = M.Encryptor = M.extend({ processBlock: r(function(b, f) {
      var u = this._cipher, m = u.blockSize, d2 = this._iv, t = this._counter;
      d2 && (t = this._counter = d2.slice(0), this._iv = void 0), C(t);
      var g2 = t.slice(0);
      u.encryptBlock(g2, 0);
      for (var i = 0; i < m; i++) b[f + i] ^= g2[i];
    }, "processBlock") });
    return M.Decryptor = j, M;
  })(), Y.mode.OFB = (function() {
    var M = Y.lib.BlockCipherMode.extend(), $ = M.Encryptor = M.extend({ processBlock: r(function(C, j) {
      var b = this._cipher, f = b.blockSize, u = this._iv, m = this._keystream;
      u && (m = this._keystream = u.slice(0), this._iv = void 0), b.encryptBlock(m, 0);
      for (var d2 = 0; d2 < f; d2++) C[j + d2] ^= m[d2];
    }, "processBlock") });
    return M.Decryptor = $, M;
  })(), Y.mode.ECB = (function() {
    var M = Y.lib.BlockCipherMode.extend();
    return M.Encryptor = M.extend({ processBlock: r(function($, C) {
      this._cipher.encryptBlock($, C);
    }, "processBlock") }), M.Decryptor = M.extend({ processBlock: r(function($, C) {
      this._cipher.decryptBlock($, C);
    }, "processBlock") }), M;
  })(), Y.pad.AnsiX923 = { pad: r(function(M, $) {
    var C = M.sigBytes, j = $ * 4, b = j - C % j, f = C + b - 1;
    M.clamp(), M.words[f >>> 2] |= b << 24 - f % 4 * 8, M.sigBytes += b;
  }, "pad"), unpad: r(function(M) {
    var $ = M.words[M.sigBytes - 1 >>> 2] & 255;
    M.sigBytes -= $;
  }, "unpad") }, Y.pad.Iso10126 = { pad: r(function(M, $) {
    var C = $ * 4, j = C - M.sigBytes % C;
    M.concat(Y.lib.WordArray.random(j - 1)).concat(Y.lib.WordArray.create([j << 24], 1));
  }, "pad"), unpad: r(function(M) {
    var $ = M.words[M.sigBytes - 1 >>> 2] & 255;
    M.sigBytes -= $;
  }, "unpad") }, Y.pad.Iso97971 = { pad: r(function(M, $) {
    M.concat(Y.lib.WordArray.create([2147483648], 1)), Y.pad.ZeroPadding.pad(M, $);
  }, "pad"), unpad: r(function(M) {
    Y.pad.ZeroPadding.unpad(M), M.sigBytes--;
  }, "unpad") }, Y.pad.ZeroPadding = { pad: r(function(M, $) {
    var C = $ * 4;
    M.clamp(), M.sigBytes += C - (M.sigBytes % C || C);
  }, "pad"), unpad: r(function(M) {
    for (var $ = M.words, C = M.sigBytes - 1, C = M.sigBytes - 1; C >= 0; C--) if ($[C >>> 2] >>> 24 - C % 4 * 8 & 255) {
      M.sigBytes = C + 1;
      break;
    }
  }, "unpad") }, Y.pad.NoPadding = { pad: r(function() {
  }, "pad"), unpad: r(function() {
  }, "unpad") }, (function(M) {
    var $ = Y, C = $.lib, j = C.CipherParams, b = $.enc, f = b.Hex, u = $.format, m = u.Hex = { stringify: r(function(d2) {
      return d2.ciphertext.toString(f);
    }, "stringify"), parse: r(function(d2) {
      var t = f.parse(d2);
      return j.create({ ciphertext: t });
    }, "parse") };
  })(), (function() {
    var M = Y, $ = M.lib, C = $.BlockCipher, j = M.algo, b = [], f = [], u = [], m = [], d2 = [], t = [], g2 = [], i = [], o = [], y = [];
    (function() {
      for (var s = [], h = 0; h < 256; h++) h < 128 ? s[h] = h << 1 : s[h] = h << 1 ^ 283;
      for (var p2 = 0, S = 0, h = 0; h < 256; h++) {
        var B = S ^ S << 1 ^ S << 2 ^ S << 3 ^ S << 4;
        B = B >>> 8 ^ B & 255 ^ 99, b[p2] = B, f[B] = p2;
        var w = s[p2], P = s[w], F = s[P], I = s[B] * 257 ^ B * 16843008;
        u[p2] = I << 24 | I >>> 8, m[p2] = I << 16 | I >>> 16, d2[p2] = I << 8 | I >>> 24, t[p2] = I;
        var I = F * 16843009 ^ P * 65537 ^ w * 257 ^ p2 * 16843008;
        g2[B] = I << 24 | I >>> 8, i[B] = I << 16 | I >>> 16, o[B] = I << 8 | I >>> 24, y[B] = I, p2 ? (p2 = w ^ s[s[s[F ^ w]]], S ^= s[s[S]]) : p2 = S = 1;
      }
    })();
    var l = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], v = j.AES = C.extend({ _doReset: r(function() {
      var s;
      if (!(this._nRounds && this._keyPriorReset === this._key)) {
        for (var h = this._keyPriorReset = this._key, p2 = h.words, S = h.sigBytes / 4, B = this._nRounds = S + 6, w = (B + 1) * 4, P = this._keySchedule = [], F = 0; F < w; F++) F < S ? P[F] = p2[F] : (s = P[F - 1], F % S ? S > 6 && F % S == 4 && (s = b[s >>> 24] << 24 | b[s >>> 16 & 255] << 16 | b[s >>> 8 & 255] << 8 | b[s & 255]) : (s = s << 8 | s >>> 24, s = b[s >>> 24] << 24 | b[s >>> 16 & 255] << 16 | b[s >>> 8 & 255] << 8 | b[s & 255], s ^= l[F / S | 0] << 24), P[F] = P[F - S] ^ s);
        for (var I = this._invKeySchedule = [], k = 0; k < w; k++) {
          var F = w - k;
          if (k % 4) var s = P[F];
          else var s = P[F - 4];
          k < 4 || F <= 4 ? I[k] = s : I[k] = g2[b[s >>> 24]] ^ i[b[s >>> 16 & 255]] ^ o[b[s >>> 8 & 255]] ^ y[b[s & 255]];
        }
      }
    }, "_doReset"), encryptBlock: r(function(s, h) {
      this._doCryptBlock(s, h, this._keySchedule, u, m, d2, t, b);
    }, "encryptBlock"), decryptBlock: r(function(s, h) {
      var p2 = s[h + 1];
      s[h + 1] = s[h + 3], s[h + 3] = p2, this._doCryptBlock(s, h, this._invKeySchedule, g2, i, o, y, f);
      var p2 = s[h + 1];
      s[h + 1] = s[h + 3], s[h + 3] = p2;
    }, "decryptBlock"), _doCryptBlock: r(function(s, h, p2, S, B, w, P, F) {
      for (var I = this._nRounds, k = s[h] ^ p2[0], A = s[h + 1] ^ p2[1], n = s[h + 2] ^ p2[2], c = s[h + 3] ^ p2[3], _ = 4, e = 1; e < I; e++) {
        var a = S[k >>> 24] ^ B[A >>> 16 & 255] ^ w[n >>> 8 & 255] ^ P[c & 255] ^ p2[_++], E = S[A >>> 24] ^ B[n >>> 16 & 255] ^ w[c >>> 8 & 255] ^ P[k & 255] ^ p2[_++], O = S[n >>> 24] ^ B[c >>> 16 & 255] ^ w[k >>> 8 & 255] ^ P[A & 255] ^ p2[_++], T = S[c >>> 24] ^ B[k >>> 16 & 255] ^ w[A >>> 8 & 255] ^ P[n & 255] ^ p2[_++];
        k = a, A = E, n = O, c = T;
      }
      var a = (F[k >>> 24] << 24 | F[A >>> 16 & 255] << 16 | F[n >>> 8 & 255] << 8 | F[c & 255]) ^ p2[_++], E = (F[A >>> 24] << 24 | F[n >>> 16 & 255] << 16 | F[c >>> 8 & 255] << 8 | F[k & 255]) ^ p2[_++], O = (F[n >>> 24] << 24 | F[c >>> 16 & 255] << 16 | F[k >>> 8 & 255] << 8 | F[A & 255]) ^ p2[_++], T = (F[c >>> 24] << 24 | F[k >>> 16 & 255] << 16 | F[A >>> 8 & 255] << 8 | F[n & 255]) ^ p2[_++];
      s[h] = a, s[h + 1] = E, s[h + 2] = O, s[h + 3] = T;
    }, "_doCryptBlock"), keySize: 256 / 32 });
    M.AES = C._createHelper(v);
  })(), (function() {
    var M = Y, $ = M.lib, C = $.WordArray, j = $.BlockCipher, b = M.algo, f = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4], u = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32], m = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], d2 = [{ 0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378 }, { 0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672 }, { 0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792 }, { 0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464 }, { 0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040 }, { 0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656 }, { 0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577 }, { 0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848 }], t = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679], g2 = b.DES = j.extend({ _doReset: r(function() {
      for (var l = this._key, v = l.words, s = [], h = 0; h < 56; h++) {
        var p2 = f[h] - 1;
        s[h] = v[p2 >>> 5] >>> 31 - p2 % 32 & 1;
      }
      for (var S = this._subKeys = [], B = 0; B < 16; B++) {
        for (var w = S[B] = [], P = m[B], h = 0; h < 24; h++) w[h / 6 | 0] |= s[(u[h] - 1 + P) % 28] << 31 - h % 6, w[4 + (h / 6 | 0)] |= s[28 + (u[h + 24] - 1 + P) % 28] << 31 - h % 6;
        w[0] = w[0] << 1 | w[0] >>> 31;
        for (var h = 1; h < 7; h++) w[h] = w[h] >>> (h - 1) * 4 + 3;
        w[7] = w[7] << 5 | w[7] >>> 27;
      }
      for (var F = this._invSubKeys = [], h = 0; h < 16; h++) F[h] = S[15 - h];
    }, "_doReset"), encryptBlock: r(function(l, v) {
      this._doCryptBlock(l, v, this._subKeys);
    }, "encryptBlock"), decryptBlock: r(function(l, v) {
      this._doCryptBlock(l, v, this._invSubKeys);
    }, "decryptBlock"), _doCryptBlock: r(function(l, v, s) {
      this._lBlock = l[v], this._rBlock = l[v + 1], i.call(this, 4, 252645135), i.call(this, 16, 65535), o.call(this, 2, 858993459), o.call(this, 8, 16711935), i.call(this, 1, 1431655765);
      for (var h = 0; h < 16; h++) {
        for (var p2 = s[h], S = this._lBlock, B = this._rBlock, w = 0, P = 0; P < 8; P++) w |= d2[P][((B ^ p2[P]) & t[P]) >>> 0];
        this._lBlock = B, this._rBlock = S ^ w;
      }
      var F = this._lBlock;
      this._lBlock = this._rBlock, this._rBlock = F, i.call(this, 1, 1431655765), o.call(this, 8, 16711935), o.call(this, 2, 858993459), i.call(this, 16, 65535), i.call(this, 4, 252645135), l[v] = this._lBlock, l[v + 1] = this._rBlock;
    }, "_doCryptBlock"), keySize: 64 / 32, ivSize: 64 / 32, blockSize: 64 / 32 });
    function i(l, v) {
      var s = (this._lBlock >>> l ^ this._rBlock) & v;
      this._rBlock ^= s, this._lBlock ^= s << l;
    }
    r(i, "exchangeLR");
    function o(l, v) {
      var s = (this._rBlock >>> l ^ this._lBlock) & v;
      this._lBlock ^= s, this._rBlock ^= s << l;
    }
    r(o, "exchangeRL"), M.DES = j._createHelper(g2);
    var y = b.TripleDES = j.extend({ _doReset: r(function() {
      var l = this._key, v = l.words;
      if (v.length !== 2 && v.length !== 4 && v.length < 6) throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
      var s = v.slice(0, 2), h = v.length < 4 ? v.slice(0, 2) : v.slice(2, 4), p2 = v.length < 6 ? v.slice(0, 2) : v.slice(4, 6);
      this._des1 = g2.createEncryptor(C.create(s)), this._des2 = g2.createEncryptor(C.create(h)), this._des3 = g2.createEncryptor(C.create(p2));
    }, "_doReset"), encryptBlock: r(function(l, v) {
      this._des1.encryptBlock(l, v), this._des2.decryptBlock(l, v), this._des3.encryptBlock(l, v);
    }, "encryptBlock"), decryptBlock: r(function(l, v) {
      this._des3.decryptBlock(l, v), this._des2.encryptBlock(l, v), this._des1.decryptBlock(l, v);
    }, "decryptBlock"), keySize: 192 / 32, ivSize: 64 / 32, blockSize: 64 / 32 });
    M.TripleDES = j._createHelper(y);
  })(), (function() {
    var M = Y, $ = M.lib, C = $.StreamCipher, j = M.algo, b = j.RC4 = C.extend({ _doReset: r(function() {
      for (var m = this._key, d2 = m.words, t = m.sigBytes, g2 = this._S = [], i = 0; i < 256; i++) g2[i] = i;
      for (var i = 0, o = 0; i < 256; i++) {
        var y = i % t, l = d2[y >>> 2] >>> 24 - y % 4 * 8 & 255;
        o = (o + g2[i] + l) % 256;
        var v = g2[i];
        g2[i] = g2[o], g2[o] = v;
      }
      this._i = this._j = 0;
    }, "_doReset"), _doProcessBlock: r(function(m, d2) {
      m[d2] ^= f.call(this);
    }, "_doProcessBlock"), keySize: 256 / 32, ivSize: 0 });
    function f() {
      for (var m = this._S, d2 = this._i, t = this._j, g2 = 0, i = 0; i < 4; i++) {
        d2 = (d2 + 1) % 256, t = (t + m[d2]) % 256;
        var o = m[d2];
        m[d2] = m[t], m[t] = o, g2 |= m[(m[d2] + m[t]) % 256] << 24 - i * 8;
      }
      return this._i = d2, this._j = t, g2;
    }
    r(f, "generateKeystreamWord"), M.RC4 = C._createHelper(b);
    var u = j.RC4Drop = b.extend({ cfg: b.cfg.extend({ drop: 192 }), _doReset: r(function() {
      b._doReset.call(this);
      for (var m = this.cfg.drop; m > 0; m--) f.call(this);
    }, "_doReset") });
    M.RC4Drop = C._createHelper(u);
  })(), (function() {
    var M = Y, $ = M.lib, C = $.StreamCipher, j = M.algo, b = [], f = [], u = [], m = j.Rabbit = C.extend({ _doReset: r(function() {
      for (var t = this._key.words, g2 = this.cfg.iv, i = 0; i < 4; i++) t[i] = (t[i] << 8 | t[i] >>> 24) & 16711935 | (t[i] << 24 | t[i] >>> 8) & 4278255360;
      var o = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], y = this._C = [t[2] << 16 | t[2] >>> 16, t[0] & 4294901760 | t[1] & 65535, t[3] << 16 | t[3] >>> 16, t[1] & 4294901760 | t[2] & 65535, t[0] << 16 | t[0] >>> 16, t[2] & 4294901760 | t[3] & 65535, t[1] << 16 | t[1] >>> 16, t[3] & 4294901760 | t[0] & 65535];
      this._b = 0;
      for (var i = 0; i < 4; i++) d2.call(this);
      for (var i = 0; i < 8; i++) y[i] ^= o[i + 4 & 7];
      if (g2) {
        var l = g2.words, v = l[0], s = l[1], h = (v << 8 | v >>> 24) & 16711935 | (v << 24 | v >>> 8) & 4278255360, p2 = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360, S = h >>> 16 | p2 & 4294901760, B = p2 << 16 | h & 65535;
        y[0] ^= h, y[1] ^= S, y[2] ^= p2, y[3] ^= B, y[4] ^= h, y[5] ^= S, y[6] ^= p2, y[7] ^= B;
        for (var i = 0; i < 4; i++) d2.call(this);
      }
    }, "_doReset"), _doProcessBlock: r(function(t, g2) {
      var i = this._X;
      d2.call(this), b[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16, b[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16, b[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16, b[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16;
      for (var o = 0; o < 4; o++) b[o] = (b[o] << 8 | b[o] >>> 24) & 16711935 | (b[o] << 24 | b[o] >>> 8) & 4278255360, t[g2 + o] ^= b[o];
    }, "_doProcessBlock"), blockSize: 128 / 32, ivSize: 64 / 32 });
    function d2() {
      for (var t = this._X, g2 = this._C, i = 0; i < 8; i++) f[i] = g2[i];
      g2[0] = g2[0] + 1295307597 + this._b | 0, g2[1] = g2[1] + 3545052371 + (g2[0] >>> 0 < f[0] >>> 0 ? 1 : 0) | 0, g2[2] = g2[2] + 886263092 + (g2[1] >>> 0 < f[1] >>> 0 ? 1 : 0) | 0, g2[3] = g2[3] + 1295307597 + (g2[2] >>> 0 < f[2] >>> 0 ? 1 : 0) | 0, g2[4] = g2[4] + 3545052371 + (g2[3] >>> 0 < f[3] >>> 0 ? 1 : 0) | 0, g2[5] = g2[5] + 886263092 + (g2[4] >>> 0 < f[4] >>> 0 ? 1 : 0) | 0, g2[6] = g2[6] + 1295307597 + (g2[5] >>> 0 < f[5] >>> 0 ? 1 : 0) | 0, g2[7] = g2[7] + 3545052371 + (g2[6] >>> 0 < f[6] >>> 0 ? 1 : 0) | 0, this._b = g2[7] >>> 0 < f[7] >>> 0 ? 1 : 0;
      for (var i = 0; i < 8; i++) {
        var o = t[i] + g2[i], y = o & 65535, l = o >>> 16, v = ((y * y >>> 17) + y * l >>> 15) + l * l, s = ((o & 4294901760) * o | 0) + ((o & 65535) * o | 0);
        u[i] = v ^ s;
      }
      t[0] = u[0] + (u[7] << 16 | u[7] >>> 16) + (u[6] << 16 | u[6] >>> 16) | 0, t[1] = u[1] + (u[0] << 8 | u[0] >>> 24) + u[7] | 0, t[2] = u[2] + (u[1] << 16 | u[1] >>> 16) + (u[0] << 16 | u[0] >>> 16) | 0, t[3] = u[3] + (u[2] << 8 | u[2] >>> 24) + u[1] | 0, t[4] = u[4] + (u[3] << 16 | u[3] >>> 16) + (u[2] << 16 | u[2] >>> 16) | 0, t[5] = u[5] + (u[4] << 8 | u[4] >>> 24) + u[3] | 0, t[6] = u[6] + (u[5] << 16 | u[5] >>> 16) + (u[4] << 16 | u[4] >>> 16) | 0, t[7] = u[7] + (u[6] << 8 | u[6] >>> 24) + u[5] | 0;
    }
    r(d2, "nextState"), M.Rabbit = C._createHelper(m);
  })(), (function() {
    var M = Y, $ = M.lib, C = $.StreamCipher, j = M.algo, b = [], f = [], u = [], m = j.RabbitLegacy = C.extend({ _doReset: r(function() {
      var t = this._key.words, g2 = this.cfg.iv, i = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], o = this._C = [t[2] << 16 | t[2] >>> 16, t[0] & 4294901760 | t[1] & 65535, t[3] << 16 | t[3] >>> 16, t[1] & 4294901760 | t[2] & 65535, t[0] << 16 | t[0] >>> 16, t[2] & 4294901760 | t[3] & 65535, t[1] << 16 | t[1] >>> 16, t[3] & 4294901760 | t[0] & 65535];
      this._b = 0;
      for (var y = 0; y < 4; y++) d2.call(this);
      for (var y = 0; y < 8; y++) o[y] ^= i[y + 4 & 7];
      if (g2) {
        var l = g2.words, v = l[0], s = l[1], h = (v << 8 | v >>> 24) & 16711935 | (v << 24 | v >>> 8) & 4278255360, p2 = (s << 8 | s >>> 24) & 16711935 | (s << 24 | s >>> 8) & 4278255360, S = h >>> 16 | p2 & 4294901760, B = p2 << 16 | h & 65535;
        o[0] ^= h, o[1] ^= S, o[2] ^= p2, o[3] ^= B, o[4] ^= h, o[5] ^= S, o[6] ^= p2, o[7] ^= B;
        for (var y = 0; y < 4; y++) d2.call(this);
      }
    }, "_doReset"), _doProcessBlock: r(function(t, g2) {
      var i = this._X;
      d2.call(this), b[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16, b[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16, b[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16, b[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16;
      for (var o = 0; o < 4; o++) b[o] = (b[o] << 8 | b[o] >>> 24) & 16711935 | (b[o] << 24 | b[o] >>> 8) & 4278255360, t[g2 + o] ^= b[o];
    }, "_doProcessBlock"), blockSize: 128 / 32, ivSize: 64 / 32 });
    function d2() {
      for (var t = this._X, g2 = this._C, i = 0; i < 8; i++) f[i] = g2[i];
      g2[0] = g2[0] + 1295307597 + this._b | 0, g2[1] = g2[1] + 3545052371 + (g2[0] >>> 0 < f[0] >>> 0 ? 1 : 0) | 0, g2[2] = g2[2] + 886263092 + (g2[1] >>> 0 < f[1] >>> 0 ? 1 : 0) | 0, g2[3] = g2[3] + 1295307597 + (g2[2] >>> 0 < f[2] >>> 0 ? 1 : 0) | 0, g2[4] = g2[4] + 3545052371 + (g2[3] >>> 0 < f[3] >>> 0 ? 1 : 0) | 0, g2[5] = g2[5] + 886263092 + (g2[4] >>> 0 < f[4] >>> 0 ? 1 : 0) | 0, g2[6] = g2[6] + 1295307597 + (g2[5] >>> 0 < f[5] >>> 0 ? 1 : 0) | 0, g2[7] = g2[7] + 3545052371 + (g2[6] >>> 0 < f[6] >>> 0 ? 1 : 0) | 0, this._b = g2[7] >>> 0 < f[7] >>> 0 ? 1 : 0;
      for (var i = 0; i < 8; i++) {
        var o = t[i] + g2[i], y = o & 65535, l = o >>> 16, v = ((y * y >>> 17) + y * l >>> 15) + l * l, s = ((o & 4294901760) * o | 0) + ((o & 65535) * o | 0);
        u[i] = v ^ s;
      }
      t[0] = u[0] + (u[7] << 16 | u[7] >>> 16) + (u[6] << 16 | u[6] >>> 16) | 0, t[1] = u[1] + (u[0] << 8 | u[0] >>> 24) + u[7] | 0, t[2] = u[2] + (u[1] << 16 | u[1] >>> 16) + (u[0] << 16 | u[0] >>> 16) | 0, t[3] = u[3] + (u[2] << 8 | u[2] >>> 24) + u[1] | 0, t[4] = u[4] + (u[3] << 16 | u[3] >>> 16) + (u[2] << 16 | u[2] >>> 16) | 0, t[5] = u[5] + (u[4] << 8 | u[4] >>> 24) + u[3] | 0, t[6] = u[6] + (u[5] << 16 | u[5] >>> 16) + (u[4] << 16 | u[4] >>> 16) | 0, t[7] = u[7] + (u[6] << 8 | u[6] >>> 24) + u[5] | 0;
    }
    r(d2, "nextState"), M.RabbitLegacy = C._createHelper(m);
  })(), Y;
});
(function(Y, M) {
  typeof exports == "object" && typeof module == "object" ? module.exports = M() : typeof define == "function" && define.amd ? define([], M) : typeof exports == "object" ? exports.NODERSA = M() : Y.NODERSA = M();
})(globalThis, () => (() => {
  var Y = { 6395: (C) => {
    C.exports = { newInvalidAsn1Error: r(function(j) {
      var b = new Error();
      return b.name = "InvalidAsn1Error", b.message = j || "", b;
    }, "newInvalidAsn1Error") };
  }, 5670: (C, j, b) => {
    var f = b(6395), u = b(6299), m = b(3319), d2 = b(1431);
    for (var t in C.exports = { Reader: m, Writer: d2 }, u) u.hasOwnProperty(t) && (C.exports[t] = u[t]);
    for (var g2 in f) f.hasOwnProperty(g2) && (C.exports[g2] = f[g2]);
  }, 3319: (C, j, b) => {
    var f = b(4529), u = b(4774).Buffer, m = b(6299), d2 = b(6395).newInvalidAsn1Error;
    function t(g2) {
      if (!g2 || !u.isBuffer(g2)) throw new TypeError("data must be a node Buffer");
      this._buf = g2, this._size = g2.length, this._len = 0, this._offset = 0;
    }
    r(t, "a"), Object.defineProperty(t.prototype, "length", { enumerable: true, get: r(function() {
      return this._len;
    }, "get") }), Object.defineProperty(t.prototype, "offset", { enumerable: true, get: r(function() {
      return this._offset;
    }, "get") }), Object.defineProperty(t.prototype, "remain", { get: r(function() {
      return this._size - this._offset;
    }, "get") }), Object.defineProperty(t.prototype, "buffer", { get: r(function() {
      return this._buf.slice(this._offset);
    }, "get") }), t.prototype.readByte = function(g2) {
      if (this._size - this._offset < 1) return null;
      var i = 255 & this._buf[this._offset];
      return g2 || (this._offset += 1), i;
    }, t.prototype.peek = function() {
      return this.readByte(true);
    }, t.prototype.readLength = function(g2) {
      if (g2 === void 0 && (g2 = this._offset), g2 >= this._size) return null;
      var i = 255 & this._buf[g2++];
      if (i === null) return null;
      if (128 & ~i) this._len = i;
      else {
        if ((i &= 127) == 0) throw d2("Indefinite length not supported");
        if (i > 4) throw d2("encoding too long");
        if (this._size - g2 < i) return null;
        this._len = 0;
        for (var o = 0; o < i; o++) this._len = (this._len << 8) + (255 & this._buf[g2++]);
      }
      return g2;
    }, t.prototype.readSequence = function(g2) {
      var i = this.peek();
      if (i === null) return null;
      if (g2 !== void 0 && g2 !== i) throw d2("Expected 0x" + g2.toString(16) + ": got 0x" + i.toString(16));
      var o = this.readLength(this._offset + 1);
      return o === null ? null : (this._offset = o, i);
    }, t.prototype.readInt = function() {
      return this._readTag(m.Integer);
    }, t.prototype.readBoolean = function() {
      return this._readTag(m.Boolean) !== 0;
    }, t.prototype.readEnumeration = function() {
      return this._readTag(m.Enumeration);
    }, t.prototype.readString = function(g2, i) {
      g2 || (g2 = m.OctetString);
      var o = this.peek();
      if (o === null) return null;
      if (o !== g2) throw d2("Expected 0x" + g2.toString(16) + ": got 0x" + o.toString(16));
      var y = this.readLength(this._offset + 1);
      if (y === null || this.length > this._size - y) return null;
      if (this._offset = y, this.length === 0) return i ? u.alloc(0) : "";
      var l = this._buf.slice(this._offset, this._offset + this.length);
      return this._offset += this.length, i ? l : l.toString("utf8");
    }, t.prototype.readOID = function(g2) {
      g2 || (g2 = m.OID);
      var i = this.readString(g2, true);
      if (i === null) return null;
      for (var o = [], y = 0, l = 0; l < i.length; l++) {
        var v = 255 & i[l];
        y <<= 7, y += 127 & v, 128 & v || (o.push(y), y = 0);
      }
      return y = o.shift(), o.unshift(y % 40), o.unshift(y / 40 | 0), o.join(".");
    }, t.prototype._readTag = function(g2) {
      f.ok(g2 !== void 0);
      var i = this.peek();
      if (i === null) return null;
      if (i !== g2) throw d2("Expected 0x" + g2.toString(16) + ": got 0x" + i.toString(16));
      var o = this.readLength(this._offset + 1);
      if (o === null) return null;
      if (this.length > 4) throw d2("Integer too long: " + this.length);
      if (this.length > this._size - o) return null;
      this._offset = o;
      for (var y = this._buf[this._offset], l = 0, v = 0; v < this.length; v++) l <<= 8, l |= 255 & this._buf[this._offset++];
      return 128 & ~y || v === 4 || (l -= 1 << 8 * v), 0 | l;
    }, C.exports = t;
  }, 6299: (C) => {
    C.exports = { EOC: 0, Boolean: 1, Integer: 2, BitString: 3, OctetString: 4, Null: 5, OID: 6, ObjectDescriptor: 7, External: 8, Real: 9, Enumeration: 10, PDV: 11, Utf8String: 12, RelativeOID: 13, Sequence: 16, Set: 17, NumericString: 18, PrintableString: 19, T61String: 20, VideotexString: 21, IA5String: 22, UTCTime: 23, GeneralizedTime: 24, GraphicString: 25, VisibleString: 26, GeneralString: 28, UniversalString: 29, CharacterString: 30, BMPString: 31, Constructor: 32, Context: 128 };
  }, 1431: (C, j, b) => {
    var f = b(4529), u = b(4774).Buffer, m = b(6299), d2 = b(6395).newInvalidAsn1Error, t = { size: 1024, growthFactor: 8 };
    function g2(i) {
      var o, y;
      o = t, y = i || {}, f.ok(o), f.equal(typeof o, "object"), f.ok(y), f.equal(typeof y, "object"), Object.getOwnPropertyNames(o).forEach(function(l) {
        if (!y[l]) {
          var v = Object.getOwnPropertyDescriptor(o, l);
          Object.defineProperty(y, l, v);
        }
      }), i = y, this._buf = u.alloc(i.size || 1024), this._size = this._buf.length, this._offset = 0, this._options = i, this._seq = [];
    }
    r(g2, "f"), Object.defineProperty(g2.prototype, "buffer", { get: r(function() {
      if (this._seq.length) throw d2(this._seq.length + " unended sequence(s)");
      return this._buf.slice(0, this._offset);
    }, "get") }), g2.prototype.writeByte = function(i) {
      if (typeof i != "number") throw new TypeError("argument must be a Number");
      this._ensure(1), this._buf[this._offset++] = i;
    }, g2.prototype.writeInt = function(i, o) {
      if (typeof i != "number") throw new TypeError("argument must be a Number");
      typeof o != "number" && (o = m.Integer);
      for (var y = 4; (!(4286578688 & i) || (4286578688 & i) == -8388608) && y > 1; ) y--, i <<= 8;
      if (y > 4) throw d2("BER ints cannot be > 0xffffffff");
      for (this._ensure(2 + y), this._buf[this._offset++] = o, this._buf[this._offset++] = y; y-- > 0; ) this._buf[this._offset++] = (4278190080 & i) >>> 24, i <<= 8;
    }, g2.prototype.writeNull = function() {
      this.writeByte(m.Null), this.writeByte(0);
    }, g2.prototype.writeEnumeration = function(i, o) {
      if (typeof i != "number") throw new TypeError("argument must be a Number");
      return typeof o != "number" && (o = m.Enumeration), this.writeInt(i, o);
    }, g2.prototype.writeBoolean = function(i, o) {
      if (typeof i != "boolean") throw new TypeError("argument must be a Boolean");
      typeof o != "number" && (o = m.Boolean), this._ensure(3), this._buf[this._offset++] = o, this._buf[this._offset++] = 1, this._buf[this._offset++] = i ? 255 : 0;
    }, g2.prototype.writeString = function(i, o) {
      if (typeof i != "string") throw new TypeError("argument must be a string (was: " + typeof i + ")");
      typeof o != "number" && (o = m.OctetString);
      var y = u.byteLength(i);
      this.writeByte(o), this.writeLength(y), y && (this._ensure(y), this._buf.write(i, this._offset), this._offset += y);
    }, g2.prototype.writeBuffer = function(i, o) {
      if (typeof o != "number") throw new TypeError("tag must be a number");
      if (!u.isBuffer(i)) throw new TypeError("argument must be a buffer");
      this.writeByte(o), this.writeLength(i.length), this._ensure(i.length), i.copy(this._buf, this._offset, 0, i.length), this._offset += i.length;
    }, g2.prototype.writeStringArray = function(i) {
      if (!i instanceof Array) throw new TypeError("argument must be an Array[String]");
      var o = this;
      i.forEach(function(y) {
        o.writeString(y);
      });
    }, g2.prototype.writeOID = function(i, o) {
      if (typeof i != "string") throw new TypeError("argument must be a string");
      if (typeof o != "number" && (o = m.OID), !/^([0-9]+\.){3,}[0-9]+$/.test(i)) throw new Error("argument is not a valid OID string");
      var y = i.split("."), l = [];
      l.push(40 * parseInt(y[0], 10) + parseInt(y[1], 10)), y.slice(2).forEach(function(s) {
        (function(h, p2) {
          p2 < 128 ? h.push(p2) : p2 < 16384 ? (h.push(p2 >>> 7 | 128), h.push(127 & p2)) : p2 < 2097152 ? (h.push(p2 >>> 14 | 128), h.push(p2 >>> 7 & 255 | 128), h.push(127 & p2)) : p2 < 268435456 ? (h.push(p2 >>> 21 | 128), h.push(p2 >>> 14 & 255 | 128), h.push(p2 >>> 7 & 255 | 128), h.push(127 & p2)) : (h.push(p2 >>> 28 & 255 | 128), h.push(p2 >>> 21 & 255 | 128), h.push(p2 >>> 14 & 255 | 128), h.push(p2 >>> 7 & 255 | 128), h.push(127 & p2));
        })(l, parseInt(s, 10));
      });
      var v = this;
      this._ensure(2 + l.length), this.writeByte(o), this.writeLength(l.length), l.forEach(function(s) {
        v.writeByte(s);
      });
    }, g2.prototype.writeLength = function(i) {
      if (typeof i != "number") throw new TypeError("argument must be a Number");
      if (this._ensure(4), i <= 127) this._buf[this._offset++] = i;
      else if (i <= 255) this._buf[this._offset++] = 129, this._buf[this._offset++] = i;
      else if (i <= 65535) this._buf[this._offset++] = 130, this._buf[this._offset++] = i >> 8, this._buf[this._offset++] = i;
      else {
        if (!(i <= 16777215)) throw d2("Length too long (> 4 bytes)");
        this._buf[this._offset++] = 131, this._buf[this._offset++] = i >> 16, this._buf[this._offset++] = i >> 8, this._buf[this._offset++] = i;
      }
    }, g2.prototype.startSequence = function(i) {
      typeof i != "number" && (i = m.Sequence | m.Constructor), this.writeByte(i), this._seq.push(this._offset), this._ensure(3), this._offset += 3;
    }, g2.prototype.endSequence = function() {
      var i = this._seq.pop(), o = i + 3, y = this._offset - o;
      if (y <= 127) this._shift(o, y, -2), this._buf[i] = y;
      else if (y <= 255) this._shift(o, y, -1), this._buf[i] = 129, this._buf[i + 1] = y;
      else if (y <= 65535) this._buf[i] = 130, this._buf[i + 1] = y >> 8, this._buf[i + 2] = y;
      else {
        if (!(y <= 16777215)) throw d2("Sequence too long");
        this._shift(o, y, 1), this._buf[i] = 131, this._buf[i + 1] = y >> 16, this._buf[i + 2] = y >> 8, this._buf[i + 3] = y;
      }
    }, g2.prototype._shift = function(i, o, y) {
      f.ok(i !== void 0), f.ok(o !== void 0), f.ok(y), this._buf.copy(this._buf, i + y, i, i + o), this._offset += y;
    }, g2.prototype._ensure = function(i) {
      if (f.ok(i), this._size - this._offset < i) {
        var o = this._size * this._options.growthFactor;
        o - this._offset < i && (o += i);
        var y = u.alloc(o);
        this._buf.copy(y, 0, 0, this._offset), this._buf = y, this._size = o;
      }
    }, C.exports = g2;
  }, 3100: (C, j, b) => {
    var f = b(5670);
    C.exports = { Ber: f, BerReader: f.Reader, BerWriter: f.Writer };
  }, 4529: (C, j, b) => {
    "use strict";
    var f = b(1514)();
    function u(A, n) {
      if (A === n) return 0;
      for (var c = A.length, _ = n.length, e = 0, a = Math.min(c, _); e < a; ++e) if (A[e] !== n[e]) {
        c = A[e], _ = n[e];
        break;
      }
      return c < _ ? -1 : _ < c ? 1 : 0;
    }
    r(u, "i");
    function m(A) {
      return b.g.Buffer && typeof b.g.Buffer.isBuffer == "function" ? b.g.Buffer.isBuffer(A) : !(A == null || !A._isBuffer);
    }
    r(m, "o");
    var d2 = b(4591), t = Object.prototype.hasOwnProperty, g2 = Array.prototype.slice, i = function() {
    }.name === "foo";
    function o(A) {
      return Object.prototype.toString.call(A);
    }
    r(o, "c");
    function y(A) {
      return !m(A) && typeof b.g.ArrayBuffer == "function" && (typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(A) : !!A && (A instanceof DataView || !!(A.buffer && A.buffer instanceof ArrayBuffer)));
    }
    r(y, "h");
    var l = C.exports = B, v = /\s*function\s+([^\(\s]*)\s*/;
    function s(A) {
      if (d2.isFunction(A)) {
        if (i) return A.name;
        var n = A.toString().match(v);
        return n && n[1];
      }
    }
    r(s, "y");
    function h(A, n) {
      return typeof A == "string" ? A.length < n ? A : A.slice(0, n) : A;
    }
    r(h, "g");
    function p2(A) {
      if (i || !d2.isFunction(A)) return d2.inspect(A);
      var n = s(A);
      return "[Function" + (n ? ": " + n : "") + "]";
    }
    r(p2, "d");
    function S(A, n, c, _, e) {
      throw new l.AssertionError({ message: c, actual: A, expected: n, operator: _, stackStartFunction: e });
    }
    r(S, "v");
    function B(A, n) {
      A || S(A, true, n, "==", l.ok);
    }
    r(B, "m");
    function w(A, n, c, _) {
      if (A === n) return true;
      if (m(A) && m(n)) return u(A, n) === 0;
      if (d2.isDate(A) && d2.isDate(n)) return A.getTime() === n.getTime();
      if (d2.isRegExp(A) && d2.isRegExp(n)) return A.source === n.source && A.global === n.global && A.multiline === n.multiline && A.lastIndex === n.lastIndex && A.ignoreCase === n.ignoreCase;
      if (A !== null && typeof A == "object" || n !== null && typeof n == "object") {
        if (y(A) && y(n) && o(A) === o(n) && !(A instanceof Float32Array || A instanceof Float64Array)) return u(new Uint8Array(A.buffer), new Uint8Array(n.buffer)) === 0;
        if (m(A) !== m(n)) return false;
        var e = (_ = _ || { actual: [], expected: [] }).actual.indexOf(A);
        return e !== -1 && e === _.expected.indexOf(n) || (_.actual.push(A), _.expected.push(n), (function(a, E, O, T) {
          if (a == null || E == null) return false;
          if (d2.isPrimitive(a) || d2.isPrimitive(E)) return a === E;
          if (O && Object.getPrototypeOf(a) !== Object.getPrototypeOf(E)) return false;
          var L = P(a), N = P(E);
          if (L && !N || !L && N) return false;
          if (L) return w(a = g2.call(a), E = g2.call(E), O);
          var U, X, Q = k(a), W = k(E);
          if (Q.length !== W.length) return false;
          for (Q.sort(), W.sort(), X = Q.length - 1; X >= 0; X--) if (Q[X] !== W[X]) return false;
          for (X = Q.length - 1; X >= 0; X--) if (!w(a[U = Q[X]], E[U], O, T)) return false;
          return true;
        })(A, n, c, _));
      }
      return c ? A === n : A == n;
    }
    r(w, "S");
    function P(A) {
      return Object.prototype.toString.call(A) == "[object Arguments]";
    }
    r(P, "_");
    function F(A, n) {
      if (!A || !n) return false;
      if (Object.prototype.toString.call(n) == "[object RegExp]") return n.test(A);
      try {
        if (A instanceof n) return true;
      } catch {
      }
      return !Error.isPrototypeOf(n) && n.call({}, A) === true;
    }
    r(F, "b");
    function I(A, n, c, _) {
      var e;
      if (typeof n != "function") throw new TypeError('"block" argument must be a function');
      typeof c == "string" && (_ = c, c = null), e = (function(O) {
        var T;
        try {
          O();
        } catch (L) {
          T = L;
        }
        return T;
      })(n), _ = (c && c.name ? " (" + c.name + ")." : ".") + (_ ? " " + _ : "."), A && !e && S(e, c, "Missing expected exception" + _);
      var a = typeof _ == "string", E = !A && e && !c;
      if ((!A && d2.isError(e) && a && F(e, c) || E) && S(e, c, "Got unwanted exception" + _), A && e && c && !F(e, c) || !A && e) throw e;
    }
    r(I, "E"), l.AssertionError = function(A) {
      this.name = "AssertionError", this.actual = A.actual, this.expected = A.expected, this.operator = A.operator, A.message ? (this.message = A.message, this.generatedMessage = false) : (this.message = h(p2(this.actual), 128) + " " + this.operator + " " + h(p2(this.expected), 128), this.generatedMessage = true);
      var n = A.stackStartFunction || S;
      if (Error.captureStackTrace) Error.captureStackTrace(this, n);
      else {
        var c = new Error();
        if (c.stack) {
          var _ = c.stack, e = s(n), a = _.indexOf(`
` + e);
          if (a >= 0) {
            var E = _.indexOf(`
`, a + 1);
            _ = _.substring(E + 1);
          }
          this.stack = _;
        }
      }
    }, d2.inherits(l.AssertionError, Error), l.fail = S, l.ok = B, l.equal = function(A, n, c) {
      A != n && S(A, n, c, "==", l.equal);
    }, l.notEqual = function(A, n, c) {
      A == n && S(A, n, c, "!=", l.notEqual);
    }, l.deepEqual = function(A, n, c) {
      w(A, n, false) || S(A, n, c, "deepEqual", l.deepEqual);
    }, l.deepStrictEqual = function(A, n, c) {
      w(A, n, true) || S(A, n, c, "deepStrictEqual", l.deepStrictEqual);
    }, l.notDeepEqual = function(A, n, c) {
      w(A, n, false) && S(A, n, c, "notDeepEqual", l.notDeepEqual);
    }, l.notDeepStrictEqual = r(function A(n, c, _) {
      w(n, c, true) && S(n, c, _, "notDeepStrictEqual", A);
    }, "t"), l.strictEqual = function(A, n, c) {
      A !== n && S(A, n, c, "===", l.strictEqual);
    }, l.notStrictEqual = function(A, n, c) {
      A === n && S(A, n, c, "!==", l.notStrictEqual);
    }, l.throws = function(A, n, c) {
      I(true, A, n, c);
    }, l.doesNotThrow = function(A, n, c) {
      I(false, A, n, c);
    }, l.ifError = function(A) {
      if (A) throw A;
    }, l.strict = f(r(function A(n, c) {
      n || S(n, true, c, "==", A);
    }, "t"), l, { equal: l.strictEqual, deepEqual: l.deepStrictEqual, notEqual: l.notStrictEqual, notDeepEqual: l.notDeepStrictEqual }), l.strict.strict = l.strict;
    var k = Object.keys || function(A) {
      var n = [];
      for (var c in A) t.call(A, c) && n.push(c);
      return n;
    };
  }, 6100: (C) => {
    typeof Object.create == "function" ? C.exports = function(j, b) {
      j.super_ = b, j.prototype = Object.create(b.prototype, { constructor: { value: j, enumerable: false, writable: true, configurable: true } });
    } : C.exports = function(j, b) {
      j.super_ = b;
      var f = r(function() {
      }, "r");
      f.prototype = b.prototype, j.prototype = new f(), j.prototype.constructor = j;
    };
  }, 3845: (C) => {
    C.exports = function(j) {
      return j && typeof j == "object" && typeof j.copy == "function" && typeof j.fill == "function" && typeof j.readUInt8 == "function";
    };
  }, 4591: (C, j, b) => {
    var f = b(5606), u = /%[sdj%]/g;
    j.format = function(e) {
      if (!S(e)) {
        for (var a = [], E = 0; E < arguments.length; E++) a.push(t(arguments[E]));
        return a.join(" ");
      }
      E = 1;
      for (var O = arguments, T = O.length, L = String(e).replace(u, function(U) {
        if (U === "%%") return "%";
        if (E >= T) return U;
        switch (U) {
          case "%s":
            return String(O[E++]);
          case "%d":
            return Number(O[E++]);
          case "%j":
            try {
              return JSON.stringify(O[E++]);
            } catch {
              return "[Circular]";
            }
          default:
            return U;
        }
      }), N = O[E]; E < T; N = O[++E]) h(N) || !P(N) ? L += " " + N : L += " " + t(N);
      return L;
    }, j.deprecate = function(e, a) {
      if (B(b.g.process)) return function() {
        return j.deprecate(e, a).apply(this, arguments);
      };
      if (f.noDeprecation === true) return e;
      var E = false;
      return function() {
        if (!E) {
          if (f.throwDeprecation) throw new Error(a);
          f.traceDeprecation ? console.trace(a) : console.error(a), E = true;
        }
        return e.apply(this, arguments);
      };
    };
    var m, d2 = {};
    function t(e, a) {
      var E = { seen: [], stylize: i };
      return arguments.length >= 3 && (E.depth = arguments[2]), arguments.length >= 4 && (E.colors = arguments[3]), s(a) ? E.showHidden = a : a && j._extend(E, a), B(E.showHidden) && (E.showHidden = false), B(E.depth) && (E.depth = 2), B(E.colors) && (E.colors = false), B(E.customInspect) && (E.customInspect = true), E.colors && (E.stylize = g2), o(E, e, E.depth);
    }
    r(t, "a");
    function g2(e, a) {
      var E = t.styles[a];
      return E ? "\x1B[" + t.colors[E][0] + "m" + e + "\x1B[" + t.colors[E][1] + "m" : e;
    }
    r(g2, "f");
    function i(e, a) {
      return e;
    }
    r(i, "u");
    function o(e, a, E) {
      if (e.customInspect && a && k(a.inspect) && a.inspect !== j.inspect && (!a.constructor || a.constructor.prototype !== a)) {
        var O = a.inspect(E, e);
        return S(O) || (O = o(e, O, E)), O;
      }
      var T = (function(V, z) {
        if (B(z)) return V.stylize("undefined", "undefined");
        if (S(z)) {
          var D = "'" + JSON.stringify(z).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return V.stylize(D, "string");
        }
        return p2(z) ? V.stylize("" + z, "number") : s(z) ? V.stylize("" + z, "boolean") : h(z) ? V.stylize("null", "null") : void 0;
      })(e, a);
      if (T) return T;
      var L = Object.keys(a), N = (function(V) {
        var z = {};
        return V.forEach(function(D, x) {
          z[D] = true;
        }), z;
      })(L);
      if (e.showHidden && (L = Object.getOwnPropertyNames(a)), I(a) && (L.indexOf("message") >= 0 || L.indexOf("description") >= 0)) return y(a);
      if (L.length === 0) {
        if (k(a)) {
          var U = a.name ? ": " + a.name : "";
          return e.stylize("[Function" + U + "]", "special");
        }
        if (w(a)) return e.stylize(RegExp.prototype.toString.call(a), "regexp");
        if (F(a)) return e.stylize(Date.prototype.toString.call(a), "date");
        if (I(a)) return y(a);
      }
      var X, Q = "", W = false, J = ["{", "}"];
      return v(a) && (W = true, J = ["[", "]"]), k(a) && (Q = " [Function" + (a.name ? ": " + a.name : "") + "]"), w(a) && (Q = " " + RegExp.prototype.toString.call(a)), F(a) && (Q = " " + Date.prototype.toUTCString.call(a)), I(a) && (Q = " " + y(a)), L.length !== 0 || W && a.length != 0 ? E < 0 ? w(a) ? e.stylize(RegExp.prototype.toString.call(a), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(a), X = W ? (function(V, z, D, x, R) {
        for (var K = [], H = 0, G = z.length; H < G; ++H) _(z, String(H)) ? K.push(l(V, z, D, x, String(H), true)) : K.push("");
        return R.forEach(function(ne) {
          ne.match(/^\d+$/) || K.push(l(V, z, D, x, ne, true));
        }), K;
      })(e, a, E, N, L) : L.map(function(V) {
        return l(e, a, E, N, V, W);
      }), e.seen.pop(), (function(V, z, D) {
        return V.reduce(function(x, R) {
          return R.indexOf(`
`), x + R.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0) > 60 ? D[0] + (z === "" ? "" : z + `
 `) + " " + V.join(`,
  `) + " " + D[1] : D[0] + z + " " + V.join(", ") + " " + D[1];
      })(X, Q, J)) : J[0] + Q + J[1];
    }
    r(o, "c");
    function y(e) {
      return "[" + Error.prototype.toString.call(e) + "]";
    }
    r(y, "h");
    function l(e, a, E, O, T, L) {
      var N, U, X;
      if ((X = Object.getOwnPropertyDescriptor(a, T) || { value: a[T] }).get ? U = X.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : X.set && (U = e.stylize("[Setter]", "special")), _(O, T) || (N = "[" + T + "]"), U || (e.seen.indexOf(X.value) < 0 ? (U = h(E) ? o(e, X.value, null) : o(e, X.value, E - 1)).indexOf(`
`) > -1 && (U = L ? U.split(`
`).map(function(Q) {
        return "  " + Q;
      }).join(`
`).substr(2) : `
` + U.split(`
`).map(function(Q) {
        return "   " + Q;
      }).join(`
`)) : U = e.stylize("[Circular]", "special")), B(N)) {
        if (L && T.match(/^\d+$/)) return U;
        (N = JSON.stringify("" + T)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (N = N.substr(1, N.length - 2), N = e.stylize(N, "name")) : (N = N.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), N = e.stylize(N, "string"));
      }
      return N + ": " + U;
    }
    r(l, "p");
    function v(e) {
      return Array.isArray(e);
    }
    r(v, "l");
    function s(e) {
      return typeof e == "boolean";
    }
    r(s, "y");
    function h(e) {
      return e === null;
    }
    r(h, "g");
    function p2(e) {
      return typeof e == "number";
    }
    r(p2, "d");
    function S(e) {
      return typeof e == "string";
    }
    r(S, "v");
    function B(e) {
      return e === void 0;
    }
    r(B, "m");
    function w(e) {
      return P(e) && A(e) === "[object RegExp]";
    }
    r(w, "S");
    function P(e) {
      return typeof e == "object" && e !== null;
    }
    r(P, "_");
    function F(e) {
      return P(e) && A(e) === "[object Date]";
    }
    r(F, "b");
    function I(e) {
      return P(e) && (A(e) === "[object Error]" || e instanceof Error);
    }
    r(I, "E");
    function k(e) {
      return typeof e == "function";
    }
    r(k, "w");
    function A(e) {
      return Object.prototype.toString.call(e);
    }
    r(A, "O");
    function n(e) {
      return e < 10 ? "0" + e.toString(10) : e.toString(10);
    }
    r(n, "B"), j.debuglog = function(e) {
      if (B(m) && (m = f.env.NODE_DEBUG || ""), e = e.toUpperCase(), !d2[e]) if (new RegExp("\\b" + e + "\\b", "i").test(m)) {
        var a = f.pid;
        d2[e] = function() {
          var E = j.format.apply(j, arguments);
          console.error("%s %d: %s", e, a, E);
        };
      } else d2[e] = function() {
      };
      return d2[e];
    }, j.inspect = t, t.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, t.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, j.isArray = v, j.isBoolean = s, j.isNull = h, j.isNullOrUndefined = function(e) {
      return e == null;
    }, j.isNumber = p2, j.isString = S, j.isSymbol = function(e) {
      return typeof e == "symbol";
    }, j.isUndefined = B, j.isRegExp = w, j.isObject = P, j.isDate = F, j.isError = I, j.isFunction = k, j.isPrimitive = function(e) {
      return e === null || typeof e == "boolean" || typeof e == "number" || typeof e == "string" || typeof e == "symbol" || e === void 0;
    }, j.isBuffer = b(3845);
    var c = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function _(e, a) {
      return Object.prototype.hasOwnProperty.call(e, a);
    }
    r(_, "x"), j.log = function() {
      var e, a;
      console.log("%s - %s", (a = [n((e = /* @__PURE__ */ new Date()).getHours()), n(e.getMinutes()), n(e.getSeconds())].join(":"), [e.getDate(), c[e.getMonth()], a].join(" ")), j.format.apply(j, arguments));
    }, j.inherits = b(6100), j._extend = function(e, a) {
      if (!a || !P(a)) return e;
      for (var E = Object.keys(a), O = E.length; O--; ) e[E[O]] = a[E[O]];
      return e;
    };
  }, 7526: (C, j) => {
    "use strict";
    j.byteLength = function(i) {
      var o = t(i), y = o[0], l = o[1];
      return 3 * (y + l) / 4 - l;
    }, j.toByteArray = function(i) {
      var o, y, l = t(i), v = l[0], s = l[1], h = new u((function(B, w, P) {
        return 3 * (w + P) / 4 - P;
      })(0, v, s)), p2 = 0, S = s > 0 ? v - 4 : v;
      for (y = 0; y < S; y += 4) o = f[i.charCodeAt(y)] << 18 | f[i.charCodeAt(y + 1)] << 12 | f[i.charCodeAt(y + 2)] << 6 | f[i.charCodeAt(y + 3)], h[p2++] = o >> 16 & 255, h[p2++] = o >> 8 & 255, h[p2++] = 255 & o;
      return s === 2 && (o = f[i.charCodeAt(y)] << 2 | f[i.charCodeAt(y + 1)] >> 4, h[p2++] = 255 & o), s === 1 && (o = f[i.charCodeAt(y)] << 10 | f[i.charCodeAt(y + 1)] << 4 | f[i.charCodeAt(y + 2)] >> 2, h[p2++] = o >> 8 & 255, h[p2++] = 255 & o), h;
    }, j.fromByteArray = function(i) {
      for (var o, y = i.length, l = y % 3, v = [], s = 16383, h = 0, p2 = y - l; h < p2; h += s) v.push(g2(i, h, h + s > p2 ? p2 : h + s));
      return l === 1 ? (o = i[y - 1], v.push(b[o >> 2] + b[o << 4 & 63] + "==")) : l === 2 && (o = (i[y - 2] << 8) + i[y - 1], v.push(b[o >> 10] + b[o >> 4 & 63] + b[o << 2 & 63] + "=")), v.join("");
    };
    for (var b = [], f = [], u = typeof Uint8Array < "u" ? Uint8Array : Array, m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d2 = 0; d2 < 64; ++d2) b[d2] = m[d2], f[m.charCodeAt(d2)] = d2;
    function t(i) {
      var o = i.length;
      if (o % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var y = i.indexOf("=");
      return y === -1 && (y = o), [y, y === o ? 0 : 4 - y % 4];
    }
    r(t, "a");
    function g2(i, o, y) {
      for (var l, v, s = [], h = o; h < y; h += 3) l = (i[h] << 16 & 16711680) + (i[h + 1] << 8 & 65280) + (255 & i[h + 2]), s.push(b[(v = l) >> 18 & 63] + b[v >> 12 & 63] + b[v >> 6 & 63] + b[63 & v]);
      return s.join("");
    }
    r(g2, "f"), f[45] = 62, f[95] = 63;
  }, 8287: (C, j, b) => {
    "use strict";
    var f = b(7526), u = b(251);
    j.Buffer = t, j.SlowBuffer = function(D) {
      return +D != D && (D = 0), t.alloc(+D);
    }, j.INSPECT_MAX_BYTES = 50;
    var m = 2147483647;
    function d2(D) {
      if (D > m) throw new RangeError('The value "' + D + '" is invalid for option "size"');
      var x = new Uint8Array(D);
      return x.__proto__ = t.prototype, x;
    }
    r(d2, "s");
    function t(D, x, R) {
      if (typeof D == "number") {
        if (typeof x == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
        return o(D);
      }
      return g2(D, x, R);
    }
    r(t, "a");
    function g2(D, x, R) {
      if (typeof D == "string") return (function(G, ne) {
        if (typeof ne == "string" && ne !== "" || (ne = "utf8"), !t.isEncoding(ne)) throw new TypeError("Unknown encoding: " + ne);
        var ie = 0 | v(G, ne), te = d2(ie), se = te.write(G, ne);
        return se !== ie && (te = te.slice(0, se)), te;
      })(D, x);
      if (ArrayBuffer.isView(D)) return y(D);
      if (D == null) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof D);
      if (V(D, ArrayBuffer) || D && V(D.buffer, ArrayBuffer)) return (function(G, ne, ie) {
        if (ne < 0 || G.byteLength < ne) throw new RangeError('"offset" is outside of buffer bounds');
        if (G.byteLength < ne + (ie || 0)) throw new RangeError('"length" is outside of buffer bounds');
        var te;
        return (te = ne === void 0 && ie === void 0 ? new Uint8Array(G) : ie === void 0 ? new Uint8Array(G, ne) : new Uint8Array(G, ne, ie)).__proto__ = t.prototype, te;
      })(D, x, R);
      if (typeof D == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
      var K = D.valueOf && D.valueOf();
      if (K != null && K !== D) return t.from(K, x, R);
      var H = (function(G) {
        if (t.isBuffer(G)) {
          var ne = 0 | l(G.length), ie = d2(ne);
          return ie.length === 0 || G.copy(ie, 0, 0, ne), ie;
        }
        return G.length !== void 0 ? typeof G.length != "number" || z(G.length) ? d2(0) : y(G) : G.type === "Buffer" && Array.isArray(G.data) ? y(G.data) : void 0;
      })(D);
      if (H) return H;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof D[Symbol.toPrimitive] == "function") return t.from(D[Symbol.toPrimitive]("string"), x, R);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof D);
    }
    r(g2, "f");
    function i(D) {
      if (typeof D != "number") throw new TypeError('"size" argument must be of type number');
      if (D < 0) throw new RangeError('The value "' + D + '" is invalid for option "size"');
    }
    r(i, "u");
    function o(D) {
      return i(D), d2(D < 0 ? 0 : 0 | l(D));
    }
    r(o, "c");
    function y(D) {
      for (var x = D.length < 0 ? 0 : 0 | l(D.length), R = d2(x), K = 0; K < x; K += 1) R[K] = 255 & D[K];
      return R;
    }
    r(y, "h");
    function l(D) {
      if (D >= m) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + m.toString(16) + " bytes");
      return 0 | D;
    }
    r(l, "p");
    function v(D, x) {
      if (t.isBuffer(D)) return D.length;
      if (ArrayBuffer.isView(D) || V(D, ArrayBuffer)) return D.byteLength;
      if (typeof D != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof D);
      var R = D.length, K = arguments.length > 2 && arguments[2] === true;
      if (!K && R === 0) return 0;
      for (var H = false; ; ) switch (x) {
        case "ascii":
        case "latin1":
        case "binary":
          return R;
        case "utf8":
        case "utf-8":
          return Q(D).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * R;
        case "hex":
          return R >>> 1;
        case "base64":
          return W(D).length;
        default:
          if (H) return K ? -1 : Q(D).length;
          x = ("" + x).toLowerCase(), H = true;
      }
    }
    r(v, "l");
    function s(D, x, R) {
      var K = false;
      if ((x === void 0 || x < 0) && (x = 0), x > this.length || ((R === void 0 || R > this.length) && (R = this.length), R <= 0) || (R >>>= 0) <= (x >>>= 0)) return "";
      for (D || (D = "utf8"); ; ) switch (D) {
        case "hex":
          return a(this, x, R);
        case "utf8":
        case "utf-8":
          return n(this, x, R);
        case "ascii":
          return _(this, x, R);
        case "latin1":
        case "binary":
          return e(this, x, R);
        case "base64":
          return A(this, x, R);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return E(this, x, R);
        default:
          if (K) throw new TypeError("Unknown encoding: " + D);
          D = (D + "").toLowerCase(), K = true;
      }
    }
    r(s, "y");
    function h(D, x, R) {
      var K = D[x];
      D[x] = D[R], D[R] = K;
    }
    r(h, "g");
    function p2(D, x, R, K, H) {
      if (D.length === 0) return -1;
      if (typeof R == "string" ? (K = R, R = 0) : R > 2147483647 ? R = 2147483647 : R < -2147483648 && (R = -2147483648), z(R = +R) && (R = H ? 0 : D.length - 1), R < 0 && (R = D.length + R), R >= D.length) {
        if (H) return -1;
        R = D.length - 1;
      } else if (R < 0) {
        if (!H) return -1;
        R = 0;
      }
      if (typeof x == "string" && (x = t.from(x, K)), t.isBuffer(x)) return x.length === 0 ? -1 : S(D, x, R, K, H);
      if (typeof x == "number") return x &= 255, typeof Uint8Array.prototype.indexOf == "function" ? H ? Uint8Array.prototype.indexOf.call(D, x, R) : Uint8Array.prototype.lastIndexOf.call(D, x, R) : S(D, [x], R, K, H);
      throw new TypeError("val must be string, number or Buffer");
    }
    r(p2, "d");
    function S(D, x, R, K, H) {
      var G, ne = 1, ie = D.length, te = x.length;
      if (K !== void 0 && ((K = String(K).toLowerCase()) === "ucs2" || K === "ucs-2" || K === "utf16le" || K === "utf-16le")) {
        if (D.length < 2 || x.length < 2) return -1;
        ne = 2, ie /= 2, te /= 2, R /= 2;
      }
      function se(Ee, De) {
        return ne === 1 ? Ee[De] : Ee.readUInt16BE(De * ne);
      }
      if (r(se, "u"), H) {
        var re = -1;
        for (G = R; G < ie; G++) if (se(D, G) === se(x, re === -1 ? 0 : G - re)) {
          if (re === -1 && (re = G), G - re + 1 === te) return re * ne;
        } else re !== -1 && (G -= G - re), re = -1;
      } else for (R + te > ie && (R = ie - te), G = R; G >= 0; G--) {
        for (var le = true, me = 0; me < te; me++) if (se(D, G + me) !== se(x, me)) {
          le = false;
          break;
        }
        if (le) return G;
      }
      return -1;
    }
    r(S, "v");
    function B(D, x, R, K) {
      R = Number(R) || 0;
      var H = D.length - R;
      K ? (K = Number(K)) > H && (K = H) : K = H;
      var G = x.length;
      K > G / 2 && (K = G / 2);
      for (var ne = 0; ne < K; ++ne) {
        var ie = parseInt(x.substr(2 * ne, 2), 16);
        if (z(ie)) return ne;
        D[R + ne] = ie;
      }
      return ne;
    }
    r(B, "m");
    function w(D, x, R, K) {
      return J(Q(x, D.length - R), D, R, K);
    }
    r(w, "S");
    function P(D, x, R, K) {
      return J((function(H) {
        for (var G = [], ne = 0; ne < H.length; ++ne) G.push(255 & H.charCodeAt(ne));
        return G;
      })(x), D, R, K);
    }
    r(P, "_");
    function F(D, x, R, K) {
      return P(D, x, R, K);
    }
    r(F, "b");
    function I(D, x, R, K) {
      return J(W(x), D, R, K);
    }
    r(I, "E");
    function k(D, x, R, K) {
      return J((function(H, G) {
        for (var ne, ie, te, se = [], re = 0; re < H.length && !((G -= 2) < 0); ++re) ie = (ne = H.charCodeAt(re)) >> 8, te = ne % 256, se.push(te), se.push(ie);
        return se;
      })(x, D.length - R), D, R, K);
    }
    r(k, "w");
    function A(D, x, R) {
      return x === 0 && R === D.length ? f.fromByteArray(D) : f.fromByteArray(D.slice(x, R));
    }
    r(A, "O");
    function n(D, x, R) {
      R = Math.min(D.length, R);
      for (var K = [], H = x; H < R; ) {
        var G, ne, ie, te, se = D[H], re = null, le = se > 239 ? 4 : se > 223 ? 3 : se > 191 ? 2 : 1;
        if (H + le <= R) switch (le) {
          case 1:
            se < 128 && (re = se);
            break;
          case 2:
            (192 & (G = D[H + 1])) == 128 && (te = (31 & se) << 6 | 63 & G) > 127 && (re = te);
            break;
          case 3:
            G = D[H + 1], ne = D[H + 2], (192 & G) == 128 && (192 & ne) == 128 && (te = (15 & se) << 12 | (63 & G) << 6 | 63 & ne) > 2047 && (te < 55296 || te > 57343) && (re = te);
            break;
          case 4:
            G = D[H + 1], ne = D[H + 2], ie = D[H + 3], (192 & G) == 128 && (192 & ne) == 128 && (192 & ie) == 128 && (te = (15 & se) << 18 | (63 & G) << 12 | (63 & ne) << 6 | 63 & ie) > 65535 && te < 1114112 && (re = te);
        }
        re === null ? (re = 65533, le = 1) : re > 65535 && (re -= 65536, K.push(re >>> 10 & 1023 | 55296), re = 56320 | 1023 & re), K.push(re), H += le;
      }
      return (function(me) {
        var Ee = me.length;
        if (Ee <= c) return String.fromCharCode.apply(String, me);
        for (var De = "", _e = 0; _e < Ee; ) De += String.fromCharCode.apply(String, me.slice(_e, _e += c));
        return De;
      })(K);
    }
    r(n, "B"), j.kMaxLength = m, t.TYPED_ARRAY_SUPPORT = (function() {
      try {
        var D = new Uint8Array(1);
        return D.__proto__ = { __proto__: Uint8Array.prototype, foo: r(function() {
          return 42;
        }, "foo") }, D.foo() === 42;
      } catch {
        return false;
      }
    })(), t.TYPED_ARRAY_SUPPORT || typeof console > "u" || typeof console.error != "function" || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(t.prototype, "parent", { enumerable: true, get: r(function() {
      if (t.isBuffer(this)) return this.buffer;
    }, "get") }), Object.defineProperty(t.prototype, "offset", { enumerable: true, get: r(function() {
      if (t.isBuffer(this)) return this.byteOffset;
    }, "get") }), typeof Symbol < "u" && Symbol.species != null && t[Symbol.species] === t && Object.defineProperty(t, Symbol.species, { value: null, configurable: true, enumerable: false, writable: false }), t.poolSize = 8192, t.from = function(D, x, R) {
      return g2(D, x, R);
    }, t.prototype.__proto__ = Uint8Array.prototype, t.__proto__ = Uint8Array, t.alloc = function(D, x, R) {
      return (function(K, H, G) {
        return i(K), K <= 0 ? d2(K) : H !== void 0 ? typeof G == "string" ? d2(K).fill(H, G) : d2(K).fill(H) : d2(K);
      })(D, x, R);
    }, t.allocUnsafe = function(D) {
      return o(D);
    }, t.allocUnsafeSlow = function(D) {
      return o(D);
    }, t.isBuffer = function(D) {
      return D != null && D._isBuffer === true && D !== t.prototype;
    }, t.compare = function(D, x) {
      if (V(D, Uint8Array) && (D = t.from(D, D.offset, D.byteLength)), V(x, Uint8Array) && (x = t.from(x, x.offset, x.byteLength)), !t.isBuffer(D) || !t.isBuffer(x)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (D === x) return 0;
      for (var R = D.length, K = x.length, H = 0, G = Math.min(R, K); H < G; ++H) if (D[H] !== x[H]) {
        R = D[H], K = x[H];
        break;
      }
      return R < K ? -1 : K < R ? 1 : 0;
    }, t.isEncoding = function(D) {
      switch (String(D).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, t.concat = function(D, x) {
      if (!Array.isArray(D)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (D.length === 0) return t.alloc(0);
      var R;
      if (x === void 0) for (x = 0, R = 0; R < D.length; ++R) x += D[R].length;
      var K = t.allocUnsafe(x), H = 0;
      for (R = 0; R < D.length; ++R) {
        var G = D[R];
        if (V(G, Uint8Array) && (G = t.from(G)), !t.isBuffer(G)) throw new TypeError('"list" argument must be an Array of Buffers');
        G.copy(K, H), H += G.length;
      }
      return K;
    }, t.byteLength = v, t.prototype._isBuffer = true, t.prototype.swap16 = function() {
      var D = this.length;
      if (D % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var x = 0; x < D; x += 2) h(this, x, x + 1);
      return this;
    }, t.prototype.swap32 = function() {
      var D = this.length;
      if (D % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var x = 0; x < D; x += 4) h(this, x, x + 3), h(this, x + 1, x + 2);
      return this;
    }, t.prototype.swap64 = function() {
      var D = this.length;
      if (D % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var x = 0; x < D; x += 8) h(this, x, x + 7), h(this, x + 1, x + 6), h(this, x + 2, x + 5), h(this, x + 3, x + 4);
      return this;
    }, t.prototype.toString = function() {
      var D = this.length;
      return D === 0 ? "" : arguments.length === 0 ? n(this, 0, D) : s.apply(this, arguments);
    }, t.prototype.toLocaleString = t.prototype.toString, t.prototype.equals = function(D) {
      if (!t.isBuffer(D)) throw new TypeError("Argument must be a Buffer");
      return this === D || t.compare(this, D) === 0;
    }, t.prototype.inspect = function() {
      var D = "", x = j.INSPECT_MAX_BYTES;
      return D = this.toString("hex", 0, x).replace(/(.{2})/g, "$1 ").trim(), this.length > x && (D += " ... "), "<Buffer " + D + ">";
    }, t.prototype.compare = function(D, x, R, K, H) {
      if (V(D, Uint8Array) && (D = t.from(D, D.offset, D.byteLength)), !t.isBuffer(D)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof D);
      if (x === void 0 && (x = 0), R === void 0 && (R = D ? D.length : 0), K === void 0 && (K = 0), H === void 0 && (H = this.length), x < 0 || R > D.length || K < 0 || H > this.length) throw new RangeError("out of range index");
      if (K >= H && x >= R) return 0;
      if (K >= H) return -1;
      if (x >= R) return 1;
      if (this === D) return 0;
      for (var G = (H >>>= 0) - (K >>>= 0), ne = (R >>>= 0) - (x >>>= 0), ie = Math.min(G, ne), te = this.slice(K, H), se = D.slice(x, R), re = 0; re < ie; ++re) if (te[re] !== se[re]) {
        G = te[re], ne = se[re];
        break;
      }
      return G < ne ? -1 : ne < G ? 1 : 0;
    }, t.prototype.includes = function(D, x, R) {
      return this.indexOf(D, x, R) !== -1;
    }, t.prototype.indexOf = function(D, x, R) {
      return p2(this, D, x, R, true);
    }, t.prototype.lastIndexOf = function(D, x, R) {
      return p2(this, D, x, R, false);
    }, t.prototype.write = function(D, x, R, K) {
      if (x === void 0) K = "utf8", R = this.length, x = 0;
      else if (R === void 0 && typeof x == "string") K = x, R = this.length, x = 0;
      else {
        if (!isFinite(x)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        x >>>= 0, isFinite(R) ? (R >>>= 0, K === void 0 && (K = "utf8")) : (K = R, R = void 0);
      }
      var H = this.length - x;
      if ((R === void 0 || R > H) && (R = H), D.length > 0 && (R < 0 || x < 0) || x > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      K || (K = "utf8");
      for (var G = false; ; ) switch (K) {
        case "hex":
          return B(this, D, x, R);
        case "utf8":
        case "utf-8":
          return w(this, D, x, R);
        case "ascii":
          return P(this, D, x, R);
        case "latin1":
        case "binary":
          return F(this, D, x, R);
        case "base64":
          return I(this, D, x, R);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return k(this, D, x, R);
        default:
          if (G) throw new TypeError("Unknown encoding: " + K);
          K = ("" + K).toLowerCase(), G = true;
      }
    }, t.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    var c = 4096;
    function _(D, x, R) {
      var K = "";
      R = Math.min(D.length, R);
      for (var H = x; H < R; ++H) K += String.fromCharCode(127 & D[H]);
      return K;
    }
    r(_, "x");
    function e(D, x, R) {
      var K = "";
      R = Math.min(D.length, R);
      for (var H = x; H < R; ++H) K += String.fromCharCode(D[H]);
      return K;
    }
    r(e, "P");
    function a(D, x, R) {
      var K, H = D.length;
      (!x || x < 0) && (x = 0), (!R || R < 0 || R > H) && (R = H);
      for (var G = "", ne = x; ne < R; ++ne) G += (K = D[ne]) < 16 ? "0" + K.toString(16) : K.toString(16);
      return G;
    }
    r(a, "T");
    function E(D, x, R) {
      for (var K = D.slice(x, R), H = "", G = 0; G < K.length; G += 2) H += String.fromCharCode(K[G] + 256 * K[G + 1]);
      return H;
    }
    r(E, "I");
    function O(D, x, R) {
      if (D % 1 != 0 || D < 0) throw new RangeError("offset is not uint");
      if (D + x > R) throw new RangeError("Trying to access beyond buffer length");
    }
    r(O, "k");
    function T(D, x, R, K, H, G) {
      if (!t.isBuffer(D)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (x > H || x < G) throw new RangeError('"value" argument is out of bounds');
      if (R + K > D.length) throw new RangeError("Index out of range");
    }
    r(T, "D");
    function L(D, x, R, K, H, G) {
      if (R + K > D.length) throw new RangeError("Index out of range");
      if (R < 0) throw new RangeError("Index out of range");
    }
    r(L, "R");
    function N(D, x, R, K, H) {
      return x = +x, R >>>= 0, H || L(D, 0, R, 4), u.write(D, x, R, K, 23, 4), R + 4;
    }
    r(N, "N");
    function U(D, x, R, K, H) {
      return x = +x, R >>>= 0, H || L(D, 0, R, 8), u.write(D, x, R, K, 52, 8), R + 8;
    }
    r(U, "L"), t.prototype.slice = function(D, x) {
      var R = this.length;
      (D = ~~D) < 0 ? (D += R) < 0 && (D = 0) : D > R && (D = R), (x = x === void 0 ? R : ~~x) < 0 ? (x += R) < 0 && (x = 0) : x > R && (x = R), x < D && (x = D);
      var K = this.subarray(D, x);
      return K.__proto__ = t.prototype, K;
    }, t.prototype.readUIntLE = function(D, x, R) {
      D >>>= 0, x >>>= 0, R || O(D, x, this.length);
      for (var K = this[D], H = 1, G = 0; ++G < x && (H *= 256); ) K += this[D + G] * H;
      return K;
    }, t.prototype.readUIntBE = function(D, x, R) {
      D >>>= 0, x >>>= 0, R || O(D, x, this.length);
      for (var K = this[D + --x], H = 1; x > 0 && (H *= 256); ) K += this[D + --x] * H;
      return K;
    }, t.prototype.readUInt8 = function(D, x) {
      return D >>>= 0, x || O(D, 1, this.length), this[D];
    }, t.prototype.readUInt16LE = function(D, x) {
      return D >>>= 0, x || O(D, 2, this.length), this[D] | this[D + 1] << 8;
    }, t.prototype.readUInt16BE = function(D, x) {
      return D >>>= 0, x || O(D, 2, this.length), this[D] << 8 | this[D + 1];
    }, t.prototype.readUInt32LE = function(D, x) {
      return D >>>= 0, x || O(D, 4, this.length), (this[D] | this[D + 1] << 8 | this[D + 2] << 16) + 16777216 * this[D + 3];
    }, t.prototype.readUInt32BE = function(D, x) {
      return D >>>= 0, x || O(D, 4, this.length), 16777216 * this[D] + (this[D + 1] << 16 | this[D + 2] << 8 | this[D + 3]);
    }, t.prototype.readIntLE = function(D, x, R) {
      D >>>= 0, x >>>= 0, R || O(D, x, this.length);
      for (var K = this[D], H = 1, G = 0; ++G < x && (H *= 256); ) K += this[D + G] * H;
      return K >= (H *= 128) && (K -= Math.pow(2, 8 * x)), K;
    }, t.prototype.readIntBE = function(D, x, R) {
      D >>>= 0, x >>>= 0, R || O(D, x, this.length);
      for (var K = x, H = 1, G = this[D + --K]; K > 0 && (H *= 256); ) G += this[D + --K] * H;
      return G >= (H *= 128) && (G -= Math.pow(2, 8 * x)), G;
    }, t.prototype.readInt8 = function(D, x) {
      return D >>>= 0, x || O(D, 1, this.length), 128 & this[D] ? -1 * (255 - this[D] + 1) : this[D];
    }, t.prototype.readInt16LE = function(D, x) {
      D >>>= 0, x || O(D, 2, this.length);
      var R = this[D] | this[D + 1] << 8;
      return 32768 & R ? 4294901760 | R : R;
    }, t.prototype.readInt16BE = function(D, x) {
      D >>>= 0, x || O(D, 2, this.length);
      var R = this[D + 1] | this[D] << 8;
      return 32768 & R ? 4294901760 | R : R;
    }, t.prototype.readInt32LE = function(D, x) {
      return D >>>= 0, x || O(D, 4, this.length), this[D] | this[D + 1] << 8 | this[D + 2] << 16 | this[D + 3] << 24;
    }, t.prototype.readInt32BE = function(D, x) {
      return D >>>= 0, x || O(D, 4, this.length), this[D] << 24 | this[D + 1] << 16 | this[D + 2] << 8 | this[D + 3];
    }, t.prototype.readFloatLE = function(D, x) {
      return D >>>= 0, x || O(D, 4, this.length), u.read(this, D, true, 23, 4);
    }, t.prototype.readFloatBE = function(D, x) {
      return D >>>= 0, x || O(D, 4, this.length), u.read(this, D, false, 23, 4);
    }, t.prototype.readDoubleLE = function(D, x) {
      return D >>>= 0, x || O(D, 8, this.length), u.read(this, D, true, 52, 8);
    }, t.prototype.readDoubleBE = function(D, x) {
      return D >>>= 0, x || O(D, 8, this.length), u.read(this, D, false, 52, 8);
    }, t.prototype.writeUIntLE = function(D, x, R, K) {
      D = +D, x >>>= 0, R >>>= 0, K || T(this, D, x, R, Math.pow(2, 8 * R) - 1, 0);
      var H = 1, G = 0;
      for (this[x] = 255 & D; ++G < R && (H *= 256); ) this[x + G] = D / H & 255;
      return x + R;
    }, t.prototype.writeUIntBE = function(D, x, R, K) {
      D = +D, x >>>= 0, R >>>= 0, K || T(this, D, x, R, Math.pow(2, 8 * R) - 1, 0);
      var H = R - 1, G = 1;
      for (this[x + H] = 255 & D; --H >= 0 && (G *= 256); ) this[x + H] = D / G & 255;
      return x + R;
    }, t.prototype.writeUInt8 = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 1, 255, 0), this[x] = 255 & D, x + 1;
    }, t.prototype.writeUInt16LE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 2, 65535, 0), this[x] = 255 & D, this[x + 1] = D >>> 8, x + 2;
    }, t.prototype.writeUInt16BE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 2, 65535, 0), this[x] = D >>> 8, this[x + 1] = 255 & D, x + 2;
    }, t.prototype.writeUInt32LE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 4, 4294967295, 0), this[x + 3] = D >>> 24, this[x + 2] = D >>> 16, this[x + 1] = D >>> 8, this[x] = 255 & D, x + 4;
    }, t.prototype.writeUInt32BE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 4, 4294967295, 0), this[x] = D >>> 24, this[x + 1] = D >>> 16, this[x + 2] = D >>> 8, this[x + 3] = 255 & D, x + 4;
    }, t.prototype.writeIntLE = function(D, x, R, K) {
      if (D = +D, x >>>= 0, !K) {
        var H = Math.pow(2, 8 * R - 1);
        T(this, D, x, R, H - 1, -H);
      }
      var G = 0, ne = 1, ie = 0;
      for (this[x] = 255 & D; ++G < R && (ne *= 256); ) D < 0 && ie === 0 && this[x + G - 1] !== 0 && (ie = 1), this[x + G] = (D / ne | 0) - ie & 255;
      return x + R;
    }, t.prototype.writeIntBE = function(D, x, R, K) {
      if (D = +D, x >>>= 0, !K) {
        var H = Math.pow(2, 8 * R - 1);
        T(this, D, x, R, H - 1, -H);
      }
      var G = R - 1, ne = 1, ie = 0;
      for (this[x + G] = 255 & D; --G >= 0 && (ne *= 256); ) D < 0 && ie === 0 && this[x + G + 1] !== 0 && (ie = 1), this[x + G] = (D / ne | 0) - ie & 255;
      return x + R;
    }, t.prototype.writeInt8 = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 1, 127, -128), D < 0 && (D = 255 + D + 1), this[x] = 255 & D, x + 1;
    }, t.prototype.writeInt16LE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 2, 32767, -32768), this[x] = 255 & D, this[x + 1] = D >>> 8, x + 2;
    }, t.prototype.writeInt16BE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 2, 32767, -32768), this[x] = D >>> 8, this[x + 1] = 255 & D, x + 2;
    }, t.prototype.writeInt32LE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 4, 2147483647, -2147483648), this[x] = 255 & D, this[x + 1] = D >>> 8, this[x + 2] = D >>> 16, this[x + 3] = D >>> 24, x + 4;
    }, t.prototype.writeInt32BE = function(D, x, R) {
      return D = +D, x >>>= 0, R || T(this, D, x, 4, 2147483647, -2147483648), D < 0 && (D = 4294967295 + D + 1), this[x] = D >>> 24, this[x + 1] = D >>> 16, this[x + 2] = D >>> 8, this[x + 3] = 255 & D, x + 4;
    }, t.prototype.writeFloatLE = function(D, x, R) {
      return N(this, D, x, true, R);
    }, t.prototype.writeFloatBE = function(D, x, R) {
      return N(this, D, x, false, R);
    }, t.prototype.writeDoubleLE = function(D, x, R) {
      return U(this, D, x, true, R);
    }, t.prototype.writeDoubleBE = function(D, x, R) {
      return U(this, D, x, false, R);
    }, t.prototype.copy = function(D, x, R, K) {
      if (!t.isBuffer(D)) throw new TypeError("argument should be a Buffer");
      if (R || (R = 0), K || K === 0 || (K = this.length), x >= D.length && (x = D.length), x || (x = 0), K > 0 && K < R && (K = R), K === R || D.length === 0 || this.length === 0) return 0;
      if (x < 0) throw new RangeError("targetStart out of bounds");
      if (R < 0 || R >= this.length) throw new RangeError("Index out of range");
      if (K < 0) throw new RangeError("sourceEnd out of bounds");
      K > this.length && (K = this.length), D.length - x < K - R && (K = D.length - x + R);
      var H = K - R;
      if (this === D && typeof Uint8Array.prototype.copyWithin == "function") this.copyWithin(x, R, K);
      else if (this === D && R < x && x < K) for (var G = H - 1; G >= 0; --G) D[G + x] = this[G + R];
      else Uint8Array.prototype.set.call(D, this.subarray(R, K), x);
      return H;
    }, t.prototype.fill = function(D, x, R, K) {
      if (typeof D == "string") {
        if (typeof x == "string" ? (K = x, x = 0, R = this.length) : typeof R == "string" && (K = R, R = this.length), K !== void 0 && typeof K != "string") throw new TypeError("encoding must be a string");
        if (typeof K == "string" && !t.isEncoding(K)) throw new TypeError("Unknown encoding: " + K);
        if (D.length === 1) {
          var H = D.charCodeAt(0);
          (K === "utf8" && H < 128 || K === "latin1") && (D = H);
        }
      } else typeof D == "number" && (D &= 255);
      if (x < 0 || this.length < x || this.length < R) throw new RangeError("Out of range index");
      if (R <= x) return this;
      var G;
      if (x >>>= 0, R = R === void 0 ? this.length : R >>> 0, D || (D = 0), typeof D == "number") for (G = x; G < R; ++G) this[G] = D;
      else {
        var ne = t.isBuffer(D) ? D : t.from(D, K), ie = ne.length;
        if (ie === 0) throw new TypeError('The value "' + D + '" is invalid for argument "value"');
        for (G = 0; G < R - x; ++G) this[G + x] = ne[G % ie];
      }
      return this;
    };
    var X = /[^+/0-9A-Za-z-_]/g;
    function Q(D, x) {
      var R;
      x = x || 1 / 0;
      for (var K = D.length, H = null, G = [], ne = 0; ne < K; ++ne) {
        if ((R = D.charCodeAt(ne)) > 55295 && R < 57344) {
          if (!H) {
            if (R > 56319) {
              (x -= 3) > -1 && G.push(239, 191, 189);
              continue;
            }
            if (ne + 1 === K) {
              (x -= 3) > -1 && G.push(239, 191, 189);
              continue;
            }
            H = R;
            continue;
          }
          if (R < 56320) {
            (x -= 3) > -1 && G.push(239, 191, 189), H = R;
            continue;
          }
          R = 65536 + (H - 55296 << 10 | R - 56320);
        } else H && (x -= 3) > -1 && G.push(239, 191, 189);
        if (H = null, R < 128) {
          if ((x -= 1) < 0) break;
          G.push(R);
        } else if (R < 2048) {
          if ((x -= 2) < 0) break;
          G.push(R >> 6 | 192, 63 & R | 128);
        } else if (R < 65536) {
          if ((x -= 3) < 0) break;
          G.push(R >> 12 | 224, R >> 6 & 63 | 128, 63 & R | 128);
        } else {
          if (!(R < 1114112)) throw new Error("Invalid code point");
          if ((x -= 4) < 0) break;
          G.push(R >> 18 | 240, R >> 12 & 63 | 128, R >> 6 & 63 | 128, 63 & R | 128);
        }
      }
      return G;
    }
    r(Q, "U");
    function W(D) {
      return f.toByteArray((function(x) {
        if ((x = (x = x.split("=")[0]).trim().replace(X, "")).length < 2) return "";
        for (; x.length % 4 != 0; ) x += "=";
        return x;
      })(D));
    }
    r(W, "M");
    function J(D, x, R, K) {
      for (var H = 0; H < K && !(H + R >= x.length || H >= D.length); ++H) x[H + R] = D[H];
      return H;
    }
    r(J, "j");
    function V(D, x) {
      return D instanceof x || D != null && D.constructor != null && D.constructor.name != null && D.constructor.name === x.name;
    }
    r(V, "H");
    function z(D) {
      return D != D;
    }
    r(z, "F");
  }, 8075: (C, j, b) => {
    "use strict";
    var f = b(453), u = b(487), m = u(f("String.prototype.indexOf"));
    C.exports = function(d2, t) {
      var g2 = f(d2, !!t);
      return typeof g2 == "function" && m(d2, ".prototype.") > -1 ? u(g2) : g2;
    };
  }, 487: (C, j, b) => {
    "use strict";
    var f = b(6743), u = b(453), m = b(6897), d2 = b(9675), t = u("%Function.prototype.apply%"), g2 = u("%Function.prototype.call%"), i = u("%Reflect.apply%", true) || f.call(g2, t), o = b(655), y = u("%Math.max%");
    C.exports = function(v) {
      if (typeof v != "function") throw new d2("a function is required");
      var s = i(f, g2, arguments);
      return m(s, 1 + y(0, v.length - (arguments.length - 1)), true);
    };
    var l = r(function() {
      return i(f, t, arguments);
    }, "p");
    o ? o(C.exports, "apply", { value: l }) : C.exports.apply = l;
  }, 955: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(754), b(4636), b(9506), b(7165), (function() {
      var u = f, m = u.lib.BlockCipher, d2 = u.algo, t = [], g2 = [], i = [], o = [], y = [], l = [], v = [], s = [], h = [], p2 = [];
      (function() {
        for (var w = [], P = 0; P < 256; P++) w[P] = P < 128 ? P << 1 : P << 1 ^ 283;
        var F = 0, I = 0;
        for (P = 0; P < 256; P++) {
          var k = I ^ I << 1 ^ I << 2 ^ I << 3 ^ I << 4;
          k = k >>> 8 ^ 255 & k ^ 99, t[F] = k, g2[k] = F;
          var A = w[F], n = w[A], c = w[n], _ = 257 * w[k] ^ 16843008 * k;
          i[F] = _ << 24 | _ >>> 8, o[F] = _ << 16 | _ >>> 16, y[F] = _ << 8 | _ >>> 24, l[F] = _, _ = 16843009 * c ^ 65537 * n ^ 257 * A ^ 16843008 * F, v[k] = _ << 24 | _ >>> 8, s[k] = _ << 16 | _ >>> 16, h[k] = _ << 8 | _ >>> 24, p2[k] = _, F ? (F = A ^ w[w[w[c ^ A]]], I ^= w[w[I]]) : F = I = 1;
        }
      })();
      var S = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], B = d2.AES = m.extend({ _doReset: r(function() {
        if (!this._nRounds || this._keyPriorReset !== this._key) {
          for (var w = this._keyPriorReset = this._key, P = w.words, F = w.sigBytes / 4, I = 4 * ((this._nRounds = F + 6) + 1), k = this._keySchedule = [], A = 0; A < I; A++) if (A < F) k[A] = P[A];
          else {
            var n = k[A - 1];
            A % F ? F > 6 && A % F == 4 && (n = t[n >>> 24] << 24 | t[n >>> 16 & 255] << 16 | t[n >>> 8 & 255] << 8 | t[255 & n]) : (n = t[(n = n << 8 | n >>> 24) >>> 24] << 24 | t[n >>> 16 & 255] << 16 | t[n >>> 8 & 255] << 8 | t[255 & n], n ^= S[A / F | 0] << 24), k[A] = k[A - F] ^ n;
          }
          for (var c = this._invKeySchedule = [], _ = 0; _ < I; _++) A = I - _, n = _ % 4 ? k[A] : k[A - 4], c[_] = _ < 4 || A <= 4 ? n : v[t[n >>> 24]] ^ s[t[n >>> 16 & 255]] ^ h[t[n >>> 8 & 255]] ^ p2[t[255 & n]];
        }
      }, "_doReset"), encryptBlock: r(function(w, P) {
        this._doCryptBlock(w, P, this._keySchedule, i, o, y, l, t);
      }, "encryptBlock"), decryptBlock: r(function(w, P) {
        var F = w[P + 1];
        w[P + 1] = w[P + 3], w[P + 3] = F, this._doCryptBlock(w, P, this._invKeySchedule, v, s, h, p2, g2), F = w[P + 1], w[P + 1] = w[P + 3], w[P + 3] = F;
      }, "decryptBlock"), _doCryptBlock: r(function(w, P, F, I, k, A, n, c) {
        for (var _ = this._nRounds, e = w[P] ^ F[0], a = w[P + 1] ^ F[1], E = w[P + 2] ^ F[2], O = w[P + 3] ^ F[3], T = 4, L = 1; L < _; L++) {
          var N = I[e >>> 24] ^ k[a >>> 16 & 255] ^ A[E >>> 8 & 255] ^ n[255 & O] ^ F[T++], U = I[a >>> 24] ^ k[E >>> 16 & 255] ^ A[O >>> 8 & 255] ^ n[255 & e] ^ F[T++], X = I[E >>> 24] ^ k[O >>> 16 & 255] ^ A[e >>> 8 & 255] ^ n[255 & a] ^ F[T++], Q = I[O >>> 24] ^ k[e >>> 16 & 255] ^ A[a >>> 8 & 255] ^ n[255 & E] ^ F[T++];
          e = N, a = U, E = X, O = Q;
        }
        N = (c[e >>> 24] << 24 | c[a >>> 16 & 255] << 16 | c[E >>> 8 & 255] << 8 | c[255 & O]) ^ F[T++], U = (c[a >>> 24] << 24 | c[E >>> 16 & 255] << 16 | c[O >>> 8 & 255] << 8 | c[255 & e]) ^ F[T++], X = (c[E >>> 24] << 24 | c[O >>> 16 & 255] << 16 | c[e >>> 8 & 255] << 8 | c[255 & a]) ^ F[T++], Q = (c[O >>> 24] << 24 | c[e >>> 16 & 255] << 16 | c[a >>> 8 & 255] << 8 | c[255 & E]) ^ F[T++], w[P] = N, w[P + 1] = U, w[P + 2] = X, w[P + 3] = Q;
      }, "_doCryptBlock"), keySize: 8 });
      u.AES = m._createHelper(B);
    })(), f.AES);
  }, 7165: function(C, j, b) {
    var f, u, m, d2, t, g2, i, o, y, l, v, s, h, p2, S, B, w, P, F;
    C.exports = (f = b(9021), b(9506), void (f.lib.Cipher || (u = f, m = u.lib, d2 = m.Base, t = m.WordArray, g2 = m.BufferedBlockAlgorithm, i = u.enc, i.Utf8, o = i.Base64, y = u.algo.EvpKDF, l = m.Cipher = g2.extend({ cfg: d2.extend(), createEncryptor: r(function(I, k) {
      return this.create(this._ENC_XFORM_MODE, I, k);
    }, "createEncryptor"), createDecryptor: r(function(I, k) {
      return this.create(this._DEC_XFORM_MODE, I, k);
    }, "createDecryptor"), init: r(function(I, k, A) {
      this.cfg = this.cfg.extend(A), this._xformMode = I, this._key = k, this.reset();
    }, "init"), reset: r(function() {
      g2.reset.call(this), this._doReset();
    }, "reset"), process: r(function(I) {
      return this._append(I), this._process();
    }, "process"), finalize: r(function(I) {
      return I && this._append(I), this._doFinalize();
    }, "finalize"), keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: (function() {
      function I(k) {
        return typeof k == "string" ? F : w;
      }
      return r(I, "t"), function(k) {
        return { encrypt: r(function(A, n, c) {
          return I(n).encrypt(k, A, n, c);
        }, "encrypt"), decrypt: r(function(A, n, c) {
          return I(n).decrypt(k, A, n, c);
        }, "decrypt") };
      };
    })() }), m.StreamCipher = l.extend({ _doFinalize: r(function() {
      return this._process(true);
    }, "_doFinalize"), blockSize: 1 }), v = u.mode = {}, s = m.BlockCipherMode = d2.extend({ createEncryptor: r(function(I, k) {
      return this.Encryptor.create(I, k);
    }, "createEncryptor"), createDecryptor: r(function(I, k) {
      return this.Decryptor.create(I, k);
    }, "createDecryptor"), init: r(function(I, k) {
      this._cipher = I, this._iv = k;
    }, "init") }), h = v.CBC = (function() {
      var I = s.extend();
      function k(A, n, c) {
        var _ = this._iv;
        if (_) {
          var e = _;
          this._iv = void 0;
        } else e = this._prevBlock;
        for (var a = 0; a < c; a++) A[n + a] ^= e[a];
      }
      return r(k, "e"), I.Encryptor = I.extend({ processBlock: r(function(A, n) {
        var c = this._cipher, _ = c.blockSize;
        k.call(this, A, n, _), c.encryptBlock(A, n), this._prevBlock = A.slice(n, n + _);
      }, "processBlock") }), I.Decryptor = I.extend({ processBlock: r(function(A, n) {
        var c = this._cipher, _ = c.blockSize, e = A.slice(n, n + _);
        c.decryptBlock(A, n), k.call(this, A, n, _), this._prevBlock = e;
      }, "processBlock") }), I;
    })(), p2 = (u.pad = {}).Pkcs7 = { pad: r(function(I, k) {
      for (var A = 4 * k, n = A - I.sigBytes % A, c = n << 24 | n << 16 | n << 8 | n, _ = [], e = 0; e < n; e += 4) _.push(c);
      var a = t.create(_, n);
      I.concat(a);
    }, "pad"), unpad: r(function(I) {
      var k = 255 & I.words[I.sigBytes - 1 >>> 2];
      I.sigBytes -= k;
    }, "unpad") }, m.BlockCipher = l.extend({ cfg: l.cfg.extend({ mode: h, padding: p2 }), reset: r(function() {
      l.reset.call(this);
      var I = this.cfg, k = I.iv, A = I.mode;
      if (this._xformMode == this._ENC_XFORM_MODE) var n = A.createEncryptor;
      else n = A.createDecryptor, this._minBufferSize = 1;
      this._mode && this._mode.__creator == n ? this._mode.init(this, k && k.words) : (this._mode = n.call(A, this, k && k.words), this._mode.__creator = n);
    }, "reset"), _doProcessBlock: r(function(I, k) {
      this._mode.processBlock(I, k);
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var I = this.cfg.padding;
      if (this._xformMode == this._ENC_XFORM_MODE) {
        I.pad(this._data, this.blockSize);
        var k = this._process(true);
      } else k = this._process(true), I.unpad(k);
      return k;
    }, "_doFinalize"), blockSize: 4 }), S = m.CipherParams = d2.extend({ init: r(function(I) {
      this.mixIn(I);
    }, "init"), toString: r(function(I) {
      return (I || this.formatter).stringify(this);
    }, "toString") }), B = (u.format = {}).OpenSSL = { stringify: r(function(I) {
      var k = I.ciphertext, A = I.salt;
      if (A) var n = t.create([1398893684, 1701076831]).concat(A).concat(k);
      else n = k;
      return n.toString(o);
    }, "stringify"), parse: r(function(I) {
      var k = o.parse(I), A = k.words;
      if (A[0] == 1398893684 && A[1] == 1701076831) {
        var n = t.create(A.slice(2, 4));
        A.splice(0, 4), k.sigBytes -= 16;
      }
      return S.create({ ciphertext: k, salt: n });
    }, "parse") }, w = m.SerializableCipher = d2.extend({ cfg: d2.extend({ format: B }), encrypt: r(function(I, k, A, n) {
      n = this.cfg.extend(n);
      var c = I.createEncryptor(A, n), _ = c.finalize(k), e = c.cfg;
      return S.create({ ciphertext: _, key: A, iv: e.iv, algorithm: I, mode: e.mode, padding: e.padding, blockSize: I.blockSize, formatter: n.format });
    }, "encrypt"), decrypt: r(function(I, k, A, n) {
      return n = this.cfg.extend(n), k = this._parse(k, n.format), I.createDecryptor(A, n).finalize(k.ciphertext);
    }, "decrypt"), _parse: r(function(I, k) {
      return typeof I == "string" ? k.parse(I, this) : I;
    }, "_parse") }), P = (u.kdf = {}).OpenSSL = { execute: r(function(I, k, A, n) {
      n || (n = t.random(8));
      var c = y.create({ keySize: k + A }).compute(I, n), _ = t.create(c.words.slice(k), 4 * A);
      return c.sigBytes = 4 * k, S.create({ key: c, iv: _, salt: n });
    }, "execute") }, F = m.PasswordBasedCipher = w.extend({ cfg: w.cfg.extend({ kdf: P }), encrypt: r(function(I, k, A, n) {
      var c = (n = this.cfg.extend(n)).kdf.execute(A, I.keySize, I.ivSize);
      n.iv = c.iv;
      var _ = w.encrypt.call(this, I, k, c.key, n);
      return _.mixIn(c), _;
    }, "encrypt"), decrypt: r(function(I, k, A, n) {
      n = this.cfg.extend(n), k = this._parse(k, n.format);
      var c = n.kdf.execute(A, I.keySize, I.ivSize, k.salt);
      return n.iv = c.iv, w.decrypt.call(this, I, k, c.key, n);
    }, "decrypt") }))));
  }, 9021: function(C, j) {
    var b;
    C.exports = (b = b || (function(f, u) {
      var m = Object.create || (function() {
        function p2() {
        }
        return r(p2, "t"), function(S) {
          var B;
          return p2.prototype = S, B = new p2(), p2.prototype = null, B;
        };
      })(), d2 = {}, t = d2.lib = {}, g2 = t.Base = { extend: r(function(p2) {
        var S = m(this);
        return p2 && S.mixIn(p2), S.hasOwnProperty("init") && this.init !== S.init || (S.init = function() {
          S.$super.init.apply(this, arguments);
        }), S.init.prototype = S, S.$super = this, S;
      }, "extend"), create: r(function() {
        var p2 = this.extend();
        return p2.init.apply(p2, arguments), p2;
      }, "create"), init: r(function() {
      }, "init"), mixIn: r(function(p2) {
        for (var S in p2) p2.hasOwnProperty(S) && (this[S] = p2[S]);
        p2.hasOwnProperty("toString") && (this.toString = p2.toString);
      }, "mixIn"), clone: r(function() {
        return this.init.prototype.extend(this);
      }, "clone") }, i = t.WordArray = g2.extend({ init: r(function(p2, S) {
        p2 = this.words = p2 || [], this.sigBytes = S ?? 4 * p2.length;
      }, "init"), toString: r(function(p2) {
        return (p2 || y).stringify(this);
      }, "toString"), concat: r(function(p2) {
        var S = this.words, B = p2.words, w = this.sigBytes, P = p2.sigBytes;
        if (this.clamp(), w % 4) for (var F = 0; F < P; F++) {
          var I = B[F >>> 2] >>> 24 - F % 4 * 8 & 255;
          S[w + F >>> 2] |= I << 24 - (w + F) % 4 * 8;
        }
        else for (F = 0; F < P; F += 4) S[w + F >>> 2] = B[F >>> 2];
        return this.sigBytes += P, this;
      }, "concat"), clamp: r(function() {
        var p2 = this.words, S = this.sigBytes;
        p2[S >>> 2] &= 4294967295 << 32 - S % 4 * 8, p2.length = f.ceil(S / 4);
      }, "clamp"), clone: r(function() {
        var p2 = g2.clone.call(this);
        return p2.words = this.words.slice(0), p2;
      }, "clone"), random: r(function(p2) {
        for (var S, B = [], w = function(I) {
          var k = 987654321, A = 4294967295;
          return function() {
            var n = ((k = 36969 * (65535 & k) + (k >> 16) & A) << 16) + (I = 18e3 * (65535 & I) + (I >> 16) & A) & A;
            return n /= 4294967296, (n += 0.5) * (f.random() > 0.5 ? 1 : -1);
          };
        }, P = 0; P < p2; P += 4) {
          var F = w(4294967296 * (S || f.random()));
          S = 987654071 * F(), B.push(4294967296 * F() | 0);
        }
        return new i.init(B, p2);
      }, "random") }), o = d2.enc = {}, y = o.Hex = { stringify: r(function(p2) {
        for (var S = p2.words, B = p2.sigBytes, w = [], P = 0; P < B; P++) {
          var F = S[P >>> 2] >>> 24 - P % 4 * 8 & 255;
          w.push((F >>> 4).toString(16)), w.push((15 & F).toString(16));
        }
        return w.join("");
      }, "stringify"), parse: r(function(p2) {
        for (var S = p2.length, B = [], w = 0; w < S; w += 2) B[w >>> 3] |= parseInt(p2.substr(w, 2), 16) << 24 - w % 8 * 4;
        return new i.init(B, S / 2);
      }, "parse") }, l = o.Latin1 = { stringify: r(function(p2) {
        for (var S = p2.words, B = p2.sigBytes, w = [], P = 0; P < B; P++) {
          var F = S[P >>> 2] >>> 24 - P % 4 * 8 & 255;
          w.push(String.fromCharCode(F));
        }
        return w.join("");
      }, "stringify"), parse: r(function(p2) {
        for (var S = p2.length, B = [], w = 0; w < S; w++) B[w >>> 2] |= (255 & p2.charCodeAt(w)) << 24 - w % 4 * 8;
        return new i.init(B, S);
      }, "parse") }, v = o.Utf8 = { stringify: r(function(p2) {
        try {
          return decodeURIComponent(escape(l.stringify(p2)));
        } catch {
          throw new Error("Malformed UTF-8 data");
        }
      }, "stringify"), parse: r(function(p2) {
        return l.parse(unescape(encodeURIComponent(p2)));
      }, "parse") }, s = t.BufferedBlockAlgorithm = g2.extend({ reset: r(function() {
        this._data = new i.init(), this._nDataBytes = 0;
      }, "reset"), _append: r(function(p2) {
        typeof p2 == "string" && (p2 = v.parse(p2)), this._data.concat(p2), this._nDataBytes += p2.sigBytes;
      }, "_append"), _process: r(function(p2) {
        var S = this._data, B = S.words, w = S.sigBytes, P = this.blockSize, F = w / (4 * P), I = (F = p2 ? f.ceil(F) : f.max((0 | F) - this._minBufferSize, 0)) * P, k = f.min(4 * I, w);
        if (I) {
          for (var A = 0; A < I; A += P) this._doProcessBlock(B, A);
          var n = B.splice(0, I);
          S.sigBytes -= k;
        }
        return new i.init(n, k);
      }, "_process"), clone: r(function() {
        var p2 = g2.clone.call(this);
        return p2._data = this._data.clone(), p2;
      }, "clone"), _minBufferSize: 0 }), h = (t.Hasher = s.extend({ cfg: g2.extend(), init: r(function(p2) {
        this.cfg = this.cfg.extend(p2), this.reset();
      }, "init"), reset: r(function() {
        s.reset.call(this), this._doReset();
      }, "reset"), update: r(function(p2) {
        return this._append(p2), this._process(), this;
      }, "update"), finalize: r(function(p2) {
        return p2 && this._append(p2), this._doFinalize();
      }, "finalize"), blockSize: 16, _createHelper: r(function(p2) {
        return function(S, B) {
          return new p2.init(B).finalize(S);
        };
      }, "_createHelper"), _createHmacHelper: r(function(p2) {
        return function(S, B) {
          return new h.HMAC.init(p2, B).finalize(S);
        };
      }, "_createHmacHelper") }), d2.algo = {});
      return d2;
    })(Math), b);
  }, 754: function(C, j, b) {
    var f, u, m;
    C.exports = (f = b(9021), m = (u = f).lib.WordArray, u.enc.Base64 = { stringify: r(function(d2) {
      var t = d2.words, g2 = d2.sigBytes, i = this._map;
      d2.clamp();
      for (var o = [], y = 0; y < g2; y += 3) for (var l = (t[y >>> 2] >>> 24 - y % 4 * 8 & 255) << 16 | (t[y + 1 >>> 2] >>> 24 - (y + 1) % 4 * 8 & 255) << 8 | t[y + 2 >>> 2] >>> 24 - (y + 2) % 4 * 8 & 255, v = 0; v < 4 && y + 0.75 * v < g2; v++) o.push(i.charAt(l >>> 6 * (3 - v) & 63));
      var s = i.charAt(64);
      if (s) for (; o.length % 4; ) o.push(s);
      return o.join("");
    }, "stringify"), parse: r(function(d2) {
      var t = d2.length, g2 = this._map, i = this._reverseMap;
      if (!i) {
        i = this._reverseMap = [];
        for (var o = 0; o < g2.length; o++) i[g2.charCodeAt(o)] = o;
      }
      var y = g2.charAt(64);
      if (y) {
        var l = d2.indexOf(y);
        l !== -1 && (t = l);
      }
      return (function(v, s, h) {
        for (var p2 = [], S = 0, B = 0; B < s; B++) if (B % 4) {
          var w = h[v.charCodeAt(B - 1)] << B % 4 * 2, P = h[v.charCodeAt(B)] >>> 6 - B % 4 * 2;
          p2[S >>> 2] |= (w | P) << 24 - S % 4 * 8, S++;
        }
        return m.create(p2, S);
      })(d2, t, i);
    }, "parse"), _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" }, f.enc.Base64);
  }, 5503: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), (function() {
      var u = f, m = u.lib.WordArray, d2 = u.enc;
      function t(g2) {
        return g2 << 8 & 4278255360 | g2 >>> 8 & 16711935;
      }
      r(t, "i"), d2.Utf16 = d2.Utf16BE = { stringify: r(function(g2) {
        for (var i = g2.words, o = g2.sigBytes, y = [], l = 0; l < o; l += 2) {
          var v = i[l >>> 2] >>> 16 - l % 4 * 8 & 65535;
          y.push(String.fromCharCode(v));
        }
        return y.join("");
      }, "stringify"), parse: r(function(g2) {
        for (var i = g2.length, o = [], y = 0; y < i; y++) o[y >>> 1] |= g2.charCodeAt(y) << 16 - y % 2 * 16;
        return m.create(o, 2 * i);
      }, "parse") }, d2.Utf16LE = { stringify: r(function(g2) {
        for (var i = g2.words, o = g2.sigBytes, y = [], l = 0; l < o; l += 2) {
          var v = t(i[l >>> 2] >>> 16 - l % 4 * 8 & 65535);
          y.push(String.fromCharCode(v));
        }
        return y.join("");
      }, "stringify"), parse: r(function(g2) {
        for (var i = g2.length, o = [], y = 0; y < i; y++) o[y >>> 1] |= t(g2.charCodeAt(y) << 16 - y % 2 * 16);
        return m.create(o, 2 * i);
      }, "parse") };
    })(), f.enc.Utf16);
  }, 9506: function(C, j, b) {
    var f, u, m, d2, t, g2, i, o;
    C.exports = (o = b(9021), b(5471), b(1025), m = (u = (f = o).lib).Base, d2 = u.WordArray, g2 = (t = f.algo).MD5, i = t.EvpKDF = m.extend({ cfg: m.extend({ keySize: 4, hasher: g2, iterations: 1 }), init: r(function(y) {
      this.cfg = this.cfg.extend(y);
    }, "init"), compute: r(function(y, l) {
      for (var v = this.cfg, s = v.hasher.create(), h = d2.create(), p2 = h.words, S = v.keySize, B = v.iterations; p2.length < S; ) {
        w && s.update(w);
        var w = s.update(y).finalize(l);
        s.reset();
        for (var P = 1; P < B; P++) w = s.finalize(w), s.reset();
        h.concat(w);
      }
      return h.sigBytes = 4 * S, h;
    }, "compute") }), f.EvpKDF = function(y, l, v) {
      return i.create(v).compute(y, l);
    }, o.EvpKDF);
  }, 25: function(C, j, b) {
    var f, u, m, d2;
    C.exports = (d2 = b(9021), b(7165), u = (f = d2).lib.CipherParams, m = f.enc.Hex, f.format.Hex = { stringify: r(function(t) {
      return t.ciphertext.toString(m);
    }, "stringify"), parse: r(function(t) {
      var g2 = m.parse(t);
      return u.create({ ciphertext: g2 });
    }, "parse") }, d2.format.Hex);
  }, 1025: function(C, j, b) {
    var f, u, m;
    C.exports = (u = (f = b(9021)).lib.Base, m = f.enc.Utf8, void (f.algo.HMAC = u.extend({ init: r(function(d2, t) {
      d2 = this._hasher = new d2.init(), typeof t == "string" && (t = m.parse(t));
      var g2 = d2.blockSize, i = 4 * g2;
      t.sigBytes > i && (t = d2.finalize(t)), t.clamp();
      for (var o = this._oKey = t.clone(), y = this._iKey = t.clone(), l = o.words, v = y.words, s = 0; s < g2; s++) l[s] ^= 1549556828, v[s] ^= 909522486;
      o.sigBytes = y.sigBytes = i, this.reset();
    }, "init"), reset: r(function() {
      var d2 = this._hasher;
      d2.reset(), d2.update(this._iKey);
    }, "reset"), update: r(function(d2) {
      return this._hasher.update(d2), this;
    }, "update"), finalize: r(function(d2) {
      var t = this._hasher, g2 = t.finalize(d2);
      return t.reset(), t.finalize(this._oKey.clone().concat(g2));
    }, "finalize") })));
  }, 1396: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(3240), b(6440), b(5503), b(754), b(4636), b(5471), b(3009), b(6308), b(1380), b(9557), b(5953), b(8056), b(1025), b(19), b(9506), b(7165), b(2169), b(6939), b(6372), b(3797), b(8454), b(2073), b(4905), b(482), b(2155), b(8124), b(25), b(955), b(7628), b(7193), b(6298), b(2696), f);
  }, 6440: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), (function() {
      if (typeof ArrayBuffer == "function") {
        var u = f.lib.WordArray, m = u.init, d2 = u.init = function(t) {
          if (t instanceof ArrayBuffer && (t = new Uint8Array(t)), (t instanceof Int8Array || typeof Uint8ClampedArray < "u" && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array) && (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength)), t instanceof Uint8Array) {
            for (var g2 = t.byteLength, i = [], o = 0; o < g2; o++) i[o >>> 2] |= t[o] << 24 - o % 4 * 8;
            m.call(this, i, g2);
          } else m.apply(this, arguments);
        };
        d2.prototype = u;
      }
    })(), f.lib.WordArray);
  }, 4636: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), (function(u) {
      var m = f, d2 = m.lib, t = d2.WordArray, g2 = d2.Hasher, i = m.algo, o = [];
      (function() {
        for (var p2 = 0; p2 < 64; p2++) o[p2] = 4294967296 * u.abs(u.sin(p2 + 1)) | 0;
      })();
      var y = i.MD5 = g2.extend({ _doReset: r(function() {
        this._hash = new t.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, "_doReset"), _doProcessBlock: r(function(p2, S) {
        for (var B = 0; B < 16; B++) {
          var w = S + B, P = p2[w];
          p2[w] = 16711935 & (P << 8 | P >>> 24) | 4278255360 & (P << 24 | P >>> 8);
        }
        var F = this._hash.words, I = p2[S + 0], k = p2[S + 1], A = p2[S + 2], n = p2[S + 3], c = p2[S + 4], _ = p2[S + 5], e = p2[S + 6], a = p2[S + 7], E = p2[S + 8], O = p2[S + 9], T = p2[S + 10], L = p2[S + 11], N = p2[S + 12], U = p2[S + 13], X = p2[S + 14], Q = p2[S + 15], W = F[0], J = F[1], V = F[2], z = F[3];
        W = l(W, J, V, z, I, 7, o[0]), z = l(z, W, J, V, k, 12, o[1]), V = l(V, z, W, J, A, 17, o[2]), J = l(J, V, z, W, n, 22, o[3]), W = l(W, J, V, z, c, 7, o[4]), z = l(z, W, J, V, _, 12, o[5]), V = l(V, z, W, J, e, 17, o[6]), J = l(J, V, z, W, a, 22, o[7]), W = l(W, J, V, z, E, 7, o[8]), z = l(z, W, J, V, O, 12, o[9]), V = l(V, z, W, J, T, 17, o[10]), J = l(J, V, z, W, L, 22, o[11]), W = l(W, J, V, z, N, 7, o[12]), z = l(z, W, J, V, U, 12, o[13]), V = l(V, z, W, J, X, 17, o[14]), W = v(W, J = l(J, V, z, W, Q, 22, o[15]), V, z, k, 5, o[16]), z = v(z, W, J, V, e, 9, o[17]), V = v(V, z, W, J, L, 14, o[18]), J = v(J, V, z, W, I, 20, o[19]), W = v(W, J, V, z, _, 5, o[20]), z = v(z, W, J, V, T, 9, o[21]), V = v(V, z, W, J, Q, 14, o[22]), J = v(J, V, z, W, c, 20, o[23]), W = v(W, J, V, z, O, 5, o[24]), z = v(z, W, J, V, X, 9, o[25]), V = v(V, z, W, J, n, 14, o[26]), J = v(J, V, z, W, E, 20, o[27]), W = v(W, J, V, z, U, 5, o[28]), z = v(z, W, J, V, A, 9, o[29]), V = v(V, z, W, J, a, 14, o[30]), W = s(W, J = v(J, V, z, W, N, 20, o[31]), V, z, _, 4, o[32]), z = s(z, W, J, V, E, 11, o[33]), V = s(V, z, W, J, L, 16, o[34]), J = s(J, V, z, W, X, 23, o[35]), W = s(W, J, V, z, k, 4, o[36]), z = s(z, W, J, V, c, 11, o[37]), V = s(V, z, W, J, a, 16, o[38]), J = s(J, V, z, W, T, 23, o[39]), W = s(W, J, V, z, U, 4, o[40]), z = s(z, W, J, V, I, 11, o[41]), V = s(V, z, W, J, n, 16, o[42]), J = s(J, V, z, W, e, 23, o[43]), W = s(W, J, V, z, O, 4, o[44]), z = s(z, W, J, V, N, 11, o[45]), V = s(V, z, W, J, Q, 16, o[46]), W = h(W, J = s(J, V, z, W, A, 23, o[47]), V, z, I, 6, o[48]), z = h(z, W, J, V, a, 10, o[49]), V = h(V, z, W, J, X, 15, o[50]), J = h(J, V, z, W, _, 21, o[51]), W = h(W, J, V, z, N, 6, o[52]), z = h(z, W, J, V, n, 10, o[53]), V = h(V, z, W, J, T, 15, o[54]), J = h(J, V, z, W, k, 21, o[55]), W = h(W, J, V, z, E, 6, o[56]), z = h(z, W, J, V, Q, 10, o[57]), V = h(V, z, W, J, e, 15, o[58]), J = h(J, V, z, W, U, 21, o[59]), W = h(W, J, V, z, c, 6, o[60]), z = h(z, W, J, V, L, 10, o[61]), V = h(V, z, W, J, A, 15, o[62]), J = h(J, V, z, W, O, 21, o[63]), F[0] = F[0] + W | 0, F[1] = F[1] + J | 0, F[2] = F[2] + V | 0, F[3] = F[3] + z | 0;
      }, "_doProcessBlock"), _doFinalize: r(function() {
        var p2 = this._data, S = p2.words, B = 8 * this._nDataBytes, w = 8 * p2.sigBytes;
        S[w >>> 5] |= 128 << 24 - w % 32;
        var P = u.floor(B / 4294967296), F = B;
        S[15 + (w + 64 >>> 9 << 4)] = 16711935 & (P << 8 | P >>> 24) | 4278255360 & (P << 24 | P >>> 8), S[14 + (w + 64 >>> 9 << 4)] = 16711935 & (F << 8 | F >>> 24) | 4278255360 & (F << 24 | F >>> 8), p2.sigBytes = 4 * (S.length + 1), this._process();
        for (var I = this._hash, k = I.words, A = 0; A < 4; A++) {
          var n = k[A];
          k[A] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8);
        }
        return I;
      }, "_doFinalize"), clone: r(function() {
        var p2 = g2.clone.call(this);
        return p2._hash = this._hash.clone(), p2;
      }, "clone") });
      function l(p2, S, B, w, P, F, I) {
        var k = p2 + (S & B | ~S & w) + P + I;
        return (k << F | k >>> 32 - F) + S;
      }
      r(l, "u");
      function v(p2, S, B, w, P, F, I) {
        var k = p2 + (S & w | B & ~w) + P + I;
        return (k << F | k >>> 32 - F) + S;
      }
      r(v, "c");
      function s(p2, S, B, w, P, F, I) {
        var k = p2 + (S ^ B ^ w) + P + I;
        return (k << F | k >>> 32 - F) + S;
      }
      r(s, "h");
      function h(p2, S, B, w, P, F, I) {
        var k = p2 + (B ^ (S | ~w)) + P + I;
        return (k << F | k >>> 32 - F) + S;
      }
      r(h, "p"), m.MD5 = g2._createHelper(y), m.HmacMD5 = g2._createHmacHelper(y);
    })(Math), f.MD5);
  }, 2169: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.mode.CFB = (function() {
      var u = f.lib.BlockCipherMode.extend();
      function m(d2, t, g2, i) {
        var o = this._iv;
        if (o) {
          var y = o.slice(0);
          this._iv = void 0;
        } else y = this._prevBlock;
        i.encryptBlock(y, 0);
        for (var l = 0; l < g2; l++) d2[t + l] ^= y[l];
      }
      return r(m, "e"), u.Encryptor = u.extend({ processBlock: r(function(d2, t) {
        var g2 = this._cipher, i = g2.blockSize;
        m.call(this, d2, t, i, g2), this._prevBlock = d2.slice(t, t + i);
      }, "processBlock") }), u.Decryptor = u.extend({ processBlock: r(function(d2, t) {
        var g2 = this._cipher, i = g2.blockSize, o = d2.slice(t, t + i);
        m.call(this, d2, t, i, g2), this._prevBlock = o;
      }, "processBlock") }), u;
    })(), f.mode.CFB);
  }, 6372: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.mode.CTRGladman = (function() {
      var u = f.lib.BlockCipherMode.extend();
      function m(t) {
        if (255 & ~(t >> 24)) t += 16777216;
        else {
          var g2 = t >> 16 & 255, i = t >> 8 & 255, o = 255 & t;
          g2 === 255 ? (g2 = 0, i === 255 ? (i = 0, o === 255 ? o = 0 : ++o) : ++i) : ++g2, t = 0, t += g2 << 16, t += i << 8, t += o;
        }
        return t;
      }
      r(m, "e");
      var d2 = u.Encryptor = u.extend({ processBlock: r(function(t, g2) {
        var i = this._cipher, o = i.blockSize, y = this._iv, l = this._counter;
        y && (l = this._counter = y.slice(0), this._iv = void 0), (function(h) {
          (h[0] = m(h[0])) === 0 && (h[1] = m(h[1]));
        })(l);
        var v = l.slice(0);
        i.encryptBlock(v, 0);
        for (var s = 0; s < o; s++) t[g2 + s] ^= v[s];
      }, "processBlock") });
      return u.Decryptor = d2, u;
    })(), f.mode.CTRGladman);
  }, 6939: function(C, j, b) {
    var f, u, m;
    C.exports = (m = b(9021), b(7165), m.mode.CTR = (u = (f = m.lib.BlockCipherMode.extend()).Encryptor = f.extend({ processBlock: r(function(d2, t) {
      var g2 = this._cipher, i = g2.blockSize, o = this._iv, y = this._counter;
      o && (y = this._counter = o.slice(0), this._iv = void 0);
      var l = y.slice(0);
      g2.encryptBlock(l, 0), y[i - 1] = y[i - 1] + 1 | 0;
      for (var v = 0; v < i; v++) d2[t + v] ^= l[v];
    }, "processBlock") }), f.Decryptor = u, f), m.mode.CTR);
  }, 8454: function(C, j, b) {
    var f, u;
    C.exports = (u = b(9021), b(7165), u.mode.ECB = ((f = u.lib.BlockCipherMode.extend()).Encryptor = f.extend({ processBlock: r(function(m, d2) {
      this._cipher.encryptBlock(m, d2);
    }, "processBlock") }), f.Decryptor = f.extend({ processBlock: r(function(m, d2) {
      this._cipher.decryptBlock(m, d2);
    }, "processBlock") }), f), u.mode.ECB);
  }, 3797: function(C, j, b) {
    var f, u, m;
    C.exports = (m = b(9021), b(7165), m.mode.OFB = (u = (f = m.lib.BlockCipherMode.extend()).Encryptor = f.extend({ processBlock: r(function(d2, t) {
      var g2 = this._cipher, i = g2.blockSize, o = this._iv, y = this._keystream;
      o && (y = this._keystream = o.slice(0), this._iv = void 0), g2.encryptBlock(y, 0);
      for (var l = 0; l < i; l++) d2[t + l] ^= y[l];
    }, "processBlock") }), f.Decryptor = u, f), m.mode.OFB);
  }, 2073: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.pad.AnsiX923 = { pad: r(function(u, m) {
      var d2 = u.sigBytes, t = 4 * m, g2 = t - d2 % t, i = d2 + g2 - 1;
      u.clamp(), u.words[i >>> 2] |= g2 << 24 - i % 4 * 8, u.sigBytes += g2;
    }, "pad"), unpad: r(function(u) {
      var m = 255 & u.words[u.sigBytes - 1 >>> 2];
      u.sigBytes -= m;
    }, "unpad") }, f.pad.Ansix923);
  }, 4905: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.pad.Iso10126 = { pad: r(function(u, m) {
      var d2 = 4 * m, t = d2 - u.sigBytes % d2;
      u.concat(f.lib.WordArray.random(t - 1)).concat(f.lib.WordArray.create([t << 24], 1));
    }, "pad"), unpad: r(function(u) {
      var m = 255 & u.words[u.sigBytes - 1 >>> 2];
      u.sigBytes -= m;
    }, "unpad") }, f.pad.Iso10126);
  }, 482: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.pad.Iso97971 = { pad: r(function(u, m) {
      u.concat(f.lib.WordArray.create([2147483648], 1)), f.pad.ZeroPadding.pad(u, m);
    }, "pad"), unpad: r(function(u) {
      f.pad.ZeroPadding.unpad(u), u.sigBytes--;
    }, "unpad") }, f.pad.Iso97971);
  }, 8124: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.pad.NoPadding = { pad: r(function() {
    }, "pad"), unpad: r(function() {
    }, "unpad") }, f.pad.NoPadding);
  }, 2155: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(7165), f.pad.ZeroPadding = { pad: r(function(u, m) {
      var d2 = 4 * m;
      u.clamp(), u.sigBytes += d2 - (u.sigBytes % d2 || d2);
    }, "pad"), unpad: r(function(u) {
      for (var m = u.words, d2 = u.sigBytes - 1; !(m[d2 >>> 2] >>> 24 - d2 % 4 * 8 & 255); ) d2--;
      u.sigBytes = d2 + 1;
    }, "unpad") }, f.pad.ZeroPadding);
  }, 19: function(C, j, b) {
    var f, u, m, d2, t, g2, i, o, y;
    C.exports = (y = b(9021), b(5471), b(1025), m = (u = (f = y).lib).Base, d2 = u.WordArray, g2 = (t = f.algo).SHA1, i = t.HMAC, o = t.PBKDF2 = m.extend({ cfg: m.extend({ keySize: 4, hasher: g2, iterations: 1 }), init: r(function(l) {
      this.cfg = this.cfg.extend(l);
    }, "init"), compute: r(function(l, v) {
      for (var s = this.cfg, h = i.create(s.hasher, l), p2 = d2.create(), S = d2.create([1]), B = p2.words, w = S.words, P = s.keySize, F = s.iterations; B.length < P; ) {
        var I = h.update(v).finalize(S);
        h.reset();
        for (var k = I.words, A = k.length, n = I, c = 1; c < F; c++) {
          n = h.finalize(n), h.reset();
          for (var _ = n.words, e = 0; e < A; e++) k[e] ^= _[e];
        }
        p2.concat(I), w[0]++;
      }
      return p2.sigBytes = 4 * P, p2;
    }, "compute") }), f.PBKDF2 = function(l, v, s) {
      return o.create(s).compute(l, v);
    }, y.PBKDF2);
  }, 2696: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(754), b(4636), b(9506), b(7165), (function() {
      var u = f, m = u.lib.StreamCipher, d2 = u.algo, t = [], g2 = [], i = [], o = d2.RabbitLegacy = m.extend({ _doReset: r(function() {
        var l = this._key.words, v = this.cfg.iv, s = this._X = [l[0], l[3] << 16 | l[2] >>> 16, l[1], l[0] << 16 | l[3] >>> 16, l[2], l[1] << 16 | l[0] >>> 16, l[3], l[2] << 16 | l[1] >>> 16], h = this._C = [l[2] << 16 | l[2] >>> 16, 4294901760 & l[0] | 65535 & l[1], l[3] << 16 | l[3] >>> 16, 4294901760 & l[1] | 65535 & l[2], l[0] << 16 | l[0] >>> 16, 4294901760 & l[2] | 65535 & l[3], l[1] << 16 | l[1] >>> 16, 4294901760 & l[3] | 65535 & l[0]];
        this._b = 0;
        for (var p2 = 0; p2 < 4; p2++) y.call(this);
        for (p2 = 0; p2 < 8; p2++) h[p2] ^= s[p2 + 4 & 7];
        if (v) {
          var S = v.words, B = S[0], w = S[1], P = 16711935 & (B << 8 | B >>> 24) | 4278255360 & (B << 24 | B >>> 8), F = 16711935 & (w << 8 | w >>> 24) | 4278255360 & (w << 24 | w >>> 8), I = P >>> 16 | 4294901760 & F, k = F << 16 | 65535 & P;
          for (h[0] ^= P, h[1] ^= I, h[2] ^= F, h[3] ^= k, h[4] ^= P, h[5] ^= I, h[6] ^= F, h[7] ^= k, p2 = 0; p2 < 4; p2++) y.call(this);
        }
      }, "_doReset"), _doProcessBlock: r(function(l, v) {
        var s = this._X;
        y.call(this), t[0] = s[0] ^ s[5] >>> 16 ^ s[3] << 16, t[1] = s[2] ^ s[7] >>> 16 ^ s[5] << 16, t[2] = s[4] ^ s[1] >>> 16 ^ s[7] << 16, t[3] = s[6] ^ s[3] >>> 16 ^ s[1] << 16;
        for (var h = 0; h < 4; h++) t[h] = 16711935 & (t[h] << 8 | t[h] >>> 24) | 4278255360 & (t[h] << 24 | t[h] >>> 8), l[v + h] ^= t[h];
      }, "_doProcessBlock"), blockSize: 4, ivSize: 2 });
      function y() {
        for (var l = this._X, v = this._C, s = 0; s < 8; s++) g2[s] = v[s];
        for (v[0] = v[0] + 1295307597 + this._b | 0, v[1] = v[1] + 3545052371 + (v[0] >>> 0 < g2[0] >>> 0 ? 1 : 0) | 0, v[2] = v[2] + 886263092 + (v[1] >>> 0 < g2[1] >>> 0 ? 1 : 0) | 0, v[3] = v[3] + 1295307597 + (v[2] >>> 0 < g2[2] >>> 0 ? 1 : 0) | 0, v[4] = v[4] + 3545052371 + (v[3] >>> 0 < g2[3] >>> 0 ? 1 : 0) | 0, v[5] = v[5] + 886263092 + (v[4] >>> 0 < g2[4] >>> 0 ? 1 : 0) | 0, v[6] = v[6] + 1295307597 + (v[5] >>> 0 < g2[5] >>> 0 ? 1 : 0) | 0, v[7] = v[7] + 3545052371 + (v[6] >>> 0 < g2[6] >>> 0 ? 1 : 0) | 0, this._b = v[7] >>> 0 < g2[7] >>> 0 ? 1 : 0, s = 0; s < 8; s++) {
          var h = l[s] + v[s], p2 = 65535 & h, S = h >>> 16, B = ((p2 * p2 >>> 17) + p2 * S >>> 15) + S * S, w = ((4294901760 & h) * h | 0) + ((65535 & h) * h | 0);
          i[s] = B ^ w;
        }
        l[0] = i[0] + (i[7] << 16 | i[7] >>> 16) + (i[6] << 16 | i[6] >>> 16) | 0, l[1] = i[1] + (i[0] << 8 | i[0] >>> 24) + i[7] | 0, l[2] = i[2] + (i[1] << 16 | i[1] >>> 16) + (i[0] << 16 | i[0] >>> 16) | 0, l[3] = i[3] + (i[2] << 8 | i[2] >>> 24) + i[1] | 0, l[4] = i[4] + (i[3] << 16 | i[3] >>> 16) + (i[2] << 16 | i[2] >>> 16) | 0, l[5] = i[5] + (i[4] << 8 | i[4] >>> 24) + i[3] | 0, l[6] = i[6] + (i[5] << 16 | i[5] >>> 16) + (i[4] << 16 | i[4] >>> 16) | 0, l[7] = i[7] + (i[6] << 8 | i[6] >>> 24) + i[5] | 0;
      }
      r(y, "f"), u.RabbitLegacy = m._createHelper(o);
    })(), f.RabbitLegacy);
  }, 6298: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(754), b(4636), b(9506), b(7165), (function() {
      var u = f, m = u.lib.StreamCipher, d2 = u.algo, t = [], g2 = [], i = [], o = d2.Rabbit = m.extend({ _doReset: r(function() {
        for (var l = this._key.words, v = this.cfg.iv, s = 0; s < 4; s++) l[s] = 16711935 & (l[s] << 8 | l[s] >>> 24) | 4278255360 & (l[s] << 24 | l[s] >>> 8);
        var h = this._X = [l[0], l[3] << 16 | l[2] >>> 16, l[1], l[0] << 16 | l[3] >>> 16, l[2], l[1] << 16 | l[0] >>> 16, l[3], l[2] << 16 | l[1] >>> 16], p2 = this._C = [l[2] << 16 | l[2] >>> 16, 4294901760 & l[0] | 65535 & l[1], l[3] << 16 | l[3] >>> 16, 4294901760 & l[1] | 65535 & l[2], l[0] << 16 | l[0] >>> 16, 4294901760 & l[2] | 65535 & l[3], l[1] << 16 | l[1] >>> 16, 4294901760 & l[3] | 65535 & l[0]];
        for (this._b = 0, s = 0; s < 4; s++) y.call(this);
        for (s = 0; s < 8; s++) p2[s] ^= h[s + 4 & 7];
        if (v) {
          var S = v.words, B = S[0], w = S[1], P = 16711935 & (B << 8 | B >>> 24) | 4278255360 & (B << 24 | B >>> 8), F = 16711935 & (w << 8 | w >>> 24) | 4278255360 & (w << 24 | w >>> 8), I = P >>> 16 | 4294901760 & F, k = F << 16 | 65535 & P;
          for (p2[0] ^= P, p2[1] ^= I, p2[2] ^= F, p2[3] ^= k, p2[4] ^= P, p2[5] ^= I, p2[6] ^= F, p2[7] ^= k, s = 0; s < 4; s++) y.call(this);
        }
      }, "_doReset"), _doProcessBlock: r(function(l, v) {
        var s = this._X;
        y.call(this), t[0] = s[0] ^ s[5] >>> 16 ^ s[3] << 16, t[1] = s[2] ^ s[7] >>> 16 ^ s[5] << 16, t[2] = s[4] ^ s[1] >>> 16 ^ s[7] << 16, t[3] = s[6] ^ s[3] >>> 16 ^ s[1] << 16;
        for (var h = 0; h < 4; h++) t[h] = 16711935 & (t[h] << 8 | t[h] >>> 24) | 4278255360 & (t[h] << 24 | t[h] >>> 8), l[v + h] ^= t[h];
      }, "_doProcessBlock"), blockSize: 4, ivSize: 2 });
      function y() {
        for (var l = this._X, v = this._C, s = 0; s < 8; s++) g2[s] = v[s];
        for (v[0] = v[0] + 1295307597 + this._b | 0, v[1] = v[1] + 3545052371 + (v[0] >>> 0 < g2[0] >>> 0 ? 1 : 0) | 0, v[2] = v[2] + 886263092 + (v[1] >>> 0 < g2[1] >>> 0 ? 1 : 0) | 0, v[3] = v[3] + 1295307597 + (v[2] >>> 0 < g2[2] >>> 0 ? 1 : 0) | 0, v[4] = v[4] + 3545052371 + (v[3] >>> 0 < g2[3] >>> 0 ? 1 : 0) | 0, v[5] = v[5] + 886263092 + (v[4] >>> 0 < g2[4] >>> 0 ? 1 : 0) | 0, v[6] = v[6] + 1295307597 + (v[5] >>> 0 < g2[5] >>> 0 ? 1 : 0) | 0, v[7] = v[7] + 3545052371 + (v[6] >>> 0 < g2[6] >>> 0 ? 1 : 0) | 0, this._b = v[7] >>> 0 < g2[7] >>> 0 ? 1 : 0, s = 0; s < 8; s++) {
          var h = l[s] + v[s], p2 = 65535 & h, S = h >>> 16, B = ((p2 * p2 >>> 17) + p2 * S >>> 15) + S * S, w = ((4294901760 & h) * h | 0) + ((65535 & h) * h | 0);
          i[s] = B ^ w;
        }
        l[0] = i[0] + (i[7] << 16 | i[7] >>> 16) + (i[6] << 16 | i[6] >>> 16) | 0, l[1] = i[1] + (i[0] << 8 | i[0] >>> 24) + i[7] | 0, l[2] = i[2] + (i[1] << 16 | i[1] >>> 16) + (i[0] << 16 | i[0] >>> 16) | 0, l[3] = i[3] + (i[2] << 8 | i[2] >>> 24) + i[1] | 0, l[4] = i[4] + (i[3] << 16 | i[3] >>> 16) + (i[2] << 16 | i[2] >>> 16) | 0, l[5] = i[5] + (i[4] << 8 | i[4] >>> 24) + i[3] | 0, l[6] = i[6] + (i[5] << 16 | i[5] >>> 16) + (i[4] << 16 | i[4] >>> 16) | 0, l[7] = i[7] + (i[6] << 8 | i[6] >>> 24) + i[5] | 0;
      }
      r(y, "f"), u.Rabbit = m._createHelper(o);
    })(), f.Rabbit);
  }, 7193: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(754), b(4636), b(9506), b(7165), (function() {
      var u = f, m = u.lib.StreamCipher, d2 = u.algo, t = d2.RC4 = m.extend({ _doReset: r(function() {
        for (var o = this._key, y = o.words, l = o.sigBytes, v = this._S = [], s = 0; s < 256; s++) v[s] = s;
        s = 0;
        for (var h = 0; s < 256; s++) {
          var p2 = s % l, S = y[p2 >>> 2] >>> 24 - p2 % 4 * 8 & 255;
          h = (h + v[s] + S) % 256;
          var B = v[s];
          v[s] = v[h], v[h] = B;
        }
        this._i = this._j = 0;
      }, "_doReset"), _doProcessBlock: r(function(o, y) {
        o[y] ^= g2.call(this);
      }, "_doProcessBlock"), keySize: 8, ivSize: 0 });
      function g2() {
        for (var o = this._S, y = this._i, l = this._j, v = 0, s = 0; s < 4; s++) {
          l = (l + o[y = (y + 1) % 256]) % 256;
          var h = o[y];
          o[y] = o[l], o[l] = h, v |= o[(o[y] + o[l]) % 256] << 24 - 8 * s;
        }
        return this._i = y, this._j = l, v;
      }
      r(g2, "o"), u.RC4 = m._createHelper(t);
      var i = d2.RC4Drop = t.extend({ cfg: t.cfg.extend({ drop: 192 }), _doReset: r(function() {
        t._doReset.call(this);
        for (var o = this.cfg.drop; o > 0; o--) g2.call(this);
      }, "_doReset") });
      u.RC4Drop = m._createHelper(i);
    })(), f.RC4);
  }, 8056: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), (function(u) {
      var m = f, d2 = m.lib, t = d2.WordArray, g2 = d2.Hasher, i = m.algo, o = t.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), y = t.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), l = t.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]), v = t.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), s = t.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), h = t.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), p2 = i.RIPEMD160 = g2.extend({ _doReset: r(function() {
        this._hash = t.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      }, "_doReset"), _doProcessBlock: r(function(k, A) {
        for (var n = 0; n < 16; n++) {
          var c = A + n, _ = k[c];
          k[c] = 16711935 & (_ << 8 | _ >>> 24) | 4278255360 & (_ << 24 | _ >>> 8);
        }
        var e, a, E, O, T, L, N, U, X, Q, W, J = this._hash.words, V = s.words, z = h.words, D = o.words, x = y.words, R = l.words, K = v.words;
        for (L = e = J[0], N = a = J[1], U = E = J[2], X = O = J[3], Q = T = J[4], n = 0; n < 80; n += 1) W = e + k[A + D[n]] | 0, W += n < 16 ? S(a, E, O) + V[0] : n < 32 ? B(a, E, O) + V[1] : n < 48 ? w(a, E, O) + V[2] : n < 64 ? P(a, E, O) + V[3] : F(a, E, O) + V[4], W = (W = I(W |= 0, R[n])) + T | 0, e = T, T = O, O = I(E, 10), E = a, a = W, W = L + k[A + x[n]] | 0, W += n < 16 ? F(N, U, X) + z[0] : n < 32 ? P(N, U, X) + z[1] : n < 48 ? w(N, U, X) + z[2] : n < 64 ? B(N, U, X) + z[3] : S(N, U, X) + z[4], W = (W = I(W |= 0, K[n])) + Q | 0, L = Q, Q = X, X = I(U, 10), U = N, N = W;
        W = J[1] + E + X | 0, J[1] = J[2] + O + Q | 0, J[2] = J[3] + T + L | 0, J[3] = J[4] + e + N | 0, J[4] = J[0] + a + U | 0, J[0] = W;
      }, "_doProcessBlock"), _doFinalize: r(function() {
        var k = this._data, A = k.words, n = 8 * this._nDataBytes, c = 8 * k.sigBytes;
        A[c >>> 5] |= 128 << 24 - c % 32, A[14 + (c + 64 >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8), k.sigBytes = 4 * (A.length + 1), this._process();
        for (var _ = this._hash, e = _.words, a = 0; a < 5; a++) {
          var E = e[a];
          e[a] = 16711935 & (E << 8 | E >>> 24) | 4278255360 & (E << 24 | E >>> 8);
        }
        return _;
      }, "_doFinalize"), clone: r(function() {
        var k = g2.clone.call(this);
        return k._hash = this._hash.clone(), k;
      }, "clone") });
      function S(k, A, n) {
        return k ^ A ^ n;
      }
      r(S, "y");
      function B(k, A, n) {
        return k & A | ~k & n;
      }
      r(B, "g");
      function w(k, A, n) {
        return (k | ~A) ^ n;
      }
      r(w, "d");
      function P(k, A, n) {
        return k & n | A & ~n;
      }
      r(P, "v");
      function F(k, A, n) {
        return k ^ (A | ~n);
      }
      r(F, "m");
      function I(k, A) {
        return k << A | k >>> 32 - A;
      }
      r(I, "S"), m.RIPEMD160 = g2._createHelper(p2), m.HmacRIPEMD160 = g2._createHmacHelper(p2);
    })(Math), f.RIPEMD160);
  }, 5471: function(C, j, b) {
    var f, u, m, d2, t, g2, i, o;
    C.exports = (u = (f = o = b(9021)).lib, m = u.WordArray, d2 = u.Hasher, t = f.algo, g2 = [], i = t.SHA1 = d2.extend({ _doReset: r(function() {
      this._hash = new m.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
    }, "_doReset"), _doProcessBlock: r(function(y, l) {
      for (var v = this._hash.words, s = v[0], h = v[1], p2 = v[2], S = v[3], B = v[4], w = 0; w < 80; w++) {
        if (w < 16) g2[w] = 0 | y[l + w];
        else {
          var P = g2[w - 3] ^ g2[w - 8] ^ g2[w - 14] ^ g2[w - 16];
          g2[w] = P << 1 | P >>> 31;
        }
        var F = (s << 5 | s >>> 27) + B + g2[w];
        F += w < 20 ? 1518500249 + (h & p2 | ~h & S) : w < 40 ? 1859775393 + (h ^ p2 ^ S) : w < 60 ? (h & p2 | h & S | p2 & S) - 1894007588 : (h ^ p2 ^ S) - 899497514, B = S, S = p2, p2 = h << 30 | h >>> 2, h = s, s = F;
      }
      v[0] = v[0] + s | 0, v[1] = v[1] + h | 0, v[2] = v[2] + p2 | 0, v[3] = v[3] + S | 0, v[4] = v[4] + B | 0;
    }, "_doProcessBlock"), _doFinalize: r(function() {
      var y = this._data, l = y.words, v = 8 * this._nDataBytes, s = 8 * y.sigBytes;
      return l[s >>> 5] |= 128 << 24 - s % 32, l[14 + (s + 64 >>> 9 << 4)] = Math.floor(v / 4294967296), l[15 + (s + 64 >>> 9 << 4)] = v, y.sigBytes = 4 * l.length, this._process(), this._hash;
    }, "_doFinalize"), clone: r(function() {
      var y = d2.clone.call(this);
      return y._hash = this._hash.clone(), y;
    }, "clone") }), f.SHA1 = d2._createHelper(i), f.HmacSHA1 = d2._createHmacHelper(i), o.SHA1);
  }, 6308: function(C, j, b) {
    var f, u, m, d2, t, g2;
    C.exports = (g2 = b(9021), b(3009), u = (f = g2).lib.WordArray, m = f.algo, d2 = m.SHA256, t = m.SHA224 = d2.extend({ _doReset: r(function() {
      this._hash = new u.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
    }, "_doReset"), _doFinalize: r(function() {
      var i = d2._doFinalize.call(this);
      return i.sigBytes -= 4, i;
    }, "_doFinalize") }), f.SHA224 = d2._createHelper(t), f.HmacSHA224 = d2._createHmacHelper(t), g2.SHA224);
  }, 3009: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), (function(u) {
      var m = f, d2 = m.lib, t = d2.WordArray, g2 = d2.Hasher, i = m.algo, o = [], y = [];
      (function() {
        function s(B) {
          for (var w = u.sqrt(B), P = 2; P <= w; P++) if (!(B % P)) return false;
          return true;
        }
        r(s, "e");
        function h(B) {
          return 4294967296 * (B - (0 | B)) | 0;
        }
        r(h, "r");
        for (var p2 = 2, S = 0; S < 64; ) s(p2) && (S < 8 && (o[S] = h(u.pow(p2, 0.5))), y[S] = h(u.pow(p2, 0.3333333333333333)), S++), p2++;
      })();
      var l = [], v = i.SHA256 = g2.extend({ _doReset: r(function() {
        this._hash = new t.init(o.slice(0));
      }, "_doReset"), _doProcessBlock: r(function(s, h) {
        for (var p2 = this._hash.words, S = p2[0], B = p2[1], w = p2[2], P = p2[3], F = p2[4], I = p2[5], k = p2[6], A = p2[7], n = 0; n < 64; n++) {
          if (n < 16) l[n] = 0 | s[h + n];
          else {
            var c = l[n - 15], _ = (c << 25 | c >>> 7) ^ (c << 14 | c >>> 18) ^ c >>> 3, e = l[n - 2], a = (e << 15 | e >>> 17) ^ (e << 13 | e >>> 19) ^ e >>> 10;
            l[n] = _ + l[n - 7] + a + l[n - 16];
          }
          var E = S & B ^ S & w ^ B & w, O = (S << 30 | S >>> 2) ^ (S << 19 | S >>> 13) ^ (S << 10 | S >>> 22), T = A + ((F << 26 | F >>> 6) ^ (F << 21 | F >>> 11) ^ (F << 7 | F >>> 25)) + (F & I ^ ~F & k) + y[n] + l[n];
          A = k, k = I, I = F, F = P + T | 0, P = w, w = B, B = S, S = T + (O + E) | 0;
        }
        p2[0] = p2[0] + S | 0, p2[1] = p2[1] + B | 0, p2[2] = p2[2] + w | 0, p2[3] = p2[3] + P | 0, p2[4] = p2[4] + F | 0, p2[5] = p2[5] + I | 0, p2[6] = p2[6] + k | 0, p2[7] = p2[7] + A | 0;
      }, "_doProcessBlock"), _doFinalize: r(function() {
        var s = this._data, h = s.words, p2 = 8 * this._nDataBytes, S = 8 * s.sigBytes;
        return h[S >>> 5] |= 128 << 24 - S % 32, h[14 + (S + 64 >>> 9 << 4)] = u.floor(p2 / 4294967296), h[15 + (S + 64 >>> 9 << 4)] = p2, s.sigBytes = 4 * h.length, this._process(), this._hash;
      }, "_doFinalize"), clone: r(function() {
        var s = g2.clone.call(this);
        return s._hash = this._hash.clone(), s;
      }, "clone") });
      m.SHA256 = g2._createHelper(v), m.HmacSHA256 = g2._createHmacHelper(v);
    })(Math), f.SHA256);
  }, 5953: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(3240), (function(u) {
      var m = f, d2 = m.lib, t = d2.WordArray, g2 = d2.Hasher, i = m.x64.Word, o = m.algo, y = [], l = [], v = [];
      (function() {
        for (var p2 = 1, S = 0, B = 0; B < 24; B++) {
          y[p2 + 5 * S] = (B + 1) * (B + 2) / 2 % 64;
          var w = (2 * p2 + 3 * S) % 5;
          p2 = S % 5, S = w;
        }
        for (p2 = 0; p2 < 5; p2++) for (S = 0; S < 5; S++) l[p2 + 5 * S] = S + (2 * p2 + 3 * S) % 5 * 5;
        for (var P = 1, F = 0; F < 24; F++) {
          for (var I = 0, k = 0, A = 0; A < 7; A++) {
            if (1 & P) {
              var n = (1 << A) - 1;
              n < 32 ? k ^= 1 << n : I ^= 1 << n - 32;
            }
            128 & P ? P = P << 1 ^ 113 : P <<= 1;
          }
          v[F] = i.create(I, k);
        }
      })();
      var s = [];
      (function() {
        for (var p2 = 0; p2 < 25; p2++) s[p2] = i.create();
      })();
      var h = o.SHA3 = g2.extend({ cfg: g2.cfg.extend({ outputLength: 512 }), _doReset: r(function() {
        for (var p2 = this._state = [], S = 0; S < 25; S++) p2[S] = new i.init();
        this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
      }, "_doReset"), _doProcessBlock: r(function(p2, S) {
        for (var B = this._state, w = this.blockSize / 2, P = 0; P < w; P++) {
          var F = p2[S + 2 * P], I = p2[S + 2 * P + 1];
          F = 16711935 & (F << 8 | F >>> 24) | 4278255360 & (F << 24 | F >>> 8), I = 16711935 & (I << 8 | I >>> 24) | 4278255360 & (I << 24 | I >>> 8), (V = B[P]).high ^= I, V.low ^= F;
        }
        for (var k = 0; k < 24; k++) {
          for (var A = 0; A < 5; A++) {
            for (var n = 0, c = 0, _ = 0; _ < 5; _++) n ^= (V = B[A + 5 * _]).high, c ^= V.low;
            var e = s[A];
            e.high = n, e.low = c;
          }
          for (A = 0; A < 5; A++) {
            var a = s[(A + 4) % 5], E = s[(A + 1) % 5], O = E.high, T = E.low;
            for (n = a.high ^ (O << 1 | T >>> 31), c = a.low ^ (T << 1 | O >>> 31), _ = 0; _ < 5; _++) (V = B[A + 5 * _]).high ^= n, V.low ^= c;
          }
          for (var L = 1; L < 25; L++) {
            var N = (V = B[L]).high, U = V.low, X = y[L];
            X < 32 ? (n = N << X | U >>> 32 - X, c = U << X | N >>> 32 - X) : (n = U << X - 32 | N >>> 64 - X, c = N << X - 32 | U >>> 64 - X);
            var Q = s[l[L]];
            Q.high = n, Q.low = c;
          }
          var W = s[0], J = B[0];
          for (W.high = J.high, W.low = J.low, A = 0; A < 5; A++) for (_ = 0; _ < 5; _++) {
            var V = B[L = A + 5 * _], z = s[L], D = s[(A + 1) % 5 + 5 * _], x = s[(A + 2) % 5 + 5 * _];
            V.high = z.high ^ ~D.high & x.high, V.low = z.low ^ ~D.low & x.low;
          }
          V = B[0];
          var R = v[k];
          V.high ^= R.high, V.low ^= R.low;
        }
      }, "_doProcessBlock"), _doFinalize: r(function() {
        var p2 = this._data, S = p2.words, B = (this._nDataBytes, 8 * p2.sigBytes), w = 32 * this.blockSize;
        S[B >>> 5] |= 1 << 24 - B % 32, S[(u.ceil((B + 1) / w) * w >>> 5) - 1] |= 128, p2.sigBytes = 4 * S.length, this._process();
        for (var P = this._state, F = this.cfg.outputLength / 8, I = F / 8, k = [], A = 0; A < I; A++) {
          var n = P[A], c = n.high, _ = n.low;
          c = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8), _ = 16711935 & (_ << 8 | _ >>> 24) | 4278255360 & (_ << 24 | _ >>> 8), k.push(_), k.push(c);
        }
        return new t.init(k, F);
      }, "_doFinalize"), clone: r(function() {
        for (var p2 = g2.clone.call(this), S = p2._state = this._state.slice(0), B = 0; B < 25; B++) S[B] = S[B].clone();
        return p2;
      }, "clone") });
      m.SHA3 = g2._createHelper(h), m.HmacSHA3 = g2._createHmacHelper(h);
    })(Math), f.SHA3);
  }, 9557: function(C, j, b) {
    var f, u, m, d2, t, g2, i, o;
    C.exports = (o = b(9021), b(3240), b(1380), u = (f = o).x64, m = u.Word, d2 = u.WordArray, t = f.algo, g2 = t.SHA512, i = t.SHA384 = g2.extend({ _doReset: r(function() {
      this._hash = new d2.init([new m.init(3418070365, 3238371032), new m.init(1654270250, 914150663), new m.init(2438529370, 812702999), new m.init(355462360, 4144912697), new m.init(1731405415, 4290775857), new m.init(2394180231, 1750603025), new m.init(3675008525, 1694076839), new m.init(1203062813, 3204075428)]);
    }, "_doReset"), _doFinalize: r(function() {
      var y = g2._doFinalize.call(this);
      return y.sigBytes -= 16, y;
    }, "_doFinalize") }), f.SHA384 = g2._createHelper(i), f.HmacSHA384 = g2._createHmacHelper(i), o.SHA384);
  }, 1380: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(3240), (function() {
      var u = f, m = u.lib.Hasher, d2 = u.x64, t = d2.Word, g2 = d2.WordArray, i = u.algo;
      function o() {
        return t.create.apply(t, arguments);
      }
      r(o, "a");
      var y = [o(1116352408, 3609767458), o(1899447441, 602891725), o(3049323471, 3964484399), o(3921009573, 2173295548), o(961987163, 4081628472), o(1508970993, 3053834265), o(2453635748, 2937671579), o(2870763221, 3664609560), o(3624381080, 2734883394), o(310598401, 1164996542), o(607225278, 1323610764), o(1426881987, 3590304994), o(1925078388, 4068182383), o(2162078206, 991336113), o(2614888103, 633803317), o(3248222580, 3479774868), o(3835390401, 2666613458), o(4022224774, 944711139), o(264347078, 2341262773), o(604807628, 2007800933), o(770255983, 1495990901), o(1249150122, 1856431235), o(1555081692, 3175218132), o(1996064986, 2198950837), o(2554220882, 3999719339), o(2821834349, 766784016), o(2952996808, 2566594879), o(3210313671, 3203337956), o(3336571891, 1034457026), o(3584528711, 2466948901), o(113926993, 3758326383), o(338241895, 168717936), o(666307205, 1188179964), o(773529912, 1546045734), o(1294757372, 1522805485), o(1396182291, 2643833823), o(1695183700, 2343527390), o(1986661051, 1014477480), o(2177026350, 1206759142), o(2456956037, 344077627), o(2730485921, 1290863460), o(2820302411, 3158454273), o(3259730800, 3505952657), o(3345764771, 106217008), o(3516065817, 3606008344), o(3600352804, 1432725776), o(4094571909, 1467031594), o(275423344, 851169720), o(430227734, 3100823752), o(506948616, 1363258195), o(659060556, 3750685593), o(883997877, 3785050280), o(958139571, 3318307427), o(1322822218, 3812723403), o(1537002063, 2003034995), o(1747873779, 3602036899), o(1955562222, 1575990012), o(2024104815, 1125592928), o(2227730452, 2716904306), o(2361852424, 442776044), o(2428436474, 593698344), o(2756734187, 3733110249), o(3204031479, 2999351573), o(3329325298, 3815920427), o(3391569614, 3928383900), o(3515267271, 566280711), o(3940187606, 3454069534), o(4118630271, 4000239992), o(116418474, 1914138554), o(174292421, 2731055270), o(289380356, 3203993006), o(460393269, 320620315), o(685471733, 587496836), o(852142971, 1086792851), o(1017036298, 365543100), o(1126000580, 2618297676), o(1288033470, 3409855158), o(1501505948, 4234509866), o(1607167915, 987167468), o(1816402316, 1246189591)], l = [];
      (function() {
        for (var s = 0; s < 80; s++) l[s] = o();
      })();
      var v = i.SHA512 = m.extend({ _doReset: r(function() {
        this._hash = new g2.init([new t.init(1779033703, 4089235720), new t.init(3144134277, 2227873595), new t.init(1013904242, 4271175723), new t.init(2773480762, 1595750129), new t.init(1359893119, 2917565137), new t.init(2600822924, 725511199), new t.init(528734635, 4215389547), new t.init(1541459225, 327033209)]);
      }, "_doReset"), _doProcessBlock: r(function(s, h) {
        for (var p2 = this._hash.words, S = p2[0], B = p2[1], w = p2[2], P = p2[3], F = p2[4], I = p2[5], k = p2[6], A = p2[7], n = S.high, c = S.low, _ = B.high, e = B.low, a = w.high, E = w.low, O = P.high, T = P.low, L = F.high, N = F.low, U = I.high, X = I.low, Q = k.high, W = k.low, J = A.high, V = A.low, z = n, D = c, x = _, R = e, K = a, H = E, G = O, ne = T, ie = L, te = N, se = U, re = X, le = Q, me = W, Ee = J, De = V, _e = 0; _e < 80; _e++) {
          var ce = l[_e];
          if (_e < 16) var he = ce.high = 0 | s[h + 2 * _e], Ce = ce.low = 0 | s[h + 2 * _e + 1];
          else {
            var Oe = l[_e - 15], pe = Oe.high, Fe = Oe.low, ke = (pe >>> 1 | Fe << 31) ^ (pe >>> 8 | Fe << 24) ^ pe >>> 7, ee = (Fe >>> 1 | pe << 31) ^ (Fe >>> 8 | pe << 24) ^ (Fe >>> 7 | pe << 25), Ve = l[_e - 2], ye = Ve.high, Re = Ve.low, en = (ye >>> 19 | Re << 13) ^ (ye << 3 | Re >>> 29) ^ ye >>> 6, nn = (Re >>> 19 | ye << 13) ^ (Re << 3 | ye >>> 29) ^ (Re >>> 6 | ye << 26), He = l[_e - 7], cn = He.high, We = He.low, qe = l[_e - 16], ve = qe.high, Ne = qe.low;
            he = (he = (he = ke + cn + ((Ce = ee + We) >>> 0 < ee >>> 0 ? 1 : 0)) + en + ((Ce += nn) >>> 0 < nn >>> 0 ? 1 : 0)) + ve + ((Ce += Ne) >>> 0 < Ne >>> 0 ? 1 : 0), ce.high = he, ce.low = Ce;
          }
          var Pe, ln = ie & se ^ ~ie & le, $e = te & re ^ ~te & me, Je = z & x ^ z & K ^ x & K, hn = D & R ^ D & H ^ R & H, tn = (z >>> 28 | D << 4) ^ (z << 30 | D >>> 2) ^ (z << 25 | D >>> 7), Ae = (D >>> 28 | z << 4) ^ (D << 30 | z >>> 2) ^ (D << 25 | z >>> 7), je = (ie >>> 14 | te << 18) ^ (ie >>> 18 | te << 14) ^ (ie << 23 | te >>> 9), q = (te >>> 14 | ie << 18) ^ (te >>> 18 | ie << 14) ^ (te << 23 | ie >>> 9), Z = y[_e], ae = Z.high, oe = Z.low, ue = Ee + je + ((Pe = De + q) >>> 0 < De >>> 0 ? 1 : 0), de = Ae + hn;
          Ee = le, De = me, le = se, me = re, se = ie, re = te, ie = G + (ue = (ue = (ue = ue + ln + ((Pe += $e) >>> 0 < $e >>> 0 ? 1 : 0)) + ae + ((Pe += oe) >>> 0 < oe >>> 0 ? 1 : 0)) + he + ((Pe += Ce) >>> 0 < Ce >>> 0 ? 1 : 0)) + ((te = ne + Pe | 0) >>> 0 < ne >>> 0 ? 1 : 0) | 0, G = K, ne = H, K = x, H = R, x = z, R = D, z = ue + (tn + Je + (de >>> 0 < Ae >>> 0 ? 1 : 0)) + ((D = Pe + de | 0) >>> 0 < Pe >>> 0 ? 1 : 0) | 0;
        }
        c = S.low = c + D, S.high = n + z + (c >>> 0 < D >>> 0 ? 1 : 0), e = B.low = e + R, B.high = _ + x + (e >>> 0 < R >>> 0 ? 1 : 0), E = w.low = E + H, w.high = a + K + (E >>> 0 < H >>> 0 ? 1 : 0), T = P.low = T + ne, P.high = O + G + (T >>> 0 < ne >>> 0 ? 1 : 0), N = F.low = N + te, F.high = L + ie + (N >>> 0 < te >>> 0 ? 1 : 0), X = I.low = X + re, I.high = U + se + (X >>> 0 < re >>> 0 ? 1 : 0), W = k.low = W + me, k.high = Q + le + (W >>> 0 < me >>> 0 ? 1 : 0), V = A.low = V + De, A.high = J + Ee + (V >>> 0 < De >>> 0 ? 1 : 0);
      }, "_doProcessBlock"), _doFinalize: r(function() {
        var s = this._data, h = s.words, p2 = 8 * this._nDataBytes, S = 8 * s.sigBytes;
        return h[S >>> 5] |= 128 << 24 - S % 32, h[30 + (S + 128 >>> 10 << 5)] = Math.floor(p2 / 4294967296), h[31 + (S + 128 >>> 10 << 5)] = p2, s.sigBytes = 4 * h.length, this._process(), this._hash.toX32();
      }, "_doFinalize"), clone: r(function() {
        var s = m.clone.call(this);
        return s._hash = this._hash.clone(), s;
      }, "clone"), blockSize: 32 });
      u.SHA512 = m._createHelper(v), u.HmacSHA512 = m._createHmacHelper(v);
    })(), f.SHA512);
  }, 7628: function(C, j, b) {
    var f;
    C.exports = (f = b(9021), b(754), b(4636), b(9506), b(7165), (function() {
      var u = f, m = u.lib, d2 = m.WordArray, t = m.BlockCipher, g2 = u.algo, i = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4], o = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32], y = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], l = [{ 0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378 }, { 0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672 }, { 0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792 }, { 0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464 }, { 0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040 }, { 0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656 }, { 0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577 }, { 0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848 }], v = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679], s = g2.DES = t.extend({ _doReset: r(function() {
        for (var B = this._key.words, w = [], P = 0; P < 56; P++) {
          var F = i[P] - 1;
          w[P] = B[F >>> 5] >>> 31 - F % 32 & 1;
        }
        for (var I = this._subKeys = [], k = 0; k < 16; k++) {
          var A = I[k] = [], n = y[k];
          for (P = 0; P < 24; P++) A[P / 6 | 0] |= w[(o[P] - 1 + n) % 28] << 31 - P % 6, A[4 + (P / 6 | 0)] |= w[28 + (o[P + 24] - 1 + n) % 28] << 31 - P % 6;
          for (A[0] = A[0] << 1 | A[0] >>> 31, P = 1; P < 7; P++) A[P] = A[P] >>> 4 * (P - 1) + 3;
          A[7] = A[7] << 5 | A[7] >>> 27;
        }
        var c = this._invSubKeys = [];
        for (P = 0; P < 16; P++) c[P] = I[15 - P];
      }, "_doReset"), encryptBlock: r(function(B, w) {
        this._doCryptBlock(B, w, this._subKeys);
      }, "encryptBlock"), decryptBlock: r(function(B, w) {
        this._doCryptBlock(B, w, this._invSubKeys);
      }, "decryptBlock"), _doCryptBlock: r(function(B, w, P) {
        this._lBlock = B[w], this._rBlock = B[w + 1], h.call(this, 4, 252645135), h.call(this, 16, 65535), p2.call(this, 2, 858993459), p2.call(this, 8, 16711935), h.call(this, 1, 1431655765);
        for (var F = 0; F < 16; F++) {
          for (var I = P[F], k = this._lBlock, A = this._rBlock, n = 0, c = 0; c < 8; c++) n |= l[c][((A ^ I[c]) & v[c]) >>> 0];
          this._lBlock = A, this._rBlock = k ^ n;
        }
        var _ = this._lBlock;
        this._lBlock = this._rBlock, this._rBlock = _, h.call(this, 1, 1431655765), p2.call(this, 8, 16711935), p2.call(this, 2, 858993459), h.call(this, 16, 65535), h.call(this, 4, 252645135), B[w] = this._lBlock, B[w + 1] = this._rBlock;
      }, "_doCryptBlock"), keySize: 2, ivSize: 2, blockSize: 2 });
      function h(B, w) {
        var P = (this._lBlock >>> B ^ this._rBlock) & w;
        this._rBlock ^= P, this._lBlock ^= P << B;
      }
      r(h, "p");
      function p2(B, w) {
        var P = (this._rBlock >>> B ^ this._lBlock) & w;
        this._lBlock ^= P, this._rBlock ^= P << B;
      }
      r(p2, "l"), u.DES = t._createHelper(s);
      var S = g2.TripleDES = t.extend({ _doReset: r(function() {
        var B = this._key.words;
        this._des1 = s.createEncryptor(d2.create(B.slice(0, 2))), this._des2 = s.createEncryptor(d2.create(B.slice(2, 4))), this._des3 = s.createEncryptor(d2.create(B.slice(4, 6)));
      }, "_doReset"), encryptBlock: r(function(B, w) {
        this._des1.encryptBlock(B, w), this._des2.decryptBlock(B, w), this._des3.encryptBlock(B, w);
      }, "encryptBlock"), decryptBlock: r(function(B, w) {
        this._des3.decryptBlock(B, w), this._des2.encryptBlock(B, w), this._des1.decryptBlock(B, w);
      }, "decryptBlock"), keySize: 6, ivSize: 2, blockSize: 2 });
      u.TripleDES = t._createHelper(S);
    })(), f.TripleDES);
  }, 3240: function(C, j, b) {
    var f, u, m, d2, t, g2;
    C.exports = (f = b(9021), m = (u = f).lib, d2 = m.Base, t = m.WordArray, (g2 = u.x64 = {}).Word = d2.extend({ init: r(function(i, o) {
      this.high = i, this.low = o;
    }, "init") }), g2.WordArray = d2.extend({ init: r(function(i, o) {
      i = this.words = i || [], this.sigBytes = o ?? 8 * i.length;
    }, "init"), toX32: r(function() {
      for (var i = this.words, o = i.length, y = [], l = 0; l < o; l++) {
        var v = i[l];
        y.push(v.high), y.push(v.low);
      }
      return t.create(y, this.sigBytes);
    }, "toX32"), clone: r(function() {
      for (var i = d2.clone.call(this), o = i.words = this.words.slice(0), y = o.length, l = 0; l < y; l++) o[l] = o[l].clone();
      return i;
    }, "clone") }), f);
  }, 41: (C, j, b) => {
    "use strict";
    var f = b(655), u = b(8068), m = b(9675), d2 = b(5795);
    C.exports = function(t, g2, i) {
      if (!t || typeof t != "object" && typeof t != "function") throw new m("`obj` must be an object or a function`");
      if (typeof g2 != "string" && typeof g2 != "symbol") throw new m("`property` must be a string or a symbol`");
      if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null) throw new m("`nonEnumerable`, if provided, must be a boolean or null");
      if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null) throw new m("`nonWritable`, if provided, must be a boolean or null");
      if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null) throw new m("`nonConfigurable`, if provided, must be a boolean or null");
      if (arguments.length > 6 && typeof arguments[6] != "boolean") throw new m("`loose`, if provided, must be a boolean");
      var o = arguments.length > 3 ? arguments[3] : null, y = arguments.length > 4 ? arguments[4] : null, l = arguments.length > 5 ? arguments[5] : null, v = arguments.length > 6 && arguments[6], s = !!d2 && d2(t, g2);
      if (f) f(t, g2, { configurable: l === null && s ? s.configurable : !l, enumerable: o === null && s ? s.enumerable : !o, value: i, writable: y === null && s ? s.writable : !y });
      else {
        if (!v && (o || y || l)) throw new u("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
        t[g2] = i;
      }
    };
  }, 655: (C, j, b) => {
    "use strict";
    var f = b(453)("%Object.defineProperty%", true) || false;
    if (f) try {
      f({}, "a", { value: 1 });
    } catch {
      f = false;
    }
    C.exports = f;
  }, 1237: (C) => {
    "use strict";
    C.exports = EvalError;
  }, 9383: (C) => {
    "use strict";
    C.exports = Error;
  }, 9290: (C) => {
    "use strict";
    C.exports = RangeError;
  }, 9538: (C) => {
    "use strict";
    C.exports = ReferenceError;
  }, 8068: (C) => {
    "use strict";
    C.exports = SyntaxError;
  }, 9675: (C) => {
    "use strict";
    C.exports = TypeError;
  }, 5345: (C) => {
    "use strict";
    C.exports = URIError;
  }, 9353: (C) => {
    "use strict";
    var j = Object.prototype.toString, b = Math.max, f = r(function(u, m) {
      for (var d2 = [], t = 0; t < u.length; t += 1) d2[t] = u[t];
      for (var g2 = 0; g2 < m.length; g2 += 1) d2[g2 + u.length] = m[g2];
      return d2;
    }, "n");
    C.exports = function(u) {
      var m = this;
      if (typeof m != "function" || j.apply(m) !== "[object Function]") throw new TypeError("Function.prototype.bind called on incompatible " + m);
      for (var d2, t = (function(l, v) {
        for (var s = [], h = 1, p2 = 0; h < l.length; h += 1, p2 += 1) s[p2] = l[h];
        return s;
      })(arguments), g2 = b(0, m.length - t.length), i = [], o = 0; o < g2; o++) i[o] = "$" + o;
      if (d2 = Function("binder", "return function (" + (function(l, v) {
        for (var s = "", h = 0; h < l.length; h += 1) s += l[h], h + 1 < l.length && (s += ",");
        return s;
      })(i) + "){ return binder.apply(this,arguments); }")(function() {
        if (this instanceof d2) {
          var l = m.apply(this, f(t, arguments));
          return Object(l) === l ? l : this;
        }
        return m.apply(u, f(t, arguments));
      }), m.prototype) {
        var y = r(function() {
        }, "c");
        y.prototype = m.prototype, d2.prototype = new y(), y.prototype = null;
      }
      return d2;
    };
  }, 6743: (C, j, b) => {
    "use strict";
    var f = b(9353);
    C.exports = Function.prototype.bind || f;
  }, 453: (C, j, b) => {
    "use strict";
    var f, u = b(9383), m = b(1237), d2 = b(9290), t = b(9538), g2 = b(8068), i = b(9675), o = b(5345), y = Function, l = r(function(U) {
      try {
        return y('"use strict"; return (' + U + ").constructor;")();
      } catch {
      }
    }, "p"), v = Object.getOwnPropertyDescriptor;
    if (v) try {
      v({}, "");
    } catch {
      v = null;
    }
    var s = r(function() {
      throw new i();
    }, "y"), h = v ? (function() {
      try {
        return s;
      } catch {
        try {
          return v(arguments, "callee").get;
        } catch {
          return s;
        }
      }
    })() : s, p2 = b(4039)(), S = b(24)(), B = Object.getPrototypeOf || (S ? function(U) {
      return U.__proto__;
    } : null), w = {}, P = typeof Uint8Array < "u" && B ? B(Uint8Array) : f, F = { __proto__: null, "%AggregateError%": typeof AggregateError > "u" ? f : AggregateError, "%Array%": Array, "%ArrayBuffer%": typeof ArrayBuffer > "u" ? f : ArrayBuffer, "%ArrayIteratorPrototype%": p2 && B ? B([][Symbol.iterator]()) : f, "%AsyncFromSyncIteratorPrototype%": f, "%AsyncFunction%": w, "%AsyncGenerator%": w, "%AsyncGeneratorFunction%": w, "%AsyncIteratorPrototype%": w, "%Atomics%": typeof Atomics > "u" ? f : Atomics, "%BigInt%": typeof BigInt > "u" ? f : BigInt, "%BigInt64Array%": typeof BigInt64Array > "u" ? f : BigInt64Array, "%BigUint64Array%": typeof BigUint64Array > "u" ? f : BigUint64Array, "%Boolean%": Boolean, "%DataView%": typeof DataView > "u" ? f : DataView, "%Date%": Date, "%decodeURI%": decodeURI, "%decodeURIComponent%": decodeURIComponent, "%encodeURI%": encodeURI, "%encodeURIComponent%": encodeURIComponent, "%Error%": u, "%eval%": eval, "%EvalError%": m, "%Float32Array%": typeof Float32Array > "u" ? f : Float32Array, "%Float64Array%": typeof Float64Array > "u" ? f : Float64Array, "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? f : FinalizationRegistry, "%Function%": y, "%GeneratorFunction%": w, "%Int8Array%": typeof Int8Array > "u" ? f : Int8Array, "%Int16Array%": typeof Int16Array > "u" ? f : Int16Array, "%Int32Array%": typeof Int32Array > "u" ? f : Int32Array, "%isFinite%": isFinite, "%isNaN%": isNaN, "%IteratorPrototype%": p2 && B ? B(B([][Symbol.iterator]())) : f, "%JSON%": typeof JSON == "object" ? JSON : f, "%Map%": typeof Map > "u" ? f : Map, "%MapIteratorPrototype%": typeof Map < "u" && p2 && B ? B((/* @__PURE__ */ new Map())[Symbol.iterator]()) : f, "%Math%": Math, "%Number%": Number, "%Object%": Object, "%parseFloat%": parseFloat, "%parseInt%": parseInt, "%Promise%": typeof Promise > "u" ? f : Promise, "%Proxy%": typeof Proxy > "u" ? f : Proxy, "%RangeError%": d2, "%ReferenceError%": t, "%Reflect%": typeof Reflect > "u" ? f : Reflect, "%RegExp%": RegExp, "%Set%": typeof Set > "u" ? f : Set, "%SetIteratorPrototype%": typeof Set < "u" && p2 && B ? B((/* @__PURE__ */ new Set())[Symbol.iterator]()) : f, "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? f : SharedArrayBuffer, "%String%": String, "%StringIteratorPrototype%": p2 && B ? B(""[Symbol.iterator]()) : f, "%Symbol%": p2 ? Symbol : f, "%SyntaxError%": g2, "%ThrowTypeError%": h, "%TypedArray%": P, "%TypeError%": i, "%Uint8Array%": typeof Uint8Array > "u" ? f : Uint8Array, "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? f : Uint8ClampedArray, "%Uint16Array%": typeof Uint16Array > "u" ? f : Uint16Array, "%Uint32Array%": typeof Uint32Array > "u" ? f : Uint32Array, "%URIError%": o, "%WeakMap%": typeof WeakMap > "u" ? f : WeakMap, "%WeakRef%": typeof WeakRef > "u" ? f : WeakRef, "%WeakSet%": typeof WeakSet > "u" ? f : WeakSet };
    if (B) try {
      null.error;
    } catch (U) {
      var I = B(B(U));
      F["%Error.prototype%"] = I;
    }
    var k = r(function U(X) {
      var Q;
      if (X === "%AsyncFunction%") Q = l("async function () {}");
      else if (X === "%GeneratorFunction%") Q = l("function* () {}");
      else if (X === "%AsyncGeneratorFunction%") Q = l("async function* () {}");
      else if (X === "%AsyncGenerator%") {
        var W = U("%AsyncGeneratorFunction%");
        W && (Q = W.prototype);
      } else if (X === "%AsyncIteratorPrototype%") {
        var J = U("%AsyncGenerator%");
        J && B && (Q = B(J.prototype));
      }
      return F[X] = Q, Q;
    }, "t"), A = { __proto__: null, "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"], "%ArrayPrototype%": ["Array", "prototype"], "%ArrayProto_entries%": ["Array", "prototype", "entries"], "%ArrayProto_forEach%": ["Array", "prototype", "forEach"], "%ArrayProto_keys%": ["Array", "prototype", "keys"], "%ArrayProto_values%": ["Array", "prototype", "values"], "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"], "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"], "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"], "%BooleanPrototype%": ["Boolean", "prototype"], "%DataViewPrototype%": ["DataView", "prototype"], "%DatePrototype%": ["Date", "prototype"], "%ErrorPrototype%": ["Error", "prototype"], "%EvalErrorPrototype%": ["EvalError", "prototype"], "%Float32ArrayPrototype%": ["Float32Array", "prototype"], "%Float64ArrayPrototype%": ["Float64Array", "prototype"], "%FunctionPrototype%": ["Function", "prototype"], "%Generator%": ["GeneratorFunction", "prototype"], "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"], "%Int8ArrayPrototype%": ["Int8Array", "prototype"], "%Int16ArrayPrototype%": ["Int16Array", "prototype"], "%Int32ArrayPrototype%": ["Int32Array", "prototype"], "%JSONParse%": ["JSON", "parse"], "%JSONStringify%": ["JSON", "stringify"], "%MapPrototype%": ["Map", "prototype"], "%NumberPrototype%": ["Number", "prototype"], "%ObjectPrototype%": ["Object", "prototype"], "%ObjProto_toString%": ["Object", "prototype", "toString"], "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"], "%PromisePrototype%": ["Promise", "prototype"], "%PromiseProto_then%": ["Promise", "prototype", "then"], "%Promise_all%": ["Promise", "all"], "%Promise_reject%": ["Promise", "reject"], "%Promise_resolve%": ["Promise", "resolve"], "%RangeErrorPrototype%": ["RangeError", "prototype"], "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"], "%RegExpPrototype%": ["RegExp", "prototype"], "%SetPrototype%": ["Set", "prototype"], "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"], "%StringPrototype%": ["String", "prototype"], "%SymbolPrototype%": ["Symbol", "prototype"], "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"], "%TypedArrayPrototype%": ["TypedArray", "prototype"], "%TypeErrorPrototype%": ["TypeError", "prototype"], "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"], "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"], "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"], "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"], "%URIErrorPrototype%": ["URIError", "prototype"], "%WeakMapPrototype%": ["WeakMap", "prototype"], "%WeakSetPrototype%": ["WeakSet", "prototype"] }, n = b(6743), c = b(9957), _ = n.call(Function.call, Array.prototype.concat), e = n.call(Function.apply, Array.prototype.splice), a = n.call(Function.call, String.prototype.replace), E = n.call(Function.call, String.prototype.slice), O = n.call(Function.call, RegExp.prototype.exec), T = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, L = /\\(\\)?/g, N = r(function(U, X) {
      var Q, W = U;
      if (c(A, W) && (W = "%" + (Q = A[W])[0] + "%"), c(F, W)) {
        var J = F[W];
        if (J === w && (J = k(W)), J === void 0 && !X) throw new i("intrinsic " + U + " exists, but is not available. Please file an issue!");
        return { alias: Q, name: W, value: J };
      }
      throw new g2("intrinsic " + U + " does not exist!");
    }, "N");
    C.exports = function(U, X) {
      if (typeof U != "string" || U.length === 0) throw new i("intrinsic name must be a non-empty string");
      if (arguments.length > 1 && typeof X != "boolean") throw new i('"allowMissing" argument must be a boolean');
      if (O(/^%?[^%]*%?$/, U) === null) throw new g2("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      var Q = (function(te) {
        var se = E(te, 0, 1), re = E(te, -1);
        if (se === "%" && re !== "%") throw new g2("invalid intrinsic syntax, expected closing `%`");
        if (re === "%" && se !== "%") throw new g2("invalid intrinsic syntax, expected opening `%`");
        var le = [];
        return a(te, T, function(me, Ee, De, _e) {
          le[le.length] = De ? a(_e, L, "$1") : Ee || me;
        }), le;
      })(U), W = Q.length > 0 ? Q[0] : "", J = N("%" + W + "%", X), V = J.name, z = J.value, D = false, x = J.alias;
      x && (W = x[0], e(Q, _([0, 1], x)));
      for (var R = 1, K = true; R < Q.length; R += 1) {
        var H = Q[R], G = E(H, 0, 1), ne = E(H, -1);
        if ((G === '"' || G === "'" || G === "`" || ne === '"' || ne === "'" || ne === "`") && G !== ne) throw new g2("property names with quotes must have matching quotes");
        if (H !== "constructor" && K || (D = true), c(F, V = "%" + (W += "." + H) + "%")) z = F[V];
        else if (z != null) {
          if (!(H in z)) {
            if (!X) throw new i("base intrinsic for " + U + " exists, but the property is not available.");
            return;
          }
          if (v && R + 1 >= Q.length) {
            var ie = v(z, H);
            z = (K = !!ie) && "get" in ie && !("originalValue" in ie.get) ? ie.get : z[H];
          } else K = c(z, H), z = z[H];
          K && !D && (F[V] = z);
        }
      }
      return z;
    };
  }, 5795: (C, j, b) => {
    "use strict";
    var f = b(453)("%Object.getOwnPropertyDescriptor%", true);
    if (f) try {
      f([], "length");
    } catch {
      f = null;
    }
    C.exports = f;
  }, 592: (C, j, b) => {
    "use strict";
    var f = b(655), u = r(function() {
      return !!f;
    }, "i");
    u.hasArrayLengthDefineBug = function() {
      if (!f) return null;
      try {
        return f([], "length", { value: 1 }).length !== 1;
      } catch {
        return true;
      }
    }, C.exports = u;
  }, 24: (C) => {
    "use strict";
    var j = { __proto__: null, foo: {} }, b = Object;
    C.exports = function() {
      return { __proto__: j }.foo === j.foo && !(j instanceof b);
    };
  }, 4039: (C, j, b) => {
    "use strict";
    var f = typeof Symbol < "u" && Symbol, u = b(1333);
    C.exports = function() {
      return typeof f == "function" && typeof Symbol == "function" && typeof f("foo") == "symbol" && typeof Symbol("bar") == "symbol" && u();
    };
  }, 1333: (C) => {
    "use strict";
    C.exports = function() {
      if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function") return false;
      if (typeof Symbol.iterator == "symbol") return true;
      var j = {}, b = Symbol("test"), f = Object(b);
      if (typeof b == "string" || Object.prototype.toString.call(b) !== "[object Symbol]" || Object.prototype.toString.call(f) !== "[object Symbol]") return false;
      for (b in j[b] = 42, j) return false;
      if (typeof Object.keys == "function" && Object.keys(j).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(j).length !== 0) return false;
      var u = Object.getOwnPropertySymbols(j);
      if (u.length !== 1 || u[0] !== b || !Object.prototype.propertyIsEnumerable.call(j, b)) return false;
      if (typeof Object.getOwnPropertyDescriptor == "function") {
        var m = Object.getOwnPropertyDescriptor(j, b);
        if (m.value !== 42 || m.enumerable !== true) return false;
      }
      return true;
    };
  }, 9957: (C, j, b) => {
    "use strict";
    var f = Function.prototype.call, u = Object.prototype.hasOwnProperty, m = b(6743);
    C.exports = m.call(f, u);
  }, 251: (C, j) => {
    j.read = function(b, f, u, m, d2) {
      var t, g2, i = 8 * d2 - m - 1, o = (1 << i) - 1, y = o >> 1, l = -7, v = u ? d2 - 1 : 0, s = u ? -1 : 1, h = b[f + v];
      for (v += s, t = h & (1 << -l) - 1, h >>= -l, l += i; l > 0; t = 256 * t + b[f + v], v += s, l -= 8) ;
      for (g2 = t & (1 << -l) - 1, t >>= -l, l += m; l > 0; g2 = 256 * g2 + b[f + v], v += s, l -= 8) ;
      if (t === 0) t = 1 - y;
      else {
        if (t === o) return g2 ? NaN : 1 / 0 * (h ? -1 : 1);
        g2 += Math.pow(2, m), t -= y;
      }
      return (h ? -1 : 1) * g2 * Math.pow(2, t - m);
    }, j.write = function(b, f, u, m, d2, t) {
      var g2, i, o, y = 8 * t - d2 - 1, l = (1 << y) - 1, v = l >> 1, s = d2 === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, h = m ? 0 : t - 1, p2 = m ? 1 : -1, S = f < 0 || f === 0 && 1 / f < 0 ? 1 : 0;
      for (f = Math.abs(f), isNaN(f) || f === 1 / 0 ? (i = isNaN(f) ? 1 : 0, g2 = l) : (g2 = Math.floor(Math.log(f) / Math.LN2), f * (o = Math.pow(2, -g2)) < 1 && (g2--, o *= 2), (f += g2 + v >= 1 ? s / o : s * Math.pow(2, 1 - v)) * o >= 2 && (g2++, o /= 2), g2 + v >= l ? (i = 0, g2 = l) : g2 + v >= 1 ? (i = (f * o - 1) * Math.pow(2, d2), g2 += v) : (i = f * Math.pow(2, v - 1) * Math.pow(2, d2), g2 = 0)); d2 >= 8; b[u + h] = 255 & i, h += p2, i /= 256, d2 -= 8) ;
      for (g2 = g2 << d2 | i, y += d2; y > 0; b[u + h] = 255 & g2, h += p2, g2 /= 256, y -= 8) ;
      b[u + h - p2] |= 128 * S;
    };
  }, 3229: (C, j, b) => {
    var f = b(8287).Buffer, u = b(7449), m = b(5682), d2 = (b(3200), b(3100).Ber, b(8226)._), t = b(8226), g2 = b(1768), i = b(7460);
    u.RSA_NO_PADDING === void 0 && (u.RSA_NO_PADDING = 3), C.exports = (function() {
      var o = { node10: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"], node: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"], iojs: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"], browser: ["md5", "ripemd160", "sha1", "sha256", "sha512"] }, y = "pkcs1_oaep", l = "pkcs1", v = { private: "pkcs1-private-pem", "private-der": "pkcs1-private-der", public: "pkcs8-public-pem", "public-der": "pkcs8-public-der" };
      function s(h, p2, S) {
        if (!(this instanceof s)) return new s(h, p2, S);
        d2.isObject(p2) && (S = p2, p2 = void 0), this.$options = { signingScheme: l, signingSchemeOptions: { hash: "sha256", saltLength: null }, encryptionScheme: y, encryptionSchemeOptions: { hash: "sha1", label: null }, environment: t.detectEnvironment(), rsaUtils: this }, this.keyPair = new m.Key(), this.$cache = {}, f.isBuffer(h) || d2.isString(h) ? this.importKey(h, p2) : d2.isObject(h) && this.generateKeyPair(h.b, h.e), this.setOptions(S);
      }
      return r(s, "c"), s.prototype.setOptions = function(h) {
        if ((h = h || {}).environment && (this.$options.environment = h.environment), h.signingScheme) {
          if (d2.isString(h.signingScheme)) {
            var p2 = h.signingScheme.toLowerCase().split("-");
            p2.length == 1 ? o.node.indexOf(p2[0]) > -1 ? (this.$options.signingSchemeOptions = { hash: p2[0] }, this.$options.signingScheme = l) : (this.$options.signingScheme = p2[0], this.$options.signingSchemeOptions = { hash: null }) : (this.$options.signingSchemeOptions = { hash: p2[1] }, this.$options.signingScheme = p2[0]);
          } else d2.isObject(h.signingScheme) && (this.$options.signingScheme = h.signingScheme.scheme || l, this.$options.signingSchemeOptions = d2.omit(h.signingScheme, "scheme"));
          if (!g2.isSignature(this.$options.signingScheme)) throw Error("Unsupported signing scheme");
          if (this.$options.signingSchemeOptions.hash && o[this.$options.environment].indexOf(this.$options.signingSchemeOptions.hash) === -1) throw Error("Unsupported hashing algorithm for " + this.$options.environment + " environment");
        }
        if (h.encryptionScheme) {
          if (d2.isString(h.encryptionScheme) ? (this.$options.encryptionScheme = h.encryptionScheme.toLowerCase(), this.$options.encryptionSchemeOptions = {}) : d2.isObject(h.encryptionScheme) && (this.$options.encryptionScheme = h.encryptionScheme.scheme || y, this.$options.encryptionSchemeOptions = d2.omit(h.encryptionScheme, "scheme")), !g2.isEncryption(this.$options.encryptionScheme)) throw Error("Unsupported encryption scheme");
          if (this.$options.encryptionSchemeOptions.hash && o[this.$options.environment].indexOf(this.$options.encryptionSchemeOptions.hash) === -1) throw Error("Unsupported hashing algorithm for " + this.$options.environment + " environment");
        }
        this.keyPair.setOptions(this.$options);
      }, s.prototype.generateKeyPair = function(h, p2) {
        if (p2 = p2 || 65537, (h = h || 2048) % 8 != 0) throw Error("Key size must be a multiple of 8.");
        return this.keyPair.generate(h, p2.toString(16)), this.$cache = {}, this;
      }, s.prototype.importKey = function(h, p2) {
        if (!h) throw Error("Empty key given");
        if (p2 && (p2 = v[p2] || p2), !i.detectAndImport(this.keyPair, h, p2) && p2 === void 0) throw Error("Key format must be specified");
        return this.$cache = {}, this;
      }, s.prototype.exportKey = function(h) {
        return h = v[h = h || "private"] || h, this.$cache[h] || (this.$cache[h] = i.detectAndExport(this.keyPair, h)), this.$cache[h];
      }, s.prototype.isPrivate = function() {
        return this.keyPair.isPrivate();
      }, s.prototype.isPublic = function(h) {
        return this.keyPair.isPublic(h);
      }, s.prototype.isEmpty = function(h) {
        return !(this.keyPair.n || this.keyPair.e || this.keyPair.d);
      }, s.prototype.encrypt = function(h, p2, S) {
        return this.$$encryptKey(false, h, p2, S);
      }, s.prototype.decrypt = function(h, p2) {
        return this.$$decryptKey(false, h, p2);
      }, s.prototype.encryptPrivate = function(h, p2, S) {
        return this.$$encryptKey(true, h, p2, S);
      }, s.prototype.decryptPublic = function(h, p2) {
        return this.$$decryptKey(true, h, p2);
      }, s.prototype.$$encryptKey = function(h, p2, S, B) {
        try {
          var w = this.keyPair.encrypt(this.$getDataForEncrypt(p2, B), h);
          return S != "buffer" && S ? w.toString(S) : w;
        } catch (P) {
          throw Error("Error during encryption. Original error: " + P);
        }
      }, s.prototype.$$decryptKey = function(h, p2, S) {
        try {
          p2 = d2.isString(p2) ? f.from(p2, "base64") : p2;
          var B = this.keyPair.decrypt(p2, h);
          if (B === null) throw Error("Key decrypt method returns null.");
          return this.$getDecryptedData(B, S);
        } catch (w) {
          throw Error("Error during decryption (probably incorrect key). Original error: " + w);
        }
      }, s.prototype.sign = function(h, p2, S) {
        if (!this.isPrivate()) throw Error("This is not private key");
        var B = this.keyPair.sign(this.$getDataForEncrypt(h, S));
        return p2 && p2 != "buffer" && (B = B.toString(p2)), B;
      }, s.prototype.verify = function(h, p2, S, B) {
        if (!this.isPublic()) throw Error("This is not public key");
        return B = B && B != "buffer" ? B : null, this.keyPair.verify(this.$getDataForEncrypt(h, S), p2, B);
      }, s.prototype.getKeySize = function() {
        return this.keyPair.keySize;
      }, s.prototype.getMaxMessageSize = function() {
        return this.keyPair.maxMessageLength;
      }, s.prototype.$getDataForEncrypt = function(h, p2) {
        if (d2.isString(h) || d2.isNumber(h)) return f.from("" + h, p2 || "utf8");
        if (f.isBuffer(h)) return h;
        if (d2.isObject(h)) return f.from(JSON.stringify(h));
        throw Error("Unexpected data type");
      }, s.prototype.$getDecryptedData = function(h, p2) {
        return (p2 = p2 || "buffer") == "buffer" ? h : p2 == "json" ? JSON.parse(h.toString()) : h.toString(p2);
      }, s;
    })();
  }, 4538: (C, j, b) => {
    var f = b(3200);
    C.exports = { getEngine: r(function(u, m) {
      var d2 = b(7469);
      return m.environment === "node" && typeof f.publicEncrypt == "function" && typeof f.privateDecrypt == "function" && (d2 = typeof f.privateEncrypt == "function" && typeof f.publicDecrypt == "function" ? b(2418) : b(1957)), d2(u, m);
    }, "getEngine") };
  }, 2418: (C, j, b) => {
    var f = b(3200), u = b(7449), m = b(1768);
    C.exports = function(d2, t) {
      var g2 = m.pkcs1.makeScheme(d2, t);
      return { encrypt: r(function(i, o) {
        var y;
        if (o) return y = u.RSA_PKCS1_PADDING, t.encryptionSchemeOptions && t.encryptionSchemeOptions.padding && (y = t.encryptionSchemeOptions.padding), f.privateEncrypt({ key: t.rsaUtils.exportKey("private"), padding: y }, i);
        y = u.RSA_PKCS1_OAEP_PADDING, t.encryptionScheme === "pkcs1" && (y = u.RSA_PKCS1_PADDING), t.encryptionSchemeOptions && t.encryptionSchemeOptions.padding && (y = t.encryptionSchemeOptions.padding);
        var l = i;
        return y === u.RSA_NO_PADDING && (l = g2.pkcs0pad(i)), f.publicEncrypt({ key: t.rsaUtils.exportKey("public"), padding: y }, l);
      }, "encrypt"), decrypt: r(function(i, o) {
        var y;
        if (o) return y = u.RSA_PKCS1_PADDING, t.encryptionSchemeOptions && t.encryptionSchemeOptions.padding && (y = t.encryptionSchemeOptions.padding), f.publicDecrypt({ key: t.rsaUtils.exportKey("public"), padding: y }, i);
        y = u.RSA_PKCS1_OAEP_PADDING, t.encryptionScheme === "pkcs1" && (y = u.RSA_PKCS1_PADDING), t.encryptionSchemeOptions && t.encryptionSchemeOptions.padding && (y = t.encryptionSchemeOptions.padding);
        var l = f.privateDecrypt({ key: t.rsaUtils.exportKey("private"), padding: y }, i);
        return y === u.RSA_NO_PADDING ? g2.pkcs0unpad(l) : l;
      }, "decrypt") };
    };
  }, 7469: (C, j, b) => {
    var f = b(1973), u = b(1768);
    C.exports = function(m, d2) {
      var t = u.pkcs1.makeScheme(m, d2);
      return { encrypt: r(function(g2, i) {
        var o, y;
        return i ? (o = new f(t.encPad(g2, { type: 1 })), y = m.$doPrivate(o)) : (o = new f(m.encryptionScheme.encPad(g2)), y = m.$doPublic(o)), y.toBuffer(m.encryptedDataLength);
      }, "encrypt"), decrypt: r(function(g2, i) {
        var o, y = new f(g2);
        return i ? (o = m.$doPublic(y), t.encUnPad(o.toBuffer(m.encryptedDataLength), { type: 1 })) : (o = m.$doPrivate(y), m.encryptionScheme.encUnPad(o.toBuffer(m.encryptedDataLength)));
      }, "decrypt") };
    };
  }, 1957: (C, j, b) => {
    var f = b(3200), u = b(7449), m = b(1768);
    C.exports = function(d2, t) {
      var g2 = b(7469)(d2, t), i = m.pkcs1.makeScheme(d2, t);
      return { encrypt: r(function(o, y) {
        if (y) return g2.encrypt(o, y);
        var l = u.RSA_PKCS1_OAEP_PADDING;
        t.encryptionScheme === "pkcs1" && (l = u.RSA_PKCS1_PADDING), t.encryptionSchemeOptions && t.encryptionSchemeOptions.padding && (l = t.encryptionSchemeOptions.padding);
        var v = o;
        return l === u.RSA_NO_PADDING && (v = i.pkcs0pad(o)), f.publicEncrypt({ key: t.rsaUtils.exportKey("public"), padding: l }, v);
      }, "encrypt"), decrypt: r(function(o, y) {
        if (y) return g2.decrypt(o, y);
        var l = u.RSA_PKCS1_OAEP_PADDING;
        t.encryptionScheme === "pkcs1" && (l = u.RSA_PKCS1_PADDING), t.encryptionSchemeOptions && t.encryptionSchemeOptions.padding && (l = t.encryptionSchemeOptions.padding);
        var v = f.privateDecrypt({ key: t.rsaUtils.exportKey("private"), padding: l }, o);
        return l === u.RSA_NO_PADDING ? i.pkcs0unpad(v) : v;
      }, "decrypt") };
    };
  }, 3374: (C, j, b) => {
    b(8226)._, b(8226), C.exports = { privateExport: r(function(f, u) {
      return { n: f.n.toBuffer(), e: f.e, d: f.d.toBuffer(), p: f.p.toBuffer(), q: f.q.toBuffer(), dmp1: f.dmp1.toBuffer(), dmq1: f.dmq1.toBuffer(), coeff: f.coeff.toBuffer() };
    }, "privateExport"), privateImport: r(function(f, u, m) {
      if (!(u.n && u.e && u.d && u.p && u.q && u.dmp1 && u.dmq1 && u.coeff)) throw Error("Invalid key data");
      f.setPrivate(u.n, u.e, u.d, u.p, u.q, u.dmp1, u.dmq1, u.coeff);
    }, "privateImport"), publicExport: r(function(f, u) {
      return { n: f.n.toBuffer(), e: f.e };
    }, "publicExport"), publicImport: r(function(f, u, m) {
      if (!u.n || !u.e) throw Error("Invalid key data");
      f.setPublic(u.n, u.e);
    }, "publicImport"), autoImport: r(function(f, u) {
      return !(!u.n || !u.e || (u.d && u.p && u.q && u.dmp1 && u.dmq1 && u.coeff ? (C.exports.privateImport(f, u), 0) : (C.exports.publicImport(f, u), 0)));
    }, "autoImport") };
  }, 7460: (C, j, b) => {
    function f(u) {
      u = u.split("-");
      for (var m = "private", d2 = { type: "default" }, t = 1; t < u.length; t++) if (u[t]) switch (u[t]) {
        case "public":
        case "private":
          m = u[t];
          break;
        case "pem":
        case "der":
          d2.type = u[t];
      }
      return { scheme: u[0], keyType: m, keyOpt: d2 };
    }
    r(f, "n"), b(8226)._, C.exports = { pkcs1: b(6566), pkcs8: b(8573), components: b(3374), openssh: b(3194), isPrivateExport: r(function(u) {
      return C.exports[u] && typeof C.exports[u].privateExport == "function";
    }, "isPrivateExport"), isPrivateImport: r(function(u) {
      return C.exports[u] && typeof C.exports[u].privateImport == "function";
    }, "isPrivateImport"), isPublicExport: r(function(u) {
      return C.exports[u] && typeof C.exports[u].publicExport == "function";
    }, "isPublicExport"), isPublicImport: r(function(u) {
      return C.exports[u] && typeof C.exports[u].publicImport == "function";
    }, "isPublicImport"), detectAndImport: r(function(u, m, d2) {
      if (d2 === void 0) {
        for (var t in C.exports) if (typeof C.exports[t].autoImport == "function" && C.exports[t].autoImport(u, m)) return true;
      } else if (d2) {
        var g2 = f(d2);
        if (!C.exports[g2.scheme]) throw Error("Unsupported key format");
        g2.keyType === "private" ? C.exports[g2.scheme].privateImport(u, m, g2.keyOpt) : C.exports[g2.scheme].publicImport(u, m, g2.keyOpt);
      }
      return false;
    }, "detectAndImport"), detectAndExport: r(function(u, m) {
      if (m) {
        var d2 = f(m);
        if (C.exports[d2.scheme]) {
          if (d2.keyType === "private") {
            if (!u.isPrivate()) throw Error("This is not private key");
            return C.exports[d2.scheme].privateExport(u, d2.keyOpt);
          }
          if (!u.isPublic()) throw Error("This is not public key");
          return C.exports[d2.scheme].publicExport(u, d2.keyOpt);
        }
        throw Error("Unsupported key format");
      }
    }, "detectAndExport") };
  }, 3194: (C, j, b) => {
    var f = b(8287).Buffer, u = b(8226)._, m = b(8226), d2 = b(1973);
    let t = "-----BEGIN OPENSSH PRIVATE KEY-----", g2 = "-----END OPENSSH PRIVATE KEY-----";
    function i(y) {
      let l = y.buf.readInt32BE(y.off);
      y.off += 4;
      let v = y.buf.slice(y.off, y.off + l);
      return y.off += l, v;
    }
    r(i, "u");
    function o(y, l) {
      y.buf.writeInt32BE(l.byteLength, y.off), y.off += 4, y.off += l.copy(y.buf, y.off);
    }
    r(o, "c"), C.exports = { privateExport: r(function(y, l) {
      let v = y.n.toBuffer(), s = f.alloc(4);
      for (s.writeUInt32BE(y.e, 0); s[0] === 0; ) s = s.slice(1);
      let h = y.d.toBuffer(), p2 = y.coeff.toBuffer(), S = y.p.toBuffer(), B = y.q.toBuffer(), w;
      w = y.sshcomment !== void 0 ? f.from(y.sshcomment) : f.from([]);
      let P = 15 + s.byteLength + 4 + v.byteLength, F = 23 + v.byteLength + 4 + s.byteLength + 4 + h.byteLength + 4 + p2.byteLength + 4 + S.byteLength + 4 + B.byteLength + 4 + w.byteLength, I = 43 + P + 4 + F;
      I += 8 * Math.ceil(F / 8) - F;
      let k = f.alloc(I), A = { buf: k, off: 0 };
      k.write("openssh-key-v1", "utf8"), k.writeUInt8(0, 14), A.off += 15, o(A, f.from("none")), o(A, f.from("none")), o(A, f.from("")), A.off = A.buf.writeUInt32BE(1, A.off), A.off = A.buf.writeUInt32BE(P, A.off), o(A, f.from("ssh-rsa")), o(A, s), o(A, v), A.off = A.buf.writeUInt32BE(I - 47 - P, A.off), A.off += 8, o(A, f.from("ssh-rsa")), o(A, v), o(A, s), o(A, h), o(A, p2), o(A, S), o(A, B), o(A, w);
      let n = 1;
      for (; A.off < I; ) A.off = A.buf.writeUInt8(n++, A.off);
      return l.type === "der" ? A.buf : t + `
` + m.linebrk(k.toString("base64"), 70) + `
` + g2 + `
`;
    }, "privateExport"), privateImport: r(function(y, l, v) {
      var s;
      if ((v = v || {}).type !== "der") {
        if (f.isBuffer(l) && (l = l.toString("utf8")), !u.isString(l)) throw Error("Unsupported key format");
        var h = m.trimSurroundingText(l, t, g2).replace(/\s+|\n\r|\n|\r$/gm, "");
        s = f.from(h, "base64");
      } else {
        if (!f.isBuffer(l)) throw Error("Unsupported key format");
        s = l;
      }
      let p2 = { buf: s, off: 0 };
      if (s.slice(0, 14).toString("ascii") !== "openssh-key-v1") throw "Invalid file format.";
      if (p2.off += 15, i(p2).toString("ascii") !== "none" || i(p2).toString("ascii") !== "none" || i(p2).toString("ascii") !== "" || (p2.off += 4, p2.off += 4, i(p2).toString("ascii") !== "ssh-rsa") || (i(p2), i(p2), p2.off += 12, i(p2).toString("ascii") !== "ssh-rsa")) throw Error("Unsupported key type");
      let S = i(p2), B = i(p2), w = i(p2), P = i(p2), F = i(p2), I = i(p2), k = new d2(w), A = new d2(I), n = new d2(F), c = k.mod(n.subtract(d2.ONE)), _ = k.mod(A.subtract(d2.ONE));
      y.setPrivate(S, B, w, F, I, c.toBuffer(), _.toBuffer(), P), y.sshcomment = i(p2).toString("ascii");
    }, "privateImport"), publicExport: r(function(y, l) {
      let v = f.alloc(4);
      for (v.writeUInt32BE(y.e, 0); v[0] === 0; ) v = v.slice(1);
      let s = y.n.toBuffer(), h = f.alloc(v.byteLength + 4 + s.byteLength + 4 + 7 + 4), p2 = { buf: h, off: 0 };
      o(p2, f.from("ssh-rsa")), o(p2, v), o(p2, s);
      let S = y.sshcomment || "";
      return l.type === "der" ? p2.buf : "ssh-rsa " + h.toString("base64") + " " + S + `
`;
    }, "publicExport"), publicImport: r(function(y, l, v) {
      var s;
      if ((v = v || {}).type !== "der") {
        if (f.isBuffer(l) && (l = l.toString("utf8")), !u.isString(l)) throw Error("Unsupported key format");
        {
          if (l.substring(0, 8) !== "ssh-rsa ") throw Error("Unsupported key format");
          let w = l.indexOf(" ", 8);
          w === -1 ? w = l.length : y.sshcomment = l.substring(w + 1).replace(/\s+|\n\r|\n|\r$/gm, "");
          let P = l.substring(8, w).replace(/\s+|\n\r|\n|\r$/gm, "");
          s = f.from(P, "base64");
        }
      } else {
        if (!f.isBuffer(l)) throw Error("Unsupported key format");
        s = l;
      }
      let h = { buf: s, off: 0 }, p2 = i(h).toString("ascii");
      if (p2 !== "ssh-rsa") throw Error("Invalid key type: " + p2);
      let S = i(h), B = i(h);
      y.setPublic(B, S);
    }, "publicImport"), autoImport: r(function(y, l) {
      return /^[\S\s]*-----BEGIN OPENSSH PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END OPENSSH PRIVATE KEY-----[\S\s]*$/g.test(l) ? (C.exports.privateImport(y, l), true) : !!/^[\S\s]*ssh-rsa \s*(?=(([A-Za-z0-9+/=]+\s*)+))\1[\S\s]*$/g.test(l) && (C.exports.publicImport(y, l), true);
    }, "autoImport") };
  }, 6566: (C, j, b) => {
    var f = b(8287).Buffer, u = b(3100).Ber, m = b(8226)._, d2 = b(8226);
    let t = "-----BEGIN RSA PRIVATE KEY-----", g2 = "-----END RSA PRIVATE KEY-----", i = "-----BEGIN RSA PUBLIC KEY-----", o = "-----END RSA PUBLIC KEY-----";
    C.exports = { privateExport: r(function(y, l) {
      l = l || {};
      var v = y.n.toBuffer(), s = y.d.toBuffer(), h = y.p.toBuffer(), p2 = y.q.toBuffer(), S = y.dmp1.toBuffer(), B = y.dmq1.toBuffer(), w = y.coeff.toBuffer(), P = v.length + s.length + h.length + p2.length + S.length + B.length + w.length + 512, F = new u.Writer({ size: P });
      return F.startSequence(), F.writeInt(0), F.writeBuffer(v, 2), F.writeInt(y.e), F.writeBuffer(s, 2), F.writeBuffer(h, 2), F.writeBuffer(p2, 2), F.writeBuffer(S, 2), F.writeBuffer(B, 2), F.writeBuffer(w, 2), F.endSequence(), l.type === "der" ? F.buffer : t + `
` + d2.linebrk(F.buffer.toString("base64"), 64) + `
` + g2;
    }, "privateExport"), privateImport: r(function(y, l, v) {
      var s;
      if ((v = v || {}).type !== "der") {
        if (f.isBuffer(l) && (l = l.toString("utf8")), !m.isString(l)) throw Error("Unsupported key format");
        var h = d2.trimSurroundingText(l, t, g2).replace(/\s+|\n\r|\n|\r$/gm, "");
        s = f.from(h, "base64");
      } else {
        if (!f.isBuffer(l)) throw Error("Unsupported key format");
        s = l;
      }
      var p2 = new u.Reader(s);
      p2.readSequence(), p2.readString(2, true), y.setPrivate(p2.readString(2, true), p2.readString(2, true), p2.readString(2, true), p2.readString(2, true), p2.readString(2, true), p2.readString(2, true), p2.readString(2, true), p2.readString(2, true));
    }, "privateImport"), publicExport: r(function(y, l) {
      l = l || {};
      var v = y.n.toBuffer(), s = v.length + 512, h = new u.Writer({ size: s });
      return h.startSequence(), h.writeBuffer(v, 2), h.writeInt(y.e), h.endSequence(), l.type === "der" ? h.buffer : i + `
` + d2.linebrk(h.buffer.toString("base64"), 64) + `
` + o;
    }, "publicExport"), publicImport: r(function(y, l, v) {
      var s;
      if ((v = v || {}).type !== "der") {
        if (f.isBuffer(l) && (l = l.toString("utf8")), m.isString(l)) {
          var h = d2.trimSurroundingText(l, i, o).replace(/\s+|\n\r|\n|\r$/gm, "");
          s = f.from(h, "base64");
        }
      } else {
        if (!f.isBuffer(l)) throw Error("Unsupported key format");
        s = l;
      }
      var p2 = new u.Reader(s);
      p2.readSequence(), y.setPublic(p2.readString(2, true), p2.readString(2, true));
    }, "publicImport"), autoImport: r(function(y, l) {
      return /^[\S\s]*-----BEGIN RSA PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END RSA PRIVATE KEY-----[\S\s]*$/g.test(l) ? (C.exports.privateImport(y, l), true) : !!/^[\S\s]*-----BEGIN RSA PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END RSA PUBLIC KEY-----[\S\s]*$/g.test(l) && (C.exports.publicImport(y, l), true);
    }, "autoImport") };
  }, 8573: (C, j, b) => {
    var f = b(8287).Buffer, u = b(3100).Ber, m = b(8226)._, d2 = "1.2.840.113549.1.1.1", t = b(8226);
    let g2 = "-----BEGIN PRIVATE KEY-----", i = "-----END PRIVATE KEY-----", o = "-----BEGIN PUBLIC KEY-----", y = "-----END PUBLIC KEY-----";
    C.exports = { privateExport: r(function(l, v) {
      v = v || {};
      var s = l.n.toBuffer(), h = l.d.toBuffer(), p2 = l.p.toBuffer(), S = l.q.toBuffer(), B = l.dmp1.toBuffer(), w = l.dmq1.toBuffer(), P = l.coeff.toBuffer(), F = s.length + h.length + p2.length + S.length + B.length + w.length + P.length + 512, I = new u.Writer({ size: F });
      I.startSequence(), I.writeInt(0), I.writeBuffer(s, 2), I.writeInt(l.e), I.writeBuffer(h, 2), I.writeBuffer(p2, 2), I.writeBuffer(S, 2), I.writeBuffer(B, 2), I.writeBuffer(w, 2), I.writeBuffer(P, 2), I.endSequence();
      var k = new u.Writer({ size: F });
      return k.startSequence(), k.writeInt(0), k.startSequence(), k.writeOID(d2), k.writeNull(), k.endSequence(), k.writeBuffer(I.buffer, 4), k.endSequence(), v.type === "der" ? k.buffer : g2 + `
` + t.linebrk(k.buffer.toString("base64"), 64) + `
` + i;
    }, "privateExport"), privateImport: r(function(l, v, s) {
      var h;
      if ((s = s || {}).type !== "der") {
        if (f.isBuffer(v) && (v = v.toString("utf8")), !m.isString(v)) throw Error("Unsupported key format");
        var p2 = t.trimSurroundingText(v, g2, i).replace("-----END PRIVATE KEY-----", "").replace(/\s+|\n\r|\n|\r$/gm, "");
        h = f.from(p2, "base64");
      } else {
        if (!f.isBuffer(v)) throw Error("Unsupported key format");
        h = v;
      }
      var S = new u.Reader(h);
      if (S.readSequence(), S.readInt(0), new u.Reader(S.readString(48, true)).readOID(6, true) !== d2) throw Error("Invalid Public key format");
      var B = new u.Reader(S.readString(4, true));
      B.readSequence(), B.readString(2, true), l.setPrivate(B.readString(2, true), B.readString(2, true), B.readString(2, true), B.readString(2, true), B.readString(2, true), B.readString(2, true), B.readString(2, true), B.readString(2, true));
    }, "privateImport"), publicExport: r(function(l, v) {
      v = v || {};
      var s = l.n.toBuffer(), h = s.length + 512, p2 = new u.Writer({ size: h });
      p2.writeByte(0), p2.startSequence(), p2.writeBuffer(s, 2), p2.writeInt(l.e), p2.endSequence();
      var S = new u.Writer({ size: h });
      return S.startSequence(), S.startSequence(), S.writeOID(d2), S.writeNull(), S.endSequence(), S.writeBuffer(p2.buffer, 3), S.endSequence(), v.type === "der" ? S.buffer : o + `
` + t.linebrk(S.buffer.toString("base64"), 64) + `
` + y;
    }, "publicExport"), publicImport: r(function(l, v, s) {
      var h;
      if ((s = s || {}).type !== "der") {
        if (f.isBuffer(v) && (v = v.toString("utf8")), m.isString(v)) {
          var p2 = t.trimSurroundingText(v, o, y).replace(/\s+|\n\r|\n|\r$/gm, "");
          h = f.from(p2, "base64");
        }
      } else {
        if (!f.isBuffer(v)) throw Error("Unsupported key format");
        h = v;
      }
      var S = new u.Reader(h);
      if (S.readSequence(), new u.Reader(S.readString(48, true)).readOID(6, true) !== d2) throw Error("Invalid Public key format");
      var B = new u.Reader(S.readString(3, true));
      B.readByte(), B.readSequence(), l.setPublic(B.readString(2, true), B.readString(2, true));
    }, "publicImport"), autoImport: r(function(l, v) {
      return /^[\S\s]*-----BEGIN PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PRIVATE KEY-----[\S\s]*$/g.test(v) ? (C.exports.privateImport(l, v), true) : !!/^[\S\s]*-----BEGIN PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PUBLIC KEY-----[\S\s]*$/g.test(v) && (C.exports.publicImport(l, v), true);
    }, "autoImport") };
  }, 1973: (C, j, b) => {
    var f = b(8287).Buffer, u = b(3200), m = b(8226)._;
    function d2(e, a) {
      e != null && (typeof e == "number" ? this.fromNumber(e, a) : f.isBuffer(e) ? this.fromBuffer(e) : a == null && typeof e != "string" ? this.fromByteArray(e) : this.fromString(e, a));
    }
    r(d2, "s");
    function t() {
      return new d2(null);
    }
    r(t, "a"), d2.prototype.am = function(e, a, E, O, T, L) {
      for (var N = 16383 & a, U = a >> 14; --L >= 0; ) {
        var X = 16383 & this[e], Q = this[e++] >> 14, W = U * X + Q * N;
        T = ((X = N * X + ((16383 & W) << 14) + E[O] + T) >> 28) + (W >> 14) + U * Q, E[O++] = 268435455 & X;
      }
      return T;
    }, d2.prototype.DB = 28, d2.prototype.DM = 268435455, d2.prototype.DV = 268435456, d2.prototype.FV = Math.pow(2, 52), d2.prototype.F1 = 24, d2.prototype.F2 = 4;
    var g2, i, o = new Array();
    for (g2 = 48, i = 0; i <= 9; ++i) o[g2++] = i;
    for (g2 = 97, i = 10; i < 36; ++i) o[g2++] = i;
    for (g2 = 65, i = 10; i < 36; ++i) o[g2++] = i;
    function y(e) {
      return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(e);
    }
    r(y, "h");
    function l(e, a) {
      var E = o[e.charCodeAt(a)];
      return E ?? -1;
    }
    r(l, "p");
    function v(e) {
      var a = t();
      return a.fromInt(e), a;
    }
    r(v, "l");
    function s(e) {
      var a, E = 1;
      return (a = e >>> 16) != 0 && (e = a, E += 16), (a = e >> 8) != 0 && (e = a, E += 8), (a = e >> 4) != 0 && (e = a, E += 4), (a = e >> 2) != 0 && (e = a, E += 2), (a = e >> 1) != 0 && (e = a, E += 1), E;
    }
    r(s, "y");
    function h(e) {
      this.m = e;
    }
    r(h, "g");
    function p2(e) {
      this.m = e, this.mp = e.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << e.DB - 15) - 1, this.mt2 = 2 * e.t;
    }
    r(p2, "d");
    function S(e, a) {
      return e & a;
    }
    r(S, "v");
    function B(e, a) {
      return e | a;
    }
    r(B, "m");
    function w(e, a) {
      return e ^ a;
    }
    r(w, "S");
    function P(e, a) {
      return e & ~a;
    }
    r(P, "_");
    function F(e) {
      if (e === 0) return -1;
      var a = 0;
      return 65535 & e || (e >>= 16, a += 16), 255 & e || (e >>= 8, a += 8), 15 & e || (e >>= 4, a += 4), 3 & e || (e >>= 2, a += 2), 1 & e || ++a, a;
    }
    r(F, "b");
    function I(e) {
      for (var a = 0; e != 0; ) e &= e - 1, ++a;
      return a;
    }
    r(I, "E");
    function k() {
    }
    r(k, "w");
    function A(e) {
      return e;
    }
    r(A, "O");
    function n(e) {
      this.r2 = t(), this.q3 = t(), d2.ONE.dlShiftTo(2 * e.t, this.r2), this.mu = this.r2.divide(e), this.m = e;
    }
    r(n, "B"), h.prototype.convert = function(e) {
      return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e;
    }, h.prototype.revert = function(e) {
      return e;
    }, h.prototype.reduce = function(e) {
      e.divRemTo(this.m, null, e);
    }, h.prototype.mulTo = function(e, a, E) {
      e.multiplyTo(a, E), this.reduce(E);
    }, h.prototype.sqrTo = function(e, a) {
      e.squareTo(a), this.reduce(a);
    }, p2.prototype.convert = function(e) {
      var a = t();
      return e.abs().dlShiftTo(this.m.t, a), a.divRemTo(this.m, null, a), e.s < 0 && a.compareTo(d2.ZERO) > 0 && this.m.subTo(a, a), a;
    }, p2.prototype.revert = function(e) {
      var a = t();
      return e.copyTo(a), this.reduce(a), a;
    }, p2.prototype.reduce = function(e) {
      for (; e.t <= this.mt2; ) e[e.t++] = 0;
      for (var a = 0; a < this.m.t; ++a) {
        var E = 32767 & e[a], O = E * this.mpl + ((E * this.mph + (e[a] >> 15) * this.mpl & this.um) << 15) & e.DM;
        for (e[E = a + this.m.t] += this.m.am(0, O, e, a, 0, this.m.t); e[E] >= e.DV; ) e[E] -= e.DV, e[++E]++;
      }
      e.clamp(), e.drShiftTo(this.m.t, e), e.compareTo(this.m) >= 0 && e.subTo(this.m, e);
    }, p2.prototype.mulTo = function(e, a, E) {
      e.multiplyTo(a, E), this.reduce(E);
    }, p2.prototype.sqrTo = function(e, a) {
      e.squareTo(a), this.reduce(a);
    }, k.prototype.convert = A, k.prototype.revert = A, k.prototype.mulTo = function(e, a, E) {
      e.multiplyTo(a, E);
    }, k.prototype.sqrTo = function(e, a) {
      e.squareTo(a);
    }, n.prototype.convert = function(e) {
      if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m);
      if (e.compareTo(this.m) < 0) return e;
      var a = t();
      return e.copyTo(a), this.reduce(a), a;
    }, n.prototype.revert = function(e) {
      return e;
    }, n.prototype.reduce = function(e) {
      for (e.drShiftTo(this.m.t - 1, this.r2), e.t > this.m.t + 1 && (e.t = this.m.t + 1, e.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); e.compareTo(this.r2) < 0; ) e.dAddOffset(1, this.m.t + 1);
      for (e.subTo(this.r2, e); e.compareTo(this.m) >= 0; ) e.subTo(this.m, e);
    }, n.prototype.mulTo = function(e, a, E) {
      e.multiplyTo(a, E), this.reduce(E);
    }, n.prototype.sqrTo = function(e, a) {
      e.squareTo(a), this.reduce(a);
    };
    var c = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], _ = (1 << 26) / c[c.length - 1];
    d2.prototype.copyTo = function(e) {
      for (var a = this.t - 1; a >= 0; --a) e[a] = this[a];
      e.t = this.t, e.s = this.s;
    }, d2.prototype.fromInt = function(e) {
      this.t = 1, this.s = e < 0 ? -1 : 0, e > 0 ? this[0] = e : e < -1 ? this[0] = e + DV : this.t = 0;
    }, d2.prototype.fromString = function(e, a, E) {
      var O;
      switch (a) {
        case 2:
          O = 1;
          break;
        case 4:
          O = 2;
          break;
        case 8:
          O = 3;
          break;
        case 16:
          O = 4;
          break;
        case 32:
          O = 5;
          break;
        case 256:
          O = 8;
          break;
        default:
          return void this.fromRadix(e, a);
      }
      this.t = 0, this.s = 0;
      for (var T = e.length, L = false, N = 0; --T >= 0; ) {
        var U = O == 8 ? 255 & e[T] : l(e, T);
        U < 0 ? e.charAt(T) == "-" && (L = true) : (L = false, N === 0 ? this[this.t++] = U : N + O > this.DB ? (this[this.t - 1] |= (U & (1 << this.DB - N) - 1) << N, this[this.t++] = U >> this.DB - N) : this[this.t - 1] |= U << N, (N += O) >= this.DB && (N -= this.DB));
      }
      !E && O == 8 && 128 & e[0] && (this.s = -1, N > 0 && (this[this.t - 1] |= (1 << this.DB - N) - 1 << N)), this.clamp(), L && d2.ZERO.subTo(this, this);
    }, d2.prototype.fromByteArray = function(e, a) {
      this.fromString(e, 256, a);
    }, d2.prototype.fromBuffer = function(e) {
      this.fromString(e, 256, true);
    }, d2.prototype.clamp = function() {
      for (var e = this.s & this.DM; this.t > 0 && this[this.t - 1] == e; ) --this.t;
    }, d2.prototype.dlShiftTo = function(e, a) {
      var E;
      for (E = this.t - 1; E >= 0; --E) a[E + e] = this[E];
      for (E = e - 1; E >= 0; --E) a[E] = 0;
      a.t = this.t + e, a.s = this.s;
    }, d2.prototype.drShiftTo = function(e, a) {
      for (var E = e; E < this.t; ++E) a[E - e] = this[E];
      a.t = Math.max(this.t - e, 0), a.s = this.s;
    }, d2.prototype.lShiftTo = function(e, a) {
      var E, O = e % this.DB, T = this.DB - O, L = (1 << T) - 1, N = Math.floor(e / this.DB), U = this.s << O & this.DM;
      for (E = this.t - 1; E >= 0; --E) a[E + N + 1] = this[E] >> T | U, U = (this[E] & L) << O;
      for (E = N - 1; E >= 0; --E) a[E] = 0;
      a[N] = U, a.t = this.t + N + 1, a.s = this.s, a.clamp();
    }, d2.prototype.rShiftTo = function(e, a) {
      a.s = this.s;
      var E = Math.floor(e / this.DB);
      if (E >= this.t) a.t = 0;
      else {
        var O = e % this.DB, T = this.DB - O, L = (1 << O) - 1;
        a[0] = this[E] >> O;
        for (var N = E + 1; N < this.t; ++N) a[N - E - 1] |= (this[N] & L) << T, a[N - E] = this[N] >> O;
        O > 0 && (a[this.t - E - 1] |= (this.s & L) << T), a.t = this.t - E, a.clamp();
      }
    }, d2.prototype.subTo = function(e, a) {
      for (var E = 0, O = 0, T = Math.min(e.t, this.t); E < T; ) O += this[E] - e[E], a[E++] = O & this.DM, O >>= this.DB;
      if (e.t < this.t) {
        for (O -= e.s; E < this.t; ) O += this[E], a[E++] = O & this.DM, O >>= this.DB;
        O += this.s;
      } else {
        for (O += this.s; E < e.t; ) O -= e[E], a[E++] = O & this.DM, O >>= this.DB;
        O -= e.s;
      }
      a.s = O < 0 ? -1 : 0, O < -1 ? a[E++] = this.DV + O : O > 0 && (a[E++] = O), a.t = E, a.clamp();
    }, d2.prototype.multiplyTo = function(e, a) {
      var E = this.abs(), O = e.abs(), T = E.t;
      for (a.t = T + O.t; --T >= 0; ) a[T] = 0;
      for (T = 0; T < O.t; ++T) a[T + E.t] = E.am(0, O[T], a, T, 0, E.t);
      a.s = 0, a.clamp(), this.s != e.s && d2.ZERO.subTo(a, a);
    }, d2.prototype.squareTo = function(e) {
      for (var a = this.abs(), E = e.t = 2 * a.t; --E >= 0; ) e[E] = 0;
      for (E = 0; E < a.t - 1; ++E) {
        var O = a.am(E, a[E], e, 2 * E, 0, 1);
        (e[E + a.t] += a.am(E + 1, 2 * a[E], e, 2 * E + 1, O, a.t - E - 1)) >= a.DV && (e[E + a.t] -= a.DV, e[E + a.t + 1] = 1);
      }
      e.t > 0 && (e[e.t - 1] += a.am(E, a[E], e, 2 * E, 0, 1)), e.s = 0, e.clamp();
    }, d2.prototype.divRemTo = function(e, a, E) {
      var O = e.abs();
      if (!(O.t <= 0)) {
        var T = this.abs();
        if (T.t < O.t) return a?.fromInt(0), void (E != null && this.copyTo(E));
        E == null && (E = t());
        var L = t(), N = this.s, U = e.s, X = this.DB - s(O[O.t - 1]);
        X > 0 ? (O.lShiftTo(X, L), T.lShiftTo(X, E)) : (O.copyTo(L), T.copyTo(E));
        var Q = L.t, W = L[Q - 1];
        if (W !== 0) {
          var J = W * (1 << this.F1) + (Q > 1 ? L[Q - 2] >> this.F2 : 0), V = this.FV / J, z = (1 << this.F1) / J, D = 1 << this.F2, x = E.t, R = x - Q, K = a ?? t();
          for (L.dlShiftTo(R, K), E.compareTo(K) >= 0 && (E[E.t++] = 1, E.subTo(K, E)), d2.ONE.dlShiftTo(Q, K), K.subTo(L, L); L.t < Q; ) L[L.t++] = 0;
          for (; --R >= 0; ) {
            var H = E[--x] == W ? this.DM : Math.floor(E[x] * V + (E[x - 1] + D) * z);
            if ((E[x] += L.am(0, H, E, R, 0, Q)) < H) for (L.dlShiftTo(R, K), E.subTo(K, E); E[x] < --H; ) E.subTo(K, E);
          }
          a != null && (E.drShiftTo(Q, a), N != U && d2.ZERO.subTo(a, a)), E.t = Q, E.clamp(), X > 0 && E.rShiftTo(X, E), N < 0 && d2.ZERO.subTo(E, E);
        }
      }
    }, d2.prototype.invDigit = function() {
      if (this.t < 1) return 0;
      var e = this[0];
      if (!(1 & e)) return 0;
      var a = 3 & e;
      return (a = (a = (a = (a = a * (2 - (15 & e) * a) & 15) * (2 - (255 & e) * a) & 255) * (2 - ((65535 & e) * a & 65535)) & 65535) * (2 - e * a % this.DV) % this.DV) > 0 ? this.DV - a : -a;
    }, d2.prototype.isEven = function() {
      return (this.t > 0 ? 1 & this[0] : this.s) === 0;
    }, d2.prototype.exp = function(e, a) {
      if (e > 4294967295 || e < 1) return d2.ONE;
      var E = t(), O = t(), T = a.convert(this), L = s(e) - 1;
      for (T.copyTo(E); --L >= 0; ) if (a.sqrTo(E, O), (e & 1 << L) > 0) a.mulTo(O, T, E);
      else {
        var N = E;
        E = O, O = N;
      }
      return a.revert(E);
    }, d2.prototype.chunkSize = function(e) {
      return Math.floor(Math.LN2 * this.DB / Math.log(e));
    }, d2.prototype.toRadix = function(e) {
      if (e == null && (e = 10), this.signum() === 0 || e < 2 || e > 36) return "0";
      var a = this.chunkSize(e), E = Math.pow(e, a), O = v(E), T = t(), L = t(), N = "";
      for (this.divRemTo(O, T, L); T.signum() > 0; ) N = (E + L.intValue()).toString(e).substr(1) + N, T.divRemTo(O, T, L);
      return L.intValue().toString(e) + N;
    }, d2.prototype.fromRadix = function(e, a) {
      this.fromInt(0), a == null && (a = 10);
      for (var E = this.chunkSize(a), O = Math.pow(a, E), T = false, L = 0, N = 0, U = 0; U < e.length; ++U) {
        var X = l(e, U);
        X < 0 ? e.charAt(U) == "-" && this.signum() === 0 && (T = true) : (N = a * N + X, ++L >= E && (this.dMultiply(O), this.dAddOffset(N, 0), L = 0, N = 0));
      }
      L > 0 && (this.dMultiply(Math.pow(a, L)), this.dAddOffset(N, 0)), T && d2.ZERO.subTo(this, this);
    }, d2.prototype.fromNumber = function(e, a) {
      if (typeof a == "number") if (e < 2) this.fromInt(1);
      else for (this.fromNumber(e), this.testBit(e - 1) || this.bitwiseTo(d2.ONE.shiftLeft(e - 1), B, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(a); ) this.dAddOffset(2, 0), this.bitLength() > e && this.subTo(d2.ONE.shiftLeft(e - 1), this);
      else {
        var E = u.randomBytes(1 + (e >> 3)), O = 7 & e;
        O > 0 ? E[0] &= (1 << O) - 1 : E[0] = 0, this.fromByteArray(E);
      }
    }, d2.prototype.bitwiseTo = function(e, a, E) {
      var O, T, L = Math.min(e.t, this.t);
      for (O = 0; O < L; ++O) E[O] = a(this[O], e[O]);
      if (e.t < this.t) {
        for (T = e.s & this.DM, O = L; O < this.t; ++O) E[O] = a(this[O], T);
        E.t = this.t;
      } else {
        for (T = this.s & this.DM, O = L; O < e.t; ++O) E[O] = a(T, e[O]);
        E.t = e.t;
      }
      E.s = a(this.s, e.s), E.clamp();
    }, d2.prototype.changeBit = function(e, a) {
      var E = d2.ONE.shiftLeft(e);
      return this.bitwiseTo(E, a, E), E;
    }, d2.prototype.addTo = function(e, a) {
      for (var E = 0, O = 0, T = Math.min(e.t, this.t); E < T; ) O += this[E] + e[E], a[E++] = O & this.DM, O >>= this.DB;
      if (e.t < this.t) {
        for (O += e.s; E < this.t; ) O += this[E], a[E++] = O & this.DM, O >>= this.DB;
        O += this.s;
      } else {
        for (O += this.s; E < e.t; ) O += e[E], a[E++] = O & this.DM, O >>= this.DB;
        O += e.s;
      }
      a.s = O < 0 ? -1 : 0, O > 0 ? a[E++] = O : O < -1 && (a[E++] = this.DV + O), a.t = E, a.clamp();
    }, d2.prototype.dMultiply = function(e) {
      this[this.t] = this.am(0, e - 1, this, 0, 0, this.t), ++this.t, this.clamp();
    }, d2.prototype.dAddOffset = function(e, a) {
      if (e !== 0) {
        for (; this.t <= a; ) this[this.t++] = 0;
        for (this[a] += e; this[a] >= this.DV; ) this[a] -= this.DV, ++a >= this.t && (this[this.t++] = 0), ++this[a];
      }
    }, d2.prototype.multiplyLowerTo = function(e, a, E) {
      var O, T = Math.min(this.t + e.t, a);
      for (E.s = 0, E.t = T; T > 0; ) E[--T] = 0;
      for (O = E.t - this.t; T < O; ++T) E[T + this.t] = this.am(0, e[T], E, T, 0, this.t);
      for (O = Math.min(e.t, a); T < O; ++T) this.am(0, e[T], E, T, 0, a - T);
      E.clamp();
    }, d2.prototype.multiplyUpperTo = function(e, a, E) {
      --a;
      var O = E.t = this.t + e.t - a;
      for (E.s = 0; --O >= 0; ) E[O] = 0;
      for (O = Math.max(a - this.t, 0); O < e.t; ++O) E[this.t + O - a] = this.am(a - O, e[O], E, 0, 0, this.t + O - a);
      E.clamp(), E.drShiftTo(1, E);
    }, d2.prototype.modInt = function(e) {
      if (e <= 0) return 0;
      var a = this.DV % e, E = this.s < 0 ? e - 1 : 0;
      if (this.t > 0) if (a === 0) E = this[0] % e;
      else for (var O = this.t - 1; O >= 0; --O) E = (a * E + this[O]) % e;
      return E;
    }, d2.prototype.millerRabin = function(e) {
      var a = this.subtract(d2.ONE), E = a.getLowestSetBit();
      if (E <= 0) return false;
      var O = a.shiftRight(E);
      (e = e + 1 >> 1) > c.length && (e = c.length);
      for (var T = t(), L = 0; L < e; ++L) {
        T.fromInt(c[Math.floor(Math.random() * c.length)]);
        var N = T.modPow(O, this);
        if (N.compareTo(d2.ONE) != 0 && N.compareTo(a) != 0) {
          for (var U = 1; U++ < E && N.compareTo(a) != 0; ) if ((N = N.modPowInt(2, this)).compareTo(d2.ONE) === 0) return false;
          if (N.compareTo(a) != 0) return false;
        }
      }
      return true;
    }, d2.prototype.toString = function(e) {
      if (this.s < 0) return "-" + this.negate().toString(e);
      var a;
      if (e == 16) a = 4;
      else if (e == 8) a = 3;
      else if (e == 2) a = 1;
      else if (e == 32) a = 5;
      else {
        if (e != 4) return this.toRadix(e);
        a = 2;
      }
      var E, O = (1 << a) - 1, T = false, L = "", N = this.t, U = this.DB - N * this.DB % a;
      if (N-- > 0) for (U < this.DB && (E = this[N] >> U) > 0 && (T = true, L = y(E)); N >= 0; ) U < a ? (E = (this[N] & (1 << U) - 1) << a - U, E |= this[--N] >> (U += this.DB - a)) : (E = this[N] >> (U -= a) & O, U <= 0 && (U += this.DB, --N)), E > 0 && (T = true), T && (L += y(E));
      return T ? L : "0";
    }, d2.prototype.negate = function() {
      var e = t();
      return d2.ZERO.subTo(this, e), e;
    }, d2.prototype.abs = function() {
      return this.s < 0 ? this.negate() : this;
    }, d2.prototype.compareTo = function(e) {
      var a = this.s - e.s;
      if (a != 0) return a;
      var E = this.t;
      if ((a = E - e.t) != 0) return this.s < 0 ? -a : a;
      for (; --E >= 0; ) if ((a = this[E] - e[E]) != 0) return a;
      return 0;
    }, d2.prototype.bitLength = function() {
      return this.t <= 0 ? 0 : this.DB * (this.t - 1) + s(this[this.t - 1] ^ this.s & this.DM);
    }, d2.prototype.mod = function(e) {
      var a = t();
      return this.abs().divRemTo(e, null, a), this.s < 0 && a.compareTo(d2.ZERO) > 0 && e.subTo(a, a), a;
    }, d2.prototype.modPowInt = function(e, a) {
      var E;
      return E = e < 256 || a.isEven() ? new h(a) : new p2(a), this.exp(e, E);
    }, d2.prototype.clone = function() {
      var e = t();
      return this.copyTo(e), e;
    }, d2.prototype.intValue = function() {
      if (this.s < 0) {
        if (this.t == 1) return this[0] - this.DV;
        if (this.t === 0) return -1;
      } else {
        if (this.t == 1) return this[0];
        if (this.t === 0) return 0;
      }
      return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
    }, d2.prototype.byteValue = function() {
      return this.t == 0 ? this.s : this[0] << 24 >> 24;
    }, d2.prototype.shortValue = function() {
      return this.t == 0 ? this.s : this[0] << 16 >> 16;
    }, d2.prototype.signum = function() {
      return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this[0] <= 0 ? 0 : 1;
    }, d2.prototype.toByteArray = function() {
      var e = this.t, a = new Array();
      a[0] = this.s;
      var E, O = this.DB - e * this.DB % 8, T = 0;
      if (e-- > 0) for (O < this.DB && (E = this[e] >> O) != (this.s & this.DM) >> O && (a[T++] = E | this.s << this.DB - O); e >= 0; ) O < 8 ? (E = (this[e] & (1 << O) - 1) << 8 - O, E |= this[--e] >> (O += this.DB - 8)) : (E = this[e] >> (O -= 8) & 255, O <= 0 && (O += this.DB, --e)), 128 & E && (E |= -256), T === 0 && (128 & this.s) != (128 & E) && ++T, (T > 0 || E != this.s) && (a[T++] = E);
      return a;
    }, d2.prototype.toBuffer = function(e) {
      var a = f.from(this.toByteArray());
      if (e === true && a[0] === 0) a = a.slice(1);
      else if (m.isNumber(e)) {
        if (a.length > e) {
          for (var E = 0; E < a.length - e; E++) if (a[E] !== 0) return null;
          return a.slice(a.length - e);
        }
        if (a.length < e) {
          var O = f.alloc(e);
          return O.fill(0, 0, e - a.length), a.copy(O, e - a.length), O;
        }
      }
      return a;
    }, d2.prototype.equals = function(e) {
      return this.compareTo(e) == 0;
    }, d2.prototype.min = function(e) {
      return this.compareTo(e) < 0 ? this : e;
    }, d2.prototype.max = function(e) {
      return this.compareTo(e) > 0 ? this : e;
    }, d2.prototype.and = function(e) {
      var a = t();
      return this.bitwiseTo(e, S, a), a;
    }, d2.prototype.or = function(e) {
      var a = t();
      return this.bitwiseTo(e, B, a), a;
    }, d2.prototype.xor = function(e) {
      var a = t();
      return this.bitwiseTo(e, w, a), a;
    }, d2.prototype.andNot = function(e) {
      var a = t();
      return this.bitwiseTo(e, P, a), a;
    }, d2.prototype.not = function() {
      for (var e = t(), a = 0; a < this.t; ++a) e[a] = this.DM & ~this[a];
      return e.t = this.t, e.s = ~this.s, e;
    }, d2.prototype.shiftLeft = function(e) {
      var a = t();
      return e < 0 ? this.rShiftTo(-e, a) : this.lShiftTo(e, a), a;
    }, d2.prototype.shiftRight = function(e) {
      var a = t();
      return e < 0 ? this.lShiftTo(-e, a) : this.rShiftTo(e, a), a;
    }, d2.prototype.getLowestSetBit = function() {
      for (var e = 0; e < this.t; ++e) if (this[e] != 0) return e * this.DB + F(this[e]);
      return this.s < 0 ? this.t * this.DB : -1;
    }, d2.prototype.bitCount = function() {
      for (var e = 0, a = this.s & this.DM, E = 0; E < this.t; ++E) e += I(this[E] ^ a);
      return e;
    }, d2.prototype.testBit = function(e) {
      var a = Math.floor(e / this.DB);
      return a >= this.t ? this.s != 0 : !!(this[a] & 1 << e % this.DB);
    }, d2.prototype.setBit = function(e) {
      return this.changeBit(e, B);
    }, d2.prototype.clearBit = function(e) {
      return this.changeBit(e, P);
    }, d2.prototype.flipBit = function(e) {
      return this.changeBit(e, w);
    }, d2.prototype.add = function(e) {
      var a = t();
      return this.addTo(e, a), a;
    }, d2.prototype.subtract = function(e) {
      var a = t();
      return this.subTo(e, a), a;
    }, d2.prototype.multiply = function(e) {
      var a = t();
      return this.multiplyTo(e, a), a;
    }, d2.prototype.divide = function(e) {
      var a = t();
      return this.divRemTo(e, a, null), a;
    }, d2.prototype.remainder = function(e) {
      var a = t();
      return this.divRemTo(e, null, a), a;
    }, d2.prototype.divideAndRemainder = function(e) {
      var a = t(), E = t();
      return this.divRemTo(e, a, E), new Array(a, E);
    }, d2.prototype.modPow = function(e, a) {
      var E, O, T = e.bitLength(), L = v(1);
      if (T <= 0) return L;
      E = T < 18 ? 1 : T < 48 ? 3 : T < 144 ? 4 : T < 768 ? 5 : 6, O = T < 8 ? new h(a) : a.isEven() ? new n(a) : new p2(a);
      var N = new Array(), U = 3, X = E - 1, Q = (1 << E) - 1;
      if (N[1] = O.convert(this), E > 1) {
        var W = t();
        for (O.sqrTo(N[1], W); U <= Q; ) N[U] = t(), O.mulTo(W, N[U - 2], N[U]), U += 2;
      }
      var J, V, z = e.t - 1, D = true, x = t();
      for (T = s(e[z]) - 1; z >= 0; ) {
        for (T >= X ? J = e[z] >> T - X & Q : (J = (e[z] & (1 << T + 1) - 1) << X - T, z > 0 && (J |= e[z - 1] >> this.DB + T - X)), U = E; !(1 & J); ) J >>= 1, --U;
        if ((T -= U) < 0 && (T += this.DB, --z), D) N[J].copyTo(L), D = false;
        else {
          for (; U > 1; ) O.sqrTo(L, x), O.sqrTo(x, L), U -= 2;
          U > 0 ? O.sqrTo(L, x) : (V = L, L = x, x = V), O.mulTo(x, N[J], L);
        }
        for (; z >= 0 && !(e[z] & 1 << T); ) O.sqrTo(L, x), V = L, L = x, x = V, --T < 0 && (T = this.DB - 1, --z);
      }
      return O.revert(L);
    }, d2.prototype.modInverse = function(e) {
      var a = e.isEven();
      if (this.isEven() && a || e.signum() === 0) return d2.ZERO;
      for (var E = e.clone(), O = this.clone(), T = v(1), L = v(0), N = v(0), U = v(1); E.signum() != 0; ) {
        for (; E.isEven(); ) E.rShiftTo(1, E), a ? (T.isEven() && L.isEven() || (T.addTo(this, T), L.subTo(e, L)), T.rShiftTo(1, T)) : L.isEven() || L.subTo(e, L), L.rShiftTo(1, L);
        for (; O.isEven(); ) O.rShiftTo(1, O), a ? (N.isEven() && U.isEven() || (N.addTo(this, N), U.subTo(e, U)), N.rShiftTo(1, N)) : U.isEven() || U.subTo(e, U), U.rShiftTo(1, U);
        E.compareTo(O) >= 0 ? (E.subTo(O, E), a && T.subTo(N, T), L.subTo(U, L)) : (O.subTo(E, O), a && N.subTo(T, N), U.subTo(L, U));
      }
      return O.compareTo(d2.ONE) != 0 ? d2.ZERO : U.compareTo(e) >= 0 ? U.subtract(e) : U.signum() < 0 ? (U.addTo(e, U), U.signum() < 0 ? U.add(e) : U) : U;
    }, d2.prototype.pow = function(e) {
      return this.exp(e, new k());
    }, d2.prototype.gcd = function(e) {
      var a = this.s < 0 ? this.negate() : this.clone(), E = e.s < 0 ? e.negate() : e.clone();
      if (a.compareTo(E) < 0) {
        var O = a;
        a = E, E = O;
      }
      var T = a.getLowestSetBit(), L = E.getLowestSetBit();
      if (L < 0) return a;
      for (T < L && (L = T), L > 0 && (a.rShiftTo(L, a), E.rShiftTo(L, E)); a.signum() > 0; ) (T = a.getLowestSetBit()) > 0 && a.rShiftTo(T, a), (T = E.getLowestSetBit()) > 0 && E.rShiftTo(T, E), a.compareTo(E) >= 0 ? (a.subTo(E, a), a.rShiftTo(1, a)) : (E.subTo(a, E), E.rShiftTo(1, E));
      return L > 0 && E.lShiftTo(L, E), E;
    }, d2.prototype.isProbablePrime = function(e) {
      var a, E = this.abs();
      if (E.t == 1 && E[0] <= c[c.length - 1]) {
        for (a = 0; a < c.length; ++a) if (E[0] == c[a]) return true;
        return false;
      }
      if (E.isEven()) return false;
      for (a = 1; a < c.length; ) {
        for (var O = c[a], T = a + 1; T < c.length && O < _; ) O *= c[T++];
        for (O = E.modInt(O); a < T; ) if (O % c[a++] == 0) return false;
      }
      return E.millerRabin(e);
    }, d2.int2char = y, d2.ZERO = v(0), d2.ONE = v(1), d2.prototype.square = function() {
      var e = t();
      return this.squareTo(e), e;
    }, C.exports = d2;
  }, 5682: (C, j, b) => {
    var f = b(8287).Buffer, u = b(8226)._, m = (b(3200), b(1973)), d2 = b(8226), t = b(1768), g2 = b(4538);
    j.BigInteger = m, C.exports.Key = (function() {
      function i() {
        this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null;
      }
      return r(i, "t"), i.prototype.setOptions = function(o) {
        var y = t[o.signingScheme], l = t[o.encryptionScheme];
        y === l ? this.signingScheme = this.encryptionScheme = l.makeScheme(this, o) : (this.encryptionScheme = l.makeScheme(this, o), this.signingScheme = y.makeScheme(this, o)), this.encryptEngine = g2.getEngine(this, o);
      }, i.prototype.generate = function(o, y) {
        var l = o >> 1;
        this.e = parseInt(y, 16);
        for (var v = new m(y, 16); ; ) {
          for (; this.p = new m(o - l, 1), this.p.subtract(m.ONE).gcd(v).compareTo(m.ONE) !== 0 || !this.p.isProbablePrime(10); ) ;
          for (; this.q = new m(l, 1), this.q.subtract(m.ONE).gcd(v).compareTo(m.ONE) !== 0 || !this.q.isProbablePrime(10); ) ;
          if (this.p.compareTo(this.q) <= 0) {
            var s = this.p;
            this.p = this.q, this.q = s;
          }
          var h = this.p.subtract(m.ONE), p2 = this.q.subtract(m.ONE), S = h.multiply(p2);
          if (S.gcd(v).compareTo(m.ONE) === 0) {
            if (this.n = this.p.multiply(this.q), this.n.bitLength() < o) continue;
            this.d = v.modInverse(S), this.dmp1 = this.d.mod(h), this.dmq1 = this.d.mod(p2), this.coeff = this.q.modInverse(this.p);
            break;
          }
        }
        this.$$recalculateCache();
      }, i.prototype.setPrivate = function(o, y, l, v, s, h, p2, S) {
        if (!(o && y && l && o.length > 0 && (u.isNumber(y) || y.length > 0) && l.length > 0)) throw Error("Invalid RSA private key");
        this.n = new m(o), this.e = u.isNumber(y) ? y : d2.get32IntFromBuffer(y, 0), this.d = new m(l), v && s && h && p2 && S && (this.p = new m(v), this.q = new m(s), this.dmp1 = new m(h), this.dmq1 = new m(p2), this.coeff = new m(S)), this.$$recalculateCache();
      }, i.prototype.setPublic = function(o, y) {
        if (!(o && y && o.length > 0 && (u.isNumber(y) || y.length > 0))) throw Error("Invalid RSA public key");
        this.n = new m(o), this.e = u.isNumber(y) ? y : d2.get32IntFromBuffer(y, 0), this.$$recalculateCache();
      }, i.prototype.$doPrivate = function(o) {
        if (this.p || this.q) return o.modPow(this.d, this.n);
        for (var y = o.mod(this.p).modPow(this.dmp1, this.p), l = o.mod(this.q).modPow(this.dmq1, this.q); y.compareTo(l) < 0; ) y = y.add(this.p);
        return y.subtract(l).multiply(this.coeff).mod(this.p).multiply(this.q).add(l);
      }, i.prototype.$doPublic = function(o) {
        return o.modPowInt(this.e, this.n);
      }, i.prototype.encrypt = function(o, y) {
        var l = [], v = [], s = o.length, h = Math.ceil(s / this.maxMessageLength) || 1, p2 = Math.ceil(s / h || 1);
        if (h == 1) l.push(o);
        else for (var S = 0; S < h; S++) l.push(o.slice(S * p2, (S + 1) * p2));
        for (var B = 0; B < l.length; B++) v.push(this.encryptEngine.encrypt(l[B], y));
        return f.concat(v);
      }, i.prototype.decrypt = function(o, y) {
        if (o.length % this.encryptedDataLength > 0) throw Error("Incorrect data or key");
        for (var l = [], v = 0, s = 0, h = o.length / this.encryptedDataLength, p2 = 0; p2 < h; p2++) s = (v = p2 * this.encryptedDataLength) + this.encryptedDataLength, l.push(this.encryptEngine.decrypt(o.slice(v, Math.min(s, o.length)), y));
        return f.concat(l);
      }, i.prototype.sign = function(o) {
        return this.signingScheme.sign.apply(this.signingScheme, arguments);
      }, i.prototype.verify = function(o, y, l) {
        return this.signingScheme.verify.apply(this.signingScheme, arguments);
      }, i.prototype.isPrivate = function() {
        return !!(this.n && this.e && this.d);
      }, i.prototype.isPublic = function(o) {
        return this.n && this.e && !(o && this.d) || false;
      }, Object.defineProperty(i.prototype, "keySize", { get: r(function() {
        return this.cache.keyBitLength;
      }, "get") }), Object.defineProperty(i.prototype, "encryptedDataLength", { get: r(function() {
        return this.cache.keyByteLength;
      }, "get") }), Object.defineProperty(i.prototype, "maxMessageLength", { get: r(function() {
        return this.encryptionScheme.maxMessageLength();
      }, "get") }), i.prototype.$$recalculateCache = function() {
        this.cache = this.cache || {}, this.cache.keyBitLength = this.n.bitLength(), this.cache.keyByteLength = this.cache.keyBitLength + 6 >> 3;
      }, i;
    })();
  }, 2487: (C, j, b) => {
    var f = b(8287).Buffer, u = (b(1973), b(3200));
    C.exports = { isEncryption: true, isSignature: false }, C.exports.digestLength = { md4: 16, md5: 16, ripemd160: 20, rmd160: 20, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64 };
    var m = "sha1";
    C.exports.eme_oaep_mgf1 = function(d2, t, g2) {
      g2 = g2 || m;
      for (var i = C.exports.digestLength[g2], o = Math.ceil(t / i), y = f.alloc(i * o), l = f.alloc(4), v = 0; v < o; ++v) {
        var s = u.createHash(g2);
        s.update(d2), l.writeUInt32BE(v, 0), s.update(l), s.digest().copy(y, v * i);
      }
      return y.slice(0, t);
    }, C.exports.makeScheme = function(d2, t) {
      function g2(i, o) {
        this.key = i, this.options = o;
      }
      return r(g2, "s"), g2.prototype.maxMessageLength = function() {
        return this.key.encryptedDataLength - 2 * C.exports.digestLength[this.options.encryptionSchemeOptions.hash || m] - 2;
      }, g2.prototype.encPad = function(i) {
        var o = this.options.encryptionSchemeOptions.hash || m, y = this.options.encryptionSchemeOptions.mgf || C.exports.eme_oaep_mgf1, l = this.options.encryptionSchemeOptions.label || f.alloc(0), v = this.key.encryptedDataLength, s = C.exports.digestLength[o];
        if (i.length > v - 2 * s - 2) throw new Error("Message is too long to encode into an encoded message with a length of " + v + " bytes, increaseemLen to fix this error (minimum value for given parameters and options: " + (v - 2 * s - 2) + ")");
        var h = u.createHash(o);
        h.update(l), h = h.digest();
        var p2 = f.alloc(v - i.length - 2 * s - 1);
        p2.fill(0), p2[p2.length - 1] = 1;
        for (var S = f.concat([h, p2, i]), B = u.randomBytes(s), w = y(B, S.length, o), P = 0; P < S.length; P++) S[P] ^= w[P];
        for (w = y(S, s, o), P = 0; P < B.length; P++) B[P] ^= w[P];
        var F = f.alloc(1 + B.length + S.length);
        return F[0] = 0, B.copy(F, 1), S.copy(F, 1 + B.length), F;
      }, g2.prototype.encUnPad = function(i) {
        var o = this.options.encryptionSchemeOptions.hash || m, y = this.options.encryptionSchemeOptions.mgf || C.exports.eme_oaep_mgf1, l = this.options.encryptionSchemeOptions.label || f.alloc(0), v = C.exports.digestLength[o];
        if (i.length < 2 * v + 2) throw new Error("Error decoding message, the supplied message is not long enough to be a valid OAEP encoded message");
        for (var s = i.slice(1, v + 1), h = i.slice(1 + v), p2 = y(h, v, o), S = 0; S < s.length; S++) s[S] ^= p2[S];
        for (p2 = y(s, h.length, o), S = 0; S < h.length; S++) h[S] ^= p2[S];
        var B = u.createHash(o);
        if (B.update(l), B = B.digest(), h.slice(0, v).toString("hex") != B.toString("hex")) throw new Error("Error decoding message, the lHash calculated from the label provided and the lHash in the encrypted data do not match.");
        for (S = v; h[S++] === 0 && S < h.length; ) ;
        if (h[S - 1] != 1) throw new Error("Error decoding message, there is no padding message separator byte");
        return h.slice(S);
      }, new g2(d2, t);
    };
  }, 8290: (C, j, b) => {
    var f = b(8287).Buffer, u = b(1973), m = b(3200), d2 = b(7449), t = { md2: f.from("3020300c06082a864886f70d020205000410", "hex"), md5: f.from("3020300c06082a864886f70d020505000410", "hex"), sha1: f.from("3021300906052b0e03021a05000414", "hex"), sha224: f.from("302d300d06096086480165030402040500041c", "hex"), sha256: f.from("3031300d060960864801650304020105000420", "hex"), sha384: f.from("3041300d060960864801650304020205000430", "hex"), sha512: f.from("3051300d060960864801650304020305000440", "hex"), ripemd160: f.from("3021300906052b2403020105000414", "hex"), rmd160: f.from("3021300906052b2403020105000414", "hex") }, g2 = { ripemd160: "rmd160" }, i = "sha256";
    C.exports = { isEncryption: true, isSignature: true }, C.exports.makeScheme = function(o, y) {
      function l(v, s) {
        this.key = v, this.options = s;
      }
      return r(l, "r"), l.prototype.maxMessageLength = function() {
        return this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == d2.RSA_NO_PADDING ? this.key.encryptedDataLength : this.key.encryptedDataLength - 11;
      }, l.prototype.encPad = function(v, s) {
        var h;
        if (s = s || {}, v.length > this.key.maxMessageLength) throw new Error("Message too long for RSA (n=" + this.key.encryptedDataLength + ", l=" + v.length + ")");
        if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == d2.RSA_NO_PADDING) return (h = f.alloc(this.key.maxMessageLength - v.length)).fill(0), f.concat([h, v]);
        if (s.type === 1) return (h = f.alloc(this.key.encryptedDataLength - v.length - 1)).fill(255, 0, h.length - 1), h[0] = 1, h[h.length - 1] = 0, f.concat([h, v]);
        (h = f.alloc(this.key.encryptedDataLength - v.length))[0] = 0, h[1] = 2;
        for (var p2 = m.randomBytes(h.length - 3), S = 0; S < p2.length; S++) {
          for (var B = p2[S]; B === 0; ) B = m.randomBytes(1)[0];
          h[S + 2] = B;
        }
        return h[h.length - 1] = 0, f.concat([h, v]);
      }, l.prototype.encUnPad = function(v, s) {
        s = s || {};
        var h = 0;
        if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == d2.RSA_NO_PADDING) return typeof v.lastIndexOf == "function" ? v.slice(v.lastIndexOf("\0") + 1, v.length) : v.slice(String.prototype.lastIndexOf.call(v, "\0") + 1, v.length);
        if (v.length < 4) return null;
        if (s.type === 1) {
          if (v[0] !== 0 || v[1] !== 1) return null;
          for (h = 3; v[h] !== 0; ) if (v[h] != 255 || ++h >= v.length) return null;
        } else {
          if (v[0] !== 0 || v[1] !== 2) return null;
          for (h = 3; v[h] !== 0; ) if (++h >= v.length) return null;
        }
        return v.slice(h + 1, v.length);
      }, l.prototype.sign = function(v) {
        var s = this.options.signingSchemeOptions.hash || i;
        if (this.options.environment === "browser") {
          s = g2[s] || s;
          var h = m.createHash(s);
          h.update(v);
          var p2 = this.pkcs1pad(h.digest(), s);
          return this.key.$doPrivate(new u(p2)).toBuffer(this.key.encryptedDataLength);
        }
        var S = m.createSign("RSA-" + s.toUpperCase());
        return S.update(v), S.sign(this.options.rsaUtils.exportKey("private"));
      }, l.prototype.verify = function(v, s, h) {
        if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == d2.RSA_NO_PADDING) return false;
        var p2 = this.options.signingSchemeOptions.hash || i;
        if (this.options.environment === "browser") {
          p2 = g2[p2] || p2, h && (s = f.from(s, h));
          var S = m.createHash(p2);
          S.update(v);
          var B = this.pkcs1pad(S.digest(), p2);
          return this.key.$doPublic(new u(s)).toBuffer().toString("hex") == B.toString("hex");
        }
        var w = m.createVerify("RSA-" + p2.toUpperCase());
        return w.update(v), w.verify(this.options.rsaUtils.exportKey("public"), s, h);
      }, l.prototype.pkcs0pad = function(v) {
        var s = f.alloc(this.key.maxMessageLength - v.length);
        return s.fill(0), f.concat([s, v]);
      }, l.prototype.pkcs0unpad = function(v) {
        return typeof v.lastIndexOf == "function" ? v.slice(v.lastIndexOf("\0") + 1, v.length) : v.slice(String.prototype.lastIndexOf.call(v, "\0") + 1, v.length);
      }, l.prototype.pkcs1pad = function(v, s) {
        var h = t[s];
        if (!h) throw Error("Unsupported hash algorithm");
        var p2 = f.concat([h, v]);
        if (p2.length + 10 > this.key.encryptedDataLength) throw Error("Key is too short for signing algorithm (" + s + ")");
        var S = f.alloc(this.key.encryptedDataLength - p2.length - 1);
        return S.fill(255, 0, S.length - 1), S[0] = 1, S[S.length - 1] = 0, f.concat([S, p2]);
      }, new l(o, y);
    };
  }, 4414: (C, j, b) => {
    var f = b(8287).Buffer, u = b(1973), m = b(3200);
    C.exports = { isEncryption: false, isSignature: true };
    var d2 = "sha1";
    C.exports.makeScheme = function(t, g2) {
      var i = b(1768).pkcs1_oaep;
      function o(y, l) {
        this.key = y, this.options = l;
      }
      return r(o, "f"), o.prototype.sign = function(y) {
        var l = m.createHash(this.options.signingSchemeOptions.hash || d2);
        l.update(y);
        var v = this.emsa_pss_encode(l.digest(), this.key.keySize - 1);
        return this.key.$doPrivate(new u(v)).toBuffer(this.key.encryptedDataLength);
      }, o.prototype.verify = function(y, l, v) {
        v && (l = f.from(l, v)), l = new u(l);
        var s = Math.ceil((this.key.keySize - 1) / 8), h = this.key.$doPublic(l).toBuffer(s), p2 = m.createHash(this.options.signingSchemeOptions.hash || d2);
        return p2.update(y), this.emsa_pss_verify(p2.digest(), h, this.key.keySize - 1);
      }, o.prototype.emsa_pss_encode = function(y, l) {
        var v = this.options.signingSchemeOptions.hash || d2, s = this.options.signingSchemeOptions.mgf || i.eme_oaep_mgf1, h = this.options.signingSchemeOptions.saltLength || 20, p2 = i.digestLength[v], S = Math.ceil(l / 8);
        if (S < p2 + h + 2) throw new Error("Output length passed to emBits(" + l + ") is too small for the options specified(" + v + ", " + h + "). To fix this issue increase the value of emBits. (minimum size: " + (8 * p2 + 8 * h + 9) + ")");
        var B = m.randomBytes(h), w = f.alloc(8 + p2 + h);
        w.fill(0, 0, 8), y.copy(w, 8), B.copy(w, 8 + y.length);
        var P = m.createHash(v);
        P.update(w), P = P.digest();
        var F = f.alloc(S - B.length - p2 - 2);
        F.fill(0);
        var I = f.alloc(F.length + 1 + B.length);
        F.copy(I), I[F.length] = 1, B.copy(I, F.length + 1);
        for (var k = s(P, I.length, v), A = f.alloc(I.length), n = 0; n < k.length; n++) A[n] = I[n] ^ k[n];
        var c = 8 * S - l, _ = 255 ^ 255 >> 8 - c << 8 - c;
        A[0] = A[0] & _;
        var e = f.alloc(A.length + P.length + 1);
        return A.copy(e, 0), P.copy(e, A.length), e[e.length - 1] = 188, e;
      }, o.prototype.emsa_pss_verify = function(y, l, v) {
        var s = this.options.signingSchemeOptions.hash || d2, h = this.options.signingSchemeOptions.mgf || i.eme_oaep_mgf1, p2 = this.options.signingSchemeOptions.saltLength || 20, S = i.digestLength[s], B = Math.ceil(v / 8);
        if (B < S + p2 + 2 || l[l.length - 1] != 188) return false;
        var w = f.alloc(B - S - 1);
        l.copy(w, 0, 0, B - S - 1);
        for (var P = 0, F = 0, I = 8 * B - v; F < I; F++) P |= 1 << 7 - F;
        if (w[0] & P) return false;
        var k = l.slice(B - S - 1, B - 1), A = h(k, w.length, s);
        for (F = 0; F < w.length; F++) w[F] ^= A[F];
        for (P = 255 ^ 255 >> 8 - (I = 8 * B - v) << 8 - I, w[0] = w[0] & P, F = 0; w[F] === 0 && F < w.length; F++) ;
        if (w[F] != 1) return false;
        var n = w.slice(w.length - p2), c = f.alloc(8 + S + p2);
        c.fill(0, 0, 8), y.copy(c, 8), n.copy(c, 8 + y.length);
        var _ = m.createHash(s);
        return _.update(c), _ = _.digest(), k.toString("hex") === _.toString("hex");
      }, new o(t, g2);
    };
  }, 1768: (C, j, b) => {
    C.exports = { pkcs1: b(8290), pkcs1_oaep: b(2487), pss: b(4414), isEncryption: r(function(f) {
      return C.exports[f] && C.exports[f].isEncryption;
    }, "isEncryption"), isSignature: r(function(f) {
      return C.exports[f] && C.exports[f].isSignature;
    }, "isSignature") };
  }, 8226: (C, j, b) => {
    var f = b(5606);
    b(3200), C.exports.linebrk = function(u, m) {
      for (var d2 = "", t = 0; t + m < u.length; ) d2 += u.substring(t, t + m) + `
`, t += m;
      return d2 + u.substring(t, u.length);
    }, C.exports.detectEnvironment = function() {
      return "browser";
    }, C.exports.get32IntFromBuffer = function(u, m) {
      var d2;
      if (m = m || 0, (d2 = u.length - m) > 0) {
        if (d2 >= 4) return u.readUIntBE(m, d2);
        for (var t = 0, g2 = m + d2, i = 0; g2 > m; g2--, i += 2) t += u[g2 - 1] * Math.pow(16, i);
        return t;
      }
      return NaN;
    }, C.exports._ = { isObject: r(function(u) {
      var m = typeof u;
      return !!u && (m == "object" || m == "function");
    }, "isObject"), isString: r(function(u) {
      return typeof u == "string" || u instanceof String;
    }, "isString"), isNumber: r(function(u) {
      return typeof u == "number" || !isNaN(parseFloat(u)) && isFinite(u);
    }, "isNumber"), omit: r(function(u, m) {
      var d2 = {};
      for (var t in u) u.hasOwnProperty(t) && t !== m && (d2[t] = u[t]);
      return d2;
    }, "omit") }, C.exports.trimSurroundingText = function(u, m, d2) {
      var t = 0, g2 = u.length, i = u.indexOf(m);
      i >= 0 && (t = i + m.length);
      var o = u.indexOf(d2, i);
      return o >= 0 && (g2 = o), u.substring(t, g2);
    };
  }, 8875: (C, j, b) => {
    "use strict";
    var f;
    if (!Object.keys) {
      var u = Object.prototype.hasOwnProperty, m = Object.prototype.toString, d2 = b(1093), t = Object.prototype.propertyIsEnumerable, g2 = !t.call({ toString: null }, "toString"), i = t.call(function() {
      }, "prototype"), o = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], y = r(function(s) {
        var h = s.constructor;
        return h && h.prototype === s;
      }, "h"), l = { $applicationCache: true, $console: true, $external: true, $frame: true, $frameElement: true, $frames: true, $innerHeight: true, $innerWidth: true, $onmozfullscreenchange: true, $onmozfullscreenerror: true, $outerHeight: true, $outerWidth: true, $pageXOffset: true, $pageYOffset: true, $parent: true, $scrollLeft: true, $scrollTop: true, $scrollX: true, $scrollY: true, $self: true, $webkitIndexedDB: true, $webkitStorageInfo: true, $window: true }, v = (function() {
        if (typeof window > "u") return false;
        for (var s in window) try {
          if (!l["$" + s] && u.call(window, s) && window[s] !== null && typeof window[s] == "object") try {
            y(window[s]);
          } catch {
            return true;
          }
        } catch {
          return true;
        }
        return false;
      })();
      f = r(function(s) {
        var h = s !== null && typeof s == "object", p2 = m.call(s) === "[object Function]", S = d2(s), B = h && m.call(s) === "[object String]", w = [];
        if (!h && !p2 && !S) throw new TypeError("Object.keys called on a non-object");
        var P = i && p2;
        if (B && s.length > 0 && !u.call(s, 0)) for (var F = 0; F < s.length; ++F) w.push(String(F));
        if (S && s.length > 0) for (var I = 0; I < s.length; ++I) w.push(String(I));
        else for (var k in s) P && k === "prototype" || !u.call(s, k) || w.push(String(k));
        if (g2) for (var A = (function(c) {
          if (typeof window > "u" || !v) return y(c);
          try {
            return y(c);
          } catch {
            return false;
          }
        })(s), n = 0; n < o.length; ++n) A && o[n] === "constructor" || !u.call(s, o[n]) || w.push(o[n]);
        return w;
      }, "n");
    }
    C.exports = f;
  }, 1189: (C, j, b) => {
    "use strict";
    var f = Array.prototype.slice, u = b(1093), m = Object.keys, d2 = m ? function(g2) {
      return m(g2);
    } : b(8875), t = Object.keys;
    d2.shim = function() {
      if (Object.keys) {
        var g2 = (function() {
          var i = Object.keys(arguments);
          return i && i.length === arguments.length;
        })(1, 2);
        g2 || (Object.keys = function(i) {
          return u(i) ? t(f.call(i)) : t(i);
        });
      } else Object.keys = d2;
      return Object.keys || d2;
    }, C.exports = d2;
  }, 1093: (C) => {
    "use strict";
    var j = Object.prototype.toString;
    C.exports = function(b) {
      var f = j.call(b), u = f === "[object Arguments]";
      return u || (u = f !== "[object Array]" && b !== null && typeof b == "object" && typeof b.length == "number" && b.length >= 0 && j.call(b.callee) === "[object Function]"), u;
    };
  }, 8403: (C, j, b) => {
    "use strict";
    var f = b(1189), u = b(1333)(), m = b(8075), d2 = Object, t = m("Array.prototype.push"), g2 = m("Object.prototype.propertyIsEnumerable"), i = u ? Object.getOwnPropertySymbols : null;
    C.exports = function(o, y) {
      if (o == null) throw new TypeError("target must be an object");
      var l = d2(o);
      if (arguments.length === 1) return l;
      for (var v = 1; v < arguments.length; ++v) {
        var s = d2(arguments[v]), h = f(s), p2 = u && (Object.getOwnPropertySymbols || i);
        if (p2) for (var S = p2(s), B = 0; B < S.length; ++B) {
          var w = S[B];
          g2(s, w) && t(h, w);
        }
        for (var P = 0; P < h.length; ++P) {
          var F = h[P];
          if (g2(s, F)) {
            var I = s[F];
            l[F] = I;
          }
        }
      }
      return l;
    };
  }, 1514: (C, j, b) => {
    "use strict";
    var f = b(8403);
    C.exports = function() {
      return Object.assign ? (function() {
        if (!Object.assign) return false;
        for (var u = "abcdefghijklmnopqrst", m = u.split(""), d2 = {}, t = 0; t < m.length; ++t) d2[m[t]] = m[t];
        var g2 = Object.assign({}, d2), i = "";
        for (var o in g2) i += o;
        return u !== i;
      })() || (function() {
        if (!Object.assign || !Object.preventExtensions) return false;
        var u = Object.preventExtensions({ 1: 2 });
        try {
          Object.assign(u, "xy");
        } catch {
          return u[1] === "y";
        }
        return false;
      })() ? f : Object.assign : f;
    };
  }, 5606: (C) => {
    var j, b, f = C.exports = {};
    function u() {
      throw new Error("setTimeout has not been defined");
    }
    r(u, "i");
    function m() {
      throw new Error("clearTimeout has not been defined");
    }
    r(m, "o");
    function d2(h) {
      if (j === setTimeout) return setTimeout(h, 0);
      if ((j === u || !j) && setTimeout) return j = setTimeout, setTimeout(h, 0);
      try {
        return j(h, 0);
      } catch {
        try {
          return j.call(null, h, 0);
        } catch {
          return j.call(this, h, 0);
        }
      }
    }
    r(d2, "s"), (function() {
      try {
        j = typeof setTimeout == "function" ? setTimeout : u;
      } catch {
        j = u;
      }
      try {
        b = typeof clearTimeout == "function" ? clearTimeout : m;
      } catch {
        b = m;
      }
    })();
    var t, g2 = [], i = false, o = -1;
    function y() {
      i && t && (i = false, t.length ? g2 = t.concat(g2) : o = -1, g2.length && l());
    }
    r(y, "h");
    function l() {
      if (!i) {
        var h = d2(y);
        i = true;
        for (var p2 = g2.length; p2; ) {
          for (t = g2, g2 = []; ++o < p2; ) t && t[o].run();
          o = -1, p2 = g2.length;
        }
        t = null, i = false, (function(S) {
          if (b === clearTimeout) return clearTimeout(S);
          if ((b === m || !b) && clearTimeout) return b = clearTimeout, clearTimeout(S);
          try {
            return b(S);
          } catch {
            try {
              return b.call(null, S);
            } catch {
              return b.call(this, S);
            }
          }
        })(h);
      }
    }
    r(l, "p");
    function v(h, p2) {
      this.fun = h, this.array = p2;
    }
    r(v, "l");
    function s() {
    }
    r(s, "y"), f.nextTick = function(h) {
      var p2 = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var S = 1; S < arguments.length; S++) p2[S - 1] = arguments[S];
      g2.push(new v(h, p2)), g2.length !== 1 || i || d2(l);
    }, v.prototype.run = function() {
      this.fun.apply(null, this.array);
    }, f.title = "browser", f.browser = true, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = s, f.addListener = s, f.once = s, f.off = s, f.removeListener = s, f.removeAllListeners = s, f.emit = s, f.prependListener = s, f.prependOnceListener = s, f.listeners = function(h) {
      return [];
    }, f.binding = function(h) {
      throw new Error("process.binding is not supported");
    }, f.cwd = function() {
      return "/";
    }, f.chdir = function(h) {
      throw new Error("process.chdir is not supported");
    }, f.umask = function() {
      return 0;
    };
  }, 4774: (C, j, b) => {
    "use strict";
    var f, u = b(5606), m = b(8287), d2 = m.Buffer, t = {};
    for (f in m) m.hasOwnProperty(f) && f !== "SlowBuffer" && f !== "Buffer" && (t[f] = m[f]);
    var g2 = t.Buffer = {};
    for (f in d2) d2.hasOwnProperty(f) && f !== "allocUnsafe" && f !== "allocUnsafeSlow" && (g2[f] = d2[f]);
    if (t.Buffer.prototype = d2.prototype, g2.from && g2.from !== Uint8Array.from || (g2.from = function(i, o, y) {
      if (typeof i == "number") throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof i);
      if (i && i.length === void 0) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i);
      return d2(i, o, y);
    }), g2.alloc || (g2.alloc = function(i, o, y) {
      if (typeof i != "number") throw new TypeError('The "size" argument must be of type number. Received type ' + typeof i);
      if (i < 0 || i >= 2147483648) throw new RangeError('The value "' + i + '" is invalid for option "size"');
      var l = d2(i);
      return o && o.length !== 0 ? typeof y == "string" ? l.fill(o, y) : l.fill(o) : l.fill(0), l;
    }), !t.kStringMaxLength) try {
      t.kStringMaxLength = u.binding("buffer").kStringMaxLength;
    } catch {
    }
    t.constants || (t.constants = { MAX_LENGTH: t.kMaxLength }, t.kStringMaxLength && (t.constants.MAX_STRING_LENGTH = t.kStringMaxLength)), C.exports = t;
  }, 6897: (C, j, b) => {
    "use strict";
    var f = b(453), u = b(41), m = b(592)(), d2 = b(5795), t = b(9675), g2 = f("%Math.floor%");
    C.exports = function(i, o) {
      if (typeof i != "function") throw new t("`fn` is not a function");
      if (typeof o != "number" || o < 0 || o > 4294967295 || g2(o) !== o) throw new t("`length` must be a positive 32-bit integer");
      var y = arguments.length > 2 && !!arguments[2], l = true, v = true;
      if ("length" in i && d2) {
        var s = d2(i, "length");
        s && !s.configurable && (l = false), s && !s.writable && (v = false);
      }
      return (l || v || !y) && (m ? u(i, "length", o, true, true) : u(i, "length", o)), i;
    };
  }, 3200: (C, j, b) => {
    var f = b(8287).Buffer, u = b(1396), m = { randomBytes: r(function(d2) {
      for (var t = [], g2 = 0; g2 < d2; g2++) t.push(Math.floor(256 * Math.random()));
      return f.from(t);
    }, "randomBytes"), createHash(d2) {
      let t = f.from([]);
      return { update: r(function(g2) {
        return t = f.concat([t, g2]), this;
      }, "update"), digest: r(function() {
        let g2 = u[d2.toUpperCase()](u.lib.WordArray.create(new Uint8Array(t))).toString();
        return f.from(g2, "hex");
      }, "digest") };
    } };
    C.exports = m;
  }, 7033: (C, j, b) => {
    var f = b(8287).Buffer;
    let u = b(3229), m = { outputEncoding: "", PublicFormat: "pkcs1-public", PrivateFormat: "pkcs1-private", options: { environment: "browser", encryptionScheme: "pkcs1" } };
    C.exports = { NodeRSA: u, encryptRSAWithPublicKey: r(function(d2, t, g2 = {}) {
      return g2 = Object.assign({}, m, g2), new u(t, g2.PublicFormat, g2.options).encrypt(d2, g2.outEncoding || "base64");
    }, "encryptRSAWithPublicKey"), encryptRSAWithPrivateKey: r(function(d2, t, g2 = {}) {
      return g2 = Object.assign({}, m, g2), new u(t, g2.PrivateFormat, g2.options).encryptPrivate(d2, g2.outputEncoding || "base64");
    }, "encryptRSAWithPrivateKey"), decryptRSAWithPublicKey: r(function(d2, t, g2 = {}) {
      return g2 = Object.assign({}, m, g2), new u(t, g2.PublicEncoding, g2.options).decryptPublic(d2, g2.outEncoding || "utf8");
    }, "decryptRSAWithPublicKey"), decryptRSAWithPrivateKey: r(function(d2, t, g2 = {}) {
      return g2 = Object.assign({}, m, g2), new u(t, g2.PrivateEncoding, g2.options).decrypt(d2, g2.outEncoding || "utf8");
    }, "decryptRSAWithPrivateKey"), sign: r(function(d2, t, g2 = {}) {
      return g2 = Object.assign({}, m, g2), new u(t, g2.PrivateEncoding, g2.options).sign(d2, g2.outEncoding || "base64");
    }, "sign"), verify: r(function(d2, t, g2, i = {}) {
      return typeof t == "string" && t.match(/^([0-9a-fA-F]{2})*$/) ? t = f.from(t, "hex") : typeof t == "string" && (t = f.from(t, "base64")), i = Object.assign({}, m, i), new u(g2, i.PublicEncoding, i.options).verify(d2, t);
    }, "verify") };
  }, 7449: (C) => {
    "use strict";
    C.exports = JSON.parse('{"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"E2BIG":7,"EACCES":13,"EADDRINUSE":48,"EADDRNOTAVAIL":49,"EAFNOSUPPORT":47,"EAGAIN":35,"EALREADY":37,"EBADF":9,"EBADMSG":94,"EBUSY":16,"ECANCELED":89,"ECHILD":10,"ECONNABORTED":53,"ECONNREFUSED":61,"ECONNRESET":54,"EDEADLK":11,"EDESTADDRREQ":39,"EDOM":33,"EDQUOT":69,"EEXIST":17,"EFAULT":14,"EFBIG":27,"EHOSTUNREACH":65,"EIDRM":90,"EILSEQ":92,"EINPROGRESS":36,"EINTR":4,"EINVAL":22,"EIO":5,"EISCONN":56,"EISDIR":21,"ELOOP":62,"EMFILE":24,"EMLINK":31,"EMSGSIZE":40,"EMULTIHOP":95,"ENAMETOOLONG":63,"ENETDOWN":50,"ENETRESET":52,"ENETUNREACH":51,"ENFILE":23,"ENOBUFS":55,"ENODATA":96,"ENODEV":19,"ENOENT":2,"ENOEXEC":8,"ENOLCK":77,"ENOLINK":97,"ENOMEM":12,"ENOMSG":91,"ENOPROTOOPT":42,"ENOSPC":28,"ENOSR":98,"ENOSTR":99,"ENOSYS":78,"ENOTCONN":57,"ENOTDIR":20,"ENOTEMPTY":66,"ENOTSOCK":38,"ENOTSUP":45,"ENOTTY":25,"ENXIO":6,"EOPNOTSUPP":102,"EOVERFLOW":84,"EPERM":1,"EPIPE":32,"EPROTO":100,"EPROTONOSUPPORT":43,"EPROTOTYPE":41,"ERANGE":34,"EROFS":30,"ESPIPE":29,"ESRCH":3,"ESTALE":70,"ETIME":101,"ETIMEDOUT":60,"ETXTBSY":26,"EWOULDBLOCK":35,"EXDEV":18,"SIGHUP":1,"SIGINT":2,"SIGQUIT":3,"SIGILL":4,"SIGTRAP":5,"SIGABRT":6,"SIGIOT":6,"SIGBUS":10,"SIGFPE":8,"SIGKILL":9,"SIGUSR1":30,"SIGSEGV":11,"SIGUSR2":31,"SIGPIPE":13,"SIGALRM":14,"SIGTERM":15,"SIGCHLD":20,"SIGCONT":19,"SIGSTOP":17,"SIGTSTP":18,"SIGTTIN":21,"SIGTTOU":22,"SIGURG":16,"SIGXCPU":24,"SIGXFSZ":25,"SIGVTALRM":26,"SIGPROF":27,"SIGWINCH":28,"SIGIO":23,"SIGSYS":12,"SSL_OP_ALL":2147486719,"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION":262144,"SSL_OP_CIPHER_SERVER_PREFERENCE":4194304,"SSL_OP_CISCO_ANYCONNECT":32768,"SSL_OP_COOKIE_EXCHANGE":8192,"SSL_OP_CRYPTOPRO_TLSEXT_BUG":2147483648,"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS":2048,"SSL_OP_EPHEMERAL_RSA":0,"SSL_OP_LEGACY_SERVER_CONNECT":4,"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER":32,"SSL_OP_MICROSOFT_SESS_ID_BUG":1,"SSL_OP_MSIE_SSLV2_RSA_PADDING":0,"SSL_OP_NETSCAPE_CA_DN_BUG":536870912,"SSL_OP_NETSCAPE_CHALLENGE_BUG":2,"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG":1073741824,"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG":8,"SSL_OP_NO_COMPRESSION":131072,"SSL_OP_NO_QUERY_MTU":4096,"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION":65536,"SSL_OP_NO_SSLv2":16777216,"SSL_OP_NO_SSLv3":33554432,"SSL_OP_NO_TICKET":16384,"SSL_OP_NO_TLSv1":67108864,"SSL_OP_NO_TLSv1_1":268435456,"SSL_OP_NO_TLSv1_2":134217728,"SSL_OP_PKCS1_CHECK_1":0,"SSL_OP_PKCS1_CHECK_2":0,"SSL_OP_SINGLE_DH_USE":1048576,"SSL_OP_SINGLE_ECDH_USE":524288,"SSL_OP_SSLEAY_080_CLIENT_DH_BUG":128,"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG":0,"SSL_OP_TLS_BLOCK_PADDING_BUG":512,"SSL_OP_TLS_D5_BUG":256,"SSL_OP_TLS_ROLLBACK_BUG":8388608,"ENGINE_METHOD_DSA":2,"ENGINE_METHOD_DH":4,"ENGINE_METHOD_RAND":8,"ENGINE_METHOD_ECDH":16,"ENGINE_METHOD_ECDSA":32,"ENGINE_METHOD_CIPHERS":64,"ENGINE_METHOD_DIGESTS":128,"ENGINE_METHOD_STORE":256,"ENGINE_METHOD_PKEY_METHS":512,"ENGINE_METHOD_PKEY_ASN1_METHS":1024,"ENGINE_METHOD_ALL":65535,"ENGINE_METHOD_NONE":0,"DH_CHECK_P_NOT_SAFE_PRIME":2,"DH_CHECK_P_NOT_PRIME":1,"DH_UNABLE_TO_CHECK_GENERATOR":4,"DH_NOT_SUITABLE_GENERATOR":8,"NPN_ENABLED":1,"RSA_PKCS1_PADDING":1,"RSA_SSLV23_PADDING":2,"RSA_NO_PADDING":3,"RSA_PKCS1_OAEP_PADDING":4,"RSA_X931_PADDING":5,"RSA_PKCS1_PSS_PADDING":6,"POINT_CONVERSION_COMPRESSED":2,"POINT_CONVERSION_UNCOMPRESSED":4,"POINT_CONVERSION_HYBRID":6,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_UDP_REUSEADDR":4}');
  } }, M = {};
  function $(C) {
    var j = M[C];
    if (j !== void 0) return j.exports;
    var b = M[C] = { exports: {} };
    return Y[C].call(b.exports, b, b.exports, $), b.exports;
  }
  return r($, "r"), $.g = (function() {
    if (typeof globalThis == "object") return globalThis;
    try {
      return this || new Function("return this")();
    } catch {
      if (typeof window == "object") return window;
    }
  })(), $(7033);
})());
(function(Y, M) {
  typeof exports == "object" && typeof module < "u" ? module.exports = M() : typeof define == "function" && define.amd ? define(M) : (Y = typeof globalThis < "u" ? globalThis : Y || self, Y.JSON5 = M());
})(void 0, function() {
  "use strict";
  function Y(q, Z) {
    return Z = { exports: {} }, q(Z, Z.exports), Z.exports;
  }
  r(Y, "createCommonjsModule");
  var M = Y(function(q) {
    var Z = q.exports = typeof window < "u" && window.Math == Math ? window : typeof self < "u" && self.Math == Math ? self : Function("return this")();
    typeof __g == "number" && (__g = Z);
  }), $ = Y(function(q) {
    var Z = q.exports = { version: "2.6.5" };
    typeof __e == "number" && (__e = Z);
  }), C = $.version, j = r(function(q) {
    return typeof q == "object" ? q !== null : typeof q == "function";
  }, "_isObject"), b = r(function(q) {
    if (!j(q)) throw TypeError(q + " is not an object!");
    return q;
  }, "_anObject"), f = r(function(q) {
    try {
      return !!q();
    } catch {
      return true;
    }
  }, "_fails"), u = !f(function() {
    return Object.defineProperty({}, "a", { get: r(function() {
      return 7;
    }, "get") }).a != 7;
  }), m = M.document, d2 = j(m) && j(m.createElement), t = r(function(q) {
    return d2 ? m.createElement(q) : {};
  }, "_domCreate"), g2 = !u && !f(function() {
    return Object.defineProperty(t("div"), "a", { get: r(function() {
      return 7;
    }, "get") }).a != 7;
  }), i = r(function(q, Z) {
    if (!j(q)) return q;
    var ae, oe;
    if (Z && typeof (ae = q.toString) == "function" && !j(oe = ae.call(q)) || typeof (ae = q.valueOf) == "function" && !j(oe = ae.call(q)) || !Z && typeof (ae = q.toString) == "function" && !j(oe = ae.call(q))) return oe;
    throw TypeError("Can't convert object to primitive value");
  }, "_toPrimitive"), o = Object.defineProperty, y = u ? Object.defineProperty : r(function(Z, ae, oe) {
    if (b(Z), ae = i(ae, true), b(oe), g2) try {
      return o(Z, ae, oe);
    } catch {
    }
    if ("get" in oe || "set" in oe) throw TypeError("Accessors not supported!");
    return "value" in oe && (Z[ae] = oe.value), Z;
  }, "defineProperty"), l = { f: y }, v = r(function(q, Z) {
    return { enumerable: !(q & 1), configurable: !(q & 2), writable: !(q & 4), value: Z };
  }, "_propertyDesc"), s = u ? function(q, Z, ae) {
    return l.f(q, Z, v(1, ae));
  } : function(q, Z, ae) {
    return q[Z] = ae, q;
  }, h = {}.hasOwnProperty, p2 = r(function(q, Z) {
    return h.call(q, Z);
  }, "_has"), S = 0, B = Math.random(), w = r(function(q) {
    return "Symbol(".concat(q === void 0 ? "" : q, ")_", (++S + B).toString(36));
  }, "_uid"), P = false, F = Y(function(q) {
    var Z = "__core-js_shared__", ae = M[Z] || (M[Z] = {});
    (q.exports = function(oe, ue) {
      return ae[oe] || (ae[oe] = ue !== void 0 ? ue : {});
    })("versions", []).push({ version: $.version, mode: P ? "pure" : "global", copyright: "\xA9 2019 Denis Pushkarev (zloirock.ru)" });
  }), I = F("native-function-to-string", Function.toString), k = Y(function(q) {
    var Z = w("src"), ae = "toString", oe = ("" + I).split(ae);
    $.inspectSource = function(ue) {
      return I.call(ue);
    }, (q.exports = function(ue, de, ge, Te) {
      var Se = typeof ge == "function";
      Se && (p2(ge, "name") || s(ge, "name", de)), ue[de] !== ge && (Se && (p2(ge, Z) || s(ge, Z, ue[de] ? "" + ue[de] : oe.join(String(de)))), ue === M ? ue[de] = ge : Te ? ue[de] ? ue[de] = ge : s(ue, de, ge) : (delete ue[de], s(ue, de, ge)));
    })(Function.prototype, ae, r(function() {
      return typeof this == "function" && this[Z] || I.call(this);
    }, "toString"));
  }), A = r(function(q) {
    if (typeof q != "function") throw TypeError(q + " is not a function!");
    return q;
  }, "_aFunction"), n = r(function(q, Z, ae) {
    if (A(q), Z === void 0) return q;
    switch (ae) {
      case 1:
        return function(oe) {
          return q.call(Z, oe);
        };
      case 2:
        return function(oe, ue) {
          return q.call(Z, oe, ue);
        };
      case 3:
        return function(oe, ue, de) {
          return q.call(Z, oe, ue, de);
        };
    }
    return function() {
      return q.apply(Z, arguments);
    };
  }, "_ctx"), c = "prototype", _ = r(function(q, Z, ae) {
    var oe = q & _.F, ue = q & _.G, de = q & _.S, ge = q & _.P, Te = q & _.B, Se = ue ? M : de ? M[Z] || (M[Z] = {}) : (M[Z] || {})[c], Ye = ue ? $ : $[Z] || ($[Z] = {}), rn = Ye[c] || (Ye[c] = {}), Ue, Me, Ie, on;
    ue && (ae = Z);
    for (Ue in ae) Me = !oe && Se && Se[Ue] !== void 0, Ie = (Me ? Se : ae)[Ue], on = Te && Me ? n(Ie, M) : ge && typeof Ie == "function" ? n(Function.call, Ie) : Ie, Se && k(Se, Ue, Ie, q & _.U), Ye[Ue] != Ie && s(Ye, Ue, on), ge && rn[Ue] != Ie && (rn[Ue] = Ie);
  }, "$export");
  M.core = $, _.F = 1, _.G = 2, _.S = 4, _.P = 8, _.B = 16, _.W = 32, _.U = 64, _.R = 128;
  var e = _, a = Math.ceil, E = Math.floor, O = r(function(q) {
    return isNaN(q = +q) ? 0 : (q > 0 ? E : a)(q);
  }, "_toInteger"), T = r(function(q) {
    if (q == null) throw TypeError("Can't call method on  " + q);
    return q;
  }, "_defined"), L = r(function(q) {
    return function(Z, ae) {
      var oe = String(T(Z)), ue = O(ae), de = oe.length, ge, Te;
      return ue < 0 || ue >= de ? q ? "" : void 0 : (ge = oe.charCodeAt(ue), ge < 55296 || ge > 56319 || ue + 1 === de || (Te = oe.charCodeAt(ue + 1)) < 56320 || Te > 57343 ? q ? oe.charAt(ue) : ge : q ? oe.slice(ue, ue + 2) : (ge - 55296 << 10) + (Te - 56320) + 65536);
    };
  }, "_stringAt"), N = L(false);
  e(e.P, "String", { codePointAt: r(function(Z) {
    return N(this, Z);
  }, "codePointAt") });
  var U = $.String.codePointAt, X = Math.max, Q = Math.min, W = r(function(q, Z) {
    return q = O(q), q < 0 ? X(q + Z, 0) : Q(q, Z);
  }, "_toAbsoluteIndex"), J = String.fromCharCode, V = String.fromCodePoint;
  e(e.S + e.F * (!!V && V.length != 1), "String", { fromCodePoint: r(function(Z) {
    for (var ae = arguments, oe = [], ue = arguments.length, de = 0, ge; ue > de; ) {
      if (ge = +ae[de++], W(ge, 1114111) !== ge) throw RangeError(ge + " is not a valid code point");
      oe.push(ge < 65536 ? J(ge) : J(((ge -= 65536) >> 10) + 55296, ge % 1024 + 56320));
    }
    return oe.join("");
  }, "fromCodePoint") });
  var z = $.String.fromCodePoint, D = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, x = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, R = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/, K = { Space_Separator: D, ID_Start: x, ID_Continue: R }, H = { isSpaceSeparator: r(function(Z) {
    return typeof Z == "string" && K.Space_Separator.test(Z);
  }, "isSpaceSeparator"), isIdStartChar: r(function(Z) {
    return typeof Z == "string" && (Z >= "a" && Z <= "z" || Z >= "A" && Z <= "Z" || Z === "$" || Z === "_" || K.ID_Start.test(Z));
  }, "isIdStartChar"), isIdContinueChar: r(function(Z) {
    return typeof Z == "string" && (Z >= "a" && Z <= "z" || Z >= "A" && Z <= "Z" || Z >= "0" && Z <= "9" || Z === "$" || Z === "_" || Z === "\u200C" || Z === "\u200D" || K.ID_Continue.test(Z));
  }, "isIdContinueChar"), isDigit: r(function(Z) {
    return typeof Z == "string" && /[0-9]/.test(Z);
  }, "isDigit"), isHexDigit: r(function(Z) {
    return typeof Z == "string" && /[0-9A-Fa-f]/.test(Z);
  }, "isHexDigit") }, G, ne, ie, te, se, re, le, me, Ee, De = r(function(Z, ae) {
    G = String(Z), ne = "start", ie = [], te = 0, se = 1, re = 0, le = void 0, me = void 0, Ee = void 0;
    do
      le = Fe(), cn[ne]();
    while (le.type !== "eof");
    return typeof ae == "function" ? _e({ "": Ee }, "", ae) : Ee;
  }, "parse");
  function _e(q, Z, ae) {
    var oe = q[Z];
    if (oe != null && typeof oe == "object") if (Array.isArray(oe)) for (var ue = 0; ue < oe.length; ue++) {
      var de = String(ue), ge = _e(oe, de, ae);
      ge === void 0 ? delete oe[de] : Object.defineProperty(oe, de, { value: ge, writable: true, enumerable: true, configurable: true });
    }
    else for (var Te in oe) {
      var Se = _e(oe, Te, ae);
      Se === void 0 ? delete oe[Te] : Object.defineProperty(oe, Te, { value: Se, writable: true, enumerable: true, configurable: true });
    }
    return ae.call(q, Z, oe);
  }
  r(_e, "internalize");
  var ce, he, Ce, Oe, pe;
  function Fe() {
    for (ce = "default", he = "", Ce = false, Oe = 1; ; ) {
      pe = ke();
      var q = Ve[ce]();
      if (q) return q;
    }
  }
  r(Fe, "lex");
  function ke() {
    if (G[te]) return String.fromCodePoint(G.codePointAt(te));
  }
  r(ke, "peek");
  function ee() {
    var q = ke();
    return q === `
` ? (se++, re = 0) : q ? re += q.length : re++, q && (te += q.length), q;
  }
  r(ee, "read");
  var Ve = { default: r(function() {
    switch (pe) {
      case "	":
      case "\v":
      case "\f":
      case " ":
      case "\xA0":
      case "\uFEFF":
      case `
`:
      case "\r":
      case "\u2028":
      case "\u2029":
        ee();
        return;
      case "/":
        ee(), ce = "comment";
        return;
      case void 0:
        return ee(), ye("eof");
    }
    if (H.isSpaceSeparator(pe)) {
      ee();
      return;
    }
    return Ve[ne]();
  }, "default$1"), comment: r(function() {
    switch (pe) {
      case "*":
        ee(), ce = "multiLineComment";
        return;
      case "/":
        ee(), ce = "singleLineComment";
        return;
    }
    throw ve(ee());
  }, "comment"), multiLineComment: r(function() {
    switch (pe) {
      case "*":
        ee(), ce = "multiLineCommentAsterisk";
        return;
      case void 0:
        throw ve(ee());
    }
    ee();
  }, "multiLineComment"), multiLineCommentAsterisk: r(function() {
    switch (pe) {
      case "*":
        ee();
        return;
      case "/":
        ee(), ce = "default";
        return;
      case void 0:
        throw ve(ee());
    }
    ee(), ce = "multiLineComment";
  }, "multiLineCommentAsterisk"), singleLineComment: r(function() {
    switch (pe) {
      case `
`:
      case "\r":
      case "\u2028":
      case "\u2029":
        ee(), ce = "default";
        return;
      case void 0:
        return ee(), ye("eof");
    }
    ee();
  }, "singleLineComment"), value: r(function() {
    switch (pe) {
      case "{":
      case "[":
        return ye("punctuator", ee());
      case "n":
        return ee(), Re("ull"), ye("null", null);
      case "t":
        return ee(), Re("rue"), ye("boolean", true);
      case "f":
        return ee(), Re("alse"), ye("boolean", false);
      case "-":
      case "+":
        ee() === "-" && (Oe = -1), ce = "sign";
        return;
      case ".":
        he = ee(), ce = "decimalPointLeading";
        return;
      case "0":
        he = ee(), ce = "zero";
        return;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        he = ee(), ce = "decimalInteger";
        return;
      case "I":
        return ee(), Re("nfinity"), ye("numeric", 1 / 0);
      case "N":
        return ee(), Re("aN"), ye("numeric", NaN);
      case '"':
      case "'":
        Ce = ee() === '"', he = "", ce = "string";
        return;
    }
    throw ve(ee());
  }, "value"), identifierNameStartEscape: r(function() {
    if (pe !== "u") throw ve(ee());
    ee();
    var Z = He();
    switch (Z) {
      case "$":
      case "_":
        break;
      default:
        if (!H.isIdStartChar(Z)) throw Pe();
        break;
    }
    he += Z, ce = "identifierName";
  }, "identifierNameStartEscape"), identifierName: r(function() {
    switch (pe) {
      case "$":
      case "_":
      case "\u200C":
      case "\u200D":
        he += ee();
        return;
      case "\\":
        ee(), ce = "identifierNameEscape";
        return;
    }
    if (H.isIdContinueChar(pe)) {
      he += ee();
      return;
    }
    return ye("identifier", he);
  }, "identifierName"), identifierNameEscape: r(function() {
    if (pe !== "u") throw ve(ee());
    ee();
    var Z = He();
    switch (Z) {
      case "$":
      case "_":
      case "\u200C":
      case "\u200D":
        break;
      default:
        if (!H.isIdContinueChar(Z)) throw Pe();
        break;
    }
    he += Z, ce = "identifierName";
  }, "identifierNameEscape"), sign: r(function() {
    switch (pe) {
      case ".":
        he = ee(), ce = "decimalPointLeading";
        return;
      case "0":
        he = ee(), ce = "zero";
        return;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        he = ee(), ce = "decimalInteger";
        return;
      case "I":
        return ee(), Re("nfinity"), ye("numeric", Oe * (1 / 0));
      case "N":
        return ee(), Re("aN"), ye("numeric", NaN);
    }
    throw ve(ee());
  }, "sign$1"), zero: r(function() {
    switch (pe) {
      case ".":
        he += ee(), ce = "decimalPoint";
        return;
      case "e":
      case "E":
        he += ee(), ce = "decimalExponent";
        return;
      case "x":
      case "X":
        he += ee(), ce = "hexadecimal";
        return;
    }
    return ye("numeric", Oe * 0);
  }, "zero"), decimalInteger: r(function() {
    switch (pe) {
      case ".":
        he += ee(), ce = "decimalPoint";
        return;
      case "e":
      case "E":
        he += ee(), ce = "decimalExponent";
        return;
    }
    if (H.isDigit(pe)) {
      he += ee();
      return;
    }
    return ye("numeric", Oe * Number(he));
  }, "decimalInteger"), decimalPointLeading: r(function() {
    if (H.isDigit(pe)) {
      he += ee(), ce = "decimalFraction";
      return;
    }
    throw ve(ee());
  }, "decimalPointLeading"), decimalPoint: r(function() {
    switch (pe) {
      case "e":
      case "E":
        he += ee(), ce = "decimalExponent";
        return;
    }
    if (H.isDigit(pe)) {
      he += ee(), ce = "decimalFraction";
      return;
    }
    return ye("numeric", Oe * Number(he));
  }, "decimalPoint"), decimalFraction: r(function() {
    switch (pe) {
      case "e":
      case "E":
        he += ee(), ce = "decimalExponent";
        return;
    }
    if (H.isDigit(pe)) {
      he += ee();
      return;
    }
    return ye("numeric", Oe * Number(he));
  }, "decimalFraction"), decimalExponent: r(function() {
    switch (pe) {
      case "+":
      case "-":
        he += ee(), ce = "decimalExponentSign";
        return;
    }
    if (H.isDigit(pe)) {
      he += ee(), ce = "decimalExponentInteger";
      return;
    }
    throw ve(ee());
  }, "decimalExponent"), decimalExponentSign: r(function() {
    if (H.isDigit(pe)) {
      he += ee(), ce = "decimalExponentInteger";
      return;
    }
    throw ve(ee());
  }, "decimalExponentSign"), decimalExponentInteger: r(function() {
    if (H.isDigit(pe)) {
      he += ee();
      return;
    }
    return ye("numeric", Oe * Number(he));
  }, "decimalExponentInteger"), hexadecimal: r(function() {
    if (H.isHexDigit(pe)) {
      he += ee(), ce = "hexadecimalInteger";
      return;
    }
    throw ve(ee());
  }, "hexadecimal"), hexadecimalInteger: r(function() {
    if (H.isHexDigit(pe)) {
      he += ee();
      return;
    }
    return ye("numeric", Oe * Number(he));
  }, "hexadecimalInteger"), string: r(function() {
    switch (pe) {
      case "\\":
        ee(), he += en();
        return;
      case '"':
        if (Ce) return ee(), ye("string", he);
        he += ee();
        return;
      case "'":
        if (!Ce) return ee(), ye("string", he);
        he += ee();
        return;
      case `
`:
      case "\r":
        throw ve(ee());
      case "\u2028":
      case "\u2029":
        ln(pe);
        break;
      case void 0:
        throw ve(ee());
    }
    he += ee();
  }, "string"), start: r(function() {
    switch (pe) {
      case "{":
      case "[":
        return ye("punctuator", ee());
    }
    ce = "value";
  }, "start"), beforePropertyName: r(function() {
    switch (pe) {
      case "$":
      case "_":
        he = ee(), ce = "identifierName";
        return;
      case "\\":
        ee(), ce = "identifierNameStartEscape";
        return;
      case "}":
        return ye("punctuator", ee());
      case '"':
      case "'":
        Ce = ee() === '"', ce = "string";
        return;
    }
    if (H.isIdStartChar(pe)) {
      he += ee(), ce = "identifierName";
      return;
    }
    throw ve(ee());
  }, "beforePropertyName"), afterPropertyName: r(function() {
    if (pe === ":") return ye("punctuator", ee());
    throw ve(ee());
  }, "afterPropertyName"), beforePropertyValue: r(function() {
    ce = "value";
  }, "beforePropertyValue"), afterPropertyValue: r(function() {
    switch (pe) {
      case ",":
      case "}":
        return ye("punctuator", ee());
    }
    throw ve(ee());
  }, "afterPropertyValue"), beforeArrayValue: r(function() {
    if (pe === "]") return ye("punctuator", ee());
    ce = "value";
  }, "beforeArrayValue"), afterArrayValue: r(function() {
    switch (pe) {
      case ",":
      case "]":
        return ye("punctuator", ee());
    }
    throw ve(ee());
  }, "afterArrayValue"), end: r(function() {
    throw ve(ee());
  }, "end") };
  function ye(q, Z) {
    return { type: q, value: Z, line: se, column: re };
  }
  r(ye, "newToken");
  function Re(q) {
    for (var Z = 0, ae = q; Z < ae.length; Z += 1) {
      var oe = ae[Z], ue = ke();
      if (ue !== oe) throw ve(ee());
      ee();
    }
  }
  r(Re, "literal");
  function en() {
    var q = ke();
    switch (q) {
      case "b":
        return ee(), "\b";
      case "f":
        return ee(), "\f";
      case "n":
        return ee(), `
`;
      case "r":
        return ee(), "\r";
      case "t":
        return ee(), "	";
      case "v":
        return ee(), "\v";
      case "0":
        if (ee(), H.isDigit(ke())) throw ve(ee());
        return "\0";
      case "x":
        return ee(), nn();
      case "u":
        return ee(), He();
      case `
`:
      case "\u2028":
      case "\u2029":
        return ee(), "";
      case "\r":
        return ee(), ke() === `
` && ee(), "";
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        throw ve(ee());
      case void 0:
        throw ve(ee());
    }
    return ee();
  }
  r(en, "escape");
  function nn() {
    var q = "", Z = ke();
    if (!H.isHexDigit(Z) || (q += ee(), Z = ke(), !H.isHexDigit(Z))) throw ve(ee());
    return q += ee(), String.fromCodePoint(parseInt(q, 16));
  }
  r(nn, "hexEscape");
  function He() {
    for (var q = "", Z = 4; Z-- > 0; ) {
      var ae = ke();
      if (!H.isHexDigit(ae)) throw ve(ee());
      q += ee();
    }
    return String.fromCodePoint(parseInt(q, 16));
  }
  r(He, "unicodeEscape");
  var cn = { start: r(function() {
    if (le.type === "eof") throw Ne();
    We();
  }, "start"), beforePropertyName: r(function() {
    switch (le.type) {
      case "identifier":
      case "string":
        me = le.value, ne = "afterPropertyName";
        return;
      case "punctuator":
        qe();
        return;
      case "eof":
        throw Ne();
    }
  }, "beforePropertyName"), afterPropertyName: r(function() {
    if (le.type === "eof") throw Ne();
    ne = "beforePropertyValue";
  }, "afterPropertyName"), beforePropertyValue: r(function() {
    if (le.type === "eof") throw Ne();
    We();
  }, "beforePropertyValue"), beforeArrayValue: r(function() {
    if (le.type === "eof") throw Ne();
    if (le.type === "punctuator" && le.value === "]") {
      qe();
      return;
    }
    We();
  }, "beforeArrayValue"), afterPropertyValue: r(function() {
    if (le.type === "eof") throw Ne();
    switch (le.value) {
      case ",":
        ne = "beforePropertyName";
        return;
      case "}":
        qe();
    }
  }, "afterPropertyValue"), afterArrayValue: r(function() {
    if (le.type === "eof") throw Ne();
    switch (le.value) {
      case ",":
        ne = "beforeArrayValue";
        return;
      case "]":
        qe();
    }
  }, "afterArrayValue"), end: r(function() {
  }, "end") };
  function We() {
    var q;
    switch (le.type) {
      case "punctuator":
        switch (le.value) {
          case "{":
            q = {};
            break;
          case "[":
            q = [];
            break;
        }
        break;
      case "null":
      case "boolean":
      case "numeric":
      case "string":
        q = le.value;
        break;
    }
    if (Ee === void 0) Ee = q;
    else {
      var Z = ie[ie.length - 1];
      Array.isArray(Z) ? Z.push(q) : Object.defineProperty(Z, me, { value: q, writable: true, enumerable: true, configurable: true });
    }
    if (q !== null && typeof q == "object") ie.push(q), Array.isArray(q) ? ne = "beforeArrayValue" : ne = "beforePropertyName";
    else {
      var ae = ie[ie.length - 1];
      ae == null ? ne = "end" : Array.isArray(ae) ? ne = "afterArrayValue" : ne = "afterPropertyValue";
    }
  }
  r(We, "push");
  function qe() {
    ie.pop();
    var q = ie[ie.length - 1];
    q == null ? ne = "end" : Array.isArray(q) ? ne = "afterArrayValue" : ne = "afterPropertyValue";
  }
  r(qe, "pop");
  function ve(q) {
    return Je(q === void 0 ? "JSON5: invalid end of input at " + se + ":" + re : "JSON5: invalid character '" + $e(q) + "' at " + se + ":" + re);
  }
  r(ve, "invalidChar");
  function Ne() {
    return Je("JSON5: invalid end of input at " + se + ":" + re);
  }
  r(Ne, "invalidEOF");
  function Pe() {
    return re -= 5, Je("JSON5: invalid identifier character at " + se + ":" + re);
  }
  r(Pe, "invalidIdentifier");
  function ln(q) {
    console.warn("JSON5: '" + $e(q) + "' in strings is not valid ECMAScript; consider escaping");
  }
  r(ln, "separatorChar");
  function $e(q) {
    var Z = { "'": "\\'", '"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\v", "\0": "\\0", "\u2028": "\\u2028", "\u2029": "\\u2029" };
    if (Z[q]) return Z[q];
    if (q < " ") {
      var ae = q.charCodeAt(0).toString(16);
      return "\\x" + ("00" + ae).substring(ae.length);
    }
    return q;
  }
  r($e, "formatChar");
  function Je(q) {
    var Z = new SyntaxError(q);
    return Z.lineNumber = se, Z.columnNumber = re, Z;
  }
  r(Je, "syntaxError");
  var hn = r(function(Z, ae, oe) {
    var ue = [], de = "", ge, Te, Se = "", Ye;
    if (ae != null && typeof ae == "object" && !Array.isArray(ae) && (oe = ae.space, Ye = ae.quote, ae = ae.replacer), typeof ae == "function") Te = ae;
    else if (Array.isArray(ae)) {
      ge = [];
      for (var rn = 0, Ue = ae; rn < Ue.length; rn += 1) {
        var Me = Ue[rn], Ie = void 0;
        typeof Me == "string" ? Ie = Me : (typeof Me == "number" || Me instanceof String || Me instanceof Number) && (Ie = String(Me)), Ie !== void 0 && ge.indexOf(Ie) < 0 && ge.push(Ie);
      }
    }
    return oe instanceof Number ? oe = Number(oe) : oe instanceof String && (oe = String(oe)), typeof oe == "number" ? oe > 0 && (oe = Math.min(10, Math.floor(oe)), Se = "          ".substr(0, oe)) : typeof oe == "string" && (Se = oe.substr(0, 10)), on("", { "": Z });
    function on(be, Be) {
      var fe = Be[be];
      switch (fe != null && (typeof fe.toJSON5 == "function" ? fe = fe.toJSON5(be) : typeof fe.toJSON == "function" && (fe = fe.toJSON(be))), Te && (fe = Te.call(Be, be, fe)), fe instanceof Number ? fe = Number(fe) : fe instanceof String ? fe = String(fe) : fe instanceof Boolean && (fe = fe.valueOf()), fe) {
        case null:
          return "null";
        case true:
          return "true";
        case false:
          return "false";
      }
      if (typeof fe == "string") return pn(fe, false);
      if (typeof fe == "number") return String(fe);
      if (typeof fe == "object") return Array.isArray(fe) ? Bn(fe) : An(fe);
    }
    r(on, "serializeProperty");
    function pn(be) {
      for (var Be = { "'": 0.1, '"': 0.2 }, fe = { "'": "\\'", '"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\v", "\0": "\\0", "\u2028": "\\u2028", "\u2029": "\\u2029" }, xe = "", Le = 0; Le < be.length; Le++) {
        var we = be[Le];
        switch (we) {
          case "'":
          case '"':
            Be[we]++, xe += we;
            continue;
          case "\0":
            if (H.isDigit(be[Le + 1])) {
              xe += "\\x00";
              continue;
            }
        }
        if (fe[we]) {
          xe += fe[we];
          continue;
        }
        if (we < " ") {
          var Xe = we.charCodeAt(0).toString(16);
          xe += "\\x" + ("00" + Xe).substring(Xe.length);
          continue;
        }
        xe += we;
      }
      var ze = Ye || Object.keys(Be).reduce(function(Ge, Ze) {
        return Be[Ge] < Be[Ze] ? Ge : Ze;
      });
      return xe = xe.replace(new RegExp(ze, "g"), fe[ze]), ze + xe + ze;
    }
    r(pn, "quoteString");
    function An(be) {
      if (ue.indexOf(be) >= 0) throw TypeError("Converting circular structure to JSON5");
      ue.push(be);
      var Be = de;
      de = de + Se;
      for (var fe = ge || Object.keys(be), xe = [], Le = 0, we = fe; Le < we.length; Le += 1) {
        var Xe = we[Le], ze = on(Xe, be);
        if (ze !== void 0) {
          var Ge = xn(Xe) + ":";
          Se !== "" && (Ge += " "), Ge += ze, xe.push(Ge);
        }
      }
      var Ze;
      if (xe.length === 0) Ze = "{}";
      else {
        var fn;
        if (Se === "") fn = xe.join(","), Ze = "{" + fn + "}";
        else {
          var wn = `,
` + de;
          fn = xe.join(wn), Ze = `{
` + de + fn + `,
` + Be + "}";
        }
      }
      return ue.pop(), de = Be, Ze;
    }
    r(An, "serializeObject");
    function xn(be) {
      if (be.length === 0) return pn(be, true);
      var Be = String.fromCodePoint(be.codePointAt(0));
      if (!H.isIdStartChar(Be)) return pn(be, true);
      for (var fe = Be.length; fe < be.length; fe++) if (!H.isIdContinueChar(String.fromCodePoint(be.codePointAt(fe)))) return pn(be, true);
      return be;
    }
    r(xn, "serializeKey");
    function Bn(be) {
      if (ue.indexOf(be) >= 0) throw TypeError("Converting circular structure to JSON5");
      ue.push(be);
      var Be = de;
      de = de + Se;
      for (var fe = [], xe = 0; xe < be.length; xe++) {
        var Le = on(String(xe), be);
        fe.push(Le !== void 0 ? Le : "null");
      }
      var we;
      if (fe.length === 0) we = "[]";
      else if (Se === "") {
        var Xe = fe.join(",");
        we = "[" + Xe + "]";
      } else {
        var ze = `,
` + de, Ge = fe.join(ze);
        we = `[
` + de + Ge + `,
` + Be + "]";
      }
      return ue.pop(), de = Be, we;
    }
    r(Bn, "serializeArray");
  }, "stringify"), tn = { parse: De, stringify: hn }, Ae = tn, je = Ae;
  return je;
});
(function(Y, M) {
  typeof exports == "object" && typeof module < "u" ? M(exports) : typeof define == "function" && define.amd ? define(["exports"], M) : M((Y = typeof globalThis < "u" ? globalThis : Y || self).JSONPath = {});
})(void 0, function(Y) {
  "use strict";
  function M(n, c, _) {
    return c = g2(c), (function(e, a) {
      {
        if (a && (typeof a == "object" || typeof a == "function")) return a;
        if (a !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
      }
      return (function(E) {
        if (E !== void 0) return E;
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      })(e);
    })(n, C() ? Reflect.construct(c, _ || [], g2(n).constructor) : c.apply(n, _));
  }
  r(M, "n");
  function $(n, c, _) {
    if (C()) return Reflect.construct.apply(null, arguments);
    var e = [null];
    return e.push.apply(e, c), e = new (n.bind.apply(n, e))(), _ && i(e, _.prototype), e;
  }
  r($, "o");
  function C() {
    try {
      var n = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch {
    }
    return (C = r(function() {
      return !!n;
    }, "i"))();
  }
  r(C, "i");
  function j(n, c) {
    var _, e = Object.keys(n);
    return Object.getOwnPropertySymbols && (_ = Object.getOwnPropertySymbols(n), c && (_ = _.filter(function(a) {
      return Object.getOwnPropertyDescriptor(n, a).enumerable;
    })), e.push.apply(e, _)), e;
  }
  r(j, "t");
  function b(n) {
    for (var c = 1; c < arguments.length; c++) {
      var _ = arguments[c] != null ? arguments[c] : {};
      c % 2 ? j(Object(_), true).forEach(function(e) {
        var a, E;
        a = n, e = _[E = e], (E = f(E)) in a ? Object.defineProperty(a, E, { value: e, enumerable: true, configurable: true, writable: true }) : a[E] = e;
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(_)) : j(Object(_)).forEach(function(e) {
        Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(_, e));
      });
    }
    return n;
  }
  r(b, "r");
  function f(n) {
    return n = (function(c, _) {
      if (typeof c != "object" || !c) return c;
      var e = c[Symbol.toPrimitive];
      if (e === void 0) return (_ === "string" ? String : Number)(c);
      if (typeof (_ = e.call(c, _ || "default")) != "object") return _;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    })(n, "string"), typeof n == "symbol" ? n : n + "";
  }
  r(f, "a");
  function u(n) {
    return (u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(c) {
      return typeof c;
    } : function(c) {
      return c && typeof Symbol == "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c;
    })(n);
  }
  r(u, "C");
  function m(n, c) {
    if (!(n instanceof c)) throw new TypeError("Cannot call a class as a function");
  }
  r(m, "s");
  function d2(n, c) {
    for (var _ = 0; _ < c.length; _++) {
      var e = c[_];
      e.enumerable = e.enumerable || false, e.configurable = true, "value" in e && (e.writable = true), Object.defineProperty(n, f(e.key), e);
    }
  }
  r(d2, "u");
  function t(n, c, _) {
    return c && d2(n.prototype, c), _ && d2(n, _), Object.defineProperty(n, "prototype", { writable: false }), n;
  }
  r(t, "c");
  function g2(n) {
    return (g2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(c) {
      return c.__proto__ || Object.getPrototypeOf(c);
    })(n);
  }
  r(g2, "l");
  function i(n, c) {
    return (i = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(_, e) {
      return _.__proto__ = e, _;
    })(n, c);
  }
  r(i, "h");
  function o(n) {
    var c = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return (o = r(function(_) {
      if (_ === null || !(function(a) {
        try {
          return Function.toString.call(a).indexOf("[native code]") !== -1;
        } catch {
          return typeof a == "function";
        }
      })(_)) return _;
      if (typeof _ != "function") throw new TypeError("Super expression must either be null or a function");
      if (c !== void 0) {
        if (c.has(_)) return c.get(_);
        c.set(_, e);
      }
      function e() {
        return $(_, arguments, g2(this).constructor);
      }
      return r(e, "t"), e.prototype = Object.create(_.prototype, { constructor: { value: e, enumerable: false, writable: true, configurable: true } }), i(e, _);
    }, "p"))(n);
  }
  r(o, "p");
  function y(n) {
    return (function(c) {
      if (Array.isArray(c)) return v(c);
    })(n) || (function(c) {
      if (typeof Symbol < "u" && c[Symbol.iterator] != null || c["@@iterator"] != null) return Array.from(c);
    })(n) || l(n) || (function() {
      throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    })();
  }
  r(y, "f");
  function l(n, c) {
    if (n) {
      if (typeof n == "string") return v(n, c);
      var _ = Object.prototype.toString.call(n).slice(8, -1);
      return _ === "Object" && n.constructor && (_ = n.constructor.name), _ === "Map" || _ === "Set" ? Array.from(n) : _ === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(_) ? v(n, c) : void 0;
    }
  }
  r(l, "O");
  function v(n, c) {
    (c == null || c > n.length) && (c = n.length);
    for (var _ = 0, e = new Array(c); _ < c; _++) e[_] = n[_];
    return e;
  }
  r(v, "d");
  var h = (function() {
    return t(r(function n() {
      m(this, n);
    }, "e"), [{ key: "add", value: r(function(n, c, _) {
      if (typeof n != "string") for (var e in n) this.add(e, n[e], c);
      else (Array.isArray(n) ? n : [n]).forEach(function(a) {
        this[a] = this[a] || [], c && this[a][_ ? "unshift" : "push"](c);
      }, this);
    }, "value") }, { key: "run", value: r(function(n, c) {
      this[n] = this[n] || [], this[n].forEach(function(_) {
        _.call(c && c.context ? c.context : c, c);
      });
    }, "value") }]);
  })(), A = (function() {
    return t(r(function n(c) {
      m(this, n), this.jsep = c, this.registered = {};
    }, "e"), [{ key: "register", value: r(function() {
      for (var n = this, c = arguments.length, _ = new Array(c), e = 0; e < c; e++) _[e] = arguments[e];
      _.forEach(function(a) {
        if (u(a) !== "object" || !a.name || !a.init) throw new Error("Invalid JSEP plugin format");
        n.registered[a.name] || (a.init(n.jsep), n.registered[a.name] = a);
      });
    }, "value") }]);
  })(), s = (function() {
    function n(c) {
      m(this, n), this.expr = c, this.index = 0;
    }
    return r(n, "l"), t(n, [{ key: "char", get: r(function() {
      return this.expr.charAt(this.index);
    }, "get") }, { key: "code", get: r(function() {
      return this.expr.charCodeAt(this.index);
    }, "get") }, { key: "throwError", value: r(function(c) {
      var _ = new Error(c + " at character " + this.index);
      throw _.index = this.index, _.description = c, _;
    }, "value") }, { key: "runHook", value: r(function(c, _) {
      if (n.hooks[c]) {
        var e = { context: this, node: _ };
        return n.hooks.run(c, e), e.node;
      }
      return _;
    }, "value") }, { key: "searchHook", value: r(function(c) {
      if (n.hooks[c]) {
        var _ = { context: this };
        return n.hooks[c].find(function(e) {
          return e.call(_.context, _), _.node;
        }), _.node;
      }
    }, "value") }, { key: "gobbleSpaces", value: r(function() {
      for (var c = this.code; c === n.SPACE_CODE || c === n.TAB_CODE || c === n.LF_CODE || c === n.CR_CODE; ) c = this.expr.charCodeAt(++this.index);
      this.runHook("gobble-spaces");
    }, "value") }, { key: "parse", value: r(function() {
      this.runHook("before-all");
      var c = this.gobbleExpressions(), c = c.length === 1 ? c[0] : { type: n.COMPOUND, body: c };
      return this.runHook("after-all", c);
    }, "value") }, { key: "gobbleExpressions", value: r(function(c) {
      for (var _, e, a = []; this.index < this.expr.length; ) if ((_ = this.code) === n.SEMCOL_CODE || _ === n.COMMA_CODE) this.index++;
      else if (e = this.gobbleExpression()) a.push(e);
      else if (this.index < this.expr.length) {
        if (_ === c) break;
        this.throwError('Unexpected "' + this.char + '"');
      }
      return a;
    }, "value") }, { key: "gobbleExpression", value: r(function() {
      var c = this.searchHook("gobble-expression") || this.gobbleBinaryExpression();
      return this.gobbleSpaces(), this.runHook("after-expression", c);
    }, "value") }, { key: "gobbleBinaryOp", value: r(function() {
      this.gobbleSpaces();
      for (var c = this.expr.substr(this.index, n.max_binop_len), _ = c.length; 0 < _; ) {
        if (n.binary_ops.hasOwnProperty(c) && (!n.isIdentifierStart(this.code) || this.index + c.length < this.expr.length && !n.isIdentifierPart(this.expr.charCodeAt(this.index + c.length)))) return this.index += _, c;
        c = c.substr(0, --_);
      }
      return false;
    }, "value") }, { key: "gobbleBinaryExpression", value: r(function() {
      var c, _, e, a, E, O, T, L, N, U = this.gobbleToken();
      if (!U || !(_ = this.gobbleBinaryOp())) return U;
      for (E = { value: _, prec: n.binaryPrecedence(_), right_a: n.right_associative.has(_) }, (O = this.gobbleToken()) || this.throwError("Expected expression after " + _), a = [U, E, O]; _ = this.gobbleBinaryOp(); ) {
        if ((e = n.binaryPrecedence(_)) === 0) {
          this.index -= _.length;
          break;
        }
        for (E = { value: _, prec: e, right_a: n.right_associative.has(_) }, L = _; 2 < a.length && (N = a[a.length - 2], E.right_a && N.right_a ? e > N.prec : e <= N.prec); ) O = a.pop(), _ = a.pop().value, U = a.pop(), c = { type: n.BINARY_EXP, operator: _, left: U, right: O }, a.push(c);
        (c = this.gobbleToken()) || this.throwError("Expected expression after " + L), a.push(E, c);
      }
      for (c = a[T = a.length - 1]; 1 < T; ) c = { type: n.BINARY_EXP, operator: a[T - 1].value, left: a[T - 2], right: c }, T -= 2;
      return c;
    }, "value") }, { key: "gobbleToken", value: r(function() {
      var c, _, e, a;
      if (this.gobbleSpaces(), a = this.searchHook("gobble-token")) return this.runHook("after-token", a);
      if (c = this.code, n.isDecimalDigit(c) || c === n.PERIOD_CODE) return this.gobbleNumericLiteral();
      if (c === n.SQUOTE_CODE || c === n.DQUOTE_CODE) a = this.gobbleStringLiteral();
      else if (c === n.OBRACK_CODE) a = this.gobbleArray();
      else {
        for (e = (_ = this.expr.substr(this.index, n.max_unop_len)).length; 0 < e; ) {
          if (n.unary_ops.hasOwnProperty(_) && (!n.isIdentifierStart(this.code) || this.index + _.length < this.expr.length && !n.isIdentifierPart(this.expr.charCodeAt(this.index + _.length)))) {
            this.index += e;
            var E = this.gobbleToken();
            return E || this.throwError("missing unaryOp argument"), this.runHook("after-token", { type: n.UNARY_EXP, operator: _, argument: E, prefix: true });
          }
          _ = _.substr(0, --e);
        }
        n.isIdentifierStart(c) ? (a = this.gobbleIdentifier(), n.literals.hasOwnProperty(a.name) ? a = { type: n.LITERAL, value: n.literals[a.name], raw: a.name } : a.name === n.this_str && (a = { type: n.THIS_EXP })) : c === n.OPAREN_CODE && (a = this.gobbleGroup());
      }
      return a ? (a = this.gobbleTokenProperty(a), this.runHook("after-token", a)) : this.runHook("after-token", false);
    }, "value") }, { key: "gobbleTokenProperty", value: r(function(c) {
      this.gobbleSpaces();
      for (var _ = this.code; _ === n.PERIOD_CODE || _ === n.OBRACK_CODE || _ === n.OPAREN_CODE || _ === n.QUMARK_CODE; ) {
        var e = void 0;
        if (_ === n.QUMARK_CODE) {
          if (this.expr.charCodeAt(this.index + 1) !== n.PERIOD_CODE) break;
          e = true, this.index += 2, this.gobbleSpaces(), _ = this.code;
        }
        this.index++, _ === n.OBRACK_CODE ? (c = { type: n.MEMBER_EXP, computed: true, object: c, property: this.gobbleExpression() }, this.gobbleSpaces(), (_ = this.code) !== n.CBRACK_CODE && this.throwError("Unclosed ["), this.index++) : _ === n.OPAREN_CODE ? c = { type: n.CALL_EXP, arguments: this.gobbleArguments(n.CPAREN_CODE), callee: c } : _ !== n.PERIOD_CODE && !e || (e && this.index--, this.gobbleSpaces(), c = { type: n.MEMBER_EXP, computed: false, object: c, property: this.gobbleIdentifier() }), e && (c.optional = true), this.gobbleSpaces(), _ = this.code;
      }
      return c;
    }, "value") }, { key: "gobbleNumericLiteral", value: r(function() {
      for (var c, _ = ""; n.isDecimalDigit(this.code); ) _ += this.expr.charAt(this.index++);
      if (this.code === n.PERIOD_CODE) for (_ += this.expr.charAt(this.index++); n.isDecimalDigit(this.code); ) _ += this.expr.charAt(this.index++);
      if ((c = this.char) === "e" || c === "E") {
        for (_ += this.expr.charAt(this.index++), (c = this.char) !== "+" && c !== "-" || (_ += this.expr.charAt(this.index++)); n.isDecimalDigit(this.code); ) _ += this.expr.charAt(this.index++);
        n.isDecimalDigit(this.expr.charCodeAt(this.index - 1)) || this.throwError("Expected exponent (" + _ + this.char + ")");
      }
      return c = this.code, n.isIdentifierStart(c) ? this.throwError("Variable names cannot start with a number (" + _ + this.char + ")") : (c === n.PERIOD_CODE || _.length === 1 && _.charCodeAt(0) === n.PERIOD_CODE) && this.throwError("Unexpected period"), { type: n.LITERAL, value: parseFloat(_), raw: _ };
    }, "value") }, { key: "gobbleStringLiteral", value: r(function() {
      for (var c = "", _ = this.index, e = this.expr.charAt(this.index++), a = false; this.index < this.expr.length; ) {
        var E = this.expr.charAt(this.index++);
        if (E === e) {
          a = true;
          break;
        }
        if (E === "\\") switch (E = this.expr.charAt(this.index++)) {
          case "n":
            c += `
`;
            break;
          case "r":
            c += "\r";
            break;
          case "t":
            c += "	";
            break;
          case "b":
            c += "\b";
            break;
          case "f":
            c += "\f";
            break;
          case "v":
            c += "\v";
            break;
          default:
            c += E;
        }
        else c += E;
      }
      return a || this.throwError('Unclosed quote after "' + c + '"'), { type: n.LITERAL, value: c, raw: this.expr.substring(_, this.index) };
    }, "value") }, { key: "gobbleIdentifier", value: r(function() {
      var c = this.code, _ = this.index;
      for (n.isIdentifierStart(c) ? this.index++ : this.throwError("Unexpected " + this.char); this.index < this.expr.length && (c = this.code, n.isIdentifierPart(c)); ) this.index++;
      return { type: n.IDENTIFIER, name: this.expr.slice(_, this.index) };
    }, "value") }, { key: "gobbleArguments", value: r(function(c) {
      for (var _ = [], e = false, a = 0; this.index < this.expr.length; ) {
        this.gobbleSpaces();
        var E = this.code;
        if (E === c) {
          e = true, this.index++, c === n.CPAREN_CODE && a && a >= _.length && this.throwError("Unexpected token " + String.fromCharCode(c));
          break;
        }
        if (E === n.COMMA_CODE) {
          if (this.index++, ++a !== _.length) {
            if (c === n.CPAREN_CODE) this.throwError("Unexpected token ,");
            else if (c === n.CBRACK_CODE) for (var O = _.length; O < a; O++) _.push(null);
          }
        } else _.length !== a && a !== 0 ? this.throwError("Expected comma") : ((E = this.gobbleExpression()) && E.type !== n.COMPOUND || this.throwError("Expected comma"), _.push(E));
      }
      return e || this.throwError("Expected " + String.fromCharCode(c)), _;
    }, "value") }, { key: "gobbleGroup", value: r(function() {
      this.index++;
      var c = this.gobbleExpressions(n.CPAREN_CODE);
      if (this.code === n.CPAREN_CODE) return this.index++, c.length === 1 ? c[0] : !!c.length && { type: n.SEQUENCE_EXP, expressions: c };
      this.throwError("Unclosed (");
    }, "value") }, { key: "gobbleArray", value: r(function() {
      return this.index++, { type: n.ARRAY_EXP, elements: this.gobbleArguments(n.CBRACK_CODE) };
    }, "value") }], [{ key: "version", get: r(function() {
      return "1.3.8";
    }, "get") }, { key: "toString", value: r(function() {
      return "JavaScript Expression Parser (JSEP) v" + n.version;
    }, "value") }, { key: "addUnaryOp", value: r(function(c) {
      return n.max_unop_len = Math.max(c.length, n.max_unop_len), n.unary_ops[c] = 1, n;
    }, "value") }, { key: "addBinaryOp", value: r(function(c, _, e) {
      return n.max_binop_len = Math.max(c.length, n.max_binop_len), n.binary_ops[c] = _, e ? n.right_associative.add(c) : n.right_associative.delete(c), n;
    }, "value") }, { key: "addIdentifierChar", value: r(function(c) {
      return n.additional_identifier_chars.add(c), n;
    }, "value") }, { key: "addLiteral", value: r(function(c, _) {
      return n.literals[c] = _, n;
    }, "value") }, { key: "removeUnaryOp", value: r(function(c) {
      return delete n.unary_ops[c], c.length === n.max_unop_len && (n.max_unop_len = n.getMaxKeyLen(n.unary_ops)), n;
    }, "value") }, { key: "removeAllUnaryOps", value: r(function() {
      return n.unary_ops = {}, n.max_unop_len = 0, n;
    }, "value") }, { key: "removeIdentifierChar", value: r(function(c) {
      return n.additional_identifier_chars.delete(c), n;
    }, "value") }, { key: "removeBinaryOp", value: r(function(c) {
      return delete n.binary_ops[c], c.length === n.max_binop_len && (n.max_binop_len = n.getMaxKeyLen(n.binary_ops)), n.right_associative.delete(c), n;
    }, "value") }, { key: "removeAllBinaryOps", value: r(function() {
      return n.binary_ops = {}, n.max_binop_len = 0, n;
    }, "value") }, { key: "removeLiteral", value: r(function(c) {
      return delete n.literals[c], n;
    }, "value") }, { key: "removeAllLiterals", value: r(function() {
      return n.literals = {}, n;
    }, "value") }, { key: "parse", value: r(function(c) {
      return new n(c).parse();
    }, "value") }, { key: "getMaxKeyLen", value: r(function(c) {
      return Math.max.apply(Math, [0].concat(y(Object.keys(c).map(function(_) {
        return _.length;
      }))));
    }, "value") }, { key: "isDecimalDigit", value: r(function(c) {
      return 48 <= c && c <= 57;
    }, "value") }, { key: "binaryPrecedence", value: r(function(c) {
      return n.binary_ops[c] || 0;
    }, "value") }, { key: "isIdentifierStart", value: r(function(c) {
      return 65 <= c && c <= 90 || 97 <= c && c <= 122 || 128 <= c && !n.binary_ops[String.fromCharCode(c)] || n.additional_identifier_chars.has(String.fromCharCode(c));
    }, "value") }, { key: "isIdentifierPart", value: r(function(c) {
      return n.isIdentifierStart(c) || n.isDecimalDigit(c);
    }, "value") }]);
  })(), h = new h();
  Object.assign(s, { hooks: h, plugins: new A(s), COMPOUND: "Compound", SEQUENCE_EXP: "SequenceExpression", IDENTIFIER: "Identifier", MEMBER_EXP: "MemberExpression", LITERAL: "Literal", THIS_EXP: "ThisExpression", CALL_EXP: "CallExpression", UNARY_EXP: "UnaryExpression", BINARY_EXP: "BinaryExpression", ARRAY_EXP: "ArrayExpression", TAB_CODE: 9, LF_CODE: 10, CR_CODE: 13, SPACE_CODE: 32, PERIOD_CODE: 46, COMMA_CODE: 44, SQUOTE_CODE: 39, DQUOTE_CODE: 34, OPAREN_CODE: 40, CPAREN_CODE: 41, OBRACK_CODE: 91, CBRACK_CODE: 93, QUMARK_CODE: 63, SEMCOL_CODE: 59, COLON_CODE: 58, unary_ops: { "-": 1, "!": 1, "~": 1, "+": 1 }, binary_ops: { "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5, "==": 6, "!=": 6, "===": 6, "!==": 6, "<": 7, ">": 7, "<=": 7, ">=": 7, "<<": 8, ">>": 8, ">>>": 8, "+": 9, "-": 9, "*": 10, "/": 10, "%": 10 }, right_associative: /* @__PURE__ */ new Set(), additional_identifier_chars: /* @__PURE__ */ new Set(["$", "_"]), literals: { true: true, false: false, null: null }, this_str: "this" }), s.max_unop_len = s.getMaxKeyLen(s.unary_ops), s.max_binop_len = s.getMaxKeyLen(s.binary_ops);
  var p2 = r(function(n) {
    return new s(n).parse();
  }, "E");
  Object.getOwnPropertyNames(s).forEach(function(n) {
    p2[n] === void 0 && n !== "prototype" && (p2[n] = s[n]);
  }), p2.Jsep = s, A = { name: "ternary", init: r(function(n) {
    n.hooks.add("after-expression", function(c) {
      if (c.node && this.code === n.QUMARK_CODE) {
        this.index++;
        var _ = c.node, e = this.gobbleExpression();
        if (e || this.throwError("Expected expression"), this.gobbleSpaces(), this.code === n.COLON_CODE) {
          this.index++;
          var a = this.gobbleExpression();
          if (a || this.throwError("Expected expression"), c.node = { type: "ConditionalExpression", test: _, consequent: e, alternate: a }, _.operator && n.binary_ops[_.operator] <= 0.9) {
            for (var E = _; E.right.operator && n.binary_ops[E.right.operator] <= 0.9; ) E = E.right;
            c.node.test = E.right, E.right = c.node, c.node = _;
          }
        } else this.throwError("Expected :");
      }
    });
  }, "init") }, p2.plugins.register(A);
  var A = { name: "regex", init: r(function(n) {
    n.hooks.add("gobble-token", function(c) {
      if (this.code === 47) {
        for (var _ = ++this.index, e = false; this.index < this.expr.length; ) {
          if (this.code === 47 && !e) {
            for (var a = this.expr.slice(_, this.index), E = ""; ++this.index < this.expr.length; ) {
              var O = this.code;
              if (!(97 <= O && O <= 122 || 65 <= O && O <= 90 || 48 <= O && O <= 57)) break;
              E += this.char;
            }
            var T = void 0;
            try {
              T = new RegExp(a, E);
            } catch (L) {
              this.throwError(L.message);
            }
            return c.node = { type: n.LITERAL, value: T, raw: this.expr.slice(_ - 1, this.index) }, c.node = this.gobbleTokenProperty(c.node), c.node;
          }
          this.code === n.OBRACK_CODE ? e = true : e && this.code === n.CBRACK_CODE && (e = false), this.index += this.code === 92 ? 2 : 1;
        }
        this.throwError("Unclosed Regex");
      }
    });
  }, "init") }, S = { name: "assignment", assignmentOperators: /* @__PURE__ */ new Set(["=", "*=", "**=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="]), updateOperators: [43, 45], assignmentPrecedence: 0.9, init: r(function(n) {
    var c = [n.IDENTIFIER, n.MEMBER_EXP];
    S.assignmentOperators.forEach(function(_) {
      return n.addBinaryOp(_, S.assignmentPrecedence, true);
    }), n.hooks.add("gobble-token", function(_) {
      var e = this, a = this.code;
      S.updateOperators.some(function(E) {
        return E === a && E === e.expr.charCodeAt(e.index + 1);
      }) && (this.index += 2, _.node = { type: "UpdateExpression", operator: a === 43 ? "++" : "--", argument: this.gobbleTokenProperty(this.gobbleIdentifier()), prefix: true }, _.node.argument && c.includes(_.node.argument.type) || this.throwError("Unexpected ".concat(_.node.operator)));
    }), n.hooks.add("after-token", function(_) {
      var e, a = this;
      _.node && (e = this.code, S.updateOperators.some(function(E) {
        return E === e && E === a.expr.charCodeAt(a.index + 1);
      }) && (c.includes(_.node.type) || this.throwError("Unexpected ".concat(_.node.operator)), this.index += 2, _.node = { type: "UpdateExpression", operator: e === 43 ? "++" : "--", argument: _.node, prefix: false }));
    }), n.hooks.add("after-expression", function(_) {
      _.node && r(function e(a) {
        S.assignmentOperators.has(a.operator) ? (a.type = "AssignmentExpression", e(a.left), e(a.right)) : a.operator || Object.values(a).forEach(function(E) {
          E && u(E) === "object" && e(E);
        });
      }, "t")(_.node);
    });
  }, "init") }, B = Object.prototype.hasOwnProperty;
  function w(n, c) {
    return (n = n.slice()).push(c), n;
  }
  r(w, "w");
  function P(n, c) {
    return (c = c.slice()).unshift(n), c;
  }
  r(P, "k");
  var F = (function() {
    function n(c) {
      var _;
      return m(this, n), (_ = M(this, n, ['JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'])).avoidNew = true, _.value = c, _.name = "NewError", _;
    }
    return r(n, "r"), (function(c, _) {
      if (typeof _ != "function" && _ !== null) throw new TypeError("Super expression must either be null or a function");
      c.prototype = Object.create(_ && _.prototype, { constructor: { value: c, writable: true, configurable: true } }), Object.defineProperty(c, "prototype", { writable: false }), _ && i(c, _);
    })(n, o(Error)), t(n);
  })();
  function I(n, c, _, e, a) {
    if (!(this instanceof I)) try {
      return new I(n, c, _, e, a);
    } catch (T) {
      if (!T.avoidNew) throw T;
      return T.value;
    }
    typeof n == "string" && (a = e, e = _, _ = c, c = n, n = null);
    var E = n && u(n) === "object";
    if (n = n || {}, this.json = n.json || _, this.path = n.path || c, this.resultType = n.resultType || "value", this.flatten = n.flatten || false, this.wrap = !B.call(n, "wrap") || n.wrap, this.sandbox = n.sandbox || {}, this.eval = n.eval === void 0 ? "safe" : n.eval, this.ignoreEvalErrors = n.ignoreEvalErrors !== void 0 && n.ignoreEvalErrors, this.parent = n.parent || null, this.parentProperty = n.parentProperty || null, this.callback = n.callback || e || null, this.otherTypeCallback = n.otherTypeCallback || a || function() {
      throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.");
    }, n.autostart !== false) {
      var O = { path: E ? n.path : c };
      if (E ? "json" in n && (O.json = n.json) : O.json = _, O = this.evaluate(O), !O || u(O) !== "object") throw new F(O);
      return O;
    }
  }
  r(I, "F"), I.prototype.evaluate = function(n, c, _, e) {
    var a = this, E = this.parent, O = this.parentProperty, T = this.flatten, L = this.wrap;
    if (this.currResultType = this.resultType, this.currEval = this.eval, this.currSandbox = this.sandbox, _ = _ || this.callback, this.currOtherTypeCallback = e || this.otherTypeCallback, c = c || this.json, (n = n || this.path) && u(n) === "object" && !Array.isArray(n)) {
      if (!n.path && n.path !== "") throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
      if (!B.call(n, "json")) throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');
      c = n.json, T = B.call(n, "flatten") ? n.flatten : T, this.currResultType = B.call(n, "resultType") ? n.resultType : this.currResultType, this.currSandbox = B.call(n, "sandbox") ? n.sandbox : this.currSandbox, L = B.call(n, "wrap") ? n.wrap : L, this.currEval = B.call(n, "eval") ? n.eval : this.currEval, _ = B.call(n, "callback") ? n.callback : _, this.currOtherTypeCallback = B.call(n, "otherTypeCallback") ? n.otherTypeCallback : this.currOtherTypeCallback, E = B.call(n, "parent") ? n.parent : E, O = B.call(n, "parentProperty") ? n.parentProperty : O, n = n.path;
    }
    if (E = E || null, O = O || null, Array.isArray(n) && (n = I.toPathString(n)), (n || n === "") && c) return n = I.toPathArray(n), n[0] === "$" && 1 < n.length && n.shift(), this._hasParentSelector = null, _ = this._trace(n, c, ["$"], E, O, _).filter(function(N) {
      return N && !N.isParentSelector;
    }), _.length ? L || _.length !== 1 || _[0].hasArrExpr ? _.reduce(function(N, U) {
      return U = a._getPreferredOutput(U), T && Array.isArray(U) ? N = N.concat(U) : N.push(U), N;
    }, []) : this._getPreferredOutput(_[0]) : L ? [] : void 0;
  }, I.prototype._getPreferredOutput = function(n) {
    var c = this.currResultType;
    switch (c) {
      case "all":
        var _ = Array.isArray(n.path) ? n.path : I.toPathArray(n.path);
        return n.pointer = I.toPointer(_), n.path = typeof n.path == "string" ? n.path : I.toPathString(n.path), n;
      case "value":
      case "parent":
      case "parentProperty":
        return n[c];
      case "path":
        return I.toPathString(n[c]);
      case "pointer":
        return I.toPointer(n.path);
      default:
        throw new TypeError("Unknown result type");
    }
  }, I.prototype._handleCallback = function(n, c, _) {
    var e;
    c && (e = this._getPreferredOutput(n), n.path = typeof n.path == "string" ? n.path : I.toPathString(n.path), c(e, _, n));
  }, I.prototype._trace = function(n, c, _, e, a, E, O, T) {
    var L = this;
    if (!n.length) return D = { path: _, value: c, parent: e, parentProperty: a, hasArrExpr: O }, this._handleCallback(D, E, "value"), D;
    var N = n[0], U = n.slice(1), X = [];
    function Q(te) {
      Array.isArray(te) ? te.forEach(function(se) {
        X.push(se);
      }) : X.push(te);
    }
    if (r(Q, "p"), (typeof N != "string" || T) && c && B.call(c, N)) Q(this._trace(U, c[N], w(_, N), c, N, E, O));
    else if (N === "*") this._walk(c, function(te) {
      Q(L._trace(U, c[te], w(_, te), c, te, E, true, true));
    });
    else if (N === "..") Q(this._trace(U, c, _, e, a, E, O)), this._walk(c, function(te) {
      u(c[te]) === "object" && Q(L._trace(n.slice(), c[te], w(_, te), c, te, E, true));
    });
    else {
      if (N === "^") return this._hasParentSelector = true, { path: _.slice(0, -1), expr: U, isParentSelector: true };
      if (N === "~") return D = { path: w(_, N), value: a, parent: e, parentProperty: null }, this._handleCallback(D, E, "property"), D;
      if (N === "$") Q(this._trace(U, c, _, null, null, E, O));
      else if (/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(N)) Q(this._slice(N, U, c, _, e, a, E));
      else if (N.indexOf("?(") === 0) {
        if (this.currEval === false) throw new Error("Eval [?(expr)] prevented in JSONPath expression.");
        var W = N.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/, "$1"), J = /@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])?((?:[\0->@-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))(?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\)\])['\]]/g.exec(W);
        J ? this._walk(c, function(te) {
          var se = [J[2]], re = J[1] ? c[te][J[1]] : c[te];
          0 < L._trace(se, re, _, e, a, E, true).length && Q(L._trace(U, c[te], w(_, te), c, te, E, true));
        }) : this._walk(c, function(te) {
          L._eval(W, c[te], te, _, e, a) && Q(L._trace(U, c[te], w(_, te), c, te, E, true));
        });
      } else if (N[0] === "(") {
        if (this.currEval === false) throw new Error("Eval [(expr)] prevented in JSONPath expression.");
        Q(this._trace(P(this._eval(N, c, _[_.length - 1], _.slice(0, -1), e, a), U), c, _, e, a, E, O));
      } else if (N[0] === "@") {
        var V = false, z = N.slice(1, -2);
        switch (z) {
          case "scalar":
            c && ["object", "function"].includes(u(c)) || (V = true);
            break;
          case "boolean":
          case "string":
          case "undefined":
          case "function":
            u(c) === z && (V = true);
            break;
          case "integer":
            !Number.isFinite(c) || c % 1 || (V = true);
            break;
          case "number":
            Number.isFinite(c) && (V = true);
            break;
          case "nonFinite":
            typeof c != "number" || Number.isFinite(c) || (V = true);
            break;
          case "object":
            c && u(c) === z && (V = true);
            break;
          case "array":
            Array.isArray(c) && (V = true);
            break;
          case "other":
            V = this.currOtherTypeCallback(c, _, e, a);
            break;
          case "null":
            c === null && (V = true);
            break;
          default:
            throw new TypeError("Unknown value type " + z);
        }
        if (V) return D = { path: _, value: c, parent: e, parentProperty: a }, this._handleCallback(D, E, "value"), D;
      } else if (N[0] === "`" && c && B.call(c, N.slice(1))) {
        var D = N.slice(1);
        Q(this._trace(U, c[D], w(_, D), c, D, E, O, true));
      } else if (N.includes(",")) {
        var x = (function(te, se) {
          var re = typeof Symbol < "u" && te[Symbol.iterator] || te["@@iterator"];
          if (!re) {
            if (Array.isArray(te) || (re = l(te)) || se && te && typeof te.length == "number") {
              re && (te = re);
              var le = 0, se = r(function() {
              }, "t");
              return { s: se, n: r(function() {
                return le >= te.length ? { done: true } : { done: false, value: te[le++] };
              }, "n"), e: r(function(ce) {
                throw ce;
              }, "e"), f: se };
            }
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
          }
          var me, Ee = true, De = false;
          return { s: r(function() {
            re = re.call(te);
          }, "s"), n: r(function() {
            var _e = re.next();
            return Ee = _e.done, _e;
          }, "n"), e: r(function(_e) {
            De = true, me = _e;
          }, "e"), f: r(function() {
            try {
              Ee || re.return == null || re.return();
            } finally {
              if (De) throw me;
            }
          }, "f") };
        })(N.split(","));
        try {
          for (x.s(); !(R = x.n()).done; ) {
            var R = R.value;
            Q(this._trace(P(R, U), c, _, e, a, E, true));
          }
        } catch (te) {
          x.e(te);
        } finally {
          x.f();
        }
      } else !T && c && B.call(c, N) && Q(this._trace(U, c[N], w(_, N), c, N, E, O, true));
    }
    if (this._hasParentSelector) for (var K = 0; K < X.length; K++) {
      var H = X[K];
      if (H && H.isParentSelector) {
        var G = this._trace(H.expr, c, H.path, e, a, E, O);
        if (Array.isArray(G)) {
          X[K] = G[0];
          for (var ne = G.length, ie = 1; ie < ne; ie++) K++, X.splice(K, 0, G[ie]);
        } else X[K] = G;
      }
    }
    return X;
  }, I.prototype._walk = function(n, c) {
    if (Array.isArray(n)) for (var _ = n.length, e = 0; e < _; e++) c(e);
    else n && u(n) === "object" && Object.keys(n).forEach(function(a) {
      c(a);
    });
  }, I.prototype._slice = function(n, c, _, e, a, E, O) {
    if (Array.isArray(_)) {
      for (var T = _.length, L = n.split(":"), N = L[2] && Number.parseInt(L[2]) || 1, n = L[0] && Number.parseInt(L[0]) || 0, U = L[1] && Number.parseInt(L[1]) || T, n = n < 0 ? Math.max(0, n + T) : Math.min(T, n), U = U < 0 ? Math.max(0, U + T) : Math.min(T, U), X = [], Q = n; Q < U; Q += N) this._trace(P(Q, c), _, e, a, E, O, true).forEach(function(J) {
        X.push(J);
      });
      return X;
    }
  }, I.prototype._eval = function(n, c, _, e, a, E) {
    var O = this;
    this.currSandbox._$_parentProperty = E, this.currSandbox._$_parent = a, this.currSandbox._$_property = _, this.currSandbox._$_root = this.json, this.currSandbox._$_v = c, c = n.includes("@path"), c && (this.currSandbox._$_path = I.toPathString(e.concat([_])));
    var T = this.currEval + "Script:" + n;
    if (!I.cache[T]) {
      var L = n.replace(/@parentProperty/g, "_$_parentProperty").replace(/@parent/g, "_$_parent").replace(/@property/g, "_$_property").replace(/@root/g, "_$_root").replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g, "_$_v$1");
      if (c && (L = L.replace(/@path/g, "_$_path")), this.currEval === "safe" || this.currEval === true || this.currEval === void 0) I.cache[T] = new this.safeVm.Script(L);
      else if (this.currEval === "native") I.cache[T] = new this.vm.Script(L);
      else if (typeof this.currEval == "function" && this.currEval.prototype && B.call(this.currEval.prototype, "runInNewContext")) c = this.currEval, I.cache[T] = new c(L);
      else {
        if (typeof this.currEval != "function") throw new TypeError('Unknown "eval" property "'.concat(this.currEval, '"'));
        I.cache[T] = { runInNewContext: r(function(N) {
          return O.currEval(L, N);
        }, "runInNewContext") };
      }
    }
    try {
      return I.cache[T].runInNewContext(this.currSandbox);
    } catch (N) {
      if (this.ignoreEvalErrors) return false;
      throw new Error("jsonPath: " + N.message + ": " + n);
    }
  }, I.cache = {}, I.toPathString = function(n) {
    for (var c = n, _ = c.length, e = "$", a = 1; a < _; a++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(c[a]) || (e += /^[\*0-9]+$/.test(c[a]) ? "[" + c[a] + "]" : "['" + c[a] + "']");
    return e;
  }, I.toPointer = function(n) {
    for (var c = n, _ = c.length, e = "", a = 1; a < _; a++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(c[a]) || (e += "/" + c[a].toString().replace(/~/g, "~0").replace(/\//g, "~1"));
    return e;
  }, I.toPathArray = function(n) {
    var c = I.cache;
    if (c[n]) return c[n].concat();
    var _ = [], e = n.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g, ";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]](?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\])/g, function(a, E) {
      return "[#" + (_.push(E) - 1) + "]";
    }).replace(/\[["']((?:[\0-&\(-\\\^-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)["']\]/g, function(a, E) {
      return "['" + E.replace(/\./g, "%@%").replace(/~/g, "%%@@%%") + "']";
    }).replace(/~/g, ";~;").replace(/["']?\.["']?(?!(?:[\0-Z\\-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*\])|\[["']?/g, ";").replace(/%@%/g, ".").replace(/%%@@%%/g, "~").replace(/(?:;)?(\^+)(?:;)?/g, function(a, E) {
      return ";" + E.split("").join(";") + ";";
    }).replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "").split(";").map(function(a) {
      var E = a.match(/#([0-9]+)/);
      return E && E[1] ? _[E[1]] : a;
    });
    return c[n] = e, c[n].concat();
  }, p2.plugins.register(A, S);
  var k = { evalAst: r(function(n, c) {
    switch (n.type) {
      case "BinaryExpression":
      case "LogicalExpression":
        return k.evalBinaryExpression(n, c);
      case "Compound":
        return k.evalCompound(n, c);
      case "ConditionalExpression":
        return k.evalConditionalExpression(n, c);
      case "Identifier":
        return k.evalIdentifier(n, c);
      case "Literal":
        return k.evalLiteral(n, c);
      case "MemberExpression":
        return k.evalMemberExpression(n, c);
      case "UnaryExpression":
        return k.evalUnaryExpression(n, c);
      case "ArrayExpression":
        return k.evalArrayExpression(n, c);
      case "CallExpression":
        return k.evalCallExpression(n, c);
      case "AssignmentExpression":
        return k.evalAssignmentExpression(n, c);
      default:
        throw SyntaxError("Unexpected expression", n);
    }
  }, "evalAst"), evalBinaryExpression: r(function(n, c) {
    return { "||": r(function(_, e) {
      return _ || e();
    }, "||"), "&&": r(function(_, e) {
      return _ && e();
    }, "&&"), "|": r(function(_, e) {
      return _ | e();
    }, "|"), "^": r(function(_, e) {
      return _ ^ e();
    }, "^"), "&": r(function(_, e) {
      return _ & e();
    }, "&"), "==": r(function(_, e) {
      return _ == e();
    }, "=="), "!=": r(function(_, e) {
      return _ != e();
    }, "!="), "===": r(function(_, e) {
      return _ === e();
    }, "==="), "!==": r(function(_, e) {
      return _ !== e();
    }, "!=="), "<": r(function(_, e) {
      return _ < e();
    }, "<"), ">": r(function(_, e) {
      return _ > e();
    }, ">"), "<=": r(function(_, e) {
      return _ <= e();
    }, "<="), ">=": r(function(_, e) {
      return _ >= e();
    }, ">="), "<<": r(function(_, e) {
      return _ << e();
    }, "<<"), ">>": r(function(_, e) {
      return _ >> e();
    }, ">>"), ">>>": r(function(_, e) {
      return _ >>> e();
    }, ">>>"), "+": r(function(_, e) {
      return _ + e();
    }, "+"), "-": r(function(_, e) {
      return _ - e();
    }, "-"), "*": r(function(_, e) {
      return _ * e();
    }, "*"), "/": r(function(_, e) {
      return _ / e();
    }, "/"), "%": r(function(_, e) {
      return _ % e();
    }, "%") }[n.operator](k.evalAst(n.left, c), function() {
      return k.evalAst(n.right, c);
    });
  }, "evalBinaryExpression"), evalCompound: r(function(n, c) {
    for (var _ = 0; _ < n.body.length; _++) {
      n.body[_].type === "Identifier" && ["var", "let", "const"].includes(n.body[_].name) && n.body[_ + 1] && n.body[_ + 1].type === "AssignmentExpression" && (_ += 1);
      var e = n.body[_], a = k.evalAst(e, c);
    }
    return a;
  }, "evalCompound"), evalConditionalExpression: r(function(n, c) {
    return k.evalAst(n.test, c) ? k.evalAst(n.consequent, c) : k.evalAst(n.alternate, c);
  }, "evalConditionalExpression"), evalIdentifier: r(function(n, c) {
    if (n.name in c) return c[n.name];
    throw ReferenceError("".concat(n.name, " is not defined"));
  }, "evalIdentifier"), evalLiteral: r(function(n) {
    return n.value;
  }, "evalLiteral"), evalMemberExpression: r(function(n, _) {
    var e = n.computed ? k.evalAst(n.property) : n.property.name, _ = k.evalAst(n.object, _), e = _[e];
    return typeof e == "function" ? e.bind(_) : e;
  }, "evalMemberExpression"), evalUnaryExpression: r(function(n, c) {
    return { "-": r(function(_) {
      return -k.evalAst(_, c);
    }, "-"), "!": r(function(_) {
      return !k.evalAst(_, c);
    }, "!"), "~": r(function(_) {
      return ~k.evalAst(_, c);
    }, "~"), "+": r(function(_) {
      return +k.evalAst(_, c);
    }, "+") }[n.operator](n.argument);
  }, "evalUnaryExpression"), evalArrayExpression: r(function(n, c) {
    return n.elements.map(function(_) {
      return k.evalAst(_, c);
    });
  }, "evalArrayExpression"), evalCallExpression: r(function(n, c) {
    var _ = n.arguments.map(function(e) {
      return k.evalAst(e, c);
    });
    return k.evalAst(n.callee, c).apply(void 0, y(_));
  }, "evalCallExpression"), evalAssignmentExpression: r(function(e, c) {
    if (e.left.type !== "Identifier") throw SyntaxError("Invalid left-hand side in assignment");
    var _ = e.left.name, e = k.evalAst(e.right, c);
    return c[_] = e, c[_];
  }, "evalAssignmentExpression") }, A = (function() {
    return t(r(function n(c) {
      m(this, n), this.code = c, this.ast = p2(this.code);
    }, "e"), [{ key: "runInNewContext", value: r(function(n) {
      return n = b({}, n), k.evalAst(this.ast, n);
    }, "value") }]);
  })();
  I.prototype.vm = { Script: (function() {
    return t(r(function n(c) {
      m(this, n), this.code = c;
    }, "e"), [{ key: "runInNewContext", value: r(function(n) {
      var c = this.code, _ = Object.keys(n), a = [];
      (function(E, O, T) {
        for (var L = E.length, N = 0; N < L; N++) T(E[N]) && O.push(E.splice(N--, 1)[0]);
      })(_, a, function(E) {
        return typeof n[E] == "function";
      });
      var e = _.map(function(E) {
        return n[E];
      }), a = a.reduce(function(E, O) {
        var T = n[O].toString();
        return /function/.test(T) || (T = "function " + T), "var " + O + "=" + T + ";" + E;
      }, "");
      return /(["'])use strict\1/.test(c = a + c) || _.includes("arguments") || (c = "var arguments = undefined;" + c), a = (c = c.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/, "")).lastIndexOf(";"), c = -1 < a ? c.slice(0, a + 1) + " return " + c.slice(a + 1) : " return " + c, $(Function, _.concat([c])).apply(void 0, y(e));
    }, "value") }]);
  })() }, I.prototype.safeVm = { Script: A }, Y.JSONPath = I, Y.SafeScript = A;
});
var Dn = `(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?factory(exports):typeof define==="function"&&define.amd?define(["exports"],factory):(global=typeof globalThis!=="undefined"?globalThis:global||self,factory(global.jinja={}))})(this,function(jinja){"use strict";var STRINGS=/'(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"/g;var IDENTS_AND_NUMS=/([$_a-z][$\\w]*)|([+-]?\\d+(\\.\\d+)?)/g;var NUMBER=/^[+-]?\\d+(\\.\\d+)?$/;var NON_PRIMITIVES=/\\[[@#~](,[@#~])*\\]|\\[\\]|\\{([@i]:[@#~])(,[@i]:[@#~])*\\}|\\{\\}/g;var IDENTIFIERS=/[$_a-z][$\\w]*/gi;var VARIABLES=/i(\\.i|\\[[@#i]\\])*/g;var ACCESSOR=/(\\.i|\\[[@#i]\\])/g;var OPERATORS=/(===?|!==?|>=?|<=?|&&|\\|\\||[+\\-\\*\\/%])/g;var EOPS=/(^|[^$\\w])(and|or|not|is|isnot)([^$\\w]|$)/g;var LEADING_SPACE=/^\\s+/;var TRAILING_SPACE=/\\s+$/;var START_TOKEN=/\\{\\{\\{|\\{\\{|\\{%|\\{#/;var TAGS={"{{{":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?\\}\\}\\}/,"{{":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?\\}\\}/,"{%":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?%\\}/,"{#":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?#\\}/};var delimeters={"{%":"directive","{{":"output","{#":"comment"};var operators={and:"&&",or:"||",not:"!",is:"==",isnot:"!="};var constants={true:true,false:false,null:null};function Parser(){this.nest=[];this.compiled=[];this.childBlocks=0;this.parentBlocks=0;this.isSilent=false}Parser.prototype.push=function(line){if(!this.isSilent){this.compiled.push(line)}};Parser.prototype.parse=function(src){this.tokenize(src);return this.compiled};Parser.prototype.tokenize=function(src){var lastEnd=0,parser=this,trimLeading=false;matchAll(src,START_TOKEN,function(open,index,src){var match=src.slice(index+open.length).match(TAGS[open]);match=match?match[0]:"";var simplified=match.replace(STRINGS,"@");if(!match||~simplified.indexOf(open)){return index+1}var inner=match.slice(0,0-open.length);if(inner.charAt(0)==="-")var wsCollapseLeft=true;if(inner.slice(-1)==="-")var wsCollapseRight=true;inner=inner.replace(/^-|-$/g,"").trim();if(parser.rawMode&&open+inner!=="{%endraw"){return index+1}var text=src.slice(lastEnd,index);lastEnd=index+open.length+match.length;if(trimLeading)text=trimLeft(text);if(wsCollapseLeft)text=trimRight(text);if(wsCollapseRight)trimLeading=true;if(open==="{{{"){open="{{";inner+="|safe"}parser.textHandler(text);parser.tokenHandler(open,inner)});var text=src.slice(lastEnd);if(trimLeading)text=trimLeft(text);this.textHandler(text)};Parser.prototype.textHandler=function(text){this.push("write("+JSON.stringify(text)+");")};Parser.prototype.tokenHandler=function(open,inner){var type=delimeters[open];if(type==="directive"){this.compileTag(inner)}else if(type==="output"){var extracted=this.extractEnt(inner,STRINGS,"@");extracted.src=extracted.src.replace(/\\|\\|/g,"~").split("|");extracted.src=extracted.src.map(function(part){return part.split("~").join("||")});var parts=this.injectEnt(extracted,"@");if(parts.length>1){var filters=parts.slice(1).map(this.parseFilter.bind(this));this.push("filter("+this.parseExpr(parts[0])+","+filters.join(",")+");")}else{this.push("filter("+this.parseExpr(parts[0])+");")}}};Parser.prototype.compileTag=function(str){var directive=str.split(" ")[0];var handler=tagHandlers[directive];if(!handler){throw new Error("Invalid tag: "+str)}handler.call(this,str.slice(directive.length).trim())};Parser.prototype.parseFilter=function(src){src=src.trim();var match=src.match(/[:(]/);var i=match?match.index:-1;if(i<0)return JSON.stringify([src]);var name=src.slice(0,i);var args=src.charAt(i)===":"?src.slice(i+1):src.slice(i+1,-1);args=this.parseExpr(args,{terms:true});return"["+JSON.stringify(name)+","+args+"]"};Parser.prototype.extractEnt=function(src,regex,placeholder){var subs=[],isFunc=typeof placeholder=="function";src=src.replace(regex,function(str){var replacement=isFunc?placeholder(str):placeholder;if(replacement){subs.push(str);return replacement}return str});return{src:src,subs:subs}};Parser.prototype.injectEnt=function(extracted,placeholder){var src=extracted.src,subs=extracted.subs,isArr=Array.isArray(src);var arr=isArr?src:[src];var re=new RegExp("["+placeholder+"]","g"),i=0;arr.forEach(function(src,index){arr[index]=src.replace(re,function(){return subs[i++]})});return isArr?arr:arr[0]};Parser.prototype.replaceComplex=function(s){var parsed=this.extractEnt(s,/i(\\.i|\\[[@#i]\\])+/g,"v");parsed.src=parsed.src.replace(NON_PRIMITIVES,"~");return this.injectEnt(parsed,"v")};Parser.prototype.parseExpr=function(src,opts){opts=opts||{};var parsed1=this.extractEnt(src,STRINGS,"@");parsed1.src=parsed1.src.replace(EOPS,function(s,before,op,after){return op in operators?before+operators[op]+after:s});var parsed2=this.extractEnt(parsed1.src,IDENTS_AND_NUMS,function(s){return s in constants||NUMBER.test(s)?"#":null});var parsed3=this.extractEnt(parsed2.src,IDENTIFIERS,"i");parsed3.src=parsed3.src.replace(/\\s+/g,"");var simplified=parsed3.src;while(simplified!==(simplified=this.replaceComplex(simplified)));while(simplified!==(simplified=simplified.replace(/i(\\.i|\\[[@#i]\\])+/,"v")));simplified=simplified.replace(/[iv]\\[v?\\]/g,"x");simplified=simplified.replace(/[@#~v]/g,"i");simplified=simplified.replace(OPERATORS,"%");simplified=simplified.replace(/!+[i]/g,"i");var terms=opts.terms?simplified.split(","):[simplified];terms.forEach(function(term){while(term!==(term=term.replace(/\\(i(%i)*\\)/g,"i")));if(!term.match(/^i(%i)*/)){throw new Error("Invalid expression: "+src+" "+term)}});parsed3.src=parsed3.src.replace(VARIABLES,this.parseVar.bind(this));parsed2.src=this.injectEnt(parsed3,"i");parsed1.src=this.injectEnt(parsed2,"#");return this.injectEnt(parsed1,"@")};Parser.prototype.parseVar=function(src){var args=Array.prototype.slice.call(arguments);var str=args.pop(),index=args.pop();if(src==="i"&&str.charAt(index+1)===":"){return'"i"'}var parts=['"i"'];src.replace(ACCESSOR,function(part){if(part===".i"){parts.push('"i"')}else if(part==="[i]"){parts.push('get("i")')}else{parts.push(part.slice(1,-1))}});return"get("+parts.join(",")+")"};Parser.prototype.escName=function(str){return str.replace(/\\W/g,function(s){return"$"+s.charCodeAt(0).toString(16)})};Parser.prototype.parseQuoted=function(str){if(str.charAt(0)==="'"){str=str.slice(1,-1).replace(/\\\\.|"/,function(s){if(s==="\\\\'")return"'";return s.charAt(0)==="\\\\"?s:"\\\\"+s});str='"'+str+'"'}return JSON.parse(str)};var tagHandlers={if:function(expr){this.push("if ("+this.parseExpr(expr)+") {");this.nest.unshift("if")},else:function(){if(this.nest[0]==="for"){this.push("}, function() {")}else{this.push("} else {")}},elseif:function(expr){this.push("} else if ("+this.parseExpr(expr)+") {")},endif:function(){this.nest.shift();this.push("}")},for:function(str){var i=str.indexOf(" in ");var name=str.slice(0,i).trim();var expr=str.slice(i+4).trim();this.push("each("+this.parseExpr(expr)+","+JSON.stringify(name)+",function() {");this.nest.unshift("for")},endfor:function(){this.nest.shift();this.push("});")},raw:function(){this.rawMode=true},endraw:function(){this.rawMode=false},set:function(stmt){var i=stmt.indexOf("=");var name=stmt.slice(0,i).trim();var expr=stmt.slice(i+1).trim();this.push("set("+JSON.stringify(name)+","+this.parseExpr(expr)+");")},block:function(name){if(this.isParent){++this.parentBlocks;var blockName="block_"+(this.escName(name)||this.parentBlocks);this.push("block(typeof "+blockName+' == "function" ? '+blockName+" : function() {")}else if(this.hasParent){this.isSilent=false;++this.childBlocks;blockName="block_"+(this.escName(name)||this.childBlocks);this.push("function "+blockName+"() {")}this.nest.unshift("block")},endblock:function(){this.nest.shift();if(this.isParent){this.push("});")}else if(this.hasParent){this.push("}");this.isSilent=true}},extends:function(name){name=this.parseQuoted(name);var parentSrc=this.readTemplateFile(name);this.isParent=true;this.tokenize(parentSrc);this.isParent=false;this.hasParent=true;this.isSilent=true},include:function(name){name=this.parseQuoted(name);var incSrc=this.readTemplateFile(name);this.isInclude=true;this.tokenize(incSrc);this.isInclude=false}};tagHandlers.assign=tagHandlers.set;tagHandlers.elif=tagHandlers.elseif;var getRuntime=function runtime(data,opts){var defaults={autoEscape:"toJson"};var _toString=Object.prototype.toString;var _hasOwnProperty=Object.prototype.hasOwnProperty;var getKeys=Object.keys||function(obj){var keys=[];for(var n in obj)if(_hasOwnProperty.call(obj,n))keys.push(n);return keys};var isArray=Array.isArray||function(obj){return _toString.call(obj)==="[object Array]"};var create=Object.create||function(obj){function F(){}F.prototype=obj;return new F};var toString=function(val){if(val==null)return"";return typeof val.toString=="function"?val.toString():_toString.call(val)};var extend=function(dest,src){var keys=getKeys(src);for(var i=0,len=keys.length;i<len;i++){var key=keys[i];dest[key]=src[key]}return dest};var get=function(){var val,n=arguments[0],c=stack.length;while(c--){val=stack[c][n];if(typeof val!="undefined")break}for(var i=1,len=arguments.length;i<len;i++){if(val==null)continue;n=arguments[i];val=_hasOwnProperty.call(val,n)?val[n]:typeof val._get=="function"?val[n]=val._get(n):null}return val==null?"":val};var set=function(n,val){stack[stack.length-1][n]=val};var push=function(ctx){stack.push(ctx||{})};var pop=function(){stack.pop()};var write=function(str){output.push(str)};var filter=function(val){for(var i=1,len=arguments.length;i<len;i++){var arr=arguments[i],name=arr[0],filter=filters[name];if(filter){arr[0]=val;val=filter.apply(data,arr)}else{throw new Error("Invalid filter: "+name)}}if(opts.autoEscape&&name!==opts.autoEscape&&name!=="safe"){val=filters[opts.autoEscape].call(data,val)}output.push(val)};var each=function(obj,loopvar,fn1,fn2){if(obj==null)return;var arr=isArray(obj)?obj:getKeys(obj),len=arr.length;var ctx={loop:{length:len,first:arr[0],last:arr[len-1]}};push(ctx);for(var i=0;i<len;i++){extend(ctx.loop,{index:i+1,index0:i});fn1(ctx[loopvar]=arr[i])}if(len===0&&fn2)fn2();pop()};var block=function(fn){push();fn();pop()};var render=function(){return output.join("")};data=data||{};opts=extend(defaults,opts||{});var filters=extend({html:function(val){return toString(val).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;")},safe:function(val){return val},toJson:function(val){if(typeof val==="object"){return JSON.stringify(val)}return toString(val)}},opts.filters||{});var stack=[create(data||{})],output=[];return{get:get,set:set,push:push,pop:pop,write:write,filter:filter,each:each,block:block,render:render}};var runtime;jinja.compile=function(markup,opts){opts=opts||{};var parser=new Parser;parser.readTemplateFile=this.readTemplateFile;var code=[];code.push("function render($) {");code.push("var get = $.get, set = $.set, push = $.push, pop = $.pop, write = $.write, filter = $.filter, each = $.each, block = $.block;");code.push.apply(code,parser.parse(markup));code.push("return $.render();");code.push("}");code=code.join("\\n");if(opts.runtime===false){var fn=new Function("data","options","return ("+code+")(runtime(data, options))")}else{runtime=runtime||(runtime=getRuntime.toString());fn=new Function("data","options","return ("+code+")(("+runtime+")(data, options))")}return{render:fn}};jinja.render=function(markup,data,opts){var tmpl=jinja.compile(markup);return tmpl.render(data,opts)};jinja.templateFiles=[];jinja.readTemplateFile=function(name){var templateFiles=this.templateFiles||[];var templateFile=templateFiles[name];if(templateFile==null){throw new Error("Template file not found: "+name)}return templateFile};function trimLeft(str){return str.replace(LEADING_SPACE,"")}function trimRight(str){return str.replace(TRAILING_SPACE,"")}function matchAll(str,reg,fn){reg=new RegExp(reg.source,"g"+(reg.ignoreCase?"i":"")+(reg.multiline?"m":""));var match;while(match=reg.exec(str)){var result=fn(match[0],match.index,str);if(typeof result=="number"){reg.lastIndex=result}}}});`;
var sn = globalThis;
var ht = sn.CryptoJS;
var pt = sn.JSEncrypt;
var ft = sn.NODERSA;
var dt = sn.JSON5;
var Kn = sn.JSONPath;
var un = r((Y) => {
  let M = sn[Y];
  if (!M) throw new Error(`[drpy-core-qjs] \u7F3A\u5C11 so \u5168\u5C40 ${Y}\uFF08\u9700 libquickjs_bridge.so \u5BBF\u4E3B\uFF09`);
  return M;
}, "soRequire");
var an = un("Buffer");
var gt = un("WebAssembly");
var Hn = un("TextEncoder");
var qn = un("TextDecoder");
var _n = un("zlib");
(0, eval)(Dn);
var Jn = un("jinja");
var yt = { gzip: r((Y) => new Uint8Array(_n.gzip(typeof Y == "string" ? an.from(Y, "utf8") : an.from(Y))), "gzip"), inflate: r((Y, M) => {
  let $ = _n.unzip(an.from(Y));
  return M && M.to === "string" ? an.from($).toString("utf8") : new Uint8Array($);
}, "inflate"), gunzip: r((Y, M) => {
  let $ = _n.gunzip(an.from(Y));
  return M && M.to === "string" ? an.from($).toString("utf8") : new Uint8Array($);
}, "gunzip") };
var zn = new Hn("gbk");
var Sn = new qn("gbk", { fatal: true });
var Vn = r((Y) => Y === 8364 || Y <= 127 && Y >= 0, "_isAscii");
var _t = { encode(Y) {
  let M = String(Y), $ = "";
  for (let C of M) {
    let j = C.codePointAt(0);
    if (Vn(j)) {
      $ += encodeURIComponent(C);
      continue;
    }
    let b = j <= 65535;
    if (b) {
      let f = zn.encode(C);
      try {
        Sn.decode(f) !== C && (b = false);
      } catch {
        b = false;
      }
      if (b) {
        for (let u = 0; u < f.length; u++) $ += "%" + f[u].toString(16).toUpperCase();
        continue;
      }
    }
    $ += C;
  }
  return $;
}, decode(Y) {
  return String(Y).replace(/%[0-9A-F]{2}%[0-9A-F]{2}/g, (M) => {
    try {
      let $ = new Uint8Array([parseInt(M.slice(1, 3), 16), parseInt(M.slice(4, 6), 16)]);
      return Sn.decode($);
    } catch {
      return M;
    }
  }).replace(/%[\w]{2}/g, (M) => decodeURIComponent(M));
} };
var mt = { jinja2(Y, M) {
  return Jn.render(Y, M);
}, jp(Y, M) {
  return Kn.JSONPath({ path: Y, json: M })[0];
} };

// dist/drpy3-peer.js
if (nativeWasm && globalThis.WebAssembly !== nativeWasm) globalThis.WebAssembly = nativeWasm;
if (nativeFetch && globalThis.fetch !== nativeFetch) globalThis.fetch = nativeFetch;
if (nativeTextEncoder && globalThis.TextEncoder !== nativeTextEncoder) globalThis.TextEncoder = nativeTextEncoder;
console.error = nativeConsoleError;

// dist/drpy3.js
var __defProp2 = Object.defineProperty;
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
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
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
var peer_exports = {};
var nativeWasm2 = globalThis.WebAssembly;
var nativeUint8ArrayFromBase642 = typeof Uint8Array.fromBase64 === "function" ? Uint8Array.fromBase64 : null;
if (!nativeUint8ArrayFromBase642) {
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
var nativeFetch2 = globalThis.fetch;
var nativeTextEncoder2 = globalThis.TextEncoder;
var nativeConsoleError2 = console.error;
console.error = function drpy3QuietConsoleError2(...args) {
  if (typeof args[0] === "string" && args[0].startsWith("[Script Loader]")) return;
  return nativeConsoleError2.apply(this, args);
};
__reExport(peer_exports, drpy3_peer_exports);
if (nativeWasm2 && globalThis.WebAssembly !== nativeWasm2) globalThis.WebAssembly = nativeWasm2;
if (nativeFetch2 && globalThis.fetch !== nativeFetch2) globalThis.fetch = nativeFetch2;
if (nativeTextEncoder2 && globalThis.TextEncoder !== nativeTextEncoder2) globalThis.TextEncoder = nativeTextEncoder2;
console.error = nativeConsoleError2;
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
function makeUtils(rt2) {
  return {
    UA,
    joinUrl: (base, path) => rt2.resolve("joinUrl")(base, path),
    getHome,
    urlencode,
    encodeUrl: (str) => encodeURI(str),
    buildUrl,
    buildQueryString,
    forceOrder,
    \u662F\u5426\u6B63\u7248,
    urlDeal,
    // proxy 类源取本地代理地址（HostEnv getProxy 的包装，§9 utils）；
    // 宿主未注入时返回空串（源自行判断），不编造 9978 端口
    getProxyUrl: async () => {
      const gp = rt2.resolve("getProxy");
      const url2 = typeof gp === "function" ? await gp(true) : "";
      return url2 || "";
    }
  };
}
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
function makeNet(rt2, ctx2) {
  const net = {
    /** 单次请求：返回 {content, headers}。buffer:1→Uint8Array / 2→base64 / 缺省→文本（§6.2） */
    async req(url2, options) {
      if (!url2) return { content: "", headers: {} };
      const fn = rt2.resolve("req");
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
      const hostFn = rt2.resolve("batchFetch");
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
          const r2 = jsonPdfh(it, sel, parse.jp);
          return r2 ? ctx2.lib.utils.joinUrl(MY_URL, r2) : "";
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
function makeParse(rt2) {
  const parse = {
    pdfh: (html, parseRule2, baseUrl = "") => rt2.resolve("pdfh")(html, parseRule2, baseUrl),
    pdfa: (html, parseRule2) => rt2.resolve("pdfa")(html, parseRule2),
    pd: (html, parseRule2, baseUrl = "") => rt2.resolve("pd")(html, parseRule2, baseUrl),
    // pdfl 必注入（批量整表解析，drpy2.1 加速语义）；此处保留逐元素回退仅为
    // 兼容未注入的宿主（正确性一致，性能退化）——capabilities.pdfl 会诚实标 missing
    pdfl: (html, parseRule2, listText, listUrl, myUrl) => {
      const host = rt2.resolve("pdfl");
      if (typeof host === "function") {
        return host(html, parseRule2, listText, listUrl, myUrl);
      }
      const items = rt2.resolve("pdfa")(html, parseRule2) || [];
      return items.map((it) => `${rt2.resolve("pdfh")(it, listText)}$${rt2.resolve("pd")(it, listUrl, myUrl)}`);
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
      const r2 = fn.call(dec, data);
      return r2 || "";
    }
    return peer_exports.NODERSA.decode({ data, key, option });
  }
  if (typeof peer_exports.JSEncrypt === "function") {
    const enc = new peer_exports.JSEncrypt();
    enc.setPublicKey(key);
    const fn = enc[option.long ? "encryptUnicodeLong" : "encrypt"];
    const r2 = fn.call(enc, data);
    return r2 || "";
  }
  return peer_exports.NODERSA.encode({ data, key, option });
}
function makeCrypto(rt2) {
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
        // 库形态胶水跳过 main：worker/消息循环构建的 main 会同步阻塞
        // 引擎任务队列（央视频 CNTV wasm 实锤——initRuntime 完成后
        // callMain 永不返回，30s 就绪超时定时器随之饿死）
        noInitialRun: true,
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
        resolve([inst]);
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
    const _m = await withTimeout(ready, 3e4, `emscripten \u8FD0\u884C\u65F6\u5C31\u7EEA\u8D85\u65F6(30s) @${key}`);
    const mod = Array.isArray(_m) ? _m[0] : _m;
    try {
      delete mod.then;
    } catch (_) {
    }
    return mod;
  }
  if (exported && typeof exported === "object") return exported;
  throw new Drpy3Error("wasm", "load", `\u65E0\u6CD5\u8BC6\u522B\u7684 wasm \u8D44\u4EA7\u5F62\u6001: ${typeof exported} @${key}`);
}
function makeWasm(rt2) {
  const cache = rt2.__wasmCache || (rt2.__wasmCache = /* @__PURE__ */ new Map());
  async function loadCached(key, produce) {
    if (cache.has(key)) return cache.get(key);
    const mod = await produce();
    cache.set(key, mod);
    return mod;
  }
  async function load2(source) {
    try {
      if (source instanceof Uint8Array) {
        return await loadCached("bytes:" + bytesHash(source), () => compileWasmBytes(source));
      }
      if (typeof source !== "string" || !source) {
        throw new Drpy3Error("wasm", "load", "wasm.load \u53C2\u6570\u9700\u4E3A\u8DEF\u5F84\u5B57\u7B26\u4E32\u6216 Uint8Array");
      }
      if (/^https?:\/\//.test(source)) {
        const req = rt2.resolve("req");
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
      const loader = rt2.resolve("loadAsset");
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
  return { load: load2 };
}
var NET_ALIASES = ["req", "request", "post", "reqCookie", "batchFetch", "all", "download"];
var PARSE_ALIASES = ["pdfh", "pdfa", "pd", "pdfl", "jp", "jinja2", "parseRule"];
var CRYPTO_ALIASES = ["md5", "base64Encode", "base64Decode", "gzip", "ungzip", "aesX", "desX", "rc4", "rsaX"];
var UTILS_ALIASES = ["joinUrl", "getHome", "urlencode", "buildUrl", "buildQueryString", "forceOrder", "\u662F\u5426\u6B63\u7248", "urlDeal", "getProxyUrl"];
function runtimeNs(rt2, name, factory) {
  if (!rt2.__libCache) rt2.__libCache = {};
  if (!rt2.__libCache[name]) rt2.__libCache[name] = factory(rt2);
  return rt2.__libCache[name];
}
function pick(ns, names) {
  const out = {};
  for (const n of names) if (ns[n] !== void 0) out[n] = ns[n];
  return out;
}
function buildCtx(instance, call = {}) {
  const rt2 = instance.rt;
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
    log: (...args) => rt2.resolve("log")(...args),
    store: instance.store,
    cache: instance.cache,
    capabilities: rt2.capabilities,
    __sync: !!instance.is2x,
    // load2x 片段作用域开关：request 走同步桥（drpy2 同步语义）
    __rt: rt2
    // 片段同步桥需要 rt 解析 syncReq
  };
  ctx2.lib = {
    net: makeNet(rt2, ctx2),
    // net 绑定调用态（headers 合并需要 ctx）
    parse: runtimeNs(rt2, "parse", makeParse),
    crypto: runtimeNs(rt2, "crypto", makeCrypto),
    text: runtimeNs(rt2, "text", makeText),
    utils: runtimeNs(rt2, "utils", makeUtils),
    wasm: runtimeNs(rt2, "wasm", makeWasm),
    store: instance.store,
    cache: instance.cache
  };
  Object.assign(ctx2, pick(ctx2.lib.net, NET_ALIASES));
  Object.assign(ctx2, pick(ctx2.lib.parse, PARSE_ALIASES));
  Object.assign(ctx2, pick(ctx2.lib.crypto, CRYPTO_ALIASES));
  Object.assign(ctx2, pick(ctx2.lib.utils, UTILS_ALIASES));
  return ctx2;
}
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
  initFields(rt2, def, opts = {}) {
    this.rt = rt2;
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
    this.store = makeStore(rt2.resolve("store"), this.key);
    this.hot = false;
    this.lastUsed = 0;
    this.inFlight = 0;
    this.signature = opts.signature || "";
    this.headersSnapshot = null;
    this.stateVersion = this.meta.stateVersion || "";
    this.pinned = (rt2.pinList || []).includes(this.key);
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
          const r2 = await fn.call(this, ctx2, ...args);
          return r2 === void 0 ? {} : r2;
        }
        const defaults2 = this.rt.defaults;
        if (defaults2 && typeof defaults2[stage] === "function") {
          const r2 = await defaults2[stage].call(this, ctx2, ...args);
          return r2 === void 0 ? {} : r2;
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
function createSource(rt2, def, opts = {}) {
  const proto = Object.assign(Object.create(sourceProto), def);
  const inst = Object.create(proto);
  sourceProto.initFields.call(inst, rt2, def, opts);
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
  constructor(rt2, opts = {}) {
    this.rt = rt2;
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
      const log2 = this.rt.resolve("log");
      if (typeof log2 === "function") log2(...args);
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
function createSource2x(rt2, code, opts = {}) {
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
  const src = createSource(rt2, { meta, rule: rule2 }, { ...opts, key: opts.key || "drpy_" + (rule2.title || rule2.host) });
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
async function evalSourceCjs(code, opts, rt2) {
  const loadAsset = rt2.resolve("loadAsset");
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
function makeSyncNet(rt2, ctx2) {
  return (u, o, method) => {
    const syncReq = rt2.resolve("syncReq");
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
var REQUIRED = ["req", "pdfh", "pdfa", "pd", "pdfl"];
var BUILTINS = {
  joinUrl: () => builtinJoinUrl,
  store: () => memoryStore(),
  log: () => (...args) => console.log(...args),
  // 代理地址唯一事实源是宿主注入（HostEnv.getProxy）；兜底一律空串，
  // 不编造端口（9978 是 drpy-node 服务端约定，嵌壳宿主无此服务）
  getProxy: () => () => "",
  // batchFetch 兜底依赖 net 上下文，在 lib/net.js 中组装（W4）；
  // resolve('batchFetch') 由 net 层拦截。pdfl 已升必注入（REQUIRED）。
  batchFetch: null,
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
var _overrides;
var _sourceCaps;
var _memStore;
var _Runtime_instances;
var raw_fn;
var capOf_fn;
var builtin_fn;
var wasmMode_fn;
var Runtime = class {
  // memory-fallback store 单例（多源共享介质，按源 key 隔离命名空间）
  constructor(hostEnv = {}) {
    __privateAdd(this, _Runtime_instances);
    __privateAdd(this, _overrides, {});
    __privateAdd(this, _sourceCaps, {});
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
      const log2 = typeof __privateMethod(this, _Runtime_instances, raw_fn).call(this, "log") === "function" ? __privateMethod(this, _Runtime_instances, raw_fn).call(this, "log") : console.log;
      if (missing.length) {
        log2(`[drpy3] HostEnv \u7F3A\u5C11\u5FC5\u6CE8\u5165\u9879: ${missing.join(", ")} \u2014\u2014 \u8FD0\u884C\u671F\u8C03\u7528\u5C06\u62A5\u9519\u3002\u8BF7\u6CE8\u5165: ${missing.map((m) => `${m}()`).join(" / ")}`);
      }
      if (Object.keys(fallbacks).length) {
        log2(`[drpy3] HostEnv \u8D70\u5185\u7F6E\u515C\u5E95: ${Object.keys(fallbacks).join(", ")}`);
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
_overrides = /* @__PURE__ */ new WeakMap();
_sourceCaps = /* @__PURE__ */ new WeakMap();
_memStore = /* @__PURE__ */ new WeakMap();
_Runtime_instances = /* @__PURE__ */ new WeakSet();
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
var VERSION = "drpy3 0.1.0";
function defineSource(source) {
  return source;
}
var index_default = { Runtime, defineSource, VERSION };

// hosts/fjs/tools/qjs-cheerio-shim.mjs
var so = globalThis.cheerio;
if (!so || typeof so.load !== "function") {
  throw new Error("[drpy3-qjs] \u7F3A\u5C11 so \u5168\u5C40 cheerio\uFF08\u9700 libquickjs_bridge.so \u5BBF\u4E3B\uFF09");
}
var load = so.load.bind(so);

// cli/jsonpathplus.min.js
!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).JSONPath = {});
})(void 0, function(e) {
  "use strict";
  function n(e2, t2, r3) {
    return t2 = l(t2), (function(e3, t3) {
      {
        if (t3 && ("object" == typeof t3 || "function" == typeof t3)) return t3;
        if (void 0 !== t3) throw new TypeError("Derived constructors may only return object or undefined");
      }
      return (function(e4) {
        if (void 0 !== e4) return e4;
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      })(e3);
    })(e2, i() ? Reflect.construct(t2, r3 || [], l(e2).constructor) : t2.apply(e2, r3));
  }
  function o(e2, t2, r3) {
    if (i()) return Reflect.construct.apply(null, arguments);
    var n2 = [null];
    n2.push.apply(n2, t2);
    n2 = new (e2.bind.apply(e2, n2))();
    return r3 && h(n2, r3.prototype), n2;
  }
  function i() {
    try {
      var e2 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (e3) {
    }
    return (i = function() {
      return !!e2;
    })();
  }
  function t(t2, e2) {
    var r3, n2 = Object.keys(t2);
    return Object.getOwnPropertySymbols && (r3 = Object.getOwnPropertySymbols(t2), e2 && (r3 = r3.filter(function(e3) {
      return Object.getOwnPropertyDescriptor(t2, e3).enumerable;
    })), n2.push.apply(n2, r3)), n2;
  }
  function r2(n2) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var i2 = null != arguments[e2] ? arguments[e2] : {};
      e2 % 2 ? t(Object(i2), true).forEach(function(e3) {
        var t2, r3;
        t2 = n2, e3 = i2[r3 = e3], (r3 = a(r3)) in t2 ? Object.defineProperty(t2, r3, { value: e3, enumerable: true, configurable: true, writable: true }) : t2[r3] = e3;
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n2, Object.getOwnPropertyDescriptors(i2)) : t(Object(i2)).forEach(function(e3) {
        Object.defineProperty(n2, e3, Object.getOwnPropertyDescriptor(i2, e3));
      });
    }
    return n2;
  }
  function a(e2) {
    e2 = (function(e3, t2) {
      if ("object" != typeof e3 || !e3) return e3;
      var r3 = e3[Symbol.toPrimitive];
      if (void 0 === r3) return ("string" === t2 ? String : Number)(e3);
      if ("object" != typeof (t2 = r3.call(e3, t2 || "default"))) return t2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    })(e2, "string");
    return "symbol" == typeof e2 ? e2 : e2 + "";
  }
  function C(e2) {
    return (C = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
      return typeof e3;
    } : function(e3) {
      return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
    })(e2);
  }
  function s(e2, t2) {
    if (!(e2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
  }
  function u(e2, t2) {
    for (var r3 = 0; r3 < t2.length; r3++) {
      var n2 = t2[r3];
      n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, a(n2.key), n2);
    }
  }
  function c(e2, t2, r3) {
    return t2 && u(e2.prototype, t2), r3 && u(e2, r3), Object.defineProperty(e2, "prototype", { writable: false }), e2;
  }
  function l(e2) {
    return (l = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e3) {
      return e3.__proto__ || Object.getPrototypeOf(e3);
    })(e2);
  }
  function h(e2, t2) {
    return (h = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e3, t3) {
      return e3.__proto__ = t3, e3;
    })(e2, t2);
  }
  function p2(e2) {
    var r3 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
    return (p2 = function(e3) {
      if (null === e3 || !(function(t3) {
        try {
          return -1 !== Function.toString.call(t3).indexOf("[native code]");
        } catch (e4) {
          return "function" == typeof t3;
        }
      })(e3)) return e3;
      if ("function" != typeof e3) throw new TypeError("Super expression must either be null or a function");
      if (void 0 !== r3) {
        if (r3.has(e3)) return r3.get(e3);
        r3.set(e3, t2);
      }
      function t2() {
        return o(e3, arguments, l(this).constructor);
      }
      return t2.prototype = Object.create(e3.prototype, { constructor: { value: t2, enumerable: false, writable: true, configurable: true } }), h(t2, e3);
    })(e2);
  }
  function f(e2) {
    return (function(e3) {
      if (Array.isArray(e3)) return d2(e3);
    })(e2) || (function(e3) {
      if ("undefined" != typeof Symbol && null != e3[Symbol.iterator] || null != e3["@@iterator"]) return Array.from(e3);
    })(e2) || O(e2) || (function() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
  }
  function O(e2, t2) {
    if (e2) {
      if ("string" == typeof e2) return d2(e2, t2);
      var r3 = Object.prototype.toString.call(e2).slice(8, -1);
      return "Object" === r3 && e2.constructor && (r3 = e2.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e2) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? d2(e2, t2) : void 0;
    }
  }
  function d2(e2, t2) {
    (null == t2 || t2 > e2.length) && (t2 = e2.length);
    for (var r3 = 0, n2 = new Array(t2); r3 < t2; r3++) n2[r3] = e2[r3];
    return n2;
  }
  var y = (function() {
    return c(function e2() {
      s(this, e2);
    }, [{ key: "add", value: function(e2, t2, r3) {
      if ("string" != typeof e2) for (var n2 in e2) this.add(n2, e2[n2], t2);
      else (Array.isArray(e2) ? e2 : [e2]).forEach(function(e3) {
        this[e3] = this[e3] || [], t2 && this[e3][r3 ? "unshift" : "push"](t2);
      }, this);
    } }, { key: "run", value: function(e2, t2) {
      this[e2] = this[e2] || [], this[e2].forEach(function(e3) {
        e3.call(t2 && t2.context ? t2.context : t2, t2);
      });
    } }]);
  })(), b = (function() {
    return c(function e2(t2) {
      s(this, e2), this.jsep = t2, this.registered = {};
    }, [{ key: "register", value: function() {
      for (var t2 = this, e2 = arguments.length, r3 = new Array(e2), n2 = 0; n2 < e2; n2++) r3[n2] = arguments[n2];
      r3.forEach(function(e3) {
        if ("object" !== C(e3) || !e3.name || !e3.init) throw new Error("Invalid JSEP plugin format");
        t2.registered[e3.name] || (e3.init(t2.jsep), t2.registered[e3.name] = e3);
      });
    } }]);
  })(), v = (function() {
    function l2(e2) {
      s(this, l2), this.expr = e2, this.index = 0;
    }
    return c(l2, [{ key: "char", get: function() {
      return this.expr.charAt(this.index);
    } }, { key: "code", get: function() {
      return this.expr.charCodeAt(this.index);
    } }, { key: "throwError", value: function(e2) {
      var t2 = new Error(e2 + " at character " + this.index);
      throw t2.index = this.index, t2.description = e2, t2;
    } }, { key: "runHook", value: function(e2, t2) {
      if (l2.hooks[e2]) {
        var r3 = { context: this, node: t2 };
        return l2.hooks.run(e2, r3), r3.node;
      }
      return t2;
    } }, { key: "searchHook", value: function(e2) {
      if (l2.hooks[e2]) {
        var t2 = { context: this };
        return l2.hooks[e2].find(function(e3) {
          return e3.call(t2.context, t2), t2.node;
        }), t2.node;
      }
    } }, { key: "gobbleSpaces", value: function() {
      for (var e2 = this.code; e2 === l2.SPACE_CODE || e2 === l2.TAB_CODE || e2 === l2.LF_CODE || e2 === l2.CR_CODE; ) e2 = this.expr.charCodeAt(++this.index);
      this.runHook("gobble-spaces");
    } }, { key: "parse", value: function() {
      this.runHook("before-all");
      var e2 = this.gobbleExpressions(), e2 = 1 === e2.length ? e2[0] : { type: l2.COMPOUND, body: e2 };
      return this.runHook("after-all", e2);
    } }, { key: "gobbleExpressions", value: function(e2) {
      for (var t2, r3, n2 = []; this.index < this.expr.length; ) if ((t2 = this.code) === l2.SEMCOL_CODE || t2 === l2.COMMA_CODE) this.index++;
      else if (r3 = this.gobbleExpression()) n2.push(r3);
      else if (this.index < this.expr.length) {
        if (t2 === e2) break;
        this.throwError('Unexpected "' + this.char + '"');
      }
      return n2;
    } }, { key: "gobbleExpression", value: function() {
      var e2 = this.searchHook("gobble-expression") || this.gobbleBinaryExpression();
      return this.gobbleSpaces(), this.runHook("after-expression", e2);
    } }, { key: "gobbleBinaryOp", value: function() {
      this.gobbleSpaces();
      for (var e2 = this.expr.substr(this.index, l2.max_binop_len), t2 = e2.length; 0 < t2; ) {
        if (l2.binary_ops.hasOwnProperty(e2) && (!l2.isIdentifierStart(this.code) || this.index + e2.length < this.expr.length && !l2.isIdentifierPart(this.expr.charCodeAt(this.index + e2.length)))) return this.index += t2, e2;
        e2 = e2.substr(0, --t2);
      }
      return false;
    } }, { key: "gobbleBinaryExpression", value: function() {
      var e2, t2, r3, n2, i2, o2, a2, s2, u2, c2 = this.gobbleToken();
      if (!c2) return c2;
      if (!(t2 = this.gobbleBinaryOp())) return c2;
      for (i2 = { value: t2, prec: l2.binaryPrecedence(t2), right_a: l2.right_associative.has(t2) }, (o2 = this.gobbleToken()) || this.throwError("Expected expression after " + t2), n2 = [c2, i2, o2]; t2 = this.gobbleBinaryOp(); ) {
        if (0 === (r3 = l2.binaryPrecedence(t2))) {
          this.index -= t2.length;
          break;
        }
        i2 = { value: t2, prec: r3, right_a: l2.right_associative.has(t2) }, s2 = t2;
        for (; 2 < n2.length && (u2 = n2[n2.length - 2], i2.right_a && u2.right_a ? r3 > u2.prec : r3 <= u2.prec); ) o2 = n2.pop(), t2 = n2.pop().value, c2 = n2.pop(), e2 = { type: l2.BINARY_EXP, operator: t2, left: c2, right: o2 }, n2.push(e2);
        (e2 = this.gobbleToken()) || this.throwError("Expected expression after " + s2), n2.push(i2, e2);
      }
      for (e2 = n2[a2 = n2.length - 1]; 1 < a2; ) e2 = { type: l2.BINARY_EXP, operator: n2[a2 - 1].value, left: n2[a2 - 2], right: e2 }, a2 -= 2;
      return e2;
    } }, { key: "gobbleToken", value: function() {
      var e2, t2, r3, n2;
      if (this.gobbleSpaces(), n2 = this.searchHook("gobble-token")) return this.runHook("after-token", n2);
      if (e2 = this.code, l2.isDecimalDigit(e2) || e2 === l2.PERIOD_CODE) return this.gobbleNumericLiteral();
      if (e2 === l2.SQUOTE_CODE || e2 === l2.DQUOTE_CODE) n2 = this.gobbleStringLiteral();
      else if (e2 === l2.OBRACK_CODE) n2 = this.gobbleArray();
      else {
        for (r3 = (t2 = this.expr.substr(this.index, l2.max_unop_len)).length; 0 < r3; ) {
          if (l2.unary_ops.hasOwnProperty(t2) && (!l2.isIdentifierStart(this.code) || this.index + t2.length < this.expr.length && !l2.isIdentifierPart(this.expr.charCodeAt(this.index + t2.length)))) {
            this.index += r3;
            var i2 = this.gobbleToken();
            return i2 || this.throwError("missing unaryOp argument"), this.runHook("after-token", { type: l2.UNARY_EXP, operator: t2, argument: i2, prefix: true });
          }
          t2 = t2.substr(0, --r3);
        }
        l2.isIdentifierStart(e2) ? (n2 = this.gobbleIdentifier(), l2.literals.hasOwnProperty(n2.name) ? n2 = { type: l2.LITERAL, value: l2.literals[n2.name], raw: n2.name } : n2.name === l2.this_str && (n2 = { type: l2.THIS_EXP })) : e2 === l2.OPAREN_CODE && (n2 = this.gobbleGroup());
      }
      return n2 ? (n2 = this.gobbleTokenProperty(n2), this.runHook("after-token", n2)) : this.runHook("after-token", false);
    } }, { key: "gobbleTokenProperty", value: function(e2) {
      this.gobbleSpaces();
      for (var t2 = this.code; t2 === l2.PERIOD_CODE || t2 === l2.OBRACK_CODE || t2 === l2.OPAREN_CODE || t2 === l2.QUMARK_CODE; ) {
        var r3 = void 0;
        if (t2 === l2.QUMARK_CODE) {
          if (this.expr.charCodeAt(this.index + 1) !== l2.PERIOD_CODE) break;
          r3 = true, this.index += 2, this.gobbleSpaces(), t2 = this.code;
        }
        this.index++, t2 === l2.OBRACK_CODE ? (e2 = { type: l2.MEMBER_EXP, computed: true, object: e2, property: this.gobbleExpression() }, this.gobbleSpaces(), (t2 = this.code) !== l2.CBRACK_CODE && this.throwError("Unclosed ["), this.index++) : t2 === l2.OPAREN_CODE ? e2 = { type: l2.CALL_EXP, arguments: this.gobbleArguments(l2.CPAREN_CODE), callee: e2 } : t2 !== l2.PERIOD_CODE && !r3 || (r3 && this.index--, this.gobbleSpaces(), e2 = { type: l2.MEMBER_EXP, computed: false, object: e2, property: this.gobbleIdentifier() }), r3 && (e2.optional = true), this.gobbleSpaces(), t2 = this.code;
      }
      return e2;
    } }, { key: "gobbleNumericLiteral", value: function() {
      for (var e2, t2 = ""; l2.isDecimalDigit(this.code); ) t2 += this.expr.charAt(this.index++);
      if (this.code === l2.PERIOD_CODE) for (t2 += this.expr.charAt(this.index++); l2.isDecimalDigit(this.code); ) t2 += this.expr.charAt(this.index++);
      if ("e" === (e2 = this.char) || "E" === e2) {
        for (t2 += this.expr.charAt(this.index++), "+" !== (e2 = this.char) && "-" !== e2 || (t2 += this.expr.charAt(this.index++)); l2.isDecimalDigit(this.code); ) t2 += this.expr.charAt(this.index++);
        l2.isDecimalDigit(this.expr.charCodeAt(this.index - 1)) || this.throwError("Expected exponent (" + t2 + this.char + ")");
      }
      return e2 = this.code, l2.isIdentifierStart(e2) ? this.throwError("Variable names cannot start with a number (" + t2 + this.char + ")") : (e2 === l2.PERIOD_CODE || 1 === t2.length && t2.charCodeAt(0) === l2.PERIOD_CODE) && this.throwError("Unexpected period"), { type: l2.LITERAL, value: parseFloat(t2), raw: t2 };
    } }, { key: "gobbleStringLiteral", value: function() {
      for (var e2 = "", t2 = this.index, r3 = this.expr.charAt(this.index++), n2 = false; this.index < this.expr.length; ) {
        var i2 = this.expr.charAt(this.index++);
        if (i2 === r3) {
          n2 = true;
          break;
        }
        if ("\\" === i2) switch (i2 = this.expr.charAt(this.index++)) {
          case "n":
            e2 += "\n";
            break;
          case "r":
            e2 += "\r";
            break;
          case "t":
            e2 += "	";
            break;
          case "b":
            e2 += "\b";
            break;
          case "f":
            e2 += "\f";
            break;
          case "v":
            e2 += "\v";
            break;
          default:
            e2 += i2;
        }
        else e2 += i2;
      }
      return n2 || this.throwError('Unclosed quote after "' + e2 + '"'), { type: l2.LITERAL, value: e2, raw: this.expr.substring(t2, this.index) };
    } }, { key: "gobbleIdentifier", value: function() {
      var e2 = this.code, t2 = this.index;
      for (l2.isIdentifierStart(e2) ? this.index++ : this.throwError("Unexpected " + this.char); this.index < this.expr.length && (e2 = this.code, l2.isIdentifierPart(e2)); ) this.index++;
      return { type: l2.IDENTIFIER, name: this.expr.slice(t2, this.index) };
    } }, { key: "gobbleArguments", value: function(e2) {
      for (var t2 = [], r3 = false, n2 = 0; this.index < this.expr.length; ) {
        this.gobbleSpaces();
        var i2 = this.code;
        if (i2 === e2) {
          r3 = true, this.index++, e2 === l2.CPAREN_CODE && n2 && n2 >= t2.length && this.throwError("Unexpected token " + String.fromCharCode(e2));
          break;
        }
        if (i2 === l2.COMMA_CODE) {
          if (this.index++, ++n2 !== t2.length) {
            if (e2 === l2.CPAREN_CODE) this.throwError("Unexpected token ,");
            else if (e2 === l2.CBRACK_CODE) for (var o2 = t2.length; o2 < n2; o2++) t2.push(null);
          }
        } else t2.length !== n2 && 0 !== n2 ? this.throwError("Expected comma") : ((i2 = this.gobbleExpression()) && i2.type !== l2.COMPOUND || this.throwError("Expected comma"), t2.push(i2));
      }
      return r3 || this.throwError("Expected " + String.fromCharCode(e2)), t2;
    } }, { key: "gobbleGroup", value: function() {
      this.index++;
      var e2 = this.gobbleExpressions(l2.CPAREN_CODE);
      if (this.code === l2.CPAREN_CODE) return this.index++, 1 === e2.length ? e2[0] : !!e2.length && { type: l2.SEQUENCE_EXP, expressions: e2 };
      this.throwError("Unclosed (");
    } }, { key: "gobbleArray", value: function() {
      return this.index++, { type: l2.ARRAY_EXP, elements: this.gobbleArguments(l2.CBRACK_CODE) };
    } }], [{ key: "version", get: function() {
      return "1.3.8";
    } }, { key: "toString", value: function() {
      return "JavaScript Expression Parser (JSEP) v" + l2.version;
    } }, { key: "addUnaryOp", value: function(e2) {
      return l2.max_unop_len = Math.max(e2.length, l2.max_unop_len), l2.unary_ops[e2] = 1, l2;
    } }, { key: "addBinaryOp", value: function(e2, t2, r3) {
      return l2.max_binop_len = Math.max(e2.length, l2.max_binop_len), l2.binary_ops[e2] = t2, r3 ? l2.right_associative.add(e2) : l2.right_associative.delete(e2), l2;
    } }, { key: "addIdentifierChar", value: function(e2) {
      return l2.additional_identifier_chars.add(e2), l2;
    } }, { key: "addLiteral", value: function(e2, t2) {
      return l2.literals[e2] = t2, l2;
    } }, { key: "removeUnaryOp", value: function(e2) {
      return delete l2.unary_ops[e2], e2.length === l2.max_unop_len && (l2.max_unop_len = l2.getMaxKeyLen(l2.unary_ops)), l2;
    } }, { key: "removeAllUnaryOps", value: function() {
      return l2.unary_ops = {}, l2.max_unop_len = 0, l2;
    } }, { key: "removeIdentifierChar", value: function(e2) {
      return l2.additional_identifier_chars.delete(e2), l2;
    } }, { key: "removeBinaryOp", value: function(e2) {
      return delete l2.binary_ops[e2], e2.length === l2.max_binop_len && (l2.max_binop_len = l2.getMaxKeyLen(l2.binary_ops)), l2.right_associative.delete(e2), l2;
    } }, { key: "removeAllBinaryOps", value: function() {
      return l2.binary_ops = {}, l2.max_binop_len = 0, l2;
    } }, { key: "removeLiteral", value: function(e2) {
      return delete l2.literals[e2], l2;
    } }, { key: "removeAllLiterals", value: function() {
      return l2.literals = {}, l2;
    } }, { key: "parse", value: function(e2) {
      return new l2(e2).parse();
    } }, { key: "getMaxKeyLen", value: function(e2) {
      return Math.max.apply(Math, [0].concat(f(Object.keys(e2).map(function(e3) {
        return e3.length;
      }))));
    } }, { key: "isDecimalDigit", value: function(e2) {
      return 48 <= e2 && e2 <= 57;
    } }, { key: "binaryPrecedence", value: function(e2) {
      return l2.binary_ops[e2] || 0;
    } }, { key: "isIdentifierStart", value: function(e2) {
      return 65 <= e2 && e2 <= 90 || 97 <= e2 && e2 <= 122 || 128 <= e2 && !l2.binary_ops[String.fromCharCode(e2)] || l2.additional_identifier_chars.has(String.fromCharCode(e2));
    } }, { key: "isIdentifierPart", value: function(e2) {
      return l2.isIdentifierStart(e2) || l2.isDecimalDigit(e2);
    } }]);
  })(), y = new y();
  Object.assign(v, { hooks: y, plugins: new b(v), COMPOUND: "Compound", SEQUENCE_EXP: "SequenceExpression", IDENTIFIER: "Identifier", MEMBER_EXP: "MemberExpression", LITERAL: "Literal", THIS_EXP: "ThisExpression", CALL_EXP: "CallExpression", UNARY_EXP: "UnaryExpression", BINARY_EXP: "BinaryExpression", ARRAY_EXP: "ArrayExpression", TAB_CODE: 9, LF_CODE: 10, CR_CODE: 13, SPACE_CODE: 32, PERIOD_CODE: 46, COMMA_CODE: 44, SQUOTE_CODE: 39, DQUOTE_CODE: 34, OPAREN_CODE: 40, CPAREN_CODE: 41, OBRACK_CODE: 91, CBRACK_CODE: 93, QUMARK_CODE: 63, SEMCOL_CODE: 59, COLON_CODE: 58, unary_ops: { "-": 1, "!": 1, "~": 1, "+": 1 }, binary_ops: { "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5, "==": 6, "!=": 6, "===": 6, "!==": 6, "<": 7, ">": 7, "<=": 7, ">=": 7, "<<": 8, ">>": 8, ">>>": 8, "+": 9, "-": 9, "*": 10, "/": 10, "%": 10 }, right_associative: /* @__PURE__ */ new Set(), additional_identifier_chars: /* @__PURE__ */ new Set(["$", "_"]), literals: { true: true, false: false, null: null }, this_str: "this" }), v.max_unop_len = v.getMaxKeyLen(v.unary_ops), v.max_binop_len = v.getMaxKeyLen(v.binary_ops);
  var E = function(e2) {
    return new v(e2).parse();
  };
  Object.getOwnPropertyNames(v).forEach(function(e2) {
    void 0 === E[e2] && "prototype" !== e2 && (E[e2] = v[e2]);
  }), E.Jsep = v;
  b = { name: "ternary", init: function(o2) {
    o2.hooks.add("after-expression", function(e2) {
      if (e2.node && this.code === o2.QUMARK_CODE) {
        this.index++;
        var t2 = e2.node, r3 = this.gobbleExpression();
        if (r3 || this.throwError("Expected expression"), this.gobbleSpaces(), this.code === o2.COLON_CODE) {
          this.index++;
          var n2 = this.gobbleExpression();
          if (n2 || this.throwError("Expected expression"), e2.node = { type: "ConditionalExpression", test: t2, consequent: r3, alternate: n2 }, t2.operator && o2.binary_ops[t2.operator] <= 0.9) {
            for (var i2 = t2; i2.right.operator && o2.binary_ops[i2.right.operator] <= 0.9; ) i2 = i2.right;
            e2.node.test = i2.right, i2.right = e2.node, e2.node = t2;
          }
        } else this.throwError("Expected :");
      }
    });
  } };
  E.plugins.register(b);
  var b = { name: "regex", init: function(s2) {
    s2.hooks.add("gobble-token", function(e2) {
      if (47 === this.code) {
        for (var t2 = ++this.index, r3 = false; this.index < this.expr.length; ) {
          if (47 === this.code && !r3) {
            for (var n2 = this.expr.slice(t2, this.index), i2 = ""; ++this.index < this.expr.length; ) {
              var o2 = this.code;
              if (!(97 <= o2 && o2 <= 122 || 65 <= o2 && o2 <= 90 || 48 <= o2 && o2 <= 57)) break;
              i2 += this.char;
            }
            var a2 = void 0;
            try {
              a2 = new RegExp(n2, i2);
            } catch (e3) {
              this.throwError(e3.message);
            }
            return e2.node = { type: s2.LITERAL, value: a2, raw: this.expr.slice(t2 - 1, this.index) }, e2.node = this.gobbleTokenProperty(e2.node), e2.node;
          }
          this.code === s2.OBRACK_CODE ? r3 = true : r3 && this.code === s2.CBRACK_CODE && (r3 = false), this.index += 92 === this.code ? 2 : 1;
        }
        this.throwError("Unclosed Regex");
      }
    });
  } }, g2 = { name: "assignment", assignmentOperators: /* @__PURE__ */ new Set(["=", "*=", "**=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="]), updateOperators: [43, 45], assignmentPrecedence: 0.9, init: function(t2) {
    var n2 = [t2.IDENTIFIER, t2.MEMBER_EXP];
    g2.assignmentOperators.forEach(function(e2) {
      return t2.addBinaryOp(e2, g2.assignmentPrecedence, true);
    }), t2.hooks.add("gobble-token", function(e2) {
      var t3 = this, r3 = this.code;
      g2.updateOperators.some(function(e3) {
        return e3 === r3 && e3 === t3.expr.charCodeAt(t3.index + 1);
      }) && (this.index += 2, e2.node = { type: "UpdateExpression", operator: 43 === r3 ? "++" : "--", argument: this.gobbleTokenProperty(this.gobbleIdentifier()), prefix: true }, e2.node.argument && n2.includes(e2.node.argument.type) || this.throwError("Unexpected ".concat(e2.node.operator)));
    }), t2.hooks.add("after-token", function(e2) {
      var t3, r3 = this;
      e2.node && (t3 = this.code, g2.updateOperators.some(function(e3) {
        return e3 === t3 && e3 === r3.expr.charCodeAt(r3.index + 1);
      }) && (n2.includes(e2.node.type) || this.throwError("Unexpected ".concat(e2.node.operator)), this.index += 2, e2.node = { type: "UpdateExpression", operator: 43 === t3 ? "++" : "--", argument: e2.node, prefix: false }));
    }), t2.hooks.add("after-expression", function(e2) {
      e2.node && !(function t3(e3) {
        g2.assignmentOperators.has(e3.operator) ? (e3.type = "AssignmentExpression", t3(e3.left), t3(e3.right)) : e3.operator || Object.values(e3).forEach(function(e4) {
          e4 && "object" === C(e4) && t3(e4);
        });
      })(e2.node);
    });
  } }, A = Object.prototype.hasOwnProperty;
  function w(e2, t2) {
    return (e2 = e2.slice()).push(t2), e2;
  }
  function k(e2, t2) {
    return (t2 = t2.slice()).unshift(e2), t2;
  }
  var x = (function() {
    function r3(e2) {
      var t2;
      return s(this, r3), (t2 = n(this, r3, ['JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'])).avoidNew = true, t2.value = e2, t2.name = "NewError", t2;
    }
    return (function(e2, t2) {
      if ("function" != typeof t2 && null !== t2) throw new TypeError("Super expression must either be null or a function");
      e2.prototype = Object.create(t2 && t2.prototype, { constructor: { value: e2, writable: true, configurable: true } }), Object.defineProperty(e2, "prototype", { writable: false }), t2 && h(e2, t2);
    })(r3, p2(Error)), c(r3);
  })();
  function F(e2, t2, r3, n2, i2) {
    if (!(this instanceof F)) try {
      return new F(e2, t2, r3, n2, i2);
    } catch (e3) {
      if (!e3.avoidNew) throw e3;
      return e3.value;
    }
    "string" == typeof e2 && (i2 = n2, n2 = r3, r3 = t2, t2 = e2, e2 = null);
    var o2 = e2 && "object" === C(e2);
    if (e2 = e2 || {}, this.json = e2.json || r3, this.path = e2.path || t2, this.resultType = e2.resultType || "value", this.flatten = e2.flatten || false, this.wrap = !A.call(e2, "wrap") || e2.wrap, this.sandbox = e2.sandbox || {}, this.eval = void 0 === e2.eval ? "safe" : e2.eval, this.ignoreEvalErrors = void 0 !== e2.ignoreEvalErrors && e2.ignoreEvalErrors, this.parent = e2.parent || null, this.parentProperty = e2.parentProperty || null, this.callback = e2.callback || n2 || null, this.otherTypeCallback = e2.otherTypeCallback || i2 || function() {
      throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.");
    }, false !== e2.autostart) {
      var a2 = { path: o2 ? e2.path : t2 };
      o2 ? "json" in e2 && (a2.json = e2.json) : a2.json = r3;
      a2 = this.evaluate(a2);
      if (!a2 || "object" !== C(a2)) throw new x(a2);
      return a2;
    }
  }
  F.prototype.evaluate = function(e2, t2, r3, n2) {
    var i2 = this, o2 = this.parent, a2 = this.parentProperty, s2 = this.flatten, u2 = this.wrap;
    if (this.currResultType = this.resultType, this.currEval = this.eval, this.currSandbox = this.sandbox, r3 = r3 || this.callback, this.currOtherTypeCallback = n2 || this.otherTypeCallback, t2 = t2 || this.json, (e2 = e2 || this.path) && "object" === C(e2) && !Array.isArray(e2)) {
      if (!e2.path && "" !== e2.path) throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
      if (!A.call(e2, "json")) throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');
      t2 = e2.json, s2 = A.call(e2, "flatten") ? e2.flatten : s2, this.currResultType = A.call(e2, "resultType") ? e2.resultType : this.currResultType, this.currSandbox = A.call(e2, "sandbox") ? e2.sandbox : this.currSandbox, u2 = A.call(e2, "wrap") ? e2.wrap : u2, this.currEval = A.call(e2, "eval") ? e2.eval : this.currEval, r3 = A.call(e2, "callback") ? e2.callback : r3, this.currOtherTypeCallback = A.call(e2, "otherTypeCallback") ? e2.otherTypeCallback : this.currOtherTypeCallback, o2 = A.call(e2, "parent") ? e2.parent : o2, a2 = A.call(e2, "parentProperty") ? e2.parentProperty : a2, e2 = e2.path;
    }
    if (o2 = o2 || null, a2 = a2 || null, Array.isArray(e2) && (e2 = F.toPathString(e2)), (e2 || "" === e2) && t2) {
      e2 = F.toPathArray(e2);
      "$" === e2[0] && 1 < e2.length && e2.shift(), this._hasParentSelector = null;
      r3 = this._trace(e2, t2, ["$"], o2, a2, r3).filter(function(e3) {
        return e3 && !e3.isParentSelector;
      });
      return r3.length ? u2 || 1 !== r3.length || r3[0].hasArrExpr ? r3.reduce(function(e3, t3) {
        t3 = i2._getPreferredOutput(t3);
        return s2 && Array.isArray(t3) ? e3 = e3.concat(t3) : e3.push(t3), e3;
      }, []) : this._getPreferredOutput(r3[0]) : u2 ? [] : void 0;
    }
  }, F.prototype._getPreferredOutput = function(e2) {
    var t2 = this.currResultType;
    switch (t2) {
      case "all":
        var r3 = Array.isArray(e2.path) ? e2.path : F.toPathArray(e2.path);
        return e2.pointer = F.toPointer(r3), e2.path = "string" == typeof e2.path ? e2.path : F.toPathString(e2.path), e2;
      case "value":
      case "parent":
      case "parentProperty":
        return e2[t2];
      case "path":
        return F.toPathString(e2[t2]);
      case "pointer":
        return F.toPointer(e2.path);
      default:
        throw new TypeError("Unknown result type");
    }
  }, F.prototype._handleCallback = function(e2, t2, r3) {
    var n2;
    t2 && (n2 = this._getPreferredOutput(e2), e2.path = "string" == typeof e2.path ? e2.path : F.toPathString(e2.path), t2(n2, r3, e2));
  }, F.prototype._trace = function(t2, n2, i2, o2, a2, s2, e2, r3) {
    var u2 = this;
    if (!t2.length) return v2 = { path: i2, value: n2, parent: o2, parentProperty: a2, hasArrExpr: e2 }, this._handleCallback(v2, s2, "value"), v2;
    var c2 = t2[0], l2 = t2.slice(1), h2 = [];
    function p3(e3) {
      Array.isArray(e3) ? e3.forEach(function(e4) {
        h2.push(e4);
      }) : h2.push(e3);
    }
    if (("string" != typeof c2 || r3) && n2 && A.call(n2, c2)) p3(this._trace(l2, n2[c2], w(i2, c2), n2, c2, s2, e2));
    else if ("*" === c2) this._walk(n2, function(e3) {
      p3(u2._trace(l2, n2[e3], w(i2, e3), n2, e3, s2, true, true));
    });
    else if (".." === c2) p3(this._trace(l2, n2, i2, o2, a2, s2, e2)), this._walk(n2, function(e3) {
      "object" === C(n2[e3]) && p3(u2._trace(t2.slice(), n2[e3], w(i2, e3), n2, e3, s2, true));
    });
    else {
      if ("^" === c2) return this._hasParentSelector = true, { path: i2.slice(0, -1), expr: l2, isParentSelector: true };
      if ("~" === c2) return v2 = { path: w(i2, c2), value: a2, parent: o2, parentProperty: null }, this._handleCallback(v2, s2, "property"), v2;
      if ("$" === c2) p3(this._trace(l2, n2, i2, null, null, s2, e2));
      else if (/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(c2)) p3(this._slice(c2, l2, n2, i2, o2, a2, s2));
      else if (0 === c2.indexOf("?(")) {
        if (false === this.currEval) throw new Error("Eval [?(expr)] prevented in JSONPath expression.");
        var f2 = c2.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/, "$1"), d3 = /@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])?((?:[\0->@-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))(?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\)\])['\]]/g.exec(f2);
        d3 ? this._walk(n2, function(e3) {
          var t3 = [d3[2]], r4 = d3[1] ? n2[e3][d3[1]] : n2[e3];
          0 < u2._trace(t3, r4, i2, o2, a2, s2, true).length && p3(u2._trace(l2, n2[e3], w(i2, e3), n2, e3, s2, true));
        }) : this._walk(n2, function(e3) {
          u2._eval(f2, n2[e3], e3, i2, o2, a2) && p3(u2._trace(l2, n2[e3], w(i2, e3), n2, e3, s2, true));
        });
      } else if ("(" === c2[0]) {
        if (false === this.currEval) throw new Error("Eval [(expr)] prevented in JSONPath expression.");
        p3(this._trace(k(this._eval(c2, n2, i2[i2.length - 1], i2.slice(0, -1), o2, a2), l2), n2, i2, o2, a2, s2, e2));
      } else if ("@" === c2[0]) {
        var y2 = false, b2 = c2.slice(1, -2);
        switch (b2) {
          case "scalar":
            n2 && ["object", "function"].includes(C(n2)) || (y2 = true);
            break;
          case "boolean":
          case "string":
          case "undefined":
          case "function":
            C(n2) === b2 && (y2 = true);
            break;
          case "integer":
            !Number.isFinite(n2) || n2 % 1 || (y2 = true);
            break;
          case "number":
            Number.isFinite(n2) && (y2 = true);
            break;
          case "nonFinite":
            "number" != typeof n2 || Number.isFinite(n2) || (y2 = true);
            break;
          case "object":
            n2 && C(n2) === b2 && (y2 = true);
            break;
          case "array":
            Array.isArray(n2) && (y2 = true);
            break;
          case "other":
            y2 = this.currOtherTypeCallback(n2, i2, o2, a2);
            break;
          case "null":
            null === n2 && (y2 = true);
            break;
          default:
            throw new TypeError("Unknown value type " + b2);
        }
        if (y2) return v2 = { path: i2, value: n2, parent: o2, parentProperty: a2 }, this._handleCallback(v2, s2, "value"), v2;
      } else if ("`" === c2[0] && n2 && A.call(n2, c2.slice(1))) {
        var v2 = c2.slice(1);
        p3(this._trace(l2, n2[v2], w(i2, v2), n2, v2, s2, e2, true));
      } else if (c2.includes(",")) {
        var E2 = (function(e3, t3) {
          var r4 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
          if (!r4) {
            if (Array.isArray(e3) || (r4 = O(e3)) || t3 && e3 && "number" == typeof e3.length) {
              r4 && (e3 = r4);
              var n3 = 0, t3 = function() {
              };
              return { s: t3, n: function() {
                return n3 >= e3.length ? { done: true } : { done: false, value: e3[n3++] };
              }, e: function(e4) {
                throw e4;
              }, f: t3 };
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }
          var i3, o3 = true, a3 = false;
          return { s: function() {
            r4 = r4.call(e3);
          }, n: function() {
            var e4 = r4.next();
            return o3 = e4.done, e4;
          }, e: function(e4) {
            a3 = true, i3 = e4;
          }, f: function() {
            try {
              o3 || null == r4.return || r4.return();
            } finally {
              if (a3) throw i3;
            }
          } };
        })(c2.split(","));
        try {
          for (E2.s(); !(g3 = E2.n()).done; ) {
            var g3 = g3.value;
            p3(this._trace(k(g3, l2), n2, i2, o2, a2, s2, true));
          }
        } catch (e3) {
          E2.e(e3);
        } finally {
          E2.f();
        }
      } else !r3 && n2 && A.call(n2, c2) && p3(this._trace(l2, n2[c2], w(i2, c2), n2, c2, s2, e2, true));
    }
    if (this._hasParentSelector) for (var x2 = 0; x2 < h2.length; x2++) {
      var F2 = h2[x2];
      if (F2 && F2.isParentSelector) {
        var D2 = this._trace(F2.expr, n2, F2.path, o2, a2, s2, e2);
        if (Array.isArray(D2)) {
          h2[x2] = D2[0];
          for (var _ = D2.length, m = 1; m < _; m++) x2++, h2.splice(x2, 0, D2[m]);
        } else h2[x2] = D2;
      }
    }
    return h2;
  }, F.prototype._walk = function(e2, t2) {
    if (Array.isArray(e2)) for (var r3 = e2.length, n2 = 0; n2 < r3; n2++) t2(n2);
    else e2 && "object" === C(e2) && Object.keys(e2).forEach(function(e3) {
      t2(e3);
    });
  }, F.prototype._slice = function(e2, t2, r3, n2, i2, o2, a2) {
    if (Array.isArray(r3)) {
      for (var s2 = r3.length, u2 = e2.split(":"), c2 = u2[2] && Number.parseInt(u2[2]) || 1, e2 = u2[0] && Number.parseInt(u2[0]) || 0, l2 = u2[1] && Number.parseInt(u2[1]) || s2, e2 = e2 < 0 ? Math.max(0, e2 + s2) : Math.min(s2, e2), l2 = l2 < 0 ? Math.max(0, l2 + s2) : Math.min(s2, l2), h2 = [], p3 = e2; p3 < l2; p3 += c2) this._trace(k(p3, t2), r3, n2, i2, o2, a2, true).forEach(function(e3) {
        h2.push(e3);
      });
      return h2;
    }
  }, F.prototype._eval = function(t2, e2, r3, n2, i2, o2) {
    var a2 = this;
    this.currSandbox._$_parentProperty = o2, this.currSandbox._$_parent = i2, this.currSandbox._$_property = r3, this.currSandbox._$_root = this.json, this.currSandbox._$_v = e2;
    e2 = t2.includes("@path");
    e2 && (this.currSandbox._$_path = F.toPathString(n2.concat([r3])));
    var s2 = this.currEval + "Script:" + t2;
    if (!F.cache[s2]) {
      var u2 = t2.replace(/@parentProperty/g, "_$_parentProperty").replace(/@parent/g, "_$_parent").replace(/@property/g, "_$_property").replace(/@root/g, "_$_root").replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g, "_$_v$1");
      if (e2 && (u2 = u2.replace(/@path/g, "_$_path")), "safe" === this.currEval || true === this.currEval || void 0 === this.currEval) F.cache[s2] = new this.safeVm.Script(u2);
      else if ("native" === this.currEval) F.cache[s2] = new this.vm.Script(u2);
      else if ("function" == typeof this.currEval && this.currEval.prototype && A.call(this.currEval.prototype, "runInNewContext")) {
        e2 = this.currEval;
        F.cache[s2] = new e2(u2);
      } else {
        if ("function" != typeof this.currEval) throw new TypeError('Unknown "eval" property "'.concat(this.currEval, '"'));
        F.cache[s2] = { runInNewContext: function(e3) {
          return a2.currEval(u2, e3);
        } };
      }
    }
    try {
      return F.cache[s2].runInNewContext(this.currSandbox);
    } catch (e3) {
      if (this.ignoreEvalErrors) return false;
      throw new Error("jsonPath: " + e3.message + ": " + t2);
    }
  }, F.cache = {}, F.toPathString = function(e2) {
    for (var t2 = e2, r3 = t2.length, n2 = "$", i2 = 1; i2 < r3; i2++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t2[i2]) || (n2 += /^[\*0-9]+$/.test(t2[i2]) ? "[" + t2[i2] + "]" : "['" + t2[i2] + "']");
    return n2;
  }, F.toPointer = function(e2) {
    for (var t2 = e2, r3 = t2.length, n2 = "", i2 = 1; i2 < r3; i2++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t2[i2]) || (n2 += "/" + t2[i2].toString().replace(/~/g, "~0").replace(/\//g, "~1"));
    return n2;
  }, F.toPathArray = function(e2) {
    var t2 = F.cache;
    if (t2[e2]) return t2[e2].concat();
    var r3 = [], n2 = e2.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g, ";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]](?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\])/g, function(e3, t3) {
      return "[#" + (r3.push(t3) - 1) + "]";
    }).replace(/\[["']((?:[\0-&\(-\\\^-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)["']\]/g, function(e3, t3) {
      return "['" + t3.replace(/\./g, "%@%").replace(/~/g, "%%@@%%") + "']";
    }).replace(/~/g, ";~;").replace(/["']?\.["']?(?!(?:[\0-Z\\-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*\])|\[["']?/g, ";").replace(/%@%/g, ".").replace(/%%@@%%/g, "~").replace(/(?:;)?(\^+)(?:;)?/g, function(e3, t3) {
      return ";" + t3.split("").join(";") + ";";
    }).replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "").split(";").map(function(e3) {
      var t3 = e3.match(/#([0-9]+)/);
      return t3 && t3[1] ? r3[t3[1]] : e3;
    });
    return t2[e2] = n2, t2[e2].concat();
  };
  E.plugins.register(b, g2);
  var D = { evalAst: function(e2, t2) {
    switch (e2.type) {
      case "BinaryExpression":
      case "LogicalExpression":
        return D.evalBinaryExpression(e2, t2);
      case "Compound":
        return D.evalCompound(e2, t2);
      case "ConditionalExpression":
        return D.evalConditionalExpression(e2, t2);
      case "Identifier":
        return D.evalIdentifier(e2, t2);
      case "Literal":
        return D.evalLiteral(e2, t2);
      case "MemberExpression":
        return D.evalMemberExpression(e2, t2);
      case "UnaryExpression":
        return D.evalUnaryExpression(e2, t2);
      case "ArrayExpression":
        return D.evalArrayExpression(e2, t2);
      case "CallExpression":
        return D.evalCallExpression(e2, t2);
      case "AssignmentExpression":
        return D.evalAssignmentExpression(e2, t2);
      default:
        throw SyntaxError("Unexpected expression", e2);
    }
  }, evalBinaryExpression: function(e2, t2) {
    return { "||": function(e3, t3) {
      return e3 || t3();
    }, "&&": function(e3, t3) {
      return e3 && t3();
    }, "|": function(e3, t3) {
      return e3 | t3();
    }, "^": function(e3, t3) {
      return e3 ^ t3();
    }, "&": function(e3, t3) {
      return e3 & t3();
    }, "==": function(e3, t3) {
      return e3 == t3();
    }, "!=": function(e3, t3) {
      return e3 != t3();
    }, "===": function(e3, t3) {
      return e3 === t3();
    }, "!==": function(e3, t3) {
      return e3 !== t3();
    }, "<": function(e3, t3) {
      return e3 < t3();
    }, ">": function(e3, t3) {
      return e3 > t3();
    }, "<=": function(e3, t3) {
      return e3 <= t3();
    }, ">=": function(e3, t3) {
      return e3 >= t3();
    }, "<<": function(e3, t3) {
      return e3 << t3();
    }, ">>": function(e3, t3) {
      return e3 >> t3();
    }, ">>>": function(e3, t3) {
      return e3 >>> t3();
    }, "+": function(e3, t3) {
      return e3 + t3();
    }, "-": function(e3, t3) {
      return e3 - t3();
    }, "*": function(e3, t3) {
      return e3 * t3();
    }, "/": function(e3, t3) {
      return e3 / t3();
    }, "%": function(e3, t3) {
      return e3 % t3();
    } }[e2.operator](D.evalAst(e2.left, t2), function() {
      return D.evalAst(e2.right, t2);
    });
  }, evalCompound: function(e2, t2) {
    for (var r3 = 0; r3 < e2.body.length; r3++) {
      "Identifier" === e2.body[r3].type && ["var", "let", "const"].includes(e2.body[r3].name) && e2.body[r3 + 1] && "AssignmentExpression" === e2.body[r3 + 1].type && (r3 += 1);
      var n2 = e2.body[r3], i2 = D.evalAst(n2, t2);
    }
    return i2;
  }, evalConditionalExpression: function(e2, t2) {
    return D.evalAst(e2.test, t2) ? D.evalAst(e2.consequent, t2) : D.evalAst(e2.alternate, t2);
  }, evalIdentifier: function(e2, t2) {
    if (e2.name in t2) return t2[e2.name];
    throw ReferenceError("".concat(e2.name, " is not defined"));
  }, evalLiteral: function(e2) {
    return e2.value;
  }, evalMemberExpression: function(e2, t2) {
    var r3 = e2.computed ? D.evalAst(e2.property) : e2.property.name, t2 = D.evalAst(e2.object, t2), r3 = t2[r3];
    return "function" == typeof r3 ? r3.bind(t2) : r3;
  }, evalUnaryExpression: function(e2, t2) {
    return { "-": function(e3) {
      return -D.evalAst(e3, t2);
    }, "!": function(e3) {
      return !D.evalAst(e3, t2);
    }, "~": function(e3) {
      return ~D.evalAst(e3, t2);
    }, "+": function(e3) {
      return +D.evalAst(e3, t2);
    } }[e2.operator](e2.argument);
  }, evalArrayExpression: function(e2, t2) {
    return e2.elements.map(function(e3) {
      return D.evalAst(e3, t2);
    });
  }, evalCallExpression: function(e2, t2) {
    var r3 = e2.arguments.map(function(e3) {
      return D.evalAst(e3, t2);
    });
    return D.evalAst(e2.callee, t2).apply(void 0, f(r3));
  }, evalAssignmentExpression: function(e2, t2) {
    if ("Identifier" !== e2.left.type) throw SyntaxError("Invalid left-hand side in assignment");
    var r3 = e2.left.name, e2 = D.evalAst(e2.right, t2);
    return t2[r3] = e2, t2[r3];
  } }, b = (function() {
    return c(function e2(t2) {
      s(this, e2), this.code = t2, this.ast = E(this.code);
    }, [{ key: "runInNewContext", value: function(e2) {
      e2 = r2({}, e2);
      return D.evalAst(this.ast, e2);
    } }]);
  })();
  F.prototype.vm = { Script: (function() {
    return c(function e2(t2) {
      s(this, e2), this.code = t2;
    }, [{ key: "runInNewContext", value: function(n2) {
      var e2 = this.code, t2 = Object.keys(n2), r3 = [];
      !(function(e3, t3, r4) {
        for (var n3 = e3.length, i3 = 0; i3 < n3; i3++) r4(e3[i3]) && t3.push(e3.splice(i3--, 1)[0]);
      })(t2, r3, function(e3) {
        return "function" == typeof n2[e3];
      });
      var i2 = t2.map(function(e3) {
        return n2[e3];
      }), r3 = r3.reduce(function(e3, t3) {
        var r4 = n2[t3].toString();
        return /function/.test(r4) || (r4 = "function " + r4), "var " + t3 + "=" + r4 + ";" + e3;
      }, "");
      /(["'])use strict\1/.test(e2 = r3 + e2) || t2.includes("arguments") || (e2 = "var arguments = undefined;" + e2);
      r3 = (e2 = e2.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/, "")).lastIndexOf(";"), e2 = -1 < r3 ? e2.slice(0, r3 + 1) + " return " + e2.slice(r3 + 1) : " return " + e2;
      return o(Function, t2.concat([e2])).apply(void 0, f(i2));
    } }]);
  })() }, F.prototype.safeVm = { Script: b }, e.JSONPath = F, e.SafeScript = b;
});

// cli/htmlParser.js
var log = (...args) => console.log("[htmlParser]", ...args);
var urljoin = (fromPath, nowPath) => {
  fromPath = fromPath || "";
  nowPath = nowPath || "";
  return new URL(nowPath, fromPath).href;
};
var jsonpath = {
  query(jsonObject, path) {
    return JSONPath.JSONPath({ path, json: jsonObject });
  }
};
var PARSE_CACHE = true;
var NOADD_INDEX = ":eq|:lt|:gt|:first|:last|:not|:even|:odd|:has|:contains|:matches|:empty|^body$|^#";
var URLJOIN_ATTR = "(url|src|href|-original|-src|-play|-url|style)$|^(data-|url-|src-)";
var SPECIAL_URL2 = "^(ftp|magnet|thunder|ws):";
var Jsoup = class {
  /**
   * 构造函数
   * @param {string} MY_URL 基础URL
   */
  constructor(MY_URL = "") {
    this.MY_URL = MY_URL;
    this.pdfa_html = "";
    this.pdfa_doc = null;
    this.pdfh_html = "";
    this.pdfh_doc = null;
  }
  /**
   * 正则测试
   * @param {string} text 正则表达式
   * @param {string} string 测试字符串
   * @returns {boolean} 是否匹配
   */
  test(text, string) {
    const searchObj = new RegExp(text, "mi").exec(string);
    return searchObj ? true : false;
  }
  /**
   * 检查字符串是否包含指定内容
   * @param {string} text 源字符串
   * @param {string} match 匹配内容
   * @returns {boolean} 是否包含
   */
  contains(text, match) {
    return text.indexOf(match) !== -1;
  }
  /**
   * 将海阔视界解析语法转换为jQuery选择器
   * @param {string} parse 解析规则
   * @param {boolean} first 是否只取第一个
   * @returns {string} 转换后的选择器
   */
  parseHikerToJq(parse, first = false) {
    if (this.contains(parse, "&&")) {
      const parses = parse.split("&&");
      const new_parses = [];
      for (let i = 0; i < parses.length; i++) {
        const ps_list = parses[i].split(" ");
        const ps = ps_list[ps_list.length - 1];
        if (!this.test(NOADD_INDEX, ps)) {
          if (!first && i >= parses.length - 1) {
            new_parses.push(parses[i]);
          } else {
            new_parses.push(`${parses[i]}:eq(0)`);
          }
        } else {
          new_parses.push(parses[i]);
        }
      }
      parse = new_parses.join(" ");
    } else {
      const ps_list = parse.split(" ");
      const ps = ps_list[ps_list.length - 1];
      if (!this.test(NOADD_INDEX, ps) && first) {
        parse = `${parse}:eq(0)`;
      }
    }
    return parse;
  }
  /**
   * 获取解析信息
   * @param {string} nparse 解析规则
   * @returns {Object} 解析信息对象
   */
  getParseInfo(nparse) {
    let excludes = [];
    let nparse_index = 0;
    let nparse_rule = nparse;
    if (this.contains(nparse, ":eq")) {
      nparse_rule = nparse.split(":eq")[0];
      let nparse_pos = nparse.split(":eq")[1];
      if (this.contains(nparse_rule, "--")) {
        excludes = nparse_rule.split("--").slice(1);
        nparse_rule = nparse_rule.split("--")[0];
      } else if (this.contains(nparse_pos, "--")) {
        excludes = nparse_pos.split("--").slice(1);
        nparse_pos = nparse_pos.split("--")[0];
      }
      try {
        nparse_index = parseInt(nparse_pos.split("(")[1].split(")")[0]);
      } catch {
      }
    } else if (this.contains(nparse, "--")) {
      nparse_rule = nparse.split("--")[0];
      excludes = nparse.split("--").slice(1);
    }
    return { nparse_rule, nparse_index, excludes };
  }
  /**
   * 重新排序相邻的:gt和:lt选择器
   * @param {string} selector 选择器
   * @returns {string} 重排后的选择器
   */
  reorderAdjacentLtAndGt(selector) {
    const adjacentPattern = /:gt\((\d+)\):lt\((\d+)\)/;
    let match;
    while ((match = adjacentPattern.exec(selector)) !== null) {
      const replacement = `:lt(${match[2]}):gt(${match[1]})`;
      selector = selector.substring(0, match.index) + replacement + selector.substring(match.index + match[0].length);
      adjacentPattern.lastIndex = match.index;
    }
    return selector;
  }
  /**
   * 解析单个规则
   * @param {Object} doc cheerio文档对象
   * @param {string} nparse 解析规则
   * @param {Object} ret 上一步结果
   * @returns {Object} 解析结果
   */
  parseOneRule(doc, nparse, ret) {
    let { nparse_rule, nparse_index, excludes } = this.getParseInfo(nparse);
    nparse_rule = this.reorderAdjacentLtAndGt(nparse_rule);
    if (!ret) ret = doc(nparse_rule);
    else ret = ret.find(nparse_rule);
    if (this.contains(nparse, ":eq")) ret = ret.eq(nparse_index);
    if (excludes.length > 0 && ret) {
      ret = ret.clone();
      for (let exclude of excludes) {
        ret.find(exclude).remove();
      }
    }
    return ret;
  }
  /**
   * 解析文本内容
   * @param {string} text 原始文本
   * @returns {string} 处理后的文本
   */
  parseText(text) {
    text = text.replace(/[\s]+/gm, "\n");
    text = text.replace(/\n+/g, "\n").replace(/^\s+/, "");
    text = text.replace(/\n/g, " ");
    return text;
  }
  /**
   * 解析HTML获取数组结果
   * @param {string} html HTML内容
   * @param {string} parse 解析规则
   * @returns {Array} 解析结果数组
   */
  pdfa(html, parse) {
    if (!html || !parse) return [];
    parse = this.parseHikerToJq(parse);
    if (PARSE_CACHE) {
      if (this.pdfa_html !== html) {
        this.pdfa_html = html;
        this.pdfa_doc = load(html);
      }
    } else {
      this.pdfa_doc = load(html);
    }
    const doc = this.pdfa_doc;
    const parses = parse.split(" ");
    let ret = null;
    for (const nparse of parses) {
      ret = this.parseOneRule(doc, nparse, ret);
      if (!ret) return [];
    }
    const res = (ret?.toArray() ?? []).map((item) => `${doc(item)}`);
    return res;
  }
  /**
   * 解析HTML获取列表数据
   * @param {string} html HTML内容
   * @param {string} parse 解析规则
   * @param {string} list_text 标题解析规则
   * @param {string} list_url 链接解析规则
   * @param {string} MY_URL 基础URL
   * @returns {Array} 列表数据
   */
  pdfl(html, parse, list_text, list_url, MY_URL) {
    if (!html || !parse) return [];
    parse = this.parseHikerToJq(parse, false);
    const doc = load(html);
    const parses = parse.split(" ");
    let ret = null;
    for (const pars of parses) {
      ret = this.parseOneRule(doc, pars, ret);
      if (!ret) return [];
    }
    const batchResult = this._pdflBatch(doc, ret, list_text, list_url, MY_URL);
    if (batchResult !== null) return batchResult;
    const new_vod_list = [];
    ret.each((_, element) => {
      const _html = `${doc(element)}`;
      let _title = this.pdfh(_html, list_text);
      let _url = this.pd(_html, list_url, MY_URL);
      new_vod_list.push(`${_title}$${_url}`);
    });
    return new_vod_list;
  }
  /**
   * pdfl 批量模式核心逻辑
   * 策略：用 data-pdfl-batch 属性标记每个列表项索引 -> 全局 doc(sel) 查找
   * -> closest('[data-pdfl-batch]') 定位所属列表项 -> 读属性值得索引
   * 返回 null 表示选择器不可批量，需回退到逐元素模式
   * @param {Object} doc cheerio文档对象
   * @param {Object} ret 列表项集合
   * @param {string} list_text 标题解析规则
   * @param {string} list_url 链接解析规则
   * @param {string} MY_URL 基础URL
   * @returns {Array|null} 列表数据，null 表示不可批量
   */
  _pdflBatch(doc, ret, list_text, list_url, MY_URL) {
    if (!MY_URL) MY_URL = this.MY_URL;
    const ti = this._parseSubOpt(list_text);
    const ui = this._parseSubOpt(list_url);
    if (!ti.canBatch && !ti.special || !ui.canBatch && !ui.special) return null;
    const TAG = "data-pdfl-batch";
    const TAG_SEL = "[" + TAG + "]";
    const self2 = this;
    ret.each((i, el) => {
      doc(el).attr(TAG, "" + i);
    });
    function buildMap(batchSel) {
      const map = {};
      doc(batchSel).each((_, el) => {
        const ancestor = doc(el).closest(TAG_SEL);
        const idx = ancestor.attr(TAG);
        if (idx !== void 0 && idx !== null && idx !== "" && !(idx in map)) {
          map[idx] = el;
        }
      });
      return map;
    }
    const textMap = ti.special ? null : buildMap(ti.batchSel);
    const urlMap = ui.special ? null : buildMap(ui.batchSel);
    const results = [];
    ret.each((i, el) => {
      let t, u;
      if (ti.special === "Text") t = self2.parseText(doc(el).text());
      else if (ti.special === "Html") t = doc(el).html() || "";
      else {
        const tn = textMap[i];
        t = tn ? self2._applyOption(doc(tn), ti.opt, "") : "";
      }
      if (ui.special === "Text") u = self2.parseText(doc(el).text());
      else if (ui.special === "Html") u = doc(el).html() || "";
      else {
        const un2 = urlMap[i];
        u = un2 ? self2._applyOption(doc(un2), ui.opt, MY_URL) : "";
      }
      results.push(`${t}$${u}`);
    });
    ret.removeAttr(TAG);
    return results;
  }
  /**
   * 解析子选择器+选项，strip :eq(0)/:first 用于全局查找
   * @param {string} s 子选择器规则
   * @returns {Object} { opt, batchSel, canBatch } 或 { special } 或 { canBatch: false }
   */
  _parseSubOpt(s) {
    if (s === "Text" || s === "body&&Text") return { special: "Text" };
    if (s === "Html" || s === "body&&Html") return { special: "Html" };
    let option;
    if (this.contains(s, "&&")) {
      const parts = s.split("&&");
      option = parts.pop();
      s = parts.join("&&");
    }
    s = this.parseHikerToJq(s, true);
    const batchSel = s.replace(/:eq\(0\)/g, "").replace(/:first/g, "").trim();
    if (!batchSel) return { canBatch: false };
    const canBatch = !batchSel.match(/:eq\(|:lt|:gt|:last|:not|:even|:odd|:has|:contains|:matches|:empty|--/);
    return { opt: option, batchSel, canBatch };
  }
  /**
   * 选项处理逻辑（Text/Html/属性提取+URL拼接）
   * 从 pdfh 中抽出，供 pdfh 和 _pdflBatch 共用
   * @param {Object} ret cheerio结果对象
   * @param {string} option 选项（Text/Html/属性名等）
   * @param {string} baseUrl 基础URL
   * @returns {string} 解析结果
   */
  _applyOption(ret, option, baseUrl) {
    if (!option) return `${ret}`;
    switch (option) {
      case "Text":
        return ret ? this.parseText(ret.text()) : "";
      case "Html":
        return ret ? ret.html() : "";
      default:
        const originalRet = ret.clone();
        const options = option.split("||");
        for (let opt of options) {
          let val = originalRet?.attr(opt) || "";
          if (this.contains(opt.toLowerCase(), "style") && this.contains(val, "url(")) {
            try {
              val = val.match(/url\((.*?)\)/)[1];
              val = val.replace(/^['"]|['"]$/g, "");
            } catch {
            }
          }
          if (val && baseUrl) {
            const needAdd = this.test(URLJOIN_ATTR, opt) && !this.test(SPECIAL_URL2, val);
            if (needAdd) {
              val = val.includes("http") ? val.slice(val.indexOf("http")) : urljoin(baseUrl, val);
            }
          }
          if (val) return val;
        }
        return "";
    }
  }
  /**
   * 解析HTML获取单个值
   * @param {string} html HTML内容
   * @param {string} parse 解析规则
   * @param {string} baseUrl 基础URL
   * @returns {string} 解析结果
   */
  pdfh(html, parse, baseUrl = "") {
    if (!html || !parse) return "";
    if (PARSE_CACHE) {
      if (this.pdfh_html !== html) {
        this.pdfh_html = html;
        this.pdfh_doc = load(html);
      }
    } else {
      this.pdfh_doc = load(html);
    }
    const doc = this.pdfh_doc;
    if (parse === "body&&Text" || parse === "Text") {
      return this.parseText(doc.text());
    } else if (parse === "body&&Html" || parse === "Html") {
      return doc.html();
    }
    let option;
    if (this.contains(parse, "&&")) {
      const parts = parse.split("&&");
      option = parts.pop();
      parse = parts.join("&&");
    }
    parse = this.parseHikerToJq(parse, true);
    const parses = parse.split(" ");
    let ret = null;
    for (const nparse of parses) {
      ret = this.parseOneRule(doc, nparse, ret);
      if (!ret) return "";
    }
    return this._applyOption(ret, option, baseUrl);
  }
  /**
   * 解析HTML并自动拼接URL
   * @param {string} html HTML内容
   * @param {string} parse 解析规则
   * @param {string} baseUrl 基础URL
   * @returns {string} 解析结果
   */
  pd(html, parse, baseUrl = "") {
    if (!baseUrl) baseUrl = this.MY_URL;
    return this.pdfh(html, parse, baseUrl);
  }
  /**
   * 获取cheerio对象
   * @param {string} html HTML内容
   * @returns {Object} cheerio对象
   */
  pq(html) {
    return load(html);
  }
  /**
   * 解析JSON获取单个值
   * @param {string|Object} html JSON字符串或对象
   * @param {string} parse JSONPath解析规则
   * @param {boolean} addUrl 是否自动拼接URL
   * @returns {string} 解析结果
   */
  pjfh(html, parse, addUrl = false) {
    if (!html || !parse) return "";
    try {
      html = typeof html === "string" ? JSON.parse(html) : html;
    } catch {
      log("\u5B57\u7B26\u4E32\u8F6C JSON \u5931\u8D25");
      return "";
    }
    if (!parse.startsWith("$.")) parse = "$." + parse;
    let ret = "";
    const paths = parse.split("||");
    for (const path of paths) {
      const queryResult = jsonpath.query(html, path);
      ret = Array.isArray(queryResult) ? queryResult[0] || "" : queryResult || "";
      if (addUrl && ret) ret = urljoin(this.MY_URL, ret);
      if (ret) break;
    }
    return ret;
  }
  /**
   * 解析JSON并自动拼接URL
   * @param {string|Object} html JSON字符串或对象
   * @param {string} parse JSONPath解析规则
   * @returns {string} 解析结果
   */
  pj(html, parse) {
    return this.pjfh(html, parse, true);
  }
  /**
   * 解析JSON获取数组结果
   * @param {string|Object} html JSON字符串或对象
   * @param {string} parse JSONPath解析规则
   * @returns {Array} 解析结果数组
   */
  pjfa(html, parse) {
    if (!html || !parse) return [];
    try {
      html = typeof html === "string" ? JSON.parse(html) : html;
    } catch {
      return [];
    }
    if (!parse.startsWith("$.")) parse = "$." + parse;
    const result = jsonpath.query(html, parse);
    if (Array.isArray(result) && Array.isArray(result[0]) && result.length === 1) {
      return result[0];
    }
    return result || [];
  }
};
var jsoup = Jsoup;

// hosts/fjs/glue.mjs
if (typeof globalThis.URL === "undefined") {
  try {
    const urlMod = await import("url");
    globalThis.URL = urlMod.URL || urlMod.default?.URL;
  } catch {
  }
}
var toBytes = (v) => {
  if (v instanceof Uint8Array) return v;
  if (v instanceof ArrayBuffer) return new Uint8Array(v);
  return v;
};
async function callBridge(action, payload = {}) {
  try {
    const fjs = globalThis.fjs;
    if (!fjs || typeof fjs.bridge_call !== "function") return null;
    return await fjs.bridge_call({ action, ...payload });
  } catch {
    return null;
  }
}
var STORE_MAP = /* @__PURE__ */ new Map();
function makeHostEnv(opts = {}) {
  const storeMap = STORE_MAP;
  return {
    engine: "fjs (quickjs-ng via rquickjs)",
    version: opts.fjsVersion || "",
    // ═══ 必选五件套 ═══
    async req(url2, options = {}) {
      const o = options || {};
      const r2 = await callBridge("req", { url: String(url2), options: o });
      if (!r2 || typeof r2 !== "object") return { content: "", headers: { error: "bridge: req \u672A\u8FD4\u56DE\u54CD\u5E94" } };
      if (o.buffer === 1) r2.content = toBytes(r2.content);
      return r2;
    },
    pdfh: (html, parse, baseUrl = "") => new jsoup(baseUrl || "").pdfh(html, parse, baseUrl || ""),
    pdfa: (html, parse) => new jsoup("").pdfa(html, parse),
    pd: (html, parse, baseUrl = "") => new jsoup(baseUrl || "").pd(html, parse, baseUrl || ""),
    pdfl: (html, parse, listText, listUrl, myUrl) => new jsoup(myUrl || "").pdfl(html, parse, listText, listUrl, myUrl),
    // ═══ 可选注入 ═══
    store: {
      get(ns, k, def = void 0) {
        const key = ns + "|" + k;
        return storeMap.has(key) ? storeMap.get(key) : def;
      },
      set(ns, k, v) {
        storeMap.set(ns + "|" + k, v);
        return v;
      },
      delete(ns, k) {
        storeMap.delete(ns + "|" + k);
      }
    },
    log: (...args) => {
      try {
        console.log("[drpy3]", ...args);
      } catch {
      }
    },
    // 桥未提供/返回空一律空串兜底（代理地址唯一事实源=宿主，不编造 9978）
    getProxy: async (isPublic) => {
      const p2 = await callBridge("getProxy", { isPublic: !!isPublic });
      return typeof p2 === "string" && p2 ? p2 : "";
    },
    loadAsset: async (p2) => {
      const r2 = await callBridge("loadAsset", { path: String(p2) });
      return r2 == null ? "" : toBytes(r2);
    },
    evalModule: async (code, path) => {
      const r2 = await callBridge("evalModule", { code: String(code), path: path ? String(path) : "" });
      const name = typeof r2 === "string" && r2 ? r2 : "";
      if (!name) throw new Error("evalModule: \u5BBF\u4E3B\u672A\u6CE8\u518C\u6A21\u5757\uFF08fjs \u9700 Dart \u4FA7 declareNewModule\uFF09");
      return import(name);
    },
    env: opts.env || {},
    action: opts.action !== false
  };
}
var SOURCES = /* @__PURE__ */ new Map();
var RT = null;
function rt() {
  if (!RT) RT = new Runtime(makeHostEnv(globalThis.__drpy3Opts || {}));
  return RT;
}
function drpy3Setup(optsJson) {
  globalThis.__drpy3Opts = optsJson ? JSON.parse(optsJson) : {};
  RT = null;
  return JSON.stringify(rt().check());
}
async function drpy3Load(code, key, path, extendJson, signature) {
  const src = await rt().load(String(code), {
    key: String(key),
    ...path ? { path: String(path) } : {},
    ...signature ? { signature: String(signature) } : {},
    ...extendJson ? { extend: JSON.parse(extendJson) } : {}
  });
  SOURCES.set(String(key), src);
  return JSON.stringify({ key: src.key, form: src.form, hot: src.hot });
}
async function drpy3Call(key, method, argsJson) {
  const src = SOURCES.get(String(key));
  if (!src) return JSON.stringify({ __drpy3_error: { stage: "dispatch", error: `\u6E90\u672A\u88C5\u8F7D: ${key}` } });
  let args = [];
  if (argsJson) {
    try {
      args = JSON.parse(argsJson);
    } catch {
      return JSON.stringify({ __drpy3_error: { stage: "dispatch", error: "argsJson \u975E\u6CD5" } });
    }
  }
  try {
    const out = await src[method](...args);
    return JSON.stringify(out === void 0 ? null : out);
  } catch (e) {
    const detail = e && typeof e.toJSON === "function" ? e.toJSON() : { stage: method, error: String(e && e.message || e) };
    return JSON.stringify({ __drpy3_error: detail });
  }
}
function drpy3Capabilities() {
  return JSON.stringify(rt().capabilities);
}
async function drpy3Sweep(optsJson) {
  const r2 = await rt().sweep(optsJson ? JSON.parse(optsJson) : {});
  return JSON.stringify(r2);
}
function drpy3StoreExport() {
  const dump = {};
  for (const [key, v] of STORE_MAP.entries()) {
    const i = key.indexOf("|");
    const ns = i > 0 ? key.slice(0, i) : "";
    const k = i > 0 ? key.slice(i + 1) : key;
    (dump[ns] ||= {})[k] = v;
  }
  return JSON.stringify(dump);
}
function drpy3StoreImport(json) {
  const dump = JSON.parse(String(json || "{}"));
  for (const [ns, kv] of Object.entries(dump || {})) {
    for (const [k, v] of Object.entries(kv || {})) STORE_MAP.set(ns + "|" + k, v);
  }
  return JSON.stringify({ ok: true });
}
export {
  drpy3Call,
  drpy3Capabilities,
  drpy3Load,
  drpy3Setup,
  drpy3StoreExport,
  drpy3StoreImport,
  drpy3Sweep
};
