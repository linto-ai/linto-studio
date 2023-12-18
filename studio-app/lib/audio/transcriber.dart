// ignore_for_file: constant_identifier_names

import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'dart:io';
import 'package:web_socket_channel/io.dart';
import 'package:flutter/services.dart';
import 'package:linto_app/logger.dart';
import 'package:event/event.dart';

const String CONFIG_FILE_PATH = "assets/config/config.json";

enum WebSocketStatus {
  connecting,
  connected,
  closing,
  closed,
  reconnecting,
  disconnected,
}

class StringChangeEvent extends EventArgs {
  String changedValue;
  StringChangeEvent(this.changedValue);
}

class Transcriber {
  final log = logger(Transcriber);
  static final Transcriber _singleton = Transcriber._internal();
  late dynamic _webSocket;
  String _lang = 'fr';
  String get lang => _lang;
  WebSocketStatus? _webSocketStatus;
  String _completeTranscription = '';
  String _runningTranscription = '';
  String get completeTranscription => _completeTranscription;
  String get runningTranscription => _runningTranscription;

  final runningTranscriptionChanged = Event<StringChangeEvent>();
  final completeTranscriptionChanged = Event<StringChangeEvent>();

  final List<int> _buffer = [];

  Future<Map> _loadSettings() async {
    return jsonDecode(await rootBundle.loadString(CONFIG_FILE_PATH));
  }

  Transcriber._internal();

  void setLang(String lang) {
    _lang = lang;
  }

  void startASR() async {
    log.d("Starting ASR");
    Map settings = await _loadSettings();
    final configData = utf8.encode('{"config": {"sample_rate": 16000}}');
    // Shall i use basic auth ?
    final auth = settings["streamingAsr"][_lang]["auth"];
    final headers = auth.isNotEmpty
        ? {'Authorization': 'Basic ${base64.encode(utf8.encode(auth))}'}
        : null;
    log.d("Connecting to ${settings['streamingAsr'][_lang]['uri']}");
    log.d("Headers: $headers");
    _webSocket = IOWebSocketChannel.connect(
        settings['streamingAsr'][_lang]['uri'],
        headers: headers);
    _webSocket.stream.listen((event) {
      _processWebSocketMessage(event);
    }, onDone: () {
      _onWebSocketDone();
    }, onError: (error) {
      log.e('WebSocket error: $error');
    });
    await _webSocket.sink.add(configData);
  }

  void pushAudioFrame(List<int> frame) async {
    _buffer.addAll(frame);
    if (_buffer.length >= 2000) {
      // 0.5s of audio as 16kHz mono
      _flushBuffer();
    }
  }

  void _flushBuffer() {
    try {
      final chunkData = Int16List.fromList(_buffer);
      _webSocket.sink.add(chunkData.buffer.asUint16List());
      _buffer.clear();
    } catch (e) {
      log.e(e);
    }
  }

  void _processWebSocketMessage(dynamic message) {
    final jsonMessage = json.decode(message);
    if (jsonMessage.containsKey('partial')) {
      final String partial = jsonMessage['partial'].replaceAll('<unk>', '');
      _runningTranscription =
          partial; // Replace previous partials with the latest one
      runningTranscriptionChanged
          .broadcast(StringChangeEvent(_runningTranscription));
    } else if (jsonMessage.containsKey('text')) {
      final String finalTranscript =
          jsonMessage['text'].replaceAll('<unk>', '');
      if (_completeTranscription.isNotEmpty) {
        _completeTranscription += " ";
      }
      _completeTranscription += finalTranscript;
      completeTranscriptionChanged
          .broadcast(StringChangeEvent(_completeTranscription));
    }
    log.d("running: $_runningTranscription");
    log.d("complete: $_completeTranscription");
  }

  void cleanTranscriptions() {
    _completeTranscription = '';
    _runningTranscription = '';
    completeTranscriptionChanged.broadcast(StringChangeEvent(''));
    runningTranscriptionChanged.broadcast(StringChangeEvent(''));
  }

  void flushTranscription() {
    if (_runningTranscription.isNotEmpty) {
      _completeTranscription += " $_runningTranscription ";
      _runningTranscription = '';

      completeTranscriptionChanged
          .broadcast(StringChangeEvent(_completeTranscription));
      runningTranscriptionChanged.broadcast(StringChangeEvent(''));
    }
  }

  void _onWebSocketDone() {
    log.d('WebSocket disconnected.');
    if (_webSocketStatus == WebSocketStatus.connected) {
      // WebSocket disconnected unexpectedly, try to reconnect
      _webSocketStatus = WebSocketStatus.reconnecting;
      int attempt = 0;
      int delay = 1000; // start with 1 second delay
      Timer.periodic(Duration(milliseconds: delay), (timer) async {
        attempt++;
        try {
          startASR(); // try to reconnect
          _webSocketStatus = WebSocketStatus.connected;
          timer.cancel();
          log.d('WebSocket reconnected after $attempt attempts.');
        } catch (e) {
          log.d('WebSocket reconnection attempt $attempt failed: $e');
          if (attempt >= 5) {
            // maximum number of attempts reached, stop trying
            _webSocketStatus = WebSocketStatus.disconnected;
            timer.cancel();
            log.d('WebSocket reconnection failed after $attempt attempts.');
          } else {
            // double the delay time with each attempt
            delay *= 2;
          }
        }
      });
    } else if (_webSocketStatus == WebSocketStatus.connecting) {
      // WebSocket failed to connect, try to reconnect
      _webSocketStatus = WebSocketStatus.reconnecting;
      startASR();
    }
  }

  void stopASR() async {
    log.d("Stopping ASR");
    final configData = utf8.encode('{"eof": 1}');
    _webSocket.sink.add(configData);
    _webSocket.sink.close();
    log.d(_completeTranscription);
  }

  void saveTranscription(String path) async {
    await Future.delayed(const Duration(milliseconds: 500), () {});
    log.d('transcription $_runningTranscription');
    log.d('completetranscription $_completeTranscription');

    final textFile = File(path);
    await textFile
        .writeAsString(_completeTranscription + _runningTranscription);
    log.d(
        "Transcriber: File written at: $path with content: $_runningTranscription");
  }

  factory Transcriber() {
    return _singleton;
  }
}
