/*
@header({
  title: '央视频[官]',
  lang: 'dr3',
  searchable: 2, filterable: 1, quickSearch: 0,
})

【央视频[官] dr3 忠实移植版】—— 对照 docs/央视频.js（drpyS 原版）逐一对译：
  * 数据面（init/home/homeVod/category/detail/search/play）与原版同端点、同参数、同 guid 拼装格式；
  * guid 为「###」拼装的任意文本，引擎原样透传（drpy3 vod_id 透传契约）；
  * 解密面（proxy 的 TS 分片 wasm 解密 + m3u8 重写）为 _lib.cntvParse.js 的完整移植，
    wasm 胶水（./_lib.cctv.worker.new.js）经 ctx.lib.wasm.load 托管加载（识别其
    globalThis.CNTVModuleFactory 工厂、垫片环境、就绪等待、按路径缓存）；
  * dr3 化改动仅限：req/getProxy 改经 ctx 注入、返回对象而非 JSON 串、Buffer 改 Uint8Array。
 分发：本文件与 _lib.cctv.worker.new.js 同目录（源目录包）。
*/

const header = {
    'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
};
const url = 'https://api.cntv.cn';

// ==================== 静态配置（程序化提取自原版，逐字一致） ====================
const categoryConfig = [{"name":"直播","id":"live"},{"name":"栏目大全","id":"column"},{"name":"电视剧","id":"CHAL1460955853485115"},{"name":"动画片","id":"CHAL1460955899450127"},{"name":"纪录片","id":"CHAL1460955924871139"},{"name":"特别节目","id":"CHAL1460955953877151"}];
const filterConfig = {"CHAL1460955899450127":[{"key":"sc","name":"类型","value":[{"n":"全部","v":""},{"n":"亲子","v":"亲子"},{"n":"搞笑","v":"搞笑"},{"n":"冒险","v":"冒险"},{"n":"动作","v":"动作"},{"n":"宠物","v":"宠物"},{"n":"体育","v":"体育"},{"n":"益智","v":"益智"},{"n":"历史","v":"历史"},{"n":"教育","v":"教育"},{"n":"校园","v":"校园"},{"n":"言情","v":"言情"},{"n":"武侠","v":"武侠"},{"n":"经典","v":"经典"},{"n":"未来","v":"未来"},{"n":"古代","v":"古代"},{"n":"神话","v":"神话"},{"n":"真人","v":"真人"},{"n":"励志","v":"励志"},{"n":"热血","v":"热血"},{"n":"奇幻","v":"奇幻"},{"n":"童话","v":"童话"},{"n":"剧情","v":"剧情"},{"n":"夺宝","v":"夺宝"},{"n":"其他","v":"其他"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"},{"n":"美国","v":"美国"},{"n":"欧洲","v":"欧洲"},{"n":"其他地区","v":"其他地区"}]},{"key":"letter","name":"首字母","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"}]}],"CHAL1460955853485115":[{"key":"sc","name":"类型","value":[{"n":"全部","v":""},{"n":"谍战","v":"谍战"},{"n":"悬疑","v":"悬疑"},{"n":"刑侦","v":"刑侦"},{"n":"历史","v":"历史"},{"n":"古装","v":"古装"},{"n":"武侠","v":"武侠"},{"n":"军旅","v":"军旅"},{"n":"战争","v":"战争"},{"n":"喜剧","v":"喜剧"},{"n":"青春","v":"青春"},{"n":"言情","v":"言情"},{"n":"偶像","v":"偶像"},{"n":"家庭","v":"家庭"},{"n":"年代","v":"年代"},{"n":"革命","v":"革命"},{"n":"农村","v":"农村"},{"n":"都市","v":"都市"},{"n":"其他","v":"其他"}]},{"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"中国大陆","v":"中国大陆"},{"n":"香港","v":"香港"},{"n":"美国","v":"美国"},{"n":"欧洲","v":"欧洲"},{"n":"泰国","v":"泰国"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1999","v":"1999"},{"n":"1998","v":"1998"},{"n":"1997","v":"1997"}]},{"key":"letter","name":"首字母","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"}]}],"column":[{"key":"cid","name":"频道","value":[{"n":"全部","v":""},{"n":"CCTV-1 综合","v":"EPGC1386744804340101"},{"n":"CCTV-2 财经","v":"EPGC1386744804340102"},{"n":"CCTV-3 综艺","v":"EPGC1386744804340103"},{"n":"CCTV-4 中文国际","v":"EPGC1386744804340104"},{"n":"CCTV-5 体育","v":"EPGC1386744804340107"},{"n":"CCTV-6 电影","v":"EPGC1386744804340108"},{"n":"CCTV-7 国防军事","v":"EPGC1386744804340109"},{"n":"CCTV-8 电视剧","v":"EPGC1386744804340110"},{"n":"CCTV-9 纪录","v":"EPGC1386744804340112"},{"n":"CCTV-10 科教","v":"EPGC1386744804340113"},{"n":"CCTV-11 戏曲","v":"EPGC1386744804340114"},{"n":"CCTV-12 社会与法","v":"EPGC1386744804340115"},{"n":"CCTV-13 新闻","v":"EPGC1386744804340116"},{"n":"CCTV-14 少儿","v":"EPGC1386744804340117"},{"n":"CCTV-15 音乐","v":"EPGC1386744804340118"},{"n":"CCTV-16 奥林匹克","v":"EPGC1634630207058998"},{"n":"CCTV-17 农业农村","v":"EPGC1563932742616872"},{"n":"CCTV-5+ 体育赛事","v":"EPGC1468294755566101"}]},{"key":"fc","name":"分类","value":[{"n":"全部","v":""},{"n":"新闻","v":"新闻"},{"n":"体育","v":"体育"},{"n":"综艺","v":"综艺"},{"n":"健康","v":"健康"},{"n":"生活","v":"生活"},{"n":"科教","v":"科教"},{"n":"经济","v":"经济"},{"n":"农业","v":"农业"},{"n":"法治","v":"法治"},{"n":"军事","v":"军事"},{"n":"少儿","v":"少儿"},{"n":"动画","v":"动画"},{"n":"纪实","v":"纪实"},{"n":"戏曲","v":"戏曲"},{"n":"音乐","v":"音乐"},{"n":"影视","v":"电影电视剧"}]},{"key":"fl","name":"首字母","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1999","v":"1999"},{"n":"1998","v":"1998"},{"n":"1997","v":"1997"}]},{"key":"month","name":"月份","value":[{"n":"全部","v":""},{"n":"12","v":"12"},{"n":"11","v":"11"},{"n":"10","v":"10"},{"n":"09","v":"09"},{"n":"08","v":"08"},{"n":"07","v":"07"},{"n":"06","v":"06"},{"n":"05","v":"05"},{"n":"04","v":"04"},{"n":"03","v":"03"},{"n":"02","v":"02"},{"n":"01","v":"01"}]}],"CHAL1460955924871139":[{"key":"channel","name":"频道","value":[{"v":"","n":"全部"},{"v":"CCTV-1综合,CCTV-1高清,CCTV-1综合高清","n":"CCTV-1 综合"},{"v":"CCTV-2财经,CCTV-2高清,CCTV-2财经高清","n":"CCTV-2 财经"},{"v":"CCTV-3综艺,CCTV-3综艺高清","n":"CCTV-3 综艺"},{"v":"CCTV-4中文国际,CCTV-4高清,CCTV-4中文国际(亚)高清","n":"CCTV-4 中文国际"},{"v":"CCTV-5体育,CCTV-5体育高清","n":"CCTV-5 体育"},{"v":"CCTV-6电影,CCTV-6电影高清","n":"CCTV-6 电影"},{"v":"CCTV-7军事农业,CCTV-7军事农业高清，CCTV-7国防军事高清","n":"CCTV-7 国防军事"},{"v":"CCTV-8电视剧,CCTV-8电视剧高清","n":"CCTV-8 电视剧"},{"v":"CCTV-9纪录,CCTV-9高清,CCTV-9纪录高清","n":"CCTV-9 纪录"},{"v":"CCTV-10科教,CCTV-10高清,CCTV-10科教高清","n":"CCTV-10 科教"},{"v":"CCTV-11戏曲","n":"CCTV-11 戏曲"},{"v":"CCTV-12社会与法,CCTV-12社会与法高清","n":"CCTV-12 社会与法"},{"v":"CCTV-13新闻","n":"CCTV-13 新闻"},{"v":"CCTV-14少儿,CCTV-14少儿高清","n":"CCTV-14 少儿"},{"v":"CCTV-15音乐,CCTV-15音乐高清","n":"CCTV-15 音乐"},{"v":"CCTV-17农业农村高清","n":"CCTV-17 农业农村"}]},{"key":"sc","name":"分类","value":[{"v":"","n":"全部"},{"v":"人文历史","n":"人文历史"},{"v":"人物","n":"人物"},{"v":"军事","n":"军事"},{"v":"探索","n":"探索"},{"v":"社会","n":"社会"},{"v":"自然","n":"自然"},{"v":"时政","n":"时政"},{"v":"经济","n":"经济"},{"v":"科技","n":"科技"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010","v":"2010"},{"n":"2009","v":"2009"},{"n":"2008","v":"2008"},{"n":"2007","v":"2007"},{"n":"2006","v":"2006"},{"n":"2005","v":"2005"},{"n":"2004","v":"2004"},{"n":"2003","v":"2003"},{"n":"2002","v":"2002"},{"n":"2001","v":"2001"},{"n":"2000","v":"2000"},{"n":"1999","v":"1999"},{"n":"1998","v":"1998"},{"n":"1997","v":"1997"}]},{"key":"letter","name":"首字母","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"}]}],"CHAL1460955953877151":[{"key":"channel","name":"频道","value":[{"v":"","n":"全部"},{"v":"CCTV-1综合,CCTV-1高清,CCTV-1综合高清","n":"CCTV-1 综合"},{"v":"CCTV-2财经,CCTV-2高清,CCTV-2财经高清","n":"CCTV-2 财经"},{"v":"CCTV-3综艺,CCTV-3高清,CCTV-3综艺高清","n":"CCTV-3 综艺"},{"v":"CCTV-4中文国际,CCTV-4高清,CCTV-4中文国际(亚)高清","n":"CCTV-4 中文国际"},{"v":"CCTV-5体育,CCTV-5高清,CCTV-5体育高清","n":"CCTV-5 体育"},{"v":"CCTV-6电影,CCTV-6高清,CCTV-6电影高清","n":"CCTV-6 电影"},{"v":"CCTV-7军事农业,CCTV-7高清,CCTV-7军事农业高清,CCTV-7国防军事高清","n":"CCTV-7 国防军事"},{"v":"CCTV-8电视剧,CCTV-8高清,CCTV-8电视剧高清","n":"CCTV-8 电视剧"},{"v":"CCTV-9纪录,CCTV-9高清,CCTV-9纪录高清","n":"CCTV-9 纪录"},{"v":"CCTV-10科教,CCTV-10高清,CCTV-10科教高清","n":"CCTV-10 科教"},{"v":"CCTV-11戏曲,CCTV-11高清","n":"CCTV-11 戏曲"},{"v":"CCTV-12社会与法,CCTV-12高清,CCTV-12社会与法高清","n":"CCTV-12 社会与法"},{"v":"CCTV-13新闻,CCTV-13高清,CCTV-13新闻高清","n":"CCTV-13 新闻"},{"v":"CCTV-14少儿,CCTV-14高清,CCTV-14少儿高清","n":"CCTV-14 少儿"},{"v":"CCTV-15音乐,CCTV-15高清,CCTV-15音乐高清","n":"CCTV-15 音乐"},{"v":"CCTV-17农业农村高清","n":"CCTV-17 农业农村"}]},{"key":"sc","name":"分类","value":[{"v":"","n":"全部"},{"v":"新闻","n":"新闻"},{"v":"经济","n":"经济"},{"v":"综艺","n":"综艺"},{"v":"体育","n":"体育"},{"v":"军事","n":"军事"},{"v":"影视","n":"影视"},{"v":"科教","n":"科教"},{"v":"戏曲","n":"戏曲"},{"v":"青少","n":"青少"},{"v":"音乐","n":"音乐"},{"v":"社会","n":"社会"},{"v":"文化","n":"文化"},{"v":"公益","n":"公益"},{"v":"其他","n":"其他"}]},{"key":"letter","name":"首字母","value":[{"n":"全部","v":""},{"n":"A","v":"A"},{"n":"B","v":"B"},{"n":"C","v":"C"},{"n":"D","v":"D"},{"n":"E","v":"E"},{"n":"F","v":"F"},{"n":"G","v":"G"},{"n":"H","v":"H"},{"n":"I","v":"I"},{"n":"J","v":"J"},{"n":"K","v":"K"},{"n":"L","v":"L"},{"n":"M","v":"M"},{"n":"N","v":"N"},{"n":"O","v":"O"},{"n":"P","v":"P"},{"n":"Q","v":"Q"},{"n":"R","v":"R"},{"n":"S","v":"S"},{"n":"T","v":"T"},{"n":"U","v":"U"},{"n":"V","v":"V"},{"n":"W","v":"W"},{"n":"X","v":"X"},{"n":"Y","v":"Y"},{"n":"Z","v":"Z"}]}]};
const liveChannels = [{"name":"CCTV-1 综合","id":"cctv1","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-2 财经","id":"cctv2","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-3 综艺","id":"cctv3","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-4 中文国际","id":"cctv4","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-5 体育","id":"cctv5","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-5+ 体育赛事","id":"cctv5plus","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-6 电影","id":"cctv6","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-7 国防军事","id":"cctv7","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-8 电视剧","id":"cctv8","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-9 纪录","id":"cctv9","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-10 科教","id":"cctv10","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-11 戏曲","id":"cctv11","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-12 社会与法","id":"cctv12","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-13 新闻","id":"cctv13","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-14 少儿","id":"cctv14","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-15 音乐","id":"cctv15","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-16 奥林匹克","id":"cctv16","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},{"name":"CCTV-17 农业农村","id":"cctv17","logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"}];
const liveCdnMap = {"cctv1":["ldncctvwbcdtxy.liveplay.myqcloud.com","ldncctvwbcd"],"cctv2":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv3":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv4":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv5":["ldcctvwbcdbyte.volcfcdn.com","ldcctvwbcd"],"cctv5plus":["ldcctvwbcdbyte.volcfcdn.com","ldcctvwbcd"],"cctv6":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv7":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv8":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv9":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv10":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv11":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv12":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv13":["ldncctvwbcdtxy.liveplay.myqcloud.com","ldncctvwbcd"],"cctv14":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv15":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"],"cctv16":["ldcctvwbcdbyte.volcfcdn.com","ldcctvwbcd"],"cctv17":["ldocctvwbcdks.v.kcdnvip.com","ldocctvwbcd"]};

function getLiveUrl(channelId, quality) {
    let cdnInfo = liveCdnMap[channelId] || ['ldncctvwbcdtxy.liveplay.myqcloud.com', 'ldncctvwbcd'];
    let cdn = cdnInfo[0];
    let path = cdnInfo[1];
    let br = quality || 'td';
    return `https://${cdn}/${path}/cdrmld${channelId}_1/index.m3u8?BR=${br}`;
}

// ==================== 二进制助手（Uint8Array 版，替代原 Buffer 依赖） ====================
function bytesToBase64(bytes) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out = '';
    for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i], b1 = bytes[i + 1], b2 = bytes[i + 2];
        out += alphabet[b0 >> 2];
        out += alphabet[((b0 & 3) << 4) | ((b1 == null ? 0 : b1) >> 4)];
        out += b1 == null ? '=' : alphabet[((b1 & 15) << 2) | ((b2 == null ? 0 : b2) >> 6)];
        out += b2 == null ? '=' : alphabet[b2 & 63];
    }
    return out;
}

