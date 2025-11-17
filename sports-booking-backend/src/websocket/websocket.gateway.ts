import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/entities/booking.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure based on your Flutter app domain in production
    credentials: true,
  },
})
export class BookingGateway {
  private readonly logger = new Logger('BookingGateway');
  private connectedClients: Map<string, ConnectedSocket> = new Map();

  constructor(private readonly bookingsService: BookingsService) {}

  @WebSocketServer()
  server: WebSocketServer;

  afterInit(server: WebSocketServer) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: ConnectedSocket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);

    // Send initial connection status
    client.emit('connection-established', {
      clientId: client.id,
      message: 'Connected to booking system',
      timestamp: new Date().toISOString(),
    });

    // Join user-specific room if they have a user ID
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user_${userId}`);
      this.logger.log(`Client ${client.id} joined room for user ${userId}`);
    }
  }

  handleDisconnect(client: ConnectedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);

    // Leave user-specific room
    const userId = client.handshake.query.userId;
    if (userId) {
      client.leave(`user_${userId}`);
      this.logger.log(`Client ${client.id} left room for user ${userId}`);
    }
  }

  @SubscribeMessage('booking_created')
  handleBookingCreated(client: ConnectedSocket, payload: any) {
    this.logger.log(`Booking created: ${JSON.stringify(payload)}`);

    // Broadcast to all connected clients (with filtering logic for permissions)
    this.server.emit('booking_update', {
      type: 'booking_created',
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('booking_updated')
  handleBookingUpdated(client: ConnectedSocket, payload: any) {
    this.logger.log(`Booking updated: ${JSON.stringify(payload)}`);

    // Broadcast booking status changes
    this.server.emit('booking_update', {
      type: 'booking_updated',
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('booking_cancelled')
  handleBookingCancelled(client: ConnectedSocket, payload: any) {
    this.logger.log(`Booking cancelled: ${JSON.stringify(payload)}`);

    // Handle booking cancellation - make time slot available again
    this.server.emit('booking_update', {
      type: 'booking_cancelled',
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('time_slot_booked')
  handleTimeSlotBooked(client: ConnectedSocket, payload: any) {
    this.logger.log(`Time slot booked: ${JSON.stringify(payload)}`);

    // Broadcast time slot availability changes
    this.server.emit('availability_update', {
      type: 'time_slot_booked',
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('venue_updated')
  handleVenueUpdated(client: ConnectedSocket, payload: any) {
    this.logger.log(`Venue updated: ${JSON.stringify(payload)}`);

    // Broadcast venue changes (owners might need to update availability)
    this.server.emit('venue_update', {
      type: 'venue_updated',
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to send updates to specific users (useful for targeted notifications)
  sendToUser(userId: string, event: string, data: any) {
    const userRoom = `user_${userId}`;
    this.server.to(userRoom).emit(event, data);
  }

  // Method to broadcast to all clients
  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Get connected clients count (useful for monitoring)
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}