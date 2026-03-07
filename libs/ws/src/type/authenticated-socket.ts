import { Socket } from 'socket.io';
import { TokenPayload } from '@libs/security';

export type AuthenticatedSocket = Socket & {
    data: {
        user: TokenPayload;
    };
};
