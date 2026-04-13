import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '@songkeys/nestjs-redis';
import { MATCHMAKING_QUEUE } from '../constant/queue.constant';
import { MatchAttemptJobData } from '../processor/matchmaking.processor';
import { RedisKey } from '../../constant/redis-key.constant';

const USER_TTL = 300;

type EnqueueInput = {
    userId: string;
    searchId: string;
    duration: number;
    language?: string;
};

@Injectable()
export class MatchmakingService {
    constructor(
        private readonly redis: RedisService,
        @InjectQueue(MATCHMAKING_QUEUE) private readonly matchmakingQueue: Queue,
    ) {}

    async enqueue(input: EnqueueInput) {
        const { userId, searchId, duration, language = 'en' } = input;

        const client = this.redis.getClient();

        const existing = await client.get(RedisKey.matchmakingUser(userId));
        if (existing) {
            return;
        }

        const key = RedisKey.matchmakingQueue(duration, language);
        const now = Date.now();

        await client
            .multi()
            .zadd(key, now, userId)
            .set(RedisKey.matchmakingUser(userId), JSON.stringify({ searchId, language, duration }), 'EX', USER_TTL)
            .exec();

        const matchAttemptJobData: MatchAttemptJobData = {
            duration,
            language,
        };

        await this.matchmakingQueue.add('match-attempt', matchAttemptJobData, {
            jobId: `mm:${duration}:${language}`,
        });
    }

    async dequeue(userId: string) {
        const client = this.redis.getClient();

        const raw = await client.get(RedisKey.matchmakingUser(userId));
        if (!raw) return;

        const data = JSON.parse(raw);

        const key = RedisKey.matchmakingQueue(data.duration, data.language);

        await client.multi().zrem(key, userId).del(RedisKey.matchmakingUser(userId)).exec();
    }
}
