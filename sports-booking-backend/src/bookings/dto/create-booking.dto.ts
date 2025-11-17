import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDate,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
  Max,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Time slot ID to book',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsUUID()
  @IsDefined()
  timeSlotId: string;

  @ApiPropertyOptional({
    description: 'Additional booking notes',
    example: 'Please prepare equipment for 10 players',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Custom duration in hours (if different from slot duration)',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  @Min(0.5)
  @Max(8)
  customDurationHours?: number;

  @ApiPropertyOptional({
    description: 'Number of players expected',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(50)
  playerCount?: number;

  @ApiPropertyOptional({
    description: 'Special requirements for the booking',
    example: 'Need additional parking for team bus',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  specialRequirements?: string;
}