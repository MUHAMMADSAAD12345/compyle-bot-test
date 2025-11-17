import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late Dio _dio;
  final _storage = const FlutterSecureStorage();

  static const String baseUrl = 'http://localhost:3001/api';

  void init() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptor for authentication token
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'access_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired, try to refresh
            await _refreshToken();
            // Retry the original request
            final options = error.requestOptions;
            final token = await _storage.read(key: 'access_token');
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
              final response = await _dio.fetch(options);
              handler.resolve(response);
              return;
            }
          }
          handler.next(error);
        },
      ),
    );
  }

  Future<void> _refreshToken() async {
    try {
      final refreshToken = await _storage.read(key: 'refresh_token');
      if (refreshToken == null) return;

      final response = await _dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      final data = response.data;
      await _storage.write(key: 'access_token', value: data['accessToken']);
      await _storage.write(key: 'refresh_token', value: data['refreshToken']);
    } catch (e) {
      // Refresh failed, clear tokens
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'refresh_token');
      rethrow;
    }
  }

  // Auth endpoints
  Future<Response> register(Map<String, dynamic> userData) {
    return _dio.post('/auth/register', data: userData);
  }

  Future<Response> login(String email, String password) {
    return _dio.post('/auth/login', data: {'email': email, 'password': password});
  }

  Future<Response> refreshToken(String refreshToken) {
    return _dio.post('/auth/refresh', data: {'refreshToken': refreshToken});
  }

  Future<Response> getProfile() {
    return _dio.get('/auth/profile');
  }

  // User endpoints
  Future<Response> updateProfile(Map<String, dynamic> userData) {
    return _dio.put('/users/profile', data: userData);
  }

  Future<Response> getUserBookings(Map<String, dynamic> params) {
    return _dio.get('/users/bookings', queryParameters: params);
  }

  // Venue endpoints
  Future<Response> getVenues(Map<String, dynamic> params) {
    return _dio.get('/venues', queryParameters: params);
  }

  Future<Response> getVenueDetails(String venueId) {
    return _dio.get('/venues/$venueId');
  }

  Future<Response> getVenueTimeSlots(String venueId, Map<String, dynamic> params) {
    return _dio.get('/venues/$venueId/timeslots', queryParameters: params);
  }

  // Booking endpoints
  Future<Response> createBooking(Map<String, dynamic> bookingData) {
    return _dio.post('/bookings', data: bookingData);
  }

  Future<Response> getBookingDetails(String bookingId) {
    return _dio.get('/bookings/$bookingId');
  }

  Future<Response> cancelBooking(String bookingId, String reason) {
    return _dio.put('/bookings/$bookingId/cancel', data: {'reason': reason});
  }

  Future<Response> getMyBookings(Map<String, dynamic> params) {
    return _dio.get('/bookings/my-bookings', queryParameters: params);
  }

  // Sports endpoints
  Future<Response> getSports() {
    return _dio.get('/sports');
  }
}