import { Controller } from '@nestjs/common';
import { FlightBookingService } from '../services/flight-booking.service';

@Controller()
export class FlightBookingController {
  constructor(private flightBookingSvrc: FlightBookingService) {}
}
