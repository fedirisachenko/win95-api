import { Injectable } from '@nestjs/common';
import { Processor, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { MikroORM, CreateRequestContext, ref } from '@mikro-orm/core';
import { RedisService } from '@songkeys/nestjs-redis';
import { AbstractProcessor, SocketRegistry } from '@libs/core';
import { MatchRequestEntity, MatchEntity, MatchStatus } from '@libs/orm';
import { WsNamespace } from '@libs/ws';
import { MatchmakingService } from '../service/matchmaking.service';
import { MATCHMAKING_QUEUE, ACCEPT_TIMEOUT_QUEUE } from '../constant/queue.constant';
import { MATCH_LUA } from '../constant/lua.constant';
import { ACCEPT_TIMEOUT_SECONDS } from '../../constant/matchmaking.constant';
import { AcceptTimeoutJobData } from '../dto/job-data/accept-timeout.job-data';
import { MatchAttemptJobData } from '../dto/job-data/match-attempt.job-data';
import { RedisKey } from '../../constant/redis-key.constant';

@Processor(MATCHMAKING_QUEUE)
@Injectable()
export class MatchmakingProcessor extends AbstractProcessor<MatchAttemptJobData, void> {
    constructor(
        private readonly orm: MikroORM,
        private readonly redis: RedisService,
        private readonly socketRegistry: SocketRegistry,
        private readonly matchmakingService: MatchmakingService,
        @InjectQueue(MATCHMAKING_QUEUE) private readonly matchmakingQueue: Queue,
        @InjectQueue(ACCEPT_TIMEOUT_QUEUE) private readonly acceptTimeoutQueue: Queue,
    ) {
        super();
    }

    async process(job: Job<MatchAttemptJobData>): Promise<void> {
        const { duration, language } = job.data;
        const client = this.redis.getClient();
        const key = RedisKey.matchmakingQueue(duration, language);

        const result = await client.eval(MATCH_LUA, 1, key);

        if (result) {
            await this.onMatch(result as string[]);
        }

        const remaining = await client.zcard(key);

        const matchAttemptJobData: MatchAttemptJobData = {
            duration,
            language,
        };

        if (remaining >= 2) {
            await this.matchmakingQueue.add('match-attempt', matchAttemptJobData, {
                jobId: `mm:${duration}:${language}`,
                delay: 100,
            });
        }
    }

    @CreateRequestContext()
    private async onMatch(userIds: string[]) {
        const client = this.redis.getClient();

        const userKeys = userIds.map((userId) => RedisKey.matchmakingUser(userId));
        const rawSearchData = await client.mget(...userKeys);

        await Promise.all(userIds.map((userId) => this.matchmakingService.dequeue(userId)));

        if (!rawSearchData.length) {
            return;
        }

        const parsedSearchData = rawSearchData.map((data) => JSON.parse(data));

        const matchRequests = await this.orm.em.find(
            MatchRequestEntity,
            { id: { $in: parsedSearchData.map((data) => data.searchId) } },
            { populate: ['user'] },
        );

        let matchId: string;

        await this.orm.em.transactional(async (em) => {
            const match = em.create(MatchEntity, { status: MatchStatus.PENDING });
            matchId = match.id;

            matchRequests.forEach((request) => {
                request.match = ref(match);
            });
            await em.flush();
        });

        const acceptTimeoutJobData: AcceptTimeoutJobData = {
            matchId,
            userIds,
        };

        await this.acceptTimeoutQueue.add('accept-timeout', acceptTimeoutJobData, {
            delay: ACCEPT_TIMEOUT_SECONDS * 1000,
        });

        matchRequests.forEach((request) => {
            this.socketRegistry
                .of(WsNamespace.MATCHMAKING_SEARCH)
                .get(request.user.id)
                ?.emit('search:found', { searchId: request.id, acceptTime: ACCEPT_TIMEOUT_SECONDS });
        });
    }
}
