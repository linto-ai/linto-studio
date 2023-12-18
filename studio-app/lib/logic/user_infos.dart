import 'package:event/event.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/api/organizations.dart';
import 'package:linto_app/logic/api/users.dart';
import 'package:linto_app/logic/config.dart';

import '../data/organization.dart';
import 'events.dart';

class UserInfos {
  static final UserInfos _instance = UserInfos._internal();
  factory UserInfos() => _instance;
  UserInfos._internal() {
    logOutEvent.subscribe((args) {
      _organizations = [];
      _userName = "";
      _favorites = [];
    });
    logInEvent.subscribe((args) {
      _initInfos();
    });
    _initInfos();
  }

  void _initInfos() {
    if (Config().isConnected()) {
      getOrganizations();
      getUserInfo();
    }
  }

  void getUserInfo() {
    final manager = GetUserInfo();
    manager.send().then((value) {
      if (manager.error) {
        return;
      }
      _userName = "${value["firstname"]} ${value["lastname"]}";
      _favorites = [];
      value["favorites"].forEach((element) {
        _favorites.add(element);
      });
      userInfoLoaded.broadcast();
    });
  }

  Future<void> getOrganizations() async {
    final manager = GetOrganizations();
    _organizations = await manager.send();
    if (manager.error) {
      return;
    }
    orgaLoaded.broadcast();
  }

  final log = logger(UserInfos);

  List<Organization> _organizations = [];
  String _userName = "";
  List<String> _favorites = [];

  List<Organization> get organizations => _organizations;
  List<String> get favorites => _favorites;
  String get userName => _userName;
}