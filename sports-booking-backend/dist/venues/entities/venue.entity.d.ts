import { User } from '../../users/entities/user.entity';
import { TimeSlot } from './time-slot.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { VenueImage } from './venue-image.entity';
export declare class Venue {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    pricePerHour: number;
    currency: string;
    amenities: string[];
    openingTime: string;
    closingTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    timeSlots: TimeSlot[];
    bookings: Booking[];
    images: VenueImage[];
}
