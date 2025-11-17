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
exports.TimeSlot = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const venue_entity_1 = require("./venue.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
let TimeSlot = class TimeSlot {
};
exports.TimeSlot = TimeSlot;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time slot unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TimeSlot.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, typeorm_1.Column)({ name: 'venue_id' }),
    __metadata("design:type", String)
], TimeSlot.prototype, "venueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the time slot',
        example: '2023-12-25',
    }),
    (0, typeorm_1.Column)({ name: 'slot_date', type: 'date' }),
    __metadata("design:type", Date)
], TimeSlot.prototype, "slotDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start time of the slot',
        example: '14:00',
    }),
    (0, typeorm_1.Column)({ name: 'start_time', type: 'time' }),
    __metadata("design:type", String)
], TimeSlot.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End time of the slot',
        example: '15:00',
    }),
    (0, typeorm_1.Column)({ name: 'end_time', type: 'time' }),
    __metadata("design:type", String)
], TimeSlot.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price for this time slot',
        example: 50.00,
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], TimeSlot.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether slot is available for booking',
        example: true,
    }),
    (0, typeorm_1.Column)({ name: 'is_available', default: true }),
    __metadata("design:type", Boolean)
], TimeSlot.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time slot creation date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TimeSlot.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time slot last update date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TimeSlot.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.timeSlots, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'venue_id' }),
    __metadata("design:type", venue_entity_1.Venue)
], TimeSlot.prototype, "venue", void 0);
__decorate([
    OneToMany(() => booking_entity_1.Booking, (booking) => booking.timeSlot),
    __metadata("design:type", Array)
], TimeSlot.prototype, "bookings", void 0);
exports.TimeSlot = TimeSlot = __decorate([
    (0, typeorm_1.Entity)('time_slots'),
    (0, typeorm_1.Index)(['venueId']),
    (0, typeorm_1.Index)(['slotDate']),
    (0, typeorm_1.Index)(['isAvailable']),
    (0, typeorm_1.Unique)(['venueId', 'slotDate', 'startTime'])
], TimeSlot);
//# sourceMappingURL=time-slot.entity.js.map