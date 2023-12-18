import 'dart:io';
import 'package:audio_video_progress_bar/audio_video_progress_bar.dart';
import 'package:flutter/material.dart';
import 'package:linto_app/logic/player_manager.dart';
import 'package:linto_app/logger.dart';

class Player extends StatefulWidget {
  const Player({super.key, required this.playerManager});

  final PlayerManager playerManager;

  @override
  State<Player> createState() => PlayerState();
}

class PlayerState extends State<Player> {
  late final PlayerManager _playerManager;
  final log = logger(PlayerState);

  @override
  void initState() {
    _playerManager = widget.playerManager; 
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    _playerManager.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        ValueListenableBuilder(
            valueListenable: _playerManager.progressNotifier,
            builder: (_, value, __) {
              return ProgressBar(
                  progress: value.current,
                  buffered: value.buffered,
                  total: value.total,
                  onSeek: _playerManager.seek,
              );
            }
        ),
        ValueListenableBuilder(
            valueListenable: _playerManager.buttonNotifier,
            builder: (_, value, __) {
              switch (value) {
                case ButtonState.paused:
                  return FloatingActionButton(
                      onPressed: _playerManager.playFile,
                    child: const Icon(Icons.play_arrow_rounded),
                  );
                case ButtonState.playing:
                  return FloatingActionButton(
                    onPressed: _playerManager.pauseFile,
                    child: const Icon(Icons.pause_circle),
                  );
                case ButtonState.loading:
                  return const CircularProgressIndicator();
              }
            }
        )
      ],
    );
  }
}
