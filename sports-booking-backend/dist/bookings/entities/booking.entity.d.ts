import { User } from '../../users/entities/user.entity';
import { Venue } from '../../venues/entities/venue.entity';
import { TimeSlot } from '../../venues/entities/time-slot.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare class Booking {
    id: string;
    playerId: string;
    venueId: string;
    timeSlotId: string;
    status: string;
    totalAmount: number;
    currency: string;
    bookingTime: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    player: User;
    venue: Venue;
    timeSlot: TimeSlot;
}
