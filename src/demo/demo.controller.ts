import { Controller, Get, Post, Body } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private demoService: DemoService) {}

  @Post('message')
  async createMessage(@Body('text') text: string) {
    return this.demoService.createMessage(text);
  }

  @Get('messages')
  async getMessages() {
    return this.demoService.getMessages();
  }
}