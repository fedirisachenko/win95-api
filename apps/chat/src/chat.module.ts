import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule } from '@libs/security';
import mikroOrmConfig from '@config/mikro-orm.config';
import { amqpConfigProvider, AMQP_CONFIG, AmqpConfig } from '@config/amqp.config';
import { ConversationModule } from './conversation/conversation.module';
import { ManagementModule } from './management/management.module';
import { MATCHMAKING_SERVICE } from './constant/di-token.constant';
import { MATCHMAKING_QUEUE } from './constant/rmq.constant';

@Module({
    imports: [
        OrmModule.register(mikroOrmConfig),
        CoreModule.register(),
        SecurityModule.forRoot(),
        ClientsModule.registerAsync([
            {
                name: MATCHMAKING_SERVICE,
                useFactory: (config: AmqpConfig) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: config.urls,
                        queue: MATCHMAKING_QUEUE,
                    },
                }),
                inject: [AMQP_CONFIG],
            },
        ]),
        ConversationModule,
        ManagementModule,
    ],
    providers: [amqpConfigProvider],
    exports: [ClientsModule],
})
export class ChatModule {}
