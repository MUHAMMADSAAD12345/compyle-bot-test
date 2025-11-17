import 'package:flutter/material.dart';
import '../../core/services/auth_service.dart';
import '../../data/models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  bool get isAuthenticated => _authService.isAuthenticated;
  UserModel? get currentUser => _authService.currentUser;

  AuthProvider() {
    _authService.init();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    _setLoading(true);
    try {
      await _authService.isLoggedIn();
      _clearError();
    } catch (e) {
      _setError('Authentication check failed');
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
    UserRole role = UserRole.player,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role,
      );
      _clearError();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.login(email: email, password: password);
      _clearError();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> loginWithGoogle() async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.loginWithGoogle();
      _clearError();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> logout() async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.logout();
      _clearError();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> updateProfile({
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      await _authService.updateProfile(
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );
      _clearError();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
  }

  void _setError(String error) {
    _errorMessage = error;
  }

  void _clearError() {
    _errorMessage = null;
  }
}