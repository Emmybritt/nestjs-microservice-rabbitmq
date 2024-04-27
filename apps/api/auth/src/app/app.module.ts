import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestDataModule } from '@travel-booking-platform/nest';
import { environment } from '../environments/environment';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(environment.databaseURI),
    NestDataModule.forRoot(environment),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