// ==================== TS 解密（_lib.cntvParse.js 完整移植） ====================
const TS_PACKET_SIZE = 188;
const DEFAULT_VIDEO_PID = 256;
const WASM_GLUE_PATH = './_lib.cctv.worker.new.js';

function detectVideoPid(tsData) {
    const pidCounts = {};
    for (let i = 0; i < tsData.length - TS_PACKET_SIZE; i += TS_PACKET_SIZE) {
        if (tsData[i] !== 0x47) continue;
        const pid = ((tsData[i + 1] & 0x1F) << 8) | tsData[i + 2];
        pidCounts[pid] = (pidCounts[pid] || 0) + 1;
    }
    let maxCount = 0, maxPid = DEFAULT_VIDEO_PID;
    for (const pid in pidCounts) {
        const pidNum = parseInt(pid);
        if (pidNum === 0 || pidNum === 4096 || pidNum === 4097 || pidNum === 4095) continue;
        if (pidCounts[pid] > maxCount) { maxCount = pidCounts[pid]; maxPid = pidNum; }
    }
    return maxPid;
}

/** wasm 模块就绪（托管加载 + 原版 calledRun/onRuntimeInitialized 就绪判定 + 超时兜底） */
async function ensureWasm(ctx) {
    if (this._cntvMod) return this._cntvMod;
    const mod = await ctx.lib.wasm.load(WASM_GLUE_PATH);
    await new Promise((resolve) => {
        if (mod.calledRun || typeof mod._jsmalloc === 'function') return resolve();
        mod.onRuntimeInitialized = resolve;
        setTimeout(resolve, 15000); // 就绪超时兜底：导出齐备则后续可用，否则解密环节自行报错
    });
    if (typeof mod._jsmalloc !== 'function') {
        throw new Error('CNTV wasm 运行时就绪超时——当前引擎环境可能不支持该 worker 构建的胶水');
    }
    this._cntvMod = mod;
    return mod;
}

