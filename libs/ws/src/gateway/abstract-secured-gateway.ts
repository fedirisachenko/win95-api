import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsSecurityGuard } from '@libs/security';
import { UnauthorizedException } from '@nestjs/common';

export abstract class AbstractSecuredGateway implements OnGatewayInit {
    protected abstract readonly guard: WsSecurityGuard;

    afterInit(server: Server): void {
        server.use((client: Socket & { data: any }, next) => {
            const user = this.guard.authenticate(client);
            if (!user) return next(new UnauthorizedException());
            client.data.user = user;
            next();
        });
    }
}
