import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ModuleConfig } from '../module.config';
import { TOKEN_TYPE } from '@travel-booking-platform/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(config: ModuleConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: false,
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
    } as StrategyOptions);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: any, done: (arg0: null, arg1: any) => any) {
    if (payload.typ !== TOKEN_TYPE.bearer) throw new UnauthorizedException();
    return done(null, payload);
  }
}
