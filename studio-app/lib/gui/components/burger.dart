import 'package:event/event.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:linto_app/logic/api/auth.dart';
import 'package:linto_app/logic/config.dart';
import 'package:linto_app/logic/user_infos.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/sorting_options.dart';

import '../../logic/events.dart';


class UserMenu extends StatelessWidget {
  UserMenu({super.key, required this.closeDrawer});

  final void Function() closeDrawer;
  final log = logger(UserMenu);

  @override
  Widget build(BuildContext context) {
    if (Config().isConnected()) {
      return ConnectedDrawer(closeDrawer: closeDrawer);
    }
    return NotConnectedDrawer(closeDrawer: closeDrawer);
  }
}

class NotConnectedDrawer extends StatelessWidget {
  NotConnectedDrawer({super.key, required this.closeDrawer});

  final Function() closeDrawer;

  final log = logger(NotConnectedDrawer);
  @override
  Widget build(BuildContext context) {
    return Drawer(
        child: SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                      children: [
                        SvgPicture.asset(
                          "assets/icons/linto-studio-logo.svg",
                          semanticsLabel: "Linto studio logo",
                          colorFilter: const ColorFilter.mode(Color(0xff1daf92), BlendMode.srcIn),
                          height: 100,
                        ),
                        const SizedBox(height: 3),
                        Image.asset("assets/icons/Linagora-logo.png", scale: 6),
                        const SizedBox(height: 5),
                        const Text(
                          "You are not connected to LinTO Studio",
                          textAlign: TextAlign.center,
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        )
                      ]
                  ),
                ),
                TextButton(
                    onPressed: () {
                      closeDrawer();
                      context.go("/cloud");
                    },
                    child: const Text("Log In")
                )
              ],
            )
        )
    );
  }
}

class ConnectedDrawer extends StatefulWidget {
  const ConnectedDrawer({super.key, required this.closeDrawer});
  final Function() closeDrawer;
  @override
  State<ConnectedDrawer> createState() => ConnectedDrawerState();
}

class ConnectedDrawerState extends State<ConnectedDrawer> {
  final SortingOptions _options = SortingOptions();
  final log = logger(ConnectedDrawerState);
  bool _nameLoaded = false;
  String _name = "";

  List<String> _sortingOptions = [];
  Map<String, String> _sortingLabels = {};
  bool _orgaLoaded = false;

  void onLogout(EventArgs? _) {
    widget.closeDrawer();
  }

  void onOrgaLoaded(EventArgs? _) {
    setState(_setOrganizations);
  }

  void onInfoLoaded(EventArgs? _) {
    setState(_setUserName);
  }

  @override
  void initState() {
    super.initState();
    logOutEvent.subscribe(onLogout);
    orgaLoaded.subscribe(onOrgaLoaded);
    userInfoLoaded.subscribe(onInfoLoaded);
    _setUserName();
    _setOrganizations();
  }

  @override
  void dispose() {
    logOutEvent.unsubscribe(onLogout);
    orgaLoaded.unsubscribe(onOrgaLoaded);
    userInfoLoaded.unsubscribe(onInfoLoaded);
    super.dispose();
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  void _setOrganizations() {
    _orgaLoaded = true;
    _sortingOptions = [];
    _sortingLabels = {};
    UserInfos().organizations.forEach((element) {
      _sortingOptions.add(element.id);
      _sortingLabels[element.id] = element.name;
    });
  }

  void _setUserName() {
    _nameLoaded = true;
    _name = UserInfos().userName;
  }

  @override
  Widget build(BuildContext context) {
    final route = GoRouterState.of(context);
    String location = route.uri.toString();
    return Drawer(
      child: SafeArea(
        child: SingleChildScrollView(child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 15.0, right: 8.0, top: 8.0, bottom: 8.0),
              child: Column(
                  children: [
                    SvgPicture.asset(
                      "assets/icons/linto-studio-logo.svg",
                      semanticsLabel: "Linto studio logo",
                      colorFilter: const ColorFilter.mode(Color(0xff1daf92), BlendMode.srcIn),
                      height: 100,
                    ),
                    const SizedBox(height: 3),
                    Image.asset("assets/icons/Linagora-logo.png", scale: 6),
                    const SizedBox(height: 5),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),),
                      ],
                    )
                  ]
              ),
            ),
            ListTile(
              title: const Text("Favorites"),
              selected: _options.selectedOption == "fav",
              onTap: () {
                _options.selectedOption = "fav";
                _options.selectedLabel = "Favorites";
                widget.closeDrawer();
                if (location != "/cloud") {
                  context.go("/cloud");
                }
              },
            ),
            ListTile(
                title: const Text("Shared with me"),
                selected: _options.selectedOption == "share",
                onTap: () {
                  _options.selectedOption = "share";
                  _options.selectedLabel = "Shared with me";
                  widget.closeDrawer();
                  if (location != "/cloud") {
                    context.go("/cloud");
                  }
                }
            ),
            OrganisationMenu(
                sortingOptions: _sortingOptions,
                sortingLabels: _sortingLabels,
                options: _options,
                widget: widget
            ),
            ListTile(
              title: const Text("Log Out"),
              onTap: () {
                Logout().send();
                widget.closeDrawer();
              },
            )
          ],
        )),
      ),
    );
  }
}

class OrganisationMenu extends StatelessWidget {
  const OrganisationMenu({
    super.key,
    required List<String> sortingOptions,
    required Map<String, String> sortingLabels,
    required SortingOptions options,
    required this.widget,
  }) : _sortingOptions = sortingOptions, _sortingLabels = sortingLabels, _options = options;

  final List<String> _sortingOptions;
  final Map<String, String> _sortingLabels;
  final SortingOptions _options;
  final ConnectedDrawer widget;

  @override
  Widget build(BuildContext context) {
    final route = GoRouterState.of(context);
    String location = route.uri.toString();
    return ExpansionTile(
        initiallyExpanded: true,
        title: const Row(
            children: [
              Text("Organizations"),
              AnimatedRefresh()
            ]
        ),
        children:
        _sortingOptions.map((value) {
          return ListTile(
            title: Text(_sortingLabels[value]!),
            selected: _options.selectedOption == value,
            onTap: () {
              _options.selectedOption = value;
              _options.selectedLabel = _sortingLabels[value]!;
              widget.closeDrawer();
              if (location != "/cloud") {
                context.go("/cloud");
              }
            },
          );
        }).toList()

    );
  }
}

class AnimatedRefresh extends StatefulWidget {
  const AnimatedRefresh({super.key});

  @override
  State<AnimatedRefresh> createState() => AnimatedRefreshState();

}

class AnimatedRefreshState extends State<AnimatedRefresh> with TickerProviderStateMixin {

  late final AnimationController _controller = AnimationController(
    duration: const Duration(seconds: 2),
    vsync: this,
  );

// Create an animation with value of type "double"
  late final Animation<double> _animation = CurvedAnimation(
    parent: _controller,
    curve: Curves.linear,
  );

  @override
  Widget build(BuildContext context) {
    return RotationTransition(
      turns: _animation,
      child: IconButton(
        icon: const Icon(Icons.refresh),
        onPressed: () async {
          _controller.repeat();
          await UserInfos().getOrganizations();
          _controller.stop();
          _controller.reset();
        },
      ),
    );
  }

}