import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

import { JWT_CONFIG } from '../constant/di-token.constant';
import { JwtConfig } from '../type/jwt-config.type';
import { TokenPayload } from '../type/token.type';

@Injectable()
export class WsSecurityGuard {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JWT_CONFIG) private readonly config: JwtConfig,
    ) {}

    authenticate(client: Socket): TokenPayload | null {
        const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

        if (!token) return null;

        try {
            const payload = this.jwtService.verify<TokenPayload>(token, {
                secret: this.config.accessSecret,
            });

            if (payload.type !== 'access') return null;

            return payload;
        } catch {
            return null;
        }
    }
}
