import 'dart:async';

import 'package:just_audio/just_audio.dart';
import 'package:flutter/material.dart';
import 'package:linto_app/data/conversation.dart';
import 'package:linto_app/logger.dart';

import 'config.dart';

class PlayerManager {
  final _myPlayer = AudioPlayer();
  final log = logger(PlayerManager);
  final Conversation conversation;
  late Future<void> initialized;

  final progressNotifier = ValueNotifier<ProgressBarState>(
    ProgressBarState(
      current: Duration.zero,
      buffered: Duration.zero,
      total: Duration.zero,
    ),
  );
  final buttonNotifier = ValueNotifier<ButtonState>(ButtonState.loading);

  PlayerManager(this.conversation) {
    initialized = _initPlayer();
  }

  Future<void> _initPlayer() async {
    if (conversation.mediaFile == null) {
      // using a hack in just_audio lib to enable exact sync: see https://github.com/linto-ai/linto.app/issues/2
      // and https://github.com/linto-ai/just_audio
      _myPlayer.setAudioSource(ProgressiveAudioSource(
          Uri.parse(conversation.mediaUri),
          headers: {
            "Authorization": "Bearer ${Config().getToken()}"
          },
      ));
    } else {
      _myPlayer.setFilePath(conversation.mediaFile!.path);
    }
    _myPlayer.playerStateStream.listen((event) {
      final isPlaying = event.playing;
      final processingState = event.processingState;
      if (processingState == ProcessingState.loading || processingState == ProcessingState.buffering) {
        buttonNotifier.value = ButtonState.loading;
      } else if (!isPlaying) {
        buttonNotifier.value = ButtonState.paused;
      } else if (processingState != ProcessingState.completed){
        buttonNotifier.value = ButtonState.playing;
      } else {
        _myPlayer.seek(Duration.zero);
        pauseFile();
      }
    });

    _myPlayer.positionStream.listen((position) {
      final oldState = progressNotifier.value;
      progressNotifier.value = ProgressBarState(
        current: position,
        buffered: oldState.buffered,
        total: oldState.total,
      );
    });

    _myPlayer.bufferedPositionStream.listen((bufferedPosition) {
      final oldState = progressNotifier.value;
      progressNotifier.value = ProgressBarState(
        current: oldState.current,
        buffered: bufferedPosition,
        total: oldState.total,
      );
    });

    _myPlayer.durationStream.listen((totalPosition) {
      final oldState = progressNotifier.value;
      progressNotifier.value = ProgressBarState(
        current: oldState.current,
        buffered: oldState.buffered,
        total: totalPosition ?? Duration.zero,
      );
    });
  }

  void playFile() async {
    log.d('Playing file ${conversation.mediaFile ?? conversation.mediaUri}');
    _myPlayer.play();
  }

  void pauseFile() {
    _myPlayer.pause();
  }

  void seek(Duration position) {
    _myPlayer.seek(position);
  }

  void dispose() {
    initialized.then((_){
      _myPlayer.dispose();
    });
  }
}

class ProgressBarState {
  ProgressBarState({
    required this.current,
    required this.buffered,
    required this.total,
  });
  final Duration current;
  final Duration buffered;
  final Duration total;
}

enum ButtonState {
  paused, playing, loading
}