/** 解密 H.264（原地），移植 decryptH264InPlace：vmpTag 位选择 _CNTV_jsdecVOD* 分支 + type25 开关 */
function decryptH264InPlace(ctx, h264Data) {
    const mod = this._cntvMod;
    let curDate = Date.now().toString();
    const MemoryExtend = 2048;
    let vmpTag = '';

    const maxDecryptBufSize = 1024 * 1024;
    const tempDecryptBuf = new Uint8Array(maxDecryptBufSize);

    function _common(o) {
        const memory = mod._jsmalloc(curDate.length + MemoryExtend);
        mod.HEAP8.fill(0, memory, memory + curDate.length + MemoryExtend);
        mod.HEAP8.set(Array.from(curDate, e => e.charCodeAt(0)), memory);
        let ret;
        switch (o) {
            case 'InitPlayer': ret = mod._CNTV_InitPlayer(memory); break;
            case 'UnInitPlayer': ret = mod._CNTV_UnInitPlayer(memory); break;
            case 'UpdatePlayer':
                vmpTag = mod._CNTV_UpdatePlayer(memory).toString(16);
                vmpTag = ['0'.repeat(8 - vmpTag.length), vmpTag].join('');
                ret = 0;
                break;
        }
        mod._jsfree(memory);
        return ret;
    }

    const InitPlayer = () => _common('InitPlayer');
    const UnInitPlayer = () => _common('UnInitPlayer');
    const UpdatePlayer = () => _common('UpdatePlayer');

    function decryptToBuf(srcBuf, destBuf) {
        const pageHost = 'https://tv.cctv.com';
        const addr = mod._jsmalloc(srcBuf.length + MemoryExtend);
        const StaticCallModuleVod = {
            H264NalSet: (e, t, i, n, r) => e._CNTV_jsdecVOD7(t, i, n, r),
            H265NalData: (e, t, i, n, r) => e._CNTV_jsdecVOD6(t, i, n, r),
            AVS1AudioKey: (e, t, i, n, r) => e._CNTV_jsdecVOD5(t, i, n, r),
            HEVC2AAC: (e, t, i, n, r) => e._CNTV_jsdecVOD4(t, i, n, r),
            HASHMap: (e, t, i, n, r) => e._CNTV_jsdecVOD3(t, i, n, r),
            BASE64Dec: (e, t, i, n, r) => e._CNTV_jsdecVOD2(t, i, n, r),
            MediaSession: (e, t, i, n, r) => e._CNTV_jsdecVOD1(t, i, n, r),
            Mp4fragment: (e, t, i, n, r) => e._CNTV_jsdecVOD0(t, i, n, r),
            MpegAudio: (e, t, i, n, r) => e._jsdecVOD(i, n, r),
        };
        function StaticCallModuleVodAPI(e, t, i, n, r, a) {
            return StaticCallModuleVod[a](e, t, i, n, r);
        }

        mod.HEAP8.set(srcBuf, addr);
        mod.HEAP8.set(Array.from(pageHost, e => e.charCodeAt(0)), addr + srcBuf.length);
        const addr2 = mod._jsmalloc(curDate.length);
        mod.HEAP8.set(Array.from(curDate, e => e.charCodeAt(0)), addr2);

        const keys = Object.keys(StaticCallModuleVod);
        for (const i in vmpTag)
            if ('0123456'.includes(vmpTag[i]))
                StaticCallModuleVodAPI(mod, addr2, addr, srcBuf.length, pageHost.length, keys[i]);

        const decRet = StaticCallModuleVodAPI(mod, addr2, addr, srcBuf.length, pageHost.length, keys[8]);

        const copyLen = Math.min(decRet, destBuf.length);
        destBuf.set(mod.HEAP8.subarray(addr, addr + copyLen));
        mod._jsfree(addr);
        mod._jsfree(addr2);
        return decRet;
    }

    // NAL 位置信息收集
    const nalUnits = [];
    let i = 0;
    while (i < h264Data.length - 3) {
        if (h264Data[i] === 0x00 && h264Data[i + 1] === 0x00) {
            let startCodeLen = 0, nalStart = -1;
            if (h264Data[i + 2] === 0x01 && i + 3 < h264Data.length) {
                startCodeLen = 3; nalStart = i + 3;
            } else if (h264Data[i + 2] === 0x00 && h264Data[i + 3] === 0x01 && i + 4 < h264Data.length) {
                startCodeLen = 4; nalStart = i + 4;
            }
            if (nalStart >= 0) {
                let nextStart = h264Data.length;
                for (let j = nalStart; j < h264Data.length - 2; j++) {
                    if (h264Data[j] === 0x00 && h264Data[j + 1] === 0x00) {
                        if (h264Data[j + 2] === 0x01 || (h264Data[j + 2] === 0x00 && j + 3 < h264Data.length && h264Data[j + 3] === 0x01)) {
                            nextStart = j; break;
                        }
                    }
                }
                const headerByte = h264Data[nalStart];
                const dataStart = nalStart + 1;
                nalUnits.push({
                    dataPos: dataStart, dataEnd: nextStart,
                    header: headerByte, dataLen: nextStart - dataStart,
                    nalUnitType: headerByte & 0x1F,
                });
                i = nextStart;
                continue;
            }
        }
        i++;
    }

    const hasType25 = nalUnits.some(nal => nal.nalUnitType === 25);
    let shouldDecrypt = hasType25 ? false : true;
    curDate = Date.now().toString();
    InitPlayer();

    for (const nal of nalUnits) {
        UpdatePlayer();
        const nalLen = nal.dataLen + 1;
        if (nalLen > maxDecryptBufSize) continue;
        tempDecryptBuf[0] = nal.header;
        tempDecryptBuf.set(h264Data.subarray(nal.dataPos, nal.dataEnd), 1);

        if (nal.nalUnitType === 25) {
            shouldDecrypt = h264Data[nal.dataPos] === 1;
            if (shouldDecrypt) decryptToBuf(tempDecryptBuf.subarray(0, nalLen), tempDecryptBuf);
        } else if ((nal.nalUnitType === 1 || nal.nalUnitType === 5) && shouldDecrypt) {
            const decLen = decryptToBuf(tempDecryptBuf.subarray(0, nalLen), tempDecryptBuf);
            const decryptedDataLen = decLen - 1;
            const writePos = nal.dataPos;
            if (decryptedDataLen <= nal.dataLen) {
                if (decryptedDataLen > 0) h264Data.set(tempDecryptBuf.subarray(1, 1 + decryptedDataLen), writePos);
                if (decryptedDataLen < nal.dataLen) h264Data.fill(0, writePos + decryptedDataLen, nal.dataEnd);
            } else {
                h264Data.set(tempDecryptBuf.subarray(1, 1 + nal.dataLen), writePos);
            }
        }
    }
    UnInitPlayer();
    return h264Data;
}

