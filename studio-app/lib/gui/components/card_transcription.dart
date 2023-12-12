import 'package:flutter/material.dart';
import 'package:linto_app/logger.dart';

class CardTranscription extends StatelessWidget {
  CardTranscription(
      {super.key, this.transcription = '', this.defaultText = '', this.disabled = false});

  final String transcription;
  final String defaultText;
  final bool disabled;
  final log = logger(CardTranscription);

  @override
  Widget build(BuildContext context) {
    return Card(
        color: disabled ? Colors.grey : Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: BorderSide(
            color: Colors.grey.withOpacity(0.2),
          ),
          borderRadius: const BorderRadius.all(Radius.circular(12)),
        ),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: transcription == '' || disabled
              ? Text(defaultText,
                  style: const TextStyle(fontSize: 16), textAlign: TextAlign.center)
              : SingleChildScrollView(
                  child: Text(
                  transcription,
                  style: const TextStyle(fontSize: 16),
                )),
        ));

    ;
  }
}
