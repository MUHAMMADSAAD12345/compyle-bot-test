import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sports')
@Index(['name'], { unique: true })
export class Sport {
  @ApiProperty({
    description: 'Sport unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Sport name',
    example: 'Football',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Sport icon emoji or symbol',
    example: '⚽',
  })
  @Column()
  icon: string;

  @ApiProperty({
    description: 'Whether sport is active for booking',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Sport creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}