import 'package:event/event.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/gui/components/empty_page.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/api/connection_manager.dart';
import 'package:linto_app/logic/api/conversations.dart';
import 'package:linto_app/logic/api/users.dart';
import 'package:linto_app/logic/config.dart';
import 'package:linto_app/logic/utils.dart';

import '../data/conversation.dart';
import '../data/user.dart';
import '../logic/events.dart';

class Share extends StatefulWidget {
  const Share({super.key, required this.sharedConv});

  final Conversation sharedConv;

  @override
  State<Share> createState() => ShareState();
}

class ShareState extends State<Share> {
  final log = logger(ShareState);
  final _debounce = Debounce();
  final _safeConnection = SafeConnection();
  bool _usersLoaded = true;
  Map<String, User> externalUsers = {};
  Map<String, User> internalUsers = {};
  List<User> filteredUsers = [];
  final Map<String, int> _cachedUsers = {};
  final TextEditingController controller = TextEditingController();

  void onLogout(EventArgs? _) => context.go("/cloud");

  @override
  void initState() {
    super.initState();
    logOutEvent.subscribe(onLogout);
    _listConvUsers();
  }

  @override void setState(VoidCallback fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  @override
  void dispose() {
    logOutEvent.unsubscribe(onLogout);
    _debounce.clear();
    super.dispose();
  }

  void _listConvUsers() {
    setState(() => _usersLoaded = false);
    final manager = GetConversationUsers(widget.sharedConv.id);
    manager.send().then((value) {
      if (manager.error) {
        showError(context, manager.responseMessage);
      } else {
        for (var user in value.first) {
          _cachedUsers[user.id] = user.right;
        }
        for (var user in value.second) {
          _cachedUsers[user.id] = user.right;
        }
        setState(() {
          value.first.where((e) => e.id != Config().getUserId()).forEach((element) {
            internalUsers[element.id] = element;
          });
          value.second.where((e) => e.id != Config().getUserId()).forEach((element) {
            externalUsers[element.id] = element;
          });
        });
      }
      setState(() => _usersLoaded = true);
    });
  }

  void _listUsers (String query) {
    setState(() => _usersLoaded = false);
    final manager = SearchUsers(query);
    _safeConnection.safeCall(manager.send(), (value) {
      if (manager.error) {
        showError(context, manager.responseMessage);
      } else {
        for (User user in value) {
          user.right = _cachedUsers[user.id] ?? 0;
        }
        setState(() {
          filteredUsers = value.where((e) => e.id != Config().getUserId()).toList();
        });
      }
      setState(() => _usersLoaded = true);
    });
  }

  void saveUser(User user, int right) {
    _cachedUsers[user.id] = right;
    user.right = right;
    if (internalUsers[user.id] != null) {
      internalUsers[user.id]?.right = right;
    } else {
      externalUsers[user.id] = user;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
                onPressed: () {
                  context.go("/cloud", extra: widget.sharedConv);
                },
                icon: const Icon(Icons.arrow_back)
            ),
            Flexible(child: Text(
              "Sharing ${widget.sharedConv.name}",
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            )),
            const SizedBox(width: 32)
          ],
        ),
        Container(
            margin: const EdgeInsets.only(left: 15, right: 15),
            child: TextField(
              controller: controller,
              decoration: const InputDecoration(labelText: "Invite a user"),
              onChanged: _debounce.onSearchQueryChanged((_) { }, (value) {
                _listUsers(value);
              }),
            ),
        ),
        controller.value.text == "" ?
            Expanded(child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                Container(margin: const EdgeInsets.only(left: 15, right: 15), child: const Text("Organization members")),
                const SizedBox(height: 20),
                UserList(users: internalUsers.values.toList(), usersLoaded: _usersLoaded, conversation: widget.sharedConv, saveUser: saveUser),
                const SizedBox(height: 20),
                Container(margin: const EdgeInsets.only(left: 15, right: 15), child: const Text("External users")),
                const SizedBox(height: 20),
                UserList(users: externalUsers.values.toList(), usersLoaded: _usersLoaded, conversation: widget.sharedConv, saveUser: saveUser)
              ],
            ))
        : UserList(users: filteredUsers, usersLoaded: _usersLoaded, conversation: widget.sharedConv, saveUser: saveUser)
      ],
    );
  }
}

class UserList extends StatelessWidget {
  const UserList({super.key, required this.users, required this.usersLoaded, required this.conversation, required this.saveUser});

  final List<User> users;
  final bool usersLoaded;
  final Conversation conversation;
  final void Function(User, int) saveUser;

  @override
  Widget build(BuildContext context) {
    return Flexible(child : usersLoaded ? (users.isNotEmpty ? ListView.builder(
        shrinkWrap: true,
        itemCount: users.length,
        itemBuilder: (context, index) {
          final user = users[index];
          return UserTile(user: user, conversation: conversation, saveUser: saveUser);
        }
    ) : const EmptyPage(message: "No users found")) : const Center(child: CircularProgressIndicator()));
  }

}

class UserTile extends StatelessWidget {
  UserTile({super.key, required this.user, required this.conversation, required this.saveUser});
  final User user;
  final Conversation conversation;
  final log = logger(UserTile);
  final void Function(User, int) saveUser;

  @override
  Widget build(BuildContext context) {
    TextEditingController ctrl = TextEditingController();
    return ListTile(
      title: Text("${user.firstname} ${user.lastname}"),
      subtitle: Text(user.email),
      trailing: DropdownMenu(
        controller: ctrl,
        label: const Text("Member's rights"),
        initialSelection: user.right,
        dropdownMenuEntries: const [
          DropdownMenuEntry(value: 0,  label: "None"),
          DropdownMenuEntry(value: 1,  label: "Read"),
          DropdownMenuEntry(value: 3,  label: "Comment"),
          DropdownMenuEntry(value: 7,  label: "Write"),
          DropdownMenuEntry(value: 23, label: "Share"),
          DropdownMenuEntry(value: 31, label: "All rights"),
        ],
        onSelected: (value) {
          final manager = InviteUser(conversation.id, user.email, value!);
          manager.send().then((_) {
            if (manager.error) {
              showError(context, manager.responseMessage);
            } else if (value == 0) {
              showToast(context, "User ${user.firstname} ${user.lastname} can't access the media ${conversation.name} anymore");
              saveUser(user, value);
            } else {
              showToast(context, "User ${user.firstname} ${user.lastname} has now access to the media ${conversation.name}");
              saveUser(user, value);
            }
          });
        },
      ),
    );
  }

}