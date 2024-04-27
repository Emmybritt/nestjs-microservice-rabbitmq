import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request } from 'express';
import {
  MongoDriverError,
  MongoError,
  MongoServerError,
  MongoSystemError,
} from 'mongodb';
import { Error } from 'mongoose';
@Catch(MongoServerError, Error, MongoError, MongoDriverError, MongoSystemError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest<Request>();
    const request = {
      param: Object.keys(req.params || {}).length ? req.params : undefined,
      body: Object.keys(req.body || {}).length ? req.body : undefined,
      query: Object.keys(req.query || {}).length ? req.query : undefined,
    };
    response.status(400).send({
      statusCode: 400,
      message: exception.message,
      request,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
