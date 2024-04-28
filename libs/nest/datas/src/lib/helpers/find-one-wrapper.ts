/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common';
import { FindOne } from '@travel-booking-platform/types';
import * as mongoose from 'mongoose';

export const findOneWrapper = <T>(
  query: any,
  findOne: FindOne = {},
  model: string
): Promise<T> => {
  const { select, session, lean } = findOne;
  select && query.select(select);
  query.session(session);

  let populates = findOne.populate;
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
    query.populate(populatePaths);
  }

  if (lean) {
    query.lean();
  }
  return query.exec().then((value: any) => {
    if (value) {
      return value;
    }
    throw new NotFoundException(model + ' not found');
  });
};

export const idOrCodeFilter = (value: string, code: string) => {
  const key = mongoose.Types.ObjectId.isValid(value) ? '_id' : code;
  return { [key]: value };
};

export const getIdInSlug = (_id: string) => {
  const index = _id.indexOf('_');
  return _id.substring(0, index > 0 ? index : _id.length);
};
