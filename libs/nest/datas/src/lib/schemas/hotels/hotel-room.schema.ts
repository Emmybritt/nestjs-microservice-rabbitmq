import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  COLLECTIONS,
  HotelRoom,
  RESOURCE,
  ROOM_TYPE,
} from '@travel-booking-platform/types';
import { Exclude, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ collection: COLLECTIONS.hotelRooms, timestamps: true })
export class HotelRoomModel implements HotelRoom {
  @Transform((v) => v.obj[v.key].toString())
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  _id: string;

  @Prop({
    type: String,
    required: true,
    default: RESOURCE.hotelRoom,
    enum: [RESOURCE.hotelRoom],
    immutable: true,
    select: true,
  })
  @ApiProperty({ type: String, enum: [RESOURCE.hotelRoom] })
  resourceType: RESOURCE.hotelRoom;

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

  @Prop({
    type: Types.ObjectId,
    required: true,
    trim: true,
    ref: COLLECTIONS.hotels,
  })
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  hotel: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '404' })
  room_number: string;

  @Prop({ type: String, enum: Object.values(ROOM_TYPE), required: true })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(ROOM_TYPE))
  @ApiProperty({
    type: String,
    example: ROOM_TYPE.single,
    enum: Object.values(ROOM_TYPE),
  })
  room_type: ROOM_TYPE;

  @Prop({ type: Boolean, default: true })
  @ApiProperty({ type: Boolean, default: true })
  @IsBoolean()
  @IsOptional()
  is_available: boolean;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '10' })
  capacity: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  createdAt: string | Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  updatedAt: string | Date;

  @Exclude()
  __v: number;
}

export type HotelRoomDocument = HotelRoomModel & Document;
export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoomModel);
HotelRoomSchema.plugin(mongoosePaginate);
