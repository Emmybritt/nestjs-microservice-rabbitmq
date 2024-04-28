import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { HelperClassService, UserService } from '@travel-booking-platform/nest';
import { CreateUser, LoginUser } from '@travel-booking-platform/types';

@Injectable()
export class AuthService extends HelperClassService {
  private logger = new Logger(AuthService.name);
  constructor(private userService: UserService) {
    super();
  }

  async login(loginUser: LoginUser) {
    const user = await this.userService.findOne({ email: loginUser.email });
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
