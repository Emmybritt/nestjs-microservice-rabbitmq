import { ApiProperty } from '@nestjs/swagger';
import { PaginateResult } from '@travel-booking-platform/types';

export abstract class PaginatedResponseDto<T> implements PaginateResult<T> {
  abstract docs: T[];

  @ApiProperty({ type: Boolean, example: true })
  hasNextPage: boolean;
  @ApiProperty({ type: Boolean, example: true })
  hasPrevPage: boolean;
  @ApiProperty({ type: Number, example: 10 })
  limit: number;
  @ApiProperty({ type: Number, example: 3 })
  nextPage: number | null;
  @ApiProperty({ type: Number, example: 10 })
  offset: number;
  @ApiProperty({ type: Number, example: 2 })
  page: number;
  @ApiProperty({ type: Number, example: 2 })
  pagingCounter: number;
  @ApiProperty({ type: Number, example: 1 })
  prevPage: number | null;
  @ApiProperty({ type: Number, example: 200 })
  totalDocs: number;
  @ApiProperty({ type: Number, example: 20 })
  totalPages: number;
}
