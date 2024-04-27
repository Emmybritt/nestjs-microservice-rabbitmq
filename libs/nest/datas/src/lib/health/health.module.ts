import { Module } from '@nestjs/common';
import { HelathController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
@Module({
  controllers: [HelathController],
  imports: [TerminusModule],
})
export class HealthModule {}
