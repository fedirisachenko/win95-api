import { Injectable } from '@nestjs/common';

import { TokenBlacklistService } from '@libs/security';

import { LogoutInput } from '../transport/http/dto/input/logout.input';

@Injectable()
export class LogoutActionService {
    constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

    async invoke(data: LogoutInput): Promise<void> {
        await this.tokenBlacklistService.add(data.refreshToken);
    }
}
