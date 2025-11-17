import { BookingStatus } from '../entities/booking.entity';
export declare class BookingQueryDto {
    playerId?: string;
    venueId?: string;
    status?: BookingStatus;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
}
