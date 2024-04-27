import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ObjectIdInterceptor implements NestInterceptor {
  isValidObjectId(
    query: Record<string, string | number>,
    params: Record<string, string | number>,
    field: string
  ) {
    if (
      (!!params[field] && !mongoose.isValidObjectId(params[field])) ||
      (!!query[field] && !mongoose.isValidObjectId(query[field]))
    ) {
      throw new BadRequestException(field + ' must be valid');
    }
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const { params, query } = context.switchToHttp().getRequest();
    const fields = [
      'id',
      'agencyID',
      'organisationID',
      'campusID',
      'programmeID',
    ];
    for (const field of fields) {
      this.isValidObjectId(query, params, field);
    }

    return next.handle();
  }
}
