import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { RedisService } from '@songkeys/nestjs-redis';
import { SocketRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { SearchMatchEntity, SearchMatchStatus, SearchSessionEntity, SearchStatus } from '@libs/orm';
import { BULLMQ_ACCEPT_TIMEOUT_QUEUE } from '../constant/queue.constant';
import { RedisKey } from '../../constant/redis-key.constant';

export type AcceptTimeoutJobData = {
    searchMatchId: string;
    userIds: string[];
};

@Processor(BULLMQ_ACCEPT_TIMEOUT_QUEUE)
@Injectable()
export class AcceptTimeoutProcessor extends WorkerHost {
    private readonly logger = new Logger(AcceptTimeoutProcessor.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly redis: RedisService,
        private readonly socketRegistry: SocketRegistry,
    ) {
        super();
    }

    @CreateRequestContext()
    async process(job: Job<AcceptTimeoutJobData>) {
        const { searchMatchId, userIds } = job.data;
        const client = this.redis.getClient();

        const acceptKey = RedisKey.matchmakingAccept(searchMatchId);
        const acceptedUserCount = Number(await client.get(acceptKey)) || 0;

        if (acceptedUserCount >= 2) {
            return;
        }

        await client.del(acceptKey);

        const searchMatch = await this.orm.em.findOneOrFail(SearchMatchEntity, { id: searchMatchId });

        if (searchMatch.status === SearchMatchStatus.PENDING) {
            searchMatch.status = SearchMatchStatus.CANCELLED;
            await this.orm.em.flush();
        }

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
            this.socketRegistry.of(WsNamespace.MATCHMAKING_SEARCH).get(userId)?.emit('search:timeout', {});
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
