import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/events.dart';

class SortingOptions {
  static final SortingOptions _instance = SortingOptions._internal();
  factory SortingOptions() {
    return _instance;
  }
  SortingOptions._internal() {
    logOutEvent.subscribe((args) {
      _selectedOption = "fav";
      selectedLabel = "Favorites";
    });
  }

  final log = logger(SortingOptions);

  String _selectedOption = "fav";
  String selectedLabel = "Favorites";

  String get selectedOption => _selectedOption;


  set selectedOption(value) {
    _selectedOption = value;
    selectedOptionChanged.broadcast();
  }

}