/** TS 分片解密主流程（Parse_TS 移植：三遍扫描——PES 统计 / H.264 提取 / 解密回写） */
async function parseTS(ctx, originalTS) {
    await ensureWasm.call(this, ctx);

    const VIDEO_PID = detectVideoPid(originalTS);

    // 第一遍：统计视频 PES 数据量
    let totalSize = 0;
    let inPES0 = false, cur0 = 0;
    for (let i = 0; i + TS_PACKET_SIZE <= originalTS.length; i += TS_PACKET_SIZE) {
        const packet = originalTS.subarray(i, i + TS_PACKET_SIZE);
        if (packet[0] !== 0x47) continue;
        const pid = ((packet[1] & 0x1F) << 8) | packet[2];
        if (pid !== VIDEO_PID) continue;
        const payloadStart = (packet[1] & 0x40) !== 0;
        const adaptation = (packet[3] & 0x20) !== 0;
        const payload = (packet[3] & 0x10) !== 0;
        let offset = 4;
        if (adaptation && offset < 188) { offset += packet[offset] + 1; }
        if (payload && offset < 188) {
            if (payloadStart) {
                if (inPES0 && cur0 > 0) totalSize += cur0;
                let pesHeaderEnd = 9;
                const data = packet.subarray(offset);
                if (data.length >= 9) pesHeaderEnd = 9 + data[8];
                pesHeaderEnd = Math.min(pesHeaderEnd, data.length);
                cur0 = (188 - offset) - pesHeaderEnd;
                inPES0 = true;
            } else if (inPES0) {
                cur0 += 188 - offset;
            }
        }
    }
    if (inPES0 && cur0 > 0) totalSize += cur0;
    if (totalSize === 0) return originalTS;

    // 第二遍：提取 H.264
    const h264Data = new Uint8Array(totalSize);
    let wpos = 0;
    let inPES = false;
    for (let i = 0; i + TS_PACKET_SIZE <= originalTS.length; i += TS_PACKET_SIZE) {
        const packet = originalTS.subarray(i, i + TS_PACKET_SIZE);
        if (packet[0] !== 0x47) continue;
        const pid = ((packet[1] & 0x1F) << 8) | packet[2];
        if (pid !== VIDEO_PID) continue;
        const payloadStart = (packet[1] & 0x40) !== 0;
        const adaptation = (packet[3] & 0x20) !== 0;
        const payload = (packet[3] & 0x10) !== 0;
        let offset = 4;
        if (adaptation && offset < 188) { offset += packet[offset] + 1; }
        if (payload && offset < 188) {
            if (payloadStart) {
                let pesHeaderEnd = 9;
                const data = packet.subarray(offset);
                if (data.length >= 9) pesHeaderEnd = 9 + data[8];
                pesHeaderEnd = Math.min(pesHeaderEnd, data.length);
                const pesPayload = packet.subarray(offset + pesHeaderEnd);
                h264Data.set(pesPayload, wpos);
                wpos += pesPayload.length;
                inPES = true;
            } else if (inPES) {
                const data = packet.subarray(offset);
                h264Data.set(data, wpos);
                wpos += data.length;
            }
        }
    }

    // 解密（原地）
    decryptH264InPlace.call(this, h264Data);

    // 第三遍：写回 TS（解密数据填充进视频 PES 载荷，余量补 0xFF）
    let rpos = 0;
    for (let i = 0; i + TS_PACKET_SIZE <= originalTS.length; i += TS_PACKET_SIZE) {
        const pid = ((originalTS[i + 1] & 0x1F) << 8) | originalTS[i + 2];
        if (pid !== VIDEO_PID) continue;
        const payloadStart = (originalTS[i + 1] & 0x40) !== 0;
        const adaptation = (originalTS[i + 3] & 0x20) !== 0;
        const payload = (originalTS[i + 3] & 0x10) !== 0;
        let offset = 4;
        if (adaptation && offset < 188) { offset += originalTS[i + offset] + 1; }
        if (!(payload && offset < 188)) continue;
        if (payloadStart) {
            let pesHeaderEnd = 9;
            if (offset + 9 <= 188) pesHeaderEnd = 9 + originalTS[i + offset + 8];
            pesHeaderEnd = Math.min(pesHeaderEnd, 188 - offset);
            const writeOffset = i + offset + pesHeaderEnd;
            const remaining = 188 - offset - pesHeaderEnd;
            const toCopy = Math.min(remaining, h264Data.length - rpos);
            if (toCopy > 0) {
                originalTS.set(h264Data.subarray(rpos, rpos + toCopy), writeOffset);
                rpos += toCopy;
            }
            if (toCopy < remaining) originalTS.fill(0xFF, writeOffset + toCopy, i + 188);
        } else {
            const writeOffset = i + offset;
            const remaining = 188 - offset;
            const toCopy = Math.min(remaining, h264Data.length - rpos);
            if (toCopy > 0) {
                originalTS.set(h264Data.subarray(rpos, rpos + toCopy), writeOffset);
                rpos += toCopy;
            }
            if (toCopy < remaining) originalTS.fill(0xFF, writeOffset + toCopy, i + 188);
        }
    }
    return originalTS;
}

