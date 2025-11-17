import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Venue } from '../../venues/entities/venue.entity';
import { TimeSlot } from '../../venues/entities/time-slot.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
@Index(['playerId'])
@Index(['venueId'])
@Index(['timeSlotId'], { unique: true })
@Index(['status'])
@Index(['bookingTime'])
export class Booking {
  @ApiProperty({
    description: 'Booking unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Player user ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @Column({ name: 'player_id' })
  playerId: string;

  @ApiProperty({
    description: 'Venue ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Column({ name: 'venue_id' })
  venueId: string;

  @ApiProperty({
    description: 'Time slot ID',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @Column({ name: 'time_slot_id' })
  timeSlotId: string;

  @ApiProperty({
    description: 'Booking status',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  @Column({
    type: 'varchar',
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Total amount for booking',
    example: 50.00,
  })
  @Column({ name: 'total_amount', type: 'real' })
  totalAmount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({
    description: 'Booking creation timestamp',
    example: '2023-01-01T10:00:00.000Z',
  })
  @Column({ name: 'booking_time' })
  bookingTime: Date;

  @ApiProperty({
    description: 'Additional notes for booking',
    example: 'Please prepare equipment for 10 players',
    required: false,
  })
  @Column({ nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Booking creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Booking last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player_id' })
  player: User;

  @ManyToOne(() => Venue, (venue) => venue.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'time_slot_id' })
  timeSlot: TimeSlot;
}