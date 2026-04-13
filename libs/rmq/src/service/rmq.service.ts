import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientExchangeRmq } from '../transport/client-exchange-rmq';
import { RMQ_CLIENT } from '../constant/di-token.constant';

@Injectable()
export class RmqService implements OnModuleInit {
    private readonly logger = new Logger(RmqService.name);

    constructor(
        @Inject(RMQ_CLIENT)
        private readonly client: ClientExchangeRmq,
    ) {}

    async onModuleInit() {
        await this.client.connect();
        this.logger.log('RMQ client connected');
    }

    async emit<T = any>(pattern: string, data: T): Promise<void> {
        await lastValueFrom(this.client.emit(pattern, data));
    }
}
