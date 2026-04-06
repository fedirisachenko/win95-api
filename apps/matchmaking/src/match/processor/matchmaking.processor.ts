import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { MikroORM, CreateRequestContext, ref } from '@mikro-orm/core';
import { RedisService } from '@songkeys/nestjs-redis';
import { SocketRegistry } from '@libs/core';
import { SearchSessionEntity, SearchMatchEntity, SearchMatchStatus } from '@libs/orm';
import { WsNamespace } from '@libs/ws';
import { MatchmakingService } from '../service/matchmaking.service';
import { MATCHMAKING_QUEUE, ACCEPT_TIMEOUT_QUEUE } from '../constant/queue.constant';
import { ACCEPT_TIMEOUT_SECONDS } from '../../constant/matchmaking.constant';
import { AcceptTimeoutJobData } from './accept-timeout.processor';

export type MatchAttemptJobData = {
    duration: number;
    language: string;
};

@Processor(MATCHMAKING_QUEUE)
@Injectable()
export class MatchmakingProcessor extends WorkerHost {
    private readonly logger = new Logger(MatchmakingProcessor.name);

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

    async process(job: Job<MatchAttemptJobData>) {
        const { duration, language } = job.data;
        const client = this.redis.getClient();
        const key = `mm:queue:${duration}:${language}`;

        const MATCH_LUA = `
local users = redis.call('ZRANGE', KEYS[1], 0, 1)
if #users < 2 then return nil end
redis.call('ZREM', KEYS[1], users[1], users[2])
return users
`;

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

        const userKeys = userIds.map((userId) => `mm:user:${userId}`);
        const rawSearchData = await client.mget(...userKeys);

        await Promise.all(userIds.map((userId) => this.matchmakingService.dequeue(userId)));

        if (!rawSearchData.length) {
            return;
        }

        const parsedSearchData = rawSearchData.map((data) => JSON.parse(data));

        const searchSessions = await this.orm.em.find(
            SearchSessionEntity,
            { id: { $in: parsedSearchData.map((data) => data.searchId) } },
            { populate: ['user'] },
        );

        let searchMatchId: string;

        await this.orm.em.transactional(async (em) => {
            const searchMatch = em.create(SearchMatchEntity, { status: SearchMatchStatus.PENDING });
            searchMatchId = searchMatch.id;

            searchSessions.forEach((session) => {
                session.searchMatch = ref(searchMatch);
            });
            await em.flush();
        });

        const acceptTimeoutJobData: AcceptTimeoutJobData = {
            searchMatchId,
            userIds,
        };

        await this.acceptTimeoutQueue.add('accept-timeout', acceptTimeoutJobData, {
            delay: ACCEPT_TIMEOUT_SECONDS * 1000,
        });

        searchSessions.forEach((session) => {
            this.socketRegistry
                .of(WsNamespace.MATCHMAKING_SEARCH)
                .get(session.user.id)
                ?.emit('search:found', { searchId: session.id, acceptTime: ACCEPT_TIMEOUT_SECONDS });
        });
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
