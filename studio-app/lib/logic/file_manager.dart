import 'dart:io';

import 'package:just_audio/just_audio.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/config.dart';
import 'package:linto_app/logic/utils.dart';
import 'package:path_provider/path_provider.dart';

class FileData {
  final String uuid;
  late DateTime modified;
  String _name;
  String get name => _name;
  set name(String newName) {
    _name = newName;
    Config().preferences.setString(uuid, newName);
  }
  final String length;

  late final File _transcription;
  File get transcription => _transcription;
  late final File _media;
  File get media => _media;

  FileData(this.uuid, this.length, String name, String ext) : _name = name {
    modified = DateTime.now();
    _initFiles(ext);
  }

  void _initFiles(String ext) async {
    final directory = await getApplicationDocumentsDirectory();
    final dirPath = directory.path;
    _transcription = File("$dirPath/$uuid.txt");
    _media = File("$dirPath/$uuid.$ext");
  }
}

class FileManager {
  static final FileManager _instance = FileManager._internal();
  factory FileManager() {
    return _instance;
  }
  FileManager._internal() {
    _listFiles();
  }
  bool filesLoaded = false;

  final log = logger(FileManager);
  final List<FileData> _files = [];
  List<FileData> get files => _files;

  String _getUUID(FileSystemEntity file) {
    String uuid = file.uri.pathSegments.last.split('.')[0];
    return uuid;
  }
  String _getExtension(FileSystemEntity file) {
    String ext = file.uri.pathSegments.last.split('.')[1];
    return ext;
  }
  String _getFileName(String uuid) {
    return Config().preferences.getString(uuid)!;
  }

  Future<FileData> _addFile(FileSystemEntity file, AudioPlayer player) async {
    String length = await getAudioLength(file.path, player) ?? "00:00:00";
    String uuid = _getUUID(file);
    String ext = _getExtension(file);
    String name = _getFileName(uuid);
    final res = FileData(uuid, length, name, ext);
    _files.add(res);
    return res;
  }

  void _sortFiles() {
    _files.sort(
      (r, l) => l.modified.compareTo(r.modified));
  }

  void _listFiles() async {
    final dir = await getApplicationDocumentsDirectory();
    var tempFiles = dir
        .listSync()
        .where((e) =>
    e is File && (e.path.endsWith('.wav') || e.path.endsWith(".ogg")))
        .toList();
    tempFiles.sort(
            (r, l) => l.statSync().modified.compareTo(r.statSync().modified));
    var player = AudioPlayer();
    for (var element in tempFiles) {
      try {
        var file = await _addFile(element, player);
        file.modified = element.statSync().modified;
      } catch (e) {
        // file that isn't named properly
        element.delete();
      }
    }
    player.dispose();
    filesLoaded = true;
  }

  Future<FileData> newFile(FileSystemEntity file, String name) async {
    String uuid = _getUUID(file);
    Config().preferences.setString(uuid, name);
    var player = AudioPlayer();
    final res = await _addFile(file, player);
    player.dispose();
    _sortFiles();
    return res;
  }

  void deleteFiles(List<FileData> filesToDelete) {
    for (FileData file in filesToDelete) {
      _files.remove(file);
      Config().preferences.remove(file.uuid);
      file.transcription.deleteSync();
      file.media.deleteSync();
    }
  }
}