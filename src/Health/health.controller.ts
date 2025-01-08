import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './HealthIndicator.service';

@Controller('healt')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealthIndicator: DatabaseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([() => this.dbHealthIndicator.isHealthy()]);
  }
}
