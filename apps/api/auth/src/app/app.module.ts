import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { LogsMiddleware, NestDataModule } from '@travel-booking-platform/nest';
import { environment } from '../environments/environment';
import { JobsModule } from './jobs/jobs.module';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JobsModule,
    MongooseModule.forRoot(environment.databaseURI),
    NestDataModule.forRoot(environment),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
