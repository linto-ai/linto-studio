import 'package:build_context_provider/build_context_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:linto_app/gui/components/custom_appbar.dart';
import 'package:linto_app/gui/settings.dart';
import 'package:linto_app/gui/share.dart';
import 'package:linto_app/gui/upload.dart';
import 'package:linto_app/logic/config.dart';
import 'package:linto_app/logic/const.dart';
import 'package:linto_app/logic/events.dart';
import 'package:linto_app/logic/file_manager.dart';
import 'data/conversation.dart';
import 'gui/recorder.dart';
import 'gui/local_files.dart';
import 'gui/cloud.dart';
import 'gui/signup.dart';
import 'gui/components/burger.dart';

import 'package:go_router/go_router.dart';

void main() {
  runApp(const MyApp());
  Config();
}

String previousPage = "/record";

Widget transition(Animation<double> animation, double direction, Widget child) {
  final begin = Offset(direction, 0.0);
  const end = Offset.zero;
  const curve = Curves.ease;

  var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
  return SlideTransition(
    position: animation.drive(tween),
    child: child,
  );
}

final router = GoRouter(
  initialLocation: '/record',
  routes: [
    ShellRoute(
        builder: (context, state, child) {
          return BottomNavBar(child: child);
        },
        routes: [
          GoRoute(
              path: '/record',
              pageBuilder: (BuildContext context, GoRouterState state) {
                changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "Record", []));
                previousPage = "/record";
                double offset = 0;
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: GestureDetector(
                      onHorizontalDragStart: (_) {
                        offset = 0;
                      },
                      onHorizontalDragUpdate: (details) {
                        offset += details.delta.dx;
                      },
                      onHorizontalDragEnd: (details) {
                        if (offset < -gestureSensitivity){
                          context.go("/local");
                        }
                      },
                      child: Container(
                        color: Colors.white,
                        child: const RecordPage(),
                      ),
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, -1.0, child)
                );
              }),
          GoRoute(
              path: '/local',
              pageBuilder: (BuildContext context, GoRouterState state) {
                changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "My local recordings", []));
                FileData? file = state.extra as FileData?;
                double direction = previousPage.startsWith("/cloud") ? -1.0 : 1.0;
                previousPage = "/local";
                double offset = 0;
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: GestureDetector(
                        onHorizontalDragStart: (_) {
                          offset = 0;
                        },
                        onHorizontalDragUpdate: (details) {
                          offset += details.delta.dx;
                        },
                        onHorizontalDragEnd: (details) {
                          if (offset < -gestureSensitivity){
                            context.go("/cloud");
                          } else if (offset > gestureSensitivity) {
                            context.go("/record");
                          }
                        },
                        child: Container(
                            color: Colors.white,
                            child: LocalFilesPage(file: file)
                        )
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, direction, child)
                );
              }),
          GoRoute(
              path: '/cloud',
              pageBuilder: (BuildContext context, GoRouterState state) {
                final type = Config().isConnected() ? AppBarType.cloud : AppBarType.standard;
                changeAppBarEvent.broadcast(AppBarProps(type, "Log In", [
                  IconButton(
                      onPressed: () {
                        context.go("/cloud/settings");
                      },
                      icon: const Icon(Icons.settings)
                  )
                ]));
                Conversation? conv = state.extra as Conversation?;
                previousPage = "/cloud";
                double offset = 0;
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: GestureDetector(
                        onHorizontalDragStart: (_) {
                          offset = 0;
                        },
                        onHorizontalDragUpdate: (details) {
                          offset += details.delta.dx;
                        },
                        onHorizontalDragEnd: (details) {
                          if (offset > gestureSensitivity){
                            context.go("/local");
                          }
                        },
                        child: Container(
                            color: Colors.white,
                            child: CloudPage(displayedConversation: conv)
                        )
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, 1.0, child)
                );
              }),
          GoRoute(
              path: '/cloud/settings',
              pageBuilder: (BuildContext context, GoRouterState state) {
                changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "Settings", []));
                previousPage = "/cloud/settings";
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: Container(
                        color: Colors.white,
                        child: const SettingsPage()
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, 1.0, child)
                );
              }),
          GoRoute(
              path: '/cloud/signup',
              pageBuilder: (BuildContext context, GoRouterState state) {
                changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "Sign Up", [
                  IconButton(
                      onPressed: () {
                        context.go("/cloud/settings");
                      },
                      icon: const Icon(Icons.settings)
                  )
                ]));
                previousPage = "/cloud/signup";
                double offset = 0;
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: GestureDetector(
                      onHorizontalDragStart: (_) {
                        offset = 0;
                      },
                      onHorizontalDragUpdate: (details) {
                        offset += details.delta.dx;
                      },
                      onHorizontalDragEnd: (details) {
                        if (offset > gestureSensitivity){
                          context.go("/local");
                        }
                      },
                      child: Container(
                          color: Colors.white,
                          child: const SignupPage()
                      ),
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, 1.0, child)
                );
              }),
          GoRoute(
              path: '/cloud/upload',
              pageBuilder: (BuildContext context, GoRouterState state) {
                changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "Upload", []));
                previousPage = "/cloud/upload";
                FileData file = state.extra as FileData;
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: Container(
                        color: Colors.white,
                        child: Uploader(file: file)
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, 1.0, child)
                );
              }),
          GoRoute(
              path: '/cloud/share',
              pageBuilder: (BuildContext context, GoRouterState state) {
                changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "Share", []));
                Conversation conv = state.extra as Conversation;
                previousPage = "/cloud/share";
                return CustomTransitionPage(
                    key: state.pageKey,
                    child: Container(
                        color: Colors.white,
                        child: Share(sharedConv: conv)
                    ),
                    transitionsBuilder: (
                        BuildContext context,
                        Animation<double> animation,
                        Animation<double> secondaryAnimation,
                        Widget child
                        ) => transition(animation, 1.0, child)
                );
              }),
        ])
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
    );
  }
}

