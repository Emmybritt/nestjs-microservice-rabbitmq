import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { LogsMiddleware, NestDataModule } from '@travel-booking-platform/nest';
import { environment } from '../environments/environment';
import { JobsModule } from './jobs/jobs.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refrsh.strategy';

@Module({
  imports: [
    JobsModule,
    MongooseModule.forRoot(environment.databaseURI),
    NestDataModule.forRoot(environment),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, RefreshStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
