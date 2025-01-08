import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { Message, MessageSchema } from './demo.schema';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    DatabaseModule,
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
