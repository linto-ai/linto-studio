import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/logic/file_manager.dart';
import 'package:linto_app/gui/components/conversation_card.dart';
import 'package:linto_app/gui/components/conversation_item.dart';
import 'package:linto_app/gui/components/custom_appbar.dart';
import 'package:linto_app/gui/components/empty_page.dart';
import 'package:linto_app/logic/events.dart';
import 'package:linto_app/logic/utils.dart';
import 'package:linto_app/logger.dart';

import '../data/conversation.dart';
import '../logic/config.dart';

class LocalFilesPage extends StatefulWidget {
  const LocalFilesPage({super.key, this.file});

  final FileData? file;

  @override
  State<LocalFilesPage> createState() => LocalFilesPageState();
}

class LocalFilesPageState extends State<LocalFilesPage> {
  final FileManager _fileManager = FileManager();
  bool _selectionMode = false;
  late List<bool> _selectedFiles;
  List<FileData> _selectedEntries = [];

  FileData? _selectedFile;
  final log = logger(LocalFilesPageState);

  @override
  void initState() {
    super.initState();
    if (widget.file != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => selectFile(widget.file!));
    }
    if (!_fileManager.filesLoaded) {
      filesLoaded.subscribe((args) {
        setState(() {
          _selectedFiles = List.filled(_fileManager.files.length, false);
        });
      });
    } else {
      _selectedFiles = List.filled(_fileManager.files.length, false);
    }
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  void _setBar(FileData file) {
    String title = file.name;
    changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, title, [
      EditButton(
          defaultTitle: title,
          onSave: _onSaveSelectedFileEdition
      ),
      ShareButton(
          isLocal: true,
          audioPath: file.media.path,
          transcriptionPath: file.transcription.path
      ),
      const SizedBox(width: 10)
    ]));
  }

  void _editFile(FileData file, String value) {
    value = value.replaceAll(RegExp(r'\s{2,}'), ' ').trim();
    if (value.isEmpty) {
      showError(context, "Cannot enter an empty title");
      return;
    }
    file.name = value;
  }

  void _onSaveSelectedFileEdition(String value, String _) {
    setState(() {
      _editFile(_selectedFile!, value);
    });
    _setBar(_selectedFile!);
  }

  void _onSaveEdition(String value, FileData file) {
    _editFile(file, value);
    setState(() {});
  }

  void selectFile(FileData file) {
    _setBar(file);
    setState(() {
      _selectedFile = file;
    });
  }

  void _delete(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext ctx) {
          return AlertDialog(
            title: Text('Confirm deletion of ${_selectedEntries.length} record${_selectedEntries.length > 1 ? 's' : ''}'),
            content: const Text('This action is definitive and irreversible.'),
            actions: [
              // The "Cancel" button
              TextButton(
                  onPressed: () {
                    // Close the dialog
                    Navigator.of(context, rootNavigator: true).pop();
                  },
                  child: const Text('Cancel')),
              // The "Delete" button
              TextButton(
                  onPressed: () {
                    _fileManager.deleteFiles(_selectedEntries);

                    setState(() {
                      _selectedFiles = List.filled(_fileManager.files.length, false);
                      _selectedEntries = [];
                      _selectionMode = false;
                    });
                    // Remove the box
                    // Close the dialog
                    Navigator.of(context, rootNavigator: true).pop();
                  },
                  child: const Text('Delete')),
            ],
          );
        });
  }

  String _getTranscriptionText(File transcriptionFile){
    return transcriptionFile.readAsStringSync();
  }

  Conversation _createConversation(String transcription) {
    final conv = Conversation("", "", "", 0, DateTime(0), 0,
        transcription: Transcription(
            [Turn(
              transcription.isNotEmpty ? transcription : "Transcription not available",
              [],
              "speaker",
            )],
            ConversationStatus.done
        )
    );
    conv.mediaFile = _selectedFile?.media;
    return conv;
  }

  void _onSelect(int index) {
    _selectedFiles[index] = !_selectedFiles[index];
    if(_selectedFiles[index]) {
      _selectedEntries.add(_fileManager.files[index]);
    } else {
      _selectedEntries.remove(_fileManager.files[index]);
    }
    bool acc = false;
    int i = 0;
    while (i < _selectedFiles.length && !acc) {
      acc = acc || _selectedFiles[i];
      i++;
    }
    setState(() => _selectionMode = acc);
  }


  @override
  Widget build(BuildContext context) {
    Key conversationCardKey = Key(_selectedFile?.uuid ?? "");
    final files = _fileManager.files;
    return _selectedFile == null ? Column(
        children: [
          _selectionMode ? Container(
              decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(width: 1, color: Colors.grey))
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                      style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.all(Colors.white),
                          shape: MaterialStateProperty.all(
                              RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  side: const BorderSide(width: 2, color: Colors.red)
                              )
                          )
                      ),
                      onPressed: () => _delete(context),
                      child: const Text("Delete", style: TextStyle(color: Colors.red))
                  ),
                  const SizedBox(width: 20)
                ],
              ))
              : Container(),
          Expanded(
            flex: 1,
            child: _fileManager.filesLoaded ? (
                files.isNotEmpty ? ListView.builder(
                  itemCount: files.length,
                  itemBuilder: (context, index) {
                    final element = files.elementAt(index);
                    return ConversationItem(
                      title: element.name,
                      duration: element.length,
                      uploadDate: element.media.statSync().modified,
                      shareAudioPath: element.media.path,
                      shareTranscriptionPath: element.transcription.path,
                      selected: _selectedFiles[index],
                      onTap: () {
                        if (_selectionMode) {
                          _onSelect(index);
                        } else {
                          selectFile(element);
                        }
                      },
                      onEdit: (value, _) => _onSaveEdition(value, element),
                      onLongPress: () {
                        _onSelect(index);
                      },
                    );
                  },
                ) : const EmptyPage(message: "No local files")) : const Center(child: CircularProgressIndicator()),
          ),
        ])
        : ConversationCard(
      key: conversationCardKey,
      conversation: _createConversation(_getTranscriptionText(_selectedFile!.transcription)),
      onBackPressed: () {
        changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "My local recordings", []));
        setState(() {
          _selectedFile = null;
        });
      },
      isLocal: true,
      file: _selectedFile?.media,
      customButtonMessage: "Transcribe with LinTO Studio (better quality)",
      onCustomButtonPressed: () {
        context.go(
            Config().isConnected() ? "/cloud/upload" : "/cloud",
            extra: Config().isConnected() ? _selectedFile : null
        );
      },
    );
  }
}