/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const request = {
      param: Object.keys(req.params || {}).length ? req.params : undefined,
      body: Object.keys(req.body || {}).length ? req.body : undefined,
      query: Object.keys(req.query || {}).length ? req.query : undefined,
    };
    let message: any = exception.getResponse();
    message = message['message'] || message['error'];
    response.status(status).send({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
      request,
      response: exception.getResponse(),
    });
  }
}
