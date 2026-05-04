import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '@songkeys/nestjs-redis';
import { MATCH_ATTEMPT_QUEUE } from '../constant/queue.constant';
import { MatchAttemptJobData } from '../dto/job-data/match-attempt.job-data';
import { EnqueueInput } from '../type/mathmaking-service.type';
import { RedisKey } from '../../constant/redis-key.constant';

@Injectable()
export class MatchmakingService {
    constructor(
        private readonly redis: RedisService,
        @InjectQueue(MATCH_ATTEMPT_QUEUE) private readonly matchAttemptQueue: Queue,
    ) {}

    async enqueue(input: EnqueueInput) {
        const { userId, searchId, duration, language = 'en' } = input;

        const client = this.redis.getClient();

        const existing = await client.get(RedisKey.matchmakingUser(userId));
        if (existing) {
            return;
        }

        const key = RedisKey.matchAttemptQueue(duration, language);
        const now = Date.now();

        await client
            .multi()
            .zadd(key, now, userId)
            .set(
                RedisKey.matchmakingUser(userId),
                JSON.stringify({ searchId, language, duration }),
                // 'EX',
                // USER_TTL_SECONDS,
            )
            .exec();

        const matchAttemptJobData: MatchAttemptJobData = {
            duration,
            language,
        };

        await this.matchAttemptQueue.add('match-attempt', matchAttemptJobData, {
            jobId: `mm:${duration}:${language}`,
        });
    }

    async dequeue(userId: string) {
        const client = this.redis.getClient();

        const raw = await client.get(RedisKey.matchmakingUser(userId));
        if (!raw) return;

        const data = JSON.parse(raw);

        const key = RedisKey.matchAttemptQueue(data.duration, data.language);

        await client.multi().zrem(key, userId).del(RedisKey.matchmakingUser(userId)).exec();
    }
}
