import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Between } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { TimeSlot } from '../venues/entities/time-slot.entity';
import { Venue } from '../venues/entities/venue.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(TimeSlot)
    private timeSlotsRepository: Repository<TimeSlot>,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createBookingDto: CreateBookingDto, playerId: string): Promise<Booking> {
    const { timeSlotId, notes, customDurationHours, playerCount, specialRequirements } = createBookingDto;

    // Verify player exists and has player role
    const player = await this.usersRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    if (player.role !== UserRole.PLAYER && player.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only players can create bookings');
    }

    // Get the time slot with venue information
    const timeSlot = await this.timeSlotsRepository.findOne({
      where: { id: timeSlotId },
      relations: ['venue'],
    });

    if (!timeSlot) {
      throw new NotFoundException('Time slot not found');
    }

    if (!timeSlot.isAvailable) {
      throw new ConflictException('Time slot is not available');
    }

    // Check if player already booked this time slot
    const existingBooking = await this.bookingsRepository.findOne({
      where: { timeSlotId, playerId },
    });

    if (existingBooking) {
      throw new ConflictException('You have already booked this time slot');
    }

    // Validate booking time constraints
    await this.validateBookingTime(timeSlot, playerId);

    // Calculate booking duration and price
    const { duration, totalPrice } = this.calculateBookingDetails(
      timeSlot,
      customDurationHours,
    );

    // Create the booking
    const booking = this.bookingsRepository.create({
      timeSlotId,
      playerId,
      venueId: timeSlot.venueId,
      status: BookingStatus.PENDING,
      totalAmount: totalPrice,
      currency: timeSlot.venue.currency,
      bookingTime: new Date(),
      notes: this.formatBookingNotes(notes, playerCount, specialRequirements),
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    // Update time slot availability
    timeSlot.isAvailable = false;
    await this.timeSlotsRepository.save(timeSlot);

    return savedBooking;
  }

  async findAll(query: BookingQueryDto): Promise<{
    bookings: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      playerId,
      venueId,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query;

    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.player', 'player')
      .leftJoinAndSelect('booking.venue', 'venue')
      .leftJoinAndSelect('booking.timeSlot', 'timeSlot');

    // Apply filters
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

    // Apply sorting
    const validSortFields = ['created_at', 'booking_time', 'total_amount', 'updated_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    queryBuilder.orderBy(`booking.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Count total results
    const total = await queryBuilder.getCount();

    // Apply pagination
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

  async findOne(id: string, userId?: string): Promise<Booking> {
    const queryBuilder = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.player', 'player')
      .leftJoinAndSelect('booking.venue', 'venue')
      .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
      .where('booking.id = :id', { id });

    const booking = await queryBuilder.getOne();

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // If userId provided, check access permissions
    if (userId) {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Players can only see their own bookings
      if (user.role === UserRole.PLAYER && booking.playerId !== userId) {
        throw new ForbiddenException('You can only view your own bookings');
      }

      // Venue owners can see bookings for their venues
      if (user.role === UserRole.OWNER && booking.venue.ownerId !== userId) {
        throw new ForbiddenException('You can only view bookings for your venues');
      }
    }

    return booking;
  }

  async confirmBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    // Check if user can confirm this booking
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const isVenueOwner = booking.venue.ownerId === userId && user.role === UserRole.OWNER;
    const isAdmin = user.role === UserRole.ADMIN;
    const isBookingPlayer = booking.playerId === userId;

    if (!isVenueOwner && !isAdmin && !isBookingPlayer) {
      throw new ForbiddenException('You cannot confirm this booking');
    }

    booking.status = BookingStatus.CONFIRMED;
    return this.bookingsRepository.save(booking);
  }

  async cancelBooking(id: string, userId: string, reason?: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed bookings');
    }

    // Check if user can cancel this booking
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const isBookingPlayer = booking.playerId === userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isBookingPlayer && !isAdmin) {
      throw new ForbiddenException('Only players can cancel their own bookings');
    }

    // Check minimum notice period
    const venue = booking.venue;
    const minNoticeHours = venue.minBookingNoticeHours || 2;
    const bookingDateTime = new Date(booking.bookingTime);
    const currentTime = new Date();
    const hoursDifference = (bookingDateTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < minNoticeHours && !isAdmin) {
      throw new BadRequestException(
        `Cannot cancel booking less than ${minNoticeHours} hours before start time`,
      );
    }

    booking.status = BookingStatus.CANCELLED;
    if (reason) {
      booking.notes = `${booking.notes || ''}\n\nCancellation Reason: ${reason}`;
    }

    const savedBooking = await this.bookingsRepository.save(booking);

    // Make time slot available again
    if (booking.timeSlot) {
      booking.timeSlot.isAvailable = true;
      await this.timeSlotsRepository.save(booking.timeSlot);
    }

    return savedBooking;
  }

  async completeBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be completed');
    }

    // Check if user can complete this booking
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const isVenueOwner = booking.venue.ownerId === userId && user.role === UserRole.OWNER;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isVenueOwner && !isAdmin) {
      throw new ForbiddenException('Only venue owners can mark bookings as completed');
    }

    booking.status = BookingStatus.COMPLETED;
    return this.bookingsRepository.save(booking);
  }

  async findPlayerBookings(playerId: string, query: Partial<BookingQueryDto> = {}): Promise<{
    bookings: Booking[];
    total: number;
  }> {
    const {
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = query;

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

  async findVenueBookings(venueId: string, query: Partial<BookingQueryDto> = {}): Promise<{
    bookings: Booking[];
    total: number;
  }> {
    const {
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = query;

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

  private async validateBookingTime(timeSlot: TimeSlot, playerId: string): Promise<void> {
    const venue = timeSlot.venue;
    const bookingTime = new Date(timeSlot.slotDate + 'T' + timeSlot.startTime);

    // Check minimum notice period
    const minNoticeHours = venue.minBookingNoticeHours || 2;
    const currentTime = new Date();
    const hoursDifference = (bookingTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < minNoticeHours) {
      throw new BadRequestException(
        `Bookings must be made at least ${minNoticeHours} hours in advance`,
      );
    }

    // Check maximum booking duration
    const maxDurationHours = venue.maxBookingDurationHours || 4;
    const slotDuration = this.calculateSlotDuration(timeSlot.startTime, timeSlot.endTime);

    if (slotDuration > maxDurationHours) {
      throw new BadRequestException(
        `Maximum booking duration is ${maxDurationHours} hours`,
      );
    }

    // Check if booking time is in the past
    if (bookingTime < currentTime) {
      throw new BadRequestException('Cannot book time slots in the past');
    }
  }

  private calculateBookingDetails(
    timeSlot: TimeSlot,
    customDurationHours?: number,
  ): { duration: number; totalPrice: number } {
    const defaultDuration = this.calculateSlotDuration(timeSlot.startTime, timeSlot.endTime);
    const duration = customDurationHours || defaultDuration;
    const pricePerHour = timeSlot.price;
    const totalPrice = (pricePerHour * duration);

    return { duration, totalPrice };
  }

  private calculateSlotDuration(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return (endMinutes - startMinutes) / 60;
  }

  private formatBookingNotes(
    notes?: string,
    playerCount?: number,
    specialRequirements?: string,
  ): string {
    let formattedNotes = notes || '';

    if (playerCount) {
      formattedNotes += `\n\nNumber of Players: ${playerCount}`;
    }

    if (specialRequirements) {
      formattedNotes += `\n\nSpecial Requirements: ${specialRequirements}`;
    }

    return formattedNotes.trim();
  }
}