import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ServerExchangeRmq, ServerExchangeRmqOptions } from '../transport/server-exchange-rmq';
import { RMQ_OPTIONS } from '../constant/rmq.constant';
import { RmqModuleOptions } from '../interface/rmq-module-options.interface';

export async function connectRmqConsumer(
    app: INestApplication,
    queue: string,
    extraOptions: Partial<ServerExchangeRmqOptions> = {},
): Promise<void> {
    const options = app.get<RmqModuleOptions>(RMQ_OPTIONS);

    app.connectMicroservice<MicroserviceOptions>({
        strategy: new ServerExchangeRmq(app, {
            urls: options.urls,
            queue,
            exchange: options.exchange ?? 'win95',
            exchangeType: options.exchangeType ?? 'direct',
            exchangeOptions: { durable: true },
            ...extraOptions,
        }),
    });

    await app.startAllMicroservices();
}
