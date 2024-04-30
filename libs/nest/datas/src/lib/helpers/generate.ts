import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthUser, TOKEN_TYPE } from '@travel-booking-platform/types';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserModel } from '../schemas';

@Injectable()
export class HelperClassService {
  public readonly jwtService: JwtService = new JwtService();
  constructor(
    private jwtSecrete: string,
    private jwtExp: string,
    private refreshTokenSecrete: string,
    private refreshTokenExp: string
  ) {}

  async hashData(data: string) {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  }

  async compareHashedData(data: string, encrypted: string) {
    const match = await bcrypt.compare(data, encrypted);
    return match;
  }

  async generateTokens(user: AuthUser) {
    const tokenPayload: AuthUser = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      refreshToken: user.refreshToken,
      role: user.role,
      disabled: user.disabled,
      disabledAt: user.disabledAt,
    };
    const tokenize = plainToClass(UserModel, user);
    console.log(tokenize, 'This is tkennize');

    const token = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.jwtExp,
      secret: this.jwtSecrete,
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.refreshTokenExp,
      secret: this.refreshTokenSecrete,
    });

    console.log(token, 'This is token');

    const { email, firstName, lastName } = tokenize;

    const subject = user._id + '';
    const access_token = this.jwtService.sign(
      { ...tokenize, typ: 'Bearer' },
      { subject, secret: this.jwtSecrete }
    );
    const refresh_token = this.jwtService.sign(
      {
        email,
        firstName,
        lastName,
        typ: TOKEN_TYPE.refresh,
      },
      {
        expiresIn: this.refreshTokenExp,
        subject,
        secret: this.refreshTokenSecrete,
      }
    );
    return {
      accessToken: access_token,
      refreshToken: await this.hashData(refresh_token),
    };
  }

  async decodeJwt(refreshToken: string) {
    return this.jwtService.decode(refreshToken) as AuthUser;
  }

  async verifyJwt(token: string, type: 'refresh' | 'access') {
    await this.jwtService.verifyAsync(token, this.getTokenOptions(type));
  }

  private getTokenOptions(type: 'refresh' | 'access') {
    const options: JwtSignOptions = {};
    if (type === 'access') {
      options.secret = this.jwtSecrete;
      options.expiresIn = this.jwtExp;
    } else {
      options.secret = this.refreshTokenSecrete;
      options.expiresIn = this.refreshTokenExp;
    }
    return options;
  }
}
