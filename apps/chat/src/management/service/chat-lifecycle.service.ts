import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MikroORM } from '@mikro-orm/core';
import { RmqService } from '@libs/rmq';
import { ChatEntity, ChatStatus } from '@libs/orm';
import { CHAT_FINALIZE_QUEUE } from '../constant/queue.constant';
import { FinalizeChatJobData } from '../dto/job-data/finalize-chat.job-data';

@Injectable()
export class ChatLifecycleService {
    constructor(
        @InjectQueue(CHAT_FINALIZE_QUEUE) private readonly finalizeQueue: Queue,
        private readonly orm: MikroORM,
        private readonly rmq: RmqService,
    ) {}

    async scheduleFinalization(chatId: string, durationSeconds: number): Promise<void> {
        const jobData: FinalizeChatJobData = { chatId };

        await this.finalizeQueue.add('finalize-chat', jobData, {
            delay: durationSeconds * 1000,
            jobId: chatId,
        });
    }

    async cancelFinalization(chatId: string): Promise<void> {
        const job = await this.finalizeQueue.getJob(chatId);
        if (job) {
            await job.remove();
        }
    }

    async finalize(input: { chatId: string; status: number }): Promise<void> {
        const { chatId, status } = input;

        const updated = await this.orm.em.nativeUpdate(
            ChatEntity,
            { id: chatId, status: ChatStatus.ACTIVE },
            { status, expiredAt: new Date() },
        );

        if (updated === 0) {
            return;
        }

        await this.rmq.emit('chat:expire', {
            chatId,
            reason: this.statusToReason(status),
        });
    }

    private statusToReason(status: number): string {
        const statusToReasonMap: Record<number, string> = {
            [ChatStatus.ACTIVE]: 'active',
            [ChatStatus.EXPIRED]: 'expired',
            [ChatStatus.CANCELLED]: 'cancelled',
        };
        return statusToReasonMap[status];
    }
}
