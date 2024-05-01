import { User } from '@travel-booking-platform/types';
import { NextFunction, Request, Response } from 'express';
import { defineAbilitiesFor } from '../abilities';
import { JwtService } from '@nestjs/jwt';
export const AbilitiesMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
      const user = jwtService.verify(token.replace('Bearer ', ''));
      console.log(user);
      if (user) {
        const abilities = defineAbilitiesFor(user);
        req['abilities'] = abilities;
      }
    } catch (error) {
      console.log(error);
    }
  }
  next();
};
