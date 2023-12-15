
import 'package:event/event.dart';
import 'package:flutter/material.dart';

import '../../logger.dart';
import '../../logic/api/tags.dart';
import '../../logic/events.dart';
import '../../logic/search_params.dart';
import '../../logic/sorting_options.dart';
import '../../logic/utils.dart';
import 'empty_page.dart';

enum AppBarType {
  standard,
  cloud,
}

class CustomAppBar extends StatefulWidget implements PreferredSizeWidget{
  const CustomAppBar({super.key});

  @override
  State<CustomAppBar> createState() => CustomAppBarState();

  @override
  final Size preferredSize = const Size.fromHeight(50.0);

}

class CustomAppBarState extends State<CustomAppBar> {
  final _options = SortingOptions();
  final searchParams = SearchParams();
  final _debounce = Debounce();
  final log = logger(CustomAppBarState);
  String _title = "Record";
  AppBarType _type = AppBarType.standard;

  final _searchBarController = TextEditingController();
  bool _searching = false;
  List<Widget> _actions = [];
  
  void onStateChanged(EventArgs? _) => setState(() {});
  void onChangeAppBar(AppBarProps? args) {
    setState(() {
      _title = args!.pageName;
      if (args.actions != null) {
        _actions = args.actions!;
      }
      if (args.type != null) {
        _type = args.type!;
      }
    });
  }

  @override
  void initState() {
    super.initState();
    logOutEvent.subscribe(onStateChanged);
    logInEvent.subscribe(onStateChanged);
    changeAppBarEvent.subscribe(onChangeAppBar);
    selectedOptionChanged.subscribe(onStateChanged);
  }
  
  @override
  void dispose() {
    logOutEvent.unsubscribe(onStateChanged);
    logInEvent.unsubscribe(onStateChanged);
    changeAppBarEvent.unsubscribe(onChangeAppBar);
    selectedOptionChanged.unsubscribe(onStateChanged);
    super.dispose();
  }

  @override
  void setState(VoidCallback fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  Widget buildAppBar(BuildContext context) {
    _searching = false;
    return AppBar(
      title: Text(_title),
      actions: _actions,
    );
  }

  Widget buildCloudBar(BuildContext context) {
    if (_searching) {
      return buildSearchBar(context);
    }
    return AppBar(
      title: Text(_options.selectedLabel),
      actions: [
        IconButton(
            onPressed: () {
              showModalBottomSheet(
                  context: context,
                  // isScrollControlled: true,
                  builder: (context) {
                    if (searchParams.categories.isEmpty) {
                      return const EmptyPage(message: "No tags found");
                    }
                    return const TagMenu();
                  }
              );
            },
            icon: const Icon(Icons.label_outline)
        ),
        IconButton(
            onPressed: () => setState(() => _searching = true),
            icon: const Icon(Icons.search)
        )
      ],
    );
  }

  Widget buildSearchBar(BuildContext context) {
    _searchBarController.value = TextEditingValue(text: searchParams.searchQuery);
    return AppBar(
      leading: IconButton(
          onPressed: () => setState(() => _searching = false),
          icon: const Icon(Icons.close)
      ),
      title: TextField(
          autofocus: true,
          controller: _searchBarController,
          style: const TextStyle(color: Colors.white),
          cursorColor: Colors.white,
          decoration: const InputDecoration(
              label: Text(
                "Search",
                style: TextStyle(
                    color: Colors.white
                ),
              )
          ),
          onChanged: _debounce.onSearchQueryChanged((value) {
            _searchBarController.value = TextEditingValue(text: value);
          }, (value) {
            searchParams.searchQuery = value;
          })
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (_type) {
      case AppBarType.standard:
        return buildAppBar(context);
      case AppBarType.cloud:
        return buildCloudBar(context);
    }
  }
}

class TagMenu extends StatefulWidget {
  const TagMenu({super.key});

  @override
  State<TagMenu> createState() => TagMenuState();

}

class TagMenuState extends State<TagMenu>{
  final _options = SortingOptions();
  final _debounce = Debounce();
  final searchParams = SearchParams();
  final log = logger(CustomAppBarState);
  String _searchQuery = "";

  @override
  void setState(VoidCallback fn) {
    if(mounted) {
      super.setState(fn);
    }
  }

  void _loadTags(String type) {
    List<String> tags = searchParams.selectedTags.keys.toList();
    final manager = GetTags(type, tags);
    manager.send().then((value) {
      if (manager.error && context.mounted) {
        showError(context, manager.responseMessage);
      } else {
        setState(() => searchParams.categories = value);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    var categories = searchParams.searchTag(_searchQuery);
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: TextField(
            decoration: const InputDecoration(
              suffixIcon: Icon(Icons.search),
              labelText: "Search tag"
            ),
            onChanged: _debounce.onSearchQueryChanged((value) {}, (value) {
              setState(() => _searchQuery = value);
            }),
          ),
        ),
        Expanded(child:
          categories.isNotEmpty ? SingleChildScrollView(child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: categories.map((category) {
              return ExpansionTile(
                key: Key(category.id),
                title: Text(category.name, style: TextStyle(color: category.color)),
                children: category.tags.map((tag) {
                  return SwitchListTile(
                      activeColor: category.color,
                      value: searchParams.selectedTags.containsKey(tag.id),
                      title: Text(tag.name),
                      onChanged: (value) {
                        if (!value) {
                          searchParams.selectedTags.remove(tag.id);
                        } else {
                          searchParams.selectedTags[tag.id] = tag;
                        }
                        _loadTags(_options.selectedOption);
                        searchQueryChange.broadcast();
                        setState(() {});
                      }
                  );
                }).toList(),
              );
            }).toList(),
          )) : const EmptyPage(message: "No tags found")
        )
      ],
    );
  }
}