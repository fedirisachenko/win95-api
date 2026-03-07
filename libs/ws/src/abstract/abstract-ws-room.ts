import { Server, Socket } from 'socket.io';

export abstract class AbstractWsRoom {
    protected abstract readonly prefix: string;

    name(id: string): string {
        return `${this.prefix}:${id}`;
    }

    join(client: Socket, id: string): void {
        client.join(this.name(id));
    }

    leave(client: Socket, id: string): void {
        client.leave(this.name(id));
    }

    emit(server: Server, id: string, event: string, data: unknown): void {
        server.to(this.name(id)).emit(event, data);
    }
}
