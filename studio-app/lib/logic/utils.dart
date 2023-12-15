import 'dart:async';

import 'package:just_audio/just_audio.dart';
import 'package:flutter/material.dart';

import 'const.dart';


bool validEmail(String email) {
  RegExp exp = RegExp(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
  return exp.hasMatch(email);
}

Future<String?> getAudioLength(String path, AudioPlayer player) async {
  Duration? d = await player.setFilePath(path);
  return formatDuration(d!);
}

String formatDuration(Duration duration) {
  String twoDigits(int n) => n.toString().padLeft(2, "0");
  String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
  String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
  return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
}

String formatDate(DateTime date, {bool displayYear = false, displayTime = false}) {
  var day = date.day.toString().padLeft(2, "0");
  var month = date.month;
  var year = date.year;
  var currentYear = DateTime.now().year;
  var currentTime = Duration(hours: date.hour, minutes: date.minute, seconds: date.second);
  return "${months[month]} ${day}th${displayYear || currentYear != year ? ' $year' : ''}${displayTime ? ', ${formatDuration(currentTime)}' : ''}";
}

void showError(BuildContext context, String message) {
  final scaffold = ScaffoldMessenger.of(context);
  scaffold.showSnackBar(
    SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.transparent,
        elevation: 0,
        content: Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(
            color: Colors.red
          ),
          child: Text(message),
        )
    )
  );
}

const Duration toastDuration = Duration(seconds: 4);

void showToast(BuildContext context, String message, {Duration duration = toastDuration}) {
  final scaffold = ScaffoldMessenger.of(context);
  scaffold.showSnackBar(
    SnackBar(
      content: Text(message),
      duration: duration,
    ),
  );
}

class Tuple<T,U> {
  T first;
  U second;

  Tuple(this.first, this.second);
}

class Debounce {
  Timer? _timer;

  void _debounce(String value, void Function(String) callback) {
    if(_timer?.isActive ?? false) _timer?.cancel();
    _timer = Timer(const Duration(milliseconds: 300), () => callback(value));
  }

  void Function(String)? onSearchQueryChanged(void Function(String) onChanged, void Function(String) callback) {
    return (String value) {
      onChanged(value);
      _debounce(value, callback);
    };
  }

  void clear() {
    _timer?.cancel();
  }
}
