import { Module } from '@nestjs/common';
import { WsModule, WsNamespace } from '@libs/ws';
import { Permissions } from '@libs/security';
import { SearchStartUseCase, SearchCancelUseCase, SearchAcceptUseCase } from './use-case';
import { SearchStartAction } from './transport/ws/action/search-start.action';
import { SearchCancelAction } from './transport/ws/action/search-cancel.action';
import { SearchAcceptAction } from './transport/ws/action/search-accept.action';
import { MatchModule } from '../match/match.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CHAT_SERVICE } from '../constant/di-token.constant';
import { AMQP_CONFIG, AmqpConfig, amqpConfigProvider } from '@config/amqp.config';
import { CHAT_QUEUE } from '../constant/rmq.constant';

const actions = [SearchStartAction, SearchCancelAction, SearchAcceptAction];
const useCases = [SearchStartUseCase, SearchCancelUseCase, SearchAcceptUseCase];

@Module({
    imports: [
        WsModule.forFeature({
            namespace: WsNamespace.MATCHMAKING_SEARCH,
            connectionPermission: Permissions.MATCHMAKING.SEARCH,
            actions,
            providers: [...useCases],
            imports: [
                MatchModule,
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
                        extraProviders: [amqpConfigProvider],
                    },
                ]),
            ],
        }),
    ],
})
export class SearchModule {}
