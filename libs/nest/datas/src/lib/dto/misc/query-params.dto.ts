import { ApiProperty, PickType } from '@nestjs/swagger';
import { FindMany, FindOne } from '@travel-booking-platform/types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PopulateOptions } from 'mongoose';

export class FindManyDto implements FindMany {
  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  search?: string[];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  sort?: string[] = ['updatedAt,-1'];

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  populate?: Array<string | PopulateOptions> = [];

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ type: Number, minimum: 0, required: false })
  offset?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, required: false })
  limit?: number = 12;

  @IsOptional()
  @IsInt()
  @ApiProperty({ type: Number, default: 1, required: false })
  page?: number = 1;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  lean = true;

  @IsOptional()
  @Transform((v) => (typeof v.value === 'string' ? [v.value] : v.value))
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false })
  select?: string[];
}

export class FindOneDto
  extends PickType(FindManyDto, ['populate', 'select'])
  implements FindOne
{
  @IsOptional()
  @Transform((v) => v.obj[v.key] === 'true' || v.obj[v.key] === true)
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  lean = true;

  @IsOptional()
  @Transform((v) => v.obj[v.key] === 'true' || v.obj[v.key] === true)
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  increaseView?: boolean = false;
}
