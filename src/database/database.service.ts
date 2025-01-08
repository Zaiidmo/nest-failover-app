import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/demo/demo.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseService.name);
  private isFailoverMode = false;
  private lastSyncTime = new Date();

  constructor(
    @InjectModel(Message.name, 'primary') private primaryMessageModel: Model<Message>,
    @InjectModel(Message.name, 'secondary') private secondaryMessageModel: Model<Message>,
  ) {}

  async onApplicationBootstrap() {
    await this.initialSync();
    this.startPeriodicSync();
  }

  private async initialSync() {
    try {
      const primaryMessages = await this.primaryMessageModel.find().exec();
      
      for (const msg of primaryMessages) {
        await this.secondaryMessageModel.findOneAndUpdate(
          { _id: msg._id },
          { ...msg.toObject(), dbInstance: 'SECONDARY' },
          { upsert: true, new: true }
        );
      }
      this.logger.log('Initial sync completed');
    } catch (error) {
      this.logger.error(`Initial sync failed: ${error.message}`);
    }
  }

  @Interval(5000) // Sync every 5 seconds
  private async startPeriodicSync() {
    if (!this.isFailoverMode) {
      try {
        const newMessages = await this.primaryMessageModel
          .find({ timestamp: { $gt: this.lastSyncTime } })
          .exec();

        for (const msg of newMessages) {
          await this.secondaryMessageModel.findOneAndUpdate(
            { _id: msg._id },
            { ...msg.toObject(), dbInstance: 'SECONDARY' },
            { upsert: true, new: true }
          );
        }

        if (newMessages.length > 0) {
          this.logger.log(`Synced ${newMessages.length} new messages`);
          this.lastSyncTime = new Date();
        }
      } catch (error) {
        this.logger.error(`Sync failed: ${error.message}`);
      }
    }
  }

  async createMessage(text: string): Promise<Message> {
    const model = this.isFailoverMode ? this.secondaryMessageModel : this.primaryMessageModel;
    const instance = this.isFailoverMode ? 'SECONDARY' : 'PRIMARY';
    
    return await model.create({
      text,
      dbInstance: instance
    });
  }

  async getAllMessages(): Promise<Message[]> {
    const model = this.isFailoverMode ? this.secondaryMessageModel : this.primaryMessageModel;
    return await model.find().sort({ timestamp: -1 }).exec();
  }

  @Interval(3000) // Check health every 3 seconds
  async checkHealth() {
    try {
      if (this.isFailoverMode) {
        // Try to switch back to primary
        await this.primaryMessageModel.findOne();
        await this.switchToPrimary();
      } else {
        await this.primaryMessageModel.findOne();
      }
    } catch (error) {
      if (!this.isFailoverMode) {
        await this.switchToSecondary();
      }
    }
  }

  private async switchToPrimary() {
    this.isFailoverMode = false;
    this.logger.log('Switched to PRIMARY database');
  }

  private async switchToSecondary() {
    this.isFailoverMode = true;
    this.logger.log('Switched to SECONDARY database');
  }

  async getCurrentInstance(): Promise<string> {
    return this.isFailoverMode ? 'SECONDARY' : 'PRIMARY';
  }

  // For testing purposes
  async forcePrimaryFailure() {
    await this.switchToSecondary();
    return {
      status: 'failover_initiated',
      currentInstance: await this.getCurrentInstance()
    };
  }
}

