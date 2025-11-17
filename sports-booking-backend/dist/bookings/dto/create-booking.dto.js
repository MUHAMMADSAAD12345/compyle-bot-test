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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time slot ID to book',
        example: '123e4567-e89b-12d3-a456-426614174003',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "timeSlotId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional booking notes',
        example: 'Please prepare equipment for 10 players',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom duration in hours (if different from slot duration)',
        example: 2,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "customDurationHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of players expected',
        example: 10,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "playerCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special requirements for the booking',
        example: 'Need additional parking for team bus',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "specialRequirements", void 0);
//# sourceMappingURL=create-booking.dto.js.map