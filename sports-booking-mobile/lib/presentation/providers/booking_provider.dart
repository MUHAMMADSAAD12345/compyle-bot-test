import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';
import '../../data/models/booking_model.dart';

class BookingProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  List<BookingModel> _bookings = [];
  List<BookingModel> get bookings => _bookings;

  List<BookingModel> _myBookings = [];
  List<BookingModel> get myBookings => _myBookings;

  BookingModel? _selectedBooking;
  BookingModel? get selectedBooking => _selectedBooking;

  BookingProvider() {
    _apiService.init();
  }

  Future<void> loadMyBookings({
    String? status,
    DateTime? dateFrom,
    DateTime? dateTo,
    int page = 1,
    int limit = 20,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final params = <String, dynamic>{
        'page': page,
        'limit': limit,
        if (status != null) 'status': status,
        if (dateFrom != null) 'date_from': dateFrom.toIso8601String(),
        if (dateTo != null) 'date_to': dateTo.toIso8601String(),
      };

      final response = await _apiService.getMyBookings(params);

      if (response.statusCode == 200) {
        final data = response.data['data'] as List;
        _myBookings = data.map((json) => BookingModel.fromJson(json)).toList();
        _clearError();
      } else {
        throw Exception('Failed to load bookings');
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<BookingModel> createBooking({
    required String venueId,
    required List<String> timeSlotIds,
    String? notes,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final bookingData = {
        'venue_id': venueId,
        'time_slot_ids': timeSlotIds,
        if (notes != null) 'notes': notes,
      };

      final response = await _apiService.createBooking(bookingData);

      if (response.statusCode == 201) {
        final newBooking = BookingModel.fromJson(response.data);
        _myBookings.insert(0, newBooking);
        _clearError();
        notifyListeners();
        return newBooking;
      } else {
        throw Exception('Failed to create booking');
      }
    } catch (e) {
      _setError(e.toString());
      rethrow;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadBookingDetails(String bookingId) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.getBookingDetails(bookingId);

      if (response.statusCode == 200) {
        _selectedBooking = BookingModel.fromJson(response.data);
        _clearError();
      } else {
        throw Exception('Failed to load booking details');
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> cancelBooking(String bookingId, {String? reason}) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.cancelBooking(bookingId, reason ?? '');

      if (response.statusCode == 200) {
        // Update local booking status
        final index = _myBookings.indexWhere((booking) => booking.id == bookingId);
        if (index != -1) {
          _myBookings[index] = _myBookings[index].copyWith(
            status: BookingStatus.cancelled,
          );
        }
        if (_selectedBooking?.id == bookingId) {
          _selectedBooking = _selectedBooking!.copyWith(
            status: BookingStatus.cancelled,
          );
        }
        _clearError();
      } else {
        throw Exception('Failed to cancel booking');
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  void clearSelectedBooking() {
    _selectedBooking = null;
    notifyListeners();
  }

  List<BookingModel> get upcomingBookings => _myBookings
      .where((booking) => booking.isUpcoming && !booking.isCancelled)
      .toList();

  List<BookingModel> get pastBookings => _myBookings
      .where((booking) => booking.isPast || booking.isCancelled)
      .toList();

  List<BookingModel> get activeBookings => _myBookings
      .where((booking) => booking.isUpcoming && booking.isConfirmed)
      .toList();

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