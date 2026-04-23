import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AbstractProcessor } from '@libs/core';
import { ChatStatus } from '@libs/orm';
import { CHAT_FINALIZE_QUEUE } from '../constant/queue.constant';
import { FinalizeChatJobData } from '../dto/job-data/finalize-chat.job-data';
import { ChatLifecycleService } from '../service/chat-lifecycle.service';

@Processor(CHAT_FINALIZE_QUEUE)
@Injectable()
export class ChatFinalizeProcessor extends AbstractProcessor<FinalizeChatJobData, void> {
    constructor(
        private readonly orm: MikroORM,
        private readonly chatLifecycleService: ChatLifecycleService,
    ) {
        super();
    }

    @CreateRequestContext()
    async process(job: Job<FinalizeChatJobData>): Promise<void> {
        await this.chatLifecycleService.finalize({
            chatId: job.data.chatId,
            status: ChatStatus.EXPIRED,
        });
    }
}
