/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrapNestApp } from '@travel-booking-platform/nest';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

bootstrapNestApp<typeof AppModule>(AppModule, environment, true);
