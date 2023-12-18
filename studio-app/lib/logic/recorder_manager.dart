import 'dart:io';
import 'dart:isolate';

import 'package:build_context_provider/build_context_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/recorder_task_handler.dart';
import 'package:linto_app/logic/utils.dart';
import 'package:path/path.dart';

import '../audio/transcriber.dart';
import 'file_manager.dart';
import 'main_controller.dart';

@pragma("vm:entry-point")
void startCallback() {
  FlutterForegroundTask.setTaskHandler(RecorderTaskHandler());
}

enum RecorderState {
  stopped,
  recording,
  paused
}

class RecorderManager {
  static final RecorderManager _instance = RecorderManager._internal();
  factory RecorderManager() {
    return _instance;
  }
  RecorderManager._internal() {
    _init();
  }

  ReceivePort? _receivePort;
  final log = logger(RecorderManager);

  String _selectedLanguage = 'fr';
  String get selectedLanguage => _selectedLanguage;
  set selectedLanguage(String lang) {
    _transcriber.setLang(lang);
    _selectedLanguage = lang;
  }
  String _transcription = '';
  String _previousTranscription = ' ';
  RecorderState _state = RecorderState.stopped;
  final MainController _ctrl = MainController();
  final Transcriber _transcriber = Transcriber();

  final transcriptionNotifier = ValueNotifier<String>("");
  final recordButtonNotifier = ValueNotifier<RecorderState>(RecorderState.stopped);

