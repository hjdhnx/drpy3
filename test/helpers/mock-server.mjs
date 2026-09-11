// 独立进程 mock 服务器：按标杆源期望的数据形状喂真实形状数据（drpy2/drpy3 冒烟共用）。
// 为什么独立进程：drpy2/3 的同步 req 实现会阻塞本进程事件循环，mock 必须分进程（附录 C 契约）。
// 启动：node test/helpers/mock-server.mjs（MOCK_PORT 环境变量指定端口，默认 19777）
import http from 'node:http';

const PORT = Number(process.env.MOCK_PORT || 19777);

// 百忙无果 detail 页 HTML：选择器形状与演示稿一致（.vt-txt / p:eq(n) / .video-img / .desc）
const DETAIL_HTML = `<!doctype html><html><head><title>详情页</title></head><body>
<div class="m-details"><h1>测试影片</h1><p>类型：国产动漫</p><p>地区：中国大陆</p><p>上映：2023-01-01</p><p>导演：测试导演</p><p>主演：张三 李四 王五</p></div>
<div class="video-img"><img src="//img.example.com/pic.jpg"></div>
<div class="desc">简介：这是一个用于冒烟测试的影片简介。</div>
<div class="vt-txt">测试影片全名</div>
</body></html>`;

// 央视频 m3u8：相对地址分片 + 子列表，供 proxy 重写环节断言
const CNTV_M3U8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
seg0.ts
#EXTINF:10.0,
https://cdn.example.com/abs/seg1.ts
#EXTINF:10.0,
sub/seg2.m3u8
#EXT-X-ENDLIST`;

// 构造一个最小 TS 分片：N 个 188 字节包，0x47 同步字节 + 视频 PID 4097 交替
function makeTs(packets = 7) {
    const buf = new Uint8Array(packets * 188);
    for (let i = 0; i < packets; i++) {
        const off = i * 188;
        buf[off] = 0x47;
        const pid = i % 2 === 0 ? 4097 : 32;
        buf[off + 1] = (pid >> 8) & 0x1f;
        buf[off + 2] = pid & 0xff;
        buf[off + 3] = 0x10; // payload only
        for (let j = 4; j < 188; j++) buf[off + j] = (i + j) & 0xff;
    }
    return buf;
}

http.createServer((req, res) => {
    const u = new URL(req.url, 'http://mock');
    const p = u.pathname;
    const reply = (obj) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(obj));
    };
    // ══════════ 百忙无果（mgtv 形状）══════════
    if (p.startsWith('/rider/list')) {                       // 一级（json: 一级规则）
        const docs = [1, 2, 3].map((i) => ({
            title: `影片${i}`, img: `http://img.example.com/${i}.jpg`,
            updateInfo: `更新至第${i}集`, rightCorner: {text: 'HD'}, playPartId: `vid${i}`,
        }));
        reply({data: {hitDocs: docs}});
    } else if (p.startsWith('/msite/search')) {               // 搜索（js: 规则）
        const q = u.searchParams.get('q');
        reply({data: {contents: [{type: 'media', data: [{
            desc: ['2023', '动漫'], source: 'imgo', img: 'http://img.example.com/s.jpg',
            rpt: 'idx=50&other=1', title: `<B>${q}</B>`, url: `http://127.0.0.1:${PORT}/b/999/vid9.html`,
        }]}]}});
    } else if (p.startsWith('/episode/list')) {               // 二级第一步：选集 JSON
        const eps = [1, 2].map((i) => ({
            url: `/b/999/vid${i}.html`, t4: `第${i}集`, t2: `${24 * i}分钟`,
            img: 'http://img.example.com/e.jpg', isIntact: '1',
        }));
        reply({data: {list: eps, total: 2, total_page: 1, series: []}});
    } else if (p.endsWith('.html')) {                         // 二级第二步：详情页 HTML
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(DETAIL_HTML);
    // ══════════ 央视频（cntv 形状）══════════
    } else if (p.startsWith('/List/getVideoAlbumList')) {     // 一级片库
        const list = [1, 2].map((i) => ({
            year: '2023', title: `央视影片${i}`, id: `cntvid${i}`,
            image: `http://img.example.com/c${i}.jpg`, fc: '电视剧', sc: '正片',
        }));
        reply({data: {list}});
    } else if (p.startsWith('/lanmu/columnSearch')) {          // 栏目大全（央视频-2）
        const page = Number(u.searchParams.get('p') || 1);
        const docs = page <= 6 ? [{
            column_name: `栏目${page}`, column_logo: 'http://img.example.com/col.jpg',
            column_firstclass: '栏目', channel_name: 'CCTV-1', column_brief: '测试栏目',
            lastVIDE: {videoSharedCode: `lastvid${page}`},
        }] : [];
        reply({response: {docs}});
    } else if (p.startsWith('/episodesList')) {                // 央视频二级：选集
        const list = [1, 2].map((i) => ({url: `http://127.0.0.1:${PORT}/hls/ep${i}.m3u8`}));
        reply({list});
    } else if (p.startsWith('/api/getHttpVideoInfo.do')) {     // 央视频 play：取 hls 地址
        reply({
            hls_url: `http://127.0.0.1:${PORT}/hls/main.m3u8?cntv=1`,
            manifest: {hls_h5e_url: `http://127.0.0.1:${PORT}/hls/main.m3u8?h5e=1`},
        });
    } else if (p.endsWith('.m3u8')) {                          // 央视频 m3u8 文本
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.end(CNTV_M3U8);
    } else if (p.endsWith('.ts')) {                            // 央视频 TS 分片（二进制）
        res.setHeader('Content-Type', 'video/MP2T');
        res.end(Buffer.from(makeTs()));
    } else {
        reply({});
    }
}).listen(PORT, '127.0.0.1', () => console.log(`MOCK READY on ${PORT}`));

setTimeout(() => process.exit(0), 300000);  // 兜底自毁
