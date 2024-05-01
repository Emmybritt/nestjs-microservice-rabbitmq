// casl-ability.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABILITY_KEY, IS_PUBLIC_KEY } from '../decorators';
import { Action, RESOURCE, User } from '@travel-booking-platform/types';

@Injectable()
export class CaslAbilityGuard implements CanActivate {
  private readonly logger = new Logger(CaslAbilityGuard.name);
  constructor(readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.debug('canActivate Started');
    if (this.isPublic(context)) {
      this.logger.log('Granting access to public route');
      return true;
    }

    // Get the required action from the route metadata
    const { action, resource, validateRequest } =
      this.reflector.get<{
        action: Action;
        resource: RESOURCE;
        validateRequest?: 'body' | 'params' | 'query';
      }>(ABILITY_KEY, context.getHandler()) || {};
    if (!action) {
      // return false; // Disable access by defalut
    }
    // Get the user from the request object (assuming the user is attached after authentication)
    const req = context.switchToHttp().getRequest();

    // Define abilities for the user based on user's type
    const abilities = req.abilities;
    let access = false;
    const params = validateRequest ? req[validateRequest] : null;
    const subject = params ? { ...params, resourceType: resource } : resource;
    if (abilities) {
      // Check if the user has the required action for the current subject (resource)
      access = abilities.can(action, subject);
    }

    const user = req.user as User | undefined;
    const reqLog = {
      action,
      resource,
      url: req.url,
      userId: user?._id,
      userEmail: user?.email,
      role: user?.role,
    };
    if (access)
      this.logger.debug(`Access granted for user: ${user?._id}`, reqLog);
    else this.logger.error(`Access denied for user: ${user?._id}`, reqLog);
    return access;
  }

  isPublic(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
