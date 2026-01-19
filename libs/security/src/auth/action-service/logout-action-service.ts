import { Injectable } from '@nestjs/common';
import { TokenBlacklistService } from '../../token/token-blacklist.service';
import { LogoutInput } from '../dto/input';

@Injectable()
export class LogoutActionService {
    constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

    async invoke(data: LogoutInput): Promise<void> {
        await this.tokenBlacklistService.add(data.refreshToken);
    }
}
