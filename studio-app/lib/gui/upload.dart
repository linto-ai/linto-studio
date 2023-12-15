import 'dart:io';

import 'package:event/event.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/logger.dart';
import 'package:linto_app/logic/api/conversations.dart';
import 'package:linto_app/logic/api/services.dart';
import 'package:linto_app/logic/sorting_options.dart';

import '../logic/events.dart';
import '../logic/file_manager.dart';
import '../logic/user_infos.dart';
import '../logic/utils.dart';

class Uploader extends StatefulWidget {
  const Uploader({super.key, required this.file});
  final FileData file;

  @override
  State<Uploader> createState() => UploaderState();

}

class UploaderState extends State<Uploader> {
  final _formKey = GlobalKey<FormState>();
  final log = logger(UploaderState);

  final List<String> _sortingOptions = [];
  final Map<String, String> _sortingLabels = {};
  bool _orgaLoaded = false;

  bool _servicesLoaded = false;
  List<dynamic> _services = [{
    "name": "none",
    "language" : "fr-FR",
    "desc": {
      "en" : "No services found"
    },
    "sub_services": {
      "diarization": [
        {
          "service_name": "none",
          "info": {
            "en" : "No services found"
          }
        }
      ]
    }
  },
    {
    "name": "none",
    "language" : "en-EN",
    "desc": {
      "en" : "No services found"
    },
    "sub_services": {
      "diarization": [
        {
          "service_name": "none",
          "info": {
            "en" : "No services found"
          }
        }
      ]
    }
  }];

  String _selectedOrga = "none";
  String _title = "";
  int _membersRights = 1;
  int _numberOfSpeakers = 1;
  dynamic _selectedService;
  String _serviceName = "none";
  String _selectedLanguage = "fr-FR";
  bool _diarizationEnabled = false;
  String _selectedDiarizationService = "none";

  bool _waitingServer = false;

  String _description = "";

  void onLogout(EventArgs? _) => context.go("/cloud");

  @override
  void initState() {
    super.initState();
    _selectedService = _services[0];
    logOutEvent.subscribe(onLogout);
    _loadOrganizations();
    _loadServices();
  }

  @override
  void dispose() {
    logOutEvent.unsubscribe(onLogout);
    orgaLoaded.unsubscribe(onOrgaLoaded);
    super.dispose();
  }

  @override
  void setState(VoidCallback fn) {
    if(mounted) {
      super.setState(fn);
    }
  }

  void _loadServices() {
    if (!_servicesLoaded) {
      final manager = GetServices();
      manager.send().then((value) {
        if (manager.error) {
          showError(context, manager.responseMessage);
          return;
        }
        setState(() {
          if (value.isNotEmpty) {
            _services = value;
            _servicesLoaded = true;
            _selectedService = _services[0];
            _serviceName = _services[0]["name"];
            _selectedDiarizationService = _services[0]["sub_services"]["diarization"][0]["service_name"];
          }
        });
      });
    }
  }

  void _setOrganizations() {
    _orgaLoaded = true;
    UserInfos().organizations
        .where((element) => element.role > 1)
        .forEach((element) {
          _sortingOptions.add(element.id);
          _sortingLabels[element.id] = element.name;
        });
    setState(() {
      _selectedOrga = _sortingOptions[0];
    });
  }

  void onOrgaLoaded(EventArgs? _) => _setOrganizations();

  void _loadOrganizations() {
    if (UserInfos().organizations.isEmpty) {
      orgaLoaded.subscribe(onOrgaLoaded);
    } else {
      _setOrganizations();
    }
  }

