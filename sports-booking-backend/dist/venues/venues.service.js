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
exports.VenuesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venue_entity_1 = require("./entities/venue.entity");
const time_slot_entity_1 = require("./entities/time-slot.entity");
const venue_image_entity_1 = require("./entities/venue-image.entity");
const user_entity_1 = require("../users/entities/user.entity");
let VenuesService = class VenuesService {
    constructor(venuesRepository, timeSlotsRepository, venueImagesRepository, usersRepository) {
        this.venuesRepository = venuesRepository;
        this.timeSlotsRepository = timeSlotsRepository;
        this.venueImagesRepository = venueImagesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createVenueDto, ownerId) {
        const owner = await this.usersRepository.findOne({
            where: { id: ownerId },
        });
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        if (owner.role !== user_entity_1.UserRole.OWNER && owner.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only venue owners can create venues');
        }
        const venue = this.venuesRepository.create({
            ...createVenueDto,
            ownerId,
        });
        const savedVenue = await this.venuesRepository.save(venue);
        await this.generateTimeSlots(savedVenue.id);
        return savedVenue;
    }
    async findAll(query) {
        const { lat, lng, radius = 10, sportType, priceMin, priceMax, search, page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc', } = query;
        const queryBuilder = this.venuesRepository
            .createQueryBuilder('venue')
            .leftJoinAndSelect('venue.images', 'images')
            .leftJoinAndSelect('venue.timeSlots', 'timeSlots')
            .where('venue.isActive = :isActive', { isActive: true });
        if (priceMin !== undefined) {
            queryBuilder.andWhere('venue.pricePerHour >= :priceMin', { priceMin });
        }
        if (priceMax !== undefined) {
            queryBuilder.andWhere('venue.pricePerHour <= :priceMax', { priceMax });
        }
        if (search) {
            queryBuilder.andWhere('(venue.name ILIKE :search OR venue.description ILIKE :search OR venue.address ILIKE :search)', { search: `%${search}%` });
        }
        if (lat && lng && radius) {
            queryBuilder.andWhere('ABS(venue.latitude - :lat) <= :latDelta AND ABS(venue.longitude - :lng) <= :lngDelta', {
                lat,
                lng,
                latDelta: radius / 111,
                lngDelta: radius / (111 * Math.cos(lat * Math.PI / 180)),
            });
        }
        const validSortFields = ['name', 'pricePerHour', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`venue.${sortField}`, sortOrder.toUpperCase());
        const total = await queryBuilder.getCount();
        const offset = (page - 1) * limit;
        queryBuilder.skip(offset).take(limit);
        const venues = await queryBuilder.getMany();
        return {
            venues,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const venue = await this.venuesRepository.findOne({
            where: { id, isActive: true },
            relations: ['images', 'timeSlots', 'owner'],
        });
        if (!venue) {
            throw new common_1.NotFoundException(`Venue with ID ${id} not found`);
        }
        return venue;
    }
    async update(id, updateVenueDto, userId) {
        const venue = await this.findOne(id);
        if (venue.ownerId !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('You can only update your own venues');
            }
        }
        Object.assign(venue, updateVenueDto);
        return this.venuesRepository.save(venue);
    }
    async remove(id, userId) {
        const venue = await this.findOne(id);
        if (venue.ownerId !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('You can only delete your own venues');
            }
        }
        venue.isActive = false;
        await this.venuesRepository.save(venue);
    }
    async getVenueTimeSlots(venueId, dateFrom, dateTo) {
        const venue = await this.findOne(venueId);
        const queryBuilder = this.timeSlotsRepository
            .createQueryBuilder('timeSlot')
            .where('timeSlot.venueId = :venueId', { venueId })
            .andWhere('timeSlot.isAvailable = :isAvailable', { isAvailable: true });
        if (dateFrom && dateTo) {
            queryBuilder.andWhere('timeSlot.slotDate BETWEEN :dateFrom AND :dateTo', {
                dateFrom,
                dateTo,
            });
        }
        else {
            const today = new Date();
            const weekFromNow = new Date();
            weekFromNow.setDate(today.getDate() + 7);
            queryBuilder.andWhere('timeSlot.slotDate BETWEEN :today AND :weekFromNow', {
                today,
                weekFromNow,
            });
        }
        queryBuilder.orderBy('timeSlot.slotDate', 'ASC')
            .addOrderBy('timeSlot.startTime', 'ASC');
        return queryBuilder.getMany();
    }
    async getVenuesByOwner(ownerId) {
        return this.venuesRepository.find({
            where: { ownerId, isActive: true },
            relations: ['images', 'timeSlots'],
            order: { createdAt: 'DESC' },
        });
    }
    async generateTimeSlots(venueId) {
        const venue = await this.venuesRepository.findOne({
            where: { id: venueId },
        });
        if (!venue) {
            throw new common_1.NotFoundException('Venue not found');
        }
        const slots = [];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);
        const [openingHour, openingMinute] = venue.openingTime.split(':').map(Number);
        const [closingHour, closingMinute] = venue.closingTime.split(':').map(Number);
        const openingMinutes = openingHour * 60 + openingMinute;
        const closingMinutes = closingHour * 60 + closingMinute;
        const slotDurationMinutes = 60;
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const slotDate = new Date(date);
            for (let time = openingMinutes; time + slotDurationMinutes <= closingMinutes; time += slotDurationMinutes) {
                const startHour = Math.floor(time / 60);
                const startMinute = time % 60;
                const endHour = Math.floor((time + slotDurationMinutes) / 60);
                const endMinute = (time + slotDurationMinutes) % 60;
                const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
                const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
                slots.push({
                    venueId,
                    slotDate,
                    startTime,
                    endTime,
                    price: venue.pricePerHour,
                    isAvailable: true,
                });
            }
        }
        await this.timeSlotsRepository.save(slots);
    }
    async uploadVenueImage(venueId, imageUrl, caption, displayOrder) {
        const venue = await this.findOne(venueId);
        const isPrimary = displayOrder === 0;
        if (isPrimary) {
            await this.venueImagesRepository.update({ venueId, isPrimary: true }, { isPrimary: false });
        }
        const venueImage = this.venueImagesRepository.create({
            venueId,
            imageUrl,
            caption,
            displayOrder: displayOrder ?? 0,
            isPrimary,
        });
        return this.venueImagesRepository.save(venueImage);
    }
    async deleteVenueImage(imageId, userId) {
        const image = await this.venueImagesRepository.findOne({
            where: { id: imageId },
            relations: ['venue'],
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        if (image.venue.ownerId !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('You can only delete images from your own venues');
            }
        }
        await this.venueImagesRepository.delete(imageId);
    }
};
exports.VenuesService = VenuesService;
exports.VenuesService = VenuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(1, (0, typeorm_1.InjectRepository)(time_slot_entity_1.TimeSlot)),
    __param(2, (0, typeorm_1.InjectRepository)(venue_image_entity_1.VenueImage)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VenuesService);
//# sourceMappingURL=venues.service.js.map