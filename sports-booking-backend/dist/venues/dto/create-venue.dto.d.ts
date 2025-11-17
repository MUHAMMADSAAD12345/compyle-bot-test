export declare class CreateVenueDto {
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
    sportTypes?: string[];
}
