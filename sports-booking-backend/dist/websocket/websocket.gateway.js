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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("../bookings/bookings.service");
let BookingGateway = class BookingGateway {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
        this.logger = new common_1.Logger('BookingGateway');
        this.connectedClients = new Map();
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
        this.connectedClients.set(client.id, client);
        client.emit('connection-established', {
            clientId: client.id,
            message: 'Connected to booking system',
            timestamp: new Date().toISOString(),
        });
        const userId = client.handshake.query.userId;
        if (userId) {
            client.join(`user_${userId}`);
            this.logger.log(`Client ${client.id} joined room for user ${userId}`);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
        const userId = client.handshake.query.userId;
        if (userId) {
            client.leave(`user_${userId}`);
            this.logger.log(`Client ${client.id} left room for user ${userId}`);
        }
    }
    handleBookingCreated(client, payload) {
        this.logger.log(`Booking created: ${JSON.stringify(payload)}`);
        this.server.emit('booking_update', {
            type: 'booking_created',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
    handleBookingUpdated(client, payload) {
        this.logger.log(`Booking updated: ${JSON.stringify(payload)}`);
        this.server.emit('booking_update', {
            type: 'booking_updated',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
    handleBookingCancelled(client, payload) {
        this.logger.log(`Booking cancelled: ${JSON.stringify(payload)}`);
        this.server.emit('booking_update', {
            type: 'booking_cancelled',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
    handleTimeSlotBooked(client, payload) {
        this.logger.log(`Time slot booked: ${JSON.stringify(payload)}`);
        this.server.emit('availability_update', {
            type: 'time_slot_booked',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
    handleVenueUpdated(client, payload) {
        this.logger.log(`Venue updated: ${JSON.stringify(payload)}`);
        this.server.emit('venue_update', {
            type: 'venue_updated',
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
    sendToUser(userId, event, data) {
        const userRoom = `user_${userId}`;
        this.server.to(userRoom).emit(event, data);
    }
    broadcastToAll(event, data) {
        this.server.emit(event, data);
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
};
exports.BookingGateway = BookingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof websockets_1.WebSocketServer !== "undefined" && websockets_1.WebSocketServer) === "function" ? _a : Object)
], BookingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('booking_created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof websockets_1.ConnectedSocket !== "undefined" && websockets_1.ConnectedSocket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handleBookingCreated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('booking_updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof websockets_1.ConnectedSocket !== "undefined" && websockets_1.ConnectedSocket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handleBookingUpdated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('booking_cancelled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof websockets_1.ConnectedSocket !== "undefined" && websockets_1.ConnectedSocket) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handleBookingCancelled", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('time_slot_booked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof websockets_1.ConnectedSocket !== "undefined" && websockets_1.ConnectedSocket) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handleTimeSlotBooked", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('venue_updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof websockets_1.ConnectedSocket !== "undefined" && websockets_1.ConnectedSocket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handleVenueUpdated", null);
exports.BookingGateway = BookingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingGateway);
//# sourceMappingURL=websocket.gateway.js.map