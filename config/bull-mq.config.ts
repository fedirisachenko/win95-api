import { ConfigService } from '@nestjs/config';
import { SharedBullConfigurationFactory } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueOptions } from 'bullmq';

@Injectable()
export class BullMqConfigFactory implements SharedBullConfigurationFactory {
    constructor(private readonly configService: ConfigService) {}

    createSharedConfiguration(): QueueOptions {
        return {
            connection: {
                host: this.configService.get<string>('REDIS_HOST', 'localhost'),
                port: this.configService.get<number>('REDIS_PORT', 63791),
            },
        };
    }
}
