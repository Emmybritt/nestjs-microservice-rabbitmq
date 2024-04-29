import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { HotelRoomReservationModel } from '../../schemas';
import {
  CreateRoomHotelReservation,
  UpdateHotelReservation,
} from '@travel-booking-platform/types';
import { PaginatedResponseDto } from '../misc';

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

export class HotelRoomReservationResponseDto extends PaginatedResponseDto<HotelRoomReservationModel> {
  @ApiProperty({ type: [HotelRoomReservationModel] })
  docs: HotelRoomReservationModel[];
}
