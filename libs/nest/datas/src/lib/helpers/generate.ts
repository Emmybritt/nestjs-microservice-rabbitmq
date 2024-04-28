import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthUser } from '@travel-booking-platform/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HelperClassService {
  private readonly jwtService: JwtService = new JwtService();

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
    const token = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: process.env['ACCESS_TOKEN_EXPIRY'],
      secret: process.env['JWT_SECRET_KEY'],
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: process.env['REFRESH_TOKEN_EXPIRY'],
      secret: process.env['REFRESH_TOKEN_KEY'],
    });
    return {
      accessToken: token,
      refreshToken: await this.hashData(refreshToken),
    };
  }

  async decodeJwt(refreshToken: string) {
    return this.jwtService.decode(refreshToken) as AuthUser;
  }

  // async verifyJwt(token: string, type: 'refresh' | 'access') {
  //   await this.jwtService.verifyAsync(token, this.getTokenOptions(type));
  // }

  // private getTokenOptions(type: 'refresh' | 'access') {
  //   const options: JwtSignOptions = {};
  //   if (type === 'access') {
  //     options.secret = process.env['JWT_SECRET'];
  //     options.expiresIn = process.env['ACCESS_TOKEN_EXPIRY'];
  //   } else {
  //     options.secret = process.env['REFRESH_TOKEN_KEY'];
  //     options.expiresIn = process.env['REFRESH_TOKEN_EXPIRY'];
  //   }
  //   return options;
  // }
}
