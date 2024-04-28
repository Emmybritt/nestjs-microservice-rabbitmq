import { Module } from '@nestjs/common';
import { AuthJob } from './auth.job';

@Module({
  imports: [],
  exports: [],
  providers: [AuthJob],
})
export class JobsModule {}
