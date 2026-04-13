import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientExchangeRmq } from './transport/client-exchange-rmq';
import { RmqService } from './service/rmq.service';
import { RMQ_CLIENT, RMQ_OPTIONS } from './constant/di-token.constant';
import { RmqModuleAsyncOptions, RmqModuleOptions } from './interface/rmq-module-options.interface';

@Global()
@Module({})
export class RmqModule {
    static forRootAsync(asyncOptions: RmqModuleAsyncOptions): DynamicModule {
        return {
            module: RmqModule,
            providers: [
                {
                    provide: RMQ_OPTIONS,
                    useFactory: asyncOptions.useFactory,
                    inject: asyncOptions.inject ?? [],
                },
                {
                    provide: RMQ_CLIENT,
                    useFactory: (options: RmqModuleOptions) => {
                        return new ClientExchangeRmq({
                            urls: options.urls,
                            exchange: options.exchange ?? 'win95',
                            exchangeType: options.exchangeType ?? 'direct',
                        });
                    },
                    inject: [RMQ_OPTIONS],
                },
                RmqService,
            ],
            exports: [RmqService, RMQ_CLIENT],
        };
    }
}
