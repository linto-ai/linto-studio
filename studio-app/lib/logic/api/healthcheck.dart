import 'package:linto_app/logic/api/connection_manager.dart';

class Healthcheck extends ConnectionManager {
  final String customServer;
  Healthcheck(this.customServer);

  Future<void> send() async {
    var url = Uri.https(customServer, "${baseUrl}healthcheck");
    await request("GET", url, "Health check", onSucceed: (response) {
      if (response.statusCode != 200) {
        error = true;
      }
    });
  }
}