import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HotelRoomService } from '../services/hotel-room.service';

@ApiTags('HotelRoom')
@ApiBearerAuth()
@Controller('hotel/room')
export class HotelRoomController {
  constructor(private hotelRoomService: HotelRoomService) {}
}
