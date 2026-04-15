import { Logger } from '@nestjs/common';
import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export abstract class AbstractProcessor<TData = unknown, TResult = unknown> extends WorkerHost {
    protected readonly logger = new Logger(this.constructor.name);

    abstract process(job: Job<TData>): Promise<TResult>;

    @OnWorkerEvent('error')
    protected onError(error: Error): void {
        this.logger.error('Worker error', error.stack);
    }

    @OnWorkerEvent('failed')
    protected onFailed(job: Job, error: Error): void {
        this.logger.error(`Job ${job.id} failed`, error.stack);
    }
}
