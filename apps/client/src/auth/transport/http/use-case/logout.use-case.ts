import { Injectable } from '@nestjs/common';
import { TokenBlacklistService } from '@libs/security';
import { LogoutInput } from '../dto/input/logout.input';

@Injectable()
export class LogoutUseCase {
    constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

    async invoke(data: LogoutInput): Promise<void> {
        await this.tokenBlacklistService.add(data.refreshToken);
    }
}
