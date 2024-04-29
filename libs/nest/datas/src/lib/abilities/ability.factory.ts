import { Injectable } from '@nestjs/common';
import { AuthUser } from '@travel-booking-platform/types';
import { defineAbilitiesFor } from './ability-definition';

@Injectable()
export class AbilityFactory {
  createForUser(user: AuthUser) {
    return defineAbilitiesFor(user);
  }
}
