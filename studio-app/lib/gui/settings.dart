import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/logic/api/healthcheck.dart';
import 'package:linto_app/logic/config.dart';
import 'package:linto_app/logic/utils.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => SettingsPageState();

}

class SettingsPageState extends State<SettingsPage> {
  final _config = Config();
  late String _server;
  TextEditingController controller = TextEditingController();
  bool _waitingResponse = false;

  @override
  void initState() {
    super.initState();
    if (_config.servers.where((e) => e.domain == _config.server).isNotEmpty) {
      _server = _config.server!;
    } else {
      _server = "custom";
      controller.text = _config.server ?? "";
    }
  }
  
  @override
  void setState(VoidCallback fn) {
    if(mounted) {
      super.setState(fn);
    }
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> items = _config.servers.map((e) {
      return RadioListTile(
          title: Text(e.label),
          value: e.domain,
          groupValue: _server,
          onChanged: (value) {
            setState(() {
              _server = e.domain;
            });
          }
      );
    }).toList();
    items.add(
      RadioListTile(
          title: Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: TextField(
              onTap: () {
                setState(() {
                  _server = "custom";
                });
              },
              decoration: const InputDecoration(labelText: "Custom server"),
              controller: controller,
            ),
          ),
          value: "custom",
          groupValue: _server,
          onChanged: (value) {
            setState(() {
              _server = "custom";
            });
          }
      )
    );
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            IconButton(
                onPressed: (){
                  context.go("/cloud");
                },
                icon: const Icon(Icons.arrow_back)
            ),
            const SizedBox(width: 10),
            const Text("Select your server", style: TextStyle(fontSize: 20),),
          ],
        ),
        const SizedBox(height: 10),
        Flexible(child: ListView(
          shrinkWrap: true,
          children: items,
        )),
        const SizedBox(height: 10),
        _waitingResponse ? const Center(child: CircularProgressIndicator()) : SizedBox(
          width: double.infinity,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: ElevatedButton(
              onPressed: () {
                setState(() => _waitingResponse = true);
                String server = _server == "custom" ? controller.text : _server;
                final manager = Healthcheck(server);
                manager.send().then((value) {
                  if (manager.error) {
                    showError(context, "Not a valid server");
                  } else {
                    _config.server = server;
                    context.go("/cloud");
                  }
                  setState(() => _waitingResponse = false);
                });
              },
              child: const Text('Set server'),
            ),
          ),
        ),
      ],
    );
  }

}