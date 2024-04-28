import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  CreateUser,
  FindManyUser,
  LoginUser,
  USER_ROLE,
  UpdateUser,
} from '@travel-booking-platform/types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserModel } from '../schemas/user.schema';
import { FindManyDto } from './misc';

export class RegisterUserDto
  extends PickType(UserModel, [
    'email',
    'firstName',
    'lastName',
    'middleName',
    'role',
  ])
  implements CreateUser
{
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'secretPassword', minimum: 3 })
  password: string;
}

export class LoginUserDto
  extends PickType(RegisterUserDto, ['email', 'password'])
  implements LoginUser {}

export class UpdateUserDto
  extends PartialType(UserModel)
  implements UpdateUser {}

export class FindManyUserDto extends FindManyDto implements FindManyUser {
  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String], required: false })
  _id: string[];

  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsEmail({}, { each: true })
  @ApiProperty({ type: [String], required: false })
  email: string[];

  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  firstName: string[];

  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  lastName: string[];

  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  middleName?: string[] | undefined;

  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsIn(Object.values(USER_ROLE), { each: true })
  @ApiProperty({ type: [String], required: false, enum: USER_ROLE })
  role: string[];

  @IsOptional()
  @Transform((v) =>
    typeof v.value === 'string' && v.value ? [v.value] : v.value
  )
  @IsBoolean({ each: true })
  @ApiProperty({ type: [String], required: false })
  disabled: boolean[];
}
