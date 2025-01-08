// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseService } from './database/database.service';
import { DemoController } from './demo/demo.controller';
import { Message, MessageSchema } from './demo/demo.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.PRIMARY_DATABASE_URI, {
      connectionName: 'primary',
    }),
    MongooseModule.forRoot(process.env.SECONDARY_DATABASE_URI, {
      connectionName: 'secondary',
    }),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema }
    ], 'primary'),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema }
    ], 'secondary'),
  ],
  controllers: [DemoController],
  providers: [DatabaseService],
})
export class AppModule {}