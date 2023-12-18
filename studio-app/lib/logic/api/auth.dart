import 'dart:convert';

import 'package:linto_app/logic/api/connection_manager.dart';

import '../events.dart';

class Login extends ConnectionManager {
  String email;
  String password;

  Login(this.email, this.password);

  Future<void> send() async {
    var url = Uri.https(server, "${baseUrl}auth/login");
    await request("POST", url, "login",
        body: {'email' : email, 'password' : password},
        onSucceed: (response) {
          final body =  jsonDecode(response.body);

          if (response.statusCode == 200) {
            prefs.setString("token", body["auth_token"]);
            prefs.setString("refresh_token", body["refresh_token"]);
            prefs.setString("userId", body["user_id"]);
            prefs.setBool("connected", true);
            logInEvent.broadcast();
          }
        }
    );
  }
}

class Logout extends ConnectionManager {
  Future<void> send() async {
    if (!config.isConnected()) return;

    var url = Uri.https(server, "${baseUrl}auth/logout");
    await request("GET", url, "logout", authorization: true, onSucceed: (response) {
      clearSavedInfos();
    });
  }
}
