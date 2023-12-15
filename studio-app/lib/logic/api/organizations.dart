import 'dart:convert';

import 'package:linto_app/logic/api/connection_manager.dart';

import '../../data/organization.dart';

class GetOrganizations extends ConnectionManager {
  Future<List<Organization>> send() async {
    if (!config.isConnected()) return [];

    var url = Uri.https(server, "${baseUrl}api/organizations");

    List<Organization> organizations = [];
    await request("GET", url, "Organizations", authorization: true, onSucceed: (response) async {
      final body =  json.decode(response.body);
      body.forEach((value) {
        final members = value["users"];
        String? userId = config.getUserId();
        final member = members.firstWhere((u) => u["userId"] == userId);
        organizations.add(Organization(value["_id"], value["name"], member["role"]));
      });
    });
    return organizations;
  }

}