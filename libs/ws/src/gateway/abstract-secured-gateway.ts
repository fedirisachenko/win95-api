import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsSecurityGuard, SecurityManager } from '@libs/security';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export abstract class AbstractSecuredGateway implements OnGatewayInit {
    protected abstract readonly guard: WsSecurityGuard;
    protected abstract readonly securityManager: SecurityManager;

    protected connectionPermission?: string;

    afterInit(server: Server): void {
        server.use(async (client: Socket & { data: any }, next) => {
            const user = this.guard.authenticate(client);
            if (!user) return next(new UnauthorizedException());
            client.data.user = user;

            if (this.connectionPermission) {
                const granted = await this.securityManager.isGranted(this.connectionPermission, user.sub);
                if (!granted) return next(new ForbiddenException());
            }

            next();
        });
    }
}
