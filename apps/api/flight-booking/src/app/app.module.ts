import { Module } from '@nestjs/common';

import { FlightBookingService } from './services/flight-booking.service';
import { FlightBookingController } from './controllers/flight-booking.controller';

@Module({
  imports: [],
  controllers: [FlightBookingController],
  providers: [FlightBookingService],
})
export class AppModule {}
