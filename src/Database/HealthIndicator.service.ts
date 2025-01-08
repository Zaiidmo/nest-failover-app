import { Injectable } from "@nestjs/common";
import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
import { DatabaseService } from "./database.service";


@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
    constructor(private readonly dbService: DatabaseService) {
        super();
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        const isHealthy = this.dbService.getConnection().readyState === 1;

        if(isHealthy) {
            return this.getStatus('database', true);
        }

        // Attempt reconnection if not healthy 
        await this.dbService.checkHealth();
        return this.getStatus('database', false)
    }
}