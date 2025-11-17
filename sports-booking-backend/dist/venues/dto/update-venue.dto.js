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
exports.UpdateVenueDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateVenueDto {
}
exports.UpdateVenueDto = UpdateVenueDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue name',
        example: 'Updated Football Field',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateVenueDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue description',
        example: 'Updated description for the venue',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVenueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue address',
        example: '456 New Sports Avenue, City, State 12345',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVenueDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue latitude',
        example: 40.7589,
        minimum: -90,
        maximum: 90,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], UpdateVenueDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue longitude',
        example: -73.9851,
        minimum: -180,
        maximum: 180,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], UpdateVenueDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base price per hour',
        example: 75.00,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateVenueDto.prototype, "pricePerHour", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Currency code',
        example: 'USD',
        maxLength: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], UpdateVenueDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue amenities',
        example: ['parking', 'lighting', 'changing_rooms', 'showers', 'equipment'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateVenueDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue opening time',
        example: '05:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVenueDto.prototype, "openingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Venue closing time',
        example: '23:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVenueDto.prototype, "closingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether venue is active for booking',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateVenueDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sport types available at this venue',
        example: ['football', 'basketball'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateVenueDto.prototype, "sportTypes", void 0);
//# sourceMappingURL=update-venue.dto.js.map