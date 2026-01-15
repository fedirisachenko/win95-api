import { ExecutionContext, Injectable } from '@nestjs/common';
import { Transport } from '../interface/transport.interface';

@Injectable()
export class WsTransport implements Transport {
    public readonly transport = 'ws';

    getTransportToken(): string {
        return this.transport;
    }

    extractToken(context: ExecutionContext): string | null {
        const client = context.switchToWs().getClient();
        return (client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1]) ?? null;
    }

    setUser(context: ExecutionContext, user: any): void {
        const client = context.switchToWs().getClient();
        client.user = user;
    }
}
