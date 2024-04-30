import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { environment } from '../../environments/environment';
import { UserService } from '@travel-booking-platform/nest';
import { TOKEN_TYPE } from '@travel-booking-platform/types';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: environment.jwt.secret,

      passReqToCallback: false,
      audience: environment.jwt.audience,
      issuer: environment.jwt.issuer,
    } as StrategyOptions);
  }
  async validate(payload: any, done) {
    if (payload.typ !== TOKEN_TYPE.refresh) throw new UnauthorizedException();
    const user = await this.userService.findOneById(payload.sub);
    return done(null, user);
  }
}
