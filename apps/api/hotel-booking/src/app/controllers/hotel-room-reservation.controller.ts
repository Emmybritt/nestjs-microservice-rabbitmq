import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HotelRoomReservationService } from '../services/hotel-room-reservation.service';

@ApiTags('HotelRoomReservation')
@ApiBearerAuth()
@Controller('hotel/room/reservation')
export class HotelRoomReservationController {
  constructor(
    private hotelRoomReservationService: HotelRoomReservationService
  ) {}
}