// ==================== dr3 源本体 ====================
export default {
    meta: {
        title: '央视频[官]',
        host: 'https://api.cntv.cn',
        searchable: 2, filterable: 1, quickSearch: 0,
    },

    async init(ctx, ext) {
        this.js2Base = (await ctx.getProxyUrl()) + '&url=';
        // 栏目表预取（原版 readColumns：6 页 columnSearch）
        this.columns = {};
        this.columnKeys = '';
        for (let i = 1; i < 7; i++) {
            const res = await ctx.req('https://api.cntv.cn/lanmu/columnSearch?serviceId=tvcctv&t=json&n=100&p=' + i, {headers: header});
            let data = {};
            try { data = JSON.parse(res.content).response || {}; } catch { break; }
            if (!data.docs || data.docs.length === 0) break;
            for (const vod of data.docs) {
                let lastVideo = vod.lastVIDE.videoSharedCode;
                if (lastVideo.length === 0) lastVideo = '_';
                const title = vod.column_name;
                const guid = ' ###' + title + '###' + lastVideo + '###' + vod.column_logo + '###column###' + vod.column_firstclass + '###' + vod.channel_name + '###' + vod.column_brief;
                this.columns[title] = {vod_id: guid, vod_name: title, vod_pic: vod.column_logo, vod_remarks: '栏目大全'};
                this.columnKeys += '<' + title + '>';
            }
        }
    },

    async home(ctx, filter) {
        const classes = categoryConfig.map((item) => ({
            type_id: item.id,
            type_name: item.name,
            type_flag: item.id === 'column' ? '0-0-H' : '',
        }));
        return {class: classes, filters: filter ? filterConfig : null, type_flag: '0-0-S'};
    },

    async homeVod(ctx) {
        const res = await ctx.req(url + '/List/getVideoAlbumList?channelid=CHAL1460955853485115&serviceId=tvcctv&fc=%E7%94%B5%E8%A7%86%E5%89%A7&n=50&topv=1&p=1&sort=desc', {headers: header});
        const data = JSON.parse(res.content).data || {};
        const videos = (data.list || []).map((vod) => {
            const lastVideo = vod.id.length === 0 ? '_' : vod.id;
            const guid = vod.year + '###' + vod.title + '###' + lastVideo + '###' + vod.image + '###vod###' + vod.fc + '###' + vod.sc + '###' + vod.area + '###' + vod.actors + '###' + vod.channel + '###' + vod.brief;
            return {vod_id: guid, vod_name: vod.title, vod_pic: vod.image, vod_remarks: vod.sc};
        });
        return {list: videos};
    },

    async category(ctx, tid, pg, filter, extend) {
        const limit = 30;
        extend = extend || {};
        let month = '', year = '';
        if (extend.month) month = extend.month;
        if (extend.year) year = extend.year;
        if (year === '') month = '';
        const prefix = year + month;

        const videos = [];
        if (tid === 'live') {
            for (const ch of liveChannels) {
                const guid = ' ###' + ch.name + '###' + ch.id + '###' + ch.logo + '###live###直播';
                videos.push({vod_id: guid, vod_name: ch.name, vod_pic: ch.logo, vod_remarks: '直播'});
            }
        } else if (tid === 'column') {
            extend.p = pg;
            extend.n = limit;
            let siteUrl = 'https://api.cntv.cn/lanmu/columnSearch?serviceId=tvcctv&t=json';
            for (const key in extend) siteUrl += '&' + key + '=' + encodeURIComponent(extend[key]);
            const res = await ctx.req(siteUrl, {headers: header});
            const data = JSON.parse(res.content).response;
            if (data) {
                for (const vod of data.docs) {
                    let lastVideo = vod.lastVIDE.videoSharedCode;
                    if (lastVideo.length === 0) lastVideo = '_';
                    const guid = prefix + '###' + vod.column_name + '###' + lastVideo + '###' + vod.column_logo + '###column###' + vod.column_firstclass + '###' + vod.channel_name + '###' + vod.column_brief;
                    videos.push({vod_id: guid, vod_name: vod.column_name, vod_pic: vod.column_logo, vod_remarks: vod.column_firstclass});
                }
            }
        } else {
            extend.channelid = tid;
            extend.p = pg;
            extend.n = limit;
            let siteUrl = url + '/List/getVideoAlbumList?serviceId=tvcctv&topv=1&sort=desc';
            for (const key in extend) siteUrl += '&' + key + '=' + encodeURIComponent(extend[key]);
            const res = await ctx.req(siteUrl, {headers: header});
            const data = JSON.parse(res.content).data;
            if (data) {
                for (const vod of data.list) {
                    let lastVideo = vod.id.length === 0 ? '_' : vod.id;
                    const guid = vod.year + '###' + vod.title + '###' + lastVideo + '###' + vod.image + '###vod###' + vod.fc + '###' + vod.sc + '###' + vod.area + '###' + vod.actors + '###' + vod.channel + '###' + vod.brief;
                    videos.push({vod_id: guid, vod_name: vod.title, vod_pic: vod.image, vod_remarks: vod.sc});
                }
            }
        }

        const pageCount = videos.length === limit ? pg + 1 : pg;
        return {page: pg, pagecount: pageCount, limit, total: 9999, list: videos};
    },

    async detail(ctx, id) {
        const aid = String(id).split('###');
        const logo = aid[3];
        const lastVideo = aid[2];
        const title = aid[1];
        let date = aid[0];
        if (lastVideo === '_') return {};

        let videoList = [];
        let vod = {};
        if (aid[4] === 'live') {
            const channelId = lastVideo;
            vod = {
                vod_id: id, vod_name: title, vod_pic: logo, type_name: '直播',
                vod_year: '', vod_area: '', vod_remarks: '直播', vod_actor: '', vod_director: '',
                vod_content: 'CCTV直播频道 - ' + title + '（通过 WASM 解密播放）',
            };
            vod.vod_play_from = '央视直播';
            vod.vod_play_url = '超清(720P)$' + channelId + '+td#高清(576P)$' + channelId + '+ud#标清(480P)$' + channelId + '+hd#流畅(360P)$' + channelId + '+md';
        } else if (aid[4] === 'column') {
            const lastUrl = 'https://api.cntv.cn/video/videoinfoByGuid?guid=' + lastVideo + '&serviceId=tvcctv';
            const res0 = await ctx.req(lastUrl, {headers: header});
            const topicId = JSON.parse(res0.content).ctid;

            const listUrl = 'https://api.cntv.cn/NewVideo/getVideoListByColumn?id=' + topicId + '&d=' + date + '&p=1&n=100&sort=desc&mode=0&serviceId=tvcctv&t=json';
            const res = await ctx.req(listUrl, {headers: header});
            const data = JSON.parse(res.content).data;
            if (data) for (const video of data.list) videoList.push(video.title + '$' + video.guid);
            if (videoList.length === 0) return {};

            if (date.length === 0) date = String(new Date().getFullYear());
            vod = {
                vod_id: id, vod_name: title, vod_pic: logo, type_name: aid[5], vod_year: date,
                vod_area: '', vod_remarks: aid[5], vod_actor: '', vod_director: aid[6],
                vod_content: aid[7] + ' ▶▶当前页面默认只展示最新100期的内容，可在分类页面选择年份和月份进行往期节目查看。年份和月份仅影响当前页面内容，不参与分类过滤。',
            };
        } else {
            let listUrl = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=' + lastVideo + '&serviceId=tvcctv&pub=1&mode=0&p=1&n=100&sort=asc';
            let res = await ctx.req(listUrl, {headers: header});
            let data = JSON.parse(res.content).data;
            if (data && data.total === 0) {
                listUrl = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=' + lastVideo + '&serviceId=tvcctv&pub=1&mode=1&p=1&n=100&sort=asc';
                data = JSON.parse((await ctx.req(listUrl, {headers: header})).content).data;
            }
            if (data) for (const video of data.list) videoList.push(video.title + '$' + video.guid);
            if (videoList.length === 0) return {};

            if (date.length === 0) date = String(new Date().getFullYear());
            vod = {
                vod_id: id, vod_name: title, vod_pic: logo, type_name: aid[6], vod_year: date,
                vod_area: aid[7] === 'undefined' ? '' : aid[7], vod_remarks: aid[5],
                vod_actor: aid[8], vod_director: aid[9], vod_content: aid[10],
            };
        }

        if (aid[4] !== 'live') {
            vod.vod_play_from = '央视视频';
            vod.vod_play_url = videoList.join('#');
        }
        return {list: [vod]};
    },

    async play(ctx, flag, id, flags) {
        const urls = [];
        try {
            if (flag === '央视直播') {
                const parts = id.split('+');
                const channelId = parts[0];
                const quality = parts[1] || 'td';
                const liveUrl = getLiveUrl(channelId, quality);
                urls.push('2000Proxy', this.js2Base + encodeURIComponent(liveUrl) + '&_type=m3u8');
            } else {
                const vid = id.split('+')[0];
                const res = await ctx.req(`https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${vid}`, {method: 'GET', headers: header});
                const data = JSON.parse(res.content);
                const hlsUrl = data.hls_url.split('?')[0];
                const hdUrl = data.manifest.hls_h5e_url.split('?')[0].replace(/\/main([\/\.])/g, '/2000$1');
                urls.push('2000Proxy', this.js2Base + encodeURIComponent(hdUrl) + '&_type=m3u8');
                for (const name of ['850', '450']) urls.push(name, hlsUrl.replace(/\/main([\/\.])/g, '/' + name + '$1'));
            }
        } catch (e) {
            ctx.log('play 出错: ' + e.message);
        }
        return {
            parse: 0, urls,
            header: {'user-agent': ' Dalvik/2.1.0 (Linux; U; Android 7.0; ZTE BA520 Build/MRA58K)'},
        };
    },

    async search(ctx, wd, quick) {
        const videos = [];
        let patt;
        try { patt = new RegExp('<[^>]*?' + wd + '[^>]*?>', 'g'); } catch { patt = null; }
        if (patt) {
            const keys = (this.columnKeys || '').match(patt);
            if (keys) {
                for (let key of keys) {
                    key = key.replace('<', '').replace('>', '');
                    if (this.columns[key]) videos.push(this.columns[key]);
                }
            }
        }

        const searchUrl = 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(wd) + '&type=video';
        const res = await ctx.req(searchUrl, {headers: header});
        const html = res.content;
        const data = html.match(/<div class="ind01"[\s\S]*?<div class="vedio-list">/g);
        if (data) {
            for (const vod of data) {
                const name = (vod.match(/id="video_playlist_xq_\d+"  title="(.*?)"/) || [])[1];
                const idm = vod.match(/<h3 class="tit"><span lanmu1="(.*?)"/);
                const id = idm ? idm[1].match(/\/([^\/]+?)\.s?html/) : null;
                if (!name || !id || id[1].length < 6) continue;
                const img = (vod.match(/;" src="(.*?)"/) || [])[1] || '';
                const des = (vod.match(/<p class="bre">(.*?)</) || [])[1] || '';
                const guid = ' ###' + name + '###' + id[1] + '###' + img + '###vod###' + ' ' + '###' + '片库' + '###' + ' ' + '###' + ' ' + '###' + ' ' + '###' + des;
                videos.push({vod_id: guid, vod_name: name, vod_pic: img, vod_remarks: '片库'});
            }
        }
        return {list: videos};
    },

    async proxy(ctx, params) {
        const purl = params.url || '';
        const isTs = purl.indexOf('.ts') > 0;

        if (isTs) {
            const res = await ctx.req(purl, {method: 'GET', buffer: 1, timeout: 15000, headers: {'User-Agent': header['user-agent'], Referer: 'https://tv.cctv.com'}});
            const buf = await parseTS.call(this, ctx, res.content);
            return [200, 'video/MP2T', bytesToBase64(buf), {'Content-Type': 'video/MP2T'}, 1];
        }

        const res = await ctx.req(purl, {method: 'GET', headers: {'User-Agent': header['user-agent'], Referer: 'https://tv.cctv.com'}});
        let urlObj = null;
        try { urlObj = new URL(purl); } catch { urlObj = null; }
        let baseUrl = '', origin = '';
        if (urlObj) {
            origin = urlObj.origin;
            baseUrl = origin + urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
        } else {
            baseUrl = purl.replace(/\/[^\/]+\.m3u8.*$/, '/') || purl;
        }

        const lines = res.content.split('\n');
        const data = [];
        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) { data.push(line); continue; }
            if (trimmed.endsWith('.ts') || trimmed.includes('.ts?')) {
                let tsUrl;
                if (trimmed.startsWith('http')) tsUrl = trimmed;
                else if (trimmed.startsWith('/') && origin) tsUrl = origin + trimmed;
                else tsUrl = baseUrl + trimmed;
                data.push(this.js2Base + encodeURIComponent(tsUrl));
            } else if (trimmed.includes('.m3u8')) {
                let m3u8Url;
                if (trimmed.startsWith('http')) m3u8Url = trimmed;
                else if (trimmed.startsWith('/') && origin) m3u8Url = origin + trimmed;
                else m3u8Url = baseUrl + trimmed;
                data.push(this.js2Base + encodeURIComponent(m3u8Url) + '&_type=m3u8');
            } else {
                data.push(line);
            }
        }
        return [200, 'application/vnd.apple.mpegurl', data.join('\n')];
    },
};
