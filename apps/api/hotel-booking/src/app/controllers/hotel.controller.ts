import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HotelService } from '../services/hotel.service';
import { Ability, CaslAction, Public } from '@travel-booking-platform/nest';
import { Action, RESOURCE } from '@travel-booking-platform/types';
import { HotelModel } from '../schemas/hotel.schema';
import {
  CreateHotelDto,
  FindManyHotelDto,
  HotelResponseDto,
} from '../dtos/hotels.dto';
import { AnyMongoAbility } from '@casl/ability';

@ApiTags('Hotel')
@ApiBearerAuth()
@Controller('hotel')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @Post()
  @CaslAction(Action.create, RESOURCE.hotels)
  @ApiCreatedResponse({ type: HotelModel })
  create(@Body() hotel: CreateHotelDto) {
    return this.hotelService.create(hotel);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: HotelResponseDto })
  findMany(@Query() query: FindManyHotelDto) {
    return this.hotelService.findMany(query);
  }

  @Delete(':hotel')
  @CaslAction(Action.delete, RESOURCE.hotels)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('hotel') hotel: string, @Ability() ability: AnyMongoAbility) {
    return this.hotelService.delete(hotel, ability);
  }
}
