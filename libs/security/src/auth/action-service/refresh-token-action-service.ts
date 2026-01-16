import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../tokens/token.service';
import { TokenBlacklistService } from '../../tokens/token-blacklist.service';
import { RefreshTokenInput } from '../dto/input';
import { TokenPairOutput } from '../dto/output';

@Injectable()
export class RefreshTokenActionService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly tokenBlacklistService: TokenBlacklistService,
    ) {}

    async invoke(data: RefreshTokenInput): Promise<TokenPairOutput> {
        if (this.tokenBlacklistService.isBlacklisted(data.refreshToken)) {
            throw new UnauthorizedException('Token has been revoked');
        }

        const payload = await this.tokenService.verifyRefreshToken(data.refreshToken);

        if (!payload) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        this.tokenBlacklistService.add(data.refreshToken);

        return this.tokenService.generateTokenPair(payload.sub, payload.email);
    }
}