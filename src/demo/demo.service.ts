import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './demo.schema';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DemoService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private databaseService: DatabaseService,
  ) {}

  async createMessage(text: string): Promise<Message> {
    const dbInstance = await this.databaseService.getCurrentDbInstance();
    return this.messageModel.create({
      text,
      dbInstance,
      timestamp: new Date(),
    });
  }

  async getMessages(): Promise<Message[]> {
    return this.messageModel.find().sort({ timestamp: -1 }).limit(10);
  }
}
