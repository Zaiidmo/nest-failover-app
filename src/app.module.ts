import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
