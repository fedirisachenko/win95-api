import { Injectable, Logger } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core';
import { NestContainer } from '@nestjs/core/injector/container';
import { RmqContext } from '@nestjs/microservices';
import {
    PATTERN_METADATA,
    RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
    RQM_DEFAULT_NOACK,
    RQM_DEFAULT_PREFETCH_COUNT,
} from '@nestjs/microservices/constants';
import { DEFAULT_EXCHANGE, DEFAULT_EXCHANGE_TYPE } from '../constant/rmq.constant';
import { GracefulRmqOptions, GracefulServerRMQ } from './graceful-server-rmq';

export interface ServerExchangeRmqOptions extends GracefulRmqOptions {
    exchange?: string;
    exchangeType?: string;
    exchangeOptions?: Record<string, any>;
}

@Injectable()
export class ServerExchangeRmq extends GracefulServerRMQ {
    private readonly log: Logger;
    private readonly exchange: string;
    private readonly exchangeType: string;
    private readonly exchangeOptions: Record<string, any>;
    private readonly container: NestContainer;

    constructor(application: any, options: ServerExchangeRmqOptions) {
        const exchange = options.exchange ?? DEFAULT_EXCHANGE;
        const prefixedQueue = `${exchange}_${options.queue}`;

        super({ ...options, queue: prefixedQueue });

        this.container = application.container;
        this.log = new Logger(`${ServerExchangeRmq.name}|${prefixedQueue}`);
        this.exchange = exchange;
        this.exchangeType = options.exchangeType ?? DEFAULT_EXCHANGE_TYPE;
        this.exchangeOptions = options.exchangeOptions ?? {};
    }

    async setupChannel(channel: any, callback: () => void) {
        if (this.closing) {
            return;
        }

        const patterns = this.scanPatterns();
        const noAck = this.getOptionsProp(this.options, 'noAck', RQM_DEFAULT_NOACK);

        await channel.assertExchange(this.exchange, this.exchangeType, this.exchangeOptions);
        const result = await channel.assertQueue(this.queue, {
            exclusive: false,
            ...this.exchangeOptions.queueOptions,
        });

        if (this.exchangeType === 'direct' || this.exchangeType === 'topic') {
            for (const pattern of patterns) {
                this.log.log(`Binding pattern: ${pattern}`);
                await channel.bindQueue(result.queue, this.exchange, pattern);
            }
        } else {
            await channel.bindQueue(result.queue, this.exchange, '');
        }

        const prefetchCount = this.getOptionsProp(this.options, 'prefetchCount', RQM_DEFAULT_PREFETCH_COUNT);
        const isGlobalPrefetchCount = this.getOptionsProp(
            this.options,
            'isGlobalPrefetchCount',
            RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
        );
        await channel.prefetch(prefetchCount, isGlobalPrefetchCount);
        const { consumerTag } = await channel.consume(result.queue, (msg: any) => this.handleMessage(msg, channel), {
            noAck,
        });

        this.consumerTag = consumerTag;
        callback();
    }

    private scanPatterns(): string[] {
        const modules = this.container.getModules();
        const metadataScanner = new MetadataScanner();
        const patterns: string[] = [];

        modules.forEach(({ controllers }) =>
            controllers.forEach((wrapper) => {
                const { instance } = wrapper;
                const prototype = Object.getPrototypeOf(instance);
                const methodNames = metadataScanner.getAllMethodNames(prototype);

                for (const methodKey of methodNames) {
                    const targetCallback = prototype[methodKey];
                    const pattern = Reflect.getMetadata(PATTERN_METADATA, targetCallback);
                    if (pattern) {
                        patterns.push(...pattern);
                    }
                }
            }),
        );

        return patterns;
    }

    sendMessage<T = any>(_message: T, _replyTo: any, _correlationId: string, _context: RmqContext) {
        throw new Error('Exchange does not support request-response pattern.');
    }
}
