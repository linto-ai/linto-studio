import 'dart:isolate';

import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:linto_app/logger.dart';

class RecorderTaskHandler extends TaskHandler {
  SendPort? _sendPort;
  final log = logger(RecorderTaskHandler);

  @override
  void onStart(DateTime timestamp, SendPort? sendPort) {
    _sendPort = sendPort;
  }

  @override
  void onDestroy(DateTime timestamp, SendPort? sendPort) {
    log.d("Task destroyed");
  }

  @override
  void onRepeatEvent(DateTime timestamp, SendPort? sendPort) async {
    String? state = await FlutterForegroundTask
        .getData<String>(key: 'recorder_state');

    String? transcription = await FlutterForegroundTask
        .getData<String>(key: 'transcription');
    String text = transcription == null || transcription.isEmpty ? "Recording..." : transcription;

    FlutterForegroundTask.updateService(
      notificationTitle: 'LinTO.app: $state',
      notificationText: text,
    );
  }

  @override
  void onNotificationButtonPressed(String id) {
    switch (id) {
      case "pause":
        _sendPort?.send("pause");
        break;
      case "resume":
        _sendPort?.send("resume");
        break;
      default:
        _sendPort?.send("pause");
        break;
    }
  }
}