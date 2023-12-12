import 'dart:io';

import 'package:flutter/material.dart';
import 'package:linto_app/logic/utils.dart';
import 'package:share_plus/share_plus.dart';

import '../../logger.dart';
import '../../logic/api/conversations.dart';
import '../../logic/const.dart';

class ConversationItem extends StatelessWidget {
  ConversationItem({
    super.key,
    required this.title,
    this.description,
    this.isLocal = true,
    required this.duration,
    required this.uploadDate,
    required this.shareAudioPath,
    required this.shareTranscriptionPath,
    this.onTap,
    this.selected = false,
    this.onLongPress,
    this.leading,
    required this.onEdit,
  });

  final String title;
  final String? description;
  final String duration;
  final DateTime uploadDate;
  final bool isLocal;
  final bool selected;
  final String shareAudioPath;
  final String shareTranscriptionPath;
  final void Function()? onTap;
  final void Function(String, String) onEdit;
  final void Function()? onLongPress;
  final Widget? leading;

  final log = logger(ConversationItem);

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
          color: selected ? Colors.lightBlue[200] : Colors.white,
          borderRadius: const BorderRadius.all(Radius.circular(8)),
          border: Border.all(
            color: Colors.grey[350]!,
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey[200]!,
              offset: const Offset(1, 1),
              blurRadius: 5.0,
            )
          ]
        ),
        margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        child: ListTile(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "${formatDate(uploadDate)} - $duration",
                style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
              ),
              Text(
                title,
                style: const TextStyle(fontSize: 17),
              )
            ],
          ),
          subtitle: Text(description ?? ""),
          minLeadingWidth: 10,
          titleAlignment: ListTileTitleAlignment.center,
          leading: leading,
          trailing: Wrap(
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                EditButton(
                  isLocal: isLocal,
                  defaultTitle: title,
                  defaultDescription: description,
                  onSave: onEdit,
                ),
                ShareButton(
                  audioPath: shareAudioPath,
                  transcriptionPath: shareTranscriptionPath,
                  name: title,
                  isLocal: isLocal,
                )
              ]),
          onTap: onTap,
          onLongPress: onLongPress,
        )
    );
  }

}

class EditButton extends StatelessWidget {
  const EditButton({super.key, required this.defaultTitle, required this.onSave, this.isLocal = true, this.defaultDescription});
  final String defaultTitle;
  final String? defaultDescription;
  final bool isLocal;
  final void Function(String title, String description) onSave;

  void showPopUp(BuildContext context) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    titleController.value = TextEditingValue(text: defaultTitle);
    if (defaultDescription != null) {
      descriptionController.value = TextEditingValue(text: defaultDescription!);
    }
    showDialog(
        context: context,
        builder: (BuildContext ctx) {
          return AlertDialog(
            title: Text("Edit ${isLocal ? "title" : "media"}"),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(labelText: "New title"),
                ),
                !isLocal ? TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(labelText: "New description"),
                ) : Container()
              ],
            ),
            actions: [
              // The "Cancel" button
              TextButton(
                  onPressed: () {
                    // Close the dialog
                    Navigator.of(context, rootNavigator: true).pop();
                  },
                  child: const Text('Cancel')),
              // The "Save" button
              TextButton(
                  onPressed: () {
                    onSave(titleController.value.text, descriptionController.value.text);
                    // Close the dialog
                    Navigator.of(context, rootNavigator: true).pop();
                  },
                  child: const Text('Save')),
            ],
          );
        }
    );

  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
        onPressed: () => showPopUp(context),
        icon: const Icon(Icons.edit)
    );
  }

}

class ShareButton extends StatelessWidget {
  ShareButton({super.key, this.isLocal = false, this.name, required this.audioPath, required this.transcriptionPath});

  final String audioPath;
  final String transcriptionPath;
  final String? name;
  final bool isLocal;
  final log = logger(ShareButton);

  void _shareTranscription(String path, BuildContext context) {
    if (!isLocal) {
      showToast(context, "Downloading transcription...", duration: const Duration(days: 365));
      final manager = DownloadTranscription(path, name);
      manager.send().then((value) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        if (manager.error) {
          showError(context, manager.responseMessage);
        } else if (value == null) {
          showToast(context, "No transcription available");
        } else {
          _shareFile(value);
        }
      });
    } else {
      _shareLocalTranscription(path);
    }
  }

  void _shareLocalTranscription(String path) async {
    final file = File(path.replaceAll('wav', 'txt'));
    log.d('Sharing file $path');
    final String content = await file.readAsString();
    log.d('Content: $content');
    Share.share(content);
  }

  void _shareAudio(String path, BuildContext context) async {
    if (!isLocal) {
      showToast(context, "Downloading audio...", duration: const Duration(days: 365));
      final manager = DownloadAudio(path, name);
      path = (await manager.send())!;
      if (context.mounted) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        if (manager.error) {
          showError(context, manager.responseMessage);
          return;
        }
      }
    }
    _shareFile(path);
  }

  void _shareFile(String path) async {
    log.d('Sharing file $path');
    XFile file = XFile(path);
    await Share.shareXFiles([file]);
  }

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton(
        child: const Icon(Icons.share),
        onSelected: (String value) {
          switch (value) {
            case 'transcription':
              return _shareTranscription(transcriptionPath, context);
            case 'audio':
              return _shareAudio(audioPath, context);
            default:
              return _shareTranscription(transcriptionPath, context);
          }
        },
        itemBuilder: (BuildContext ctx) => [
          const PopupMenuItem(
              value: 'transcription', child: Text('Share Transcription')),
          const PopupMenuItem(
              value: 'audio', child: Text('Share audio file')),
        ]);
  }
}
