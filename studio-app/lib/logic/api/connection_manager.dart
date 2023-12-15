import 'dart:async';
import 'package:async/async.dart';
import 'package:http/http.dart' as http;
import 'package:linto_app/logic/config.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:linto_app/logger.dart';
import 'dart:convert';

import '../events.dart';


class RefreshToken {
  static final RefreshToken _instance = RefreshToken._internal();
  factory RefreshToken() {
    return _instance;
  }
  RefreshToken._internal();
  
  bool _isRefreshing = false;
  late Future<http.Response> futureResponse;
  
  Future<http.Response> refresh(String? token, String server, String baseUrl) async {
    if (!_isRefreshing) {
      _isRefreshing = true;
      var url = Uri.https(server, "${baseUrl}auth/refresh");
      futureResponse = http.get(url, headers: {
        "Authorization" : "Bearer $token"
      });
      var response = await futureResponse;
      _isRefreshing = false;
      return response;
    }

    return futureResponse;
  }
}

abstract class ConnectionManager {
  ConnectionManager() :
    baseUrl = Config().baseUrl,
    prefs = Config().preferences,
    server = Config().server ?? "";

  final log = logger(ConnectionManager);
  String _responseMessage = "";
  final config = Config();
  bool error = false;

  late final String server;
  final String baseUrl;
  final SharedPreferences prefs;

  String get responseMessage => _responseMessage;


  http.BaseRequest _postFile(Uri url, Map<String, String> headers, Map<String, String> fields, List<http.MultipartFile> files) {
    final request = http.MultipartRequest("POST", url);

    headers.forEach((key, value) {
      request.headers[key] = value;
    });

    fields.forEach((key, value) {
      request.fields[key] = value;
    });

    for (var element in files) {
      request.files.add(element);
    }
    return request;
  }

  Future<void> request(String method, Uri url, String statusMessage, {
    bool authorization = false,
    bool isMultipart = false,
    Map<String, String>? fields,
    Map<String, String>? headers,
    Object? body,
    List<http.MultipartFile>? files,
    Function(http.Response)? onSucceed
  }) async {
    headers ??= {};
    if (authorization) {
      String? token = prefs.getString("token");
      headers["Authorization"] = "Bearer $token";
    }

    try {
      http.BaseRequest request;
      log.d("sending $method request to $url");
      if (isMultipart) {
        fields ??= {};
        files ??= [];
        request = _postFile(url, headers, fields, files);
      } else {
        http.Request req = http.Request(method, url);
        req.headers.addAll(headers);
        if (body != null) {
          req.body = json.encode(body);
          req.headers["Content-Type"] = "application/json";
        }
        request = req;
      }

      http.Response response = await http.Response.fromStream(await request.send());
      log.d("$statusMessage status: ${response.statusCode}");
      if (await _handleResponse(response, authorization, onSucceed)){
        await this.request(method, url, statusMessage,
          authorization: authorization,
          isMultipart: isMultipart,
          fields: fields,
          headers: headers,
          body: body,
          files: files,
          onSucceed: onSucceed
        );
      }
    } catch (e) {
      log.d(e);
      error = true;
      _responseMessage = "LinTO is not reachable, try turning on internet";
    }
  }

  Future<bool> _tryRefresh(bool authorization, Function(http.Response)? onSucceed) async {
    String? token = prefs.getString("refresh_token");
    var response = await RefreshToken().refresh(token, server, baseUrl);

    if (response.statusCode == 401) {
      clearSavedInfos();
      _responseMessage = "Connection expired";
      return false;
    } else {
      var body = json.decode(response.body);
      prefs.setString("token", body["auth_token"]);
      prefs.setString("refresh_token", body["refresh_token"]);
      prefs.setString("userId", body["user_id"]);
      return true;
    }
  }

  bool _jwtError(String body) {
    final resBody = json.decode(body);
    return resBody["message"] == "invalid signature"
        || resBody["message"] == "jwt expired";
  }

  Future<bool> _handleResponse(http.Response res, bool authorization, Function(http.Response)? onSucceed) async {
    if (res.statusCode >= 400) {
      error = true;
      if (res.statusCode == 401 && authorization && _jwtError(res.body)) {
        return await _tryRefresh(authorization, onSucceed);
      } else {
        final resBody = json.decode(res.body);
        if (resBody["error"] != null) {
          _responseMessage = resBody["error"]["message"];
        } else {
          _responseMessage = resBody["message"];
        }
      }
    } else {
      error = false;
      if (onSucceed != null ){
        await onSucceed(res);
      }
    }
    return false;
  }

  void clearSavedInfos() {
    prefs.setBool("connected", false);
    prefs.remove("token");
    prefs.remove("refresh_token");
    prefs.remove("userId");
    logOutEvent.broadcast();
  }
}

class SafeConnection {
  CancelableOperation? _currentCall;

  void safeCall(Future future, Function call) {
    if (_currentCall != null) {
      _currentCall!.cancel();
    }

    _currentCall = CancelableOperation.fromFuture(future);
    _currentCall!.value.then((value) {
      _currentCall = null;
      call(value);
    });
  }
}