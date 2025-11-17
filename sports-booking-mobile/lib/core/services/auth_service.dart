import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dio/dio.dart';
import 'api_service.dart';
import '../utils/logger.dart';
import '../../data/models/user_model.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final ApiService _apiService = ApiService();
  final _storage = const FlutterSecureStorage();
  final Logger _logger = Logger();

  UserModel? _currentUser;
  bool get isAuthenticated => _currentUser != null;
  UserModel? get currentUser => _currentUser;

  void init() {
    _apiService.init();
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'access_token');
    if (token == null) return false;

    try {
      // Try to get user profile to validate token
      final response = await _apiService.getProfile();
      if (response.statusCode == 200) {
        _currentUser = UserModel.fromJson(response.data['user']);
        return true;
      }
    } catch (e) {
      _logger.e('Token validation failed', error: e);
      await clearTokens();
    }
    return false;
  }

  Future<UserModel> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
    UserRole role = UserRole.player,
  }) async {
    try {
      final userData = {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        if (phone != null) 'phone': phone,
        'role': role.name,
      };

      final response = await _apiService.register(userData);

      if (response.statusCode == 201) {
        final data = response.data;
        await _saveTokens(data['accessToken'], data['refreshToken']);
        _currentUser = UserModel.fromJson(data['user']);
        return _currentUser!;
      } else {
        throw Exception('Registration failed');
      }
    } on DioException catch (e) {
      _logger.e('Registration error', error: e);
      final message = e.response?.data['message'] ?? 'Registration failed';
      throw Exception(message);
    } catch (e) {
      _logger.e('Registration error', error: e);
      throw Exception('An unexpected error occurred');
    }
  }

  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.login(email, password);

      if (response.statusCode == 200) {
        final data = response.data;
        await _saveTokens(data['accessToken'], data['refreshToken']);
        _currentUser = UserModel.fromJson(data['user']);
        return _currentUser!;
      } else {
        throw Exception('Login failed');
      }
    } on DioException catch (e) {
      _logger.e('Login error', error: e);
      final message = e.response?.data['message'] ?? 'Invalid credentials';
      throw Exception(message);
    } catch (e) {
      _logger.e('Login error', error: e);
      throw Exception('An unexpected error occurred');
    }
  }

  Future<UserModel> loginWithGoogle() async {
    // TODO: Implement Google Sign-In
    throw UnimplementedError('Google Sign-In not implemented yet');
  }

  Future<void> logout() async {
    try {
      await clearTokens();
      _currentUser = null;
    } catch (e) {
      _logger.e('Logout error', error: e);
    }
  }

  Future<UserModel> updateProfile({
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    try {
      final updateData = <String, dynamic>{};
      if (firstName != null) updateData['firstName'] = firstName;
      if (lastName != null) updateData['lastName'] = lastName;
      if (phone != null) updateData['phone'] = phone;

      final response = await _apiService.updateProfile(updateData);

      if (response.statusCode == 200) {
        _currentUser = UserModel.fromJson(response.data);
        return _currentUser!;
      } else {
        throw Exception('Profile update failed');
      }
    } on DioException catch (e) {
      _logger.e('Profile update error', error: e);
      final message = e.response?.data['message'] ?? 'Profile update failed';
      throw Exception(message);
    } catch (e) {
      _logger.e('Profile update error', error: e);
      throw Exception('An unexpected error occurred');
    }
  }

  Future<void> _saveTokens(String accessToken, String refreshToken) async {
    await _storage.write(key: 'access_token', value: accessToken);
    await _storage.write(key: 'refresh_token', value: refreshToken);
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'refresh_token');
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: 'access_token');
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: 'refresh_token');
  }
}