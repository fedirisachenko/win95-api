import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { RedisService } from '@songkeys/nestjs-redis';
import { AbstractProcessor, SocketRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { SearchMatchEntity, SearchMatchStatus, SearchSessionEntity, SearchStatus } from '@libs/orm';
import { ACCEPT_TIMEOUT_QUEUE } from '../constant/queue.constant';
import { AcceptTimeoutJobData } from '../dto/job-data/accept-timeout.job-data';
import { RedisKey } from '../../constant/redis-key.constant';

@Processor(ACCEPT_TIMEOUT_QUEUE)
@Injectable()
export class AcceptTimeoutProcessor extends AbstractProcessor<AcceptTimeoutJobData, void> {
    constructor(
        private readonly orm: MikroORM,
        private readonly redis: RedisService,
        private readonly socketRegistry: SocketRegistry,
    ) {
        super();
    }

    @CreateRequestContext()
    async process(job: Job<AcceptTimeoutJobData>): Promise<void> {
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
}
