import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:linto_app/logger.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:linto_app/logic/api/auth.dart';
import 'package:linto_app/logic/utils.dart';
import 'package:url_launcher/url_launcher.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.onLogIn});

  final void Function() onLogIn;

  @override
  State<LoginPage> createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  String _email = "";
  String _password = "";
  bool _waitingResponse = false;

  final log = logger(LoginPageState);

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
              SvgPicture.asset(
                "assets/icons/linto-studio-logo.svg",
                semanticsLabel: "Linto studio logo",
                colorFilter: const ColorFilter.mode(Color(0xff1daf92), BlendMode.srcIn),
                height: 100,
              ),
              const SizedBox(height: 5),
              Image.asset("assets/icons/Linagora-logo.png", scale: 6),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!validEmail(value)) {
                    return 'Invalid email';
                  }
                  // You can add additional email validation logic here
                  return null;
                },
                onSaved: (value) {
                  if (value != null) {
                    _email = value;
                  }
                },
              ),
              const SizedBox(height: 20.0),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  // You can add additional password validation logic here
                  return null;
                },
                onSaved: (value) {
                  if (value != null) {
                    _password = value;
                  }
                },
              ),
              const SizedBox(height: 20.0),
              _waitingResponse ? const CircularProgressIndicator() : SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      _formKey.currentState!.save();
                      final manager = Login(_email, _password);
                      manager.send().then((value) {
                        if (manager.error) {
                          showError(context, manager.responseMessage);
                        } else {
                          widget.onLogIn();
                        }
                        setState(() => _waitingResponse = false);
                      });

                      setState(() => _waitingResponse = true);
                    }
                  },
                  child: const Text('Log In'),
                ),
              ),
              const SizedBox(height: 20.0),
              const Text("You don't have an account?"),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextButton(
                      onPressed: () => context.go("/cloud/signup"),
                      child: const Text("Sign Up")
                  ),
                  const Text("or"),
                  TextButton(
                      onPressed: () async {
                        final Uri url = Uri.parse('https://linto.ai');
                        if (!await launchUrl(url) && context.mounted) {
                        showError(context, 'Could not launch $url');
                        }
                      },
                      child: const Text("Discover LinTO Studio features")
                  )
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
