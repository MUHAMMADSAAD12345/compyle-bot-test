import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'core/themes/app_theme.dart';
import 'core/services/api_service.dart';
import 'core/services/auth_service.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/providers/venue_provider.dart';
import 'presentation/providers/booking_provider.dart';
import 'presentation/pages/home/home_page.dart';
import 'presentation/pages/auth/login_page.dart';
import 'data/models/user_model.dart';
import 'data/models/venue_model.dart';
import 'data/models/booking_model.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

  // Register Hive adapters
  Hive.registerAdapter(UserModelAdapter());
  Hive.registerAdapter(VenueModelAdapter());
  Hive.registerAdapter(BookingModelAdapter());

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const SportsBookingApp());
}

class SportsBookingApp extends StatelessWidget {
  const SportsBookingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => VenueProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
      ],
      child: MaterialApp(
        title: 'SportsHub',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        home: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            return authProvider.isAuthenticated ? const HomePage() : const LoginPage();
          },
        ),
      ),
    );
  }
}