import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HotelService } from '../services/hotel.service';

@ApiTags('Hotel')
@ApiBearerAuth()
@Controller('hotel')
export class HotelController {
  constructor(private hotelService: HotelService) {}
}
