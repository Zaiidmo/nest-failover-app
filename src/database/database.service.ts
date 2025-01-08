import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as mongoose from 'mongoose';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private primaryUri = process.env.PRIMARY_DATABASE_URI;
  private secondaryUri = process.env.SECONDARY_DATABASE_URI;
  private currentUri: string;
  private isFailoverMode = false;

  constructor() {
    this.currentUri = this.primaryUri;
  }

  async getActiveConnectionString(): Promise<string> {
    return this.currentUri;
  }

  @Interval(30000)
  async checkDatabaseHealth() {
    try {
      const conn = await mongoose.createConnection(this.currentUri).asPromise();
      await conn.close();
      
      if (this.isFailoverMode && this.currentUri === this.secondaryUri) {
        await this.switchToPrimary();
      }
    } catch (error) {
      this.logger.error(`Database health check failed: ${error.message}`);
      await this.handleFailover();
    }
  }

  private async handleFailover() {
    if (!this.isFailoverMode) {
      this.logger.log('Initiating database failover...');
      await this.switchToSecondary();
    }
  }

  private async switchToPrimary() {
    try {
      const conn = await mongoose.createConnection(this.primaryUri).asPromise();
      await conn.close();

      this.currentUri = this.primaryUri;
      this.isFailoverMode = false;
      this.logger.log('Switched back to primary database');
    } catch (error) {
      this.logger.error('Failed to switch back to primary database');
    }
  }

  private async switchToSecondary() {
    try {
      const conn = await mongoose.createConnection(this.secondaryUri).asPromise();
      await conn.close();
      
      this.currentUri = this.secondaryUri;
      this.isFailoverMode = true;
      this.logger.log('Switched to secondary database');
    } catch (error) {
      this.logger.error('Failed to switch to secondary database');
    }
  }

  async getCurrentDbInstance(): Promise<string> {
    return this.isFailoverMode ? 'SECONDARY' : 'PRIMARY';
  }

  // Method to force failover 
  async forcePrimaryFailure() {
    this.logger.log('Forcing primary database failure...');
    
    // Store the real primary URI
    const realPrimaryUri = this.primaryUri;
    
    // Invalidate primary URI
    this.primaryUri = 'mongodb+srv://invalid-connection';
    
    // Immediately switch to secondary without waiting for health check
    this.logger.log('Forcing immediate switch to secondary...');
    await this.switchToSecondary();
    
    // Log current state
    this.logger.log(`Current URI: ${this.currentUri}`);
    this.logger.log(`Failover Mode: ${this.isFailoverMode}`);
    
    // Restore real URI after 1 minute
    setTimeout(async () => {
      this.primaryUri = realPrimaryUri;
      this.logger.log('Restored primary database connection string');
    }, 60000);

    return {
      status: 'failover_initiated',
      currentDatabase: await this.getCurrentDbInstance(),
      isFailoverMode: this.isFailoverMode
    };
  }
}
