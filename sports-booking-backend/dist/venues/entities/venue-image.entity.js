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
exports.VenueImage = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const venue_entity_1 = require("./venue.entity");
let VenueImage = class VenueImage {
};
exports.VenueImage = VenueImage;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Image unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VenueImage.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Venue ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, typeorm_1.Column)({ name: 'venue_id' }),
    __metadata("design:type", String)
], VenueImage.prototype, "venueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Image URL',
        example: 'https://example.com/images/venue-1.jpg',
    }),
    (0, typeorm_1.Column)({ name: 'image_url' }),
    __metadata("design:type", String)
], VenueImage.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Image caption or description',
        example: 'Main football field view',
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VenueImage.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display order for images',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], VenueImage.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is the primary image',
        example: true,
    }),
    (0, typeorm_1.Column)({ name: 'is_primary', default: false }),
    __metadata("design:type", Boolean)
], VenueImage.prototype, "isPrimary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Image creation date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VenueImage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.images, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'venue_id' }),
    __metadata("design:type", venue_entity_1.Venue)
], VenueImage.prototype, "venue", void 0);
exports.VenueImage = VenueImage = __decorate([
    (0, typeorm_1.Entity)('venue_images'),
    (0, typeorm_1.Index)(['venueId']),
    (0, typeorm_1.Index)(['displayOrder'])
], VenueImage);
//# sourceMappingURL=venue-image.entity.js.map