import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '@songkeys/nestjs-redis';
import { SocketRegistry } from '@libs/core';
import { RmqService } from '@libs/rmq';
import { WsNamespace } from '@libs/ws';
import { SearchSessionEntity, SearchMatchStatus } from '@libs/orm';
import { SearchAcceptInput } from '../dto/input/search-accept.input';
import { RedisKey } from '../../../../constant/redis-key.constant';
import { ACCEPT_TTL_SECONDS, CHAT_READY_TIMEOUT_SECONDS } from '../../../../constant/matchmaking.constant';
import { CHAT_READY_TIMEOUT_QUEUE } from '../../../../match/constant/queue.constant';
import { ChatReadyTimeoutJobData } from '../../../../match/dto/job-data/chat-ready-timeout.job-data';

@Injectable()
export class SearchAcceptUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly redis: RedisService,
        private readonly socketRegistry: SocketRegistry,
        private readonly rmq: RmqService,
        @InjectQueue(CHAT_READY_TIMEOUT_QUEUE) private readonly chatReadyTimeoutQueue: Queue,
    ) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SearchAcceptInput): Promise<void> {
        const searchSession = await this.orm.em.findOneOrFail(
            SearchSessionEntity,
            {
                id: data.searchId,
                user: { id: userId },
                searchMatch: { $ne: null },
            },
            { populate: ['searchMatch'] },
        );

        const searchMatch = searchSession.searchMatch.unwrap();

        if (searchMatch.status !== SearchMatchStatus.PENDING) {
            return;
        }

        const acceptKey = RedisKey.matchmakingAccept(searchMatch.id);

        const client = this.redis.getClient();
        const acceptedUserCount = await client.incr(acceptKey);

        if (acceptedUserCount < 2) {
            await client.expire(acceptKey, ACCEPT_TTL_SECONDS);
            this.socketRegistry.of(WsNamespace.MATCHMAKING_SEARCH).get(userId)?.emit('search:waiting', {});
            return;
        }

        const allSessions = await this.orm.em.find(
            SearchSessionEntity,
            { searchMatch: { id: searchMatch.id } },
            { populate: ['user'] },
        );

        searchMatch.status = SearchMatchStatus.ACCEPTED;
        await this.orm.em.flush();

        await client.del(acceptKey);

        const userIds = allSessions.map((s) => s.user.id);

        await this.rmq.emit('chat:create', {
            searchMatchId: searchMatch.id,
            userIds,
            duration: allSessions[0].desiredDuration,
        });

        const chatReadyTimeoutJobData: ChatReadyTimeoutJobData = {
            searchMatchId: searchMatch.id,
            userIds,
        };

        await this.chatReadyTimeoutQueue.add('chat-ready-timeout', chatReadyTimeoutJobData, {
            delay: CHAT_READY_TIMEOUT_SECONDS * 1000,
        });
    }
}
