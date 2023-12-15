import 'package:flutter/material.dart';

class TagCategory {
  final String _id;
  String get id => _id;
  final String _name;
  String get name => _name;
  final List<Tag> _tags;
  List<Tag> get tags => _tags;
  final Color _color;
  Color get color => _color;

  TagCategory(String id, String name, List<Tag> tags, Color color)
      : _id = id, _name = name, _tags = tags, _color = color;
}

class Tag {
  final String _id;
  String get id => _id;
  final String _name;
  String get name => _name;

  Tag(String id, String name) : _id = id, _name = name;
}
