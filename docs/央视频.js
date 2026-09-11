import './_lib.cntvParse.js';

let siteKey = "", siteType = "", sourceKey = "", ext = "";

let key = '央视节目';
let url = 'https://api.cntv.cn';
let header = {
    'user-agent': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
};
let columns = {};
let columnKeys = "";

let js2Base;

function readColumns() {
    columns = {};
    columnKeys = "";
    for (let i = 1; i < 7; i++) {
        let siteUrl = 'https://api.cntv.cn/lanmu/columnSearch?serviceId=tvcctv&t=json&n=100&p=' + i;
        let res = req(siteUrl, {
            headers: header,
            method: 'GET'
        });
        let data = JSON.parse(res.content).response;
        if (data && data.docs.length > 0) {
            for (const vod of data.docs) {
    			let lastVideo = vod.lastVIDE.videoSharedCode;
    			if (lastVideo.length == 0)
    				lastVideo = '_';
    			let title = vod.column_name;
    			let img = vod.column_logo;
    			let remarks = vod.column_firstclass;
    			let guid = ' ###' + title + '###' + lastVideo + '###' + img + "###column###" + remarks + "###" + vod.channel_name + "###" + vod.column_brief;
    			
    			columns[title] = {
                    'vod_id': guid,
                    'vod_name': title,
                    'vod_pic': img,
                    'vod_remarks': '栏目大全'
                };
                columnKeys += "<" + title + ">";
            }
        } else {
            break;
        }
    }
}


async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    sourceKey = cfg.sourceKey;
    ext = cfg.ext;
    
    //js2Base = await js2Proxy(true, siteType, siteKey, 'wasm/', {});
    js2Base = await getProxy(true) + '&url=';
    
    readColumns();
}

async function home(filter) {
    let data = categoryConfig;
    let classes = [];
    for (const item of data) {
        classes.push({
            'type_id': item.id,
            'type_name': item.name,
            'type_flag': item.id=='column' ? '0-0-H' : ''
        });
    }
    // console.log(classes);
    return JSON.stringify({
        'class': classes,
        'filters': filter ? filterConfig : null,
        'type_flag': '0-0-S'
    });
}

async function homeVod(params) {
    let res = req(url + '/List/getVideoAlbumList?channelid=CHAL1460955853485115&serviceId=tvcctv&fc=%E7%94%B5%E8%A7%86%E5%89%A7&n=50&topv=1&p=1&sort=desc', {
        headers: header,
        method: 'GET'
    });
    // console.log("==============");
    // console.log(res.content);
    let data = JSON.parse(res.content).data;
    
    let videos = [];
    if (data) {
        for (const vod of data.list) {
			let lastVideo = vod.id;
			if (lastVideo.length == 0)
				lastVideo = '_';
			let guid = vod.year + '###' + vod.title + '###' + lastVideo + '###' + vod.image + "###vod###" + vod.fc + "###" + vod.sc + "###" + vod.area + "###" + vod.actors + "###" + vod.channel + "###" + vod.brief ;
			let title = vod.title;
			let img = vod.image;
			let remarks = vod.sc;
			
            videos.push({
                'vod_id': guid,
                'vod_name': title,
                'vod_pic': img,
                'vod_remarks': remarks
            });
        }
    }
    return JSON.stringify({
        'list': videos
    });
}

async function category(tid, pg, filter, extend) {
    let limit = 30;
    extend = extend || {};
    // console.log("==============");
    let month = '', year = '';
    if (extend.month)
        month = extend.month;
    if (extend.year)
        year = extend.year;
    if (year == '')
        month = '';
    let prefix = year + month;
    
    let videos = [];
    if (tid == 'live') {
        // ==================== 直播频道列表 ====================
        for (const ch of liveChannels) {
            let guid = ' ###' + ch.name + '###' + ch.id + '###' + ch.logo + "###live###直播";
            videos.push({
                'vod_id': guid,
                'vod_name': ch.name,
                'vod_pic': ch.logo,
                'vod_remarks': '直播'
            });
        }
    } else if (tid == 'column') {
        extend.p = pg;
        extend.n = limit;
        
        let siteUrl = 'https://api.cntv.cn/lanmu/columnSearch?serviceId=tvcctv&t=json';
        for (let key in extend) {
            siteUrl += "&" + key + "=" + encodeURIComponent(extend[key]);
        }
        console.log(siteUrl);
        let res = req(siteUrl, {
            headers: header,
            method: 'GET'
        });
        let data = JSON.parse(res.content).response;
        if (data) {
            for (const vod of data.docs) {
    			let lastVideo = vod.lastVIDE.videoSharedCode;
    			if (lastVideo.length == 0)
    				lastVideo = '_';
    			let guid = prefix + '###' + vod.column_name + '###' + lastVideo + '###' + vod.column_logo + "###column###" + vod.column_firstclass + "###" + vod.channel_name + "###" + vod.column_brief;
    			let title = vod.column_name;
    			let img = vod.column_logo;
    			let remarks = vod.column_firstclass;
    			
                videos.push({
                    'vod_id': guid,
                    'vod_name': title,
                    'vod_pic': img,
                    'vod_remarks': remarks
                });
            }
        }
    } else {
        extend.channelid = tid;
        extend.p = pg;
        extend.n = limit;
        let siteUrl = url + '/List/getVideoAlbumList?serviceId=tvcctv&topv=1&sort=desc';
        for (let key in extend) {
            siteUrl += "&" + key + "=" + encodeURIComponent(extend[key]);
        }
        // console.log(siteUrl);
        let res = req(siteUrl, {
            headers: header,
            method: 'GET'
        });
        let data = JSON.parse(res.content).data;
        if (data) {
            for (const vod of data.list) {
    			let lastVideo = vod.id;
    			if (lastVideo.length == 0)
    				lastVideo = '_';
    			let guid = vod.year + '###' + vod.title + '###' + lastVideo + '###' + vod.image + "###vod###" + vod.fc + "###" + vod.sc + "###" + vod.area + "###" + vod.actors + "###" + vod.channel + "###" + vod.brief ;
    			let title = vod.title;
    			let img = vod.image;
    			let remarks = vod.sc;
    			
                videos.push({
                    'vod_id': guid,
                    'vod_name': title,
                    'vod_pic': img,
                    'vod_remarks': remarks
                });
            }
        }
    }
    // console.log(videos);
    
    let pageCount = videos.length == limit ? pg + 1 : pg;
    return JSON.stringify({
        'page': pg,
        'pagecount':pageCount,
        'limit': limit,
        'total': 9999,
        'list': videos,
    });
}

