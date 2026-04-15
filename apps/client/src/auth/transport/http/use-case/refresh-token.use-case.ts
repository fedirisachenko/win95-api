import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService, TokenBlacklistService, TokenPair } from '@libs/security';
import { RefreshTokenInput } from '../dto';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        private readonly tokenService: TokenService,
        private readonly tokenBlacklistService: TokenBlacklistService,
    ) {}

    async invoke(data: RefreshTokenInput): Promise<TokenPair> {
        const payload = await this.tokenService.verifyRefreshToken(data.refreshToken);
        if (!payload) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(data.refreshToken);
        if (isBlacklisted) {
            throw new UnauthorizedException('Token has been revoked');
        }

        await this.tokenBlacklistService.add(data.refreshToken);

        return this.tokenService.generateTokenPair(payload.sub);
    }
}
