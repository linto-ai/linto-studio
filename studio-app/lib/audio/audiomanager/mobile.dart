import 'package:ffmpeg_kit_flutter_video/ffmpeg_kit.dart';
import 'package:linto_app/logic/file_manager.dart';
import 'package:linto_app/logic/utils.dart';
import './audiomanager.dart';
import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'package:linto_app/audio/microphone/mobile.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter/services.dart';
import 'package:linto_app/audio/wav.dart' show rawToWav;
import 'package:linto_app/logger.dart';
import 'package:linto_app/audio/transcriber.dart';

// ignore: constant_identifier_names
const String CONFIG_FILE_PATH = "assets/config/config.json";

class AudioManager implements AudioManagerInterface {
  @override
  final log = logger(AudioManager);
  static final AudioManager _singleton = AudioManager._internal();
  // Mic audio input
  late Microphone _mic; // microphone singleton
  late Transcriber _transcriber; // transcriber singleton
  bool _isListening = false;
  bool _inputRecorded = false;
  bool _isTranscribing = false;
  bool _paused = false;
  late File _currentWritingFile; //dart:io File
  late IOSink _currentFileSink;
  // Streams
  late StreamSubscription<List<int>> _micStreamSub;
  final StreamController<List<int>> _audioStream =
  StreamController<List<int>>.broadcast(); //Raw audio stream

  Future<Map> _loadSettings() async {
    return jsonDecode(await rootBundle.loadString(CONFIG_FILE_PATH));
  }

  bool get paused => _paused;

  AudioManager._internal();

  void _initialize() async {
    log.i("Initializing AudioManager MOBILE");
    final Map settings = await _loadSettings();
    //init microphone
    _mic = Microphone(settings['audio']['samplingRate'],
        settings['audio']['encoding'], settings['audio']['channels']);
    //init transcriber
    _transcriber = Transcriber();
  }

  /* -------------- Microphone -------------- */

  @override
  void startListening() async {
    if (!_isListening) {
      _mic.start();
      _micStreamSub =
          _mic.audioInputStream.stream.listen((frame) => _onAudioFrames(frame));
      _isListening = true;
      log.d("AudioManager listening");
    }
  }

  @override
  void stopListening() async {
    if (_isListening) {
      _mic.stop();
      await _micStreamSub.cancel();
      _isListening = false;
      log.d("AudioManager stopped listening");
    }
  }

  /// Called on microphone audio frame
  void _onAudioFrames(List<int> frame) {
    _audioStream.add(frame);
    if (_inputRecorded) {
      _currentFileSink.add(frame);
    }
    if (_isTranscribing) {
      _transcriber.pushAudioFrame(frame);
    }
  }

  /* -------------- Recorder -------------- */

  Future<String> startRecording() async {
    if (_inputRecorded) {
      stopRecording();
    }
    String filePath = await _createTempFile();
    _currentWritingFile = File(filePath);
    _currentFileSink = _currentWritingFile.openWrite();
    _inputRecorded = true;
    _paused = false;
    return filePath;
  }

  /// Pauses recording.
  void pauseRecording() {
    if (_inputRecorded) {
      _inputRecorded = false;
      _paused = true;
    }
  }

  /// Resumes recording.
  void resumeRecording() {
    if (!_inputRecorded) {
      _inputRecorded = true;
      _paused = false;
    }
  }

  ///Stops recording and create a temporary wave file in tmp folder.
  ///Return wave file path
  Future<FileData?> stopRecording() async {
    if (_inputRecorded || _paused) {
      _inputRecorded = false;
      await _currentFileSink.close();

      String wavFilePath = await _localFilePath("wav");
      String oggFilePath = await _localFilePath("ogg");

      await rawToWav(_currentWritingFile.path, wavFilePath);

      final session = await FFmpegKit.execute("-hide_banner -y -i '$wavFilePath' -c:a libvorbis -b:a 64k '$oggFilePath'");
      final returnCode = await session.getReturnCode();
      if (returnCode!.isValueSuccess()){
        File(wavFilePath).deleteSync();
      } else if (returnCode.isValueError()) {
        log.d("Recorder: Conversion to ogg failed, defaulting to wav");
        oggFilePath = wavFilePath;
      }

      log.d("Recorder: File size: ${_currentWritingFile.lengthSync()}");
      log.d("Recorder: File written at: $oggFilePath");

      if (_isTranscribing || _paused) {
        stopTranscribing();
        String textfilePath;
        if (oggFilePath.endsWith("wav")) {
          textfilePath = oggFilePath.replaceAll(".wav", ".txt");
        } else {
          textfilePath = oggFilePath.replaceAll(".ogg", ".txt");
        }

        _transcriber.saveTranscription(textfilePath);
      }

      _paused = false;
      String name = formatDate(DateTime.now(), displayYear: true, displayTime: true);
      return FileManager().newFile(File(oggFilePath), name);
    } else {
      _paused = false;
      return null;
    }
  }

  // stop recording without saving anything
  Future<void> dropRecording() async {
    if (_inputRecorded) {
      _inputRecorded = false;
      _currentFileSink.close();

      log.d("Recorder: recording dropped");

      if (_isTranscribing) {
        stopTranscribing();
      }
    }
  }

  /// Create a temporary file
  /// Creating a new file will overwrite the previous one.
  Future<String> _createTempFile({String ext = "raw"}) async {
    Directory tempPath = await getTemporaryDirectory();
    return "${tempPath.path}/recording.$ext";
  }

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();
    return directory.path;
  }

  Future<String> _localFilePath(String ext) async {
    final dateTime = DateTime.now().millisecondsSinceEpoch;
    final path = await _localPath;
    return "$path/$dateTime.$ext";
    // return "$path/Record from ${}.$ext";
  }

  /* -------------- Streaming Transcriber -------------- */
  @override
  void startTranscribing() {
    if (!_isTranscribing) {
      _isTranscribing = true;
      _transcriber.startASR();
    }
  }

  @override
  void stopTranscribing() {
    if (_isTranscribing) {
      _isTranscribing = false;
      _transcriber.stopASR();
    }
  }

  factory AudioManager() {
    _singleton._initialize();
    return _singleton;
  }
}
