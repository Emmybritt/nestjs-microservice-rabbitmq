import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { HelperClassService, UserService } from '@travel-booking-platform/nest';
import { CreateUser, LoginUser } from '@travel-booking-platform/types';

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
      throw new ForbiddenException('Incorrect email or password');
    }
    const token = await this.generateTokens(user);
    console.log(token, 'This is the token');
    return this.userService
      .update({ email: user.email }, { refreshToken: token.refreshToken })
      .then((user) => {
        const response = {
          user,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
        return response;
      });
  }

  async register(createUser: CreateUser) {
    return this.userService.create(createUser);
  }
}
