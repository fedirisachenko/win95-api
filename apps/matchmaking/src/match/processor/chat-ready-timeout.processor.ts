import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { SocketRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { ChatEntity, SearchMatchEntity, SearchMatchStatus, SearchSessionEntity, SearchStatus } from '@libs/orm';
import { CHAT_READY_TIMEOUT_QUEUE } from '../constant/queue.constant';

export type ChatReadyTimeoutJobData = {
    searchMatchId: string;
    userIds: string[];
};

@Processor(CHAT_READY_TIMEOUT_QUEUE)
@Injectable()
export class ChatReadyTimeoutProcessor extends WorkerHost {
    private readonly logger = new Logger(ChatReadyTimeoutProcessor.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly socketRegistry: SocketRegistry,
    ) {
        super();
    }

    @CreateRequestContext()
    async process(job: Job<ChatReadyTimeoutJobData>) {
        const { searchMatchId, userIds } = job.data;

        const chat = await this.orm.em.findOne(ChatEntity, {
            searchMatch: { id: searchMatchId },
        });

        if (chat) {
            return;
        }

        const searchMatch = await this.orm.em.findOneOrFail(SearchMatchEntity, { id: searchMatchId });

        if (searchMatch.status !== SearchMatchStatus.ACCEPTED) {
            return;
        }

        searchMatch.status = SearchMatchStatus.CANCELLED;

        const searchSessions = await this.orm.em.find(SearchSessionEntity, {
            searchMatch: this.orm.em.getReference(SearchMatchEntity, searchMatch.id),
        });

        await this.orm.em.transactional(async (em) => {
            searchSessions.forEach((session) => {
                session.status = SearchStatus.CANCELLED;
            });

            await em.flush();
        });

        for (const userId of userIds) {
            this.socketRegistry
                .of(WsNamespace.MATCHMAKING_SEARCH)
                .get(userId)
                ?.emit('search:error', { message: 'Chat creation timeout' });
        }
    }

    @OnWorkerEvent('error')
    onError(error: Error) {
        this.logger.error('Worker error', error.stack);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`Job ${job.id} failed`, error.stack);
    }
}
