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
exports.Sport = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Sport = class Sport {
};
exports.Sport = Sport;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sport unique identifier',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sport.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sport name',
        example: 'Football',
    }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Sport.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sport icon emoji or symbol',
        example: '⚽',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sport.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether sport is active for booking',
        example: true,
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Sport.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sport creation date',
        example: '2023-01-01T00:00:00.000Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sport.prototype, "createdAt", void 0);
exports.Sport = Sport = __decorate([
    (0, typeorm_1.Entity)('sports'),
    (0, typeorm_1.Index)(['name'], { unique: true })
], Sport);
//# sourceMappingURL=sport.entity.js.map