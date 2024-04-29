import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  CreateHotel,
  UpdateHotel,
  FindManyHotel,
} from '@travel-booking-platform/types';

import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { HotelModel } from '../../schemas';
import { PaginatedResponseDto, FindManyDto } from '../misc';

export class CreateHotelDto
  extends OmitType(HotelModel, [
    '_id',
    '__v',
    'resourceType',
    'updatedAt',
    'creator',
  ])
  implements CreateHotel {}

export class UpdateHotelDto
  extends PartialType(CreateHotelDto)
  implements UpdateHotel {}

export class HotelResponseDto extends PaginatedResponseDto<HotelModel> {
  @ApiProperty({ type: [HotelModel] })
  docs: HotelModel[];
}

export class FindManyHotelDto extends FindManyDto implements FindManyHotel {
  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsMongoId({ each: true })
  @ApiProperty({ type: [Types.ObjectId], example: [new Types.ObjectId()] })
  _id: string[];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsString({ each: true })
  @ApiProperty({ type: [String], example: ['Marriot Hotel'] })
  name: string[];
}
