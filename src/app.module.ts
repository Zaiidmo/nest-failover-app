import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { DemoModule } from './demo/demo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: async (databaseService: DatabaseService) => ({
        uri: await databaseService.getActiveConnectionString(),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [DatabaseService],
    }),
    HealthModule,
    DemoModule,
  ],
})
export class AppModule {}