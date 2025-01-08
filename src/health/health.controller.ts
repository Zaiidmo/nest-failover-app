import { Controller, Get, Post } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
    private databaseService: DatabaseService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongooseHealth.pingCheck('mongodb'),
    ]);
  }

  @Post('force-failover')
  async forceFailover() {
    await this.databaseService.forcePrimaryFailure();
    return { message: 'Failover initiated' };
  }
}