import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';
import { Venue } from './entities/venue.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { VenueImage } from './entities/venue-image.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, TimeSlot, VenueImage, User])],
  controllers: [VenuesController],
  providers: [VenuesService],
  exports: [VenuesService, TypeOrmModule],
})
export class VenuesModule {}