import { AuthenticatedSocket } from './authenticated-socket.type';

export interface WsActionGuard {
    canActivate(client: AuthenticatedSocket, payload: unknown): Promise<void>;
}
