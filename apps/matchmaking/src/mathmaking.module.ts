import 'dotenv/config';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule } from '@libs/security';
import { RedisModule } from '@songkeys/nestjs-redis';
import mikroOrmConfig from '@config/mikro-orm.config';
import redisConfig from '@config/redis.config';
import matchmakingQueueConfig from '@config/matchmaking-queue.config';
import { SearchModule } from './search/search.module';
import { MatchModule } from './match/match.module';

@Module({
    imports: [
        OrmModule.register(mikroOrmConfig),
        CoreModule.register(),
        SecurityModule.forRoot(),
        RedisModule.forRoot(redisConfig),
        BullModule.forRoot(matchmakingQueueConfig),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter,
        }),
        SearchModule,
        MatchModule,
    ],
})
export class MatchmakingModule {}
