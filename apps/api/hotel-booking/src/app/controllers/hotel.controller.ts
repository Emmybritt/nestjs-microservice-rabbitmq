import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import {
  Ability,
  CaslAction,
  FindOneDto,
  Public,
  SessionUser,
} from '@travel-booking-platform/nest';
import { Action, AuthUser, RESOURCE } from '@travel-booking-platform/types';
import { HotelModel } from '../schemas/hotel.schema';
import {
  CreateHotelDto,
  FindManyHotelDto,
  HotelResponseDto,
  UpdateHotelDto,
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
  create(@Body() hotel: CreateHotelDto, @SessionUser() user: AuthUser) {
    return this.hotelService.create({ ...hotel, creator: user._id });
  }

  @Get(':id')
  @CaslAction(Action.view, RESOURCE.hotels)
  @ApiOkResponse({ type: HotelModel })
  findOne(
    @Param('id') _id: string,
    @Ability() ability: AnyMongoAbility,
    @Query() query: FindOneDto
  ) {
    return this.hotelService.findOne({ _id }, query, ability);
  }

  @Patch(':id')
  @CaslAction(Action.update, RESOURCE.hotels)
  async updateHotel(
    @Param('id') _id: string,
    @Body() hotel: UpdateHotelDto,
    @Ability() ability: AnyMongoAbility
  ) {
    return this.hotelService.updateOne({ _id }, hotel, ability);
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
