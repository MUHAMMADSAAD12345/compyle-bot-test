import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Venue } from './venue.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('time_slots')
@Index(['venueId'])
@Index(['slotDate'])
@Index(['isAvailable'])
@Unique(['venueId', 'slotDate', 'startTime'])
export class TimeSlot {
  @ApiProperty({
    description: 'Time slot unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Venue ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Column({ name: 'venue_id' })
  venueId: string;

  @ApiProperty({
    description: 'Date of the time slot',
    example: '2023-12-25',
  })
  @Column({ name: 'slot_date', type: 'date' })
  slotDate: Date;

  @ApiProperty({
    description: 'Start time of the slot',
    example: '14:00',
  })
  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot',
    example: '15:00',
  })
  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @ApiProperty({
    description: 'Price for this time slot',
    example: 50.00,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Whether slot is available for booking',
    example: true,
  })
  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Time slot creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Time slot last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Venue, (venue) => venue.timeSlots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @OneToMany(() => Booking, (booking) => booking.timeSlot)
  bookings: Booking[];
}