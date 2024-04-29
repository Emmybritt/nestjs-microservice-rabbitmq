import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { HotelRoomModel } from '../schemas/hotel-room.schema';
import {
  CreateHotelRoom,
  FindManyHotelRoom,
  ROOM_TYPE,
  UpdateHotelRoom,
} from '../interfaces/hotel-room';
import { FindManyDto } from '@travel-booking-platform/nest';
import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateHotelRoomDto
  extends OmitType(HotelRoomModel, ['__v', '_id', 'resourceType', 'updatedAt'])
  implements CreateHotelRoom {}

export class UpdateHotelRoomDto
  extends PartialType(OmitType(CreateHotelRoomDto, ['hotel']))
  implements UpdateHotelRoom {}

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
