import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AUTH_CONFIG } from '../constant/di-token.constant';
import { AuthConfig } from '../auth/interface/auth-config.interface';
import { TokenPayload } from '../token/token.service';

@Injectable()
export class WsSecurityGuard {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    authenticate(client: Socket): TokenPayload | null {
        const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.split(' ')[1];

        if (!token) return null;

        try {
            const payload = this.jwtService.verify<TokenPayload>(token, {
                secret: this.config.jwt.accessTokenSecret,
            });

            if (payload.type !== 'access') return null;

            return payload;
        } catch {
            return null;
        }
    }
}
