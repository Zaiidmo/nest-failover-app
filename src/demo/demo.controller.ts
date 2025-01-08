// messages.controller.ts
import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Message } from './demo.schema';

@Controller('messages')
export class DemoController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post()
  async createMessage(@Body('text') text: string): Promise<Message> {
    return await this.dbService.createMessage(text);
  }

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return await this.dbService.getAllMessages();
  }

  @Get('instance')
  async getCurrentInstance(): Promise<{ instance: string }> {
    const instance = await this.dbService.getCurrentInstance();
    return { instance };
  }

  @Post('force-failover')
  async forceFailover() {
    return await this.dbService.forcePrimaryFailure();
  }
}