import 'package:hive/hive.dart';

part 'booking_model.g.dart';

@HiveType(typeId: 5)
enum BookingStatus {
  @HiveField(0)
  pending,
  @HiveField(1)
  confirmed,
  @HiveField(2)
  cancelled,
  @HiveField(3)
  completed,
}

@HiveType(typeId: 6)
class BookingModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String playerId;

  @HiveField(2)
  final String venueId;

  @HiveField(3)
  final String timeSlotId;

  @HiveField(4)
  final BookingStatus status;

  @HiveField(5)
  final double totalAmount;

  @HiveField(6)
  final String currency;

  @HiveField(7)
  final DateTime bookingTime;

  @HiveField(8)
  final String? notes;

  @HiveField(9)
  final DateTime createdAt;

  @HiveField(10)
  final DateTime updatedAt;

  // Include related data for UI display
  @HiveField(11)
  final VenueModel? venue;

  @HiveField(12)
  final TimeSlotModel? timeSlot;

  const BookingModel({
    required this.id,
    required this.playerId,
    required this.venueId,
    required this.timeSlotId,
    required this.status,
    required this.totalAmount,
    required this.currency,
    required this.bookingTime,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.venue,
    this.timeSlot,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String,
      playerId: json['playerId'] as String,
      venueId: json['venueId'] as String,
      timeSlotId: json['timeSlotId'] as String,
      status: BookingStatus.values.firstWhere(
        (status) => status.name == json['status'],
        orElse: () => BookingStatus.pending,
      ),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      currency: json['currency'] as String? ?? 'USD',
      bookingTime: DateTime.parse(json['bookingTime'] as String),
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      venue: json['venue'] != null
          ? VenueModel.fromJson(json['venue'] as Map<String, dynamic>)
          : null,
      timeSlot: json['timeSlot'] != null
          ? TimeSlotModel.fromJson(json['timeSlot'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'playerId': playerId,
      'venueId': venueId,
      'timeSlotId': timeSlotId,
      'status': status.name,
      'totalAmount': totalAmount,
      'currency': currency,
      'bookingTime': bookingTime.toIso8601String(),
      'notes': notes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'venue': venue?.toJson(),
      'timeSlot': timeSlot?.toJson(),
    };
  }

  BookingModel copyWith({
    String? id,
    String? playerId,
    String? venueId,
    String? timeSlotId,
    BookingStatus? status,
    double? totalAmount,
    String? currency,
    DateTime? bookingTime,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
    VenueModel? venue,
    TimeSlotModel? timeSlot,
  }) {
    return BookingModel(
      id: id ?? this.id,
      playerId: playerId ?? this.playerId,
      venueId: venueId ?? this.venueId,
      timeSlotId: timeSlotId ?? this.timeSlotId,
      status: status ?? this.status,
      totalAmount: totalAmount ?? this.totalAmount,
      currency: currency ?? this.currency,
      bookingTime: bookingTime ?? this.bookingTime,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      venue: venue ?? this.venue,
      timeSlot: timeSlot ?? this.timeSlot,
    );
  }

  bool get isUpcoming => bookingTime.isAfter(DateTime.now());
  bool get isPast => bookingTime.isBefore(DateTime.now());
  bool get isConfirmed => status == BookingStatus.confirmed;
  bool get isPending => status == BookingStatus.pending;
  bool get isCancelled => status == BookingStatus.cancelled;
  bool get isCompleted => status == BookingStatus.completed;
}

// Import VenueModel and TimeSlotModel for the JSON parsing
import 'venue_model.dart';