import 'dart:io';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:linto_app/gui/components/player.dart';
import 'package:linto_app/logic/player_manager.dart';

import '../../data/conversation.dart';
import '../../logger.dart';

class ConversationCard extends StatefulWidget {
  const ConversationCard({super.key, required this.conversation, required this.onBackPressed, this.customButtonMessage, this.onCustomButtonPressed, this.isLocal = false, this.file});

  final Conversation conversation;
  final void Function() onBackPressed;
  final String? customButtonMessage;
  final void Function()? onCustomButtonPressed;
  final bool isLocal;
  final FileSystemEntity? file;

  @override
  State<ConversationCard> createState() => ConversationCardState();
}

class ConversationCardState extends State<ConversationCard> {
  late Transcription _transcription;
  bool _loadingConv = true;
  final log = logger(ConversationCardState);
  late PlayerManager _playerManager;

  @override
  void initState() {
    super.initState();
    _playerManager = PlayerManager(widget.conversation);
    _getTranscription();
  }

  Future<void> _getTranscription() async {
    Transcription conv = await widget.conversation.getTranscription(context);
    setState(() {
      _loadingConv = false;
      _transcription = conv;
    });
  }

  @override
  void setState(fn) {
    if(mounted) {
      super.setState(fn);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            IconButton(onPressed: widget.onBackPressed,
                icon: const Icon(Icons.arrow_back)
            ),
            const Spacer(),
            widget.customButtonMessage != null ? TextButton(
                onPressed: widget.onCustomButtonPressed,
                child: Text(widget.customButtonMessage!)
            ) : Container()
          ],
        ),
        Expanded(
          child: !_loadingConv ?
            RefreshIndicator(
              onRefresh: () async {
                await _getTranscription();
              },
              child: TranscriptionBox(
                transcription: _transcription,
                status: widget.isLocal ? ConversationStatus.done : _transcription.status,
                isLocal: widget.isLocal,
                playerManager: _playerManager,
            )) :
            const Center(child: CircularProgressIndicator())
        ),
        Container(
            padding: const EdgeInsets.all(10),
            child: Center(
                child: Player(playerManager: _playerManager)
            )
        )
      ],
    );
  }
}

class TranscriptionBox extends StatelessWidget {
  const TranscriptionBox({super.key, required this.transcription, required this.status, required this.isLocal, required this.playerManager});

  final Transcription transcription;
  final ConversationStatus status;
  final bool isLocal;
  final PlayerManager playerManager;

  Widget _error(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) =>
      ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          Container(
            constraints: BoxConstraints(
              minHeight: constraints.maxHeight
            ),
            child: const Center(
              child: Text("Unexpected error happened during transcription\nTry re-upload your media.", textAlign: TextAlign.center),
            )
          )
        ],
    ));
  }

  Widget _transcribing(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) =>
        ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            Container(
              constraints: BoxConstraints(
                minHeight: constraints.maxHeight
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 20),
                  Text("Your media is still transcribing.", textAlign: TextAlign.center),
                  Text("It might take a while, a few minutes to a couple of hours depending on the media size", textAlign: TextAlign.center)
                ],
              )
            )
          ],
        )
    );
  }

  Widget _done(BuildContext context) {
    var turns = transcription.turns;
    return ListView.builder(
        itemCount: turns.length,
        itemBuilder: (context, index) {
          final item = turns.elementAt(index);
          return ListTile(
            title: Text(item.speaker),
            subtitle: isLocal ? Text(item.segment) :
              ValueListenableBuilder(
                valueListenable: playerManager.progressNotifier,
                builder: (_, value, __) {
                  return Text.rich(TextSpan(
                      children: item.words.map((word) {
                        bool highlight = word.startTime <= value.current && value.current <= word.endTime;
                        return TextSpan(
                            text: "${word.word} ",
                            style: TextStyle(backgroundColor: highlight ? Colors.blue[100] : Colors.white),
                            recognizer: TapGestureRecognizer()
                              ..onTap = () {
                                playerManager.seek(word.startTime);
                              }
                        );
                      }).toList()
                  ));
                },
              ),
          );
        }
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (status) {
      case ConversationStatus.done:
        return _done(context);
      case ConversationStatus.transcribing:
        return _transcribing(context);
      case ConversationStatus.error:
        return _error(context);
    }
  }
}
