// Singleton that provides access to the sound getting recorded by the device's microphone.
import './microphone.dart';
import 'dart:async';
import 'dart:typed_data';
import 'package:mic_stream/mic_stream.dart';
//custom logger
import 'package:linto_app/logger.dart';

//TODO : Recycle WebVoiceSDK to implement a Web version of this class.
class Microphone implements MicrophoneInterface {
  final log = logger(Microphone);
  static final Microphone _singleton = Microphone._internal();
  late int _sampleRate;
  late int _encoding;
  late int _channels;
  late Stream? _micStream;
  late StreamSubscription _listener;
  // Public stream
  @override
  late StreamController<Uint8List> audioInputStream;
  bool _isListening = false;

  Microphone._internal();

  void _initialize() async {
    _micStream = await MicStream.microphone(
        sampleRate: _sampleRate,
        audioFormat: AudioFormat.ENCODING_PCM_16BIT,
        channelConfig: ChannelConfig.CHANNEL_IN_MONO,
        audioSource: AudioSource.MIC);
    audioInputStream = StreamController<Uint8List>.broadcast();
  }

  @override
  void start() {
    if (!_isListening) {
      _listener =
          _micStream!.listen((samples) => audioInputStream.add(samples));
      _isListening = true;
    }
  }

  @override
  void stop() {
    if (_isListening) {
      _listener.cancel();
      _isListening = false;
    }
  }

  factory Microphone(int sampleRate, int encoding, int channels) {
    _singleton._channels = channels;
    _singleton._encoding = encoding;
    _singleton._sampleRate = sampleRate;
    _singleton._initialize();
    return _singleton;
  }
}
