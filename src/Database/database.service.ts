import { Injectable } from '@nestjs/common';
import { connect, Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  private activeConnection: Connection;
  private primaryUri = process.env.PRIMARY_DATABASE;
  private secondaryUri = process.env.SECONDARY_DATABASE;

  constructor() {
    this.connectToPrimary();
  }


  // Connect to the primary database
  async connectToPrimary() {
    try {
      const connection = await connect(this.primaryUri);
      this.activeConnection = connection.connection;
      console.log('Connected to primary database');
    } catch (error) {
      console.error('Error connecting to primary database', error);
      this.connectToSecondary();
    }
  }

    // Connect to the secondary database
  async connectToSecondary() {
    try {
      const connection = await connect(this.secondaryUri);
      this.activeConnection = connection.connection;
      console.log('Connected to secondary database');
    } catch (error) {
      console.error('Error connecting to secondary database', error);
      // setTimeout(() => this.connectToPrimary(), 5000);
    }
  }

  // Check the health of the active database connection

  async checkHealth() {
    if (this.activeConnection.readyState !== 1) {
      console.warn('Active Database is down. Attempting to reconnect...');
      await this.connectToPrimary();
    }
  }

  // Get the active database connection
  getConnection() {
    return this.activeConnection;
  }

  returnConnection() {
    return this.activeConnection;
  }
}
