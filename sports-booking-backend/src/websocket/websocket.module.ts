import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../bookings/bookings.module';
import { BookingGateway } from './websocket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
    BookingModule,
  ],
  providers: [BookingGateway],
})
export class WebsocketModule {}