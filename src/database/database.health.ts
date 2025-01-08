import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthCheckError } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(
    @InjectConnection('primary') private primaryConnection: Connection,
    @InjectConnection('secondary') private secondaryConnection: Connection,
  ) {
    super();
  }

  async isHealthy(key: string) {
    try {
      await this.primaryConnection.db.admin().ping();
      return this.getStatus(key, true);
    } catch (err) {
      throw new HealthCheckError(
        'DatabaseHealthCheck failed',
        this.getStatus(key, false),
      );
    }
  }
}
