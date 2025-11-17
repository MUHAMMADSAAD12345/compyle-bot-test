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
exports.CreateVenueDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVenueDto {
}
exports.CreateVenueDto = CreateVenueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue name',
        example: 'Central Football Field',
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateVenueDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue description',
        example: 'Professional football field with premium grass and lighting',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVenueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue address',
        example: '123 Sports Street, City, State 12345',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVenueDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue latitude',
        example: 40.7128,
        minimum: -90,
        maximum: 90,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateVenueDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue longitude',
        example: -74.0060,
        minimum: -180,
        maximum: 180,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateVenueDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base price per hour',
        example: 50.00,
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVenueDto.prototype, "pricePerHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code',
        example: 'USD',
        default: 'USD',
        maxLength: 3,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateVenueDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue amenities',
        example: ['parking', 'lighting', 'changing_rooms', 'showers'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateVenueDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue opening time',
        example: '06:00',
        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVenueDto.prototype, "openingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue closing time',
        example: '22:00',
        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVenueDto.prototype, "closingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sport types available at this venue',
        example: ['football', 'basketball'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateVenueDto.prototype, "sportTypes", void 0);
//# sourceMappingURL=create-venue.dto.js.map