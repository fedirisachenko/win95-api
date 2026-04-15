import { Server } from 'socket.io';
import { AuthenticatedSocket } from './authenticated.socket';

export interface WsAction<T = any> {
    getEventName(): string;
    invoke(client: AuthenticatedSocket, payload: T, server: Server): Promise<void>;
}
