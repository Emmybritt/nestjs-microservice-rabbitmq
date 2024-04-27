import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../decorators';

@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
@Public()
@ApiTags('Health')
export class HelathController {
  constructor(
    private health: HealthCheckService,
    private disk: DiskHealthIndicator,
    private mongodb: MongooseHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  healthCheack() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.95,
        }),
      () => this.mongodb.pingCheck('mongodb'),
    ]);
  }
}
