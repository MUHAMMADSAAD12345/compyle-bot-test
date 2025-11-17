import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { VenueImage } from './entities/venue-image.entity';
import { User } from '../users/entities/user.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueQueryDto } from './dto/venue-query.dto';
export declare class VenuesService {
    private venuesRepository;
    private timeSlotsRepository;
    private venueImagesRepository;
    private usersRepository;
    constructor(venuesRepository: Repository<Venue>, timeSlotsRepository: Repository<TimeSlot>, venueImagesRepository: Repository<VenueImage>, usersRepository: Repository<User>);
    create(createVenueDto: CreateVenueDto, ownerId: string): Promise<Venue>;
    findAll(query: VenueQueryDto): Promise<{
        venues: Venue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Venue>;
    update(id: string, updateVenueDto: UpdateVenueDto, userId: string): Promise<Venue>;
    remove(id: string, userId: string): Promise<void>;
    getVenueTimeSlots(venueId: string, dateFrom?: Date, dateTo?: Date): Promise<TimeSlot[]>;
    getVenuesByOwner(ownerId: string): Promise<Venue[]>;
    private generateTimeSlots;
    uploadVenueImage(venueId: string, imageUrl: string, caption?: string, displayOrder?: number): Promise<VenueImage>;
    deleteVenueImage(imageId: string, userId: string): Promise<void>;
}
