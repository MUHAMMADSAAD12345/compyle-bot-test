import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<import("./entities/booking.entity").Booking>;
    findAll(query: BookingQueryDto): Promise<{
        bookings: import("./entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findMyBookings(req: any, query: Partial<BookingQueryDto>): Promise<{
        bookings: import("./entities/booking.entity").Booking[];
        total: number;
    }>;
    findVenueBookings(venueId: string, query: Partial<BookingQueryDto>, req: any): Promise<{
        bookings: import("./entities/booking.entity").Booking[];
        total: number;
    }>;
    findOne(id: string, req: any): Promise<import("./entities/booking.entity").Booking>;
    confirmBooking(id: string, req: any): Promise<import("./entities/booking.entity").Booking>;
    completeBooking(id: string, req: any): Promise<import("./entities/booking.entity").Booking>;
    cancelBooking(id: string, body: {
        reason?: string;
    }, req: any): Promise<import("./entities/booking.entity").Booking>;
    getBookingStats(): Promise<{
        totalBookings: number;
        pendingBookings: number;
        confirmedBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        totalRevenue: number;
    }>;
}
