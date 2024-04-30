import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class LoginAuthGuard extends AuthGuard('jwt') {
  protected readonly logger = new Logger(LoginAuthGuard.name);
  constructor(protected readonly reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req: Request = context.switchToHttp().getRequest();
    console.log(req.user, 'This is the request in LoginAuthGuards');

    if (isPublic) {
      this.logger.debug(`Granting access to public route: ${req.url}`);
      return true;
    }

    if (req.user) {
      this.logger.debug(`Granting access to session user: ${req.url}`);
      return true;
    }
    return super.canActivate(context);
  }
}
