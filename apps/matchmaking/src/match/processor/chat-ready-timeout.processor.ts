import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { AbstractProcessor, SocketRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { ChatEntity, MatchEntity, MatchStatus, MatchRequestEntity, MatchRequestStatus } from '@libs/orm';
import { CHAT_READY_TIMEOUT_QUEUE } from '../constant/queue.constant';
import { ChatReadyTimeoutJobData } from '../dto/job-data/chat-ready-timeout.job-data';

@Processor(CHAT_READY_TIMEOUT_QUEUE)
@Injectable()
export class ChatReadyTimeoutProcessor extends AbstractProcessor<ChatReadyTimeoutJobData, void> {
    constructor(
        private readonly orm: MikroORM,
        private readonly socketRegistry: SocketRegistry,
    ) {
        super();
    }

    @CreateRequestContext()
    async process(job: Job<ChatReadyTimeoutJobData>): Promise<void> {
        const { matchId, userIds } = job.data;

        await this.orm.em.findOneOrFail(ChatEntity, {
            match: { id: matchId },
        });

        const match = await this.orm.em.findOneOrFail(MatchEntity, { id: matchId, status: MatchStatus.ACCEPTED });

        match.status = MatchStatus.CANCELLED;

        const matchRequests = await this.orm.em.find(MatchRequestEntity, {
            match: this.orm.em.getReference(MatchEntity, match.id),
        });

        await this.orm.em.transactional(async (em) => {
            matchRequests.forEach((request) => {
                request.status = MatchRequestStatus.CANCELLED;
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
}
