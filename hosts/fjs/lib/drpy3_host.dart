// drpy3 × fjs Dart 宿主（W13）。
// 职责仅三件：装配 fjs JsEngine（内置模块 + bridge + bundle 模块装载）、
// 分发 fjs.bridge_call 到宿主处理器（req/loadAsset/getProxy/evalModule）、
// 以 JSON 字符串边界转发六环节（协议见 hosts/fjs/glue.mjs 头注）。
//
// pdf 四件套/解析/加密/模板全部在 JS 侧 bundle 内实现（cheerio 版 htmlParser 与
// Node 参考宿主同源），Dart 侧不需要任何 HTML 解析依赖；req 用 dart:io HttpClient
// 零依赖实现（语义对齐 cli/node-host.mjs：重定向跟随、出错不抛、buffer 1/2 语义）。
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:fjs/fjs.dart';
import 'package:flutter/services.dart' show rootBundle;

/// 桥协议错误（胶水 drpy3Call 返回 {"__drpy3_error": {...}} 时抛出）。
class Drpy3Exception implements Exception {
  final String stage;
  final String error;
  final String? hint;
  final String? rule;
  Drpy3Exception(this.stage, this.error, {this.hint, this.rule});

  @override
  String toString() => 'Drpy3Exception($stage): $error${hint == null ? '' : '\n  hint: $hint'}';
}

/// 宿主桥处理器：把 JS 侧 fjs.bridge_call({action, ...}) 映射到 Dart 实现。
/// req 之外的 action 返回 null 即"宿主未提供"（胶水走引擎兜底）。
abstract class Drpy3BridgeHandlers {
  /// HTTP（drpy3 req 契约）：返回 {content, headers}；出错不抛。
  Future<Map<String, dynamic>> req(String url, Map<String, dynamic> options);

  /// 读源目录资产（wasm/模块文件）：返回文本或字节；未实现返回 null。
  Future<Object?> loadAsset(String path) async => null;

  /// 本地代理地址；未实现返回 null（引擎兜底 127.0.0.1:9978）。
  Future<String?> getProxy(bool isPublic) async => null;

}

/// req 默认实现：dart:io HttpClient（零依赖）。gbk 等非 latin1/utf8 编码
/// 请自行替换 handlers（如挂 charset_converter），默认 latin1 兜底。
class Drpy3IoHandlers extends Drpy3BridgeHandlers {
  final HttpClient _client = HttpClient()
    ..connectionTimeout = const Duration(seconds: 10);
  final String? Function()? proxyAddress;

  Drpy3IoHandlers({this.proxyAddress});

  @override
  Future<Map<String, dynamic>> req(String url, Map<String, dynamic> options) async {
    try {
      final method = (options['method'] ?? 'GET').toString().toUpperCase();
      final headers = <String, String>{};
      for (final e in ((options['headers'] ?? <String, dynamic>{}) as Map).entries) {
        headers[e.key.toString()] = e.value.toString();
      }
      // data：GET 拼 query；非 GET 序列化为请求体（引擎多数已拼好 body，此处兜底）
      var uri = Uri.parse(url);
      var body = options['body']?.toString();
      final data = options['data'];
      if (data is Map && data.isNotEmpty) {
        if (method == 'GET') {
          final q = Map<String, String>.from(uri.queryParameters);
          data.forEach((k, v) => q[k.toString()] = v.toString());
          uri = uri.replace(queryParameters: q);
        } else if (body == null || body.isEmpty) {
          final ct = headers.entries
              .firstWhere((e) => e.key.toLowerCase() == 'content-type',
                  orElse: () => const MapEntry('', ''))
              .value;
          body = ct.contains('json') ? jsonEncode(data) : Uri(queryParameters: _flat(data)).query;
        }
      }
      final req = await _client.openUrl(method, uri);
      headers.forEach(req.headers.set);
      if (body != null && method != 'GET' && method != 'HEAD') {
        req.add(utf8.encode(body));
      }
      final timeoutMs = (options['timeout'] as num?)?.toInt() ?? 8000;
      final res = await req.close().timeout(Duration(milliseconds: timeoutMs));
      final bytes = await _collect(res, Duration(milliseconds: timeoutMs));

      final outHeaders = <String, dynamic>{'status': 'HTTP/1.1 ${res.statusCode}'};
      res.headers.forEach((name, values) => outHeaders[name] = values.join(', '));

      final buffer = (options['buffer'] as num?)?.toInt() ?? 0;
      Object content;
      if (buffer == 1) {
        content = bytes;
      } else if (buffer == 2) {
        content = base64Encode(bytes);
      } else {
        final charsetRes = outHeaders.entries
            .firstWhere((e) => e.key.toLowerCase() == 'content-type',
                orElse: () => const MapEntry('', ''))
            .value;
        content = _decode(bytes, charsetRes, options['encoding']?.toString());
      }
      return {'content': content, 'headers': outHeaders};
    } catch (e) {
      return {'content': '', 'headers': {'error': e.toString()}}; // 出错不抛（drpy2 契约）
    }
  }

