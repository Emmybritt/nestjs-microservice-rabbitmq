import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../services';
import { User } from '@travel-booking-platform/types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger(SessionSerializer.name);
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, { _id: user._id });
  }

  async deserializeUser(user: User, done: CallableFunction) {
    // if (user) return done(null, user);
    // return done(new UnauthorizedException());
    return await this.userService
      .findOne({ _id: user._id })
      .then((user) => {
        if (user.disabled) throw new UnauthorizedException('Account disabled');
        return done(null, user);
      })
      .catch((error) => done(null, null));
  }
}
