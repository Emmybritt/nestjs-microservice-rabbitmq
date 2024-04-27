// action.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AppActionType, RESOURCE } from '@travel-booking-platform/types';
export const ABILITY_KEY = 'ABILITY_KEY';

export const CaslAction = (
  action: AppActionType,
  resource: RESOURCE,
  validateRequest?: 'body' | 'params' | 'query'
) => SetMetadata(ABILITY_KEY, { action, resource, validateRequest });
