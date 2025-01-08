import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: 'primary',
      useFactory: () => ({
        uri: process.env.PRIMARY_DATABASE_URI,
      }),
    }),
    MongooseModule.forRootAsync({
      connectionName: 'secondary',
      useFactory: () => ({
        uri: process.env.SECONDARY_DATABASE_URI,
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}