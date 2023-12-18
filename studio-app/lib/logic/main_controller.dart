import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:linto_app/audio/audiomanager/web.dart'
    if (dart.library.io) 'package:linto_app/audio/audiomanager/mobile.dart';
import 'package:flutter/services.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:linto_app/logger.dart';

class MainController {
  bool _initialized = false;
  bool get initialized => _initialized;
  final log = logger(MainController);
  static final MainController _singleton = MainController._internal();
  late final AudioManager audioManager;

  MainController._internal();

  /// Initialize the application
  void _initialize() async {
    // Platform specific
    if (!kIsWeb) {
      if (!await requestPermissions()) {
        log.e("Some permission denied");
        SystemNavigator.pop();
      }
    }
    audioManager = AudioManager();
    log.d("Loaded");
    _initialized = true;
  }

  /// Request permission from device
  Future<bool> requestPermissions() async {
    if (!await Permission.microphone.status.isGranted) {
      if (!await Permission.microphone.request().isGranted) {
        return false;
      }
    }
    if (!await Permission.mediaLibrary.status.isGranted) {
      if (!await Permission.mediaLibrary.request().isGranted) {
        return false;
      }
    }
    return true;
  }

  factory MainController() {
    if (!_singleton._initialized) _singleton._initialize();
    return _singleton;
  }
}