  void _init() {
    if (_ctrl.initialized && _ctrl.audioManager.paused) {
      _state = RecorderState.paused;
      recordButtonNotifier.value = _state;
      _selectedLanguage = _transcriber.lang;
      _previousTranscription = _transcriber.completeTranscription;
      _transcription = _transcriber.completeTranscription;
      transcriptionNotifier.value = _transcription;
    }
    _watchTranscriptionUpdate();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _requestPermissionForAndroid();
      _initForegroundTask();

      if (await FlutterForegroundTask.isRunningService) {
        final newReceivePort = FlutterForegroundTask.receivePort;
        _registerReceivePort(newReceivePort);
      }
    });
  }

  Future<void> _requestPermissionForAndroid() async {
    if (!Platform.isAndroid) {
      return;
    }

    // Android 12 or higher, there are restrictions on starting a foreground service.
    //
    // To restart the service on device reboot or unexpected problem, you need to allow below permission.
    if (!await FlutterForegroundTask.isIgnoringBatteryOptimizations) {
      // This function requires `android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` permission.
      await FlutterForegroundTask.requestIgnoreBatteryOptimization();
    }

    // Android 13 and higher, you need to allow notification permission to expose foreground service notification.
    final NotificationPermission notificationPermissionStatus =
    await FlutterForegroundTask.checkNotificationPermission();
    if (notificationPermissionStatus != NotificationPermission.granted) {
      await FlutterForegroundTask.requestNotificationPermission();
    }
  }

  void _initForegroundTask() {
    FlutterForegroundTask.init(
      androidNotificationOptions: AndroidNotificationOptions(
        id: 500,
        channelId: 'linto_recorder',
        channelName: 'LinTO recorder notification',
        channelDescription:
        'This notification appears LinTO.app is recording',
        channelImportance: NotificationChannelImportance.DEFAULT,
        priority: NotificationPriority.DEFAULT,
        visibility: NotificationVisibility.VISIBILITY_PUBLIC,
        buttons: [
          const NotificationButton(
              id: "pause",
              text: "Pause"
          ),
          const NotificationButton(
              id: "resume",
              text: "Resume"
          )
        ]
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
        playSound: false,
      ),
      foregroundTaskOptions: const ForegroundTaskOptions(
        interval: 1000,
        isOnceEvent: false,
        autoRunOnBoot: true,
        allowWakeLock: true,
        allowWifiLock: true,
      ),
    );
  }

  bool _registerReceivePort(ReceivePort? newReceivePort) {
    if (newReceivePort == null) {
      return false;
    }

    _receivePort = newReceivePort;
    _receivePort?.listen((data) {
      if (data is String) {
        if (data == "onNotificationPressed") {
          BuildContextProvider()((context) {
            context.go("/record");
          });
        } else if (data == "pause") {
          pauseRecording();
        } else if (data == "resume") {
          resumeRecording();
        }
      }
    });

    return _receivePort != null;
  }

  void _closeReceivePort() {
    _receivePort?.close();
    _receivePort = null;
  }

  Future<bool> _stopForegroundTask() async {
    await FlutterForegroundTask.clearAllData();
    return FlutterForegroundTask.stopService();
  }

  Future<bool> _startForegroundTask() async {
    // You can save data using the saveData function.
    await FlutterForegroundTask.saveData(key: 'transcription', value: '');
    await FlutterForegroundTask.saveData(
        key: 'recorder_state',
        value: "recording"
    );

    // Register the receivePort before starting the service.
    final ReceivePort? receivePort = FlutterForegroundTask.receivePort;
    final bool isRegistered = _registerReceivePort(receivePort);
    if (!isRegistered) {
      log.e('Failed to register receivePort!');
      return false;
    }

    if (await FlutterForegroundTask.isRunningService) {
      return FlutterForegroundTask.restartService();
    } else {
      return FlutterForegroundTask.startService(
        notificationTitle: 'LinTO.app',
        notificationText: 'Recording...',
        callback: startCallback,
      );
    }
  }

  void _sendEndOfTranscription() {
    int l = _transcription.length;
    var endTranscription = l >= 47 ? _transcription.substring(l - 47) : _transcription;
    if (endTranscription.length >= 47) {
      endTranscription = "...$endTranscription";
    }
    FlutterForegroundTask.saveData(key: 'transcription', value: endTranscription);
  }

  void _onRunningTranscriptionChanged(StringChangeEvent? args) {
    if (_state == RecorderState.recording) {
      _transcription = '$_previousTranscription ${args?.changedValue}';
      transcriptionNotifier.value = _transcription;
      _sendEndOfTranscription();
    }
  }

  void _onCompleteTranscriptionChanged(StringChangeEvent? args) {
    if (_state == RecorderState.recording) {
      _transcription = ' ${args?.changedValue}';
      _previousTranscription = _transcription;
      transcriptionNotifier.value = _transcription;
      _sendEndOfTranscription();
    }
  }

  void _watchTranscriptionUpdate() {
    _transcriber.runningTranscriptionChanged.subscribe(_onRunningTranscriptionChanged);
    _transcriber.completeTranscriptionChanged.subscribe(_onCompleteTranscriptionChanged);
  }

  void setLang(String? value) {
    _transcriber.setLang(value!);
  }

  void startRecording() async {
    _state = RecorderState.recording;
    _transcriber.cleanTranscriptions();
    _ctrl.audioManager.startListening();
    await _ctrl.audioManager.startRecording();
    if (_selectedLanguage != "other") {
      _ctrl.audioManager.startTranscribing();
    }
    await _startForegroundTask();
    recordButtonNotifier.value = _state;
  }

  void pauseRecording() async {
    if (_state != RecorderState.recording) return;

    _ctrl.audioManager.pauseRecording();
    if (_selectedLanguage != "other") {
      _transcriber.flushTranscription();
      _ctrl.audioManager.stopTranscribing();
    }
    await FlutterForegroundTask.saveData(
        key: 'recorder_state',
        value: "paused"
    );
    _state = RecorderState.paused;
    recordButtonNotifier.value = _state;
  }

  void resumeRecording() async {
    if (_state != RecorderState.paused) return;

    _ctrl.audioManager.resumeRecording();
    if (_selectedLanguage != "other") {
      _ctrl.audioManager.startTranscribing();
    }
    await FlutterForegroundTask.saveData(
        key: 'recorder_state',
        value: "recording"
    );
    _state = RecorderState.recording;
    recordButtonNotifier.value = _state;
  }

  Future<FileData?> stopRecording() {
    _ctrl.audioManager.stopListening();
    _stopForegroundTask();
    _closeReceivePort();

    _state = RecorderState.stopped;
    recordButtonNotifier.value = _state;

    BuildContextProvider()((context) {
      showToast(context, "Saving recording...");
    });

    return _ctrl.audioManager.stopRecording();
  }
}