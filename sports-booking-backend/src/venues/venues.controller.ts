import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueQueryDto } from './dto/venue-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Venues')
@Controller('venues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new venue' })
  @ApiResponse({
    status: 201,
    description: 'Venue successfully created',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owners and admins can create venues',
  })
  async create(@Body() createVenueDto: CreateVenueDto, @Request() req) {
    const userId = req.user.userId;
    return this.venuesService.create(createVenueDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all venues with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of venues',
    schema: {
      type: 'object',
      properties: {
        venues: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: VenueQueryDto) {
    return this.venuesService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search venues by text query' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
  })
  async search(@Query('q') searchQuery: string, @Query() query: VenueQueryDto) {
    return this.venuesService.findAll({ ...query, search: searchQuery });
  }

  @Get('my-venues')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get venues owned by the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of owned venues',
  })
  async findMyVenues(@Request() req) {
    const userId = req.user.userId;
    return this.venuesService.getVenuesByOwner(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get venue by ID' })
  @ApiResponse({
    status: 200,
    description: 'Venue details',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  async findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Get(':id/timeslots')
  @ApiOperation({ summary: 'Get available time slots for a venue' })
  @ApiResponse({
    status: 200,
    description: 'List of available time slots',
  })
  async getTimeSlots(
    @Param('id') id: string,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
  ) {
    const fromDate = dateFrom ? new Date(dateFrom) : undefined;
    const toDate = dateTo ? new Date(dateTo) : undefined;
    return this.venuesService.getVenueTimeSlots(id, fromDate, toDate);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update venue details' })
  @ApiResponse({
    status: 200,
    description: 'Venue successfully updated',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only venue owners can update their venues',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.venuesService.update(id, updateVenueDto, userId);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete (deactivate) a venue' })
  @ApiResponse({
    status: 204,
    description: 'Venue successfully deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only venue owners can delete their venues',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue not found',
  })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.venuesService.remove(id, userId);
  }

  @Post(':id/images')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload venue images' })
  @ApiResponse({
    status: 201,
    description: 'Images successfully uploaded',
  })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { captions?: string[]; displayOrders?: number[] },
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const userId = req.user.userId;
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      // For now, we'll use a mock URL. In production, upload to cloud storage
      const imageUrl = `https://example.com/images/venue-${id}-${Date.now()}-${i}.jpg`;

      const image = await this.venuesService.uploadVenueImage(
        id,
        imageUrl,
        body?.captions?.[i],
        body?.displayOrders?.[i] ?? i,
      );

      uploadedImages.push(image);
    }

    return { images: uploadedImages };
  }

  @Delete(':id/images/:imageId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete venue image' })
  @ApiResponse({
    status: 204,
    description: 'Image successfully deleted',
  })
  async deleteImage(
    @Param('imageId') imageId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.venuesService.deleteVenueImage(imageId, userId);
  }
}