async function detail(id) {
    // console.log(id);
	let aid = id.split('###');
	let tid = aid[0];
	let logo = aid[3];
	let lastVideo = aid[2];
	let title = aid[1];
	let date = aid[0];
	if (lastVideo == '_')
		return '{}';
    
	let videoList = [];
	let vod = {};
    if (aid[4] == "live") {
        // ==================== 直播频道详情 ====================
        let channelId = lastVideo;
        vod = {
    		"vod_id": id,
    		"vod_name": title,
    		"vod_pic": logo,
    		"type_name": "直播",
    		"vod_year": "",
    		"vod_area": "",
    		"vod_remarks": "直播",
    		"vod_actor": "",
    		"vod_director": "",
    		"vod_content": "CCTV直播频道 - " + title + "（通过 WASM 解密播放）"
    	};
    	vod.vod_play_from = '央视直播';
    	vod.vod_play_url = '超清(720P)$' + channelId + '+td#高清(576P)$' + channelId + '+ud#标清(480P)$' + channelId + '+hd#流畅(360P)$' + channelId + '+md';
    } else if (aid[4] == "column") {
    	let lastUrl = 'https://api.cntv.cn/video/videoinfoByGuid?guid=' + lastVideo + '&serviceId=tvcctv';
        let res = req(lastUrl, {
            headers: header,
            method: 'GET'
        });
        let lastJo = JSON.parse(res.content);
        let topicId = lastJo.ctid;
        
    	let url = 'https://api.cntv.cn/NewVideo/getVideoListByColumn?id=' + topicId + '&d=' + date + '&p=1&n=100&sort=desc&mode=0&serviceId=tvcctv&t=json';
        res = req(url, {
            headers: header,
            method: 'GET'
        });
    	let data = JSON.parse(res.content).data;
    	if (data) {
        	for (const video of data.list) {
        		videoList.push(video.title + "$" + video.guid);
        	}
    	}
    	if (videoList.length == 0)
    		return '{}';
    		
    	if (date.length == 0)
    		date = new Date().getFullYear();
    		
    	vod = {
    		"vod_id": id,
    		"vod_name": title,
    		"vod_pic": logo,
    		"type_name": aid[5],
    		"vod_year": date,
    		"vod_area": "",
    		"vod_remarks": aid[5],
    		"vod_actor": "",
    		"vod_director": aid[6],
    		"vod_content": aid[7] + " ▶▶当前页面默认只展示最新100期的内容，可在分类页面选择年份和月份进行往期节目查看。年份和月份仅影响当前页面内容，不参与分类过滤。"
    	};
    } else {
    	let url = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=' + lastVideo +'&serviceId=tvcctv&pub=1&mode=0&p=1&n=100&sort=asc';
        let res = req(url, {
            headers: header,
            method: 'GET'
        });
    	let data = JSON.parse(res.content).data;
    	if (data && data.total == 0) {
        	let url = 'https://api.cntv.cn/NewVideo/getVideoListByAlbumIdNew?id=' + lastVideo +'&serviceId=tvcctv&pub=1&mode=1&p=1&n=100&sort=asc';
            let res = req(url, {
                headers: header,
                method: 'GET'
            });
        	data = JSON.parse(res.content).data;
    	}
    	if (data) {
        	for (const video of data.list) {
        		videoList.push(video.title + "$" + video.guid);
        	}
    	}
    	if (videoList.length == 0)
    		return '{}';
    		
    	if (date.length == 0)
    		date = new Date().getFullYear();
    		
    	vod = {
    		"vod_id": id,
    		"vod_name": title,
    		"vod_pic": logo,
    		"type_name": aid[6],
    		"vod_year": date,
    		"vod_area": aid[7] == 'undefined' ? "" : aid[7],
    		"vod_remarks": aid[5],
    		"vod_actor": aid[8],
    		"vod_director": aid[9],
    		"vod_content": aid[10]
    	};
    }

    if (aid[4] != "live") {
        vod.vod_play_from = '央视视频';
        vod.vod_play_url = videoList.join('#');
    }

    return JSON.stringify({
        'list': [vod]
    });
    
}

