import { DynamicModule, Module } from '@nestjs/common';
import { WsAction } from './type/ws-action.interface';
import { WsModuleOptions } from './type/ws-module.interface';
import { WsActionRegistry } from './registry/ws-action.registry';
import { createSecuredGateway } from './gateway/create-secured-gateway';

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
            imports: [...(options.imports ?? [])],
            providers: [
                GatewayClass,
                ...(options.actions ?? []),
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
