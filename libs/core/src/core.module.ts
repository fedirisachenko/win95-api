import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import coreConfig from '@config/config.config';
import { Mapper } from './service/mapper';
import { Paginator } from './service/paginator';
import { SocketRegistry } from './registry/socket.registry';
import { WsServerRegistry } from './registry/ws-server.registry';

@Global()
@Module({})
export class CoreModule {
    static register(): DynamicModule {
        return {
            module: CoreModule,
            imports: [ConfigModule.forRoot(coreConfig)],
            providers: [Mapper, Paginator, SocketRegistry, WsServerRegistry],
            exports: [ConfigModule, Mapper, Paginator, SocketRegistry, WsServerRegistry],
        };
    }
}
