import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@travel-booking-platform/types';
import { IsOptional, IsPostalCode, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: false })
export class AddressModel implements Address {
  @Prop({ type: String, required: false, trim: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Yaba' })
  city: string;

  @Prop({ type: String, required: false, trim: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Nigeria' })
  country: string;

  @Prop({ type: String, required: false, trim: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Lagos' })
  state?: string | undefined;

  @Prop({ type: String, required: false, trim: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: '54 afolabi brown akoka lagos' })
  street: string;

  @Prop({ type: String, required: false, trim: true })
  @IsString()
  @IsPostalCode()
  @IsOptional()
  @ApiProperty({ type: String, example: '10024' })
  zipcode?: string | undefined;
}

export type AddressDocument = AddressModel & Document;
export const AddressSchema = SchemaFactory.createForClass(AddressModel);
