import { BookingsService } from '../bookings/bookings.service';
export declare class BookingGateway {
    private readonly bookingsService;
    private readonly logger;
    private connectedClients;
    constructor(bookingsService: BookingsService);
    server: WebSocketServer;
    afterInit(server: WebSocketServer): void;
    handleConnection(client: ConnectedSocket, ...args: any[]): void;
    handleDisconnect(client: ConnectedSocket): void;
    handleBookingCreated(client: ConnectedSocket, payload: any): void;
    handleBookingUpdated(client: ConnectedSocket, payload: any): void;
    handleBookingCancelled(client: ConnectedSocket, payload: any): void;
    handleTimeSlotBooked(client: ConnectedSocket, payload: any): void;
    handleVenueUpdated(client: ConnectedSocket, payload: any): void;
    sendToUser(userId: string, event: string, data: any): void;
    broadcastToAll(event: string, data: any): void;
    getConnectedClientsCount(): number;
}
