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
import { HotelRoomService } from '../services/hotel-room.service';
import {
  Ability,
  CaslAction,
  FindOneDto,
  Public,
  SessionUser,
} from '@travel-booking-platform/nest';
import { Action, AuthUser, RESOURCE } from '@travel-booking-platform/types';
import {
  CreateHotelRoomDto,
  FindManyHotelRoomDto,
  HotelRoomResponseDto,
  UpdateHotelRoomDto,
} from '../dtos/hotel-room.dto';
import { HotelRoomModel } from '../schemas/hotel-room.schema';
import { AnyMongoAbility } from '@casl/ability';

@ApiTags('HotelRoom')
@ApiBearerAuth()
@Controller('hotel/room')
export class HotelRoomController {
  constructor(private hotelRoomService: HotelRoomService) {}

  @Post()
  @CaslAction(Action.create, RESOURCE.hotelRoom)
  @ApiCreatedResponse({ type: HotelRoomModel })
  create(@Body() hotelRoom: CreateHotelRoomDto, @SessionUser() user: AuthUser) {
    return this.hotelRoomService.create({ ...hotelRoom, creator: user._id });
  }

  @Get(':id')
  @CaslAction(Action.view, RESOURCE.hotelRoom)
  @ApiOkResponse({ type: HotelRoomModel })
  findOne(
    @Param('id') _id: string,
    @Ability() ability: AnyMongoAbility,
    @Query() query: FindOneDto
  ) {
    return this.hotelRoomService.findOne({ _id }, query, ability);
  }

  @Patch(':id')
  @Public()
  @CaslAction(Action.update, RESOURCE.hotelRoom)
  async updateHotelRoom(
    @Param('id') _id: string,
    @Body() hotelRoom: UpdateHotelRoomDto,
    @Ability() ability: AnyMongoAbility
  ) {
    return this.hotelRoomService.update({ _id }, hotelRoom, ability);
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: HotelRoomResponseDto })
  findMany(@Query() query: FindManyHotelRoomDto) {
    return this.hotelRoomService.findMany(query);
  }

  @Delete(':room')
  @CaslAction(Action.delete, RESOURCE.hotelRoom)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('room') room: string, @Ability() ability: AnyMongoAbility) {
    return this.hotelRoomService.delete(room, ability);
  }
}
