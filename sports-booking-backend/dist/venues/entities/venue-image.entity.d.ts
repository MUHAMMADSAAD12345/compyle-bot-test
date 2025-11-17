import { Venue } from './venue.entity';
export declare class VenueImage {
    id: string;
    venueId: string;
    imageUrl: string;
    caption: string;
    displayOrder: number;
    isPrimary: boolean;
    createdAt: Date;
    venue: Venue;
}
