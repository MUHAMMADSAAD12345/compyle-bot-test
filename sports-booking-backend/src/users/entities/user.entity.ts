import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Venue } from '../../venues/entities/venue.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export enum UserRole {
  PLAYER = 'player',
  OWNER = 'owner',
  ADMIN = 'admin',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password',
    example: '$2b$10$...',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'User phone number in E.164 format',
    example: '+1234567890',
    required: false,
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PLAYER,
  })
  @Column({
    type: 'varchar',
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Whether user account is active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'URL to user profile image',
    example: 'https://example.com/images/user-avatar.jpg',
    required: false,
  })
  @Column({ nullable: true })
  profileImageUrl: string;

  @ApiProperty({
    description: 'User account creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'User account last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Venue, (venue) => venue.owner)
  venues: Venue[];

  @OneToMany(() => Booking, (booking) => booking.player)
  bookings: Booking[];
}