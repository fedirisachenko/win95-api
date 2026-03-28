import { Injectable, Type, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsSecurityGuard, SecurityManager } from '@libs/security';
import { WsActionRegistry } from '../registry/ws-action.registry';
import { AuthenticatedSocket } from '../type/authenticated-socket';

export interface WsGatewayOptions {
    namespace: string;
    connectionPermission?: string;
    cors?: object;
}

export function createSecuredGateway(options: WsGatewayOptions): Type<any> {
    @WebSocketGateway({
        namespace: options.namespace,
        cors: options.cors ?? { origin: '*' },
    })
    @Injectable()
    class DynamicSecuredGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
        @WebSocketServer()
        private readonly server: Server;

        constructor(
            private readonly registry: WsActionRegistry,
            private readonly guard: WsSecurityGuard,
            private readonly securityManager: SecurityManager,
        ) {}

        afterInit(server: Server): void {
            server.use(async (client: Socket & { data: any }, next) => {
                const user = this.guard.authenticate(client);
                if (!user) return next(new UnauthorizedException());
                client.data.user = user;

                if (options.connectionPermission) {
                    const granted = await this.securityManager.isGranted(
                        options.connectionPermission,
                        user.sub,
                    );
                    if (!granted) return next(new ForbiddenException());
                }

                next();
            });
        }

        handleConnection(client: AuthenticatedSocket): void {
            client.onAny(async (event: string, data: unknown) => {
                const action = this.registry.get(event);

                if (!action) {
                    client.emit('error', { message: `Unknown event: ${event}` });
                    return;
                }

                try {
                    await action.invoke(client, data, this.server);
                } catch (err) {
                    client.emit('error', { message: err.message });
                }
            });
        }

        handleDisconnect(): void {}
    }

    return DynamicSecuredGateway;
}
