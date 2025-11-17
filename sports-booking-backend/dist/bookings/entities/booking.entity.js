"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const venue_entity_1 = require("../../venues/entities/venue.entity");
const time_slot_entity_1 = require("../../venues/entities/time-slot.entity");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Booking unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Player user ID',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    (0, typeorm_1.Column)({ name: 'player_id' }),
    __metadata("design:type", String)
], Booking.prototype, "playerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, typeorm_1.Column)({ name: 'venue_id' }),
    __metadata("design:type", String)
], Booking.prototype, "venueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time slot ID',
        example: '123e4567-e89b-12d3-a456-426614174003',
    }),
    (0, typeorm_1.Column)({ name: 'time_slot_id' }),
    __metadata("design:type", String)
], Booking.prototype, "timeSlotId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Booking status',
        enum: BookingStatus,
        example: BookingStatus.CONFIRMED,
    }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        default: BookingStatus.PENDING,
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount for booking',
        example: 50.00,
    }),
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'real' }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'USD',
    }),
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Booking.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Booking creation timestamp',
        example: '2023-01-01T10:00:00.000Z',
    }),
    (0, typeorm_1.Column)({ name: 'booking_time' }),
    __metadata("design:type", Date)
], Booking.prototype, "bookingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes for booking',
        example: 'Please prepare equipment for 10 players',
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Booking creation date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Booking last update date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'player_id' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'venue_id' }),
    __metadata("design:type", venue_entity_1.Venue)
], Booking.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => time_slot_entity_1.TimeSlot, (timeSlot) => timeSlot.bookings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'time_slot_id' }),
    __metadata("design:type", time_slot_entity_1.TimeSlot)
], Booking.prototype, "timeSlot", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings'),
    (0, typeorm_1.Index)(['playerId']),
    (0, typeorm_1.Index)(['venueId']),
    (0, typeorm_1.Index)(['timeSlotId'], { unique: true }),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['bookingTime'])
], Booking);
//# sourceMappingURL=booking.entity.js.map