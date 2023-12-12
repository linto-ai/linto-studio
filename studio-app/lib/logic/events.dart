import 'package:event/event.dart';
import 'package:flutter/material.dart';

import '../gui/components/custom_appbar.dart';

class AppBarProps extends EventArgs {
  final String pageName;
  final List<Widget>? actions;
  final AppBarType? type;

  AppBarProps(this.type, this.pageName, this.actions);
}

final _logOutEvent = Event();
final _logInEvent = Event();
final _selectedOptionChanged = Event();
final _changeAppBarEvent = Event<AppBarProps>();
final _userInfoLoaded = Event();
final _searchQueryChange = Event();
final _orgaLoaded = Event();
final _filesLoaded = Event();

Event get logOutEvent => _logOutEvent;
Event get logInEvent => _logInEvent;
Event get selectedOptionChanged => _selectedOptionChanged;
Event<AppBarProps> get changeAppBarEvent => _changeAppBarEvent;
Event get userInfoLoaded => _userInfoLoaded;
Event get searchQueryChange => _searchQueryChange;
Event get orgaLoaded => _orgaLoaded;
Event get filesLoaded => _filesLoaded;
