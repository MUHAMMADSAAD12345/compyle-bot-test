import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsLatitude,
  IsLongitude,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVenueDto } from './create-venue.dto';

export class UpdateVenueDto {
  @ApiPropertyOptional({
    description: 'Venue name',
    example: 'Updated Football Field',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Venue description',
    example: 'Updated description for the venue',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Venue address',
    example: '456 New Sports Avenue, City, State 12345',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Venue latitude',
    example: 40.7589,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Venue longitude',
    example: -73.9851,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Base price per hour',
    example: 75.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerHour?: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Venue amenities',
    example: ['parking', 'lighting', 'changing_rooms', 'showers', 'equipment'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({
    description: 'Venue opening time',
    example: '05:00',
  })
  @IsOptional()
  @IsString()
  openingTime?: string;

  @ApiPropertyOptional({
    description: 'Venue closing time',
    example: '23:00',
  })
  @IsOptional()
  @IsString()
  closingTime?: string;

  @ApiPropertyOptional({
    description: 'Whether venue is active for booking',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sport types available at this venue',
    example: ['football', 'basketball'],
    type: [String],
  })
  @IsOptional()
  sportTypes?: string[];
}