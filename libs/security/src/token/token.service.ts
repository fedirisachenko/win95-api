import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG, JwtConfig } from '@config/jwt.config';
import { TokenPair } from '../interface/token-pair.interface';

export type TokenPayload = {
    sub: string;
    type: 'access' | 'refresh';
};

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(JWT_CONFIG) private readonly config: JwtConfig,
    ) {}

    async generateTokenPair(userId: string): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId),
            this.generateRefreshToken(userId),
        ]);

        return { accessToken, refreshToken };
    }

    async generateAccessToken(userId: string): Promise<string> {
        const payload: TokenPayload = { sub: userId, type: 'access' };

        return this.jwtService.signAsync(payload, {
            secret: this.config.accessSecret,
            expiresIn: this.config.accessExpiresIn,
        });
    }

    async generateRefreshToken(userId: string): Promise<string> {
        const payload: TokenPayload = { sub: userId, type: 'refresh' };

        return this.jwtService.signAsync(payload, {
            secret: this.config.refreshSecret,
            expiresIn: this.config.refreshExpiresIn,
        });
    }

    async verifyAccessToken(token: string): Promise<TokenPayload | null> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
                secret: this.config.accessSecret,
            });

            return payload.type === 'access' ? payload : null;
        } catch {
            return null;
        }
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
                secret: this.config.refreshSecret,
            });

            return payload.type === 'refresh' ? payload : null;
        } catch {
            return null;
        }
    }

    async generateResetPasswordToken(userId: string, email: string): Promise<string> {
        return this.jwtService.signAsync(
            { sub: userId, email, type: 'reset_password' },
            { secret: this.config.accessSecret, expiresIn: '1h' },
        );
    }

    async verifyResetPasswordToken(token: string): Promise<{ sub: string; email: string } | null> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.accessSecret,
            });

            if (payload.type !== 'reset_password') return null;

            return { sub: payload.sub, email: payload.email };
        } catch {
            return null;
        }
    }
}