import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/logger.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:linto_app/logic/api/connection_manager.dart';
import 'package:linto_app/logic/api/users.dart';
import 'package:linto_app/logic/utils.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => SignupPageState();
}

class SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  String _email = "";
  String _password = "";
  String _firstName = "";
  String _lastName = "";
  bool _waitingResponse = false;

  final TextEditingController _pass = TextEditingController();
  final TextEditingController _confirmPass = TextEditingController();

  final log = logger(SignupPageState);

  @override
  void initState() {
    super.initState();
  }

  @override
  void setState(fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  Widget _loginView(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    return Center(child: SingleChildScrollView(
      child: Container(
        margin: EdgeInsets.only(left: width * 0.10, right: width * 0.10),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // logo
              SvgPicture.asset(
                "assets/icons/linto-studio-logo.svg",
                semanticsLabel: "Linto studio logo",
                colorFilter: const ColorFilter.mode(Color(0xff1daf92), BlendMode.srcIn),
                height: 100,
              ),
              const SizedBox(height: 5),
              Image.asset("assets/icons/Linagora-logo.png", scale: 6),
              // user name
              Row(
                children: [
                  Expanded(child: TextFormField(
                    decoration: const InputDecoration(labelText: 'First name'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter first name';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      if (value != null) {
                        _firstName = value;
                      }
                    },
                  )),
                  const SizedBox(width: 20),
                  Expanded(child: TextFormField(
                    decoration: const InputDecoration(labelText: 'Last name'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter last name';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      if (value != null) {
                        _lastName = value;
                      }
                    },
                  )),
                ],
              ),
              const SizedBox(height: 20.0),
              // email
              TextFormField(
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!validEmail(value)) {
                    return 'Invalid email';
                  }
                  return null;
                },
                onSaved: (value) {
                  if (value != null) {
                    _email = value;
                  }
                },
              ),
              const SizedBox(height: 20.0),
              // password
              TextFormField(
                decoration: const InputDecoration(labelText: 'Password'),
                controller: _pass,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  if (value.length < 6) {
                    return 'Your password must be at least 6 characters long';
                  }
                  return null;
                },
                onSaved: (value) {
                  if (value != null) {
                    _password = value;
                  }
                },
              ),
              const SizedBox(height: 20.0),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Confirm Password'),
                controller: _confirmPass,
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  if (value != _pass.text) {
                    return 'Passwords must be the same';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20.0),
              _waitingResponse ? const CircularProgressIndicator() : SizedBox(
                  width : double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        // Form is valid, perform login or other actions
                        _formKey.currentState!.save();
                        final manager = CreateUser(_firstName, _lastName, _email, _password);
                        manager.send().then((value) {
                          if (manager.error) {
                            showError(context, manager.responseMessage);
                          } else {
                            context.go("/cloud");
                          }
                          setState(() => _waitingResponse = false);
                        });

                        setState(() => _waitingResponse = true);
                      }
                    },
                    child: const Text('Sign Up'),
                  )
              ),
              const SizedBox(height: 20.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                 const Text("You already have an account?"),
                 TextButton(onPressed: () => context.go("/cloud"), child: const Text("Log in"))
               ],
              )
            ],
          ),
        ),
      )
    ));
  }

  @override
  Widget build(BuildContext context) {
    return _loginView(context);
  }
}
