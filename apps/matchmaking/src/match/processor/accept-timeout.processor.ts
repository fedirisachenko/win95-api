import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { RedisService } from '@songkeys/nestjs-redis';
import { AbstractProcessor, SocketRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { MatchEntity, MatchStatus, MatchRequestEntity, MatchRequestStatus } from '@libs/orm';
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
        const { matchId, userIds } = job.data;
        const client = this.redis.getClient();

        const acceptKey = RedisKey.matchmakingAccept(matchId);
        const acceptedUserCount = Number(await client.get(acceptKey)) || 0;

        if (acceptedUserCount >= 2) {
            return;
        }

        await client.del(acceptKey);

        const match = await this.orm.em.findOneOrFail(MatchEntity, { id: matchId });

        if (match.status === MatchStatus.PENDING) {
            match.status = MatchStatus.CANCELLED;
            await this.orm.em.flush();
        }

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
            this.socketRegistry.of(WsNamespace.MATCHMAKING_SEARCH).get(userId)?.emit('search:timeout', {});
        }
    }
}
