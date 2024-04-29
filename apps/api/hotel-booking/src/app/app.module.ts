import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { LogsMiddleware, NestDataModule } from '@travel-booking-platform/nest';
import { HotelService } from './services/hotel.service';
import { HotelRoomService } from './services/hotel-room.service';
import { HotelRoomReservationService } from './services/hotel-room-reservation.service';
import { COLLECTIONS } from '@travel-booking-platform/types';
import { HotelSchema } from './schemas/hotel.schema';
import { HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelRoomReservationSchema } from './schemas/hotel-room-reservation.schema';
import { HotelController } from './controllers/hotel.controller';
import { HotelRoomReservationController } from './controllers/hotel-room-reservation.controller';
import { HotelRoomController } from './controllers/hotel-room.controller';

@Module({
  imports: [
    MongooseModule.forRoot(environment.databaseURI),
    NestDataModule.forRoot(environment),
    MongooseModule.forFeature([
      { name: COLLECTIONS.hotels, schema: HotelSchema },
      { name: COLLECTIONS.hotelRooms, schema: HotelRoomSchema },
      {
        name: COLLECTIONS.hotelRoomReservations,
        schema: HotelRoomReservationSchema,
      },
    ]),
  ],
  controllers: [
    HotelController,
    HotelRoomReservationController,
    HotelRoomController,
  ],
  providers: [HotelService, HotelRoomService, HotelRoomReservationService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
