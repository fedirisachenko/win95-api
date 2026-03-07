import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../type/authenticated-socket';

export interface WsAction<T = any> {
    event: string;
    invoke(client: AuthenticatedSocket, payload: T, server: Server): Promise<void>;
}
