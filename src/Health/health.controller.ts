import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './HealthIndicator.service';
import { DatabaseService } from 'src/Database/database.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealthIndicator: DatabaseHealthIndicator,
    private databaseService: DatabaseService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.databaseService.getConnection() === null
      ? { database: { status: 'down' } }
      : { database: { status: 'up' } };
    // return this.health.check([() => this.dbHealthIndicator.isHealthy()]);
  }
}
