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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const booking_query_dto_1 = require("./dto/booking-query.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let BookingsController = class BookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async create(createBookingDto, req) {
        const playerId = req.user.userId;
        return this.bookingsService.create(createBookingDto, playerId);
    }
    async findAll(query) {
        return this.bookingsService.findAll(query);
    }
    async findMyBookings(req, query) {
        const playerId = req.user.userId;
        return this.bookingsService.findPlayerBookings(playerId, query);
    }
    async findVenueBookings(venueId, query, req) {
        const userId = req.user.userId;
        return this.bookingsService.findVenueBookings(venueId, query);
    }
    async findOne(id, req) {
        const userId = req.user.userId;
        return this.bookingsService.findOne(id, userId);
    }
    async confirmBooking(id, req) {
        const userId = req.user.userId;
        return this.bookingsService.confirmBooking(id, userId);
    }
    async completeBooking(id, req) {
        const userId = req.user.userId;
        return this.bookingsService.completeBooking(id, userId);
    }
    async cancelBooking(id, body, req) {
        const userId = req.user.userId;
        const { reason } = body;
        return this.bookingsService.cancelBooking(id, userId, reason);
    }
    async getBookingStats() {
        return {
            totalBookings: 0,
            pendingBookings: 0,
            confirmedBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0,
            totalRevenue: 0,
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.PLAYER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Booking successfully created',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Only players can create bookings',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Validation errors or time slot unavailable',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Time slot already booked',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings with filtering and pagination (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of bookings',
        schema: {
            type: 'object',
            properties: {
                bookings: { type: 'array', items: { type: 'object' } },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_query_dto_1.BookingQueryDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.PLAYER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings for the authenticated player' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of player bookings',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findMyBookings", null);
__decorate([
    (0, common_1.Get)('venue/:venueId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings for a specific venue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of venue bookings',
    }),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findVenueBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by ID (with access control)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking details',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Booking not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Access denied',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a pending booking' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking confirmed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Booking is not pending',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Cannot confirm this booking',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a booking as completed' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking marked as completed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Booking is not confirmed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Only venue owners can complete bookings',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "completeBooking", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.PLAYER, user_entity_1.UserRole.OWNER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking cancelled',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Cannot cancel completed bookings',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Access denied',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)('stats/dashboard'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking statistics dashboard (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking statistics',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingStats", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map