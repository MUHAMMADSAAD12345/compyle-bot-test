import 'package:hive/hive.dart';

part 'venue_model.g.dart';

@HiveType(typeId: 2)
class VenueModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String ownerId;

  @HiveField(2)
  final String name;

  @HiveField(3)
  final String description;

  @HiveField(4)
  final String address;

  @HiveField(5)
  final double latitude;

  @HiveField(6)
  final double longitude;

  @HiveField(7)
  final double pricePerHour;

  @HiveField(8)
  final String currency;

  @HiveField(9)
  final List<String> amenities;

  @HiveField(10)
  final String openingTime;

  @HiveField(11)
  final String closingTime;

  @HiveField(12)
  final bool isActive;

  @HiveField(13)
  final DateTime createdAt;

  @HiveField(14)
  final DateTime updatedAt;

  @HiveField(15)
  final List<VenueImageModel> images;

  @HiveField(16)
  final List<TimeSlotModel> availableSlots;

  const VenueModel({
    required this.id,
    required this.ownerId,
    required this.name,
    required this.description,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.pricePerHour,
    required this.currency,
    required this.amenities,
    required this.openingTime,
    required this.closingTime,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.images = const [],
    this.availableSlots = const [],
  });

  factory VenueModel.fromJson(Map<String, dynamic> json) {
    return VenueModel(
      id: json['id'] as String,
      ownerId: json['ownerId'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      address: json['address'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      pricePerHour: (json['pricePerHour'] as num).toDouble(),
      currency: json['currency'] as String? ?? 'USD',
      amenities: List<String>.from(json['amenities'] as List? ?? []),
      openingTime: json['openingTime'] as String,
      closingTime: json['closingTime'] as String,
      isActive: json['isActive'] as bool? ?? true,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      images: (json['images'] as List<dynamic>?)
              ?.map((img) => VenueImageModel.fromJson(img as Map<String, dynamic>))
              .toList() ??
          [],
      availableSlots: (json['availableSlots'] as List<dynamic>?)
              ?.map((slot) => TimeSlotModel.fromJson(slot as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ownerId': ownerId,
      'name': name,
      'description': description,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'pricePerHour': pricePerHour,
      'currency': currency,
      'amenities': amenities,
      'openingTime': openingTime,
      'closingTime': closingTime,
      'isActive': isActive,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'images': images.map((img) => img.toJson()).toList(),
      'availableSlots': availableSlots.map((slot) => slot.toJson()).toList(),
    };
  }
}

@HiveType(typeId: 3)
class VenueImageModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String venueId;

  @HiveField(2)
  final String imageUrl;

  @HiveField(3)
  final String? caption;

  @HiveField(4)
  final int displayOrder;

  @HiveField(5)
  final bool isPrimary;

  @HiveField(6)
  final DateTime createdAt;

  const VenueImageModel({
    required this.id,
    required this.venueId,
    required this.imageUrl,
    this.caption,
    required this.displayOrder,
    required this.isPrimary,
    required this.createdAt,
  });

  factory VenueImageModel.fromJson(Map<String, dynamic> json) {
    return VenueImageModel(
      id: json['id'] as String,
      venueId: json['venueId'] as String,
      imageUrl: json['imageUrl'] as String,
      caption: json['caption'] as String?,
      displayOrder: json['displayOrder'] as int? ?? 0,
      isPrimary: json['isPrimary'] as bool? ?? false,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'venueId': venueId,
      'imageUrl': imageUrl,
      'caption': caption,
      'displayOrder': displayOrder,
      'isPrimary': isPrimary,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

@HiveType(typeId: 4)
class TimeSlotModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String venueId;

  @HiveField(2)
  final DateTime slotDate;

  @HiveField(3)
  final String startTime;

  @HiveField(4)
  final String endTime;

  @HiveField(5)
  final double price;

  @HiveField(6)
  final bool isAvailable;

  @HiveField(7)
  final DateTime createdAt;

  @HiveField(8)
  final DateTime updatedAt;

  const TimeSlotModel({
    required this.id,
    required this.venueId,
    required this.slotDate,
    required this.startTime,
    required this.endTime,
    required this.price,
    required this.isAvailable,
    required this.createdAt,
    required this.updatedAt,
  });

  factory TimeSlotModel.fromJson(Map<String, dynamic> json) {
    return TimeSlotModel(
      id: json['id'] as String,
      venueId: json['venueId'] as String,
      slotDate: DateTime.parse(json['slotDate'] as String),
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String,
      price: (json['price'] as num).toDouble(),
      isAvailable: json['isAvailable'] as bool? ?? true,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'venueId': venueId,
      'slotDate': slotDate.toIso8601String(),
      'startTime': startTime,
      'endTime': endTime,
      'price': price,
      'isAvailable': isAvailable,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}