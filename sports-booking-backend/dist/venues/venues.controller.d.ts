import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueQueryDto } from './dto/venue-query.dto';
export declare class VenuesController {
    private readonly venuesService;
    constructor(venuesService: VenuesService);
    create(createVenueDto: CreateVenueDto, req: any): Promise<import("./entities/venue.entity").Venue>;
    findAll(query: VenueQueryDto): Promise<{
        venues: import("./entities/venue.entity").Venue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    search(searchQuery: string, query: VenueQueryDto): Promise<{
        venues: import("./entities/venue.entity").Venue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findMyVenues(req: any): Promise<import("./entities/venue.entity").Venue[]>;
    findOne(id: string): Promise<import("./entities/venue.entity").Venue>;
    getTimeSlots(id: string, dateFrom?: string, dateTo?: string): Promise<import("./entities/time-slot.entity").TimeSlot[]>;
    update(id: string, updateVenueDto: UpdateVenueDto, req: any): Promise<import("./entities/venue.entity").Venue>;
    remove(id: string, req: any): Promise<void>;
    uploadImages(id: string, files: Express.Multer.File[], body: {
        captions?: string[];
        displayOrders?: number[];
    }, req: any): Promise<{
        images: any[];
    }>;
    deleteImage(imageId: string, req: any): Promise<void>;
}
