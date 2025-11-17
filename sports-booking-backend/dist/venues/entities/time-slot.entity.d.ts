import { Venue } from './venue.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class TimeSlot {
    id: string;
    venueId: string;
    slotDate: Date;
    startTime: string;
    endTime: string;
    price: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    venue: Venue;
    bookings: Booking[];
}
