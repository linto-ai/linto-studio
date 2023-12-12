import 'dart:convert';
import 'dart:io';

import 'package:linto_app/logic/api/connection_manager.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:path_provider/path_provider.dart';

import '../../data/conversation.dart';
import '../../data/user.dart';
import '../utils.dart';

class GetConversations extends ConnectionManager {
  final String type;
  final String? searchParam;
  final List<String> tags;

  GetConversations(this.type, this.searchParam, this.tags);

  Future<List<Conversation>> send() {
    switch(type) {
      case "fav":
        var url = Uri.https(server, "${baseUrl}api/users/self/favorites");
        return _getConversations(url, searchParam, tags);
      case "share":
        var url = Uri.https(server, "${baseUrl}api/conversations/shared");
        return _getConversations(url, searchParam, tags);
      default:
        var url = Uri.https(server, "${baseUrl}api/organizations/$type/conversations");
        return _getConversations(url, searchParam, tags);
    }
  }

  List<Conversation> _formatConvs(http.Response response) {
    List<Conversation> convs = [];
    final body =  json.decode(response.body);
    body["list"].forEach((value) {
      DateTime uploadDate = DateTime.parse(value["created"]);
      convs.add(Conversation(
          value["_id"],
          value["name"],
          value["description"],
          value["metadata"]["audio"]["duration"],
          uploadDate,
          null
      ));
    });
    return convs;
  }

  Future<List<Conversation>> _getConversations(Uri url, String? searchParam, List<String> tags) async {
    if (!config.isConnected()) return [];
    final queryParams = {
      'sortField' : 'created',
      'sortCriteria' : '-1'
    };
    if (searchParam != null) {
      queryParams["name"] = searchParam;
    }
    queryParams["tags"] = tags.isEmpty ? "" : tags.reduce((value, element) => '$value,$element');
    url = url.replace(queryParameters: queryParams);

    List<Conversation> convs = [];
    await request("GET", url, "Favorites", authorization: true, onSucceed: (response) {
      convs = _formatConvs(response);
    });
    return convs;
  }
}

class GetTranscription extends ConnectionManager {
  final String id;

  GetTranscription(this.id);

  Future<Transcription> send() async {
    if (!config.isConnected()) return Transcription([], ConversationStatus.error);

    var url = Uri.https(server, "${baseUrl}api/conversations/$id/");

    Transcription transcription = Transcription([], ConversationStatus.transcribing);
    Map<String, String> speakers = {};

    await request("GET", url, "Transcription", authorization: true, onSucceed: (response) async {
      final body = json.decode(response.body);
      switch(body["jobs"]["transcription"]["state"]) {
        case "done":
          transcription.status = ConversationStatus.done;
          break;
        case "error":
          transcription.status = ConversationStatus.error;
          break;
        default:
          transcription.status = ConversationStatus.transcribing;
          break;
      }

      body["speakers"].forEach((value) {
        speakers[value["speaker_id"]] = value["speaker_name"];
      });
      body["text"].forEach((value) {
        List<Word> words = value["words"].map<Word>((word) {
          int startSeconds = word["stime"].toInt();
          int startMilli = ((word["stime"] - startSeconds) * 1000).toInt();
          int endSeconds = word["etime"].toInt();
          int endMilli = ((word["etime"] - endSeconds) * 1000).toInt();
          return Word(
              word["word"],
              Duration(seconds: startSeconds, milliseconds: startMilli),
              Duration(seconds: endSeconds, milliseconds: endMilli)
          );
        }).toList();

        Turn turn = Turn(value["segment"], words, speakers[value["speaker_id"]]!);
        transcription.turns.add(turn);
      });
    });

    return transcription;
  }
}

class UpdateConversation extends ConnectionManager {
  final String id;
  final String name;
  final String description;

  UpdateConversation(this.id, this.name, this.description);

  Future<void> send() async {
    if (!config.isConnected()) return;
    var url = Uri.https(server, "${baseUrl}api/conversations/$id/");
    await request("PATCH", url, "Update conversation", authorization: true,
      body: {
        "name": name,
        "description": description
      }
    );
  }
}

class DownloadTranscription extends ConnectionManager {
  final String id;
  String? name;

  DownloadTranscription(this.id, this.name);

