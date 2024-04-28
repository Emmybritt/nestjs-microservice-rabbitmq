import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  LoginUserDto,
  Public,
  RegisterUserDto,
} from '@travel-booking-platform/nest';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Public()
@Controller({
  path: 'auth',
  version: VERSION_NEUTRAL,
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registrationDto: RegisterUserDto) {
    return this.authService.register(registrationDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
