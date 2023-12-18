import 'package:build_context_provider/build_context_provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/recorder_manager.dart';
import '../logic/file_manager.dart';
import 'components/card_transcription.dart';

class RecordPage extends StatefulWidget {
  const RecordPage({super.key});

  @override
  State<RecordPage> createState() => RecordPageState();
}

class RecordPageState extends State<RecordPage> {
  final List<String> _languageCodes = ['fr', 'gb', 'ru', 'other'];
  final Map<String, Map<String, String>> _languages = {
    'fr': {'name': 'French', 'flag': 'icons/flags/png/fr.png'},
    'gb': {'name': 'English', 'flag': 'icons/flags/png/gb.png'},
    'ru': {'name': 'Russian', 'flag': 'icons/flags/png/ru.png'},
    'other' : {'name': 'Other', 'flag': 'none'}
  };
  final log = logger(RecordPageState);

  final _recorderManager = RecorderManager();

  String _getFlagPath(String languageCode) {
    return 'icons/flags/png/$languageCode.png';
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _recorderManager.pauseRecording();
    super.dispose();
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  void _showToast(BuildContext context, FileData? newFile) {
    BuildContextProvider()((ctx) {
      final scaffold = ScaffoldMessenger.of(ctx);
      scaffold.hideCurrentSnackBar();
      scaffold.showSnackBar(
        SnackBar(content: Row(
          children: [
            const Text('Audio and transcription saved'),
            const Spacer(),
            ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(ctx).hideCurrentSnackBar();
                  ctx.go("/local", extra: newFile);
                },
                child: const Text('Show file')
            )
          ],
        )),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(
          height: 20,
        ),
        Expanded(
          flex: 1,
            child: ValueListenableBuilder<String>(
              valueListenable: _recorderManager.transcriptionNotifier,
              builder: (_, String value, __) {
                return Container(
                  margin: const EdgeInsets.all(24),
                  child: CardTranscription(
                    transcription: value,
                    defaultText: _recorderManager.selectedLanguage != 'other' ? 'Tap microphone icon to start recording' :
                    "Transcription not available for languages other than english, french and russian.",
                    disabled: _recorderManager.selectedLanguage == 'other',
                  ),
                );
              },
            )
        ),
        ValueListenableBuilder<RecorderState>(
          valueListenable: _recorderManager.recordButtonNotifier,
            builder: (_, RecorderState state, __) {
              return DropdownButton<String>(
                  value: _recorderManager.selectedLanguage,
                  items: _languageCodes
                      .map((languageCode) => DropdownMenuItem<String>(
                    value: languageCode,
                    child: Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: languageCode != 'other' ? Image.asset(
                            _getFlagPath(languageCode),
                            package: 'country_icons',
                            fit: BoxFit.cover,
                          ) : const Icon(Icons.block),
                        ),
                        const SizedBox(width: 8),
                        Text(_languages[languageCode]!['name']!),
                      ],
                    ),
                  ))
                      .toList(),
                  onChanged: state == RecorderState.stopped ? (value) {
                setState(() {
                  _recorderManager.selectedLanguage = value!;
                });
              } : null,
              );
            }
        ),
        ValueListenableBuilder<RecorderState>(
            valueListenable: _recorderManager.recordButtonNotifier,
            builder: (BuildContext ctx, RecorderState state, __) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  state != RecorderState.stopped ? FloatingActionButton.large(
                      heroTag: "btn 1",
                      onPressed: state == RecorderState.recording
                          ? _recorderManager.pauseRecording
                          : _recorderManager.resumeRecording,
                      child: state == RecorderState.recording
                          ? const Icon(Icons.pause_circle)
                          : const Icon(Icons.mic_outlined)
                  ) : Container(),
                  state != RecorderState.stopped ? const SizedBox(width: 20) : Container(),
                  FloatingActionButton.large(
                    heroTag: "btn 2",
                    onPressed: () {
                      state == RecorderState.stopped
                          ? _recorderManager.startRecording()
                          : _recorderManager.stopRecording().then((value) {
                            _showToast(context, value);
                      });
                    },
                    child: state == RecorderState.stopped
                        ? const Icon(Icons.mic_outlined)
                        : const Icon(Icons.stop_circle),
                  ),
                ],
              );
            }
        ),
        const SizedBox(
          height: 20,
        ),
      ],
    );
  }
}
