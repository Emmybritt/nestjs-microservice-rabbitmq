import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
  CreateRoomHotelReservation,
  UpdateHotelReservation,
} from '../interfaces/hotel-room-reservation';
import { HotelRoomReservationModel } from '../schemas/hotel-room-reservation.schema';

export class CreateHotelRoomReservationDto
  extends PickType(HotelRoomReservationModel, [
    'room',
    'is_confirmed',
    'check_in_date',
  ])
  implements CreateRoomHotelReservation {}

export class UpdateHotelRoomReservationDto
  extends PartialType(
    OmitType(HotelRoomReservationModel, [
      '__v',
      '_id',
      'resourceType',
      'updatedAt',
    ])
  )
  implements UpdateHotelReservation {}
