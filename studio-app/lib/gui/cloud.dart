import 'package:event/event.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/gui/components/conversation_card.dart';
import 'package:linto_app/gui/components/conversation_item.dart';
import 'package:linto_app/gui/components/custom_appbar.dart';
import 'package:linto_app/gui/components/empty_page.dart';
import 'package:linto_app/gui/login.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/api/connection_manager.dart';
import 'package:linto_app/logic/api/conversations.dart';
import 'package:linto_app/logic/api/tags.dart';
import 'package:linto_app/logic/config.dart';
import 'package:linto_app/logic/events.dart';
import 'package:linto_app/logic/search_params.dart';
import 'package:linto_app/logic/sorting_options.dart';
import 'package:linto_app/logic/user_infos.dart';
import 'package:linto_app/logic/utils.dart';

import '../data/conversation.dart';
import '../logic/api/users.dart';

class CloudPage extends StatefulWidget {
  const CloudPage({super.key, this.displayedConversation});

  final Conversation? displayedConversation;

  @override
  State<CloudPage> createState() => CloudPageState();
}

class CloudPageState extends State<CloudPage> {
  final log = logger(CloudPageState);

  void onLogout(EventArgs? _) {
    changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, "Log In", [
      IconButton(
          onPressed: () {
            context.go("/cloud/settings");
          },
          icon: const Icon(Icons.settings)
      )
    ]));
    setState(() { });
  }

  void onLogin(EventArgs? _) {
    changeAppBarEvent.broadcast(AppBarProps(AppBarType.cloud, "", []));
    setState(() { });
  }

  @override
  void initState() {
    super.initState();

    logOutEvent.subscribe(onLogout);
    logInEvent.subscribe(onLogin);
  }

  @override
  void dispose() {
    logOutEvent.unsubscribe(onLogout);
    logInEvent.unsubscribe(onLogin);
    super.dispose();
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (Config().isConnected()) {
      return ConnectedPage(displayedConversation: widget.displayedConversation,);
    }
    return LoginPage(onLogIn: () => setState(() {}));
  }
}

class ConnectedPage extends StatefulWidget {
  const ConnectedPage({super.key, this.displayedConversation});

  final Conversation? displayedConversation;

  @override
  State<ConnectedPage> createState() => ConnectedPageState();
}

class ConnectedPageState extends State<ConnectedPage> {
  final log = logger(CloudPageState);
  Conversation? _selectedConv;

  void onSelectedOptionChanged(EventArgs? _) {
    if (_selectedConv != null) {
      changeAppBarEvent.broadcast(AppBarProps(AppBarType.cloud, "", []));
      setState(() => _selectedConv = null);
    }
  }

  void onUserInfoLoaded(EventArgs? _) {
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    if (widget.displayedConversation != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        setState(() => selectConv(widget.displayedConversation!));
      });
    }

    selectedOptionChanged.subscribe(onSelectedOptionChanged);

    userInfoLoaded.subscribe(onUserInfoLoaded);
  }

  @override
  void dispose() {
    selectedOptionChanged.unsubscribe(onSelectedOptionChanged);
    userInfoLoaded.unsubscribe(onUserInfoLoaded);
    super.dispose();
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  bool _canShare() {
    return _selectedConv!.rights != null && _selectedConv!.rights! >= 23;
  }

  void _onSaveSelectedConvEdition(String title, String description) {
    title = title.replaceAll(RegExp(r'\s{2,}'), ' ').trim();
    if (title.isEmpty) {
      showError(context, "Cannot enter an empty title");
      return;
    }
    description = description.replaceAll(RegExp(r'\s{2,}'), ' ').trim();
    final manager = UpdateConversation(_selectedConv!.id, title, description);
    manager.send().then((_) {
      if (manager.error) {
        showError(context, manager.responseMessage);
      } else {
        setState(() {
          _selectedConv!.name = title;
          _selectedConv!.description = description;
        });
      }
    });
    changeAppBarEvent.broadcast(AppBarProps(null, title, null));
  }

  void selectConv(Conversation conv) {
    changeAppBarEvent.broadcast(AppBarProps(AppBarType.standard, conv.name, [
      EditButton(
        isLocal: false,
        defaultTitle: conv.name,
        defaultDescription: conv.description,
        onSave: _onSaveSelectedConvEdition
      ),
      ShareButton(
          isLocal: false,
          name: conv.name,
          audioPath: conv.id,
          transcriptionPath: conv.id
      ),
      const SizedBox(width: 10)
    ]));
    if (conv.rights == null) {
      final manager = GetUserRight(conv.id);
      manager.send().then((value) {
        if (manager.error) {
          showError(context, manager.responseMessage);
        } else {
          setState(() => _selectedConv?.rights = value);
        }
      });
    }
    setState(() { _selectedConv = conv; });
  }

  @override
  Widget build(BuildContext context) {
    return _selectedConv == null
        ? ConversationCloudList(onSelectConversation: selectConv)
        : ConversationCard(
          conversation: _selectedConv!,
          onBackPressed: () {
            changeAppBarEvent.broadcast(AppBarProps(AppBarType.cloud, "", []));
            setState(() { _selectedConv = null; });
          },
          customButtonMessage: _canShare() ? "Share within LinTO Studio" : null,
          onCustomButtonPressed: _canShare() ? () {
            context.go("/cloud/share", extra: _selectedConv);
          } : null,
        );
  }
}

class ConversationCloudList extends StatefulWidget {
  const ConversationCloudList({super.key, required this.onSelectConversation});