  @override
  Future<String?> getProxy(bool isPublic) async => proxyAddress?.call();

  static Map<String, String> _flat(Map m) =>
      m.map((k, v) => MapEntry(k.toString(), v.toString()));

  static Future<Uint8List> _collect(HttpClientResponse res, Duration timeout) async {
    final builder = BytesBuilder(copy: false);
    await for (final chunk in res) {
      builder.add(chunk);
    }
    return builder.takeBytes();
  }

  static String _decode(Uint8List bytes, String contentType, String? encoding) {
    final m = RegExp(r'charset=([\w-]+)', caseSensitive: false).firstMatch(contentType);
    final encName = (encoding != null && encoding.isNotEmpty ? encoding : m?.group(1)) ?? 'utf-8';
    final name = encName.toLowerCase();
    try {
      return Encoding.getByName(name)?.decode(bytes) ?? utf8.decode(bytes, allowMalformed: true);
    } on FormatException {
      return latin1.decode(bytes, allowInvalid: true);
    }
  }
}

/// drpy3 宿主入口：装配引擎 → 注入 bundle → 暴露六环节 JSON 边界。
class Drpy3Host {
  final JsEngine engine;
  final Drpy3BridgeHandlers handlers;
  bool _closed = false;
  static bool _libInited = false;
  int _moduleSeq = 0;

  Drpy3Host._(this.engine, this.handlers);

  /// 装载 drpy3-fjs bundle（assets/drpy3-fjs.bundle.js 的文本）并完成 setup。
  static Future<Drpy3Host> create({
    required String bundleSource,
    Drpy3BridgeHandlers? handlers,
    String fjsVersion = '',
  }) async {
    if (!_libInited) {
      await LibFjs.init(); // flutter_rust_bridge 加载器（进程内一次）
      _libInited = true;
    }
    final h = handlers ?? Drpy3IoHandlers();
    final engine = await JsEngine.create(
      builtins: const JsBuiltinOptions(
        console: true, timers: true, buffer: true, url: true, util: true, json: true,
      ),
    );
    final host = Drpy3Host._(engine, h);
    await engine.init(bridge: host._dispatch);
    await engine.evaluateModule(
      module: JsModule.code(module: 'drpy3', code: bundleSource),
    );
    await host._call('drpy3Setup', [jsonEncode({'fjsVersion': fjsVersion})]);
    return host;
  }

  /// 便捷装载：从 Flutter 资产读 bundle 并装配宿主。
  /// 方式 A（包依赖引入本包）用默认 package 资产路径；
  /// 方式 B（拷文件进 app）传 assetPath: 'assets/drpy3-fjs.bundle.js'。
  static Future<Drpy3Host> createWithAsset({
    String assetPath = 'packages/drpy3_fjs_host/assets/drpy3-fjs.bundle.js',
    Drpy3BridgeHandlers? handlers,
    String fjsVersion = '',
  }) async {
    final bundle = await rootBundle.loadString(assetPath);
    return create(bundleSource: bundle, handlers: handlers, fjsVersion: fjsVersion);
  }

