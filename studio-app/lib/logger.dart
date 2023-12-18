// ignore_for_file: prefer_function_declarations_over_variables

import 'package:logger/logger.dart';

final logger = (Type type) => Logger(
      printer: CustomLogger(type.toString()),
      level: Level.debug,
    );

class CustomLogger extends LogPrinter {
  final String className;

  CustomLogger(this.className);

  @override
  List<String> log(LogEvent event) {
    final color = PrettyPrinter.defaultLevelColors[event.level];
    final emoji = PrettyPrinter.defaultLevelEmojis[event.level];
    final message = event.message;
    final error = event.error;
    final stackTrace = event.stackTrace;

    return [
      color!('$emoji $className: $message'),
      if (error != null) color('$error'),
      if (stackTrace != null) color('$stackTrace'),
    ];
  }
}
