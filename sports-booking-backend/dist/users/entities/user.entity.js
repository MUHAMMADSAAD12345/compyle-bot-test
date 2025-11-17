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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const venue_entity_1 = require("../../venues/entities/venue.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
var UserRole;
(function (UserRole) {
    UserRole["PLAYER"] = "player";
    UserRole["OWNER"] = "owner";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'john.doe@example.com',
    }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hashed password',
        example: '$2b$10$...',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User first name',
        example: 'John',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User last name',
        example: 'Doe',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User phone number in E.164 format',
        example: '+1234567890',
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role',
        enum: UserRole,
        example: UserRole.PLAYER,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PLAYER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether user account is active',
        example: true,
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to user profile image',
        example: 'https://example.com/images/user-avatar.jpg',
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profileImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User account creation date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User account last update date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venue_entity_1.Venue, (venue) => venue.owner),
    __metadata("design:type", Array)
], User.prototype, "venues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.player),
    __metadata("design:type", Array)
], User.prototype, "bookings", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['email'], { unique: true }),
    (0, typeorm_1.Index)(['role'])
], User);
//# sourceMappingURL=user.entity.js.map