import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Transport } from '../interface/transport.interface';
import { AuthStrategy } from '../interface/auth-strategy.interface';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONFIG } from '../../constant/di-token.constant';
import { AuthConfig } from '../../auth/interface/auth-config.interface';

@Injectable()
export class JwtStrategy implements AuthStrategy {
    public readonly strategy = 'jwt';

    getStrategyToken(): string {
        return this.strategy;
    }

    constructor(
        private readonly jwtService: JwtService,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    async validate(context: ExecutionContext, transport: Transport): Promise<any | null> {
        const token = transport.extractToken(context);
        if (!token) return null;

        try {
            const payload = this.jwtService.verify(token, {
                secret: this.config.jwt.accessTokenSecret,
            });

            transport.setUser(context, payload);

            return payload;
        } catch {
            return null;
        }
    }
}
