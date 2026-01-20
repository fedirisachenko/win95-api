import { ExecutionContext, Injectable } from '@nestjs/common';
import { Transport } from '../interface/transport.interface';

@Injectable()
export class HttpTransport implements Transport {
    public readonly transport = 'http';

    getTransportToken(): string {
        return this.transport;
    }

    extractToken(context: ExecutionContext): string | null {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        return authHeader?.split(' ')[1] ?? null;
    }

    setUser(context: ExecutionContext, user: any): void {
        const request = context.switchToHttp().getRequest();
        request.user = user;
    }
}
