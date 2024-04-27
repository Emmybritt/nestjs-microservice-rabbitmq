import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '@travel-booking-platform/nest';

@ApiTags('Auth')
@ApiBearerAuth()
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  register(@Req() req, @Body() registerationDto: string) {
    return this.appService.getData();
  }
}
