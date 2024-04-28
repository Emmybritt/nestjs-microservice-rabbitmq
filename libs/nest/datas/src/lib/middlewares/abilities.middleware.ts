/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@travel-booking-platform/types';
import { NextFunction, Request, Response } from 'express';
import { defineAbilitiesFor } from '../abilities';

export const AbilitiesMiddleware = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const user: User = req.user as User; // Assuming the user is attached to the request object after authentication
  if (user) {
    const abilities = defineAbilitiesFor(user);
    req['abilities'] = abilities;
  }
  next();
};
