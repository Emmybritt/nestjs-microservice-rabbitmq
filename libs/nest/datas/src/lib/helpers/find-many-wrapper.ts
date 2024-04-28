/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@nestjs/common';
import { FindMany } from '@travel-booking-platform/types';
import {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';

const logger = new Logger('findManyWrapper');
export const findManyWrapper = <T>(
  model: PaginateModel<T>,
  condition: FilterQuery<T>,
  findMany: FindMany
): Promise<PaginateResult<T>> => {
  const { offset, sort, limit, page, select, lean } = findMany;

  const options: PaginateOptions = {};

  if (sort) {
    const sortPairs = Array.isArray(sort) ? sort : [sort];
    const sortObject: Record<string, number> = {};
    sortPairs.forEach((pair) => {
      const [key, value] = pair.split(',');
      sortObject[key] = Number(value);
    });
    options['sort'] = sortObject;
    options['collation'] = { locale: 'en' };
  }

  let populates = findMany.populate;
  if (populates && populates.length > 0) {
    const populatePaths: any = [];
    populates = Array.isArray(populates) ? populates : [populates];
    populates.forEach((populate) => {
      if (typeof populate === 'string') {
        if (populate.includes('.')) {
          const path = populate.substring(0, populate.indexOf('.'));
          const select = populate.substring(populate.indexOf('.') + 1);

          populatePaths.push({
            path,
            select: select.includes('.')
              ? select.substring(0, select.indexOf('.'))
              : select,
            populate: select.includes('.')
              ? {
                  path: select.substring(0, select.indexOf('.')),
                  select: select.substring(select.indexOf('.') + 1),
                }
              : { path: select },
          });
        } else {
          populatePaths.push({ path: populate });
        }
      } else populatePaths.push(populate);
    });
    options['populate'] = populatePaths;
  }

  if (offset) options.offset = offset;

  if (limit) options.limit = limit;

  if (page) options.page = page;
  if (select) options.select = select;
  if (lean) options.lean = lean;
  logger.debug({ condition, options });
  return model.paginate(condition, options);
};
