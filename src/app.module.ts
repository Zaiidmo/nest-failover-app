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
      useFactory: async () => {
        // Try to get the primary URI, fall back to secondary if not available
        const primaryDbUri = process.env.PRIMARY_DATABASE;
        const secondaryDbUri = process.env.SECONDARY_DATABASE;
        const uri = primaryDbUri || secondaryDbUri;

        if (!uri) {
          throw new Error('No database connection string available');
        }

        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryWrites: true, // Enable write retries on failover
          w: 'majority', // Ensure write operations are acknowledged
        };
      },
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, DatabaseService, DatabaseHealthIndicator],
})
export class AppModule {}
