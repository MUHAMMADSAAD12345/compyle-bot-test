import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Between } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { VenueImage } from './entities/venue-image.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueQueryDto } from './dto/venue-query.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(TimeSlot)
    private timeSlotsRepository: Repository<TimeSlot>,
    @InjectRepository(VenueImage)
    private venueImagesRepository: Repository<VenueImage>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createVenueDto: CreateVenueDto, ownerId: string): Promise<Venue> {
    // Verify owner exists and has owner role
    const owner = await this.usersRepository.findOne({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    if (owner.role !== UserRole.OWNER && owner.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only venue owners can create venues');
    }

    const venue = this.venuesRepository.create({
      ...createVenueDto,
      ownerId,
    });

    const savedVenue = await this.venuesRepository.save(venue);

    // Generate initial time slots for the next 30 days
    await this.generateTimeSlots(savedVenue.id);

    return savedVenue;
  }

  async findAll(query: VenueQueryDto): Promise<{
    venues: Venue[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      lat,
      lng,
      radius = 10,
      sportType,
      priceMin,
      priceMax,
      search,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query;

    const queryBuilder = this.venuesRepository
      .createQueryBuilder('venue')
      .leftJoinAndSelect('venue.images', 'images')
      .leftJoinAndSelect('venue.timeSlots', 'timeSlots')
      .where('venue.isActive = :isActive', { isActive: true });

    // Apply filters
    if (priceMin !== undefined) {
      queryBuilder.andWhere('venue.pricePerHour >= :priceMin', { priceMin });
    }

    if (priceMax !== undefined) {
      queryBuilder.andWhere('venue.pricePerHour <= :priceMax', { priceMax });
    }

    if (search) {
      queryBuilder.andWhere(
        '(venue.name ILIKE :search OR venue.description ILIKE :search OR venue.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Location-based filtering
    if (lat && lng && radius) {
      // For SQLite, we'll use a simple distance calculation
      // In production with PostGIS, this would be much more efficient
      queryBuilder.andWhere(
        'ABS(venue.latitude - :lat) <= :latDelta AND ABS(venue.longitude - :lng) <= :lngDelta',
        {
          lat,
          lng,
          latDelta: radius / 111, // Approximate latitude degree conversion
          lngDelta: radius / (111 * Math.cos(lat * Math.PI / 180)), // Longitude conversion
        },
      );
    }

    // Apply sorting
    const validSortFields = ['name', 'pricePerHour', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`venue.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Count total results
    const total = await queryBuilder.getCount();

    // Apply pagination
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

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venuesRepository.findOne({
      where: { id, isActive: true },
      relations: ['images', 'timeSlots', 'owner'],
    });

    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }

    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto, userId: string): Promise<Venue> {
    const venue = await this.findOne(id);

    // Check if user owns the venue or is admin
    if (venue.ownerId !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only update your own venues');
      }
    }

    Object.assign(venue, updateVenueDto);
    return this.venuesRepository.save(venue);
  }

  async remove(id: string, userId: string): Promise<void> {
    const venue = await this.findOne(id);

    // Check if user owns the venue or is admin
    if (venue.ownerId !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only delete your own venues');
      }
    }

    // Soft delete
    venue.isActive = false;
    await this.venuesRepository.save(venue);
  }

  async getVenueTimeSlots(venueId: string, dateFrom?: Date, dateTo?: Date): Promise<TimeSlot[]> {
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
    } else {
      // Default to next 7 days
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

  async getVenuesByOwner(ownerId: string): Promise<Venue[]> {
    return this.venuesRepository.find({
      where: { ownerId, isActive: true },
      relations: ['images', 'timeSlots'],
      order: { createdAt: 'DESC' },
    });
  }

  private async generateTimeSlots(venueId: string): Promise<void> {
    const venue = await this.venuesRepository.findOne({
      where: { id: venueId },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const slots = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // Generate for 30 days

    // Parse opening and closing times
    const [openingHour, openingMinute] = venue.openingTime.split(':').map(Number);
    const [closingHour, closingMinute] = venue.closingTime.split(':').map(Number);

    const openingMinutes = openingHour * 60 + openingMinute;
    const closingMinutes = closingHour * 60 + closingMinute;
    const slotDurationMinutes = 60; // 1-hour slots

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

    // Batch insert time slots
    await this.timeSlotsRepository.save(slots);
  }

  async uploadVenueImage(venueId: string, imageUrl: string, caption?: string, displayOrder?: number): Promise<VenueImage> {
    const venue = await this.findOne(venueId);

    // If this is the first image or marked as primary, set as primary
    const isPrimary = displayOrder === 0;

    if (isPrimary) {
      // Unset any existing primary image
      await this.venueImagesRepository.update(
        { venueId, isPrimary: true },
        { isPrimary: false }
      );
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

  async deleteVenueImage(imageId: string, userId: string): Promise<void> {
    const image = await this.venueImagesRepository.findOne({
      where: { id: imageId },
      relations: ['venue'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Check if user owns the venue or is admin
    if (image.venue.ownerId !== userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('You can only delete images from your own venues');
      }
    }

    await this.venueImagesRepository.delete(imageId);
  }
}