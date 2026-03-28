import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export interface AmqpConfig {
    urls: string[];
    exchange: string;
}

export const AMQP_CONFIG = Symbol('AMQP_CONFIG');

export const amqpConfigProvider: Provider = {
    provide: AMQP_CONFIG,
    useFactory: (configService: ConfigService): AmqpConfig => ({
        urls: configService.get<string>('AMQP_URLS', 'amqp://localhost:5672').split(','),
        exchange: configService.get<string>('AMQP_EXCHANGE_NAME', 'win95'),
    }),
    inject: [ConfigService],
};