  void _setOrga(String? value) {
    setState(() {
      _selectedOrga = value!;
    });
  }

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        IconButton(
            onPressed: () {
              context.go("/local", extra: widget.file);
            },
            icon: const Icon(Icons.arrow_back)
        ),
        Expanded(child: SingleChildScrollView(child: Container(
            margin: EdgeInsets.only(left: width * 0.10, right: width * 0.10),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  OrgaDropdown(sortingOptions: _sortingOptions, sortingLabels: _sortingLabels, selectedOrga: _selectedOrga, setOrga: _setOrga),
                  const SizedBox(height: 20.0),
                  TextFormField(
                    decoration: const InputDecoration(labelText: 'Title'),
                    initialValue: widget.file.name,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a title';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      if (value != null) {
                        _title = value;
                      }
                    },
                  ),
                  const SizedBox(height: 20.0),
                  DropdownButtonFormField(
                      decoration: const InputDecoration(labelText: "Language"),
                      value: _selectedLanguage,
                      items: const [
                        DropdownMenuItem(value: "fr-FR",  child: Text("French")),
                        DropdownMenuItem(value: "en-EN",  child: Text("English")),
                      ],
                      onChanged: (value) => setState(() {
                        _selectedLanguage = value!;
                      }),
                      validator: (value) {
                        if (_services.where((element) => element["language"] == value).isEmpty) {
                          return "No services available for this choice";
                        }
                        return null;
                      }
                  ),
                  const SizedBox(height: 20),
                  Theme(data: Theme.of(context).copyWith(dividerColor: Colors.transparent), child: ExpansionTile(
                    title: const Text("Advanced options"),
                    expandedCrossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextFormField(
                        decoration: const InputDecoration(labelText: 'Description'),
                        onSaved: (value) {
                          if (value != null) {
                            _description = value;
                          }
                        },
                      ),
                      DropdownButtonFormField(
                        decoration: const InputDecoration(labelText: "Member's rights"),
                        value: _membersRights,
                        items: const [
                          DropdownMenuItem(value: 0,  child: Text("None")),
                          DropdownMenuItem(value: 1,  child: Text("Read")),
                          DropdownMenuItem(value: 3,  child: Text("Comment")),
                          DropdownMenuItem(value: 7,  child: Text("Write")),
                          DropdownMenuItem(value: 23, child: Text("Share")),
                          DropdownMenuItem(value: 31, child: Text("All rights")),
                        ],
                        onChanged: (value) => setState(() {
                          _membersRights = value!;
                        }),
                      ),
                      const SizedBox(height: 20),
                      DropdownButtonFormField(
                        isExpanded: true,
                        decoration: const InputDecoration(
                          labelText: "Transcription service",
                        ),
                        value: _serviceName,
                        items: _services.where((service) => service["language"] == _selectedLanguage)
                            .map((service) {
                          return DropdownMenuItem(
                            value: service["name"].toString(),
                            child: Text(service["desc"]["en"], overflow: TextOverflow.ellipsis),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _serviceName = value!;
                            _selectedService = _services.where((service) => service["name"] == value).toList()[0];
                          });
                        },
                      ),
                      const SizedBox(height: 20),
                      CheckboxListTile(
                          title: const Text("Enable speaker separation"),
                          controlAffinity: ListTileControlAffinity.leading,
                          contentPadding: EdgeInsets.zero,

                          value: _diarizationEnabled,
                          onChanged: (value) => setState(() {
                            if (value == null) {
                              _diarizationEnabled = false;
                            } else {
                              _diarizationEnabled = value;
                            }
                          })
                      ),
                      _diarizationEnabled ? Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Flexible(flex: 2, child: DropdownButtonFormField(
                            decoration: const InputDecoration(labelText: "Speaker separation Service"),
                            isExpanded: true,
                            value: _selectedDiarizationService,
                            items: (_selectedService["sub_services"]["diarization"].map<DropdownMenuItem<String>>((service) {
                              return DropdownMenuItem(value: service["service_name"].toString(), child: Text(service["info"]["en"], overflow: TextOverflow.ellipsis,));
                            }).toList()),
                            onChanged: (value) {
                              if (value == null) {
                                return;
                              }
                              setState(() {
                                _selectedDiarizationService = value;
                              });
                            },
                            validator: (value) {
                              if (_diarizationEnabled && (value == null || value == "none")) {
                                return "Invalid Service";
                              }
                              return null;
                            },
                          )),
                          const SizedBox(width: 20),
                          Flexible(flex: 1, child: NumberInput(
                            label: "Speaker Number",
                            value: 1,
                            onSaved: (value) {
                              _numberOfSpeakers = value!;
                            },
                            validator: (value) {
                              if (value == null || value <= 0 || value.isNaN || value.isInfinite) {
                                return "Please enter a valid number";
                              }
                              return null;
                            },
                          )),

                        ],
                      ) : Container(),
                      const SizedBox(height: 1),
                    ],
                  )),
                  const SizedBox(height: 20),
                  !_waitingServer && _servicesLoaded ? SizedBox(width: double.infinity, child: ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          _formKey.currentState!.save();
                          final manager = SendConversation(
                              file: widget.file.media,
                              orgaId: _selectedOrga,
                              name: _title,
                              description: _description,
                              lang: _selectedLanguage,
                              membersRights: _membersRights,
                              diarizationEnabled: _diarizationEnabled,
                              diarizationService: _selectedDiarizationService,
                              numberOfSpeakers: _numberOfSpeakers,
                              modelConfig: _selectedService
                          );
                          manager.send().then((value) {
                            setState(() => _waitingServer = false);
                            if (manager.error && context.mounted) {
                              showError(context, manager.responseMessage);
                            } else if (context.mounted) {
                              SortingOptions().selectedOption = _selectedOrga;
                              SortingOptions().selectedLabel = _sortingLabels[_selectedOrga]!;
                              context.go("/cloud");
                            }
                          });
                          setState(() => _waitingServer = true);
                        }
                      },
                      child: const Text("Upload file")
                  )) : const Center(child: CircularProgressIndicator()),
                ],
              ),
            )
        )))
      ],
    );

  }
}

