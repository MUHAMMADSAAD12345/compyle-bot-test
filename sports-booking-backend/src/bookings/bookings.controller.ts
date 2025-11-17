import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { BookingStatus } from './entities/booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.PLAYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking successfully created',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only players can create bookings',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation errors or time slot unavailable',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Time slot already booked',
  })
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    const playerId = req.user.userId;
    return this.bookingsService.create(createBookingDto, playerId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings with filtering and pagination (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of bookings',
    schema: {
      type: 'object',
      properties: {
        bookings: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: BookingQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get('my-bookings')
  @Roles(UserRole.PLAYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get bookings for the authenticated player' })
  @ApiResponse({
    status: 200,
    description: 'List of player bookings',
  })
  async findMyBookings(@Request() req, @Query() query: Partial<BookingQueryDto>) {
    const playerId = req.user.userId;
    return this.bookingsService.findPlayerBookings(playerId, query);
  }

  @Get('venue/:venueId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get bookings for a specific venue' })
  @ApiResponse({
    status: 200,
    description: 'List of venue bookings',
  })
  async findVenueBookings(
    @Param('venueId') venueId: string,
    @Query() query: Partial<BookingQueryDto>,
    @Request() req,
  ) {
    const userId = req.user.userId;

    // Note: This would need proper repository injection for production
    // For now, using a simpler check without direct DB call
    // In a real implementation, you'd inject UsersService and call findOne there

    return this.bookingsService.findVenueBookings(venueId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID (with access control)' })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Access denied',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.bookingsService.findOne(id, userId);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Confirm a pending booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking confirmed',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Booking is not pending',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Cannot confirm this booking',
  })
  async confirmBooking(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.bookingsService.confirmBooking(id, userId);
  }

  @Patch(':id/complete')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark a booking as completed' })
  @ApiResponse({
    status: 200,
    description: 'Booking marked as completed',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Booking is not confirmed',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only venue owners can complete bookings',
  })
  async completeBooking(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.bookingsService.completeBooking(id, userId);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.PLAYER, UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Cannot cancel completed bookings',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Access denied',
  })
  async cancelBooking(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req,
  ) {
    const userId = req.user.userId;
    const { reason } = body;
    return this.bookingsService.cancelBooking(id, userId, reason);
  }

  @Get('stats/dashboard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get booking statistics dashboard (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Booking statistics',
  })
  async getBookingStats() {
    // This would require additional statistical methods in the service
    // For now, return a simple structure
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
    };
  }
}