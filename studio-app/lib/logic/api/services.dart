import 'dart:convert';

import 'package:linto_app/logic/api/connection_manager.dart';

class GetServices extends ConnectionManager {
  Future<List<dynamic>> send() async {
    if (!config.isConnected()) return [];

    var url = Uri.https(server, "${baseUrl}api/services");
    List<dynamic> services = [];
    await request("GET", url, "Services", authorization: true, onSucceed: (response) {
      services = json.decode(response.body);
    });
    return services;
  }
}