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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenuesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const venues_service_1 = require("./venues.service");
const create_venue_dto_1 = require("./dto/create-venue.dto");
const update_venue_dto_1 = require("./dto/update-venue.dto");
const venue_query_dto_1 = require("./dto/venue-query.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let VenuesController = class VenuesController {
    constructor(venuesService) {
        this.venuesService = venuesService;
    }
    async create(createVenueDto, req) {
        const userId = req.user.userId;
        return this.venuesService.create(createVenueDto, userId);
    }
    async findAll(query) {
        return this.venuesService.findAll(query);
    }
    async search(searchQuery, query) {
        return this.venuesService.findAll({ ...query, search: searchQuery });
    }
    async findMyVenues(req) {
        const userId = req.user.userId;
        return this.venuesService.getVenuesByOwner(userId);
    }
    async findOne(id) {
        return this.venuesService.findOne(id);
    }
    async getTimeSlots(id, dateFrom, dateTo) {
        const fromDate = dateFrom ? new Date(dateFrom) : undefined;
        const toDate = dateTo ? new Date(dateTo) : undefined;
        return this.venuesService.getVenueTimeSlots(id, fromDate, toDate);
    }
    async update(id, updateVenueDto, req) {
        const userId = req.user.userId;
        return this.venuesService.update(id, updateVenueDto, userId);
    }
    async remove(id, req) {
        const userId = req.user.userId;
        return this.venuesService.remove(id, userId);
    }
    async uploadImages(id, files, body, req) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No images provided');
        }
        const userId = req.user.userId;
        const uploadedImages = [];
        for (let i = 0; i < files.length; i++) {
            const imageUrl = `https://example.com/images/venue-${id}-${Date.now()}-${i}.jpg`;
            const image = await this.venuesService.uploadVenueImage(id, imageUrl, body?.captions?.[i], body?.displayOrders?.[i] ?? i);
            uploadedImages.push(image);
        }
        return { images: uploadedImages };
    }
    async deleteImage(imageId, req) {
        const userId = req.user.userId;
        return this.venuesService.deleteVenueImage(imageId, userId);
    }
};
exports.VenuesController = VenuesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new venue' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Venue successfully created',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Only owners and admins can create venues',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venue_dto_1.CreateVenueDto, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all venues with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of venues',
        schema: {
            type: 'object',
            properties: {
                venues: { type: 'array', items: { type: 'object' } },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [venue_query_dto_1.VenueQueryDto]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search venues by text query' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Search results',
    }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, venue_query_dto_1.VenueQueryDto]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('my-venues'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get venues owned by the authenticated user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of owned venues',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "findMyVenues", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get venue by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Venue details',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Venue not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/timeslots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for a venue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of available time slots',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('date_from')),
    __param(2, (0, common_1.Query)('date_to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "getTimeSlots", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update venue details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Venue successfully updated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Only venue owners can update their venues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Venue not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_venue_dto_1.UpdateVenueDto, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete (deactivate) a venue' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Venue successfully deleted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Only venue owners can delete their venues',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Venue not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload venue images' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Images successfully uploaded',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete venue image' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Image successfully deleted',
    }),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VenuesController.prototype, "deleteImage", null);
exports.VenuesController = VenuesController = __decorate([
    (0, swagger_1.ApiTags)('Venues'),
    (0, common_1.Controller)('venues'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [venues_service_1.VenuesService])
], VenuesController);
//# sourceMappingURL=venues.controller.js.map