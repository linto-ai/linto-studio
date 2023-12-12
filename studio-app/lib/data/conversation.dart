import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:linto_app/logic/api/conversations.dart';
import 'package:linto_app/logic/config.dart';

import '../logger.dart';
import '../logic/utils.dart';

enum ConversationStatus {
  done,
  transcribing,
  error
}

class Word {
  final String word;
  final Duration startTime;
  final Duration endTime;

  Word(this.word, this.startTime, this.endTime);
}

class Turn {
  final String speaker;
  final String segment;
  final List<Word> words;

  Turn(this.segment, this.words, this.speaker);
}

class Transcription {
  final List<Turn> turns;
  ConversationStatus status;

  Transcription(this.turns, this.status);
}

class Conversation {
  final log = logger(Conversation);

  String id;
  String name;
  String description;
  double length;
  DateTime uploadDate;
  int? rights;

  Transcription _transcription = Transcription([], ConversationStatus.transcribing);
  String _mediaUri = "";
  FileSystemEntity? mediaFile;

  String get mediaUri {
    return _mediaUri;
  }


  Conversation(this.id, this.name, this.description, this.length, this.uploadDate, this.rights, {Transcription? transcription}) {
    if (transcription != null) _transcription = transcription;

    String? server = Config().server;
    _mediaUri = "https://$server/cm-api/api/conversations/$id/media";
  }

  Future<Transcription> getTranscription(BuildContext context) async {
    if (_transcription.turns.isEmpty) {
      final manager = GetTranscription(id);
      _transcription = await manager.send();
      if (manager.error && context.mounted) {
        showError(context, manager.responseMessage);
        return Transcription([], ConversationStatus.transcribing);
      }
      return _transcription;
    }

    return _transcription;
  }
}
