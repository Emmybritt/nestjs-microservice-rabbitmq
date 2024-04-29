import { AnyMongoAbility } from '@casl/ability';
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
import {
  Ability,
  CaslAction,
  FindOneDto,
  Public,
  SessionUser,
} from '@travel-booking-platform/nest';
import { Action, AuthUser, RESOURCE } from '@travel-booking-platform/types';
import {
  CreateHotelRoomReservationDto,
  HotelRoomReservationResponseDto,
  UpdateHotelRoomReservationDto,
} from '../dtos/hotel-room-reservation.dto';
import { FindManyHotelRoomReservations } from '../interfaces/hotel-room-reservation';
import { HotelRoomReservationModel } from '../schemas/hotel-room-reservation.schema';
import { HotelRoomReservationService } from '../services/hotel-room-reservation.service';

@ApiTags('HotelRoomReservation')
@ApiBearerAuth()
@Controller('room/booking')
export class HotelRoomReservationController {
  constructor(
    private hotelRoomReservationService: HotelRoomReservationService
  ) {}

  @Post()
  @CaslAction(Action.create, RESOURCE.hotelRoomReservation)
  @ApiCreatedResponse({ type: HotelRoomReservationModel })
  bookHotelRoom(
    @Body() hotelReservation: CreateHotelRoomReservationDto,
    @SessionUser() user: AuthUser
  ) {
    return this.hotelRoomReservationService.create({
      ...hotelReservation,
      user: user._id,
    });
  }

  @Get(':id')
  @CaslAction(Action.view, RESOURCE.hotelRoomReservation)
  @ApiOkResponse({ type: HotelRoomReservationModel })
  findOne(
    @Param('id') _id: string,
    @Ability() ability: AnyMongoAbility,
    @Query() query: FindOneDto
  ) {
    return this.hotelRoomReservationService.findOne({ _id }, query, ability);
  }

  @Patch(':id')
  @Public()
  @CaslAction(Action.update, RESOURCE.hotelRoom)
  async updateHotelRoom(
    @Param('id') _id: string,
    @Body() hotelRoomReservation: UpdateHotelRoomReservationDto,
    @Ability() ability: AnyMongoAbility
  ) {
    return this.hotelRoomReservationService.update(
      { _id },
      hotelRoomReservation,
      ability
    );
  }

  @Get()
  @Public()
  @ApiOkResponse({ type: HotelRoomReservationResponseDto })
  findMany(@Query() query: FindManyHotelRoomReservations) {
    return this.hotelRoomReservationService.findMany(query);
  }

  @Delete(':reservation')
  @CaslAction(Action.delete, RESOURCE.hotelRoom)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('reservation') reservation: string,
    @Ability() ability: AnyMongoAbility
  ) {
    return this.hotelRoomReservationService.delete(reservation, ability);
  }
}