async function play(flag, id, flags) {
    // ['2000','1200','850','450']
    
    const urls = [];
    try {
        if (flag === '央视直播') {
            // ==================== 直播流播放 ====================
            let parts = id.split('+');
            let channelId = parts[0];
            let quality = parts[1] || 'td';
            let liveUrl = getLiveUrl(channelId, quality);
            console.log('直播流:', liveUrl);
            // 通过代理播放（需要解密）
            urls.push('2000Proxy', js2Base + encodeURIComponent(liveUrl) + '&_type=m3u8');
        } else {
            // ==================== 点播流播放 ====================
            const vid = id.split('+')[0];
            
            let res = req(`https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${vid}`, {
                method: 'GET',
                headers: header,
            });
            
            const data = JSON.parse(res.content);
            
            const hlsUrl = data.hls_url.split('?')[0];
            const hdUrl = data.manifest.hls_h5e_url.split('?')[0].replace(/\/main([\/\.])/g, '/2000$1');
            
            console.log(hlsUrl, '\n', hdUrl);
            
            urls.push('2000Proxy', js2Base + encodeURIComponent(hdUrl) + '&_type=m3u8');
            for (const name of ['850','450']) {
                urls.push(name, hlsUrl.replace(/\/main([\/\.])/g, '/' + name + '$1'));
            }
            
            console.log(JSON.stringify(urls, null, 3));
        }
    } catch(e) {
        console.error(e);
    }
    
    return JSON.stringify({
        'parse': 0,
        'urls': urls,
        'header': {
            "user-agent": " Dalvik/2.1.0 (Linux; U; Android 7.0; ZTE BA520 Build/MRA58K)"
        }
    });
    
}

async function search(wd, quick) {
    let videos = [];
    let patt = new RegExp('<[^>]*?' + wd + '[^>]*?>', 'g');
    let keys = columnKeys.match(patt);
    if (keys) {
        for (var key of keys) {
            key = key.replace("<", "").replace(">", "");
            if (columns[key])
                videos.push(columns[key]);
        }
    }

    let searchUrl = 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(wd) + '&type=video';
    let res = req(searchUrl, {
        headers: header,
        method: 'GET'
    });
    let html = res.content;
    let data = html.match(/<div class="ind01"[\s\S]*?<div class="vedio-list">/g);
    
    if (data) {
        for (const vod of data) {
            let name = vod.match(/id="video_playlist_xq_\d+"  title="(.*?)"/)[1];
            let id = vod.match(/<h3 class="tit"><span lanmu1="(.*?)"/)[1].match(/\/([^\/]+?)\.s?html/)[1];
            if (id.length < 6)
                continue;
            
            let img = vod.match(/;" src="(.*?)"/)[1];
            let des = vod.match(/<p class="bre">(.*?)</)[1];
			let guid = ' ###' + name + '###' + id + '###' + img + "###vod###" + " " + "###" + "片库" + "###" + " " + "###" + " " + "###" + " " + "###" + des;
    		
            videos.push({
                'vod_id': guid,
                'vod_name': name,
                'vod_pic': img,
                'vod_remarks': '片库'
            });
        }
    }

    return JSON.stringify({
        'list': videos
    });
}

async function proxy(params) {
    let url = params.url;
    console.warn('url:', url);
    
    const isTs = url.indexOf('.ts') > 0;
    
    if (isTs) {
        // Ts代理 - 解密
        const res = await req(url, {method: 'GET', buffer: 1, timeout: 15000, headers: {
            'User-Agent': header['user-agent'],
            'Referer': 'https://tv.cctv.com'
        }});
        const buf = await Parse_TS(res.content);
        return [
            200,
            'video/MP2T',
            Buffer.from(buf).toString('base64'),
            {'Content-Type': 'video/MP2T'},
            1
        ];
    } else {
        // M3u8代理 - 重写URL
        const res = await req(url, {method: 'GET', headers: {
            'User-Agent': header['user-agent'],
            'Referer': 'https://tv.cctv.com'
        }});
        
        // 解析URL获取基础路径
        let urlObj;
        try { urlObj = new URL(url); } catch(e) { urlObj = null; }
        let baseUrl = '';
        let origin = '';
        if (urlObj) {
            origin = urlObj.origin;
            baseUrl = origin + urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
        } else {
            // 回退逻辑
            baseUrl = url.replace(/\/[^\/]+\.m3u8.*$/, '/') || url;
        }
        
        const lines = res.content.split('\n');
        const data = [];
        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
                data.push(line);
                continue;
            }
            
            // 处理TS文件或子M3U8
            if (trimmed.endsWith('.ts') || trimmed.includes('.ts?')) {
                // TS文件 - 通过代理解密
                let tsUrl;
                if (trimmed.startsWith('http')) {
                    tsUrl = trimmed;
                } else if (trimmed.startsWith('/') && origin) {
                    tsUrl = origin + trimmed;
                } else {
                    tsUrl = baseUrl + trimmed;
                }
                data.push(js2Base + encodeURIComponent(tsUrl));
            } else if (trimmed.includes('.m3u8')) {
                // 子M3U8 - 通过代理
                let m3u8Url;
                if (trimmed.startsWith('http')) {
                    m3u8Url = trimmed;
                } else if (trimmed.startsWith('/') && origin) {
                    m3u8Url = origin + trimmed;
                } else {
                    m3u8Url = baseUrl + trimmed;
                }
                data.push(js2Base + encodeURIComponent(m3u8Url) + '&_type=m3u8');
            } else {
                data.push(line);
            }
        }
        
        console.log(data.join('\n'));
        
        return [
            200,
            'application/vnd.apple.mpegurl',
            data.join('\n')
        ];
    }
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        proxy: proxy,
        search: search,
    };
}


