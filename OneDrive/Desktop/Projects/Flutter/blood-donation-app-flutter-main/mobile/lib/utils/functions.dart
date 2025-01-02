import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:provider/provider.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:blood_donation/provider/global_state.dart';
import 'package:blood_donation/services/auth.dart';

/// capitalize
/// * Capitalizes the first letter of a word
///
String titleCase(String arg) {
  return arg[0].toUpperCase() + arg.substring(1);
}

/// hasInternetConnection
/// * Checks whether the device has an active internet connection
///
Future<bool> hasInternetConnection() async {
  final InternetConnectionChecker connectionChecker = InternetConnectionChecker.createInstance();
  return await connectionChecker.hasConnection;
}


/// authNavigate
/// * Navigates to the correct destination based on the current state of the application
///
Future<void> authNavigate(BuildContext context) async {
  try {
    final userResponse = await AuthService.getMe();

    if (context.mounted) {
      context.read<GlobalState>().setUserResponse(userResponse);
      Navigator.pushNamedAndRemoveUntil(context, '/home', (_) => false);
    }
  } on DioException catch (e) {
    if (e.type == DioExceptionType.sendTimeout) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot Connect To Server')),
        );
      }
    }
  } catch (e) {
    if (context.mounted) {
      Navigator.pushNamedAndRemoveUntil(context, '/auth', (_) => false);
    }
  }
}

/// getCurrentLocation
/// * Fetches the current location of the user
///
Future<(Position, String)?> getCurrentLocation(BuildContext context) async {
  bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
  LocationPermission permission = await Geolocator.checkPermission();

  if (!serviceEnabled) {
    return Future.error('Location services are disabled.');
  }

  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();

    if (permission == LocationPermission.denied) {
      if (!context.mounted) return null;

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Location Permission Required'),
            content: const Text('Please enable location permissions to proceed.'),
            actions: <Widget>[
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('OK'),
              ),
            ],
          );
        },
      );

      return null;
    }
  }

  if (permission == LocationPermission.deniedForever) {
    if (!context.mounted) return null;

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Location Permission Required'),
          content: const Text('Please enable location permissions to proceed.'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );

    return null;
  }

  Position position = await Geolocator.getCurrentPosition();

  List<Placemark> placemarks = await placemarkFromCoordinates(
    position.latitude,
    position.longitude,
  );

  String geoCodeLocation = '';

  if (placemarks.isNotEmpty) {
    geoCodeLocation += placemarks[0].street ?? '';
    geoCodeLocation += placemarks[0].subLocality ?? '';
    geoCodeLocation += placemarks[0].locality ?? '';
    geoCodeLocation += placemarks[0].postalCode ?? '';
    geoCodeLocation += placemarks[0].country ?? '';
  }

  return (position, geoCodeLocation);
}
