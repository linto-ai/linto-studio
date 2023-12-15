// ignore_for_file: unused_field, prefer_final_fields
import 'dart:convert';
import 'dart:async';
import 'package:flutter/services.dart';

// ignore: constant_identifier_names
const String CONFIG_FILE_PATH = "assets/config/config.json";

abstract class AudioManagerInterface {
  late bool _initialized;
  bool _isListening = false;
  bool _inputRecorded = false;
  bool _isTranscribing = false;
  // Streams
  late StreamSubscription<List<int>> _micStreamSub;
  final StreamController<List<int>> _audioStream =
      StreamController<List<int>>.broadcast(); //Raw audio stream

  Future<Map> _loadSettings() async {
    return jsonDecode(await rootBundle.loadString(CONFIG_FILE_PATH));
  }

  void _initialize() async {
    final Map settings = await _loadSettings();
    _initialized = true;
  }

  /* -------------- Microphone -------------- */

  void startListening() async {}

  void stopListening() async {}

  /// Called on microphone audio frame
  void _onAudioFrames(List<int> frame) {}

  /* -------------- Streaming Transcriber -------------- */
  void startTranscribing() {}

  void stopTranscribing() {}
}
