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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const time_slot_entity_1 = require("../venues/entities/time-slot.entity");
const venue_entity_1 = require("../venues/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
let BookingsService = class BookingsService {
    constructor(bookingsRepository, timeSlotsRepository, venuesRepository, usersRepository) {
        this.bookingsRepository = bookingsRepository;
        this.timeSlotsRepository = timeSlotsRepository;
        this.venuesRepository = venuesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createBookingDto, playerId) {
        const { timeSlotId, notes, customDurationHours, playerCount, specialRequirements } = createBookingDto;
        const player = await this.usersRepository.findOne({
            where: { id: playerId },
        });
        if (!player) {
            throw new common_1.NotFoundException('Player not found');
        }
        if (player.role !== user_entity_1.UserRole.PLAYER && player.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only players can create bookings');
        }
        const timeSlot = await this.timeSlotsRepository.findOne({
            where: { id: timeSlotId },
            relations: ['venue'],
        });
        if (!timeSlot) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        if (!timeSlot.isAvailable) {
            throw new common_1.ConflictException('Time slot is not available');
        }
        const existingBooking = await this.bookingsRepository.findOne({
            where: { timeSlotId, playerId },
        });
        if (existingBooking) {
            throw new common_1.ConflictException('You have already booked this time slot');
        }
        await this.validateBookingTime(timeSlot, playerId);
        const { duration, totalPrice } = this.calculateBookingDetails(timeSlot, customDurationHours);
        const booking = this.bookingsRepository.create({
            timeSlotId,
            playerId,
            venueId: timeSlot.venueId,
            status: booking_entity_1.BookingStatus.PENDING,
            totalAmount: totalPrice,
            currency: timeSlot.venue.currency,
            bookingTime: new Date(),
            notes: this.formatBookingNotes(notes, playerCount, specialRequirements),
        });
        const savedBooking = await this.bookingsRepository.save(booking);
        timeSlot.isAvailable = false;
        await this.timeSlotsRepository.save(timeSlot);
        return savedBooking;
    }
    async findAll(query) {
        const { playerId, venueId, status, dateFrom, dateTo, page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc', } = query;
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.player', 'player')
            .leftJoinAndSelect('booking.venue', 'venue')
            .leftJoinAndSelect('booking.timeSlot', 'timeSlot');
        if (playerId) {
            queryBuilder.andWhere('booking.playerId = :playerId', { playerId });
        }
        if (venueId) {
            queryBuilder.andWhere('booking.venueId = :venueId', { venueId });
        }
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        if (dateFrom && dateTo) {
            queryBuilder.andWhere('booking.bookingTime BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            });
        }
        const validSortFields = ['created_at', 'booking_time', 'total_amount', 'updated_at'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
        queryBuilder.orderBy(`booking.${sortField}`, sortOrder.toUpperCase());
        const total = await queryBuilder.getCount();
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const bookings = await queryBuilder.getMany();
        return {
            bookings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.player', 'player')
            .leftJoinAndSelect('booking.venue', 'venue')
            .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
            .where('booking.id = :id', { id });
        const booking = await queryBuilder.getOne();
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        if (userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.role === user_entity_1.UserRole.PLAYER && booking.playerId !== userId) {
                throw new common_1.ForbiddenException('You can only view your own bookings');
            }
            if (user.role === user_entity_1.UserRole.OWNER && booking.venue.ownerId !== userId) {
                throw new common_1.ForbiddenException('You can only view bookings for your venues');
            }
        }
        return booking;
    }
    async confirmBooking(id, userId) {
        const booking = await this.findOne(id, userId);
        if (booking.status !== booking_entity_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending bookings can be confirmed');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const isVenueOwner = booking.venue.ownerId === userId && user.role === user_entity_1.UserRole.OWNER;
        const isAdmin = user.role === user_entity_1.UserRole.ADMIN;
        const isBookingPlayer = booking.playerId === userId;
        if (!isVenueOwner && !isAdmin && !isBookingPlayer) {
            throw new common_1.ForbiddenException('You cannot confirm this booking');
        }
        booking.status = booking_entity_1.BookingStatus.CONFIRMED;
        return this.bookingsRepository.save(booking);
    }
    async cancelBooking(id, userId, reason) {
        const booking = await this.findOne(id, userId);
        if (booking.status === booking_entity_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.status === booking_entity_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel completed bookings');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const isBookingPlayer = booking.playerId === userId;
        const isAdmin = user.role === user_entity_1.UserRole.ADMIN;
        if (!isBookingPlayer && !isAdmin) {
            throw new common_1.ForbiddenException('Only players can cancel their own bookings');
        }
        const venue = booking.venue;
        const minNoticeHours = venue.minBookingNoticeHours || 2;
        const bookingDateTime = new Date(booking.bookingTime);
        const currentTime = new Date();
        const hoursDifference = (bookingDateTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
        if (hoursDifference < minNoticeHours && !isAdmin) {
            throw new common_1.BadRequestException(`Cannot cancel booking less than ${minNoticeHours} hours before start time`);
        }
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        if (reason) {
            booking.notes = `${booking.notes || ''}\n\nCancellation Reason: ${reason}`;
        }
        const savedBooking = await this.bookingsRepository.save(booking);
        if (booking.timeSlot) {
            booking.timeSlot.isAvailable = true;
            await this.timeSlotsRepository.save(booking.timeSlot);
        }
        return savedBooking;
    }
    async completeBooking(id, userId) {
        const booking = await this.findOne(id, userId);
        if (booking.status !== booking_entity_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed bookings can be completed');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const isVenueOwner = booking.venue.ownerId === userId && user.role === user_entity_1.UserRole.OWNER;
        const isAdmin = user.role === user_entity_1.UserRole.ADMIN;
        if (!isVenueOwner && !isAdmin) {
            throw new common_1.ForbiddenException('Only venue owners can mark bookings as completed');
        }
        booking.status = booking_entity_1.BookingStatus.COMPLETED;
        return this.bookingsRepository.save(booking);
    }
    async findPlayerBookings(playerId, query = {}) {
        const { status, dateFrom, dateTo, page = 1, limit = 20, } = query;
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.venue', 'venue')
            .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
            .where('booking.playerId = :playerId', { playerId });
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        if (dateFrom && dateTo) {
            queryBuilder.andWhere('booking.bookingTime BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            });
        }
        queryBuilder.orderBy('booking.bookingTime', 'DESC');
        const total = await queryBuilder.getCount();
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const bookings = await queryBuilder.getMany();
        return { bookings, total };
    }
    async findVenueBookings(venueId, query = {}) {
        const { status, dateFrom, dateTo, page = 1, limit = 20, } = query;
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.player', 'player')
            .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
            .where('booking.venueId = :venueId', { venueId });
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        if (dateFrom && dateTo) {
            queryBuilder.andWhere('booking.bookingTime BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            });
        }
        queryBuilder.orderBy('booking.bookingTime', 'DESC');
        const total = await queryBuilder.getCount();
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const bookings = await queryBuilder.getMany();
        return { bookings, total };
    }
    async validateBookingTime(timeSlot, playerId) {
        const venue = timeSlot.venue;
        const bookingTime = new Date(timeSlot.slotDate + 'T' + timeSlot.startTime);
        const minNoticeHours = venue.minBookingNoticeHours || 2;
        const currentTime = new Date();
        const hoursDifference = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
        if (hoursDifference < minNoticeHours) {
            throw new common_1.BadRequestException(`Bookings must be made at least ${minNoticeHours} hours in advance`);
        }
        const maxDurationHours = venue.maxBookingDurationHours || 4;
        const slotDuration = this.calculateSlotDuration(timeSlot.startTime, timeSlot.endTime);
        if (slotDuration > maxDurationHours) {
            throw new common_1.BadRequestException(`Maximum booking duration is ${maxDurationHours} hours`);
        }
        if (bookingTime < currentTime) {
            throw new common_1.BadRequestException('Cannot book time slots in the past');
        }
    }
    calculateBookingDetails(timeSlot, customDurationHours) {
        const defaultDuration = this.calculateSlotDuration(timeSlot.startTime, timeSlot.endTime);
        const duration = customDurationHours || defaultDuration;
        const pricePerHour = timeSlot.price;
        const totalPrice = (pricePerHour * duration);
        return { duration, totalPrice };
    }
    calculateSlotDuration(startTime, endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        return (endMinutes - startMinutes) / 60;
    }
    formatBookingNotes(notes, playerCount, specialRequirements) {
        let formattedNotes = notes || '';
        if (playerCount) {
            formattedNotes += `\n\nNumber of Players: ${playerCount}`;
        }
        if (specialRequirements) {
            formattedNotes += `\n\nSpecial Requirements: ${specialRequirements}`;
        }
        return formattedNotes.trim();
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(time_slot_entity_1.TimeSlot)),
    __param(2, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map