import 'dart:convert';

import 'package:linto_app/logic/api/connection_manager.dart';

import '../../data/user.dart';

class CreateUser extends ConnectionManager {

  final String firstName;
  final String lastName;
  final String email;
  final String password;

  CreateUser(this.firstName, this.lastName, this.email, this.password);

  Future<void> send() async {
    var url = Uri.https(server, "${baseUrl}api/users");
    await request("POST", url, "Create user", body: {
      'email' : email,
      'password' : password,
      'firstname' : firstName,
      'lastname' : lastName
    });
  }
}

class GetUserInfo extends ConnectionManager {
  Future<dynamic> send() async {
    if (!config.isConnected()) return "";

    dynamic userInfo;
    var url = Uri.https(server, "${baseUrl}api/users/self");
    await request("GET", url, "User Info", authorization: true, onSucceed: (response) async {
      userInfo = jsonDecode(response.body);
    });

    return userInfo;
  }
}

class GetUserRight extends ConnectionManager {
  final String conversationId;

  GetUserRight(this.conversationId);

  Future<int> send() async {
    if (!config.isConnected()) return 0;

    int userRight = 0;
    var url = Uri.https(server, "${baseUrl}api/conversations/$conversationId/rights");

    await request("GET", url, "User right", authorization: true, onSucceed: (response) async {
      final body =  jsonDecode(response.body);
      userRight = body["right"];
    });
    return userRight;
  }
}

class SearchUsers extends ConnectionManager {
  final String search;

  SearchUsers(this.search);

  Future<List<User>> send() async {
    if (!config.isConnected() || search == "") return [];

    final url = Uri.https(server, "${baseUrl}api/users/search", {"search": search});

    List<User> users = [];

    await request("GET", url, "Search users", authorization: true, onSucceed: (response) {
      if (response.statusCode == 204) return;
      final body = json.decode(response.body);

      body.forEach((value) {
        users.add(User(value['_id'], value['firstname'], value['lastname'], value['email']));
      });
    });

    return users;
  }
}

class ToggleFavorite extends ConnectionManager {
  final String conversationId;
  final bool status;

  ToggleFavorite(this.conversationId, this.status);

  Future<void> send() async {
    if (!config.isConnected()) return;

    var url = Uri.https(server, "${baseUrl}api/users/self/favorites/$conversationId");
    String method = status ? "PUT" : "DELETE";

    await request(method, url, "toggle favorites", authorization: true);
  }
}