  Future<String?> send() async {
    if (!config.isConnected()) return null;
    var url = Uri.https(server, "${baseUrl}api/conversations/$id/download", {'format': 'docx'});
    final metadata = {
      'description' : true,
      'keyword': true,
      'speakers' : true,
      'tags' : true,
      'timestamp' : true
    };
    String? path;

    await request("POST", url, "Download transcription", authorization: true, body: {
      'metadata' : json.encode(metadata)
    }, onSucceed: (response) async {
      if (response.statusCode == 204) {
        path == null;
        return;
      }
      Directory tmpDir = await getTemporaryDirectory();
      name ??= id;
      String filePath = "${tmpDir.path}/$name.docx";

      var file = File(filePath);
      file.writeAsBytesSync(response.bodyBytes);
      path = filePath;
    });
    return path;
  }
}

class DownloadAudio extends ConnectionManager {
  final String id;
  String? name;

  DownloadAudio(this.id, this.name);

  Future<String> send() async {
    if (!config.isConnected()) return "";

    var url = Uri.https(server, "${baseUrl}api/conversations/$id/media");

    String path = "";
    await request("GET", url, "Download audio", authorization: true, onSucceed: (response) async {
      Directory tmpDir = await getTemporaryDirectory();
      name ??= id;
      String filePath = "${tmpDir.path}/$name.mp3";

      var file = File(filePath);
      file.writeAsBytesSync(response.bodyBytes);
      path = filePath;
    });
    return path;
  }
}

class SendConversation extends ConnectionManager {

  File file;
  String orgaId;
  String name;
  String description;
  String lang;
  int membersRights;
  bool diarizationEnabled;
  String diarizationService;
  int numberOfSpeakers;
  dynamic modelConfig;

  SendConversation({required this.file,
    required this.orgaId,
    required this.name,
    required this.description,
    required this.lang,
    required this.membersRights,
    required this.diarizationEnabled,
    required this.diarizationService,
    required this.numberOfSpeakers,
    required this.modelConfig});

  Future<void> send() async {
    if(!config.isConnected()) return;

    var url = Uri.https(server, "${baseUrl}api/organizations/$orgaId/conversations/create");

    String punctuationService = modelConfig["sub_services"]["punctuation"][0]["service_name"];
    String endpoint = modelConfig["endpoints"][0]["endpoint"];
    endpoint = endpoint.substring(1);

    Object transcriptionConfig = {
      "punctuationConfig": {
        "enablePunctuation": modelConfig["model_type"] != "whisper",
        "serviceName": modelConfig["model_type"] != "whisper" ?
        punctuationService : null
      },
      "diarizationConfig": {
        "enableDiarization": diarizationEnabled,
        "numberOfSpeaker": numberOfSpeakers,
        "maxNumberOfSpeaker": numberOfSpeakers,
        "serviceName": diarizationService
      },
      "enableNormalization": true
    };

    await request("POST", url, "Send conversation", authorization: true, isMultipart: true, fields: {
      'name' : name,
      'endpoint': endpoint,
      'lang' : lang,
      'transcriptionConfig' : json.encode(transcriptionConfig),
      'membersRight' : membersRights.toString(),
      'segmentSize' : '2000',
      'description' : description
    }, files: [
      await http.MultipartFile.fromPath(
        'file',
        file.path,
        contentType: MediaType("audio", "mpeg"),
      )
    ]);
  }
}

class GetConversationUsers extends ConnectionManager {
  final String conversationId;

  GetConversationUsers(this.conversationId);

  Future<Tuple<List<User>, List<User>>> send() async {
    if (!config.isConnected()) return Tuple([], []);

    Tuple<List<User>, List<User>> lists = Tuple([], []);

    var url = Uri.https(server, "${baseUrl}api/conversations/$conversationId/users");

    await request("GET", url, "Conversation users", authorization: true, onSucceed: (response) async {
      final body =  jsonDecode(response.body);
      var internal = body["conversationUsers"]["organization_members"];
      var external = body["conversationUsers"]["external_members"];

      internal.forEach((value) {
        final user = User(value["_id"], value["firstname"], value["lastname"], value["email"]);
        user.right = value["right"];
        lists.first.add(user);
      });

      external.forEach((value) {
        final user = User(value["_id"], value["firstname"], value["lastname"], value["email"]);
        user.right = value["right"];
        lists.second.add(user);
      });
    });
    return lists;
  }
}

class InviteUser extends ConnectionManager {
  final String conversationId;
  final String email;
  final int right;

  InviteUser(this.conversationId, this.email, this.right);

  Future<void> send() async {
    if (!config.isConnected()) return;
    var url = Uri.https(server, "${baseUrl}api/conversations/$conversationId/invite");
    await request("POST", url, "Invite User", authorization: true, body: {
      "email": email,
      "right": right.toString(),
    });
  }
}