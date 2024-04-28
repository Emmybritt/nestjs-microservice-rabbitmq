import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  COLLECTIONS,
  RESOURCE,
  USER_ROLE,
  User,
} from '@travel-booking-platform/types';
import { Exclude, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({ collection: COLLECTIONS.users, timestamps: true })
export class UserModel implements User {
  @Transform((v) => v.obj[v.key].toString())
  @ApiProperty({ type: String, example: new Types.ObjectId() })
  _id: string;

  @Prop({
    type: String,
    required: true,
    default: RESOURCE.users,
    enum: [RESOURCE.users],
    immutable: true,
    select: true,
  })
  @ApiProperty({ type: String, enum: [RESOURCE.users] })
  resourceType: RESOURCE.users;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: 3,
    immutable: true,
  })
  @IsEmail()
  @ApiProperty({ type: String, example: 'beritogwu@gmail.com', minimum: 3 })
  email: string;

  @Prop({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: String, example: true })
  emailVerified?: boolean | undefined;

  @Prop({ type: String, required: true, trim: true })
  @IsString()
  @ApiProperty({ type: String, example: 'John' })
  firstName: string;

  @Prop({ type: String, required: false, trim: true })
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'Smith' })
  middleName?: string;

  @Prop({ type: String, required: true, trim: true })
  @IsString()
  @ApiProperty({ type: String, example: 'Deo' })
  lastName: string;

  @Prop({ type: Date })
  @IsOptional()
  @IsDate()
  @ApiProperty({ type: Date, example: '1234-56' })
  lastLogin?: string | Date | undefined;

  @Prop({ type: Date })
  @ApiProperty({ type: Date })
  @IsOptional()
  disabledAt: string | Date;

  @ApiProperty({ type: Boolean, default: false })
  @IsOptional()
  disabled: boolean;

  @Prop({
    type: String,
    required: false,
    trim: true,
    minlength: 8,
    select: false,
  })
  @IsNotEmpty()
  @IsString()
  @Exclude()
  @ApiProperty({ type: String, example: 'secretPassword', minimum: 3 })
  password: string;

  @Prop({
    type: String,
    enum: USER_ROLE,
    default: USER_ROLE.basic,
    required: true,
  })
  @IsOptional()
  @IsIn(Object.values(USER_ROLE))
  @ApiProperty({ type: String, enum: USER_ROLE, default: USER_ROLE.basic })
  role: USER_ROLE;

  @Prop({
    type: String,
    required: false,
    trim: true,
  })
  @IsOptional()
  @IsString()
  @Exclude()
  @ApiProperty({ type: String, example: 'refresh-token', minimum: 3 })
  refreshToken: string;

  @ApiProperty({ type: Date })
  @IsOptional()
  createdAt: string | Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  updatedAt: string | Date;

  @Exclude()
  __v: number;
}

export type UserDocument = UserModel & Document;
export const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.plugin(mongoosePaginate);