  final void Function(Conversation) onSelectConversation;

  @override
  State<ConversationCloudList> createState() => ConversationCloudListState();
}

class ConversationCloudListState extends State<ConversationCloudList> {
  final _safeConnection = SafeConnection();
  final log = logger(ConversationCloudListState);
  final _searchParams = SearchParams();
  final _options = SortingOptions();
  bool _loadingConvs = false;
  List<Conversation> _convs = [];

  void onSelectedOptionChanged(EventArgs? _) {
    _searchParams.clear();
    _loadConversations(_options.selectedOption);
    _loadTags(_options.selectedOption);
  }

  void onSearchQueryChange(EventArgs? _) {
    _loadConversations(_options.selectedOption);
  }

  @override
  void initState() {
    super.initState();

    _searchParams.clear();
    _loadConversations(_options.selectedOption);
    _loadTags(_options.selectedOption);

    selectedOptionChanged.subscribe(onSelectedOptionChanged);
    searchQueryChange.subscribe(onSearchQueryChange);
  }

  @override
  void dispose() {
    selectedOptionChanged.unsubscribe(onSelectedOptionChanged);
    searchQueryChange.unsubscribe(onSearchQueryChange);
    super.dispose();
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  Future<void> _loadTags(String type) async {
    log.d("loading tags");
    List<String> tags = _searchParams.selectedTags.keys.toList();
    final manager = GetTags(type, tags);
    manager.send().then((value) {
      if (manager.error && context.mounted) {
        showError(context, manager.responseMessage);
      } else {
        _searchParams.categories = value;
      }
    });
  }

  Future<void> _loadConversations(String type) async {
    setState(() => _loadingConvs = true);
    List<String> tags = _searchParams.selectedTags.keys.toList();
    final manager = GetConversations(type, _searchParams.searchQuery, tags);
    _safeConnection.safeCall(manager.send(), (value) {
      if (manager.error && context.mounted) {
        showError(context, manager.responseMessage);
      } else {
        setState(() {
          _convs = value;
        });
      }
      setState(() => _loadingConvs = false);
    });
  }

  void _onSaveEdition(Conversation conv, String title, String description) {
    title = title.replaceAll(RegExp(r'\s{2,}'), ' ').trim();
    if (title.isEmpty) {
      showError(context, "Cannot enter an empty title");
      return;
    }
    description = description.replaceAll(RegExp(r'\s{2,}'), ' ').trim();
    final manager = UpdateConversation(conv.id, title, description);
    manager.send().then((_) {
      if (manager.error) {
        showError(context, manager.responseMessage);
      } else {
        setState(() {
          conv.name = title;
          conv.description = description;
        });
      }
    });
  }

  IconButton buildFavoriteButton(Conversation conv, bool isFavorite, BuildContext context) {
    return IconButton(
        constraints: const BoxConstraints(minWidth: 22, maxWidth: 22),
        padding: EdgeInsets.zero,//const EdgeInsets.symmetric(vertical: 12),
        splashRadius: 0.0001,
        onPressed: () {
          final manager = ToggleFavorite(conv.id, !isFavorite);
          manager.send().then((value) {
            if (manager.error) {
              showError(context, manager.responseMessage);
            } else if (isFavorite) {
              UserInfos().favorites.remove(conv.id);
              setState(() {});
            } else {
              UserInfos().favorites.add(conv.id);
              setState(() {});
            }
          });
        },
        icon: isFavorite
            ? const Icon(Icons.star, color: Colors.black,)
            : const Icon(Icons.star_border_outlined, color: Colors.black,)
    );
  }

  @override
  Widget build(BuildContext context) {
    String searchQuery = _searchParams.searchQuery;
    int tags = _searchParams.selectedTags.length;
    return Container(
        child: !_loadingConvs ? (
            Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                searchQuery.isNotEmpty || tags != 0
                    ? Row(
                  children: [
                    Padding(padding: const EdgeInsets.only(left: 10), child: Text(
                      "Results${searchQuery != "" ? ' for "$searchQuery"' : ""}${tags != 0 ? " with $tags tag(s)" : ""}",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    )),
                    IconButton(
                        onPressed: () {
                          setState(() => _searchParams.clear());
                          _loadConversations(_options.selectedOption);
                        },
                        icon: const Icon(Icons.delete_outline_outlined)
                    )
                  ],
                )
                    : Container(),
                _convs.isNotEmpty ? Expanded(child: RefreshIndicator(
                    onRefresh: () {
                      _loadTags(_options.selectedOption);
                      return _loadConversations(_options.selectedOption);
                    },
                    child: ListView.builder(
                        itemCount: _convs.length,
                        itemBuilder: (context, index) {
                          final conv = _convs.elementAt(index);
                          bool isFavorite = UserInfos().favorites.contains(conv.id);
                          return ConversationItem(
                            leading: buildFavoriteButton(conv, isFavorite, context),
                            isLocal: false,
                            title: conv.name,
                            description: conv.description,
                            duration: formatDuration(Duration(seconds: conv.length.toInt())),
                            uploadDate: conv.uploadDate,
                            shareAudioPath: conv.id,
                            shareTranscriptionPath: conv.id,
                            onTap: () {
                              widget.onSelectConversation(conv);
                            },
                            onEdit: (title, description) => _onSaveEdition(conv, title, description),
                          );
                        }
                    )
                )) : Expanded(
                  child: EmptyPage(
                      message: 'No Media in ${_options.selectedLabel}'
                  ),
                )
              ],
            )
        ) : const Center(child: CircularProgressIndicator())
    );
  }

}