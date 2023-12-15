import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:linto_app/logic/const.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Config {
  static final Config _instance = Config._internal();
  factory Config() {
    return _instance;
  }
  Config._internal() {
    _loadConfig();
  }

  late List<Server> _servers;
  late String _baseUrl;
  late SharedPreferences _prefs;
  bool initialized = false;

  List<Server> get servers => _servers;
  String? get server => _prefs.getString("server");
  set server(String? newServer) {
    _prefs.setString("server", newServer ?? "");
  }
  String get baseUrl => _baseUrl;
  SharedPreferences get preferences => _prefs;

  void _loadConfig() async {
    final settings = await _loadSettings();
    _servers = settings["lintoAPI"]["domains"].map<Server>((e) => Server(e["label"], e["domain"])).toList();
    _baseUrl = settings["lintoAPI"]["apiPath"];
    _initStorage();
  }

  Future<Map> _loadSettings() async {
    return jsonDecode(await rootBundle.loadString(CONFIG_FILE_PATH));
  }

  Future<void> _initStorage() async {
    _prefs = await SharedPreferences.getInstance();
    if (!_prefs.containsKey("server") && _servers.isNotEmpty) {
      _prefs.setString("server", _servers[0].domain);
    }
    initialized = true;
  }

  bool isConnected() {
    bool? connected = _prefs.getBool("connected");
    if (connected == null) {
      return false;
    }
    return connected;
  }

  String? getToken() {
    if (!isConnected()) return null;
    return _prefs.getString("token");
  }

  String? getUserId() {
    if (!isConnected()) return null;
    return _prefs.getString("userId");
  }
}

class Server {
  final String label;
  final String domain;

  Server(this.label, this.domain);
}