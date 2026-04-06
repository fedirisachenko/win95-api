import 'dotenv/config';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule } from '@libs/security';
import { RedisModule } from '@songkeys/nestjs-redis';
import mikroOrmConfig from '@config/mikro-orm.config';
import redisConfig from '@config/redis.config';
import matchmakingQueueConfig from '@config/matchmaking-queue.config';
import { amqpConfigProvider, AMQP_CONFIG, AmqpConfig } from '@config/amqp.config';
import { SearchModule } from './search/search.module';
import { MatchModule } from './match/match.module';
import { CHAT_SERVICE } from './constant/di-token.constant';
import { CHAT_QUEUE } from './constant/rmq.constant';

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
        ClientsModule.registerAsync([
            {
                name: CHAT_SERVICE,
                useFactory: (config: AmqpConfig) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: config.urls,
                        queue: CHAT_QUEUE,
                    },
                }),
                inject: [AMQP_CONFIG],
            },
        ]),
        SearchModule,
        MatchModule,
    ],
    providers: [amqpConfigProvider],
    exports: [ClientsModule],
})
export class MatchmakingModule {}