class BottomNavBar extends StatefulWidget {
  const BottomNavBar({
    super.key,
    this.child,
  });

  final Widget? child;

  @override
  State<BottomNavBar> createState() => BottomNavBarState();
}

class BottomNavBarState extends State<BottomNavBar> {

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    FileManager();
    super.initState();

  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  closeDrawer() async {
    if (_scaffoldKey.currentState!.isDrawerOpen) {
      _scaffoldKey.currentState?.openEndDrawer();
    }
  }

  @override
  Widget build(BuildContext context) {
    int routeIndex = _calculateSelectedIndex(context);
    return WithForegroundTask(
      child: Stack(
        children: [
          Scaffold(
            key: _scaffoldKey,
            appBar: const CustomAppBar(),
            drawer: routeIndex >= 2 ? UserMenu(closeDrawer: closeDrawer) : null,
            body: widget.child,
            bottomNavigationBar: BottomNavigationBar(
              currentIndex: _calculateSelectedIndex(context),
              onTap: onTap,
              items: const [
                BottomNavigationBarItem(
                    icon: Icon(Icons.mic_outlined), label: 'Record new'),
                BottomNavigationBarItem(
                    icon: Icon(Icons.folder), label: 'My local recordings'),
                BottomNavigationBarItem(
                    icon: Icon(Icons.cloud), label: 'LinTO Studio'),
              ],
            ),
          ),
          const ListenerThatRunsFunctionsWithBuildContext()
        ],
      ),
    );
  }

  int _calculateSelectedIndex(BuildContext context) {
    final GoRouterState route = GoRouterState.of(context);
    final String location = route.uri.toString();
    if (location.startsWith('/record')) {
      return 0;
    }
    if (location.startsWith('/local')) {
      return 1;
    }
    if (location.startsWith('/cloud')) {
      return 2;
    }
    return 3;
  }

  void onTap(int value) {
    switch (value) {
      case 0:
        return context.go('/record');
      case 1:
        return context.go('/local');
      case 2:
        return context.go('/cloud');
      default:
        return context.go('/record');
    }
  }
}
