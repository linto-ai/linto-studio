import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:linto_app/logic/api/connection_manager.dart';

import '../../data/tag.dart';
import '../const.dart';

class GetTags extends ConnectionManager {
  final String type;
  final List<String> tags;

  GetTags(this.type, this.tags);

  Future<List<TagCategory>> _getTags(Uri url, List<String> tags, String statusMessage, {Map<String, String>? params}) async {
    if (!config.isConnected()) return [];

    final Map<String, String?> queryParams = {
      "expand": "true"
    };
    if (params != null) {
      queryParams.addAll(params);
    }
    queryParams["tags"] = tags.isEmpty ? null : tags.reduce((value, element) => '$value,$element');
    url = url.replace(queryParameters: queryParams);

    List<TagCategory> categories = [];
    await request("GET", url, statusMessage, authorization: true, onSucceed: (response) {
      if (response.statusCode == 204) return;

      var body = json.decode(response.body);
      body.forEach((category) {
        if (category["type"] == "highlight") {
          return;
        }
        String name = category["name"];
        String id = category["_id"];
        Color color = colors[category["color"]]!;
        List<Tag> tags = [];
        category["tags"].forEach((tag) {
          tags.add(Tag(tag["_id"], tag["name"]));
        });
        categories.add(TagCategory(id, name, tags, color));
      });
    });
    return categories;
  }

  Future<List<TagCategory>> send() async {
    switch (type) {
      case "fav":
        var url = Uri.https(server, "${baseUrl}api/users/self/favorites/tags");
        return _getTags(url, tags, "Favorites tags");
      case "share":
        var url = Uri.https(server, "${baseUrl}api/conversations/shared/tags");
        return _getTags(url, tags, "Shared tags");
      default:
        Uri url;
        if (tags.isEmpty) {
          url = Uri.https(server, "${baseUrl}api/organizations/$type/tags");
        } else {
          url = Uri.https(server, "${baseUrl}api/organizations/$type/categories/search");
        }
        return _getTags(url, tags, "Organization tags", params: {"type" : "explore"});
    }
  }
}