import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Venue } from './venue.entity';

@Entity('venue_images')
@Index(['venueId'])
@Index(['displayOrder'])
export class VenueImage {
  @ApiProperty({
    description: 'Image unique identifier',
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
    description: 'Image URL',
    example: 'https://example.com/images/venue-1.jpg',
  })
  @Column({ name: 'image_url' })
  imageUrl: string;

  @ApiProperty({
    description: 'Image caption or description',
    example: 'Main football field view',
    required: false,
  })
  @Column({ nullable: true })
  caption: string;

  @ApiProperty({
    description: 'Display order for images',
    example: 1,
  })
  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @ApiProperty({
    description: 'Whether this is the primary image',
    example: true,
  })
  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Image creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Venue, (venue) => venue.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;
}