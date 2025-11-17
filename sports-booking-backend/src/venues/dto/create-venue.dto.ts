import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
  IsLatitude,
  IsLongitude,
  Min,
  MaxLength,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty({
    description: 'Venue name',
    example: 'Central Football Field',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Venue description',
    example: 'Professional football field with premium grass and lighting',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Venue address',
    example: '123 Sports Street, City, State 12345',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Venue latitude',
    example: 40.7128,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Venue longitude',
    example: -74.0060,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Base price per hour',
    example: 50.00,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  pricePerHour: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
    maxLength: 3,
  })
  @IsString()
  @MaxLength(3)
  currency: string;

  @ApiProperty({
    description: 'Venue amenities',
    example: ['parking', 'lighting', 'changing_rooms', 'showers'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  amenities: string[];

  @ApiProperty({
    description: 'Venue opening time',
    example: '06:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  openingTime: string;

  @ApiProperty({
    description: 'Venue closing time',
    example: '22:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  closingTime: string;

  @ApiPropertyOptional({
    description: 'Sport types available at this venue',
    example: ['football', 'basketball'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sportTypes?: string[];
}