var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// dist/drpy3-peer.js
var drpy3_peer_exports = {};
__export(drpy3_peer_exports, {
  Buffer: () => L,
  CryptoJS: () => Qe,
  JSEncrypt: () => U,
  JSONPath: () => Pe,
  NODERSA: () => rt,
  TextDecoder: () => We,
  TextEncoder: () => Fe,
  WebAssembly: () => Ye,
  cheerio: () => tt,
  gbkTool: () => et,
  jinja: () => le,
  pako: () => Ze,
  \u6A21\u677F: () => He
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
var Be = Object.defineProperty;
var s = (c, o) => Be(c, "name", { value: o, configurable: true });
typeof Object.assign != "function" && (Object.assign = function() {
  let c = arguments[0];
  for (let o = 1; o < arguments.length; o++) {
    let l = arguments[o];
    for (let p2 in l) Object.prototype.hasOwnProperty.call(l, p2) && (c[p2] = l[p2]);
  }
  return c;
});
var F = `js:
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
var we = `js:
  input = { parse: 1, url: input, js: '' };`;
var Ae = `js:
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
function ie() {
  return JSON.parse(JSON.stringify({ mx: { title: "", host: "", url: "/vodshow/fyclass--------fypage---/", searchUrl: "/vodsearch/**----------fypage---/", class_parse: ".top_nav li;a&&Text;a&&href;.*/(.*?)/", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: ".cbox_list;*;*;*;*;*", \u4E00\u7EA7: "ul.vodlist li;a&&title;a&&data-original;.pic_text&&Text;a&&href", \u4E8C\u7EA7: { title: "h2&&Text;.content_detail:eq(1)&&li&&a:eq(2)&&Text", img: ".vodlist_thumb&&data-original", desc: ".content_detail:eq(1)&&li:eq(1)&&Text;.content_detail:eq(1)&&li&&a&&Text;.content_detail:eq(1)&&li&&a:eq(1)&&Text;.content_detail:eq(1)&&li:eq(2)&&Text;.content_detail:eq(1)&&li:eq(3)&&Text", content: ".content_desc&&span&&Text", tabs: ".play_source_tab&&a", lists: ".content_playlist:eq(#id) li" }, \u641C\u7D22: "*" }, mxpro: { title: "", host: "", url: "/vodshow/fyclass--------fypage---.html", searchUrl: "/vodsearch/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, class_parse: ".navbar-items li:gt(0):lt(10);a&&Text;a&&href;/(\\d+)", play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: ".tab-list.active;a.module-poster-item.module-item;.module-poster-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href", \u4E00\u7EA7: "body a.module-poster-item.module-item;a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href", \u4E8C\u7EA7: { title: "h1&&Text;.module-info-tag-link:eq(-1)&&Text", img: ".lazyload&&data-original||data-src||src", desc: ".module-info-item:eq(-2)&&Text;.module-info-tag-link&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(1)&&Text", content: ".module-info-introduction&&Text", tabs: ".module-tab-item", lists: ".module-play-list:eq(#id) a", tab_text: "div--small&&Text" }, \u641C\u7D22: "body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text" }, mxone5: { title: "", host: "", url: "/show/fyclass--------fypage---.html", searchUrl: "/search/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, class_parse: ".nav-menu-items&&li;a&&Text;a&&href;.*/(.*?).html", play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: ".module-list;.module-items&&.module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href", \u4E00\u7EA7: ".module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href", \u4E8C\u7EA7: { title: "h1&&Text;.tag-link&&Text", img: ".module-item-pic&&img&&data-src", desc: ".video-info-items:eq(3)&&Text;.tag-link:eq(2)&&Text;.tag-link:eq(1)&&Text;.video-info-items:eq(1)&&Text;.video-info-items:eq(0)&&Text", content: ".vod_content&&Text", tabs: ".module-tab-item", lists: ".module-player-list:eq(#id)&&.scroll-content&&a", tab_text: "div--small&&Text" }, \u641C\u7D22: ".module-items .module-search-item;a&&title;img&&data-src;.video-serial&&Text;a&&href" }, \u9996\u56FE: { title: "", host: "", url: "/vodshow/fyclass--------fypage---/", searchUrl: "/vodsearch/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, class_parse: ".myui-header__menu li.hidden-sm:gt(0):lt(7);a&&Text;a&&href;/(\\d+).html", play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: "ul.myui-vodlist.clearfix;li;a&&title;a&&data-original;.pic-text&&Text;a&&href", \u4E00\u7EA7: ".myui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href", \u4E8C\u7EA7: { title: ".myui-content__detail .title--span&&Text;.myui-content__detail p.data:eq(3)&&Text", img: ".myui-content__thumb .lazyload&&data-original", desc: ".myui-content__detail p.otherbox&&Text;.year&&Text;.myui-content__detail p.data:eq(4)&&Text;.myui-content__detail p.data:eq(2)&&Text;.myui-content__detail p.data:eq(0)&&Text", content: ".content&&Text", tabs: ".myui-panel__head&&li", lists: ".myui-content__list:eq(#id) li" }, \u641C\u7D22: "#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&Text" }, \u9996\u56FE2: { title: "", host: "", url: "/list/fyclass-fypage.html", searchUrl: "/vodsearch/**----------fypage---.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "UC_UA" }, class_parse: ".stui-header__menu li:gt(0):lt(7);a&&Text;a&&href;.*/(.*?).html", play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: "ul.stui-vodlist.clearfix;li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href", \u4E00\u7EA7: ".stui-vodlist li;a&&title;a&&data-original;.pic-text&&Text;a&&href", \u4E8C\u7EA7: { title: ".stui-content__detail .title&&Text;.stui-content__detail&&p:eq(-2)&&a&&Text", title1: ".stui-content__detail .title&&Text;.stui-content__detail&&p&&Text", img: ".stui-content__thumb .lazyload&&data-original", desc: ".stui-content__detail p&&Text;.stui-content__detail&&p:eq(-2)&&a:eq(2)&&Text;.stui-content__detail&&p:eq(-2)&&a:eq(1)&&Text;.stui-content__detail p:eq(2)&&Text;.stui-content__detail p:eq(1)&&Text", desc1: ".stui-content__detail p:eq(4)&&Text;;;.stui-content__detail p:eq(1)&&Text", content: ".detail&&Text", tabs: ".stui-pannel__head h3", tabs1: ".stui-vodlist__head h3", lists: ".stui-content__playlist:eq(#id) li" }, \u641C\u7D22: "ul.stui-vodlist__media,ul.stui-vodlist,#searchList li;a&&title;.lazyload&&data-original;.pic-text&&Text;a&&href;.detail&&Text" }, \u9ED8\u8BA4: { title: "", host: "", url: "", searchUrl: "", searchable: 2, quickSearch: 0, filterable: 0, filter: "", filter_url: "", filter_def: {}, headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "#side-menu li;a&&Text;a&&href;/(.*?).html", cate_exclude: "", play_parse: true, lazy: we, double: true, \u63A8\u8350: "\u5217\u88681;\u5217\u88682;\u6807\u9898;\u56FE\u7247;\u63CF\u8FF0;\u94FE\u63A5;\u8BE6\u60C5", \u4E00\u7EA7: "\u5217\u8868;\u6807\u9898;\u56FE\u7247;\u63CF\u8FF0;\u94FE\u63A5;\u8BE6\u60C5", \u4E8C\u7EA7: { title: "vod_name;vod_type", img: "\u56FE\u7247\u94FE\u63A5", desc: "\u4E3B\u8981\u4FE1\u606F;\u5E74\u4EE3;\u5730\u533A;\u6F14\u5458;\u5BFC\u6F14", content: "\u7B80\u4ECB", tabs: "", lists: "xx:eq(#id)&&a", tab_text: "body&&Text", list_text: "body&&Text", list_url: "a&&href" }, \u641C\u7D22: "\u5217\u8868;\u6807\u9898;\u56FE\u7247;\u63CF\u8FF0;\u94FE\u63A5;\u8BE6\u60C5" }, vfed: { title: "", host: "", url: "/index.php/vod/show/id/fyclass/page/fypage.html", searchUrl: "/index.php/vod/search/page/fypage/wd/**.html", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "UC_UA" }, class_parse: ".fed-pops-navbar&&ul.fed-part-rows&&a;a&&Text;a&&href;.*/(.*?).html", play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: "ul.fed-list-info.fed-part-rows;li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href", \u4E00\u7EA7: ".fed-list-info&&li;a.fed-list-title&&Text;a&&data-original;.fed-list-remarks&&Text;a&&href", \u4E8C\u7EA7: { title: "h1.fed-part-eone&&Text;.fed-deta-content&&.fed-part-rows&&li&&Text", img: ".fed-list-info&&a&&data-original", desc: ".fed-deta-content&&.fed-part-rows&&li:eq(1)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(2)&&Text;.fed-deta-content&&.fed-part-rows&&li:eq(3)&&Text", content: ".fed-part-esan&&Text", tabs: ".fed-drop-boxs&&.fed-part-rows&&li", lists: ".fed-play-item:eq(#id)&&ul:eq(1)&&li" }, \u641C\u7D22: ".fed-deta-info;h1&&Text;.lazyload&&data-original;.fed-list-remarks&&Text;a&&href;.fed-deta-content&&Text" }, \u6D77\u87BA3: { title: "", host: "", searchUrl: "/v_search/**----------fypage---.html", url: "/vod_____show/fyclass--------fypage---.html", headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "body&&.hl-nav li:gt(0);a&&Text;a&&href;.*/(.*?).html", cate_exclude: "\u660E\u661F|\u4E13\u9898|\u6700\u65B0|\u6392\u884C", limit: 40, play_parse: true, lazy: F, double: true, \u63A8\u8350: ".hl-vod-list;li;a&&title;a&&data-original;.remarks&&Text;a&&href", \u4E00\u7EA7: ".hl-vod-list&&.hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href", \u4E8C\u7EA7: { title: ".hl-dc-title&&Text;.hl-dc-content&&li:eq(6)&&Text", img: ".hl-lazy&&data-original", desc: ".hl-dc-content&&li:eq(10)&&Text;.hl-dc-content&&li:eq(4)&&Text;.hl-dc-content&&li:eq(5)&&Text;.hl-dc-content&&li:eq(2)&&Text;.hl-dc-content&&li:eq(3)&&Text", content: ".hl-content-text&&Text", tabs: ".hl-tabs&&a", tab_text: "a--span&&Text", lists: ".hl-plays-list:eq(#id)&&li" }, \u641C\u7D22: ".hl-list-item;a&&title;a&&data-original;.remarks&&Text;a&&href", searchable: 2, quickSearch: 0, filterable: 0 }, \u6D77\u87BA2: { title: "", host: "", searchUrl: "/index.php/vod/search/page/fypage/wd/**/", url: "/index.php/vod/show/id/fyclass/page/fypage/", headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "#nav-bar li;a&&Text;a&&href;id/(.*?)/", limit: 40, play_parse: true, lazy: F, double: true, \u63A8\u8350: ".list-a.size;li;a&&title;.lazy&&data-original;.bt&&Text;a&&href", \u4E00\u7EA7: ".list-a&&li;a&&title;.lazy&&data-original;.list-remarks&&Text;a&&href", \u4E8C\u7EA7: { title: "h2&&Text;.deployment&&Text", img: ".lazy&&data-original", desc: ".deployment&&Text", content: ".ec-show&&Text", tabs: "#tag&&a", lists: ".play_list_box:eq(#id)&&li" }, \u641C\u7D22: ".search-list;a&&title;.lazy&&data-original;.deployment&&Text;a&&href", searchable: 2, quickSearch: 0, filterable: 0 }, \u77ED\u89C6: { title: "", host: "", url: "/channel/fyclass-fypage.html", searchUrl: "/search.html?wd=**", searchable: 2, quickSearch: 0, filterable: 0, headers: { "User-Agent": "MOBILE_UA" }, class_parse: ".menu_bottom ul li;a&&Text;a&&href;.*/(.*?).html", cate_exclude: "\u89E3\u6790|\u52A8\u6001", play_parse: true, lazy: F, limit: 6, double: true, \u63A8\u8350: ".indexShowBox;ul&&li;a&&title;img&&data-src;.s1&&Text;a&&href", \u4E00\u7EA7: ".pic-list&&li;a&&title;img&&data-src;.s1&&Text;a&&href", \u4E8C\u7EA7: { title: "h1&&Text;.content-rt&&p:eq(0)&&Text", img: ".img&&img&&data-src", desc: ".content-rt&&p:eq(1)&&Text;.content-rt&&p:eq(2)&&Text;.content-rt&&p:eq(3)&&Text;.content-rt&&p:eq(4)&&Text;.content-rt&&p:eq(5)&&Text", content: ".zkjj_a&&Text", tabs: ".py-tabs&&option", lists: ".player:eq(#id) li" }, \u641C\u7D22: ".sr_lists&&ul&&li;h3&&Text;img&&data-src;.int&&p:eq(0)&&Text;a&&href" }, \u77ED\u89C62: { title: "", host: "", class_name: "\u7535\u5F71&\u7535\u89C6\u5267&\u7EFC\u827A&\u52A8\u6F2B", class_url: "1&2&3&4", searchUrl: "/index.php/ajax/suggest?mid=1&wd=**&limit=50", searchable: 2, quickSearch: 0, headers: { "User-Agent": "MOBILE_UA" }, url: "/index.php/api/vod#type=fyclass&page=fypage", filterable: 0, filter_url: "", filter: {}, filter_def: {}, detailUrl: "/index.php/vod/detail/id/fyid.html", play_parse: true, lazy: F, limit: 6, \u63A8\u8350: ".list-vod.flex .public-list-box;a&&title;.lazy&&data-original;.public-list-prb&&Text;a&&href", \u4E00\u7EA7: 'js:let body=input.split("#")[1];let t=Math.round(new Date/1e3).toString();let key=md5("DS"+t+"DCC147D11943AF75");let url=input.split("#")[0];body=body+"&time="+t+"&key="+key;print(body);fetch_params.body=body;let html=post(url,fetch_params);let data=JSON.parse(html);VODS=data.list.map(function(it){it.vod_pic=urljoin2(input.split("/i")[0],it.vod_pic);return it});', \u4E8C\u7EA7: { title: ".slide-info-title&&Text;.slide-info:eq(2)--strong&&Text", img: ".detail-pic&&data-original", desc: ".slide-info-remarks&&Text;.slide-info-remarks:eq(1)&&Text;.slide-info-remarks:eq(2)&&Text;.slide-info:eq(1)--strong&&Text;.info-parameter&&ul&&li:eq(3)&&Text", content: "#height_limit&&Text", tabs: ".anthology.wow.fadeInUp.animated&&.swiper-wrapper&&a", tab_text: "a--span&&Text", lists: ".anthology-list-box:eq(#id) li" }, \u641C\u7D22: "json:list;name;pic;;id" }, \u91C7\u96C61: { title: "", host: "", homeTid: "13", homeUrl: "/api.php/provide/vod/?ac=detail&t={{rule.homeTid}}", detailUrl: "/api.php/provide/vod/?ac=detail&ids=fyid", searchUrl: "/api.php/provide/vod/?wd=**&pg=fypage", url: "/api.php/provide/vod/?ac=detail&pg=fypage&t=fyclass", headers: { "User-Agent": "MOBILE_UA" }, timeout: 5e3, class_parse: "json:class;", limit: 20, multi: 1, searchable: 2, quickSearch: 1, filterable: 0, play_parse: true, parse_url: "", lazy: Ae, \u63A8\u8350: "*", \u4E00\u7EA7: "json:list;vod_name;vod_pic;vod_remarks;vod_id;vod_play_from", \u4E8C\u7EA7: `js:
            let html=request(input);
            html=JSON.parse(html);
            let data=html.list;
            VOD=data[0];`, \u641C\u7D22: "*" } }));
}
s(ie, "getMubans");
var Xe = ie();
var Ee = ie();
var He = { muban: Ee, getMubans: ie };
var ve = '(function(root,factory){if(typeof exports==="object"){module.exports=exports=factory()}else if(typeof define==="function"&&define.amd){define([],factory)}else{globalThis.CryptoJS=factory()}})(this,function(){var CryptoJS=CryptoJS||function(Math,undefined){var crypto;if(typeof window!=="undefined"&&window.crypto){crypto=window.crypto}if(typeof self!=="undefined"&&self.crypto){crypto=self.crypto}if(typeof globalThis!=="undefined"&&globalThis.crypto){crypto=globalThis.crypto}if(!crypto&&typeof window!=="undefined"&&window.msCrypto){crypto=window.msCrypto}if(!crypto&&typeof global!=="undefined"&&global.crypto){crypto=global.crypto}if(!crypto&&typeof require==="function"){try{crypto=require("crypto")}catch(err){}}var cryptoSecureRandomInt=function(){if(crypto){if(typeof crypto.getRandomValues==="function"){try{return crypto.getRandomValues(new Uint32Array(1))[0]}catch(err){}}if(typeof crypto.randomBytes==="function"){try{return crypto.randomBytes(4).readInt32LE()}catch(err){}}}throw new Error("Native crypto module could not be used to get secure random number.")};var create=Object.create||function(){function F(){}return function(obj){var subtype;F.prototype=obj;subtype=new F;F.prototype=null;return subtype}}();var C={};var C_lib=C.lib={};var Base=C_lib.Base=function(){return{extend:function(overrides){var subtype=create(this);if(overrides){subtype.mixIn(overrides)}if(!subtype.hasOwnProperty("init")||this.init===subtype.init){subtype.init=function(){subtype.$super.init.apply(this,arguments)}}subtype.init.prototype=subtype;subtype.$super=this;return subtype},create:function(){var instance=this.extend();instance.init.apply(instance,arguments);return instance},init:function(){},mixIn:function(properties){for(var propertyName in properties){if(properties.hasOwnProperty(propertyName)){this[propertyName]=properties[propertyName]}}if(properties.hasOwnProperty("toString")){this.toString=properties.toString}},clone:function(){return this.init.prototype.extend(this)}}}();var WordArray=C_lib.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes}else{this.sigBytes=words.length*4}},toString:function(encoder){return(encoder||Hex).stringify(this)},concat:function(wordArray){var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;this.clamp();if(thisSigBytes%4){for(var i=0;i<thatSigBytes;i++){var thatByte=thatWords[i>>>2]>>>24-i%4*8&255;thisWords[thisSigBytes+i>>>2]|=thatByte<<24-(thisSigBytes+i)%4*8}}else{for(var j=0;j<thatSigBytes;j+=4){thisWords[thisSigBytes+j>>>2]=thatWords[j>>>2]}}this.sigBytes+=thatSigBytes;return this},clamp:function(){var words=this.words;var sigBytes=this.sigBytes;words[sigBytes>>>2]&=4294967295<<32-sigBytes%4*8;words.length=Math.ceil(sigBytes/4)},clone:function(){var clone=Base.clone.call(this);clone.words=this.words.slice(0);return clone},random:function(nBytes){var words=[];for(var i=0;i<nBytes;i+=4){words.push(cryptoSecureRandomInt())}return new WordArray.init(words,nBytes)}});var C_enc=C.enc={};var Hex=C_enc.Hex={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var hexChars=[];for(var i=0;i<sigBytes;i++){var bite=words[i>>>2]>>>24-i%4*8&255;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&15).toString(16))}return hexChars.join("")},parse:function(hexStr){var hexStrLength=hexStr.length;var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<24-i%8*4}return new WordArray.init(words,hexStrLength/2)}};var Latin1=C_enc.Latin1={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var latin1Chars=[];for(var i=0;i<sigBytes;i++){var bite=words[i>>>2]>>>24-i%4*8&255;latin1Chars.push(String.fromCharCode(bite))}return latin1Chars.join("")},parse:function(latin1Str){var latin1StrLength=latin1Str.length;var words=[];for(var i=0;i<latin1StrLength;i++){words[i>>>2]|=(latin1Str.charCodeAt(i)&255)<<24-i%4*8}return new WordArray.init(words,latin1StrLength)}};var Utf8=C_enc.Utf8={stringify:function(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)))}};var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm=Base.extend({reset:function(){this._data=new WordArray.init;this._nDataBytes=0},_append:function(data){if(typeof data=="string"){data=Utf8.parse(data)}this._data.concat(data);this._nDataBytes+=data.sigBytes},_process:function(doFlush){var processedWords;var data=this._data;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSize=this.blockSize;var blockSizeBytes=blockSize*4;var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){nBlocksReady=Math.ceil(nBlocksReady)}else{nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0)}var nWordsReady=nBlocksReady*blockSize;var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){this._doProcessBlock(dataWords,offset)}processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady}return new WordArray.init(processedWords,nBytesReady)},clone:function(){var clone=Base.clone.call(this);clone._data=this._data.clone();return clone},_minBufferSize:0});var Hasher=C_lib.Hasher=BufferedBlockAlgorithm.extend({cfg:Base.extend(),init:function(cfg){this.cfg=this.cfg.extend(cfg);this.reset()},reset:function(){BufferedBlockAlgorithm.reset.call(this);this._doReset()},update:function(messageUpdate){this._append(messageUpdate);this._process();return this},finalize:function(messageUpdate){if(messageUpdate){this._append(messageUpdate)}var hash=this._doFinalize();return hash},blockSize:512/32,_createHelper:function(hasher){return function(message,cfg){return new hasher.init(cfg).finalize(message)}},_createHmacHelper:function(hasher){return function(message,key){return new C_algo.HMAC.init(hasher,key).finalize(message)}}});var C_algo=C.algo={};return C}(Math);(function(undefined){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var X32WordArray=C_lib.WordArray;var C_x64=C.x64={};var X64Word=C_x64.Word=Base.extend({init:function(high,low){this.high=high;this.low=low}});var X64WordArray=C_x64.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes}else{this.sigBytes=words.length*8}},toX32:function(){var x64Words=this.words;var x64WordsLength=x64Words.length;var x32Words=[];for(var i=0;i<x64WordsLength;i++){var x64Word=x64Words[i];x32Words.push(x64Word.high);x32Words.push(x64Word.low)}return X32WordArray.create(x32Words,this.sigBytes)},clone:function(){var clone=Base.clone.call(this);var words=clone.words=this.words.slice(0);var wordsLength=words.length;for(var i=0;i<wordsLength;i++){words[i]=words[i].clone()}return clone}})})();(function(){if(typeof ArrayBuffer!="function"){return}var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var superInit=WordArray.init;var subInit=WordArray.init=function(typedArray){if(typedArray instanceof ArrayBuffer){typedArray=new Uint8Array(typedArray)}if(typedArray instanceof Int8Array||typeof Uint8ClampedArray!=="undefined"&&typedArray instanceof Uint8ClampedArray||typedArray instanceof Int16Array||typedArray instanceof Uint16Array||typedArray instanceof Int32Array||typedArray instanceof Uint32Array||typedArray instanceof Float32Array||typedArray instanceof Float64Array){typedArray=new Uint8Array(typedArray.buffer,typedArray.byteOffset,typedArray.byteLength)}if(typedArray instanceof Uint8Array){var typedArrayByteLength=typedArray.byteLength;var words=[];for(var i=0;i<typedArrayByteLength;i++){words[i>>>2]|=typedArray[i]<<24-i%4*8}superInit.call(this,words,typedArrayByteLength)}else{superInit.apply(this,arguments)}};subInit.prototype=WordArray})();(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_enc=C.enc;var Utf16BE=C_enc.Utf16=C_enc.Utf16BE={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var utf16Chars=[];for(var i=0;i<sigBytes;i+=2){var codePoint=words[i>>>2]>>>16-i%4*8&65535;utf16Chars.push(String.fromCharCode(codePoint))}return utf16Chars.join("")},parse:function(utf16Str){var utf16StrLength=utf16Str.length;var words=[];for(var i=0;i<utf16StrLength;i++){words[i>>>1]|=utf16Str.charCodeAt(i)<<16-i%2*16}return WordArray.create(words,utf16StrLength*2)}};C_enc.Utf16LE={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var utf16Chars=[];for(var i=0;i<sigBytes;i+=2){var codePoint=swapEndian(words[i>>>2]>>>16-i%4*8&65535);utf16Chars.push(String.fromCharCode(codePoint))}return utf16Chars.join("")},parse:function(utf16Str){var utf16StrLength=utf16Str.length;var words=[];for(var i=0;i<utf16StrLength;i++){words[i>>>1]|=swapEndian(utf16Str.charCodeAt(i)<<16-i%2*16)}return WordArray.create(words,utf16StrLength*2)}};function swapEndian(word){return word<<8&4278255360|word>>>8&16711935}})();(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_enc=C.enc;var Base64=C_enc.Base64={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var map=this._map;wordArray.clamp();var base64Chars=[];for(var i=0;i<sigBytes;i+=3){var byte1=words[i>>>2]>>>24-i%4*8&255;var byte2=words[i+1>>>2]>>>24-(i+1)%4*8&255;var byte3=words[i+2>>>2]>>>24-(i+2)%4*8&255;var triplet=byte1<<16|byte2<<8|byte3;for(var j=0;j<4&&i+j*.75<sigBytes;j++){base64Chars.push(map.charAt(triplet>>>6*(3-j)&63))}}var paddingChar=map.charAt(64);if(paddingChar){while(base64Chars.length%4){base64Chars.push(paddingChar)}}return base64Chars.join("")},parse:function(base64Str){var base64StrLength=base64Str.length;var map=this._map;var reverseMap=this._reverseMap;if(!reverseMap){reverseMap=this._reverseMap=[];for(var j=0;j<map.length;j++){reverseMap[map.charCodeAt(j)]=j}}var paddingChar=map.charAt(64);if(paddingChar){var paddingIndex=base64Str.indexOf(paddingChar);if(paddingIndex!==-1){base64StrLength=paddingIndex}}return parseLoop(base64Str,base64StrLength,reverseMap)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="};function parseLoop(base64Str,base64StrLength,reverseMap){var words=[];var nBytes=0;for(var i=0;i<base64StrLength;i++){if(i%4){var bits1=reverseMap[base64Str.charCodeAt(i-1)]<<i%4*2;var bits2=reverseMap[base64Str.charCodeAt(i)]>>>6-i%4*2;var bitsCombined=bits1|bits2;words[nBytes>>>2]|=bitsCombined<<24-nBytes%4*8;nBytes++}}return WordArray.create(words,nBytes)}})();(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_enc=C.enc;var Base64url=C_enc.Base64url={stringify:function(wordArray,urlSafe=true){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var map=urlSafe?this._safe_map:this._map;wordArray.clamp();var base64Chars=[];for(var i=0;i<sigBytes;i+=3){var byte1=words[i>>>2]>>>24-i%4*8&255;var byte2=words[i+1>>>2]>>>24-(i+1)%4*8&255;var byte3=words[i+2>>>2]>>>24-(i+2)%4*8&255;var triplet=byte1<<16|byte2<<8|byte3;for(var j=0;j<4&&i+j*.75<sigBytes;j++){base64Chars.push(map.charAt(triplet>>>6*(3-j)&63))}}var paddingChar=map.charAt(64);if(paddingChar){while(base64Chars.length%4){base64Chars.push(paddingChar)}}return base64Chars.join("")},parse:function(base64Str,urlSafe=true){var base64StrLength=base64Str.length;var map=urlSafe?this._safe_map:this._map;var reverseMap=this._reverseMap;if(!reverseMap){reverseMap=this._reverseMap=[];for(var j=0;j<map.length;j++){reverseMap[map.charCodeAt(j)]=j}}var paddingChar=map.charAt(64);if(paddingChar){var paddingIndex=base64Str.indexOf(paddingChar);if(paddingIndex!==-1){base64StrLength=paddingIndex}}return parseLoop(base64Str,base64StrLength,reverseMap)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",_safe_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"};function parseLoop(base64Str,base64StrLength,reverseMap){var words=[];var nBytes=0;for(var i=0;i<base64StrLength;i++){if(i%4){var bits1=reverseMap[base64Str.charCodeAt(i-1)]<<i%4*2;var bits2=reverseMap[base64Str.charCodeAt(i)]>>>6-i%4*2;var bitsCombined=bits1|bits2;words[nBytes>>>2]|=bitsCombined<<24-nBytes%4*8;nBytes++}}return WordArray.create(words,nBytes)}})();(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var T=[];(function(){for(var i=0;i<64;i++){T[i]=Math.abs(Math.sin(i+1))*4294967296|0}})();var MD5=C_algo.MD5=Hasher.extend({_doReset:function(){this._hash=new WordArray.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(M,offset){for(var i=0;i<16;i++){var offset_i=offset+i;var M_offset_i=M[offset_i];M[offset_i]=(M_offset_i<<8|M_offset_i>>>24)&16711935|(M_offset_i<<24|M_offset_i>>>8)&4278255360}var H=this._hash.words;var M_offset_0=M[offset+0];var M_offset_1=M[offset+1];var M_offset_2=M[offset+2];var M_offset_3=M[offset+3];var M_offset_4=M[offset+4];var M_offset_5=M[offset+5];var M_offset_6=M[offset+6];var M_offset_7=M[offset+7];var M_offset_8=M[offset+8];var M_offset_9=M[offset+9];var M_offset_10=M[offset+10];var M_offset_11=M[offset+11];var M_offset_12=M[offset+12];var M_offset_13=M[offset+13];var M_offset_14=M[offset+14];var M_offset_15=M[offset+15];var a=H[0];var b=H[1];var c=H[2];var d=H[3];a=FF(a,b,c,d,M_offset_0,7,T[0]);d=FF(d,a,b,c,M_offset_1,12,T[1]);c=FF(c,d,a,b,M_offset_2,17,T[2]);b=FF(b,c,d,a,M_offset_3,22,T[3]);a=FF(a,b,c,d,M_offset_4,7,T[4]);d=FF(d,a,b,c,M_offset_5,12,T[5]);c=FF(c,d,a,b,M_offset_6,17,T[6]);b=FF(b,c,d,a,M_offset_7,22,T[7]);a=FF(a,b,c,d,M_offset_8,7,T[8]);d=FF(d,a,b,c,M_offset_9,12,T[9]);c=FF(c,d,a,b,M_offset_10,17,T[10]);b=FF(b,c,d,a,M_offset_11,22,T[11]);a=FF(a,b,c,d,M_offset_12,7,T[12]);d=FF(d,a,b,c,M_offset_13,12,T[13]);c=FF(c,d,a,b,M_offset_14,17,T[14]);b=FF(b,c,d,a,M_offset_15,22,T[15]);a=GG(a,b,c,d,M_offset_1,5,T[16]);d=GG(d,a,b,c,M_offset_6,9,T[17]);c=GG(c,d,a,b,M_offset_11,14,T[18]);b=GG(b,c,d,a,M_offset_0,20,T[19]);a=GG(a,b,c,d,M_offset_5,5,T[20]);d=GG(d,a,b,c,M_offset_10,9,T[21]);c=GG(c,d,a,b,M_offset_15,14,T[22]);b=GG(b,c,d,a,M_offset_4,20,T[23]);a=GG(a,b,c,d,M_offset_9,5,T[24]);d=GG(d,a,b,c,M_offset_14,9,T[25]);c=GG(c,d,a,b,M_offset_3,14,T[26]);b=GG(b,c,d,a,M_offset_8,20,T[27]);a=GG(a,b,c,d,M_offset_13,5,T[28]);d=GG(d,a,b,c,M_offset_2,9,T[29]);c=GG(c,d,a,b,M_offset_7,14,T[30]);b=GG(b,c,d,a,M_offset_12,20,T[31]);a=HH(a,b,c,d,M_offset_5,4,T[32]);d=HH(d,a,b,c,M_offset_8,11,T[33]);c=HH(c,d,a,b,M_offset_11,16,T[34]);b=HH(b,c,d,a,M_offset_14,23,T[35]);a=HH(a,b,c,d,M_offset_1,4,T[36]);d=HH(d,a,b,c,M_offset_4,11,T[37]);c=HH(c,d,a,b,M_offset_7,16,T[38]);b=HH(b,c,d,a,M_offset_10,23,T[39]);a=HH(a,b,c,d,M_offset_13,4,T[40]);d=HH(d,a,b,c,M_offset_0,11,T[41]);c=HH(c,d,a,b,M_offset_3,16,T[42]);b=HH(b,c,d,a,M_offset_6,23,T[43]);a=HH(a,b,c,d,M_offset_9,4,T[44]);d=HH(d,a,b,c,M_offset_12,11,T[45]);c=HH(c,d,a,b,M_offset_15,16,T[46]);b=HH(b,c,d,a,M_offset_2,23,T[47]);a=II(a,b,c,d,M_offset_0,6,T[48]);d=II(d,a,b,c,M_offset_7,10,T[49]);c=II(c,d,a,b,M_offset_14,15,T[50]);b=II(b,c,d,a,M_offset_5,21,T[51]);a=II(a,b,c,d,M_offset_12,6,T[52]);d=II(d,a,b,c,M_offset_3,10,T[53]);c=II(c,d,a,b,M_offset_10,15,T[54]);b=II(b,c,d,a,M_offset_1,21,T[55]);a=II(a,b,c,d,M_offset_8,6,T[56]);d=II(d,a,b,c,M_offset_15,10,T[57]);c=II(c,d,a,b,M_offset_6,15,T[58]);b=II(b,c,d,a,M_offset_13,21,T[59]);a=II(a,b,c,d,M_offset_4,6,T[60]);d=II(d,a,b,c,M_offset_11,10,T[61]);c=II(c,d,a,b,M_offset_2,15,T[62]);b=II(b,c,d,a,M_offset_9,21,T[63]);H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=128<<24-nBitsLeft%32;var nBitsTotalH=Math.floor(nBitsTotal/4294967296);var nBitsTotalL=nBitsTotal;dataWords[(nBitsLeft+64>>>9<<4)+15]=(nBitsTotalH<<8|nBitsTotalH>>>24)&16711935|(nBitsTotalH<<24|nBitsTotalH>>>8)&4278255360;dataWords[(nBitsLeft+64>>>9<<4)+14]=(nBitsTotalL<<8|nBitsTotalL>>>24)&16711935|(nBitsTotalL<<24|nBitsTotalL>>>8)&4278255360;data.sigBytes=(dataWords.length+1)*4;this._process();var hash=this._hash;var H=hash.words;for(var i=0;i<4;i++){var H_i=H[i];H[i]=(H_i<<8|H_i>>>24)&16711935|(H_i<<24|H_i>>>8)&4278255360}return hash},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone}});function FF(a,b,c,d,x,s,t){var n=a+(b&c|~b&d)+x+t;return(n<<s|n>>>32-s)+b}function GG(a,b,c,d,x,s,t){var n=a+(b&d|c&~d)+x+t;return(n<<s|n>>>32-s)+b}function HH(a,b,c,d,x,s,t){var n=a+(b^c^d)+x+t;return(n<<s|n>>>32-s)+b}function II(a,b,c,d,x,s,t){var n=a+(c^(b|~d))+x+t;return(n<<s|n>>>32-s)+b}C.MD5=Hasher._createHelper(MD5);C.HmacMD5=Hasher._createHmacHelper(MD5)})(Math);(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var W=[];var SHA1=C_algo.SHA1=Hasher.extend({_doReset:function(){this._hash=new WordArray.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(M,offset){var H=this._hash.words;var a=H[0];var b=H[1];var c=H[2];var d=H[3];var e=H[4];for(var i=0;i<80;i++){if(i<16){W[i]=M[offset+i]|0}else{var n=W[i-3]^W[i-8]^W[i-14]^W[i-16];W[i]=n<<1|n>>>31}var t=(a<<5|a>>>27)+e+W[i];if(i<20){t+=(b&c|~b&d)+1518500249}else if(i<40){t+=(b^c^d)+1859775393}else if(i<60){t+=(b&c|b&d|c&d)-1894007588}else{t+=(b^c^d)-899497514}e=d;d=c;c=b<<30|b>>>2;b=a;a=t}H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;H[4]=H[4]+e|0},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=128<<24-nBitsLeft%32;dataWords[(nBitsLeft+64>>>9<<4)+14]=Math.floor(nBitsTotal/4294967296);dataWords[(nBitsLeft+64>>>9<<4)+15]=nBitsTotal;data.sigBytes=dataWords.length*4;this._process();return this._hash},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone}});C.SHA1=Hasher._createHelper(SHA1);C.HmacSHA1=Hasher._createHmacHelper(SHA1)})();(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var H=[];var K=[];(function(){function isPrime(n){var sqrtN=Math.sqrt(n);for(var factor=2;factor<=sqrtN;factor++){if(!(n%factor)){return false}}return true}function getFractionalBits(n){return(n-(n|0))*4294967296|0}var n=2;var nPrime=0;while(nPrime<64){if(isPrime(n)){if(nPrime<8){H[nPrime]=getFractionalBits(Math.pow(n,1/2))}K[nPrime]=getFractionalBits(Math.pow(n,1/3));nPrime++}n++}})();var W=[];var SHA256=C_algo.SHA256=Hasher.extend({_doReset:function(){this._hash=new WordArray.init(H.slice(0))},_doProcessBlock:function(M,offset){var H=this._hash.words;var a=H[0];var b=H[1];var c=H[2];var d=H[3];var e=H[4];var f=H[5];var g=H[6];var h=H[7];for(var i=0;i<64;i++){if(i<16){W[i]=M[offset+i]|0}else{var gamma0x=W[i-15];var gamma0=(gamma0x<<25|gamma0x>>>7)^(gamma0x<<14|gamma0x>>>18)^gamma0x>>>3;var gamma1x=W[i-2];var gamma1=(gamma1x<<15|gamma1x>>>17)^(gamma1x<<13|gamma1x>>>19)^gamma1x>>>10;W[i]=gamma0+W[i-7]+gamma1+W[i-16]}var ch=e&f^~e&g;var maj=a&b^a&c^b&c;var sigma0=(a<<30|a>>>2)^(a<<19|a>>>13)^(a<<10|a>>>22);var sigma1=(e<<26|e>>>6)^(e<<21|e>>>11)^(e<<7|e>>>25);var t1=h+sigma1+ch+K[i]+W[i];var t2=sigma0+maj;h=g;g=f;f=e;e=d+t1|0;d=c;c=b;b=a;a=t1+t2|0}H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;H[4]=H[4]+e|0;H[5]=H[5]+f|0;H[6]=H[6]+g|0;H[7]=H[7]+h|0},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=128<<24-nBitsLeft%32;dataWords[(nBitsLeft+64>>>9<<4)+14]=Math.floor(nBitsTotal/4294967296);dataWords[(nBitsLeft+64>>>9<<4)+15]=nBitsTotal;data.sigBytes=dataWords.length*4;this._process();return this._hash},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone}});C.SHA256=Hasher._createHelper(SHA256);C.HmacSHA256=Hasher._createHmacHelper(SHA256)})(Math);(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_algo=C.algo;var SHA256=C_algo.SHA256;var SHA224=C_algo.SHA224=SHA256.extend({_doReset:function(){this._hash=new WordArray.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var hash=SHA256._doFinalize.call(this);hash.sigBytes-=4;return hash}});C.SHA224=SHA256._createHelper(SHA224);C.HmacSHA224=SHA256._createHmacHelper(SHA224)})();(function(){var C=CryptoJS;var C_lib=C.lib;var Hasher=C_lib.Hasher;var C_x64=C.x64;var X64Word=C_x64.Word;var X64WordArray=C_x64.WordArray;var C_algo=C.algo;function X64Word_create(){return X64Word.create.apply(X64Word,arguments)}var K=[X64Word_create(1116352408,3609767458),X64Word_create(1899447441,602891725),X64Word_create(3049323471,3964484399),X64Word_create(3921009573,2173295548),X64Word_create(961987163,4081628472),X64Word_create(1508970993,3053834265),X64Word_create(2453635748,2937671579),X64Word_create(2870763221,3664609560),X64Word_create(3624381080,2734883394),X64Word_create(310598401,1164996542),X64Word_create(607225278,1323610764),X64Word_create(1426881987,3590304994),X64Word_create(1925078388,4068182383),X64Word_create(2162078206,991336113),X64Word_create(2614888103,633803317),X64Word_create(3248222580,3479774868),X64Word_create(3835390401,2666613458),X64Word_create(4022224774,944711139),X64Word_create(264347078,2341262773),X64Word_create(604807628,2007800933),X64Word_create(770255983,1495990901),X64Word_create(1249150122,1856431235),X64Word_create(1555081692,3175218132),X64Word_create(1996064986,2198950837),X64Word_create(2554220882,3999719339),X64Word_create(2821834349,766784016),X64Word_create(2952996808,2566594879),X64Word_create(3210313671,3203337956),X64Word_create(3336571891,1034457026),X64Word_create(3584528711,2466948901),X64Word_create(113926993,3758326383),X64Word_create(338241895,168717936),X64Word_create(666307205,1188179964),X64Word_create(773529912,1546045734),X64Word_create(1294757372,1522805485),X64Word_create(1396182291,2643833823),X64Word_create(1695183700,2343527390),X64Word_create(1986661051,1014477480),X64Word_create(2177026350,1206759142),X64Word_create(2456956037,344077627),X64Word_create(2730485921,1290863460),X64Word_create(2820302411,3158454273),X64Word_create(3259730800,3505952657),X64Word_create(3345764771,106217008),X64Word_create(3516065817,3606008344),X64Word_create(3600352804,1432725776),X64Word_create(4094571909,1467031594),X64Word_create(275423344,851169720),X64Word_create(430227734,3100823752),X64Word_create(506948616,1363258195),X64Word_create(659060556,3750685593),X64Word_create(883997877,3785050280),X64Word_create(958139571,3318307427),X64Word_create(1322822218,3812723403),X64Word_create(1537002063,2003034995),X64Word_create(1747873779,3602036899),X64Word_create(1955562222,1575990012),X64Word_create(2024104815,1125592928),X64Word_create(2227730452,2716904306),X64Word_create(2361852424,442776044),X64Word_create(2428436474,593698344),X64Word_create(2756734187,3733110249),X64Word_create(3204031479,2999351573),X64Word_create(3329325298,3815920427),X64Word_create(3391569614,3928383900),X64Word_create(3515267271,566280711),X64Word_create(3940187606,3454069534),X64Word_create(4118630271,4000239992),X64Word_create(116418474,1914138554),X64Word_create(174292421,2731055270),X64Word_create(289380356,3203993006),X64Word_create(460393269,320620315),X64Word_create(685471733,587496836),X64Word_create(852142971,1086792851),X64Word_create(1017036298,365543100),X64Word_create(1126000580,2618297676),X64Word_create(1288033470,3409855158),X64Word_create(1501505948,4234509866),X64Word_create(1607167915,987167468),X64Word_create(1816402316,1246189591)];var W=[];(function(){for(var i=0;i<80;i++){W[i]=X64Word_create()}})();var SHA512=C_algo.SHA512=Hasher.extend({_doReset:function(){this._hash=new X64WordArray.init([new X64Word.init(1779033703,4089235720),new X64Word.init(3144134277,2227873595),new X64Word.init(1013904242,4271175723),new X64Word.init(2773480762,1595750129),new X64Word.init(1359893119,2917565137),new X64Word.init(2600822924,725511199),new X64Word.init(528734635,4215389547),new X64Word.init(1541459225,327033209)])},_doProcessBlock:function(M,offset){var H=this._hash.words;var H0=H[0];var H1=H[1];var H2=H[2];var H3=H[3];var H4=H[4];var H5=H[5];var H6=H[6];var H7=H[7];var H0h=H0.high;var H0l=H0.low;var H1h=H1.high;var H1l=H1.low;var H2h=H2.high;var H2l=H2.low;var H3h=H3.high;var H3l=H3.low;var H4h=H4.high;var H4l=H4.low;var H5h=H5.high;var H5l=H5.low;var H6h=H6.high;var H6l=H6.low;var H7h=H7.high;var H7l=H7.low;var ah=H0h;var al=H0l;var bh=H1h;var bl=H1l;var ch=H2h;var cl=H2l;var dh=H3h;var dl=H3l;var eh=H4h;var el=H4l;var fh=H5h;var fl=H5l;var gh=H6h;var gl=H6l;var hh=H7h;var hl=H7l;for(var i=0;i<80;i++){var Wil;var Wih;var Wi=W[i];if(i<16){Wih=Wi.high=M[offset+i*2]|0;Wil=Wi.low=M[offset+i*2+1]|0}else{var gamma0x=W[i-15];var gamma0xh=gamma0x.high;var gamma0xl=gamma0x.low;var gamma0h=(gamma0xh>>>1|gamma0xl<<31)^(gamma0xh>>>8|gamma0xl<<24)^gamma0xh>>>7;var gamma0l=(gamma0xl>>>1|gamma0xh<<31)^(gamma0xl>>>8|gamma0xh<<24)^(gamma0xl>>>7|gamma0xh<<25);var gamma1x=W[i-2];var gamma1xh=gamma1x.high;var gamma1xl=gamma1x.low;var gamma1h=(gamma1xh>>>19|gamma1xl<<13)^(gamma1xh<<3|gamma1xl>>>29)^gamma1xh>>>6;var gamma1l=(gamma1xl>>>19|gamma1xh<<13)^(gamma1xl<<3|gamma1xh>>>29)^(gamma1xl>>>6|gamma1xh<<26);var Wi7=W[i-7];var Wi7h=Wi7.high;var Wi7l=Wi7.low;var Wi16=W[i-16];var Wi16h=Wi16.high;var Wi16l=Wi16.low;Wil=gamma0l+Wi7l;Wih=gamma0h+Wi7h+(Wil>>>0<gamma0l>>>0?1:0);Wil=Wil+gamma1l;Wih=Wih+gamma1h+(Wil>>>0<gamma1l>>>0?1:0);Wil=Wil+Wi16l;Wih=Wih+Wi16h+(Wil>>>0<Wi16l>>>0?1:0);Wi.high=Wih;Wi.low=Wil}var chh=eh&fh^~eh&gh;var chl=el&fl^~el&gl;var majh=ah&bh^ah&ch^bh&ch;var majl=al&bl^al&cl^bl&cl;var sigma0h=(ah>>>28|al<<4)^(ah<<30|al>>>2)^(ah<<25|al>>>7);var sigma0l=(al>>>28|ah<<4)^(al<<30|ah>>>2)^(al<<25|ah>>>7);var sigma1h=(eh>>>14|el<<18)^(eh>>>18|el<<14)^(eh<<23|el>>>9);var sigma1l=(el>>>14|eh<<18)^(el>>>18|eh<<14)^(el<<23|eh>>>9);var Ki=K[i];var Kih=Ki.high;var Kil=Ki.low;var t1l=hl+sigma1l;var t1h=hh+sigma1h+(t1l>>>0<hl>>>0?1:0);var t1l=t1l+chl;var t1h=t1h+chh+(t1l>>>0<chl>>>0?1:0);var t1l=t1l+Kil;var t1h=t1h+Kih+(t1l>>>0<Kil>>>0?1:0);var t1l=t1l+Wil;var t1h=t1h+Wih+(t1l>>>0<Wil>>>0?1:0);var t2l=sigma0l+majl;var t2h=sigma0h+majh+(t2l>>>0<sigma0l>>>0?1:0);hh=gh;hl=gl;gh=fh;gl=fl;fh=eh;fl=el;el=dl+t1l|0;eh=dh+t1h+(el>>>0<dl>>>0?1:0)|0;dh=ch;dl=cl;ch=bh;cl=bl;bh=ah;bl=al;al=t1l+t2l|0;ah=t1h+t2h+(al>>>0<t1l>>>0?1:0)|0}H0l=H0.low=H0l+al;H0.high=H0h+ah+(H0l>>>0<al>>>0?1:0);H1l=H1.low=H1l+bl;H1.high=H1h+bh+(H1l>>>0<bl>>>0?1:0);H2l=H2.low=H2l+cl;H2.high=H2h+ch+(H2l>>>0<cl>>>0?1:0);H3l=H3.low=H3l+dl;H3.high=H3h+dh+(H3l>>>0<dl>>>0?1:0);H4l=H4.low=H4l+el;H4.high=H4h+eh+(H4l>>>0<el>>>0?1:0);H5l=H5.low=H5l+fl;H5.high=H5h+fh+(H5l>>>0<fl>>>0?1:0);H6l=H6.low=H6l+gl;H6.high=H6h+gh+(H6l>>>0<gl>>>0?1:0);H7l=H7.low=H7l+hl;H7.high=H7h+hh+(H7l>>>0<hl>>>0?1:0)},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=128<<24-nBitsLeft%32;dataWords[(nBitsLeft+128>>>10<<5)+30]=Math.floor(nBitsTotal/4294967296);dataWords[(nBitsLeft+128>>>10<<5)+31]=nBitsTotal;data.sigBytes=dataWords.length*4;this._process();var hash=this._hash.toX32();return hash},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone},blockSize:1024/32});C.SHA512=Hasher._createHelper(SHA512);C.HmacSHA512=Hasher._createHmacHelper(SHA512)})();(function(){var C=CryptoJS;var C_x64=C.x64;var X64Word=C_x64.Word;var X64WordArray=C_x64.WordArray;var C_algo=C.algo;var SHA512=C_algo.SHA512;var SHA384=C_algo.SHA384=SHA512.extend({_doReset:function(){this._hash=new X64WordArray.init([new X64Word.init(3418070365,3238371032),new X64Word.init(1654270250,914150663),new X64Word.init(2438529370,812702999),new X64Word.init(355462360,4144912697),new X64Word.init(1731405415,4290775857),new X64Word.init(2394180231,1750603025),new X64Word.init(3675008525,1694076839),new X64Word.init(1203062813,3204075428)])},_doFinalize:function(){var hash=SHA512._doFinalize.call(this);hash.sigBytes-=16;return hash}});C.SHA384=SHA512._createHelper(SHA384);C.HmacSHA384=SHA512._createHmacHelper(SHA384)})();(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_x64=C.x64;var X64Word=C_x64.Word;var C_algo=C.algo;var RHO_OFFSETS=[];var PI_INDEXES=[];var ROUND_CONSTANTS=[];(function(){var x=1,y=0;for(var t=0;t<24;t++){RHO_OFFSETS[x+5*y]=(t+1)*(t+2)/2%64;var newX=y%5;var newY=(2*x+3*y)%5;x=newX;y=newY}for(var x=0;x<5;x++){for(var y=0;y<5;y++){PI_INDEXES[x+5*y]=y+(2*x+3*y)%5*5}}var LFSR=1;for(var i=0;i<24;i++){var roundConstantMsw=0;var roundConstantLsw=0;for(var j=0;j<7;j++){if(LFSR&1){var bitPosition=(1<<j)-1;if(bitPosition<32){roundConstantLsw^=1<<bitPosition}else{roundConstantMsw^=1<<bitPosition-32}}if(LFSR&128){LFSR=LFSR<<1^113}else{LFSR<<=1}}ROUND_CONSTANTS[i]=X64Word.create(roundConstantMsw,roundConstantLsw)}})();var T=[];(function(){for(var i=0;i<25;i++){T[i]=X64Word.create()}})();var SHA3=C_algo.SHA3=Hasher.extend({cfg:Hasher.cfg.extend({outputLength:512}),_doReset:function(){var state=this._state=[];for(var i=0;i<25;i++){state[i]=new X64Word.init}this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(M,offset){var state=this._state;var nBlockSizeLanes=this.blockSize/2;for(var i=0;i<nBlockSizeLanes;i++){var M2i=M[offset+2*i];var M2i1=M[offset+2*i+1];M2i=(M2i<<8|M2i>>>24)&16711935|(M2i<<24|M2i>>>8)&4278255360;M2i1=(M2i1<<8|M2i1>>>24)&16711935|(M2i1<<24|M2i1>>>8)&4278255360;var lane=state[i];lane.high^=M2i1;lane.low^=M2i}for(var round=0;round<24;round++){for(var x=0;x<5;x++){var tMsw=0,tLsw=0;for(var y=0;y<5;y++){var lane=state[x+5*y];tMsw^=lane.high;tLsw^=lane.low}var Tx=T[x];Tx.high=tMsw;Tx.low=tLsw}for(var x=0;x<5;x++){var Tx4=T[(x+4)%5];var Tx1=T[(x+1)%5];var Tx1Msw=Tx1.high;var Tx1Lsw=Tx1.low;var tMsw=Tx4.high^(Tx1Msw<<1|Tx1Lsw>>>31);var tLsw=Tx4.low^(Tx1Lsw<<1|Tx1Msw>>>31);for(var y=0;y<5;y++){var lane=state[x+5*y];lane.high^=tMsw;lane.low^=tLsw}}for(var laneIndex=1;laneIndex<25;laneIndex++){var tMsw;var tLsw;var lane=state[laneIndex];var laneMsw=lane.high;var laneLsw=lane.low;var rhoOffset=RHO_OFFSETS[laneIndex];if(rhoOffset<32){tMsw=laneMsw<<rhoOffset|laneLsw>>>32-rhoOffset;tLsw=laneLsw<<rhoOffset|laneMsw>>>32-rhoOffset}else{tMsw=laneLsw<<rhoOffset-32|laneMsw>>>64-rhoOffset;tLsw=laneMsw<<rhoOffset-32|laneLsw>>>64-rhoOffset}var TPiLane=T[PI_INDEXES[laneIndex]];TPiLane.high=tMsw;TPiLane.low=tLsw}var T0=T[0];var state0=state[0];T0.high=state0.high;T0.low=state0.low;for(var x=0;x<5;x++){for(var y=0;y<5;y++){var laneIndex=x+5*y;var lane=state[laneIndex];var TLane=T[laneIndex];var Tx1Lane=T[(x+1)%5+5*y];var Tx2Lane=T[(x+2)%5+5*y];lane.high=TLane.high^~Tx1Lane.high&Tx2Lane.high;lane.low=TLane.low^~Tx1Lane.low&Tx2Lane.low}}var lane=state[0];var roundConstant=ROUND_CONSTANTS[round];lane.high^=roundConstant.high;lane.low^=roundConstant.low}},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;var blockSizeBits=this.blockSize*32;dataWords[nBitsLeft>>>5]|=1<<24-nBitsLeft%32;dataWords[(Math.ceil((nBitsLeft+1)/blockSizeBits)*blockSizeBits>>>5)-1]|=128;data.sigBytes=dataWords.length*4;this._process();var state=this._state;var outputLengthBytes=this.cfg.outputLength/8;var outputLengthLanes=outputLengthBytes/8;var hashWords=[];for(var i=0;i<outputLengthLanes;i++){var lane=state[i];var laneMsw=lane.high;var laneLsw=lane.low;laneMsw=(laneMsw<<8|laneMsw>>>24)&16711935|(laneMsw<<24|laneMsw>>>8)&4278255360;laneLsw=(laneLsw<<8|laneLsw>>>24)&16711935|(laneLsw<<24|laneLsw>>>8)&4278255360;hashWords.push(laneLsw);hashWords.push(laneMsw)}return new WordArray.init(hashWords,outputLengthBytes)},clone:function(){var clone=Hasher.clone.call(this);var state=clone._state=this._state.slice(0);for(var i=0;i<25;i++){state[i]=state[i].clone()}return clone}});C.SHA3=Hasher._createHelper(SHA3);C.HmacSHA3=Hasher._createHmacHelper(SHA3)})(Math);(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var _zl=WordArray.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]);var _zr=WordArray.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]);var _sl=WordArray.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]);var _sr=WordArray.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]);var _hl=WordArray.create([0,1518500249,1859775393,2400959708,2840853838]);var _hr=WordArray.create([1352829926,1548603684,1836072691,2053994217,0]);var RIPEMD160=C_algo.RIPEMD160=Hasher.extend({_doReset:function(){this._hash=WordArray.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(M,offset){for(var i=0;i<16;i++){var offset_i=offset+i;var M_offset_i=M[offset_i];M[offset_i]=(M_offset_i<<8|M_offset_i>>>24)&16711935|(M_offset_i<<24|M_offset_i>>>8)&4278255360}var H=this._hash.words;var hl=_hl.words;var hr=_hr.words;var zl=_zl.words;var zr=_zr.words;var sl=_sl.words;var sr=_sr.words;var al,bl,cl,dl,el;var ar,br,cr,dr,er;ar=al=H[0];br=bl=H[1];cr=cl=H[2];dr=dl=H[3];er=el=H[4];var t;for(var i=0;i<80;i+=1){t=al+M[offset+zl[i]]|0;if(i<16){t+=f1(bl,cl,dl)+hl[0]}else if(i<32){t+=f2(bl,cl,dl)+hl[1]}else if(i<48){t+=f3(bl,cl,dl)+hl[2]}else if(i<64){t+=f4(bl,cl,dl)+hl[3]}else{t+=f5(bl,cl,dl)+hl[4]}t=t|0;t=rotl(t,sl[i]);t=t+el|0;al=el;el=dl;dl=rotl(cl,10);cl=bl;bl=t;t=ar+M[offset+zr[i]]|0;if(i<16){t+=f5(br,cr,dr)+hr[0]}else if(i<32){t+=f4(br,cr,dr)+hr[1]}else if(i<48){t+=f3(br,cr,dr)+hr[2]}else if(i<64){t+=f2(br,cr,dr)+hr[3]}else{t+=f1(br,cr,dr)+hr[4]}t=t|0;t=rotl(t,sr[i]);t=t+er|0;ar=er;er=dr;dr=rotl(cr,10);cr=br;br=t}t=H[1]+cl+dr|0;H[1]=H[2]+dl+er|0;H[2]=H[3]+el+ar|0;H[3]=H[4]+al+br|0;H[4]=H[0]+bl+cr|0;H[0]=t},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=128<<24-nBitsLeft%32;dataWords[(nBitsLeft+64>>>9<<4)+14]=(nBitsTotal<<8|nBitsTotal>>>24)&16711935|(nBitsTotal<<24|nBitsTotal>>>8)&4278255360;data.sigBytes=(dataWords.length+1)*4;this._process();var hash=this._hash;var H=hash.words;for(var i=0;i<5;i++){var H_i=H[i];H[i]=(H_i<<8|H_i>>>24)&16711935|(H_i<<24|H_i>>>8)&4278255360}return hash},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone}});function f1(x,y,z){return x^y^z}function f2(x,y,z){return x&y|~x&z}function f3(x,y,z){return(x|~y)^z}function f4(x,y,z){return x&z|y&~z}function f5(x,y,z){return x^(y|~z)}function rotl(x,n){return x<<n|x>>>32-n}C.RIPEMD160=Hasher._createHelper(RIPEMD160);C.HmacRIPEMD160=Hasher._createHmacHelper(RIPEMD160)})(Math);(function(){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var C_enc=C.enc;var Utf8=C_enc.Utf8;var C_algo=C.algo;var HMAC=C_algo.HMAC=Base.extend({init:function(hasher,key){hasher=this._hasher=new hasher.init;if(typeof key=="string"){key=Utf8.parse(key)}var hasherBlockSize=hasher.blockSize;var hasherBlockSizeBytes=hasherBlockSize*4;if(key.sigBytes>hasherBlockSizeBytes){key=hasher.finalize(key)}key.clamp();var oKey=this._oKey=key.clone();var iKey=this._iKey=key.clone();var oKeyWords=oKey.words;var iKeyWords=iKey.words;for(var i=0;i<hasherBlockSize;i++){oKeyWords[i]^=1549556828;iKeyWords[i]^=909522486}oKey.sigBytes=iKey.sigBytes=hasherBlockSizeBytes;this.reset()},reset:function(){var hasher=this._hasher;hasher.reset();hasher.update(this._iKey)},update:function(messageUpdate){this._hasher.update(messageUpdate);return this},finalize:function(messageUpdate){var hasher=this._hasher;var innerHash=hasher.finalize(messageUpdate);hasher.reset();var hmac=hasher.finalize(this._oKey.clone().concat(innerHash));return hmac}})})();(function(){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var C_algo=C.algo;var SHA1=C_algo.SHA1;var HMAC=C_algo.HMAC;var PBKDF2=C_algo.PBKDF2=Base.extend({cfg:Base.extend({keySize:128/32,hasher:SHA1,iterations:1}),init:function(cfg){this.cfg=this.cfg.extend(cfg)},compute:function(password,salt){var cfg=this.cfg;var hmac=HMAC.create(cfg.hasher,password);var derivedKey=WordArray.create();var blockIndex=WordArray.create([1]);var derivedKeyWords=derivedKey.words;var blockIndexWords=blockIndex.words;var keySize=cfg.keySize;var iterations=cfg.iterations;while(derivedKeyWords.length<keySize){var block=hmac.update(salt).finalize(blockIndex);hmac.reset();var blockWords=block.words;var blockWordsLength=blockWords.length;var intermediate=block;for(var i=1;i<iterations;i++){intermediate=hmac.finalize(intermediate);hmac.reset();var intermediateWords=intermediate.words;for(var j=0;j<blockWordsLength;j++){blockWords[j]^=intermediateWords[j]}}derivedKey.concat(block);blockIndexWords[0]++}derivedKey.sigBytes=keySize*4;return derivedKey}});C.PBKDF2=function(password,salt,cfg){return PBKDF2.create(cfg).compute(password,salt)}})();(function(){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var C_algo=C.algo;var MD5=C_algo.MD5;var EvpKDF=C_algo.EvpKDF=Base.extend({cfg:Base.extend({keySize:128/32,hasher:MD5,iterations:1}),init:function(cfg){this.cfg=this.cfg.extend(cfg)},compute:function(password,salt){var block;var cfg=this.cfg;var hasher=cfg.hasher.create();var derivedKey=WordArray.create();var derivedKeyWords=derivedKey.words;var keySize=cfg.keySize;var iterations=cfg.iterations;while(derivedKeyWords.length<keySize){if(block){hasher.update(block)}block=hasher.update(password).finalize(salt);hasher.reset();for(var i=1;i<iterations;i++){block=hasher.finalize(block);hasher.reset()}derivedKey.concat(block)}derivedKey.sigBytes=keySize*4;return derivedKey}});C.EvpKDF=function(password,salt,cfg){return EvpKDF.create(cfg).compute(password,salt)}})();CryptoJS.lib.Cipher||function(undefined){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm;var C_enc=C.enc;var Utf8=C_enc.Utf8;var Base64=C_enc.Base64;var C_algo=C.algo;var EvpKDF=C_algo.EvpKDF;var Cipher=C_lib.Cipher=BufferedBlockAlgorithm.extend({cfg:Base.extend(),createEncryptor:function(key,cfg){return this.create(this._ENC_XFORM_MODE,key,cfg)},createDecryptor:function(key,cfg){return this.create(this._DEC_XFORM_MODE,key,cfg)},init:function(xformMode,key,cfg){this.cfg=this.cfg.extend(cfg);this._xformMode=xformMode;this._key=key;this.reset()},reset:function(){BufferedBlockAlgorithm.reset.call(this);this._doReset()},process:function(dataUpdate){this._append(dataUpdate);return this._process()},finalize:function(dataUpdate){if(dataUpdate){this._append(dataUpdate)}var finalProcessedData=this._doFinalize();return finalProcessedData},keySize:128/32,ivSize:128/32,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function selectCipherStrategy(key){if(typeof key=="string"){return PasswordBasedCipher}else{return SerializableCipher}}return function(cipher){return{encrypt:function(message,key,cfg){return selectCipherStrategy(key).encrypt(cipher,message,key,cfg)},decrypt:function(ciphertext,key,cfg){return selectCipherStrategy(key).decrypt(cipher,ciphertext,key,cfg)}}}}()});var StreamCipher=C_lib.StreamCipher=Cipher.extend({_doFinalize:function(){var finalProcessedBlocks=this._process(!!"flush");return finalProcessedBlocks},blockSize:1});var C_mode=C.mode={};var BlockCipherMode=C_lib.BlockCipherMode=Base.extend({createEncryptor:function(cipher,iv){return this.Encryptor.create(cipher,iv)},createDecryptor:function(cipher,iv){return this.Decryptor.create(cipher,iv)},init:function(cipher,iv){this._cipher=cipher;this._iv=iv}});var CBC=C_mode.CBC=function(){var CBC=BlockCipherMode.extend();CBC.Encryptor=CBC.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;xorBlock.call(this,words,offset,blockSize);cipher.encryptBlock(words,offset);this._prevBlock=words.slice(offset,offset+blockSize)}});CBC.Decryptor=CBC.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var thisBlock=words.slice(offset,offset+blockSize);cipher.decryptBlock(words,offset);xorBlock.call(this,words,offset,blockSize);this._prevBlock=thisBlock}});function xorBlock(words,offset,blockSize){var block;var iv=this._iv;if(iv){block=iv;this._iv=undefined}else{block=this._prevBlock}for(var i=0;i<blockSize;i++){words[offset+i]^=block[i]}}return CBC}();var C_pad=C.pad={};var Pkcs7=C_pad.Pkcs7={pad:function(data,blockSize){var blockSizeBytes=blockSize*4;var nPaddingBytes=blockSizeBytes-data.sigBytes%blockSizeBytes;var paddingWord=nPaddingBytes<<24|nPaddingBytes<<16|nPaddingBytes<<8|nPaddingBytes;var paddingWords=[];for(var i=0;i<nPaddingBytes;i+=4){paddingWords.push(paddingWord)}var padding=WordArray.create(paddingWords,nPaddingBytes);data.concat(padding)},unpad:function(data){var nPaddingBytes=data.words[data.sigBytes-1>>>2]&255;data.sigBytes-=nPaddingBytes}};var BlockCipher=C_lib.BlockCipher=Cipher.extend({cfg:Cipher.cfg.extend({mode:CBC,padding:Pkcs7}),reset:function(){var modeCreator;Cipher.reset.call(this);var cfg=this.cfg;var iv=cfg.iv;var mode=cfg.mode;if(this._xformMode==this._ENC_XFORM_MODE){modeCreator=mode.createEncryptor}else{modeCreator=mode.createDecryptor;this._minBufferSize=1}if(this._mode&&this._mode.__creator==modeCreator){this._mode.init(this,iv&&iv.words)}else{this._mode=modeCreator.call(mode,this,iv&&iv.words);this._mode.__creator=modeCreator}},_doProcessBlock:function(words,offset){this._mode.processBlock(words,offset)},_doFinalize:function(){var finalProcessedBlocks;var padding=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){padding.pad(this._data,this.blockSize);finalProcessedBlocks=this._process(!!"flush")}else{finalProcessedBlocks=this._process(!!"flush");padding.unpad(finalProcessedBlocks)}return finalProcessedBlocks},blockSize:128/32});var CipherParams=C_lib.CipherParams=Base.extend({init:function(cipherParams){this.mixIn(cipherParams)},toString:function(formatter){return(formatter||this.formatter).stringify(this)}});var C_format=C.format={};var OpenSSLFormatter=C_format.OpenSSL={stringify:function(cipherParams){var wordArray;var ciphertext=cipherParams.ciphertext;var salt=cipherParams.salt;if(salt){wordArray=WordArray.create([1398893684,1701076831]).concat(salt).concat(ciphertext)}else{wordArray=ciphertext}return wordArray.toString(Base64)},parse:function(openSSLStr){var salt;var ciphertext=Base64.parse(openSSLStr);var ciphertextWords=ciphertext.words;if(ciphertextWords[0]==1398893684&&ciphertextWords[1]==1701076831){salt=WordArray.create(ciphertextWords.slice(2,4));ciphertextWords.splice(0,4);ciphertext.sigBytes-=16}return CipherParams.create({ciphertext:ciphertext,salt:salt})}};var SerializableCipher=C_lib.SerializableCipher=Base.extend({cfg:Base.extend({format:OpenSSLFormatter}),encrypt:function(cipher,message,key,cfg){cfg=this.cfg.extend(cfg);var encryptor=cipher.createEncryptor(key,cfg);var ciphertext=encryptor.finalize(message);var cipherCfg=encryptor.cfg;return CipherParams.create({ciphertext:ciphertext,key:key,iv:cipherCfg.iv,algorithm:cipher,mode:cipherCfg.mode,padding:cipherCfg.padding,blockSize:cipher.blockSize,formatter:cfg.format})},decrypt:function(cipher,ciphertext,key,cfg){cfg=this.cfg.extend(cfg);ciphertext=this._parse(ciphertext,cfg.format);var plaintext=cipher.createDecryptor(key,cfg).finalize(ciphertext.ciphertext);return plaintext},_parse:function(ciphertext,format){if(typeof ciphertext=="string"){return format.parse(ciphertext,this)}else{return ciphertext}}});var C_kdf=C.kdf={};var OpenSSLKdf=C_kdf.OpenSSL={execute:function(password,keySize,ivSize,salt){if(!salt){salt=WordArray.random(64/8)}var key=EvpKDF.create({keySize:keySize+ivSize}).compute(password,salt);var iv=WordArray.create(key.words.slice(keySize),ivSize*4);key.sigBytes=keySize*4;return CipherParams.create({key:key,iv:iv,salt:salt})}};var PasswordBasedCipher=C_lib.PasswordBasedCipher=SerializableCipher.extend({cfg:SerializableCipher.cfg.extend({kdf:OpenSSLKdf}),encrypt:function(cipher,message,password,cfg){cfg=this.cfg.extend(cfg);var derivedParams=cfg.kdf.execute(password,cipher.keySize,cipher.ivSize);cfg.iv=derivedParams.iv;var ciphertext=SerializableCipher.encrypt.call(this,cipher,message,derivedParams.key,cfg);ciphertext.mixIn(derivedParams);return ciphertext},decrypt:function(cipher,ciphertext,password,cfg){cfg=this.cfg.extend(cfg);ciphertext=this._parse(ciphertext,cfg.format);var derivedParams=cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,ciphertext.salt);cfg.iv=derivedParams.iv;var plaintext=SerializableCipher.decrypt.call(this,cipher,ciphertext,derivedParams.key,cfg);return plaintext}})}();CryptoJS.mode.CFB=function(){var CFB=CryptoJS.lib.BlockCipherMode.extend();CFB.Encryptor=CFB.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;generateKeystreamAndEncrypt.call(this,words,offset,blockSize,cipher);this._prevBlock=words.slice(offset,offset+blockSize)}});CFB.Decryptor=CFB.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var thisBlock=words.slice(offset,offset+blockSize);generateKeystreamAndEncrypt.call(this,words,offset,blockSize,cipher);this._prevBlock=thisBlock}});function generateKeystreamAndEncrypt(words,offset,blockSize,cipher){var keystream;var iv=this._iv;if(iv){keystream=iv.slice(0);this._iv=undefined}else{keystream=this._prevBlock}cipher.encryptBlock(keystream,0);for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i]}}return CFB}();CryptoJS.mode.CTR=function(){var CTR=CryptoJS.lib.BlockCipherMode.extend();var Encryptor=CTR.Encryptor=CTR.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var iv=this._iv;var counter=this._counter;if(iv){counter=this._counter=iv.slice(0);this._iv=undefined}var keystream=counter.slice(0);cipher.encryptBlock(keystream,0);counter[blockSize-1]=counter[blockSize-1]+1|0;for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i]}}});CTR.Decryptor=Encryptor;return CTR}();CryptoJS.mode.CTRGladman=function(){var CTRGladman=CryptoJS.lib.BlockCipherMode.extend();function incWord(word){if((word>>24&255)===255){var b1=word>>16&255;var b2=word>>8&255;var b3=word&255;if(b1===255){b1=0;if(b2===255){b2=0;if(b3===255){b3=0}else{++b3}}else{++b2}}else{++b1}word=0;word+=b1<<16;word+=b2<<8;word+=b3}else{word+=1<<24}return word}function incCounter(counter){if((counter[0]=incWord(counter[0]))===0){counter[1]=incWord(counter[1])}return counter}var Encryptor=CTRGladman.Encryptor=CTRGladman.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var iv=this._iv;var counter=this._counter;if(iv){counter=this._counter=iv.slice(0);this._iv=undefined}incCounter(counter);var keystream=counter.slice(0);cipher.encryptBlock(keystream,0);for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i]}}});CTRGladman.Decryptor=Encryptor;return CTRGladman}();CryptoJS.mode.OFB=function(){var OFB=CryptoJS.lib.BlockCipherMode.extend();var Encryptor=OFB.Encryptor=OFB.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var iv=this._iv;var keystream=this._keystream;if(iv){keystream=this._keystream=iv.slice(0);this._iv=undefined}cipher.encryptBlock(keystream,0);for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i]}}});OFB.Decryptor=Encryptor;return OFB}();CryptoJS.mode.ECB=function(){var ECB=CryptoJS.lib.BlockCipherMode.extend();ECB.Encryptor=ECB.extend({processBlock:function(words,offset){this._cipher.encryptBlock(words,offset)}});ECB.Decryptor=ECB.extend({processBlock:function(words,offset){this._cipher.decryptBlock(words,offset)}});return ECB}();CryptoJS.pad.AnsiX923={pad:function(data,blockSize){var dataSigBytes=data.sigBytes;var blockSizeBytes=blockSize*4;var nPaddingBytes=blockSizeBytes-dataSigBytes%blockSizeBytes;var lastBytePos=dataSigBytes+nPaddingBytes-1;data.clamp();data.words[lastBytePos>>>2]|=nPaddingBytes<<24-lastBytePos%4*8;data.sigBytes+=nPaddingBytes},unpad:function(data){var nPaddingBytes=data.words[data.sigBytes-1>>>2]&255;data.sigBytes-=nPaddingBytes}};CryptoJS.pad.Iso10126={pad:function(data,blockSize){var blockSizeBytes=blockSize*4;var nPaddingBytes=blockSizeBytes-data.sigBytes%blockSizeBytes;data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes-1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes<<24],1))},unpad:function(data){var nPaddingBytes=data.words[data.sigBytes-1>>>2]&255;data.sigBytes-=nPaddingBytes}};CryptoJS.pad.Iso97971={pad:function(data,blockSize){data.concat(CryptoJS.lib.WordArray.create([2147483648],1));CryptoJS.pad.ZeroPadding.pad(data,blockSize)},unpad:function(data){CryptoJS.pad.ZeroPadding.unpad(data);data.sigBytes--}};CryptoJS.pad.ZeroPadding={pad:function(data,blockSize){var blockSizeBytes=blockSize*4;data.clamp();data.sigBytes+=blockSizeBytes-(data.sigBytes%blockSizeBytes||blockSizeBytes)},unpad:function(data){var dataWords=data.words;var i=data.sigBytes-1;for(var i=data.sigBytes-1;i>=0;i--){if(dataWords[i>>>2]>>>24-i%4*8&255){data.sigBytes=i+1;break}}}};CryptoJS.pad.NoPadding={pad:function(){},unpad:function(){}};(function(undefined){var C=CryptoJS;var C_lib=C.lib;var CipherParams=C_lib.CipherParams;var C_enc=C.enc;var Hex=C_enc.Hex;var C_format=C.format;var HexFormatter=C_format.Hex={stringify:function(cipherParams){return cipherParams.ciphertext.toString(Hex)},parse:function(input){var ciphertext=Hex.parse(input);return CipherParams.create({ciphertext:ciphertext})}}})();(function(){var C=CryptoJS;var C_lib=C.lib;var BlockCipher=C_lib.BlockCipher;var C_algo=C.algo;var SBOX=[];var INV_SBOX=[];var SUB_MIX_0=[];var SUB_MIX_1=[];var SUB_MIX_2=[];var SUB_MIX_3=[];var INV_SUB_MIX_0=[];var INV_SUB_MIX_1=[];var INV_SUB_MIX_2=[];var INV_SUB_MIX_3=[];(function(){var d=[];for(var i=0;i<256;i++){if(i<128){d[i]=i<<1}else{d[i]=i<<1^283}}var x=0;var xi=0;for(var i=0;i<256;i++){var sx=xi^xi<<1^xi<<2^xi<<3^xi<<4;sx=sx>>>8^sx&255^99;SBOX[x]=sx;INV_SBOX[sx]=x;var x2=d[x];var x4=d[x2];var x8=d[x4];var t=d[sx]*257^sx*16843008;SUB_MIX_0[x]=t<<24|t>>>8;SUB_MIX_1[x]=t<<16|t>>>16;SUB_MIX_2[x]=t<<8|t>>>24;SUB_MIX_3[x]=t;var t=x8*16843009^x4*65537^x2*257^x*16843008;INV_SUB_MIX_0[sx]=t<<24|t>>>8;INV_SUB_MIX_1[sx]=t<<16|t>>>16;INV_SUB_MIX_2[sx]=t<<8|t>>>24;INV_SUB_MIX_3[sx]=t;if(!x){x=xi=1}else{x=x2^d[d[d[x8^x2]]];xi^=d[d[xi]]}}})();var RCON=[0,1,2,4,8,16,32,64,128,27,54];var AES=C_algo.AES=BlockCipher.extend({_doReset:function(){var t;if(this._nRounds&&this._keyPriorReset===this._key){return}var key=this._keyPriorReset=this._key;var keyWords=key.words;var keySize=key.sigBytes/4;var nRounds=this._nRounds=keySize+6;var ksRows=(nRounds+1)*4;var keySchedule=this._keySchedule=[];for(var ksRow=0;ksRow<ksRows;ksRow++){if(ksRow<keySize){keySchedule[ksRow]=keyWords[ksRow]}else{t=keySchedule[ksRow-1];if(!(ksRow%keySize)){t=t<<8|t>>>24;t=SBOX[t>>>24]<<24|SBOX[t>>>16&255]<<16|SBOX[t>>>8&255]<<8|SBOX[t&255];t^=RCON[ksRow/keySize|0]<<24}else if(keySize>6&&ksRow%keySize==4){t=SBOX[t>>>24]<<24|SBOX[t>>>16&255]<<16|SBOX[t>>>8&255]<<8|SBOX[t&255]}keySchedule[ksRow]=keySchedule[ksRow-keySize]^t}}var invKeySchedule=this._invKeySchedule=[];for(var invKsRow=0;invKsRow<ksRows;invKsRow++){var ksRow=ksRows-invKsRow;if(invKsRow%4){var t=keySchedule[ksRow]}else{var t=keySchedule[ksRow-4]}if(invKsRow<4||ksRow<=4){invKeySchedule[invKsRow]=t}else{invKeySchedule[invKsRow]=INV_SUB_MIX_0[SBOX[t>>>24]]^INV_SUB_MIX_1[SBOX[t>>>16&255]]^INV_SUB_MIX_2[SBOX[t>>>8&255]]^INV_SUB_MIX_3[SBOX[t&255]]}}},encryptBlock:function(M,offset){this._doCryptBlock(M,offset,this._keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX)},decryptBlock:function(M,offset){var t=M[offset+1];M[offset+1]=M[offset+3];M[offset+3]=t;this._doCryptBlock(M,offset,this._invKeySchedule,INV_SUB_MIX_0,INV_SUB_MIX_1,INV_SUB_MIX_2,INV_SUB_MIX_3,INV_SBOX);var t=M[offset+1];M[offset+1]=M[offset+3];M[offset+3]=t},_doCryptBlock:function(M,offset,keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX){var nRounds=this._nRounds;var s0=M[offset]^keySchedule[0];var s1=M[offset+1]^keySchedule[1];var s2=M[offset+2]^keySchedule[2];var s3=M[offset+3]^keySchedule[3];var ksRow=4;for(var round=1;round<nRounds;round++){var t0=SUB_MIX_0[s0>>>24]^SUB_MIX_1[s1>>>16&255]^SUB_MIX_2[s2>>>8&255]^SUB_MIX_3[s3&255]^keySchedule[ksRow++];var t1=SUB_MIX_0[s1>>>24]^SUB_MIX_1[s2>>>16&255]^SUB_MIX_2[s3>>>8&255]^SUB_MIX_3[s0&255]^keySchedule[ksRow++];var t2=SUB_MIX_0[s2>>>24]^SUB_MIX_1[s3>>>16&255]^SUB_MIX_2[s0>>>8&255]^SUB_MIX_3[s1&255]^keySchedule[ksRow++];var t3=SUB_MIX_0[s3>>>24]^SUB_MIX_1[s0>>>16&255]^SUB_MIX_2[s1>>>8&255]^SUB_MIX_3[s2&255]^keySchedule[ksRow++];s0=t0;s1=t1;s2=t2;s3=t3}var t0=(SBOX[s0>>>24]<<24|SBOX[s1>>>16&255]<<16|SBOX[s2>>>8&255]<<8|SBOX[s3&255])^keySchedule[ksRow++];var t1=(SBOX[s1>>>24]<<24|SBOX[s2>>>16&255]<<16|SBOX[s3>>>8&255]<<8|SBOX[s0&255])^keySchedule[ksRow++];var t2=(SBOX[s2>>>24]<<24|SBOX[s3>>>16&255]<<16|SBOX[s0>>>8&255]<<8|SBOX[s1&255])^keySchedule[ksRow++];var t3=(SBOX[s3>>>24]<<24|SBOX[s0>>>16&255]<<16|SBOX[s1>>>8&255]<<8|SBOX[s2&255])^keySchedule[ksRow++];M[offset]=t0;M[offset+1]=t1;M[offset+2]=t2;M[offset+3]=t3},keySize:256/32});C.AES=BlockCipher._createHelper(AES)})();(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var BlockCipher=C_lib.BlockCipher;var C_algo=C.algo;var PC1=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];var PC2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];var BIT_SHIFTS=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28];var SBOX_P=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}];var SBOX_MASK=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679];var DES=C_algo.DES=BlockCipher.extend({_doReset:function(){var key=this._key;var keyWords=key.words;var keyBits=[];for(var i=0;i<56;i++){var keyBitPos=PC1[i]-1;keyBits[i]=keyWords[keyBitPos>>>5]>>>31-keyBitPos%32&1}var subKeys=this._subKeys=[];for(var nSubKey=0;nSubKey<16;nSubKey++){var subKey=subKeys[nSubKey]=[];var bitShift=BIT_SHIFTS[nSubKey];for(var i=0;i<24;i++){subKey[i/6|0]|=keyBits[(PC2[i]-1+bitShift)%28]<<31-i%6;subKey[4+(i/6|0)]|=keyBits[28+(PC2[i+24]-1+bitShift)%28]<<31-i%6}subKey[0]=subKey[0]<<1|subKey[0]>>>31;for(var i=1;i<7;i++){subKey[i]=subKey[i]>>>(i-1)*4+3}subKey[7]=subKey[7]<<5|subKey[7]>>>27}var invSubKeys=this._invSubKeys=[];for(var i=0;i<16;i++){invSubKeys[i]=subKeys[15-i]}},encryptBlock:function(M,offset){this._doCryptBlock(M,offset,this._subKeys)},decryptBlock:function(M,offset){this._doCryptBlock(M,offset,this._invSubKeys)},_doCryptBlock:function(M,offset,subKeys){this._lBlock=M[offset];this._rBlock=M[offset+1];exchangeLR.call(this,4,252645135);exchangeLR.call(this,16,65535);exchangeRL.call(this,2,858993459);exchangeRL.call(this,8,16711935);exchangeLR.call(this,1,1431655765);for(var round=0;round<16;round++){var subKey=subKeys[round];var lBlock=this._lBlock;var rBlock=this._rBlock;var f=0;for(var i=0;i<8;i++){f|=SBOX_P[i][((rBlock^subKey[i])&SBOX_MASK[i])>>>0]}this._lBlock=rBlock;this._rBlock=lBlock^f}var t=this._lBlock;this._lBlock=this._rBlock;this._rBlock=t;exchangeLR.call(this,1,1431655765);exchangeRL.call(this,8,16711935);exchangeRL.call(this,2,858993459);exchangeLR.call(this,16,65535);exchangeLR.call(this,4,252645135);M[offset]=this._lBlock;M[offset+1]=this._rBlock},keySize:64/32,ivSize:64/32,blockSize:64/32});function exchangeLR(offset,mask){var t=(this._lBlock>>>offset^this._rBlock)&mask;this._rBlock^=t;this._lBlock^=t<<offset}function exchangeRL(offset,mask){var t=(this._rBlock>>>offset^this._lBlock)&mask;this._lBlock^=t;this._rBlock^=t<<offset}C.DES=BlockCipher._createHelper(DES);var TripleDES=C_algo.TripleDES=BlockCipher.extend({_doReset:function(){var key=this._key;var keyWords=key.words;if(keyWords.length!==2&&keyWords.length!==4&&keyWords.length<6){throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.")}var key1=keyWords.slice(0,2);var key2=keyWords.length<4?keyWords.slice(0,2):keyWords.slice(2,4);var key3=keyWords.length<6?keyWords.slice(0,2):keyWords.slice(4,6);this._des1=DES.createEncryptor(WordArray.create(key1));this._des2=DES.createEncryptor(WordArray.create(key2));this._des3=DES.createEncryptor(WordArray.create(key3))},encryptBlock:function(M,offset){this._des1.encryptBlock(M,offset);this._des2.decryptBlock(M,offset);this._des3.encryptBlock(M,offset)},decryptBlock:function(M,offset){this._des3.decryptBlock(M,offset);this._des2.encryptBlock(M,offset);this._des1.decryptBlock(M,offset)},keySize:192/32,ivSize:64/32,blockSize:64/32});C.TripleDES=BlockCipher._createHelper(TripleDES)})();(function(){var C=CryptoJS;var C_lib=C.lib;var StreamCipher=C_lib.StreamCipher;var C_algo=C.algo;var RC4=C_algo.RC4=StreamCipher.extend({_doReset:function(){var key=this._key;var keyWords=key.words;var keySigBytes=key.sigBytes;var S=this._S=[];for(var i=0;i<256;i++){S[i]=i}for(var i=0,j=0;i<256;i++){var keyByteIndex=i%keySigBytes;var keyByte=keyWords[keyByteIndex>>>2]>>>24-keyByteIndex%4*8&255;j=(j+S[i]+keyByte)%256;var t=S[i];S[i]=S[j];S[j]=t}this._i=this._j=0},_doProcessBlock:function(M,offset){M[offset]^=generateKeystreamWord.call(this)},keySize:256/32,ivSize:0});function generateKeystreamWord(){var S=this._S;var i=this._i;var j=this._j;var keystreamWord=0;for(var n=0;n<4;n++){i=(i+1)%256;j=(j+S[i])%256;var t=S[i];S[i]=S[j];S[j]=t;keystreamWord|=S[(S[i]+S[j])%256]<<24-n*8}this._i=i;this._j=j;return keystreamWord}C.RC4=StreamCipher._createHelper(RC4);var RC4Drop=C_algo.RC4Drop=RC4.extend({cfg:RC4.cfg.extend({drop:192}),_doReset:function(){RC4._doReset.call(this);for(var i=this.cfg.drop;i>0;i--){generateKeystreamWord.call(this)}}});C.RC4Drop=StreamCipher._createHelper(RC4Drop)})();(function(){var C=CryptoJS;var C_lib=C.lib;var StreamCipher=C_lib.StreamCipher;var C_algo=C.algo;var S=[];var C_=[];var G=[];var Rabbit=C_algo.Rabbit=StreamCipher.extend({_doReset:function(){var K=this._key.words;var iv=this.cfg.iv;for(var i=0;i<4;i++){K[i]=(K[i]<<8|K[i]>>>24)&16711935|(K[i]<<24|K[i]>>>8)&4278255360}var X=this._X=[K[0],K[3]<<16|K[2]>>>16,K[1],K[0]<<16|K[3]>>>16,K[2],K[1]<<16|K[0]>>>16,K[3],K[2]<<16|K[1]>>>16];var C=this._C=[K[2]<<16|K[2]>>>16,K[0]&4294901760|K[1]&65535,K[3]<<16|K[3]>>>16,K[1]&4294901760|K[2]&65535,K[0]<<16|K[0]>>>16,K[2]&4294901760|K[3]&65535,K[1]<<16|K[1]>>>16,K[3]&4294901760|K[0]&65535];this._b=0;for(var i=0;i<4;i++){nextState.call(this)}for(var i=0;i<8;i++){C[i]^=X[i+4&7]}if(iv){var IV=iv.words;var IV_0=IV[0];var IV_1=IV[1];var i0=(IV_0<<8|IV_0>>>24)&16711935|(IV_0<<24|IV_0>>>8)&4278255360;var i2=(IV_1<<8|IV_1>>>24)&16711935|(IV_1<<24|IV_1>>>8)&4278255360;var i1=i0>>>16|i2&4294901760;var i3=i2<<16|i0&65535;C[0]^=i0;C[1]^=i1;C[2]^=i2;C[3]^=i3;C[4]^=i0;C[5]^=i1;C[6]^=i2;C[7]^=i3;for(var i=0;i<4;i++){nextState.call(this)}}},_doProcessBlock:function(M,offset){var X=this._X;nextState.call(this);S[0]=X[0]^X[5]>>>16^X[3]<<16;S[1]=X[2]^X[7]>>>16^X[5]<<16;S[2]=X[4]^X[1]>>>16^X[7]<<16;S[3]=X[6]^X[3]>>>16^X[1]<<16;for(var i=0;i<4;i++){S[i]=(S[i]<<8|S[i]>>>24)&16711935|(S[i]<<24|S[i]>>>8)&4278255360;M[offset+i]^=S[i]}},blockSize:128/32,ivSize:64/32});function nextState(){var X=this._X;var C=this._C;for(var i=0;i<8;i++){C_[i]=C[i]}C[0]=C[0]+1295307597+this._b|0;C[1]=C[1]+3545052371+(C[0]>>>0<C_[0]>>>0?1:0)|0;C[2]=C[2]+886263092+(C[1]>>>0<C_[1]>>>0?1:0)|0;C[3]=C[3]+1295307597+(C[2]>>>0<C_[2]>>>0?1:0)|0;C[4]=C[4]+3545052371+(C[3]>>>0<C_[3]>>>0?1:0)|0;C[5]=C[5]+886263092+(C[4]>>>0<C_[4]>>>0?1:0)|0;C[6]=C[6]+1295307597+(C[5]>>>0<C_[5]>>>0?1:0)|0;C[7]=C[7]+3545052371+(C[6]>>>0<C_[6]>>>0?1:0)|0;this._b=C[7]>>>0<C_[7]>>>0?1:0;for(var i=0;i<8;i++){var gx=X[i]+C[i];var ga=gx&65535;var gb=gx>>>16;var gh=((ga*ga>>>17)+ga*gb>>>15)+gb*gb;var gl=((gx&4294901760)*gx|0)+((gx&65535)*gx|0);G[i]=gh^gl}X[0]=G[0]+(G[7]<<16|G[7]>>>16)+(G[6]<<16|G[6]>>>16)|0;X[1]=G[1]+(G[0]<<8|G[0]>>>24)+G[7]|0;X[2]=G[2]+(G[1]<<16|G[1]>>>16)+(G[0]<<16|G[0]>>>16)|0;X[3]=G[3]+(G[2]<<8|G[2]>>>24)+G[1]|0;X[4]=G[4]+(G[3]<<16|G[3]>>>16)+(G[2]<<16|G[2]>>>16)|0;X[5]=G[5]+(G[4]<<8|G[4]>>>24)+G[3]|0;X[6]=G[6]+(G[5]<<16|G[5]>>>16)+(G[4]<<16|G[4]>>>16)|0;X[7]=G[7]+(G[6]<<8|G[6]>>>24)+G[5]|0}C.Rabbit=StreamCipher._createHelper(Rabbit)})();(function(){var C=CryptoJS;var C_lib=C.lib;var StreamCipher=C_lib.StreamCipher;var C_algo=C.algo;var S=[];var C_=[];var G=[];var RabbitLegacy=C_algo.RabbitLegacy=StreamCipher.extend({_doReset:function(){var K=this._key.words;var iv=this.cfg.iv;var X=this._X=[K[0],K[3]<<16|K[2]>>>16,K[1],K[0]<<16|K[3]>>>16,K[2],K[1]<<16|K[0]>>>16,K[3],K[2]<<16|K[1]>>>16];var C=this._C=[K[2]<<16|K[2]>>>16,K[0]&4294901760|K[1]&65535,K[3]<<16|K[3]>>>16,K[1]&4294901760|K[2]&65535,K[0]<<16|K[0]>>>16,K[2]&4294901760|K[3]&65535,K[1]<<16|K[1]>>>16,K[3]&4294901760|K[0]&65535];this._b=0;for(var i=0;i<4;i++){nextState.call(this)}for(var i=0;i<8;i++){C[i]^=X[i+4&7]}if(iv){var IV=iv.words;var IV_0=IV[0];var IV_1=IV[1];var i0=(IV_0<<8|IV_0>>>24)&16711935|(IV_0<<24|IV_0>>>8)&4278255360;var i2=(IV_1<<8|IV_1>>>24)&16711935|(IV_1<<24|IV_1>>>8)&4278255360;var i1=i0>>>16|i2&4294901760;var i3=i2<<16|i0&65535;C[0]^=i0;C[1]^=i1;C[2]^=i2;C[3]^=i3;C[4]^=i0;C[5]^=i1;C[6]^=i2;C[7]^=i3;for(var i=0;i<4;i++){nextState.call(this)}}},_doProcessBlock:function(M,offset){var X=this._X;nextState.call(this);S[0]=X[0]^X[5]>>>16^X[3]<<16;S[1]=X[2]^X[7]>>>16^X[5]<<16;S[2]=X[4]^X[1]>>>16^X[7]<<16;S[3]=X[6]^X[3]>>>16^X[1]<<16;for(var i=0;i<4;i++){S[i]=(S[i]<<8|S[i]>>>24)&16711935|(S[i]<<24|S[i]>>>8)&4278255360;M[offset+i]^=S[i]}},blockSize:128/32,ivSize:64/32});function nextState(){var X=this._X;var C=this._C;for(var i=0;i<8;i++){C_[i]=C[i]}C[0]=C[0]+1295307597+this._b|0;C[1]=C[1]+3545052371+(C[0]>>>0<C_[0]>>>0?1:0)|0;C[2]=C[2]+886263092+(C[1]>>>0<C_[1]>>>0?1:0)|0;C[3]=C[3]+1295307597+(C[2]>>>0<C_[2]>>>0?1:0)|0;C[4]=C[4]+3545052371+(C[3]>>>0<C_[3]>>>0?1:0)|0;C[5]=C[5]+886263092+(C[4]>>>0<C_[4]>>>0?1:0)|0;C[6]=C[6]+1295307597+(C[5]>>>0<C_[5]>>>0?1:0)|0;C[7]=C[7]+3545052371+(C[6]>>>0<C_[6]>>>0?1:0)|0;this._b=C[7]>>>0<C_[7]>>>0?1:0;for(var i=0;i<8;i++){var gx=X[i]+C[i];var ga=gx&65535;var gb=gx>>>16;var gh=((ga*ga>>>17)+ga*gb>>>15)+gb*gb;var gl=((gx&4294901760)*gx|0)+((gx&65535)*gx|0);G[i]=gh^gl}X[0]=G[0]+(G[7]<<16|G[7]>>>16)+(G[6]<<16|G[6]>>>16)|0;X[1]=G[1]+(G[0]<<8|G[0]>>>24)+G[7]|0;X[2]=G[2]+(G[1]<<16|G[1]>>>16)+(G[0]<<16|G[0]>>>16)|0;X[3]=G[3]+(G[2]<<8|G[2]>>>24)+G[1]|0;X[4]=G[4]+(G[3]<<16|G[3]>>>16)+(G[2]<<16|G[2]>>>16)|0;X[5]=G[5]+(G[4]<<8|G[4]>>>24)+G[3]|0;X[6]=G[6]+(G[5]<<16|G[5]>>>16)+(G[4]<<16|G[4]>>>16)|0;X[7]=G[7]+(G[6]<<8|G[6]>>>24)+G[5]|0}C.RabbitLegacy=StreamCipher._createHelper(RabbitLegacy)})();return CryptoJS});';
function Y(c) {
  return c.replace(/-----BEGIN [A-Z0-9 ]+-----/g, "").replace(/-----END [A-Z0-9 ]+-----/g, "").replace(/\s/g, "");
}
s(Y, "_cleanPEM");
function _e(c) {
  let o = 0;
  for (let m of c) o += m.length;
  let l = new Uint8Array(o), p2 = 0;
  for (let m of c) l.set(m, p2), p2 += m.length;
  return l;
}
s(_e, "_concatUint8Arrays");
function ge(c, o) {
  let l = [`-----BEGIN ${o}-----`];
  for (let p2 = 0; p2 < c.length; p2 += 64) l.push(c.slice(p2, p2 + 64));
  return l.push(`-----END ${o}-----`), l.join(`
`);
}
s(ge, "_formatPEM");
function be(c) {
  return { sha1: "SHA-1", sha224: "SHA-224", sha256: "SHA-256", sha384: "SHA-384", sha512: "SHA-512", md5: "SHA-256" }[(c || "sha256").toLowerCase().replace(/-/g, "")] || "SHA-256";
}
s(be, "_digestToWebCryptoName");
function Me(c) {
  switch (c) {
    case "SHA-1":
      return 20;
    case "SHA-224":
      return 28;
    case "SHA-256":
    default:
      return 32;
    case "SHA-384":
      return 48;
    case "SHA-512":
      return 64;
  }
}
s(Me, "_hashByteLength");
function Te(c) {
  return c ? typeof c == "string" ? c : c.name ? c.name : "SHA-256" : "SHA-256";
}
s(Te, "_normalizeHash");
var ne = class ne2 {
  constructor(o) {
    this.options = o || {}, this.default_key_size = this.options.default_key_size || 1024, this.padding = (this.options.padding || "PKCS1").toUpperCase(), this.hash = Te(this.options.hash), this.signAlgorithm = this.options.signAlgorithm || "RSASSA-PKCS1-v1_5", this.saltLength = this.options.saltLength != null ? this.options.saltLength : 0, this.publicKey = null, this.privateKey = null, this.publicKeyPem = null, this.privateKeyPem = null;
  }
  _cipherAlgName() {
    return this.padding === "OAEP" ? "RSA-OAEP" : "RSA-PKCS1-v1_5";
  }
  _maxEncryptSegment() {
    let o = this._modulusBytes();
    return this.padding === "OAEP" ? o - 2 * Me(this.hash) - 2 : o - 11;
  }
  _modulusBytes() {
    let o = this.privateKey || this.publicKey;
    return o ? o.algorithm.modulusLength + 7 >> 3 : 0;
  }
  setPublicKey(o) {
    this.publicKeyPem = o;
    try {
      let l = Uint8Array.fromBase64(Y(o));
      return this.publicKey = crypto.subtle.importKey("spki", l, { name: this._cipherAlgName(), hash: this.hash }, false, ["encrypt"]), true;
    } catch {
      return this.publicKey = null, false;
    }
  }
  setPrivateKey(o) {
    this.privateKeyPem = o;
    try {
      let l = Uint8Array.fromBase64(Y(o));
      return this.privateKey = crypto.subtle.importKey("pkcs8", l, { name: this._cipherAlgName(), hash: this.hash }, false, ["decrypt"]), true;
    } catch {
      return this.privateKey = null, false;
    }
  }
  setKey(o) {
    this.setPrivateKey(o) || this.setPublicKey(o);
  }
  getPrivateKey() {
    return this.privateKeyPem;
  }
  getPublicKey() {
    return this.publicKeyPem;
  }
  getKey(o) {
    let l = crypto.subtle.generateKey({ name: this._cipherAlgName(), modulusLength: this.default_key_size, publicExponent: new Uint8Array([1, 0, 1]), hash: this.hash }, true, ["encrypt", "decrypt"]);
    this.publicKey = l.publicKey, this.privateKey = l.privateKey;
    let p2 = new Uint8Array(crypto.subtle.exportKey("spki", this.publicKey)), m = new Uint8Array(crypto.subtle.exportKey("pkcs8", this.privateKey));
    return this.publicKeyPem = ge(p2.toBase64(), "PUBLIC KEY"), this.privateKeyPem = ge(m.toBase64(), "PRIVATE KEY"), o && o(), { key: this.privateKey };
  }
  encrypt(o) {
    if (!this.publicKey) return false;
    try {
      let l = new TextEncoder().encode(o), p2 = this._cipherAlgName(), m = this._maxEncryptSegment(), x;
      if (l.length > m) {
        let C = [];
        for (let g = 0; g < l.length; g += m) {
          let B = l.slice(g, g + m);
          C.push(new Uint8Array(crypto.subtle.encrypt({ name: p2 }, this.publicKey, B)));
        }
        x = _e(C);
      } else x = new Uint8Array(crypto.subtle.encrypt({ name: p2 }, this.publicKey, l));
      return x.toBase64();
    } catch {
      return false;
    }
  }
  decrypt(o) {
    if (!this.privateKey) return false;
    try {
      let l = Uint8Array.fromBase64(o), p2 = this._modulusBytes(), m = this._cipherAlgName(), x;
      if (l.length > p2) {
        let C = [];
        for (let g = 0; g < l.length; g += p2) {
          let B = l.slice(g, g + p2);
          C.push(new Uint8Array(crypto.subtle.decrypt({ name: m }, this.privateKey, B)));
        }
        x = _e(C);
      } else x = new Uint8Array(crypto.subtle.decrypt({ name: m }, this.privateKey, l));
      return new TextDecoder().decode(x);
    } catch {
      return false;
    }
  }
  sign(o, l, p2) {
    if (!this.privateKeyPem) return false;
    try {
      let m = be(l), x = this.signAlgorithm, C = Uint8Array.fromBase64(Y(this.privateKeyPem)), g = crypto.subtle.importKey("pkcs8", C, { name: x, hash: m }, false, ["sign"]), B = new TextEncoder().encode(o), P = x;
      x === "RSA-PSS" && (P = { name: "RSA-PSS", saltLength: this.saltLength });
      let w = new Uint8Array(crypto.subtle.sign(P, g, B));
      return (p2 || "base64").toLowerCase() === "hex" ? w.toHex() : w.toBase64();
    } catch {
      return false;
    }
  }
  verify(o, l, p2) {
    if (!this.publicKeyPem) return false;
    try {
      let m = be(p2), x = this.signAlgorithm, C = Uint8Array.fromBase64(Y(this.publicKeyPem)), g = crypto.subtle.importKey("spki", C, { name: x, hash: m }, false, ["verify"]), B = new TextEncoder().encode(o), P = /^[0-9a-fA-F]+$/.test(l) && l.length % 2 == 0 ? Uint8Array.fromHex(l) : Uint8Array.fromBase64(l), w = x;
      return x === "RSA-PSS" && (w = { name: "RSA-PSS", saltLength: this.saltLength }), crypto.subtle.verify(w, g, P, B);
    } catch {
      return false;
    }
  }
  getKeySize() {
    let o = this.privateKey || this.publicKey;
    return o ? o.algorithm.modulusLength : 0;
  }
  getMaxMessageSize() {
    return this._maxEncryptSegment();
  }
};
s(ne, "JSEncrypt");
var se = ne;
var U = se;
(function(c, o) {
  typeof exports == "object" && typeof module < "u" ? o(exports) : typeof define == "function" && define.amd ? define(["exports"], o) : o((c = typeof globalThis < "u" ? globalThis : c || self).JSONPath = {});
})(void 0, function(c) {
  "use strict";
  function o(e, t, r) {
    return t = N(t), (function(a, i) {
      {
        if (i && (typeof i == "object" || typeof i == "function")) return i;
        if (i !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
      }
      return (function(n) {
        if (n !== void 0) return n;
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      })(a);
    })(e, p2() ? Reflect.construct(t, r || [], N(e).constructor) : t.apply(e, r));
  }
  s(o, "n");
  function l(e, t, r) {
    if (p2()) return Reflect.construct.apply(null, arguments);
    var a = [null];
    return a.push.apply(a, t), a = new (e.bind.apply(e, a))(), r && G(a, r.prototype), a;
  }
  s(l, "o");
  function p2() {
    try {
      var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch {
    }
    return (p2 = s(function() {
      return !!e;
    }, "i"))();
  }
  s(p2, "i");
  function m(e, t) {
    var r, a = Object.keys(e);
    return Object.getOwnPropertySymbols && (r = Object.getOwnPropertySymbols(e), t && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), a.push.apply(a, r)), a;
  }
  s(m, "t");
  function x(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? m(Object(r), true).forEach(function(a) {
        var i, n;
        i = e, a = r[n = a], (n = C(n)) in i ? Object.defineProperty(i, n, { value: a, enumerable: true, configurable: true, writable: true }) : i[n] = a;
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : m(Object(r)).forEach(function(a) {
        Object.defineProperty(e, a, Object.getOwnPropertyDescriptor(r, a));
      });
    }
    return e;
  }
  s(x, "r");
  function C(e) {
    return e = (function(t, r) {
      if (typeof t != "object" || !t) return t;
      var a = t[Symbol.toPrimitive];
      if (a === void 0) return (r === "string" ? String : Number)(t);
      if (typeof (r = a.call(t, r || "default")) != "object") return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    })(e, "string"), typeof e == "symbol" ? e : e + "";
  }
  s(C, "a");
  function g(e) {
    return (g = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
      return typeof t;
    } : function(t) {
      return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(e);
  }
  s(g, "C");
  function B(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }
  s(B, "s");
  function P(e, t) {
    for (var r = 0; r < t.length; r++) {
      var a = t[r];
      a.enumerable = a.enumerable || false, a.configurable = true, "value" in a && (a.writable = true), Object.defineProperty(e, C(a.key), a);
    }
  }
  s(P, "u");
  function w(e, t, r) {
    return t && P(e.prototype, t), r && P(e, r), Object.defineProperty(e, "prototype", { writable: false }), e;
  }
  s(w, "c");
  function N(e) {
    return (N = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    })(e);
  }
  s(N, "l");
  function G(e, t) {
    return (G = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, a) {
      return r.__proto__ = a, r;
    })(e, t);
  }
  s(G, "h");
  function ce(e) {
    var t = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return (ce = s(function(r) {
      if (r === null || !(function(i) {
        try {
          return Function.toString.call(i).indexOf("[native code]") !== -1;
        } catch {
          return typeof i == "function";
        }
      })(r)) return r;
      if (typeof r != "function") throw new TypeError("Super expression must either be null or a function");
      if (t !== void 0) {
        if (t.has(r)) return t.get(r);
        t.set(r, a);
      }
      function a() {
        return l(r, arguments, N(this).constructor);
      }
      return s(a, "t"), a.prototype = Object.create(r.prototype, { constructor: { value: a, enumerable: false, writable: true, configurable: true } }), G(a, r);
    }, "p"))(e);
  }
  s(ce, "p");
  function Q(e) {
    return (function(t) {
      if (Array.isArray(t)) return Z(t);
    })(e) || (function(t) {
      if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
    })(e) || he(e) || (function() {
      throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    })();
  }
  s(Q, "f");
  function he(e, t) {
    if (e) {
      if (typeof e == "string") return Z(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Z(e, t) : void 0;
    }
  }
  s(he, "O");
  function Z(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var r = 0, a = new Array(t); r < t; r++) a[r] = e[r];
    return a;
  }
  s(Z, "d");
  var ee = (function() {
    return w(s(function e() {
      B(this, e);
    }, "e"), [{ key: "add", value: s(function(e, t, r) {
      if (typeof e != "string") for (var a in e) this.add(a, e[a], t);
      else (Array.isArray(e) ? e : [e]).forEach(function(i) {
        this[i] = this[i] || [], t && this[i][r ? "unshift" : "push"](t);
      }, this);
    }, "value") }, { key: "run", value: s(function(e, t) {
      this[e] = this[e] || [], this[e].forEach(function(r) {
        r.call(t && t.context ? t.context : t, t);
      });
    }, "value") }]);
  })(), D = (function() {
    return w(s(function e(t) {
      B(this, e), this.jsep = t, this.registered = {};
    }, "e"), [{ key: "register", value: s(function() {
      for (var e = this, t = arguments.length, r = new Array(t), a = 0; a < t; a++) r[a] = arguments[a];
      r.forEach(function(i) {
        if (g(i) !== "object" || !i.name || !i.init) throw new Error("Invalid JSEP plugin format");
        e.registered[i.name] || (i.init(e.jsep), e.registered[i.name] = i);
      });
    }, "value") }]);
  })(), A = (function() {
    function e(t) {
      B(this, e), this.expr = t, this.index = 0;
    }
    return s(e, "l"), w(e, [{ key: "char", get: s(function() {
      return this.expr.charAt(this.index);
    }, "get") }, { key: "code", get: s(function() {
      return this.expr.charCodeAt(this.index);
    }, "get") }, { key: "throwError", value: s(function(t) {
      var r = new Error(t + " at character " + this.index);
      throw r.index = this.index, r.description = t, r;
    }, "value") }, { key: "runHook", value: s(function(t, r) {
      if (e.hooks[t]) {
        var a = { context: this, node: r };
        return e.hooks.run(t, a), a.node;
      }
      return r;
    }, "value") }, { key: "searchHook", value: s(function(t) {
      if (e.hooks[t]) {
        var r = { context: this };
        return e.hooks[t].find(function(a) {
          return a.call(r.context, r), r.node;
        }), r.node;
      }
    }, "value") }, { key: "gobbleSpaces", value: s(function() {
      for (var t = this.code; t === e.SPACE_CODE || t === e.TAB_CODE || t === e.LF_CODE || t === e.CR_CODE; ) t = this.expr.charCodeAt(++this.index);
      this.runHook("gobble-spaces");
    }, "value") }, { key: "parse", value: s(function() {
      this.runHook("before-all");
      var t = this.gobbleExpressions(), t = t.length === 1 ? t[0] : { type: e.COMPOUND, body: t };
      return this.runHook("after-all", t);
    }, "value") }, { key: "gobbleExpressions", value: s(function(t) {
      for (var r, a, i = []; this.index < this.expr.length; ) if ((r = this.code) === e.SEMCOL_CODE || r === e.COMMA_CODE) this.index++;
      else if (a = this.gobbleExpression()) i.push(a);
      else if (this.index < this.expr.length) {
        if (r === t) break;
        this.throwError('Unexpected "' + this.char + '"');
      }
      return i;
    }, "value") }, { key: "gobbleExpression", value: s(function() {
      var t = this.searchHook("gobble-expression") || this.gobbleBinaryExpression();
      return this.gobbleSpaces(), this.runHook("after-expression", t);
    }, "value") }, { key: "gobbleBinaryOp", value: s(function() {
      this.gobbleSpaces();
      for (var t = this.expr.substr(this.index, e.max_binop_len), r = t.length; 0 < r; ) {
        if (e.binary_ops.hasOwnProperty(t) && (!e.isIdentifierStart(this.code) || this.index + t.length < this.expr.length && !e.isIdentifierPart(this.expr.charCodeAt(this.index + t.length)))) return this.index += r, t;
        t = t.substr(0, --r);
      }
      return false;
    }, "value") }, { key: "gobbleBinaryExpression", value: s(function() {
      var t, r, a, i, n, d2, f, v, h, _ = this.gobbleToken();
      if (!_ || !(r = this.gobbleBinaryOp())) return _;
      for (n = { value: r, prec: e.binaryPrecedence(r), right_a: e.right_associative.has(r) }, (d2 = this.gobbleToken()) || this.throwError("Expected expression after " + r), i = [_, n, d2]; r = this.gobbleBinaryOp(); ) {
        if ((a = e.binaryPrecedence(r)) === 0) {
          this.index -= r.length;
          break;
        }
        for (n = { value: r, prec: a, right_a: e.right_associative.has(r) }, v = r; 2 < i.length && (h = i[i.length - 2], n.right_a && h.right_a ? a > h.prec : a <= h.prec); ) d2 = i.pop(), r = i.pop().value, _ = i.pop(), t = { type: e.BINARY_EXP, operator: r, left: _, right: d2 }, i.push(t);
        (t = this.gobbleToken()) || this.throwError("Expected expression after " + v), i.push(n, t);
      }
      for (t = i[f = i.length - 1]; 1 < f; ) t = { type: e.BINARY_EXP, operator: i[f - 1].value, left: i[f - 2], right: t }, f -= 2;
      return t;
    }, "value") }, { key: "gobbleToken", value: s(function() {
      var t, r, a, i;
      if (this.gobbleSpaces(), i = this.searchHook("gobble-token")) return this.runHook("after-token", i);
      if (t = this.code, e.isDecimalDigit(t) || t === e.PERIOD_CODE) return this.gobbleNumericLiteral();
      if (t === e.SQUOTE_CODE || t === e.DQUOTE_CODE) i = this.gobbleStringLiteral();
      else if (t === e.OBRACK_CODE) i = this.gobbleArray();
      else {
        for (a = (r = this.expr.substr(this.index, e.max_unop_len)).length; 0 < a; ) {
          if (e.unary_ops.hasOwnProperty(r) && (!e.isIdentifierStart(this.code) || this.index + r.length < this.expr.length && !e.isIdentifierPart(this.expr.charCodeAt(this.index + r.length)))) {
            this.index += a;
            var n = this.gobbleToken();
            return n || this.throwError("missing unaryOp argument"), this.runHook("after-token", { type: e.UNARY_EXP, operator: r, argument: n, prefix: true });
          }
          r = r.substr(0, --a);
        }
        e.isIdentifierStart(t) ? (i = this.gobbleIdentifier(), e.literals.hasOwnProperty(i.name) ? i = { type: e.LITERAL, value: e.literals[i.name], raw: i.name } : i.name === e.this_str && (i = { type: e.THIS_EXP })) : t === e.OPAREN_CODE && (i = this.gobbleGroup());
      }
      return i ? (i = this.gobbleTokenProperty(i), this.runHook("after-token", i)) : this.runHook("after-token", false);
    }, "value") }, { key: "gobbleTokenProperty", value: s(function(t) {
      this.gobbleSpaces();
      for (var r = this.code; r === e.PERIOD_CODE || r === e.OBRACK_CODE || r === e.OPAREN_CODE || r === e.QUMARK_CODE; ) {
        var a = void 0;
        if (r === e.QUMARK_CODE) {
          if (this.expr.charCodeAt(this.index + 1) !== e.PERIOD_CODE) break;
          a = true, this.index += 2, this.gobbleSpaces(), r = this.code;
        }
        this.index++, r === e.OBRACK_CODE ? (t = { type: e.MEMBER_EXP, computed: true, object: t, property: this.gobbleExpression() }, this.gobbleSpaces(), (r = this.code) !== e.CBRACK_CODE && this.throwError("Unclosed ["), this.index++) : r === e.OPAREN_CODE ? t = { type: e.CALL_EXP, arguments: this.gobbleArguments(e.CPAREN_CODE), callee: t } : r !== e.PERIOD_CODE && !a || (a && this.index--, this.gobbleSpaces(), t = { type: e.MEMBER_EXP, computed: false, object: t, property: this.gobbleIdentifier() }), a && (t.optional = true), this.gobbleSpaces(), r = this.code;
      }
      return t;
    }, "value") }, { key: "gobbleNumericLiteral", value: s(function() {
      for (var t, r = ""; e.isDecimalDigit(this.code); ) r += this.expr.charAt(this.index++);
      if (this.code === e.PERIOD_CODE) for (r += this.expr.charAt(this.index++); e.isDecimalDigit(this.code); ) r += this.expr.charAt(this.index++);
      if ((t = this.char) === "e" || t === "E") {
        for (r += this.expr.charAt(this.index++), (t = this.char) !== "+" && t !== "-" || (r += this.expr.charAt(this.index++)); e.isDecimalDigit(this.code); ) r += this.expr.charAt(this.index++);
        e.isDecimalDigit(this.expr.charCodeAt(this.index - 1)) || this.throwError("Expected exponent (" + r + this.char + ")");
      }
      return t = this.code, e.isIdentifierStart(t) ? this.throwError("Variable names cannot start with a number (" + r + this.char + ")") : (t === e.PERIOD_CODE || r.length === 1 && r.charCodeAt(0) === e.PERIOD_CODE) && this.throwError("Unexpected period"), { type: e.LITERAL, value: parseFloat(r), raw: r };
    }, "value") }, { key: "gobbleStringLiteral", value: s(function() {
      for (var t = "", r = this.index, a = this.expr.charAt(this.index++), i = false; this.index < this.expr.length; ) {
        var n = this.expr.charAt(this.index++);
        if (n === a) {
          i = true;
          break;
        }
        if (n === "\\") switch (n = this.expr.charAt(this.index++)) {
          case "n":
            t += `
`;
            break;
          case "r":
            t += "\r";
            break;
          case "t":
            t += "	";
            break;
          case "b":
            t += "\b";
            break;
          case "f":
            t += "\f";
            break;
          case "v":
            t += "\v";
            break;
          default:
            t += n;
        }
        else t += n;
      }
      return i || this.throwError('Unclosed quote after "' + t + '"'), { type: e.LITERAL, value: t, raw: this.expr.substring(r, this.index) };
    }, "value") }, { key: "gobbleIdentifier", value: s(function() {
      var t = this.code, r = this.index;
      for (e.isIdentifierStart(t) ? this.index++ : this.throwError("Unexpected " + this.char); this.index < this.expr.length && (t = this.code, e.isIdentifierPart(t)); ) this.index++;
      return { type: e.IDENTIFIER, name: this.expr.slice(r, this.index) };
    }, "value") }, { key: "gobbleArguments", value: s(function(t) {
      for (var r = [], a = false, i = 0; this.index < this.expr.length; ) {
        this.gobbleSpaces();
        var n = this.code;
        if (n === t) {
          a = true, this.index++, t === e.CPAREN_CODE && i && i >= r.length && this.throwError("Unexpected token " + String.fromCharCode(t));
          break;
        }
        if (n === e.COMMA_CODE) {
          if (this.index++, ++i !== r.length) {
            if (t === e.CPAREN_CODE) this.throwError("Unexpected token ,");
            else if (t === e.CBRACK_CODE) for (var d2 = r.length; d2 < i; d2++) r.push(null);
          }
        } else r.length !== i && i !== 0 ? this.throwError("Expected comma") : ((n = this.gobbleExpression()) && n.type !== e.COMPOUND || this.throwError("Expected comma"), r.push(n));
      }
      return a || this.throwError("Expected " + String.fromCharCode(t)), r;
    }, "value") }, { key: "gobbleGroup", value: s(function() {
      this.index++;
      var t = this.gobbleExpressions(e.CPAREN_CODE);
      if (this.code === e.CPAREN_CODE) return this.index++, t.length === 1 ? t[0] : !!t.length && { type: e.SEQUENCE_EXP, expressions: t };
      this.throwError("Unclosed (");
    }, "value") }, { key: "gobbleArray", value: s(function() {
      return this.index++, { type: e.ARRAY_EXP, elements: this.gobbleArguments(e.CBRACK_CODE) };
    }, "value") }], [{ key: "version", get: s(function() {
      return "1.3.8";
    }, "get") }, { key: "toString", value: s(function() {
      return "JavaScript Expression Parser (JSEP) v" + e.version;
    }, "value") }, { key: "addUnaryOp", value: s(function(t) {
      return e.max_unop_len = Math.max(t.length, e.max_unop_len), e.unary_ops[t] = 1, e;
    }, "value") }, { key: "addBinaryOp", value: s(function(t, r, a) {
      return e.max_binop_len = Math.max(t.length, e.max_binop_len), e.binary_ops[t] = r, a ? e.right_associative.add(t) : e.right_associative.delete(t), e;
    }, "value") }, { key: "addIdentifierChar", value: s(function(t) {
      return e.additional_identifier_chars.add(t), e;
    }, "value") }, { key: "addLiteral", value: s(function(t, r) {
      return e.literals[t] = r, e;
    }, "value") }, { key: "removeUnaryOp", value: s(function(t) {
      return delete e.unary_ops[t], t.length === e.max_unop_len && (e.max_unop_len = e.getMaxKeyLen(e.unary_ops)), e;
    }, "value") }, { key: "removeAllUnaryOps", value: s(function() {
      return e.unary_ops = {}, e.max_unop_len = 0, e;
    }, "value") }, { key: "removeIdentifierChar", value: s(function(t) {
      return e.additional_identifier_chars.delete(t), e;
    }, "value") }, { key: "removeBinaryOp", value: s(function(t) {
      return delete e.binary_ops[t], t.length === e.max_binop_len && (e.max_binop_len = e.getMaxKeyLen(e.binary_ops)), e.right_associative.delete(t), e;
    }, "value") }, { key: "removeAllBinaryOps", value: s(function() {
      return e.binary_ops = {}, e.max_binop_len = 0, e;
    }, "value") }, { key: "removeLiteral", value: s(function(t) {
      return delete e.literals[t], e;
    }, "value") }, { key: "removeAllLiterals", value: s(function() {
      return e.literals = {}, e;
    }, "value") }, { key: "parse", value: s(function(t) {
      return new e(t).parse();
    }, "value") }, { key: "getMaxKeyLen", value: s(function(t) {
      return Math.max.apply(Math, [0].concat(Q(Object.keys(t).map(function(r) {
        return r.length;
      }))));
    }, "value") }, { key: "isDecimalDigit", value: s(function(t) {
      return 48 <= t && t <= 57;
    }, "value") }, { key: "binaryPrecedence", value: s(function(t) {
      return e.binary_ops[t] || 0;
    }, "value") }, { key: "isIdentifierStart", value: s(function(t) {
      return 65 <= t && t <= 90 || 97 <= t && t <= 122 || 128 <= t && !e.binary_ops[String.fromCharCode(t)] || e.additional_identifier_chars.has(String.fromCharCode(t));
    }, "value") }, { key: "isIdentifierPart", value: s(function(t) {
      return e.isIdentifierStart(t) || e.isDecimalDigit(t);
    }, "value") }]);
  })(), ee = new ee();
  Object.assign(A, { hooks: ee, plugins: new D(A), COMPOUND: "Compound", SEQUENCE_EXP: "SequenceExpression", IDENTIFIER: "Identifier", MEMBER_EXP: "MemberExpression", LITERAL: "Literal", THIS_EXP: "ThisExpression", CALL_EXP: "CallExpression", UNARY_EXP: "UnaryExpression", BINARY_EXP: "BinaryExpression", ARRAY_EXP: "ArrayExpression", TAB_CODE: 9, LF_CODE: 10, CR_CODE: 13, SPACE_CODE: 32, PERIOD_CODE: 46, COMMA_CODE: 44, SQUOTE_CODE: 39, DQUOTE_CODE: 34, OPAREN_CODE: 40, CPAREN_CODE: 41, OBRACK_CODE: 91, CBRACK_CODE: 93, QUMARK_CODE: 63, SEMCOL_CODE: 59, COLON_CODE: 58, unary_ops: { "-": 1, "!": 1, "~": 1, "+": 1 }, binary_ops: { "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5, "==": 6, "!=": 6, "===": 6, "!==": 6, "<": 7, ">": 7, "<=": 7, ">=": 7, "<<": 8, ">>": 8, ">>>": 8, "+": 9, "-": 9, "*": 10, "/": 10, "%": 10 }, right_associative: /* @__PURE__ */ new Set(), additional_identifier_chars: /* @__PURE__ */ new Set(["$", "_"]), literals: { true: true, false: false, null: null }, this_str: "this" }), A.max_unop_len = A.getMaxKeyLen(A.unary_ops), A.max_binop_len = A.getMaxKeyLen(A.binary_ops);
  var R = s(function(e) {
    return new A(e).parse();
  }, "E");
  Object.getOwnPropertyNames(A).forEach(function(e) {
    R[e] === void 0 && e !== "prototype" && (R[e] = A[e]);
  }), R.Jsep = A, D = { name: "ternary", init: s(function(e) {
    e.hooks.add("after-expression", function(t) {
      if (t.node && this.code === e.QUMARK_CODE) {
        this.index++;
        var r = t.node, a = this.gobbleExpression();
        if (a || this.throwError("Expected expression"), this.gobbleSpaces(), this.code === e.COLON_CODE) {
          this.index++;
          var i = this.gobbleExpression();
          if (i || this.throwError("Expected expression"), t.node = { type: "ConditionalExpression", test: r, consequent: a, alternate: i }, r.operator && e.binary_ops[r.operator] <= 0.9) {
            for (var n = r; n.right.operator && e.binary_ops[n.right.operator] <= 0.9; ) n = n.right;
            t.node.test = n.right, n.right = t.node, t.node = r;
          }
        } else this.throwError("Expected :");
      }
    });
  }, "init") }, R.plugins.register(D);
  var D = { name: "regex", init: s(function(e) {
    e.hooks.add("gobble-token", function(t) {
      if (this.code === 47) {
        for (var r = ++this.index, a = false; this.index < this.expr.length; ) {
          if (this.code === 47 && !a) {
            for (var i = this.expr.slice(r, this.index), n = ""; ++this.index < this.expr.length; ) {
              var d2 = this.code;
              if (!(97 <= d2 && d2 <= 122 || 65 <= d2 && d2 <= 90 || 48 <= d2 && d2 <= 57)) break;
              n += this.char;
            }
            var f = void 0;
            try {
              f = new RegExp(i, n);
            } catch (v) {
              this.throwError(v.message);
            }
            return t.node = { type: e.LITERAL, value: f, raw: this.expr.slice(r - 1, this.index) }, t.node = this.gobbleTokenProperty(t.node), t.node;
          }
          this.code === e.OBRACK_CODE ? a = true : a && this.code === e.CBRACK_CODE && (a = false), this.index += this.code === 92 ? 2 : 1;
        }
        this.throwError("Unclosed Regex");
      }
    });
  }, "init") }, K = { name: "assignment", assignmentOperators: /* @__PURE__ */ new Set(["=", "*=", "**=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="]), updateOperators: [43, 45], assignmentPrecedence: 0.9, init: s(function(e) {
    var t = [e.IDENTIFIER, e.MEMBER_EXP];
    K.assignmentOperators.forEach(function(r) {
      return e.addBinaryOp(r, K.assignmentPrecedence, true);
    }), e.hooks.add("gobble-token", function(r) {
      var a = this, i = this.code;
      K.updateOperators.some(function(n) {
        return n === i && n === a.expr.charCodeAt(a.index + 1);
      }) && (this.index += 2, r.node = { type: "UpdateExpression", operator: i === 43 ? "++" : "--", argument: this.gobbleTokenProperty(this.gobbleIdentifier()), prefix: true }, r.node.argument && t.includes(r.node.argument.type) || this.throwError("Unexpected ".concat(r.node.operator)));
    }), e.hooks.add("after-token", function(r) {
      var a, i = this;
      r.node && (a = this.code, K.updateOperators.some(function(n) {
        return n === a && n === i.expr.charCodeAt(i.index + 1);
      }) && (t.includes(r.node.type) || this.throwError("Unexpected ".concat(r.node.operator)), this.index += 2, r.node = { type: "UpdateExpression", operator: a === 43 ? "++" : "--", argument: r.node, prefix: false }));
    }), e.hooks.add("after-expression", function(r) {
      r.node && s(function a(i) {
        K.assignmentOperators.has(i.operator) ? (i.type = "AssignmentExpression", a(i.left), a(i.right)) : i.operator || Object.values(i).forEach(function(n) {
          n && g(n) === "object" && a(n);
        });
      }, "t")(r.node);
    });
  }, "init") }, k = Object.prototype.hasOwnProperty;
  function W(e, t) {
    return (e = e.slice()).push(t), e;
  }
  s(W, "w");
  function te(e, t) {
    return (t = t.slice()).unshift(e), t;
  }
  s(te, "k");
  var Ce = (function() {
    function e(t) {
      var r;
      return B(this, e), (r = o(this, e, ['JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'])).avoidNew = true, r.value = t, r.name = "NewError", r;
    }
    return s(e, "r"), (function(t, r) {
      if (typeof r != "function" && r !== null) throw new TypeError("Super expression must either be null or a function");
      t.prototype = Object.create(r && r.prototype, { constructor: { value: t, writable: true, configurable: true } }), Object.defineProperty(t, "prototype", { writable: false }), r && G(t, r);
    })(e, ce(Error)), w(e);
  })();
  function y(e, t, r, a, i) {
    if (!(this instanceof y)) try {
      return new y(e, t, r, a, i);
    } catch (f) {
      if (!f.avoidNew) throw f;
      return f.value;
    }
    typeof e == "string" && (i = a, a = r, r = t, t = e, e = null);
    var n = e && g(e) === "object";
    if (e = e || {}, this.json = e.json || r, this.path = e.path || t, this.resultType = e.resultType || "value", this.flatten = e.flatten || false, this.wrap = !k.call(e, "wrap") || e.wrap, this.sandbox = e.sandbox || {}, this.eval = e.eval === void 0 ? "safe" : e.eval, this.ignoreEvalErrors = e.ignoreEvalErrors !== void 0 && e.ignoreEvalErrors, this.parent = e.parent || null, this.parentProperty = e.parentProperty || null, this.callback = e.callback || a || null, this.otherTypeCallback = e.otherTypeCallback || i || function() {
      throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.");
    }, e.autostart !== false) {
      var d2 = { path: n ? e.path : t };
      if (n ? "json" in e && (d2.json = e.json) : d2.json = r, d2 = this.evaluate(d2), !d2 || g(d2) !== "object") throw new Ce(d2);
      return d2;
    }
  }
  s(y, "F"), y.prototype.evaluate = function(e, t, r, a) {
    var i = this, n = this.parent, d2 = this.parentProperty, f = this.flatten, v = this.wrap;
    if (this.currResultType = this.resultType, this.currEval = this.eval, this.currSandbox = this.sandbox, r = r || this.callback, this.currOtherTypeCallback = a || this.otherTypeCallback, t = t || this.json, (e = e || this.path) && g(e) === "object" && !Array.isArray(e)) {
      if (!e.path && e.path !== "") throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
      if (!k.call(e, "json")) throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');
      t = e.json, f = k.call(e, "flatten") ? e.flatten : f, this.currResultType = k.call(e, "resultType") ? e.resultType : this.currResultType, this.currSandbox = k.call(e, "sandbox") ? e.sandbox : this.currSandbox, v = k.call(e, "wrap") ? e.wrap : v, this.currEval = k.call(e, "eval") ? e.eval : this.currEval, r = k.call(e, "callback") ? e.callback : r, this.currOtherTypeCallback = k.call(e, "otherTypeCallback") ? e.otherTypeCallback : this.currOtherTypeCallback, n = k.call(e, "parent") ? e.parent : n, d2 = k.call(e, "parentProperty") ? e.parentProperty : d2, e = e.path;
    }
    if (n = n || null, d2 = d2 || null, Array.isArray(e) && (e = y.toPathString(e)), (e || e === "") && t) return e = y.toPathArray(e), e[0] === "$" && 1 < e.length && e.shift(), this._hasParentSelector = null, r = this._trace(e, t, ["$"], n, d2, r).filter(function(h) {
      return h && !h.isParentSelector;
    }), r.length ? v || r.length !== 1 || r[0].hasArrExpr ? r.reduce(function(h, _) {
      return _ = i._getPreferredOutput(_), f && Array.isArray(_) ? h = h.concat(_) : h.push(_), h;
    }, []) : this._getPreferredOutput(r[0]) : v ? [] : void 0;
  }, y.prototype._getPreferredOutput = function(e) {
    var t = this.currResultType;
    switch (t) {
      case "all":
        var r = Array.isArray(e.path) ? e.path : y.toPathArray(e.path);
        return e.pointer = y.toPointer(r), e.path = typeof e.path == "string" ? e.path : y.toPathString(e.path), e;
      case "value":
      case "parent":
      case "parentProperty":
        return e[t];
      case "path":
        return y.toPathString(e[t]);
      case "pointer":
        return y.toPointer(e.path);
      default:
        throw new TypeError("Unknown result type");
    }
  }, y.prototype._handleCallback = function(e, t, r) {
    var a;
    t && (a = this._getPreferredOutput(e), e.path = typeof e.path == "string" ? e.path : y.toPathString(e.path), t(a, r, e));
  }, y.prototype._trace = function(e, t, r, a, i, n, d2, f) {
    var v = this;
    if (!e.length) return E = { path: r, value: t, parent: a, parentProperty: i, hasArrExpr: d2 }, this._handleCallback(E, n, "value"), E;
    var h = e[0], _ = e.slice(1), H = [];
    function S(u) {
      Array.isArray(u) ? u.forEach(function(O) {
        H.push(O);
      }) : H.push(u);
    }
    if (s(S, "p"), (typeof h != "string" || f) && t && k.call(t, h)) S(this._trace(_, t[h], W(r, h), t, h, n, d2));
    else if (h === "*") this._walk(t, function(u) {
      S(v._trace(_, t[u], W(r, u), t, u, n, true, true));
    });
    else if (h === "..") S(this._trace(_, t, r, a, i, n, d2)), this._walk(t, function(u) {
      g(t[u]) === "object" && S(v._trace(e.slice(), t[u], W(r, u), t, u, n, true));
    });
    else {
      if (h === "^") return this._hasParentSelector = true, { path: r.slice(0, -1), expr: _, isParentSelector: true };
      if (h === "~") return E = { path: W(r, h), value: i, parent: a, parentProperty: null }, this._handleCallback(E, n, "property"), E;
      if (h === "$") S(this._trace(_, t, r, null, null, n, d2));
      else if (/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(h)) S(this._slice(h, _, t, r, a, i, n));
      else if (h.indexOf("?(") === 0) {
        if (this.currEval === false) throw new Error("Eval [?(expr)] prevented in JSONPath expression.");
        var de = h.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/, "$1"), z = /@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])?((?:[\0->@-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))(?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\)\])['\]]/g.exec(de);
        z ? this._walk(t, function(u) {
          var O = [z[2]], M = z[1] ? t[u][z[1]] : t[u];
          0 < v._trace(O, M, r, a, i, n, true).length && S(v._trace(_, t[u], W(r, u), t, u, n, true));
        }) : this._walk(t, function(u) {
          v._eval(de, t[u], u, r, a, i) && S(v._trace(_, t[u], W(r, u), t, u, n, true));
        });
      } else if (h[0] === "(") {
        if (this.currEval === false) throw new Error("Eval [(expr)] prevented in JSONPath expression.");
        S(this._trace(te(this._eval(h, t, r[r.length - 1], r.slice(0, -1), a, i), _), t, r, a, i, n, d2));
      } else if (h[0] === "@") {
        var T = false, q = h.slice(1, -2);
        switch (q) {
          case "scalar":
            t && ["object", "function"].includes(g(t)) || (T = true);
            break;
          case "boolean":
          case "string":
          case "undefined":
          case "function":
            g(t) === q && (T = true);
            break;
          case "integer":
            !Number.isFinite(t) || t % 1 || (T = true);
            break;
          case "number":
            Number.isFinite(t) && (T = true);
            break;
          case "nonFinite":
            typeof t != "number" || Number.isFinite(t) || (T = true);
            break;
          case "object":
            t && g(t) === q && (T = true);
            break;
          case "array":
            Array.isArray(t) && (T = true);
            break;
          case "other":
            T = this.currOtherTypeCallback(t, r, a, i);
            break;
          case "null":
            t === null && (T = true);
            break;
          default:
            throw new TypeError("Unknown value type " + q);
        }
        if (T) return E = { path: r, value: t, parent: a, parentProperty: i }, this._handleCallback(E, n, "value"), E;
      } else if (h[0] === "`" && t && k.call(t, h.slice(1))) {
        var E = h.slice(1);
        S(this._trace(_, t[E], W(r, E), t, E, n, d2, true));
      } else if (h.includes(",")) {
        var J = (function(u, O) {
          var M = typeof Symbol < "u" && u[Symbol.iterator] || u["@@iterator"];
          if (!M) {
            if (Array.isArray(u) || (M = he(u)) || O && u && typeof u.length == "number") {
              M && (u = M);
              var fe = 0, O = s(function() {
              }, "t");
              return { s: O, n: s(function() {
                return fe >= u.length ? { done: true } : { done: false, value: u[fe++] };
              }, "n"), e: s(function(ke) {
                throw ke;
              }, "e"), f: O };
            }
            throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
          }
          var ue, pe = true, ye = false;
          return { s: s(function() {
            M = M.call(u);
          }, "s"), n: s(function() {
            var $ = M.next();
            return pe = $.done, $;
          }, "n"), e: s(function($) {
            ye = true, ue = $;
          }, "e"), f: s(function() {
            try {
              pe || M.return == null || M.return();
            } finally {
              if (ye) throw ue;
            }
          }, "f") };
        })(h.split(","));
        try {
          for (J.s(); !(re = J.n()).done; ) {
            var re = re.value;
            S(this._trace(te(re, _), t, r, a, i, n, true));
          }
        } catch (u) {
          J.e(u);
        } finally {
          J.f();
        }
      } else !f && t && k.call(t, h) && S(this._trace(_, t[h], W(r, h), t, h, n, d2, true));
    }
    if (this._hasParentSelector) for (var I = 0; I < H.length; I++) {
      var V = H[I];
      if (V && V.isParentSelector) {
        var j = this._trace(V.expr, t, V.path, a, i, n, d2);
        if (Array.isArray(j)) {
          H[I] = j[0];
          for (var Se = j.length, ae = 1; ae < Se; ae++) I++, H.splice(I, 0, j[ae]);
        } else H[I] = j;
      }
    }
    return H;
  }, y.prototype._walk = function(e, t) {
    if (Array.isArray(e)) for (var r = e.length, a = 0; a < r; a++) t(a);
    else e && g(e) === "object" && Object.keys(e).forEach(function(i) {
      t(i);
    });
  }, y.prototype._slice = function(e, t, r, a, i, n, d2) {
    if (Array.isArray(r)) {
      for (var f = r.length, v = e.split(":"), h = v[2] && Number.parseInt(v[2]) || 1, e = v[0] && Number.parseInt(v[0]) || 0, _ = v[1] && Number.parseInt(v[1]) || f, e = e < 0 ? Math.max(0, e + f) : Math.min(f, e), _ = _ < 0 ? Math.max(0, _ + f) : Math.min(f, _), H = [], S = e; S < _; S += h) this._trace(te(S, t), r, a, i, n, d2, true).forEach(function(z) {
        H.push(z);
      });
      return H;
    }
  }, y.prototype._eval = function(e, t, r, a, i, n) {
    var d2 = this;
    this.currSandbox._$_parentProperty = n, this.currSandbox._$_parent = i, this.currSandbox._$_property = r, this.currSandbox._$_root = this.json, this.currSandbox._$_v = t, t = e.includes("@path"), t && (this.currSandbox._$_path = y.toPathString(a.concat([r])));
    var f = this.currEval + "Script:" + e;
    if (!y.cache[f]) {
      var v = e.replace(/@parentProperty/g, "_$_parentProperty").replace(/@parent/g, "_$_parent").replace(/@property/g, "_$_property").replace(/@root/g, "_$_root").replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g, "_$_v$1");
      if (t && (v = v.replace(/@path/g, "_$_path")), this.currEval === "safe" || this.currEval === true || this.currEval === void 0) y.cache[f] = new this.safeVm.Script(v);
      else if (this.currEval === "native") y.cache[f] = new this.vm.Script(v);
      else if (typeof this.currEval == "function" && this.currEval.prototype && k.call(this.currEval.prototype, "runInNewContext")) t = this.currEval, y.cache[f] = new t(v);
      else {
        if (typeof this.currEval != "function") throw new TypeError('Unknown "eval" property "'.concat(this.currEval, '"'));
        y.cache[f] = { runInNewContext: s(function(h) {
          return d2.currEval(v, h);
        }, "runInNewContext") };
      }
    }
    try {
      return y.cache[f].runInNewContext(this.currSandbox);
    } catch (h) {
      if (this.ignoreEvalErrors) return false;
      throw new Error("jsonPath: " + h.message + ": " + e);
    }
  }, y.cache = {}, y.toPathString = function(e) {
    for (var t = e, r = t.length, a = "$", i = 1; i < r; i++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t[i]) || (a += /^[\*0-9]+$/.test(t[i]) ? "[" + t[i] + "]" : "['" + t[i] + "']");
    return a;
  }, y.toPointer = function(e) {
    for (var t = e, r = t.length, a = "", i = 1; i < r; i++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t[i]) || (a += "/" + t[i].toString().replace(/~/g, "~0").replace(/\//g, "~1"));
    return a;
  }, y.toPathArray = function(e) {
    var t = y.cache;
    if (t[e]) return t[e].concat();
    var r = [], a = e.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g, ";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]](?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\])/g, function(i, n) {
      return "[#" + (r.push(n) - 1) + "]";
    }).replace(/\[["']((?:[\0-&\(-\\\^-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)["']\]/g, function(i, n) {
      return "['" + n.replace(/\./g, "%@%").replace(/~/g, "%%@@%%") + "']";
    }).replace(/~/g, ";~;").replace(/["']?\.["']?(?!(?:[\0-Z\\-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*\])|\[["']?/g, ";").replace(/%@%/g, ".").replace(/%%@@%%/g, "~").replace(/(?:;)?(\^+)(?:;)?/g, function(i, n) {
      return ";" + n.split("").join(";") + ";";
    }).replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "").split(";").map(function(i) {
      var n = i.match(/#([0-9]+)/);
      return n && n[1] ? r[n[1]] : i;
    });
    return t[e] = a, t[e].concat();
  }, R.plugins.register(D, K);
  var b = { evalAst: s(function(e, t) {
    switch (e.type) {
      case "BinaryExpression":
      case "LogicalExpression":
        return b.evalBinaryExpression(e, t);
      case "Compound":
        return b.evalCompound(e, t);
      case "ConditionalExpression":
        return b.evalConditionalExpression(e, t);
      case "Identifier":
        return b.evalIdentifier(e, t);
      case "Literal":
        return b.evalLiteral(e, t);
      case "MemberExpression":
        return b.evalMemberExpression(e, t);
      case "UnaryExpression":
        return b.evalUnaryExpression(e, t);
      case "ArrayExpression":
        return b.evalArrayExpression(e, t);
      case "CallExpression":
        return b.evalCallExpression(e, t);
      case "AssignmentExpression":
        return b.evalAssignmentExpression(e, t);
      default:
        throw SyntaxError("Unexpected expression", e);
    }
  }, "evalAst"), evalBinaryExpression: s(function(e, t) {
    return { "||": s(function(r, a) {
      return r || a();
    }, "||"), "&&": s(function(r, a) {
      return r && a();
    }, "&&"), "|": s(function(r, a) {
      return r | a();
    }, "|"), "^": s(function(r, a) {
      return r ^ a();
    }, "^"), "&": s(function(r, a) {
      return r & a();
    }, "&"), "==": s(function(r, a) {
      return r == a();
    }, "=="), "!=": s(function(r, a) {
      return r != a();
    }, "!="), "===": s(function(r, a) {
      return r === a();
    }, "==="), "!==": s(function(r, a) {
      return r !== a();
    }, "!=="), "<": s(function(r, a) {
      return r < a();
    }, "<"), ">": s(function(r, a) {
      return r > a();
    }, ">"), "<=": s(function(r, a) {
      return r <= a();
    }, "<="), ">=": s(function(r, a) {
      return r >= a();
    }, ">="), "<<": s(function(r, a) {
      return r << a();
    }, "<<"), ">>": s(function(r, a) {
      return r >> a();
    }, ">>"), ">>>": s(function(r, a) {
      return r >>> a();
    }, ">>>"), "+": s(function(r, a) {
      return r + a();
    }, "+"), "-": s(function(r, a) {
      return r - a();
    }, "-"), "*": s(function(r, a) {
      return r * a();
    }, "*"), "/": s(function(r, a) {
      return r / a();
    }, "/"), "%": s(function(r, a) {
      return r % a();
    }, "%") }[e.operator](b.evalAst(e.left, t), function() {
      return b.evalAst(e.right, t);
    });
  }, "evalBinaryExpression"), evalCompound: s(function(e, t) {
    for (var r = 0; r < e.body.length; r++) {
      e.body[r].type === "Identifier" && ["var", "let", "const"].includes(e.body[r].name) && e.body[r + 1] && e.body[r + 1].type === "AssignmentExpression" && (r += 1);
      var a = e.body[r], i = b.evalAst(a, t);
    }
    return i;
  }, "evalCompound"), evalConditionalExpression: s(function(e, t) {
    return b.evalAst(e.test, t) ? b.evalAst(e.consequent, t) : b.evalAst(e.alternate, t);
  }, "evalConditionalExpression"), evalIdentifier: s(function(e, t) {
    if (e.name in t) return t[e.name];
    throw ReferenceError("".concat(e.name, " is not defined"));
  }, "evalIdentifier"), evalLiteral: s(function(e) {
    return e.value;
  }, "evalLiteral"), evalMemberExpression: s(function(e, r) {
    var a = e.computed ? b.evalAst(e.property) : e.property.name, r = b.evalAst(e.object, r), a = r[a];
    return typeof a == "function" ? a.bind(r) : a;
  }, "evalMemberExpression"), evalUnaryExpression: s(function(e, t) {
    return { "-": s(function(r) {
      return -b.evalAst(r, t);
    }, "-"), "!": s(function(r) {
      return !b.evalAst(r, t);
    }, "!"), "~": s(function(r) {
      return ~b.evalAst(r, t);
    }, "~"), "+": s(function(r) {
      return +b.evalAst(r, t);
    }, "+") }[e.operator](e.argument);
  }, "evalUnaryExpression"), evalArrayExpression: s(function(e, t) {
    return e.elements.map(function(r) {
      return b.evalAst(r, t);
    });
  }, "evalArrayExpression"), evalCallExpression: s(function(e, t) {
    var r = e.arguments.map(function(a) {
      return b.evalAst(a, t);
    });
    return b.evalAst(e.callee, t).apply(void 0, Q(r));
  }, "evalCallExpression"), evalAssignmentExpression: s(function(a, t) {
    if (a.left.type !== "Identifier") throw SyntaxError("Invalid left-hand side in assignment");
    var r = a.left.name, a = b.evalAst(a.right, t);
    return t[r] = a, t[r];
  }, "evalAssignmentExpression") }, D = (function() {
    return w(s(function e(t) {
      B(this, e), this.code = t, this.ast = R(this.code);
    }, "e"), [{ key: "runInNewContext", value: s(function(e) {
      return e = x({}, e), b.evalAst(this.ast, e);
    }, "value") }]);
  })();
  y.prototype.vm = { Script: (function() {
    return w(s(function e(t) {
      B(this, e), this.code = t;
    }, "e"), [{ key: "runInNewContext", value: s(function(e) {
      var t = this.code, r = Object.keys(e), i = [];
      (function(n, d2, f) {
        for (var v = n.length, h = 0; h < v; h++) f(n[h]) && d2.push(n.splice(h--, 1)[0]);
      })(r, i, function(n) {
        return typeof e[n] == "function";
      });
      var a = r.map(function(n) {
        return e[n];
      }), i = i.reduce(function(n, d2) {
        var f = e[d2].toString();
        return /function/.test(f) || (f = "function " + f), "var " + d2 + "=" + f + ";" + n;
      }, "");
      return /(["'])use strict\1/.test(t = i + t) || r.includes("arguments") || (t = "var arguments = undefined;" + t), i = (t = t.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/, "")).lastIndexOf(";"), t = -1 < i ? t.slice(0, i + 1) + " return " + t.slice(i + 1) : " return " + t, l(Function, r.concat([t])).apply(void 0, Q(a));
    }, "value") }]);
  })() }, y.prototype.safeVm = { Script: D }, c.JSONPath = y, c.SafeScript = D;
});
var me = `(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?factory(exports):typeof define==="function"&&define.amd?define(["exports"],factory):(global=typeof globalThis!=="undefined"?globalThis:global||self,factory(global.jinja={}))})(this,function(jinja){"use strict";var STRINGS=/'(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"/g;var IDENTS_AND_NUMS=/([$_a-z][$\\w]*)|([+-]?\\d+(\\.\\d+)?)/g;var NUMBER=/^[+-]?\\d+(\\.\\d+)?$/;var NON_PRIMITIVES=/\\[[@#~](,[@#~])*\\]|\\[\\]|\\{([@i]:[@#~])(,[@i]:[@#~])*\\}|\\{\\}/g;var IDENTIFIERS=/[$_a-z][$\\w]*/gi;var VARIABLES=/i(\\.i|\\[[@#i]\\])*/g;var ACCESSOR=/(\\.i|\\[[@#i]\\])/g;var OPERATORS=/(===?|!==?|>=?|<=?|&&|\\|\\||[+\\-\\*\\/%])/g;var EOPS=/(^|[^$\\w])(and|or|not|is|isnot)([^$\\w]|$)/g;var LEADING_SPACE=/^\\s+/;var TRAILING_SPACE=/\\s+$/;var START_TOKEN=/\\{\\{\\{|\\{\\{|\\{%|\\{#/;var TAGS={"{{{":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?\\}\\}\\}/,"{{":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?\\}\\}/,"{%":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?%\\}/,"{#":/^('(\\\\.|[^'])*'|"(\\\\.|[^"'"])*"|.)+?#\\}/};var delimeters={"{%":"directive","{{":"output","{#":"comment"};var operators={and:"&&",or:"||",not:"!",is:"==",isnot:"!="};var constants={true:true,false:false,null:null};function Parser(){this.nest=[];this.compiled=[];this.childBlocks=0;this.parentBlocks=0;this.isSilent=false}Parser.prototype.push=function(line){if(!this.isSilent){this.compiled.push(line)}};Parser.prototype.parse=function(src){this.tokenize(src);return this.compiled};Parser.prototype.tokenize=function(src){var lastEnd=0,parser=this,trimLeading=false;matchAll(src,START_TOKEN,function(open,index,src){var match=src.slice(index+open.length).match(TAGS[open]);match=match?match[0]:"";var simplified=match.replace(STRINGS,"@");if(!match||~simplified.indexOf(open)){return index+1}var inner=match.slice(0,0-open.length);if(inner.charAt(0)==="-")var wsCollapseLeft=true;if(inner.slice(-1)==="-")var wsCollapseRight=true;inner=inner.replace(/^-|-$/g,"").trim();if(parser.rawMode&&open+inner!=="{%endraw"){return index+1}var text=src.slice(lastEnd,index);lastEnd=index+open.length+match.length;if(trimLeading)text=trimLeft(text);if(wsCollapseLeft)text=trimRight(text);if(wsCollapseRight)trimLeading=true;if(open==="{{{"){open="{{";inner+="|safe"}parser.textHandler(text);parser.tokenHandler(open,inner)});var text=src.slice(lastEnd);if(trimLeading)text=trimLeft(text);this.textHandler(text)};Parser.prototype.textHandler=function(text){this.push("write("+JSON.stringify(text)+");")};Parser.prototype.tokenHandler=function(open,inner){var type=delimeters[open];if(type==="directive"){this.compileTag(inner)}else if(type==="output"){var extracted=this.extractEnt(inner,STRINGS,"@");extracted.src=extracted.src.replace(/\\|\\|/g,"~").split("|");extracted.src=extracted.src.map(function(part){return part.split("~").join("||")});var parts=this.injectEnt(extracted,"@");if(parts.length>1){var filters=parts.slice(1).map(this.parseFilter.bind(this));this.push("filter("+this.parseExpr(parts[0])+","+filters.join(",")+");")}else{this.push("filter("+this.parseExpr(parts[0])+");")}}};Parser.prototype.compileTag=function(str){var directive=str.split(" ")[0];var handler=tagHandlers[directive];if(!handler){throw new Error("Invalid tag: "+str)}handler.call(this,str.slice(directive.length).trim())};Parser.prototype.parseFilter=function(src){src=src.trim();var match=src.match(/[:(]/);var i=match?match.index:-1;if(i<0)return JSON.stringify([src]);var name=src.slice(0,i);var args=src.charAt(i)===":"?src.slice(i+1):src.slice(i+1,-1);args=this.parseExpr(args,{terms:true});return"["+JSON.stringify(name)+","+args+"]"};Parser.prototype.extractEnt=function(src,regex,placeholder){var subs=[],isFunc=typeof placeholder=="function";src=src.replace(regex,function(str){var replacement=isFunc?placeholder(str):placeholder;if(replacement){subs.push(str);return replacement}return str});return{src:src,subs:subs}};Parser.prototype.injectEnt=function(extracted,placeholder){var src=extracted.src,subs=extracted.subs,isArr=Array.isArray(src);var arr=isArr?src:[src];var re=new RegExp("["+placeholder+"]","g"),i=0;arr.forEach(function(src,index){arr[index]=src.replace(re,function(){return subs[i++]})});return isArr?arr:arr[0]};Parser.prototype.replaceComplex=function(s){var parsed=this.extractEnt(s,/i(\\.i|\\[[@#i]\\])+/g,"v");parsed.src=parsed.src.replace(NON_PRIMITIVES,"~");return this.injectEnt(parsed,"v")};Parser.prototype.parseExpr=function(src,opts){opts=opts||{};var parsed1=this.extractEnt(src,STRINGS,"@");parsed1.src=parsed1.src.replace(EOPS,function(s,before,op,after){return op in operators?before+operators[op]+after:s});var parsed2=this.extractEnt(parsed1.src,IDENTS_AND_NUMS,function(s){return s in constants||NUMBER.test(s)?"#":null});var parsed3=this.extractEnt(parsed2.src,IDENTIFIERS,"i");parsed3.src=parsed3.src.replace(/\\s+/g,"");var simplified=parsed3.src;while(simplified!==(simplified=this.replaceComplex(simplified)));while(simplified!==(simplified=simplified.replace(/i(\\.i|\\[[@#i]\\])+/,"v")));simplified=simplified.replace(/[iv]\\[v?\\]/g,"x");simplified=simplified.replace(/[@#~v]/g,"i");simplified=simplified.replace(OPERATORS,"%");simplified=simplified.replace(/!+[i]/g,"i");var terms=opts.terms?simplified.split(","):[simplified];terms.forEach(function(term){while(term!==(term=term.replace(/\\(i(%i)*\\)/g,"i")));if(!term.match(/^i(%i)*/)){throw new Error("Invalid expression: "+src+" "+term)}});parsed3.src=parsed3.src.replace(VARIABLES,this.parseVar.bind(this));parsed2.src=this.injectEnt(parsed3,"i");parsed1.src=this.injectEnt(parsed2,"#");return this.injectEnt(parsed1,"@")};Parser.prototype.parseVar=function(src){var args=Array.prototype.slice.call(arguments);var str=args.pop(),index=args.pop();if(src==="i"&&str.charAt(index+1)===":"){return'"i"'}var parts=['"i"'];src.replace(ACCESSOR,function(part){if(part===".i"){parts.push('"i"')}else if(part==="[i]"){parts.push('get("i")')}else{parts.push(part.slice(1,-1))}});return"get("+parts.join(",")+")"};Parser.prototype.escName=function(str){return str.replace(/\\W/g,function(s){return"$"+s.charCodeAt(0).toString(16)})};Parser.prototype.parseQuoted=function(str){if(str.charAt(0)==="'"){str=str.slice(1,-1).replace(/\\\\.|"/,function(s){if(s==="\\\\'")return"'";return s.charAt(0)==="\\\\"?s:"\\\\"+s});str='"'+str+'"'}return JSON.parse(str)};var tagHandlers={if:function(expr){this.push("if ("+this.parseExpr(expr)+") {");this.nest.unshift("if")},else:function(){if(this.nest[0]==="for"){this.push("}, function() {")}else{this.push("} else {")}},elseif:function(expr){this.push("} else if ("+this.parseExpr(expr)+") {")},endif:function(){this.nest.shift();this.push("}")},for:function(str){var i=str.indexOf(" in ");var name=str.slice(0,i).trim();var expr=str.slice(i+4).trim();this.push("each("+this.parseExpr(expr)+","+JSON.stringify(name)+",function() {");this.nest.unshift("for")},endfor:function(){this.nest.shift();this.push("});")},raw:function(){this.rawMode=true},endraw:function(){this.rawMode=false},set:function(stmt){var i=stmt.indexOf("=");var name=stmt.slice(0,i).trim();var expr=stmt.slice(i+1).trim();this.push("set("+JSON.stringify(name)+","+this.parseExpr(expr)+");")},block:function(name){if(this.isParent){++this.parentBlocks;var blockName="block_"+(this.escName(name)||this.parentBlocks);this.push("block(typeof "+blockName+' == "function" ? '+blockName+" : function() {")}else if(this.hasParent){this.isSilent=false;++this.childBlocks;blockName="block_"+(this.escName(name)||this.childBlocks);this.push("function "+blockName+"() {")}this.nest.unshift("block")},endblock:function(){this.nest.shift();if(this.isParent){this.push("});")}else if(this.hasParent){this.push("}");this.isSilent=true}},extends:function(name){name=this.parseQuoted(name);var parentSrc=this.readTemplateFile(name);this.isParent=true;this.tokenize(parentSrc);this.isParent=false;this.hasParent=true;this.isSilent=true},include:function(name){name=this.parseQuoted(name);var incSrc=this.readTemplateFile(name);this.isInclude=true;this.tokenize(incSrc);this.isInclude=false}};tagHandlers.assign=tagHandlers.set;tagHandlers.elif=tagHandlers.elseif;var getRuntime=function runtime(data,opts){var defaults={autoEscape:"toJson"};var _toString=Object.prototype.toString;var _hasOwnProperty=Object.prototype.hasOwnProperty;var getKeys=Object.keys||function(obj){var keys=[];for(var n in obj)if(_hasOwnProperty.call(obj,n))keys.push(n);return keys};var isArray=Array.isArray||function(obj){return _toString.call(obj)==="[object Array]"};var create=Object.create||function(obj){function F(){}F.prototype=obj;return new F};var toString=function(val){if(val==null)return"";return typeof val.toString=="function"?val.toString():_toString.call(val)};var extend=function(dest,src){var keys=getKeys(src);for(var i=0,len=keys.length;i<len;i++){var key=keys[i];dest[key]=src[key]}return dest};var get=function(){var val,n=arguments[0],c=stack.length;while(c--){val=stack[c][n];if(typeof val!="undefined")break}for(var i=1,len=arguments.length;i<len;i++){if(val==null)continue;n=arguments[i];val=_hasOwnProperty.call(val,n)?val[n]:typeof val._get=="function"?val[n]=val._get(n):null}return val==null?"":val};var set=function(n,val){stack[stack.length-1][n]=val};var push=function(ctx){stack.push(ctx||{})};var pop=function(){stack.pop()};var write=function(str){output.push(str)};var filter=function(val){for(var i=1,len=arguments.length;i<len;i++){var arr=arguments[i],name=arr[0],filter=filters[name];if(filter){arr[0]=val;val=filter.apply(data,arr)}else{throw new Error("Invalid filter: "+name)}}if(opts.autoEscape&&name!==opts.autoEscape&&name!=="safe"){val=filters[opts.autoEscape].call(data,val)}output.push(val)};var each=function(obj,loopvar,fn1,fn2){if(obj==null)return;var arr=isArray(obj)?obj:getKeys(obj),len=arr.length;var ctx={loop:{length:len,first:arr[0],last:arr[len-1]}};push(ctx);for(var i=0;i<len;i++){extend(ctx.loop,{index:i+1,index0:i});fn1(ctx[loopvar]=arr[i])}if(len===0&&fn2)fn2();pop()};var block=function(fn){push();fn();pop()};var render=function(){return output.join("")};data=data||{};opts=extend(defaults,opts||{});var filters=extend({html:function(val){return toString(val).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;")},safe:function(val){return val},toJson:function(val){if(typeof val==="object"){return JSON.stringify(val)}return toString(val)}},opts.filters||{});var stack=[create(data||{})],output=[];return{get:get,set:set,push:push,pop:pop,write:write,filter:filter,each:each,block:block,render:render}};var runtime;jinja.compile=function(markup,opts){opts=opts||{};var parser=new Parser;parser.readTemplateFile=this.readTemplateFile;var code=[];code.push("function render($) {");code.push("var get = $.get, set = $.set, push = $.push, pop = $.pop, write = $.write, filter = $.filter, each = $.each, block = $.block;");code.push.apply(code,parser.parse(markup));code.push("return $.render();");code.push("}");code=code.join("\\n");if(opts.runtime===false){var fn=new Function("data","options","return ("+code+")(runtime(data, options))")}else{runtime=runtime||(runtime=getRuntime.toString());fn=new Function("data","options","return ("+code+")(("+runtime+")(data, options))")}return{render:fn}};jinja.render=function(markup,data,opts){var tmpl=jinja.compile(markup);return tmpl.render(data,opts)};jinja.templateFiles=[];jinja.readTemplateFile=function(name){var templateFiles=this.templateFiles||[];var templateFile=templateFiles[name];if(templateFile==null){throw new Error("Template file not found: "+name)}return templateFile};function trimLeft(str){return str.replace(LEADING_SPACE,"")}function trimRight(str){return str.replace(TRAILING_SPACE,"")}function matchAll(str,reg,fn){reg=new RegExp(reg.source,"g"+(reg.ignoreCase?"i":"")+(reg.multiline?"m":""));var match;while(match=reg.exec(str)){var result=fn(match[0],match.index,str);if(typeof result=="number"){reg.lastIndex=result}}}});`;
var X = s((c) => {
  let o = globalThis[c];
  if (!o) throw new Error(`[drpy-core-qjs] \u7F3A\u5C11 so \u5168\u5C40 ${c}\uFF08\u9700 libquickjs_bridge.so \u5BBF\u4E3B\uFF09`);
  return o;
}, "soRequire");
var L = X("Buffer");
var Ye = X("WebAssembly");
var Fe = X("TextEncoder");
var We = X("TextDecoder");
var oe = X("zlib");
(0, eval)(`var exports=undefined, module=undefined, define=undefined;
` + ve);
var Qe = X("CryptoJS");
var Ze = { gzip: s((c) => new Uint8Array(oe.gzip(typeof c == "string" ? L.from(c, "utf8") : L.from(c))), "gzip"), inflate: s((c, o) => {
  let l = oe.unzip(L.from(c));
  return o && o.to === "string" ? L.from(l).toString("utf8") : new Uint8Array(l);
}, "inflate"), gunzip: s((c, o) => {
  let l = oe.gunzip(L.from(c));
  return o && o.to === "string" ? L.from(l).toString("utf8") : new Uint8Array(l);
}, "gunzip") };
var De = new Fe("gbk");
var xe = new We("gbk", { fatal: true });
var Oe = s((c) => c === 8364 || c <= 127 && c >= 0, "_isAscii");
var et = { encode(c) {
  let o = String(c), l = "";
  for (let p2 of o) {
    let m = p2.codePointAt(0);
    if (Oe(m)) {
      l += encodeURIComponent(p2);
      continue;
    }
    let x = m <= 65535;
    if (x) {
      let C = De.encode(p2);
      try {
        xe.decode(C) !== p2 && (x = false);
      } catch {
        x = false;
      }
      if (x) {
        for (let g = 0; g < C.length; g++) l += "%" + C[g].toString(16).toUpperCase();
        continue;
      }
    }
    l += p2;
  }
  return l;
}, decode(c) {
  return String(c).replace(/%[0-9A-F]{2}%[0-9A-F]{2}/g, (o) => {
    try {
      let l = new Uint8Array([parseInt(o.slice(1, 3), 16), parseInt(o.slice(4, 6), 16)]);
      return xe.decode(l);
    } catch {
      return o;
    }
  }).replace(/%[\w]{2}/g, (o) => decodeURIComponent(o));
} };
var le;
globalThis.__DRPY3_NO_JINJA ? le = { render: s(() => {
  throw new Error("jinja stub\uFF08\u4E8C\u5206\u8BCA\u65AD\u6A21\u5F0F\uFF09");
}, "render") } : ((0, eval)(`var exports=undefined, module=undefined, define=undefined;
` + me), le = X("jinja"));
U.prototype.encryptUnicodeLong = U.prototype.encrypt;
U.prototype.decryptUnicodeLong = U.prototype.decrypt;
var Pe = globalThis.JSONPath;
var tt = { jinja2(c, o) {
  return le.render(c, o);
}, jp(c, o) {
  return Pe.JSONPath({ path: c, json: o })[0];
} };
var rt = globalThis.NODERSA;

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
function makeUtils(rt3) {
  return {
    UA,
    joinUrl: (base, path) => rt3.resolve("joinUrl")(base, path),
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
      const gp = rt3.resolve("getProxy");
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
function makeNet(rt3, ctx2) {
  const net = {
    /** 单次请求：返回 {content, headers}。buffer:1→Uint8Array / 2→base64 / 缺省→文本（§6.2） */
    async req(url2, options) {
      if (!url2) return { content: "", headers: {} };
      const fn = rt3.resolve("req");
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
      const hostFn = rt3.resolve("batchFetch");
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
function clean(s2) {
  return String(s2 == null ? "" : s2).replace(/\n|\t/g, "").trim();
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
function makeParse(rt3) {
  const parse = {
    pdfh: (html, parseRule2, baseUrl = "") => rt3.resolve("pdfh")(html, parseRule2, baseUrl),
    pdfa: (html, parseRule2) => rt3.resolve("pdfa")(html, parseRule2),
    pd: (html, parseRule2, baseUrl = "") => rt3.resolve("pd")(html, parseRule2, baseUrl),
    // pdfl 必注入（批量整表解析，drpy2.1 加速语义）；此处保留逐元素回退仅为
    // 兼容未注入的宿主（正确性一致，性能退化）——capabilities.pdfl 会诚实标 missing
    pdfl: (html, parseRule2, listText, listUrl, myUrl) => {
      const host = rt3.resolve("pdfl");
      if (typeof host === "function") {
        return host(html, parseRule2, listText, listUrl, myUrl);
      }
      const items = rt3.resolve("pdfa")(html, parseRule2) || [];
      return items.map((it) => `${rt3.resolve("pdfh")(it, listText)}$${rt3.resolve("pd")(it, listUrl, myUrl)}`);
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
function makeCrypto(rt3) {
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
  let s2 = "";
  const CHUNK = 32768;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s2 += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return hashStr(s2);
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
  const atobShim = (s2) => {
    const bytes = b64ToBytes(s2);
    let out = "";
    for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
    return out;
  };
  const btoaShim = (s2) => peer_exports.CryptoJS.enc.Base64.stringify(peer_exports.CryptoJS.enc.Utf8.parse(s2));
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
function makeWasm(rt3) {
  const cache = rt3.__wasmCache || (rt3.__wasmCache = /* @__PURE__ */ new Map());
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
        const req = rt3.resolve("req");
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
      const loader = rt3.resolve("loadAsset");
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
function runtimeNs(rt3, name, factory) {
  if (!rt3.__libCache) rt3.__libCache = {};
  if (!rt3.__libCache[name]) rt3.__libCache[name] = factory(rt3);
  return rt3.__libCache[name];
}
function pick(ns, names) {
  const out = {};
  for (const n of names) if (ns[n] !== void 0) out[n] = ns[n];
  return out;
}
function buildCtx(instance, call = {}) {
  const rt3 = instance.rt;
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
    log: (...args) => rt3.resolve("log")(...args),
    store: instance.store,
    cache: instance.cache,
    capabilities: rt3.capabilities,
    __sync: !!instance.is2x,
    // load2x 片段作用域开关：request 走同步桥（drpy2 同步语义）
    __rt: rt3
    // 片段同步桥需要 rt 解析 syncReq
  };
  ctx2.lib = {
    net: makeNet(rt3, ctx2),
    // net 绑定调用态（headers 合并需要 ctx）
    parse: runtimeNs(rt3, "parse", makeParse),
    crypto: runtimeNs(rt3, "crypto", makeCrypto),
    text: runtimeNs(rt3, "text", makeText),
    utils: runtimeNs(rt3, "utils", makeUtils),
    wasm: runtimeNs(rt3, "wasm", makeWasm),
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
  initFields(rt3, def, opts = {}) {
    this.rt = rt3;
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
    this.store = makeStore(rt3.resolve("store"), this.key);
    this.hot = false;
    this.lastUsed = 0;
    this.inFlight = 0;
    this.signature = opts.signature || "";
    this.headersSnapshot = null;
    this.stateVersion = this.meta.stateVersion || "";
    this.pinned = (rt3.pinList || []).includes(this.key);
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
function createSource(rt3, def, opts = {}) {
  const proto = Object.assign(Object.create(sourceProto), def);
  const inst = Object.create(proto);
  sourceProto.initFields.call(inst, rt3, def, opts);
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
  constructor(rt3, opts = {}) {
    this.rt = rt3;
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
    return this.sourcesList().filter((s2) => s2.hot && !s2.pinned && s2.inFlight === 0).sort((a, b) => this._score(a) - this._score(b) || a.lastUsed - b.lastUsed);
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
    let hotCount = this.sourcesList().filter((s2) => s2.hot).length;
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
function createSource2x(rt3, code, opts = {}) {
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
  const src = createSource(rt3, { meta, rule: rule2 }, { ...opts, key: opts.key || "drpy_" + (rule2.title || rule2.host) });
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
async function evalSourceCjs(code, opts, rt3) {
  const loadAsset = rt3.resolve("loadAsset");
  if (typeof loadAsset !== "function") {
    throw new Drpy3Error("load", "module", "\u6A21\u5F0F C \u9700\u8981 HostEnv \u6CE8\u5165 loadAsset(path)\u2014\u2014\u8BFB\u53D6\u968F\u6E90\u6A21\u5757\u6587\u4EF6");
  }
  const cache = /* @__PURE__ */ new Map();
  const entryDir = opts && opts.path ? opts.path.replace(/[^/]*$/, "") : "";
  function makeRequire(dir) {
    return (spec) => {
      if (spec === "drpy3") return { defineSource: (s2) => s2 };
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
function makeSyncNet(rt3, ctx2) {
  return (u, o, method) => {
    const syncReq = rt3.resolve("syncReq");
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
    encodeUrl: (s2) => encodeURI(s2),
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
function stripJs(s2) {
  return String(s2).trim().replace(/^js:/, "").trim();
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
  function n(e2, t2, r2) {
    return t2 = l(t2), (function(e3, t3) {
      {
        if (t3 && ("object" == typeof t3 || "function" == typeof t3)) return t3;
        if (void 0 !== t3) throw new TypeError("Derived constructors may only return object or undefined");
      }
      return (function(e4) {
        if (void 0 !== e4) return e4;
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      })(e3);
    })(e2, i() ? Reflect.construct(t2, r2 || [], l(e2).constructor) : t2.apply(e2, r2));
  }
  function o(e2, t2, r2) {
    if (i()) return Reflect.construct.apply(null, arguments);
    var n2 = [null];
    n2.push.apply(n2, t2);
    n2 = new (e2.bind.apply(e2, n2))();
    return r2 && h(n2, r2.prototype), n2;
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
    var r2, n2 = Object.keys(t2);
    return Object.getOwnPropertySymbols && (r2 = Object.getOwnPropertySymbols(t2), e2 && (r2 = r2.filter(function(e3) {
      return Object.getOwnPropertyDescriptor(t2, e3).enumerable;
    })), n2.push.apply(n2, r2)), n2;
  }
  function r(n2) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var i2 = null != arguments[e2] ? arguments[e2] : {};
      e2 % 2 ? t(Object(i2), true).forEach(function(e3) {
        var t2, r2;
        t2 = n2, e3 = i2[r2 = e3], (r2 = a(r2)) in t2 ? Object.defineProperty(t2, r2, { value: e3, enumerable: true, configurable: true, writable: true }) : t2[r2] = e3;
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n2, Object.getOwnPropertyDescriptors(i2)) : t(Object(i2)).forEach(function(e3) {
        Object.defineProperty(n2, e3, Object.getOwnPropertyDescriptor(i2, e3));
      });
    }
    return n2;
  }
  function a(e2) {
    e2 = (function(e3, t2) {
      if ("object" != typeof e3 || !e3) return e3;
      var r2 = e3[Symbol.toPrimitive];
      if (void 0 === r2) return ("string" === t2 ? String : Number)(e3);
      if ("object" != typeof (t2 = r2.call(e3, t2 || "default"))) return t2;
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
  function s2(e2, t2) {
    if (!(e2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
  }
  function u(e2, t2) {
    for (var r2 = 0; r2 < t2.length; r2++) {
      var n2 = t2[r2];
      n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, a(n2.key), n2);
    }
  }
  function c(e2, t2, r2) {
    return t2 && u(e2.prototype, t2), r2 && u(e2, r2), Object.defineProperty(e2, "prototype", { writable: false }), e2;
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
    var r2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
    return (p2 = function(e3) {
      if (null === e3 || !(function(t3) {
        try {
          return -1 !== Function.toString.call(t3).indexOf("[native code]");
        } catch (e4) {
          return "function" == typeof t3;
        }
      })(e3)) return e3;
      if ("function" != typeof e3) throw new TypeError("Super expression must either be null or a function");
      if (void 0 !== r2) {
        if (r2.has(e3)) return r2.get(e3);
        r2.set(e3, t2);
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
      var r2 = Object.prototype.toString.call(e2).slice(8, -1);
      return "Object" === r2 && e2.constructor && (r2 = e2.constructor.name), "Map" === r2 || "Set" === r2 ? Array.from(e2) : "Arguments" === r2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r2) ? d2(e2, t2) : void 0;
    }
  }
  function d2(e2, t2) {
    (null == t2 || t2 > e2.length) && (t2 = e2.length);
    for (var r2 = 0, n2 = new Array(t2); r2 < t2; r2++) n2[r2] = e2[r2];
    return n2;
  }
  var y = (function() {
    return c(function e2() {
      s2(this, e2);
    }, [{ key: "add", value: function(e2, t2, r2) {
      if ("string" != typeof e2) for (var n2 in e2) this.add(n2, e2[n2], t2);
      else (Array.isArray(e2) ? e2 : [e2]).forEach(function(e3) {
        this[e3] = this[e3] || [], t2 && this[e3][r2 ? "unshift" : "push"](t2);
      }, this);
    } }, { key: "run", value: function(e2, t2) {
      this[e2] = this[e2] || [], this[e2].forEach(function(e3) {
        e3.call(t2 && t2.context ? t2.context : t2, t2);
      });
    } }]);
  })(), b = (function() {
    return c(function e2(t2) {
      s2(this, e2), this.jsep = t2, this.registered = {};
    }, [{ key: "register", value: function() {
      for (var t2 = this, e2 = arguments.length, r2 = new Array(e2), n2 = 0; n2 < e2; n2++) r2[n2] = arguments[n2];
      r2.forEach(function(e3) {
        if ("object" !== C(e3) || !e3.name || !e3.init) throw new Error("Invalid JSEP plugin format");
        t2.registered[e3.name] || (e3.init(t2.jsep), t2.registered[e3.name] = e3);
      });
    } }]);
  })(), v = (function() {
    function l2(e2) {
      s2(this, l2), this.expr = e2, this.index = 0;
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
        var r2 = { context: this, node: t2 };
        return l2.hooks.run(e2, r2), r2.node;
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
      for (var t2, r2, n2 = []; this.index < this.expr.length; ) if ((t2 = this.code) === l2.SEMCOL_CODE || t2 === l2.COMMA_CODE) this.index++;
      else if (r2 = this.gobbleExpression()) n2.push(r2);
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
      var e2, t2, r2, n2, i2, o2, a2, s3, u2, c2 = this.gobbleToken();
      if (!c2) return c2;
      if (!(t2 = this.gobbleBinaryOp())) return c2;
      for (i2 = { value: t2, prec: l2.binaryPrecedence(t2), right_a: l2.right_associative.has(t2) }, (o2 = this.gobbleToken()) || this.throwError("Expected expression after " + t2), n2 = [c2, i2, o2]; t2 = this.gobbleBinaryOp(); ) {
        if (0 === (r2 = l2.binaryPrecedence(t2))) {
          this.index -= t2.length;
          break;
        }
        i2 = { value: t2, prec: r2, right_a: l2.right_associative.has(t2) }, s3 = t2;
        for (; 2 < n2.length && (u2 = n2[n2.length - 2], i2.right_a && u2.right_a ? r2 > u2.prec : r2 <= u2.prec); ) o2 = n2.pop(), t2 = n2.pop().value, c2 = n2.pop(), e2 = { type: l2.BINARY_EXP, operator: t2, left: c2, right: o2 }, n2.push(e2);
        (e2 = this.gobbleToken()) || this.throwError("Expected expression after " + s3), n2.push(i2, e2);
      }
      for (e2 = n2[a2 = n2.length - 1]; 1 < a2; ) e2 = { type: l2.BINARY_EXP, operator: n2[a2 - 1].value, left: n2[a2 - 2], right: e2 }, a2 -= 2;
      return e2;
    } }, { key: "gobbleToken", value: function() {
      var e2, t2, r2, n2;
      if (this.gobbleSpaces(), n2 = this.searchHook("gobble-token")) return this.runHook("after-token", n2);
      if (e2 = this.code, l2.isDecimalDigit(e2) || e2 === l2.PERIOD_CODE) return this.gobbleNumericLiteral();
      if (e2 === l2.SQUOTE_CODE || e2 === l2.DQUOTE_CODE) n2 = this.gobbleStringLiteral();
      else if (e2 === l2.OBRACK_CODE) n2 = this.gobbleArray();
      else {
        for (r2 = (t2 = this.expr.substr(this.index, l2.max_unop_len)).length; 0 < r2; ) {
          if (l2.unary_ops.hasOwnProperty(t2) && (!l2.isIdentifierStart(this.code) || this.index + t2.length < this.expr.length && !l2.isIdentifierPart(this.expr.charCodeAt(this.index + t2.length)))) {
            this.index += r2;
            var i2 = this.gobbleToken();
            return i2 || this.throwError("missing unaryOp argument"), this.runHook("after-token", { type: l2.UNARY_EXP, operator: t2, argument: i2, prefix: true });
          }
          t2 = t2.substr(0, --r2);
        }
        l2.isIdentifierStart(e2) ? (n2 = this.gobbleIdentifier(), l2.literals.hasOwnProperty(n2.name) ? n2 = { type: l2.LITERAL, value: l2.literals[n2.name], raw: n2.name } : n2.name === l2.this_str && (n2 = { type: l2.THIS_EXP })) : e2 === l2.OPAREN_CODE && (n2 = this.gobbleGroup());
      }
      return n2 ? (n2 = this.gobbleTokenProperty(n2), this.runHook("after-token", n2)) : this.runHook("after-token", false);
    } }, { key: "gobbleTokenProperty", value: function(e2) {
      this.gobbleSpaces();
      for (var t2 = this.code; t2 === l2.PERIOD_CODE || t2 === l2.OBRACK_CODE || t2 === l2.OPAREN_CODE || t2 === l2.QUMARK_CODE; ) {
        var r2 = void 0;
        if (t2 === l2.QUMARK_CODE) {
          if (this.expr.charCodeAt(this.index + 1) !== l2.PERIOD_CODE) break;
          r2 = true, this.index += 2, this.gobbleSpaces(), t2 = this.code;
        }
        this.index++, t2 === l2.OBRACK_CODE ? (e2 = { type: l2.MEMBER_EXP, computed: true, object: e2, property: this.gobbleExpression() }, this.gobbleSpaces(), (t2 = this.code) !== l2.CBRACK_CODE && this.throwError("Unclosed ["), this.index++) : t2 === l2.OPAREN_CODE ? e2 = { type: l2.CALL_EXP, arguments: this.gobbleArguments(l2.CPAREN_CODE), callee: e2 } : t2 !== l2.PERIOD_CODE && !r2 || (r2 && this.index--, this.gobbleSpaces(), e2 = { type: l2.MEMBER_EXP, computed: false, object: e2, property: this.gobbleIdentifier() }), r2 && (e2.optional = true), this.gobbleSpaces(), t2 = this.code;
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
      for (var e2 = "", t2 = this.index, r2 = this.expr.charAt(this.index++), n2 = false; this.index < this.expr.length; ) {
        var i2 = this.expr.charAt(this.index++);
        if (i2 === r2) {
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
      for (var t2 = [], r2 = false, n2 = 0; this.index < this.expr.length; ) {
        this.gobbleSpaces();
        var i2 = this.code;
        if (i2 === e2) {
          r2 = true, this.index++, e2 === l2.CPAREN_CODE && n2 && n2 >= t2.length && this.throwError("Unexpected token " + String.fromCharCode(e2));
          break;
        }
        if (i2 === l2.COMMA_CODE) {
          if (this.index++, ++n2 !== t2.length) {
            if (e2 === l2.CPAREN_CODE) this.throwError("Unexpected token ,");
            else if (e2 === l2.CBRACK_CODE) for (var o2 = t2.length; o2 < n2; o2++) t2.push(null);
          }
        } else t2.length !== n2 && 0 !== n2 ? this.throwError("Expected comma") : ((i2 = this.gobbleExpression()) && i2.type !== l2.COMPOUND || this.throwError("Expected comma"), t2.push(i2));
      }
      return r2 || this.throwError("Expected " + String.fromCharCode(e2)), t2;
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
    } }, { key: "addBinaryOp", value: function(e2, t2, r2) {
      return l2.max_binop_len = Math.max(e2.length, l2.max_binop_len), l2.binary_ops[e2] = t2, r2 ? l2.right_associative.add(e2) : l2.right_associative.delete(e2), l2;
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
        var t2 = e2.node, r2 = this.gobbleExpression();
        if (r2 || this.throwError("Expected expression"), this.gobbleSpaces(), this.code === o2.COLON_CODE) {
          this.index++;
          var n2 = this.gobbleExpression();
          if (n2 || this.throwError("Expected expression"), e2.node = { type: "ConditionalExpression", test: t2, consequent: r2, alternate: n2 }, t2.operator && o2.binary_ops[t2.operator] <= 0.9) {
            for (var i2 = t2; i2.right.operator && o2.binary_ops[i2.right.operator] <= 0.9; ) i2 = i2.right;
            e2.node.test = i2.right, i2.right = e2.node, e2.node = t2;
          }
        } else this.throwError("Expected :");
      }
    });
  } };
  E.plugins.register(b);
  var b = { name: "regex", init: function(s3) {
    s3.hooks.add("gobble-token", function(e2) {
      if (47 === this.code) {
        for (var t2 = ++this.index, r2 = false; this.index < this.expr.length; ) {
          if (47 === this.code && !r2) {
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
            return e2.node = { type: s3.LITERAL, value: a2, raw: this.expr.slice(t2 - 1, this.index) }, e2.node = this.gobbleTokenProperty(e2.node), e2.node;
          }
          this.code === s3.OBRACK_CODE ? r2 = true : r2 && this.code === s3.CBRACK_CODE && (r2 = false), this.index += 92 === this.code ? 2 : 1;
        }
        this.throwError("Unclosed Regex");
      }
    });
  } }, g = { name: "assignment", assignmentOperators: /* @__PURE__ */ new Set(["=", "*=", "**=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|="]), updateOperators: [43, 45], assignmentPrecedence: 0.9, init: function(t2) {
    var n2 = [t2.IDENTIFIER, t2.MEMBER_EXP];
    g.assignmentOperators.forEach(function(e2) {
      return t2.addBinaryOp(e2, g.assignmentPrecedence, true);
    }), t2.hooks.add("gobble-token", function(e2) {
      var t3 = this, r2 = this.code;
      g.updateOperators.some(function(e3) {
        return e3 === r2 && e3 === t3.expr.charCodeAt(t3.index + 1);
      }) && (this.index += 2, e2.node = { type: "UpdateExpression", operator: 43 === r2 ? "++" : "--", argument: this.gobbleTokenProperty(this.gobbleIdentifier()), prefix: true }, e2.node.argument && n2.includes(e2.node.argument.type) || this.throwError("Unexpected ".concat(e2.node.operator)));
    }), t2.hooks.add("after-token", function(e2) {
      var t3, r2 = this;
      e2.node && (t3 = this.code, g.updateOperators.some(function(e3) {
        return e3 === t3 && e3 === r2.expr.charCodeAt(r2.index + 1);
      }) && (n2.includes(e2.node.type) || this.throwError("Unexpected ".concat(e2.node.operator)), this.index += 2, e2.node = { type: "UpdateExpression", operator: 43 === t3 ? "++" : "--", argument: e2.node, prefix: false }));
    }), t2.hooks.add("after-expression", function(e2) {
      e2.node && !(function t3(e3) {
        g.assignmentOperators.has(e3.operator) ? (e3.type = "AssignmentExpression", t3(e3.left), t3(e3.right)) : e3.operator || Object.values(e3).forEach(function(e4) {
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
    function r2(e2) {
      var t2;
      return s2(this, r2), (t2 = n(this, r2, ['JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'])).avoidNew = true, t2.value = e2, t2.name = "NewError", t2;
    }
    return (function(e2, t2) {
      if ("function" != typeof t2 && null !== t2) throw new TypeError("Super expression must either be null or a function");
      e2.prototype = Object.create(t2 && t2.prototype, { constructor: { value: e2, writable: true, configurable: true } }), Object.defineProperty(e2, "prototype", { writable: false }), t2 && h(e2, t2);
    })(r2, p2(Error)), c(r2);
  })();
  function F2(e2, t2, r2, n2, i2) {
    if (!(this instanceof F2)) try {
      return new F2(e2, t2, r2, n2, i2);
    } catch (e3) {
      if (!e3.avoidNew) throw e3;
      return e3.value;
    }
    "string" == typeof e2 && (i2 = n2, n2 = r2, r2 = t2, t2 = e2, e2 = null);
    var o2 = e2 && "object" === C(e2);
    if (e2 = e2 || {}, this.json = e2.json || r2, this.path = e2.path || t2, this.resultType = e2.resultType || "value", this.flatten = e2.flatten || false, this.wrap = !A.call(e2, "wrap") || e2.wrap, this.sandbox = e2.sandbox || {}, this.eval = void 0 === e2.eval ? "safe" : e2.eval, this.ignoreEvalErrors = void 0 !== e2.ignoreEvalErrors && e2.ignoreEvalErrors, this.parent = e2.parent || null, this.parentProperty = e2.parentProperty || null, this.callback = e2.callback || n2 || null, this.otherTypeCallback = e2.otherTypeCallback || i2 || function() {
      throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.");
    }, false !== e2.autostart) {
      var a2 = { path: o2 ? e2.path : t2 };
      o2 ? "json" in e2 && (a2.json = e2.json) : a2.json = r2;
      a2 = this.evaluate(a2);
      if (!a2 || "object" !== C(a2)) throw new x(a2);
      return a2;
    }
  }
  F2.prototype.evaluate = function(e2, t2, r2, n2) {
    var i2 = this, o2 = this.parent, a2 = this.parentProperty, s3 = this.flatten, u2 = this.wrap;
    if (this.currResultType = this.resultType, this.currEval = this.eval, this.currSandbox = this.sandbox, r2 = r2 || this.callback, this.currOtherTypeCallback = n2 || this.otherTypeCallback, t2 = t2 || this.json, (e2 = e2 || this.path) && "object" === C(e2) && !Array.isArray(e2)) {
      if (!e2.path && "" !== e2.path) throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');
      if (!A.call(e2, "json")) throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');
      t2 = e2.json, s3 = A.call(e2, "flatten") ? e2.flatten : s3, this.currResultType = A.call(e2, "resultType") ? e2.resultType : this.currResultType, this.currSandbox = A.call(e2, "sandbox") ? e2.sandbox : this.currSandbox, u2 = A.call(e2, "wrap") ? e2.wrap : u2, this.currEval = A.call(e2, "eval") ? e2.eval : this.currEval, r2 = A.call(e2, "callback") ? e2.callback : r2, this.currOtherTypeCallback = A.call(e2, "otherTypeCallback") ? e2.otherTypeCallback : this.currOtherTypeCallback, o2 = A.call(e2, "parent") ? e2.parent : o2, a2 = A.call(e2, "parentProperty") ? e2.parentProperty : a2, e2 = e2.path;
    }
    if (o2 = o2 || null, a2 = a2 || null, Array.isArray(e2) && (e2 = F2.toPathString(e2)), (e2 || "" === e2) && t2) {
      e2 = F2.toPathArray(e2);
      "$" === e2[0] && 1 < e2.length && e2.shift(), this._hasParentSelector = null;
      r2 = this._trace(e2, t2, ["$"], o2, a2, r2).filter(function(e3) {
        return e3 && !e3.isParentSelector;
      });
      return r2.length ? u2 || 1 !== r2.length || r2[0].hasArrExpr ? r2.reduce(function(e3, t3) {
        t3 = i2._getPreferredOutput(t3);
        return s3 && Array.isArray(t3) ? e3 = e3.concat(t3) : e3.push(t3), e3;
      }, []) : this._getPreferredOutput(r2[0]) : u2 ? [] : void 0;
    }
  }, F2.prototype._getPreferredOutput = function(e2) {
    var t2 = this.currResultType;
    switch (t2) {
      case "all":
        var r2 = Array.isArray(e2.path) ? e2.path : F2.toPathArray(e2.path);
        return e2.pointer = F2.toPointer(r2), e2.path = "string" == typeof e2.path ? e2.path : F2.toPathString(e2.path), e2;
      case "value":
      case "parent":
      case "parentProperty":
        return e2[t2];
      case "path":
        return F2.toPathString(e2[t2]);
      case "pointer":
        return F2.toPointer(e2.path);
      default:
        throw new TypeError("Unknown result type");
    }
  }, F2.prototype._handleCallback = function(e2, t2, r2) {
    var n2;
    t2 && (n2 = this._getPreferredOutput(e2), e2.path = "string" == typeof e2.path ? e2.path : F2.toPathString(e2.path), t2(n2, r2, e2));
  }, F2.prototype._trace = function(t2, n2, i2, o2, a2, s3, e2, r2) {
    var u2 = this;
    if (!t2.length) return v2 = { path: i2, value: n2, parent: o2, parentProperty: a2, hasArrExpr: e2 }, this._handleCallback(v2, s3, "value"), v2;
    var c2 = t2[0], l2 = t2.slice(1), h2 = [];
    function p3(e3) {
      Array.isArray(e3) ? e3.forEach(function(e4) {
        h2.push(e4);
      }) : h2.push(e3);
    }
    if (("string" != typeof c2 || r2) && n2 && A.call(n2, c2)) p3(this._trace(l2, n2[c2], w(i2, c2), n2, c2, s3, e2));
    else if ("*" === c2) this._walk(n2, function(e3) {
      p3(u2._trace(l2, n2[e3], w(i2, e3), n2, e3, s3, true, true));
    });
    else if (".." === c2) p3(this._trace(l2, n2, i2, o2, a2, s3, e2)), this._walk(n2, function(e3) {
      "object" === C(n2[e3]) && p3(u2._trace(t2.slice(), n2[e3], w(i2, e3), n2, e3, s3, true));
    });
    else {
      if ("^" === c2) return this._hasParentSelector = true, { path: i2.slice(0, -1), expr: l2, isParentSelector: true };
      if ("~" === c2) return v2 = { path: w(i2, c2), value: a2, parent: o2, parentProperty: null }, this._handleCallback(v2, s3, "property"), v2;
      if ("$" === c2) p3(this._trace(l2, n2, i2, null, null, s3, e2));
      else if (/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(c2)) p3(this._slice(c2, l2, n2, i2, o2, a2, s3));
      else if (0 === c2.indexOf("?(")) {
        if (false === this.currEval) throw new Error("Eval [?(expr)] prevented in JSONPath expression.");
        var f2 = c2.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/, "$1"), d3 = /@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])?((?:[\0->@-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))(?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\)\])['\]]/g.exec(f2);
        d3 ? this._walk(n2, function(e3) {
          var t3 = [d3[2]], r3 = d3[1] ? n2[e3][d3[1]] : n2[e3];
          0 < u2._trace(t3, r3, i2, o2, a2, s3, true).length && p3(u2._trace(l2, n2[e3], w(i2, e3), n2, e3, s3, true));
        }) : this._walk(n2, function(e3) {
          u2._eval(f2, n2[e3], e3, i2, o2, a2) && p3(u2._trace(l2, n2[e3], w(i2, e3), n2, e3, s3, true));
        });
      } else if ("(" === c2[0]) {
        if (false === this.currEval) throw new Error("Eval [(expr)] prevented in JSONPath expression.");
        p3(this._trace(k(this._eval(c2, n2, i2[i2.length - 1], i2.slice(0, -1), o2, a2), l2), n2, i2, o2, a2, s3, e2));
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
        if (y2) return v2 = { path: i2, value: n2, parent: o2, parentProperty: a2 }, this._handleCallback(v2, s3, "value"), v2;
      } else if ("`" === c2[0] && n2 && A.call(n2, c2.slice(1))) {
        var v2 = c2.slice(1);
        p3(this._trace(l2, n2[v2], w(i2, v2), n2, v2, s3, e2, true));
      } else if (c2.includes(",")) {
        var E2 = (function(e3, t3) {
          var r3 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
          if (!r3) {
            if (Array.isArray(e3) || (r3 = O(e3)) || t3 && e3 && "number" == typeof e3.length) {
              r3 && (e3 = r3);
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
            r3 = r3.call(e3);
          }, n: function() {
            var e4 = r3.next();
            return o3 = e4.done, e4;
          }, e: function(e4) {
            a3 = true, i3 = e4;
          }, f: function() {
            try {
              o3 || null == r3.return || r3.return();
            } finally {
              if (a3) throw i3;
            }
          } };
        })(c2.split(","));
        try {
          for (E2.s(); !(g2 = E2.n()).done; ) {
            var g2 = g2.value;
            p3(this._trace(k(g2, l2), n2, i2, o2, a2, s3, true));
          }
        } catch (e3) {
          E2.e(e3);
        } finally {
          E2.f();
        }
      } else !r2 && n2 && A.call(n2, c2) && p3(this._trace(l2, n2[c2], w(i2, c2), n2, c2, s3, e2, true));
    }
    if (this._hasParentSelector) for (var x2 = 0; x2 < h2.length; x2++) {
      var F3 = h2[x2];
      if (F3 && F3.isParentSelector) {
        var D2 = this._trace(F3.expr, n2, F3.path, o2, a2, s3, e2);
        if (Array.isArray(D2)) {
          h2[x2] = D2[0];
          for (var _ = D2.length, m = 1; m < _; m++) x2++, h2.splice(x2, 0, D2[m]);
        } else h2[x2] = D2;
      }
    }
    return h2;
  }, F2.prototype._walk = function(e2, t2) {
    if (Array.isArray(e2)) for (var r2 = e2.length, n2 = 0; n2 < r2; n2++) t2(n2);
    else e2 && "object" === C(e2) && Object.keys(e2).forEach(function(e3) {
      t2(e3);
    });
  }, F2.prototype._slice = function(e2, t2, r2, n2, i2, o2, a2) {
    if (Array.isArray(r2)) {
      for (var s3 = r2.length, u2 = e2.split(":"), c2 = u2[2] && Number.parseInt(u2[2]) || 1, e2 = u2[0] && Number.parseInt(u2[0]) || 0, l2 = u2[1] && Number.parseInt(u2[1]) || s3, e2 = e2 < 0 ? Math.max(0, e2 + s3) : Math.min(s3, e2), l2 = l2 < 0 ? Math.max(0, l2 + s3) : Math.min(s3, l2), h2 = [], p3 = e2; p3 < l2; p3 += c2) this._trace(k(p3, t2), r2, n2, i2, o2, a2, true).forEach(function(e3) {
        h2.push(e3);
      });
      return h2;
    }
  }, F2.prototype._eval = function(t2, e2, r2, n2, i2, o2) {
    var a2 = this;
    this.currSandbox._$_parentProperty = o2, this.currSandbox._$_parent = i2, this.currSandbox._$_property = r2, this.currSandbox._$_root = this.json, this.currSandbox._$_v = e2;
    e2 = t2.includes("@path");
    e2 && (this.currSandbox._$_path = F2.toPathString(n2.concat([r2])));
    var s3 = this.currEval + "Script:" + t2;
    if (!F2.cache[s3]) {
      var u2 = t2.replace(/@parentProperty/g, "_$_parentProperty").replace(/@parent/g, "_$_parent").replace(/@property/g, "_$_property").replace(/@root/g, "_$_root").replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g, "_$_v$1");
      if (e2 && (u2 = u2.replace(/@path/g, "_$_path")), "safe" === this.currEval || true === this.currEval || void 0 === this.currEval) F2.cache[s3] = new this.safeVm.Script(u2);
      else if ("native" === this.currEval) F2.cache[s3] = new this.vm.Script(u2);
      else if ("function" == typeof this.currEval && this.currEval.prototype && A.call(this.currEval.prototype, "runInNewContext")) {
        e2 = this.currEval;
        F2.cache[s3] = new e2(u2);
      } else {
        if ("function" != typeof this.currEval) throw new TypeError('Unknown "eval" property "'.concat(this.currEval, '"'));
        F2.cache[s3] = { runInNewContext: function(e3) {
          return a2.currEval(u2, e3);
        } };
      }
    }
    try {
      return F2.cache[s3].runInNewContext(this.currSandbox);
    } catch (e3) {
      if (this.ignoreEvalErrors) return false;
      throw new Error("jsonPath: " + e3.message + ": " + t2);
    }
  }, F2.cache = {}, F2.toPathString = function(e2) {
    for (var t2 = e2, r2 = t2.length, n2 = "$", i2 = 1; i2 < r2; i2++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t2[i2]) || (n2 += /^[\*0-9]+$/.test(t2[i2]) ? "[" + t2[i2] + "]" : "['" + t2[i2] + "']");
    return n2;
  }, F2.toPointer = function(e2) {
    for (var t2 = e2, r2 = t2.length, n2 = "", i2 = 1; i2 < r2; i2++) /^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(t2[i2]) || (n2 += "/" + t2[i2].toString().replace(/~/g, "~0").replace(/\//g, "~1"));
    return n2;
  }, F2.toPathArray = function(e2) {
    var t2 = F2.cache;
    if (t2[e2]) return t2[e2].concat();
    var r2 = [], n2 = e2.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g, ";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]](?!(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])\])/g, function(e3, t3) {
      return "[#" + (r2.push(t3) - 1) + "]";
    }).replace(/\[["']((?:[\0-&\(-\\\^-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)["']\]/g, function(e3, t3) {
      return "['" + t3.replace(/\./g, "%@%").replace(/~/g, "%%@@%%") + "']";
    }).replace(/~/g, ";~;").replace(/["']?\.["']?(?!(?:[\0-Z\\-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*\])|\[["']?/g, ";").replace(/%@%/g, ".").replace(/%%@@%%/g, "~").replace(/(?:;)?(\^+)(?:;)?/g, function(e3, t3) {
      return ";" + t3.split("").join(";") + ";";
    }).replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "").split(";").map(function(e3) {
      var t3 = e3.match(/#([0-9]+)/);
      return t3 && t3[1] ? r2[t3[1]] : e3;
    });
    return t2[e2] = n2, t2[e2].concat();
  };
  E.plugins.register(b, g);
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
    for (var r2 = 0; r2 < e2.body.length; r2++) {
      "Identifier" === e2.body[r2].type && ["var", "let", "const"].includes(e2.body[r2].name) && e2.body[r2 + 1] && "AssignmentExpression" === e2.body[r2 + 1].type && (r2 += 1);
      var n2 = e2.body[r2], i2 = D.evalAst(n2, t2);
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
    var r2 = e2.computed ? D.evalAst(e2.property) : e2.property.name, t2 = D.evalAst(e2.object, t2), r2 = t2[r2];
    return "function" == typeof r2 ? r2.bind(t2) : r2;
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
    var r2 = e2.arguments.map(function(e3) {
      return D.evalAst(e3, t2);
    });
    return D.evalAst(e2.callee, t2).apply(void 0, f(r2));
  }, evalAssignmentExpression: function(e2, t2) {
    if ("Identifier" !== e2.left.type) throw SyntaxError("Invalid left-hand side in assignment");
    var r2 = e2.left.name, e2 = D.evalAst(e2.right, t2);
    return t2[r2] = e2, t2[r2];
  } }, b = (function() {
    return c(function e2(t2) {
      s2(this, e2), this.code = t2, this.ast = E(this.code);
    }, [{ key: "runInNewContext", value: function(e2) {
      e2 = r({}, e2);
      return D.evalAst(this.ast, e2);
    } }]);
  })();
  F2.prototype.vm = { Script: (function() {
    return c(function e2(t2) {
      s2(this, e2), this.code = t2;
    }, [{ key: "runInNewContext", value: function(n2) {
      var e2 = this.code, t2 = Object.keys(n2), r2 = [];
      !(function(e3, t3, r3) {
        for (var n3 = e3.length, i3 = 0; i3 < n3; i3++) r3(e3[i3]) && t3.push(e3.splice(i3--, 1)[0]);
      })(t2, r2, function(e3) {
        return "function" == typeof n2[e3];
      });
      var i2 = t2.map(function(e3) {
        return n2[e3];
      }), r2 = r2.reduce(function(e3, t3) {
        var r3 = n2[t3].toString();
        return /function/.test(r3) || (r3 = "function " + r3), "var " + t3 + "=" + r3 + ";" + e3;
      }, "");
      /(["'])use strict\1/.test(e2 = r2 + e2) || t2.includes("arguments") || (e2 = "var arguments = undefined;" + e2);
      r2 = (e2 = e2.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/, "")).lastIndexOf(";"), e2 = -1 < r2 ? e2.slice(0, r2 + 1) + " return " + e2.slice(r2 + 1) : " return " + e2;
      return o(Function, t2.concat([e2])).apply(void 0, f(i2));
    } }]);
  })() }, F2.prototype.safeVm = { Script: b }, e.JSONPath = F2, e.SafeScript = b;
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
        const un = urlMap[i];
        u = un ? self2._applyOption(doc(un), ui.opt, MY_URL) : "";
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
  _parseSubOpt(s2) {
    if (s2 === "Text" || s2 === "body&&Text") return { special: "Text" };
    if (s2 === "Html" || s2 === "body&&Html") return { special: "Html" };
    let option;
    if (this.contains(s2, "&&")) {
      const parts = s2.split("&&");
      option = parts.pop();
      s2 = parts.join("&&");
    }
    s2 = this.parseHikerToJq(s2, true);
    const batchSel = s2.replace(/:eq\(0\)/g, "").replace(/:first/g, "").trim();
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
      const r = await callBridge("req", { url: String(url2), options: o });
      if (!r || typeof r !== "object") return { content: "", headers: { error: "bridge: req \u672A\u8FD4\u56DE\u54CD\u5E94" } };
      if (o.buffer === 1) r.content = toBytes(r.content);
      return r;
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
      const r = await callBridge("loadAsset", { path: String(p2) });
      return r == null ? "" : toBytes(r);
    },
    evalModule: async (code, path) => {
      const r = await callBridge("evalModule", { code: String(code), path: path ? String(path) : "" });
      const name = typeof r === "string" && r ? r : "";
      if (!name) throw new Error("evalModule: \u5BBF\u4E3B\u672A\u6CE8\u518C\u6A21\u5757\uFF08fjs \u9700 Dart \u4FA7 declareNewModule\uFF09");
      return import(name);
    },
    env: opts.env || {},
    action: opts.action !== false
  };
}
var SOURCES = /* @__PURE__ */ new Map();
var RT = null;
function rt2() {
  if (!RT) RT = new Runtime(makeHostEnv(globalThis.__drpy3Opts || {}));
  return RT;
}
function drpy3Setup(optsJson) {
  globalThis.__drpy3Opts = optsJson ? JSON.parse(optsJson) : {};
  RT = null;
  return JSON.stringify(rt2().check());
}
async function drpy3Load(code, key, path, extendJson, signature) {
  const src = await rt2().load(String(code), {
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
  return JSON.stringify(rt2().capabilities);
}
async function drpy3Sweep(optsJson) {
  const r = await rt2().sweep(optsJson ? JSON.parse(optsJson) : {});
  return JSON.stringify(r);
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
