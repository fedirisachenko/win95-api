import { ServerRMQ } from '@nestjs/microservices';
import { RmqOptions } from '@nestjs/microservices/interfaces';
import {
    RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
    RQM_DEFAULT_NOACK,
    RQM_DEFAULT_PREFETCH_COUNT,
} from '@nestjs/microservices/constants';
import { Channel } from 'amqp-connection-manager';
import { promisify } from 'node:util';
import { DEFAULT_WAITING_INTERVAL_MS, DEFAULT_WAITING_TIMEOUT_MS } from '../constant/rmq.constant';

const sleep = promisify(setTimeout);

export type GracefulRmqOptions = RmqOptions['options'] & {
    waitingEndingHandlersTimeoutMs?: number;
    waitingEndingHandlersIntervalMs?: number;
};

export class GracefulServerRMQ extends ServerRMQ {
    protected runningMessages = 0;
    protected closing = false;
    protected consumerTag: string | null = null;
    protected readonly waitingEndingHandlersTimeoutMs: number;
    protected readonly waitingEndingHandlersIntervalMs: number;

    constructor(protected readonly options: GracefulRmqOptions) {
        super(options);

        this.waitingEndingHandlersTimeoutMs = options.waitingEndingHandlersTimeoutMs ?? DEFAULT_WAITING_TIMEOUT_MS;
        this.waitingEndingHandlersIntervalMs = options.waitingEndingHandlersIntervalMs ?? DEFAULT_WAITING_INTERVAL_MS;
    }

    public async setupChannel(channel: Channel, callback: () => void) {
        if (this.closing) {
            return;
        }

        if (!this.queueOptions.noAssert) {
            await channel.assertQueue(this.queue, this.queueOptions);
        }

        const prefetchCount = this.getOptionsProp(this.options, 'prefetchCount', RQM_DEFAULT_PREFETCH_COUNT);
        const isGlobalPrefetchCount = this.getOptionsProp(
            this.options,
            'isGlobalPrefetchCount',
            RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
        );
        await channel.prefetch(prefetchCount, isGlobalPrefetchCount);

        const noAck = this.getOptionsProp(this.options, 'noAck', RQM_DEFAULT_NOACK);
        const { consumerTag } = await channel.consume(
            this.queue,
            (msg: Record<string, any>) => this.handleMessage(msg, channel),
            { noAck },
        );

        this.consumerTag = consumerTag;
        callback();
    }

    public async handleMessage(message: Record<string, any>, channel: Channel): Promise<void> {
        this.runningMessages++;
        return super.handleMessage(message, channel).finally(() => {
            this.runningMessages--;
        });
    }

    protected async waitingHandlers() {
        while (this.runningMessages > 0) {
            await sleep(this.waitingEndingHandlersIntervalMs);
        }
    }

    async close(): Promise<void> {
        this.closing = true;

        if (this.channel) {
            await this.channel.removeSetup(undefined, (channel: Channel) => channel.cancel(this.consumerTag));
        }
        this.consumerTag = null;

        await Promise.race([
            this.waitingHandlers(),
            this.waitingEndingHandlersTimeoutMs > 0 && sleep(this.waitingEndingHandlersTimeoutMs),
        ]);

        this.runningMessages = 0;
        await super.close();
    }
}
