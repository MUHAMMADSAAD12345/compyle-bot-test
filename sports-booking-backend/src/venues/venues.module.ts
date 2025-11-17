import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { VenueImage } from './entities/venue-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, TimeSlot, VenueImage])],
  exports: [TypeOrmModule],
})
export class VenuesModule {}