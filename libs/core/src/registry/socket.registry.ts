import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from '@libs/ws';

class NamespacedSocketRegistry {
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

@Injectable()
export class SocketRegistry {
    private readonly namespaces = new Map<string, NamespacedSocketRegistry>();

    of(namespace: string): NamespacedSocketRegistry {
        if (!this.namespaces.has(namespace)) {
            this.namespaces.set(namespace, new NamespacedSocketRegistry());
        }

        return this.namespaces.get(namespace);
    }
}
