// W13 真实引擎验收：drpy3-fjs bundle 在 fjs（Rust QuickJS）内跑百忙无果1 六环节。
// 与 Node 侧 test/w13-fjs-host.test.mjs 同源（同一 bundle、同一演示稿、同一 mock 数据形状），
// 但这里是真实 fjs 引擎 + 真实 bridge（flutter_rust_bridge）+ Dart HttpClient req。
// 运行：cd hosts/fjs && flutter test integration_test/smoke_test.dart -d windows
import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:drpy3_fjs_host/drpy3_host.dart';

const detailHtml = '<!doctype html><html><head><title>详情页</title></head><body>\n'
    '<div class="m-details"><h1>测试影片</h1><p>类型：国产动漫</p><p>地区：中国大陆</p>'
    '<p>上映：2023-01-01</p><p>导演：测试导演</p><p>主演：张三 李四 王五</p></div>\n'
    '<div class="video-img"><img src="//img.example.com/pic.jpg"></div>\n'
    '<div class="desc">简介：这是一个用于冒烟测试的影片简介。</div>\n'
    '<div class="vt-txt">测试影片全名</div>\n</body></html>';

Future<HttpServer> _startMock() async {
  final server = await HttpServer.bind('127.0.0.1', 0);
  server.listen((req) async {
    final p = req.uri.path;
    final port = server.port;
    void reply(Object obj, {String type = 'application/json; charset=utf-8'}) {
      req.response.headers.set('Content-Type', type);
      req.response.write(jsonEncode(obj));
      req.response.close();
    }

    if (p.startsWith('/rider/list')) {
      final docs = [1, 2, 3].map((i) => {
            'title': '影片$i',
            'img': 'http://img.example.com/$i.jpg',
            'updateInfo': '更新至第$i集',
            'rightCorner': {'text': 'HD'},
            'playPartId': 'vid$i',
          }).toList();
      reply({'data': {'hitDocs': docs}});
    } else if (p.startsWith('/msite/search')) {
      final q = req.uri.queryParameters['q'];
      reply({'data': {'contents': [
        {'type': 'media', 'data': [{
          'desc': ['2023', '动漫'],
          'source': 'imgo',
          'img': 'http://img.example.com/s.jpg',
          'rpt': 'idx=50&other=1',
          'title': '<B>$q</B>',
          'url': 'http://127.0.0.1:$port/b/999/vid9.html',
        }]},
      ]}});
    } else if (p.startsWith('/episode/list')) {
      final eps = [1, 2].map((i) => {
            'url': '/b/999/vid$i.html',
            't4': '第$i集',
            't2': '${24 * i}分钟',
            'img': 'http://img.example.com/e.jpg',
            'isIntact': '1',
          }).toList();
      reply({'data': {'list': eps, 'total': 2, 'total_page': 1, 'series': []}});
    } else if (p.endsWith('.html')) {
      req.response.headers.set('Content-Type', 'text/html; charset=utf-8');
      req.response.write(detailHtml);
      await req.response.close();
    } else {
      reply(const {});
    }
  });
  return server;
}

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  binding;

  testWidgets('百忙无果1 六环节在真实 fjs 引擎内跑通', (tester) async {
    final mock = await _startMock();
    final b = 'http://127.0.0.1:${mock.port}';

    final bundle = await rootBundle.loadString('assets/drpy3-fjs.bundle.js');
    var code = await rootBundle.loadString('assets/test/bm1.source.js');
    for (final h in [
      'https://pianku.api.%6d%67%74%76.com',
      'https://mobileso.bz.%6d%67%74%76.com',
      'https://pcweb.api.mgtv.com',
      'https://www.mgtv.com',
    ]) {
      code = code.replaceAll(h, b);
    }

    final host = await Drpy3Host.create(bundleSource: bundle, fjsVersion: 'integration-test');
    addTearDown(host.close);

    // 自检 1/2：check 无 missing；能力表五件套全 host
    final check = await host.capabilities();
    print('DRPY3-CAPS = ' + check.toString()); // 真实 fjs 能力表
    expect(check['req'], 'host');
    expect(check['pdfh'], 'host');
    expect(check['pdfl'], 'host');
    // fjs 内置 quickjs-ng 实测含 WebAssembly → 引擎报告 native（任务书 W13 验收项：报告正确）
    expect(check['wasm'], 'native');

    await host.loadSource(code, '_bm1_win');
    await host.callSource('_bm1_win', 'init', ['']);

    final home = await host.callSource('_bm1_win', 'home', ['']);
    expect((home['class'] as List).length, 7, reason: 'home：静态分类 7 个');
    expect(((home['filters'] as Map?) ?? const {}).isNotEmpty, isTrue, reason: 'home：gzip filter 解压');

    final cate = await host.callSource('_bm1_win', 'category', ['3', 1, false, {}]);
    final cateList = (cate['list'] as List).cast<Map>();
    expect(cateList.length, 3, reason: 'category：json:一级 3 条');
    expect(cateList[0]['vod_id'], '3\$vid1', reason: 'category：分类\$id 前缀');
    expect(cateList[0]['vod_remarks'], '更新至第1集');

    final search = await host.callSource('_bm1_win', 'search', ['斗罗大陆', false, 1]);
    final searchList = (search['list'] as List).cast<Map>();
    expect(searchList.length, 1, reason: 'search：imgo 过滤后 1 条');
    expect(searchList[0]['vod_name'], '斗罗大陆', reason: 'search：<B> 清洗');
    expect(searchList[0]['vod_id'], '50\$vid9');

    final detail = await host.callSource('_bm1_win', 'detail', [searchList[0]['vod_id']]);
    final vod = (detail['list'] as List).cast<Map>()[0];
    expect(vod['vod_name'], '测试影片全名', reason: 'detail：pdfh .vt-txt（bundle 内 cheerio）');
    expect(vod['vod_pic'], 'http://img.example.com/pic.jpg', reason: 'detail：pd 协议相对补全');
    final eps = (vod['vod_play_url'] as String).split('#');
    expect(eps.length, 2, reason: 'detail：2 集列表');

    final firstPlay = eps[0].split('\$').sublist(1).join('\$');
    final play = await host.callSource('_bm1_win', 'play', [vod['vod_play_from'], firstPlay, []]);
    expect(play['url'], firstPlay, reason: 'play：url 透传');
    expect(play['parse'], 1);
    expect(play['jx'], 0);

    // store 快照通道
    await host.storeImport(jsonEncode({'_bm1_win': {'visit': 'n1'}}));
    final dump = jsonDecode(await host.storeExport()) as Map;
    expect(((dump['_bm1_win'] as Map)['visit']), 'n1');

    await mock.close();
  }, timeout: const Timeout(Duration(minutes: 5)));
}
