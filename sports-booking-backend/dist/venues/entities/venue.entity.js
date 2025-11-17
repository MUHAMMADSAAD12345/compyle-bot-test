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
exports.Venue = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const time_slot_entity_1 = require("./time-slot.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const venue_image_entity_1 = require("./venue-image.entity");
let Venue = class Venue {
};
exports.Venue = Venue;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Venue.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue owner user ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, typeorm_1.Column)({ name: 'owner_id' }),
    __metadata("design:type", String)
], Venue.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue name',
        example: 'Central Football Field',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Venue.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue description',
        example: 'Professional football field with premium grass and lighting',
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Venue.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue address',
        example: '123 Sports Street, City, State 12345',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Venue.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue latitude',
        example: 40.7128,
    }),
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], Venue.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue longitude',
        example: -74.0060,
    }),
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], Venue.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base price per hour',
        example: 50.00,
    }),
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], Venue.prototype, "pricePerHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'USD',
    }),
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Venue.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue amenities as JSON',
        example: ['parking', 'lighting', 'changing_rooms', 'showers'],
        type: [String],
    }),
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], Venue.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue opening time',
        example: '06:00',
    }),
    (0, typeorm_1.Column)({ name: 'opening_time' }),
    __metadata("design:type", String)
], Venue.prototype, "openingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue closing time',
        example: '22:00',
    }),
    (0, typeorm_1.Column)({ name: 'closing_time' }),
    __metadata("design:type", String)
], Venue.prototype, "closingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether venue is active for booking',
        example: true,
    }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Venue.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue creation date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Venue.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue last update date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Venue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.venues, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Venue.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => time_slot_entity_1.TimeSlot, (timeSlot) => timeSlot.venue),
    __metadata("design:type", Array)
], Venue.prototype, "timeSlots", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.venue),
    __metadata("design:type", Array)
], Venue.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venue_image_entity_1.VenueImage, (venueImage) => venueImage.venue),
    __metadata("design:type", Array)
], Venue.prototype, "images", void 0);
exports.Venue = Venue = __decorate([
    (0, typeorm_1.Entity)('venues'),
    (0, typeorm_1.Index)(['ownerId']),
    (0, typeorm_1.Index)(['isActive'])
], Venue);
//# sourceMappingURL=venue.entity.js.map