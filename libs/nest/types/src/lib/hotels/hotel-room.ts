import { ApiProperty } from '@nestjs/swagger';
import { FindManyDto } from '@travel-booking-platform/nest';
import { RESOURCE } from '@travel-booking-platform/types';
import { Transform } from 'class-transformer';
import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export enum ROOM_TYPE {
  single = 'SINGLE',
  double = 'DOUBLE',
  suite = 'SUITE',
}
export interface HotelRoom {
  _id: string;
  resourceType: RESOURCE.hotelRoom;
  creator: string;
  hotel: string;
  room_number: string;
  room_type: ROOM_TYPE;
  capacity: string;
  is_available: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CreateHotelRoom = Omit<
  HotelRoom,
  '_id' | 'resourceType' | 'createdAt' | 'updatedAt' | 'creator'
>;

export type UpdateHotelRoom = Partial<CreateHotelRoom>;

export class FindManyHotelRoom
  extends FindManyDto
  implements FindManyHotelRoom
{
  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsMongoId({ each: true })
  @ApiProperty({ type: [Types.ObjectId], example: [new Types.ObjectId()] })
  _id: string[];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsMongoId({ each: true })
  @ApiProperty({ type: [Types.ObjectId], example: [new Types.ObjectId()] })
  hotel: string[];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsIn(Object.values(ROOM_TYPE))
  @ApiProperty({ type: [String], example: [ROOM_TYPE.double] })
  room_type: ROOM_TYPE[];
}
