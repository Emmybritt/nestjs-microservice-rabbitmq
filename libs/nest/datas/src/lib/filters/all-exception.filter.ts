
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const message = exception.message;
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const request = {
      param: Object.keys(req.params || {}).length ? req.params : undefined,
      body: Object.keys(req.body || {}).length ? req.body : undefined,
      query: Object.keys(req.query || {}).length ? req.query : undefined,
    };
    res.status(statusCode).send({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
      request,
    });
  }
}
