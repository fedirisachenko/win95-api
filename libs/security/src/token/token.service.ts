import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONFIG } from '../constant';
import { AuthConfig } from '../auth/interface/auth-config.interface';
import { TokenPair } from '../auth/interface/token-pair.interface';

export type TokenPayload = {
    sub: string;
    type: 'access' | 'refresh';
};

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    async generateTokenPair(userId: string): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId),
            this.generateRefreshToken(userId),
        ]);

        return { accessToken, refreshToken };
    }

    async generateAccessToken(userId: string): Promise<string> {
        const payload: TokenPayload = {
            sub: userId,
            type: 'access',
        };

        return this.jwtService.signAsync(payload, {
            secret: this.config.jwt.accessTokenSecret,
            expiresIn: this.config.jwt.accessTokenExpiresIn,
        });
    }

    async generateRefreshToken(userId: string): Promise<string> {
        const payload: TokenPayload = {
            sub: userId,
            type: 'refresh',
        };

        return this.jwtService.signAsync(payload, {
            secret: this.config.jwt.refreshTokenSecret,
            expiresIn: this.config.jwt.refreshTokenExpiresIn,
        });
    }

    async verifyAccessToken(token: string): Promise<TokenPayload | null> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
                secret: this.config.jwt.accessTokenSecret,
            });

            if (payload.type !== 'access') {
                return null;
            }

            return payload;
        } catch {
            return null;
        }
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
                secret: this.config.jwt.refreshTokenSecret,
            });

            if (payload.type !== 'refresh') {
                return null;
            }

            return payload;
        } catch {
            return null;
        }
    }

    async generateResetPasswordToken(userId: string, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email,
            type: 'reset_password',
        };

        return this.jwtService.signAsync(payload, {
            secret: this.config.jwt.accessTokenSecret,
            expiresIn: '1h',
        });
    }

    async verifyResetPasswordToken(token: string): Promise<{ sub: string; email: string } | null> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.jwt.accessTokenSecret,
            });

            if (payload.type !== 'reset_password') {
                return null;
            }

            return { sub: payload.sub, email: payload.email };
        } catch {
            return null;
        }
    }
}
