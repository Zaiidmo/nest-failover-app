import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseService } from './Database/database.service';
import { HealthController } from './Health/health.controller';
import { DatabaseHealthIndicator } from './Health/HealthIndicator.service';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.PRIMARY_DATABASE, // Primary Database URI
        connectionName: 'primary', //Connection Alias
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.SECONDARY_DATABASE, // Secondary Database URI
        connectionName: 'secondary',// Connection Alias
      }),
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, DatabaseService,DatabaseHealthIndicator],
})
export class AppModule {}
