import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { TimeSlot } from './time-slot.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { VenueImage } from './venue-image.entity';

@Entity('venues')
@Index(['ownerId'])
@Index(['isActive'])
export class Venue {
  @ApiProperty({
    description: 'Venue unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Venue owner user ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Column({ name: 'owner_id' })
  ownerId: string;

  @ApiProperty({
    description: 'Venue name',
    example: 'Central Football Field',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Venue description',
    example: 'Professional football field with premium grass and lighting',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Venue address',
    example: '123 Sports Street, City, State 12345',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Venue latitude',
    example: 40.7128,
  })
  @Column({ type: 'real' })
  latitude: number;

  @ApiProperty({
    description: 'Venue longitude',
    example: -74.0060,
  })
  @Column({ type: 'real' })
  longitude: number;

  @ApiProperty({
    description: 'Base price per hour',
    example: 50.00,
  })
  @Column({ type: 'real' })
  pricePerHour: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({
    description: 'Venue amenities as JSON',
    example: ['parking', 'lighting', 'changing_rooms', 'showers'],
    type: [String],
  })
  @Column({ type: 'json' })
  amenities: string[];

  @ApiProperty({
    description: 'Venue opening time',
    example: '06:00',
  })
  @Column({ name: 'opening_time' })
  openingTime: string;

  @ApiProperty({
    description: 'Venue closing time',
    example: '22:00',
  })
  @Column({ name: 'closing_time' })
  closingTime: string;

  @ApiProperty({
    description: 'Whether venue is active for booking',
    example: true,
  })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Venue creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Venue last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.venues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.venue)
  timeSlots: TimeSlot[];

  @OneToMany(() => Booking, (booking) => booking.venue)
  bookings: Booking[];

  @OneToMany(() => VenueImage, (venueImage) => venueImage.venue)
  images: VenueImage[];
}