  /// 桥分发：JsValue.object → action 路由 → JsResult。
  Future<JsResult> _dispatch(JsValue value) async {
    try {
      final msg = value.asObject;
      if (msg == null) return JsResult.err(const JsError.generic('bridge: 非对象消息'));
      String str(Map<String, JsValue> m, String k) => m[k]?.asString ?? '';
      Map<String, dynamic> obj(Map<String, JsValue> m, String k) {
        final v = m[k]?.asObject;
        if (v == null) return const {};
        return v.map((key, e) => MapEntry(key, e.value));
      }

      switch (str(msg, 'action')) {
        case 'req':
          final r = await handlers.req(str(msg, 'url'), obj(msg, 'options'));
          return JsResult.ok(JsValue.from(r));
        case 'loadAsset':
          return JsResult.ok(JsValue.from(await handlers.loadAsset(str(msg, 'path')) ?? ''));
        case 'getProxy':
          return JsResult.ok(JsValue.from(await handlers.getProxy(str(msg, 'isPublic') == 'true') ?? ''));
        case 'evalModule':
          // 模式 A（源含 import/export）：注册为 fjs 动态模块并回传模块名，胶水 import(name)。
          // fjs 模块一经加载不可替换——源热更需重建引擎（README 已知限制）。
          final name = 'drpy3_src_${_moduleSeq++}';
          await engine.declareNewModule(
            module: JsModule.code(module: name, code: str(msg, 'code')),
          );
          return JsResult.ok(JsValue.from(name));
        default:
          return JsResult.ok(const JsValue.none());
      }
    } catch (e) {
      return JsResult.err(JsError.generic('bridge 处理异常: $e'));
    }
  }

  // ────────── 六环节 JSON 边界 ──────────

  /// 装载 drpy3 源。drpy2 老源不支持（fjs 档 A 无 syncReq 同步桥）。
  Future<Map<String, dynamic>> loadSource(String code, String key,
      {String? path, String? signature, Object? extend}) async {
    final out = await _call('drpy3Load', [
      code, key, path ?? '', extend == null ? '' : jsonEncode(extend), signature ?? '',
    ]);
    return out;
  }

  Future<Map<String, dynamic>> callSource(String key, String method, List<dynamic> args) =>
      _call('drpy3Call', [key, method, jsonEncode(args)]);

  Future<Map<String, dynamic>> capabilities() => _call('drpy3Capabilities', []);

  /// store 快照：导出全部命名空间（存盘用）/ 导入上次快照（启动时先调）。
  Future<String> storeExport() => _callRaw('drpy3StoreExport', []);
  Future<void> storeImport(String json) => _callRaw('drpy3StoreImport', [json]);

  Future<Map<String, dynamic>> _call(String fn, List<dynamic> params) async {
    final raw = await _callRaw(fn, params);
    final decoded = jsonDecode(raw);
    if (decoded is Map && decoded['__drpy3_error'] != null) {
      final e = (decoded['__drpy3_error'] as Map).map((k, v) => MapEntry('$k', v));
      throw Drpy3Exception('${e['stage']}', '${e['error']}',
          hint: e['hint']?.toString(), rule: e['rule']?.toString());
    }
    return (decoded ?? <String, dynamic>{}) as Map<String, dynamic>;
  }

  Future<String> _callRaw(String fn, List<dynamic> args) async {
    _ensureRunning();
    final result = await engine.call(
      module: 'drpy3',
      method: fn,
      params: args.map(JsValue.from).toList(),
    );
    return result.asString ?? '';
  }

  void _ensureRunning() {
    if (_closed || !engine.running) {
      throw StateError('Drpy3Host 已关闭或引擎未初始化');
    }
  }

  /// 后台 JS 错误排空（未 catch 的定时器/Promise 错误），建议周期调用并上报日志。
  List<String> drainJobErrors() => engine.drainUnhandledJobErrors();

  Future<void> close() async {
    if (_closed) return;
    _closed = true;
    await engine.close();
  }
}
