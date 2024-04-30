import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  HelperClassService,
  UserModel,
  UserService,
} from '@travel-booking-platform/nest';
import {
  CreateUser,
  LoginUser,
  TOKEN_TYPE,
  TokenResponse,
  User,
} from '@travel-booking-platform/types';
import { plainToClass } from 'class-transformer';
import { differenceInSeconds } from 'date-fns';

@Injectable()
export class AuthService extends HelperClassService {
  private logger = new Logger(AuthService.name);
  constructor(private userService: UserService) {
    super(process.env.JWT_SECRET, '7m', process.env.REFRESH_SECRET, '5d');
  }

  async login(loginUser: LoginUser) {
    const user = await this.userService.findOne({ email: loginUser.email });
    console.log(process.env.JWT_TOKEN);
    if (!user) {
      throw new ForbiddenException('Incorrect email or password');
    }

    const passwordMatch = await this.compareHashedData(
      loginUser.password,
      user.password
    );

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect email ors password');
    }
    return this.token(user);
  }

  async register(createUser: CreateUser) {
    return this.userService.create(createUser);
  }

  token(user: User): TokenResponse {
    const tokenize = plainToClass(UserModel, user);
    const { email, firstName } = tokenize;
    const subject = user._id + '';
    const access_token = this.jwtService.sign(
      { ...tokenize, typ: 'Bearer' },
      { subject, secret: process.env.JWT_SECRET }
    );
    const refresh_token = this.jwtService.sign(
      {
        email,
        firstName,
        typ: TOKEN_TYPE.refresh,
      },
      { expiresIn: '30d', subject, secret: process.env.REFRESH_SECRET }
    );
    const now = new Date();
    return {
      access_token,
      refresh_token,
      expires_in: differenceInSeconds(
        this.jwtService.decode(access_token)['exp'] * 1000,
        now
      ),
      refresh_expires_in: differenceInSeconds(
        this.jwtService.decode(refresh_token)['exp'] * 1000,
        now
      ),
      not_before_policy: 0,
      token_type: TOKEN_TYPE.bearer,
    } as any;
  }
}