class OrgaDropdown extends StatelessWidget {
  const OrgaDropdown({
    super.key,
    required List<String> sortingOptions,
    required Map<String, String> sortingLabels,
    required String selectedOrga,
    required void Function(String?) setOrga,
  }) : _sortingOptions = sortingOptions, _sortingLabels = sortingLabels, _setOrga = setOrga, _selectedOrga = selectedOrga;

  final List<String> _sortingOptions;
  final Map<String, String> _sortingLabels;
  final String _selectedOrga;
  final void Function(String?) _setOrga;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField(
      isExpanded: true,
      decoration: const InputDecoration(labelText: "Organization"),
      items: _sortingOptions.isEmpty
          ? ([ const DropdownMenuItem(
          value: "none",
          child: Text("No Organizations available", overflow: TextOverflow.ellipsis)
      )])
          : _sortingOptions.map((option) {
        return DropdownMenuItem(
            value: option,
            child: Text(_sortingLabels[option]!, overflow: TextOverflow.ellipsis)
        );
      }).toList(),
      onChanged: _setOrga,
      value: _sortingOptions.isEmpty ? "none" : _selectedOrga,
      validator: (value) {
        if (value == null || value.isEmpty || value == "none") {
          return "Please choose a valid organization";
        }
        return null;
      },
    );
  }
}
class NumberInput extends StatelessWidget {
  const NumberInput({super.key,
    required this.label,
    this.controller,
    this.value,
    this.onChanged,
    this.error,
    this.icon,
    this.allowDecimal = false,
    this.validator,
    this.onSaved,
  });

  final TextEditingController? controller;
  final int? value;
  final String label;
  final Function? onChanged;
  final String? error;
  final Widget? icon;
  final bool allowDecimal;
  final String? Function(int?)? validator;
  final void Function(int?)? onSaved;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      initialValue: value.toString(),
      onChanged: onChanged as void Function(String)?,
      readOnly: false,
      keyboardType: TextInputType.numberWithOptions(decimal: allowDecimal),
      inputFormatters: <TextInputFormatter>[
        FilteringTextInputFormatter.allow(RegExp(r'[0-9]')),
      ],
      decoration: InputDecoration(
        labelText: label,
        errorText: error,
        icon: icon,
      ),
      validator: (value) {
        if (value == null) {
          return validator!(null);
        }
        return validator!(int.parse(value));
      },
      onSaved: (value) {
        if (value == null) {
          return onSaved!(null);
        }
        return onSaved!(int.parse(value));
      },
    );
  }
}

