import { Controller, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('force-failover')
  async forceFailover() {
    // This is just for testing/demo purposes
    try {
      // await this.primaryConnection.close();
      return { message: 'Forced failover initiated' };
    } catch (error) {
      return { message: 'Failed to force failover', error: error.message };
    }
  }
}