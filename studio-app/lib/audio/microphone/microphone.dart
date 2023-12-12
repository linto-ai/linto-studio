import 'dart:async';
import 'dart:typed_data';

abstract class MicrophoneInterface {
  late int _sampleRate;
  late int _encoding;
  late int _channels;
  late Stream? _micStream;
  late StreamSubscription _listener;
  // Public stream
  late StreamController<Uint8List> audioInputStream;
  bool _isListening = false;

  void _initialize() async {}

  void start() {}

  void stop() {}
}
