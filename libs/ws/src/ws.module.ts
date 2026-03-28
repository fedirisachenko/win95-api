import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { WsAction } from './interface/ws-action.interface';
import { WsActionRegistry } from './registry/ws-action.registry';
import { createSecuredGateway } from './gateway/create-secured-gateway';

export interface WsModuleOptions {
    namespace: string;
    connectionPermission?: string;
    cors?: object;
    actions: Type<WsAction>[];
    providers?: Provider[];
}

@Module({})
export class WsModule {
    static forFeature(options: WsModuleOptions): DynamicModule {
        const GatewayClass = createSecuredGateway({
            namespace: options.namespace,
            connectionPermission: options.connectionPermission,
            cors: options.cors,
        });

        return {
            module: WsModule,
            providers: [
                GatewayClass,
                ...options.actions,
                ...(options.providers ?? []),
                {
                    provide: WsActionRegistry,
                    useFactory: (...acts: WsAction[]) => new WsActionRegistry(acts),
                    inject: options.actions,
                },
            ],
        };
    }
}
