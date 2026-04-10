import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '@songkeys/nestjs-redis';
import { BULLMQ_MATCHMAKING_QUEUE } from '../constant/queue.constant';
import { MatchAttemptJobData } from '../processor/matchmaking.processor';

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
        @InjectQueue(BULLMQ_MATCHMAKING_QUEUE) private readonly matchmakingQueue: Queue,
    ) {}

    private getQueueKey(duration: number, language: string = 'en') {
        return `mm:queue:${duration}:${language}`;
    }

    private getUserKey(userId: string) {
        return `mm:user:${userId}`;
    }

    async enqueue(input: EnqueueInput) {
        const { userId, searchId, duration, language = 'en' } = input;

        const client = this.redis.getClient();

        const existing = await client.get(this.getUserKey(userId));
        if (existing) {
            return;
        }

        const key = this.getQueueKey(duration, language);
        const now = Date.now();

        await client
            .multi()
            .zadd(key, now, userId)
            .set(this.getUserKey(userId), JSON.stringify({ searchId, language, duration }), 'EX', USER_TTL)
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

        const raw = await client.get(this.getUserKey(userId));
        if (!raw) return;

        const data = JSON.parse(raw);

        const key = this.getQueueKey(data.duration, data.language);

        await client.multi().zrem(key, userId).del(this.getUserKey(userId)).exec();
    }
}
