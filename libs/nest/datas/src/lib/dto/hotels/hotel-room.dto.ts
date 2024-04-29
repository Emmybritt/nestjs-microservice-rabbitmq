import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { HotelRoomModel } from '../../schemas';
import {
  CreateHotelRoom,
  FindManyHotelRoom,
  ROOM_TYPE,
  UpdateHotelRoom,
} from '@travel-booking-platform/types';
import { PaginatedResponseDto, FindManyDto } from '../misc';

export class CreateHotelRoomDto
  extends OmitType(HotelRoomModel, [
    '__v',
    '_id',
    'resourceType',
    'updatedAt',
    'creator',
  ])
  implements CreateHotelRoom {}

export class UpdateHotelRoomDto
  extends PartialType(OmitType(CreateHotelRoomDto, ['hotel']))
  implements UpdateHotelRoom {}

export class HotelRoomResponseDto extends PaginatedResponseDto<HotelRoomModel> {
  @ApiProperty({ type: [HotelRoomModel] })
  docs: HotelRoomModel[];
}

export class FindManyHotelRoomDto
  extends FindManyDto
  implements FindManyHotelRoom
{
  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], example: [new Types.ObjectId()] })
  _id: string[];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], example: [new Types.ObjectId()] })
  hotel: string[];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsString({ each: true })
  @IsIn(Object.values(ROOM_TYPE), { each: true })
  @ApiProperty({ type: [String], example: [ROOM_TYPE.double] })
  room_type: ROOM_TYPE[];
}
