import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '@libs/ws';

@Injectable()
export class SocketRegistry {
    private readonly map = new Map<string, AuthenticatedSocket>();

    set(userId: string, socket: AuthenticatedSocket) {
        this.map.set(userId, socket);
    }

    get(userId: string): AuthenticatedSocket | undefined {
        return this.map.get(userId);
    }

    remove(userId: string) {
        this.map.delete(userId);
    }
}
