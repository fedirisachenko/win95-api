import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AMQP_CONFIG, AmqpConfig, amqpConfigProvider } from '@config/amqp.config';
import { CreateChatAction } from './transport/rmq/action/create-chat.action';
import { CreateChatUseCase } from './use-case/create-chat.use-case';
import { MATCHMAKING_SERVICE } from '../constant/di-token.constant';
import { MATCHMAKING_QUEUE } from '../constant/rmq.constant';

@Module({
    imports: [
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
                extraProviders: [amqpConfigProvider],
            },
        ]),
    ],
    controllers: [CreateChatAction],
    providers: [CreateChatUseCase],
})
export class ManagementModule {}
