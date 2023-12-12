
import 'package:event/event.dart';

import '../data/tag.dart';
import 'api/connection_manager.dart';
import 'events.dart';

class SearchParams {
  static final SearchParams _instance = SearchParams._internal();
  factory SearchParams() {
    return _instance;
  }
  SearchParams._internal();

  String _searchQuery = "";
  final Map<String, Tag> _selectedTags = {};


  String get searchQuery => _searchQuery;
  Map<String, Tag> get selectedTags => _selectedTags;
  List<TagCategory> categories = [];

  set searchQuery(String value) {
    _searchQuery = value;
    searchQueryChange.broadcast();
  }

  void clear() {
    _searchQuery = "";
    _selectedTags.clear();
  }

  List<TagCategory> searchTag(String searchQuery) {
    searchQuery = searchQuery.toLowerCase();
    return categories
      .map((category) {
        var tags = category.tags.where((tag) => tag.name.toLowerCase().contains(searchQuery)).toList();
        return TagCategory(category.id, category.name, tags, category.color);
      })
      .where((category) {
        return category.tags.isNotEmpty;
      }).toList();
  }
}