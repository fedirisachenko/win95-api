import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsSecurityGuard } from '@libs/security';
import { AbstractSecuredGateway, WsActionRegistry, AuthenticatedSocket } from '@libs/ws';

@WebSocketGateway({ namespace: '/chat/conversation', cors: { origin: '*' } })
@Injectable()
export class ChatGateway extends AbstractSecuredGateway {
    @WebSocketServer()
    private readonly server: Server;

    protected readonly guard: WsSecurityGuard;

    constructor(
        private readonly registry: WsActionRegistry,
        guard: WsSecurityGuard,
    ) {
        super();
        this.guard = guard;
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