// ==================== 直播频道配置 ====================
// 不同频道分配到不同 CDN 集群：
//   ldn = ldncctvwbcdtxy.liveplay.myqcloud.com /ldncctvwbcd/
//   ldo = ldocctvwbcdks.v.kcdnvip.com          /ldocctvwbcd/
//   ldc = ldcctvwbcdbyte.volcfcdn.com          /ldcctvwbcd/
let liveCdnMap = {
    'cctv1':     ['ldncctvwbcdtxy.liveplay.myqcloud.com', 'ldncctvwbcd'],
    'cctv2':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv3':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv4':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv5':     ['ldcctvwbcdbyte.volcfcdn.com',          'ldcctvwbcd'],
    'cctv5plus': ['ldcctvwbcdbyte.volcfcdn.com',          'ldcctvwbcd'],
    'cctv6':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv7':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv8':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv9':     ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv10':    ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv11':    ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv12':    ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv13':    ['ldncctvwbcdtxy.liveplay.myqcloud.com', 'ldncctvwbcd'],
    'cctv14':    ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv15':    ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd'],
    'cctv16':    ['ldcctvwbcdbyte.volcfcdn.com',          'ldcctvwbcd'],
    'cctv17':    ['ldocctvwbcdks.v.kcdnvip.com',          'ldocctvwbcd']
};

