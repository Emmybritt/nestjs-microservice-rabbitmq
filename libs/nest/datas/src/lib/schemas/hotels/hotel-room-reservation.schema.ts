import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  COLLECTIONS,
  HotelRoomReservation,
  RESOURCE,
} from '@travel-booking-platform/types';
import { Exclude, Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

@Schema({ collection: COLLECTIONS.hotelRoomReservations, timestamps: true })
export class HotelRoomReservationModel implements HotelRoomReservation {
  @Transform((v) => v.obj[v.key].toString())
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  _id: string;

  @Prop({
    type: String,
    required: true,
    default: RESOURCE.hotelRoomReservation,
    enum: [RESOURCE.hotelRoomReservation],
    immutable: true,
    select: true,
  })
  @ApiProperty({ type: String, enum: [RESOURCE.hotelRoomReservation] })
  resourceType: RESOURCE.hotelRoomReservation;

  @Prop({
    type: Types.ObjectId,
    required: true,
    trim: true,
    ref: COLLECTIONS.users,
  })
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  user: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    trim: true,
    ref: COLLECTIONS.hotelRooms,
  })
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  room: string;

  @Prop({
    type: Date,
    required: true,
    trim: true,
  })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: new Date(),
    description: 'the date the hotel reservation was made',
  })
  reservation_date: string | Date;

  @Prop({
    type: Date,
    required: true,
    trim: true,
  })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: new Date(),
    description: 'the date the user is going to check into the hotel',
  })
  check_in_date: string | Date;

  @Prop({
    type: Date,
    required: true,
    trim: true,
  })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: new Date(),
    description: 'the date the user is going to check out of hotel',
  })
  check_out_date: string | Date;

  @Prop({ type: Boolean, default: true })
  @ApiProperty({ type: Boolean, default: true })
  @IsBoolean()
  @IsOptional()
  is_confirmed: boolean;

  @ApiProperty({ type: Date })
  @IsOptional()
  updatedAt: string | boolean;

  @Exclude()
  __v: number;
}

export type HotelRoomReservationDocument = HotelRoomReservationModel & Document;
export const HotelRoomReservationSchema = SchemaFactory.createForClass(
  HotelRoomReservationModel
);
HotelRoomReservationSchema.plugin(mongoosePaginate);
