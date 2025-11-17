import { Venue } from '../../venues/entities/venue.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare enum UserRole {
    PLAYER = "player",
    OWNER = "owner",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    profileImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    venues: Venue[];
    bookings: Booking[];
}