let liveChannels = [
    {"name":"CCTV-1 综合", "id":"cctv1", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-2 财经", "id":"cctv2", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-3 综艺", "id":"cctv3", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-4 中文国际", "id":"cctv4", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-5 体育", "id":"cctv5", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-5+ 体育赛事", "id":"cctv5plus", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-6 电影", "id":"cctv6", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-7 国防军事", "id":"cctv7", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-8 电视剧", "id":"cctv8", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-9 纪录", "id":"cctv9", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-10 科教", "id":"cctv10", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-11 戏曲", "id":"cctv11", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-12 社会与法", "id":"cctv12", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-13 新闻", "id":"cctv13", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-14 少儿", "id":"cctv14", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-15 音乐", "id":"cctv15", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-16 奥林匹克", "id":"cctv16", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"},
    {"name":"CCTV-17 农业农村", "id":"cctv17", "logo":"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/16/1629103518125_115.png"}
];

function getLiveUrl(channelId, quality) {
    let cdnInfo = liveCdnMap[channelId] || ['ldncctvwbcdtxy.liveplay.myqcloud.com', 'ldncctvwbcd'];
    let cdn = cdnInfo[0];
    let path = cdnInfo[1];
    let br = quality || 'td';
    return `https://${cdn}/${path}/cdrmld${channelId}_1/index.m3u8?BR=${br}`;
}

let categoryConfig = [
    {"name":"直播", "id":"live"},
    {"name":"栏目大全", "id":"column"},
    {"name":"电视剧", "id":"CHAL1460955853485115"},
    {"name":"动画片", "id":"CHAL1460955899450127"},
    {"name":"纪录片", "id":"CHAL1460955924871139"},
    {"name":"特别节目", "id":"CHAL1460955953877151"}
];


let filterConfig = {
    "CHAL1460955899450127":[
        {
            "key": "sc",
            "name": "类型",
            "value": [
                {"n":"全部", "v":""},
        		{"n":"亲子", "v":"亲子"},
        		{"n":"搞笑", "v":"搞笑"},
        		{"n":"冒险", "v":"冒险"},
        		{"n":"动作", "v":"动作"},
        		{"n":"宠物", "v":"宠物"},
        		{"n":"体育", "v":"体育"},
        		{"n":"益智", "v":"益智"},
        		{"n":"历史", "v":"历史"},
        		{"n":"教育", "v":"教育"},
        		{"n":"校园", "v":"校园"},
        		{"n":"言情", "v":"言情"},
        		{"n":"武侠", "v":"武侠"},
        		{"n":"经典", "v":"经典"},
        		{"n":"未来", "v":"未来"},
        		{"n":"古代", "v":"古代"},
        		{"n":"神话", "v":"神话"},
        		{"n":"真人", "v":"真人"},
        		{"n":"励志", "v":"励志"},
        		{"n":"热血", "v":"热血"},
        		{"n":"奇幻", "v":"奇幻"},
        		{"n":"童话", "v":"童话"},
        		{"n":"剧情", "v":"剧情"},
        		{"n":"夺宝", "v":"夺宝"},
        		{"n":"其他", "v":"其他"}
            ]
        },
        {
            "key": "area",
            "name": "地区",
            "value": [
                {"n":"全部", "v":""},
                {"n":"中国大陆", "v":"中国大陆"},
                {"n":"美国", "v":"美国"},
                {"n":"欧洲", "v":"欧洲"},
                {"n":"其他地区", "v":"其他地区"}
            ]
        },
        {"key": "letter",
            "name": "首字母",
            "value": [
                {"n":"全部", "v":""},
                {"n":"A", "v":"A"},
                {"n":"B", "v":"B"},
                {"n":"C", "v":"C"},
                {"n":"D", "v":"D"},
                {"n":"E", "v":"E"},
                {"n":"F", "v":"F"},
                {"n":"G", "v":"G"},
                {"n":"H", "v":"H"},
                {"n":"I", "v":"I"},
                {"n":"J", "v":"J"},
                {"n":"K", "v":"K"},
                {"n":"L", "v":"L"},
                {"n":"M", "v":"M"},
                {"n":"N", "v":"N"},
                {"n":"O", "v":"O"},
                {"n":"P", "v":"P"},
                {"n":"Q", "v":"Q"},
                {"n":"R", "v":"R"},
                {"n":"S", "v":"S"},
                {"n":"T", "v":"T"},
                {"n":"U", "v":"U"},
                {"n":"V", "v":"V"},
                {"n":"W", "v":"W"},
                {"n":"X", "v":"X"},
                {"n":"Y", "v":"Y"},
                {"n":"Z", "v":"Z"}
            ]
        }
    ],
    "CHAL1460955853485115":[
        {
            "key": "sc",
            "name": "类型",
            "value": [
                {"n":"全部", "v":""},
                {"n":"谍战", "v":"谍战"},
                {"n":"悬疑", "v":"悬疑"},
                {"n":"刑侦", "v":"刑侦"},
                {"n":"历史", "v":"历史"},
                {"n":"古装", "v":"古装"},
                {"n":"武侠", "v":"武侠"},
                {"n":"军旅", "v":"军旅"},
                {"n":"战争", "v":"战争"},
                {"n":"喜剧", "v":"喜剧"},
                {"n":"青春", "v":"青春"},
                {"n":"言情", "v":"言情"},
                {"n":"偶像", "v":"偶像"},
                {"n":"家庭", "v":"家庭"},
                {"n":"年代", "v":"年代"},
                {"n":"革命", "v":"革命"},
                {"n":"农村", "v":"农村"},
                {"n":"都市", "v":"都市"},
                {"n":"其他", "v":"其他"}
            ]
        },
        {
            "key": "area",
            "name": "地区",
            "value": [
                {"n":"全部", "v":""},
                {"n":"中国大陆", "v":"中国大陆"},
                {"n":"香港", "v":"香港"},
                {"n":"美国", "v":"美国"},
                {"n":"欧洲", "v":"欧洲"},
                {"n":"泰国", "v":"泰国"}
            ]
        },
        {
            "key": "year",
            "name": "年份",
            "value": [
                {"n":"全部", "v":""},
                {"n":"2024", "v":"2024"},
                {"n":"2023", "v":"2023"},
                {"n":"2022", "v":"2022"},
                {"n":"2021", "v":"2021"},
                {"n":"2020", "v":"2020"},
                {"n":"2019", "v":"2019"},
                {"n":"2018", "v":"2018"},
                {"n":"2017", "v":"2017"},
                {"n":"2016", "v":"2016"},
                {"n":"2015", "v":"2015"},
                {"n":"2014", "v":"2014"},
                {"n":"2013", "v":"2013"},
                {"n":"2012", "v":"2012"},
                {"n":"2011", "v":"2011"},
                {"n":"2010", "v":"2010"},
                {"n":"2009", "v":"2009"},
                {"n":"2008", "v":"2008"},
                {"n":"2007", "v":"2007"},
                {"n":"2006", "v":"2006"},
                {"n":"2005", "v":"2005"},
                {"n":"2004", "v":"2004"},
                {"n":"2003", "v":"2003"},
                {"n":"2002", "v":"2002"},
                {"n":"2001", "v":"2001"},
                {"n":"2000", "v":"2000"},
                {"n":"1999", "v":"1999"},
                {"n":"1998", "v":"1998"},
                {"n":"1997", "v":"1997"}
            ]
        },
        {"key": "letter",
            "name": "首字母",
            "value": [
                {"n":"全部", "v":""},
                {"n":"A", "v":"A"},
                {"n":"B", "v":"B"},
                {"n":"C", "v":"C"},
                {"n":"D", "v":"D"},
                {"n":"E", "v":"E"},
                {"n":"F", "v":"F"},
                {"n":"G", "v":"G"},
                {"n":"H", "v":"H"},
                {"n":"I", "v":"I"},
                {"n":"J", "v":"J"},
                {"n":"K", "v":"K"},
                {"n":"L", "v":"L"},
                {"n":"M", "v":"M"},
                {"n":"N", "v":"N"},
                {"n":"O", "v":"O"},
                {"n":"P", "v":"P"},
                {"n":"Q", "v":"Q"},
                {"n":"R", "v":"R"},
                {"n":"S", "v":"S"},
                {"n":"T", "v":"T"},
                {"n":"U", "v":"U"},
                {"n":"V", "v":"V"},
                {"n":"W", "v":"W"},
                {"n":"X", "v":"X"},
                {"n":"Y", "v":"Y"},
                {"n":"Z", "v":"Z"}
            ]
        }
    ],
    "column": [
        {"key": "cid",
            "name": "频道",
            "value": [
                {"n":"全部", "v":""},
                {"n":"CCTV-1 综合", "v":"EPGC1386744804340101"},
                {"n":"CCTV-2 财经", "v":"EPGC1386744804340102"},
                {"n":"CCTV-3 综艺", "v":"EPGC1386744804340103"},
                {"n":"CCTV-4 中文国际", "v":"EPGC1386744804340104"},
                {"n":"CCTV-5 体育", "v":"EPGC1386744804340107"},
                {"n":"CCTV-6 电影", "v":"EPGC1386744804340108"},
                {"n":"CCTV-7 国防军事", "v":"EPGC1386744804340109"},
                {"n":"CCTV-8 电视剧", "v":"EPGC1386744804340110"},
                {"n":"CCTV-9 纪录", "v":"EPGC1386744804340112"},
                {"n":"CCTV-10 科教", "v":"EPGC1386744804340113"},
                {"n":"CCTV-11 戏曲", "v":"EPGC1386744804340114"},
                {"n":"CCTV-12 社会与法", "v":"EPGC1386744804340115"},
                {"n":"CCTV-13 新闻", "v":"EPGC1386744804340116"},
                {"n":"CCTV-14 少儿", "v":"EPGC1386744804340117"},
                {"n":"CCTV-15 音乐", "v":"EPGC1386744804340118"},
                {"n":"CCTV-16 奥林匹克", "v":"EPGC1634630207058998"},
                {"n":"CCTV-17 农业农村", "v":"EPGC1563932742616872"},
                {"n":"CCTV-5+ 体育赛事", "v":"EPGC1468294755566101"}
            ]
        },
        {"key": "fc",
            "name": "分类",
            "value": [
                {"n":"全部", "v":""},
                {"n":"新闻", "v":"新闻"},
                {"n":"体育", "v":"体育"},
                {"n":"综艺", "v":"综艺"},
                {"n":"健康", "v":"健康"},
                {"n":"生活", "v":"生活"},
                {"n":"科教", "v":"科教"},
                {"n":"经济", "v":"经济"},
                {"n":"农业", "v":"农业"},
                {"n":"法治", "v":"法治"},
                {"n":"军事", "v":"军事"},
                {"n":"少儿", "v":"少儿"},
                {"n":"动画", "v":"动画"},
                {"n":"纪实", "v":"纪实"},
                {"n":"戏曲", "v":"戏曲"},
                {"n":"音乐", "v":"音乐"},
                {"n":"影视", "v":"电影电视剧"}
            ]
        },
        {"key": "fl",
            "name": "首字母",
            "value": [
                {"n":"全部", "v":""},
                {"n":"A", "v":"A"},
                {"n":"B", "v":"B"},
                {"n":"C", "v":"C"},
                {"n":"D", "v":"D"},
                {"n":"E", "v":"E"},
                {"n":"F", "v":"F"},
                {"n":"G", "v":"G"},
                {"n":"H", "v":"H"},
                {"n":"I", "v":"I"},
                {"n":"J", "v":"J"},
                {"n":"K", "v":"K"},
                {"n":"L", "v":"L"},
                {"n":"M", "v":"M"},
                {"n":"N", "v":"N"},
                {"n":"O", "v":"O"},
                {"n":"P", "v":"P"},
                {"n":"Q", "v":"Q"},
                {"n":"R", "v":"R"},
                {"n":"S", "v":"S"},
                {"n":"T", "v":"T"},
                {"n":"U", "v":"U"},
                {"n":"V", "v":"V"},
                {"n":"W", "v":"W"},
                {"n":"X", "v":"X"},
                {"n":"Y", "v":"Y"},
                {"n":"Z", "v":"Z"}
            ]
        },
        {
            "key": "year",
            "name": "年份",
            "value": [
                {"n":"全部", "v":""},
                {"n":"2024", "v":"2024"},
                {"n":"2023", "v":"2023"},
                {"n":"2022", "v":"2022"},
                {"n":"2021", "v":"2021"},
                {"n":"2020", "v":"2020"},
                {"n":"2019", "v":"2019"},
                {"n":"2018", "v":"2018"},
                {"n":"2017", "v":"2017"},
                {"n":"2016", "v":"2016"},
                {"n":"2015", "v":"2015"},
                {"n":"2014", "v":"2014"},
                {"n":"2013", "v":"2013"},
                {"n":"2012", "v":"2012"},
                {"n":"2011", "v":"2011"},
                {"n":"2010", "v":"2010"},
                {"n":"2009", "v":"2009"},
                {"n":"2008", "v":"2008"},
                {"n":"2007", "v":"2007"},
                {"n":"2006", "v":"2006"},
                {"n":"2005", "v":"2005"},
                {"n":"2004", "v":"2004"},
                {"n":"2003", "v":"2003"},
                {"n":"2002", "v":"2002"},
                {"n":"2001", "v":"2001"},
                {"n":"2000", "v":"2000"},
                {"n":"1999", "v":"1999"},
                {"n":"1998", "v":"1998"},
                {"n":"1997", "v":"1997"}
            ]
        },
        {
            "key": "month",
            "name": "月份",
            "value":[
                {"n":"全部", "v":""},
                {"n":"12","v":"12"},
                {"n":"11","v":"11"},
                {"n":"10","v":"10"},
                {"n":"09","v":"09"},
                {"n":"08","v":"08"},
                {"n":"07","v":"07"},
                {"n":"06","v":"06"},
                {"n":"05","v":"05"},
                {"n":"04","v":"04"},
                {"n":"03","v":"03"},
                {"n":"02","v":"02"},
                {"n":"01","v":"01"}
            ]
        }
    ],
    "CHAL1460955924871139": [
        {"key": "channel",
            "name": "频道",
            "value": [
                {"v":"", "n":"全部"},
                {"v":"CCTV-1综合,CCTV-1高清,CCTV-1综合高清", "n":"CCTV-1 综合"},
                {"v":"CCTV-2财经,CCTV-2高清,CCTV-2财经高清", "n":"CCTV-2 财经"},
                {"v":"CCTV-3综艺,CCTV-3综艺高清", "n":"CCTV-3 综艺"},
                {"v":"CCTV-4中文国际,CCTV-4高清,CCTV-4中文国际(亚)高清", "n":"CCTV-4 中文国际"},
                {"v":"CCTV-5体育,CCTV-5体育高清", "n":"CCTV-5 体育"},
                {"v":"CCTV-6电影,CCTV-6电影高清", "n":"CCTV-6 电影"},
                {"v":"CCTV-7军事农业,CCTV-7军事农业高清，CCTV-7国防军事高清", "n":"CCTV-7 国防军事"},
                {"v":"CCTV-8电视剧,CCTV-8电视剧高清", "n":"CCTV-8 电视剧"},
                {"v":"CCTV-9纪录,CCTV-9高清,CCTV-9纪录高清", "n":"CCTV-9 纪录"},
                {"v":"CCTV-10科教,CCTV-10高清,CCTV-10科教高清", "n":"CCTV-10 科教"},
                {"v":"CCTV-11戏曲", "n":"CCTV-11 戏曲"},
                {"v":"CCTV-12社会与法,CCTV-12社会与法高清", "n":"CCTV-12 社会与法"},
                {"v":"CCTV-13新闻", "n":"CCTV-13 新闻"},
                {"v":"CCTV-14少儿,CCTV-14少儿高清", "n":"CCTV-14 少儿"},
                {"v":"CCTV-15音乐,CCTV-15音乐高清", "n":"CCTV-15 音乐"},
                {"v":"CCTV-17农业农村高清", "n":"CCTV-17 农业农村"}
            ]
        },
        {"key": "sc",
            "name": "分类",
            "value": [
                {"v":"", "n":"全部"},
                {"v":"人文历史", "n":"人文历史"},
                {"v":"人物", "n":"人物"},
                {"v":"军事", "n":"军事"},
                {"v":"探索", "n":"探索"},
                {"v":"社会", "n":"社会"},
                {"v":"自然", "n":"自然"},
                {"v":"时政", "n":"时政"},
                {"v":"经济", "n":"经济"},
                {"v":"科技", "n":"科技"}
            ]
        },
        {
            "key": "year",
            "name": "年份",
            "value": [
                {"n":"全部", "v":""},
                {"n":"2024", "v":"2024"},
                {"n":"2023", "v":"2023"},
                {"n":"2022", "v":"2022"},
                {"n":"2021", "v":"2021"},
                {"n":"2020", "v":"2020"},
                {"n":"2019", "v":"2019"},
                {"n":"2018", "v":"2018"},
                {"n":"2017", "v":"2017"},
                {"n":"2016", "v":"2016"},
                {"n":"2015", "v":"2015"},
                {"n":"2014", "v":"2014"},
                {"n":"2013", "v":"2013"},
                {"n":"2012", "v":"2012"},
                {"n":"2011", "v":"2011"},
                {"n":"2010", "v":"2010"},
                {"n":"2009", "v":"2009"},
                {"n":"2008", "v":"2008"},
                {"n":"2007", "v":"2007"},
                {"n":"2006", "v":"2006"},
                {"n":"2005", "v":"2005"},
                {"n":"2004", "v":"2004"},
                {"n":"2003", "v":"2003"},
                {"n":"2002", "v":"2002"},
                {"n":"2001", "v":"2001"},
                {"n":"2000", "v":"2000"},
                {"n":"1999", "v":"1999"},
                {"n":"1998", "v":"1998"},
                {"n":"1997", "v":"1997"}
            ]
        },
        {
            "key": "letter",
            "name": "首字母",
            "value": [
                {"n":"全部", "v":""},
                {"n":"A", "v":"A"},
                {"n":"B", "v":"B"},
                {"n":"C", "v":"C"},
                {"n":"D", "v":"D"},
                {"n":"E", "v":"E"},
                {"n":"F", "v":"F"},
                {"n":"G", "v":"G"},
                {"n":"H", "v":"H"},
                {"n":"I", "v":"I"},
                {"n":"J", "v":"J"},
                {"n":"K", "v":"K"},
                {"n":"L", "v":"L"},
                {"n":"M", "v":"M"},
                {"n":"N", "v":"N"},
                {"n":"O", "v":"O"},
                {"n":"P", "v":"P"},
                {"n":"Q", "v":"Q"},
                {"n":"R", "v":"R"},
                {"n":"S", "v":"S"},
                {"n":"T", "v":"T"},
                {"n":"U", "v":"U"},
                {"n":"V", "v":"V"},
                {"n":"W", "v":"W"},
                {"n":"X", "v":"X"},
                {"n":"Y", "v":"Y"},
                {"n":"Z", "v":"Z"}
            ]
        }
    ],
    "CHAL1460955953877151": [
        {"key": "channel",
            "name": "频道",
            "value": [
				{"v":"", "n":"全部"},
				{"v":"CCTV-1综合,CCTV-1高清,CCTV-1综合高清", "n":"CCTV-1 综合"},
				{"v":"CCTV-2财经,CCTV-2高清,CCTV-2财经高清", "n":"CCTV-2 财经"},
				{"v":"CCTV-3综艺,CCTV-3高清,CCTV-3综艺高清", "n":"CCTV-3 综艺"},
				{"v":"CCTV-4中文国际,CCTV-4高清,CCTV-4中文国际(亚)高清", "n":"CCTV-4 中文国际"},
				{"v":"CCTV-5体育,CCTV-5高清,CCTV-5体育高清", "n":"CCTV-5 体育"},
				{"v":"CCTV-6电影,CCTV-6高清,CCTV-6电影高清", "n":"CCTV-6 电影"},
				{"v":"CCTV-7军事农业,CCTV-7高清,CCTV-7军事农业高清,CCTV-7国防军事高清", "n":"CCTV-7 国防军事"},
				{"v":"CCTV-8电视剧,CCTV-8高清,CCTV-8电视剧高清", "n":"CCTV-8 电视剧"},
				{"v":"CCTV-9纪录,CCTV-9高清,CCTV-9纪录高清", "n":"CCTV-9 纪录"},
				{"v":"CCTV-10科教,CCTV-10高清,CCTV-10科教高清", "n":"CCTV-10 科教"},
				{"v":"CCTV-11戏曲,CCTV-11高清", "n":"CCTV-11 戏曲"},
				{"v":"CCTV-12社会与法,CCTV-12高清,CCTV-12社会与法高清", "n":"CCTV-12 社会与法"},
				{"v":"CCTV-13新闻,CCTV-13高清,CCTV-13新闻高清", "n":"CCTV-13 新闻"},
				{"v":"CCTV-14少儿,CCTV-14高清,CCTV-14少儿高清", "n":"CCTV-14 少儿"},
				{"v":"CCTV-15音乐,CCTV-15高清,CCTV-15音乐高清", "n":"CCTV-15 音乐"},
				{"v":"CCTV-17农业农村高清", "n":"CCTV-17 农业农村"},
            ]
        },
        {"key": "sc",
            "name": "分类",
            "value": [
				{"v":"", "n":"全部"},
				{"v":"新闻", "n":"新闻"},
				{"v":"经济", "n":"经济"},
				{"v":"综艺", "n":"综艺"},
				{"v":"体育", "n":"体育"},
				{"v":"军事", "n":"军事"},
				{"v":"影视", "n":"影视"},
				{"v":"科教", "n":"科教"},
				{"v":"戏曲", "n":"戏曲"},
				{"v":"青少", "n":"青少"},
				{"v":"音乐", "n":"音乐"},
				{"v":"社会", "n":"社会"},
				{"v":"文化", "n":"文化"},
				{"v":"公益", "n":"公益"},
				{"v":"其他", "n":"其他"},

            ]
        },
        {
            "key": "letter",
            "name": "首字母",
            "value": [
                {"n":"全部", "v":""},
                {"n":"A", "v":"A"},
                {"n":"B", "v":"B"},
                {"n":"C", "v":"C"},
                {"n":"D", "v":"D"},
                {"n":"E", "v":"E"},
                {"n":"F", "v":"F"},
                {"n":"G", "v":"G"},
                {"n":"H", "v":"H"},
                {"n":"I", "v":"I"},
                {"n":"J", "v":"J"},
                {"n":"K", "v":"K"},
                {"n":"L", "v":"L"},
                {"n":"M", "v":"M"},
                {"n":"N", "v":"N"},
                {"n":"O", "v":"O"},
                {"n":"P", "v":"P"},
                {"n":"Q", "v":"Q"},
                {"n":"R", "v":"R"},
                {"n":"S", "v":"S"},
                {"n":"T", "v":"T"},
                {"n":"U", "v":"U"},
                {"n":"V", "v":"V"},
                {"n":"W", "v":"W"},
                {"n":"X", "v":"X"},
                {"n":"Y", "v":"Y"},
                {"n":"Z", "v":"Z"}
            ]
        }
    ]
};

