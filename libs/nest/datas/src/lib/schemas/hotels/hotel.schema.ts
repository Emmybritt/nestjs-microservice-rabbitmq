import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  Address,
  COLLECTIONS,
  Hotel,
  RESOURCE,
} from '@travel-booking-platform/types';
import { Exclude, Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { AddressModel, AddressSchema } from '../address.schema';

@Schema({ collection: COLLECTIONS.hotels, timestamps: true })
export class HotelModel implements Hotel {
  @Transform((v) => v.obj[v.key].toString())
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  _id: string;

  @Prop({
    type: String,
    required: true,
    default: RESOURCE.hotels,
    enum: [RESOURCE.hotels],
    immutable: true,
    select: true,
  })
  @ApiProperty({ type: String, enum: [RESOURCE.hotels] })
  resourceType: RESOURCE.hotels;

  @Prop({
    type: Types.ObjectId,
    required: true,
    trim: true,
    ref: COLLECTIONS.users,
  })
  @IsMongoId()
  @IsOptional()
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  creator: string;

  @Prop({ type: String, required: true, trim: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Marriot Hotel' })
  name: string;

  @Prop({ type: AddressSchema, required: false })
  @IsOptional()
  // @ValidateNested()
  // @Type(() => AddressModel)
  @ApiProperty({ type: AddressModel })
  address: Address;

  @ApiProperty({ type: Date })
  @IsOptional()
  createdAt: string | Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  updatedAt: string | Date;

  @Exclude()
  __v: number;
}

export type HotelDocument = HotelModel & Document;
export const HotelSchema = SchemaFactory.createForClass(HotelModel);
HotelSchema.plugin(mongoosePaginate);
