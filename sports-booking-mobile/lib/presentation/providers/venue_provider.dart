import 'package:flutter/material.dart';
import '../../core/services/api_service.dart';
import '../../data/models/venue_model.dart';

class VenueProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  List<VenueModel> _venues = [];
  List<VenueModel> get venues => _venues;

  VenueModel? _selectedVenue;
  VenueModel? get selectedVenue => _selectedVenue;

  List<TimeSlotModel> _availableSlots = [];
  List<TimeSlotModel> get availableSlots => _availableSlots;

  VenueProvider() {
    _apiService.init();
  }

  Future<void> loadVenues({
    double? lat,
    double? lng,
    int radius = 10,
    String? sportType,
    double? minPrice,
    double? maxPrice,
    int page = 1,
    int limit = 20,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final params = <String, dynamic>{
        'page': page,
        'limit': limit,
        if (lat != null) 'lat': lat,
        if (lng != null) 'lng': lng,
        if (radius != null) 'radius': radius,
        if (sportType != null) 'sport_type': sportType,
        if (minPrice != null) 'price_min': minPrice,
        if (maxPrice != null) 'price_max': maxPrice,
      };

      final response = await _apiService.getVenues(params);

      if (response.statusCode == 200) {
        final data = response.data['data'] as List;
        _venues = data.map((json) => VenueModel.fromJson(json)).toList();
        _clearError();
      } else {
        throw Exception('Failed to load venues');
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> loadVenueDetails(String venueId) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.getVenueDetails(venueId);

      if (response.statusCode == 200) {
        _selectedVenue = VenueModel.fromJson(response.data);
        _clearError();
      } else {
        throw Exception('Failed to load venue details');
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  Future<void> loadVenueTimeSlots(
    String venueId, {
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final params = <String, dynamic>{};
      if (dateFrom != null) {
        params['date_from'] = dateFrom.toIso8601String().split('T')[0];
      }
      if (dateTo != null) {
        params['date_to'] = dateTo.toIso8601String().split('T')[0];
      }

      final response = await _apiService.getVenueTimeSlots(venueId, params);

      if (response.statusCode == 200) {
        final data = response.data as List;
        _availableSlots = data.map((json) => TimeSlotModel.fromJson(json)).toList();
        _clearError();
      } else {
        throw Exception('Failed to load time slots');
      }
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
    notifyListeners();
  }

  void clearSelectedVenue() {
    _selectedVenue = null;
    _availableSlots = [];
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