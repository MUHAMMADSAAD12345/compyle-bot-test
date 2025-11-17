import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { TimeSlot } from '../venues/entities/time-slot.entity';
import { Venue } from '../venues/entities/venue.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
export declare class BookingsService {
    private bookingsRepository;
    private timeSlotsRepository;
    private venuesRepository;
    private usersRepository;
    constructor(bookingsRepository: Repository<Booking>, timeSlotsRepository: Repository<TimeSlot>, venuesRepository: Repository<Venue>, usersRepository: Repository<User>);
    create(createBookingDto: CreateBookingDto, playerId: string): Promise<Booking>;
    findAll(query: BookingQueryDto): Promise<{
        bookings: Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, userId?: string): Promise<Booking>;
    confirmBooking(id: string, userId: string): Promise<Booking>;
    cancelBooking(id: string, userId: string, reason?: string): Promise<Booking>;
    completeBooking(id: string, userId: string): Promise<Booking>;
    findPlayerBookings(playerId: string, query?: Partial<BookingQueryDto>): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    findVenueBookings(venueId: string, query?: Partial<BookingQueryDto>): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    private validateBookingTime;
    private calculateBookingDetails;
    private calculateSlotDuration;
    private formatBookingNotes;
}
