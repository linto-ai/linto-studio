import 'package:flutter/material.dart';

class EmptyPage extends StatelessWidget {
  const EmptyPage({super.key, required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Icon(Icons.search_off, size: 50,),
        Text(message, textAlign: TextAlign.center, style: const TextStyle(fontSize: 20),)
      ],
    ));
  }

}