import { Injectable } from '@nestjs/common';
import { TokenBlacklistService } from '../../tokens/token-blacklist.service';
import { LogoutInput } from '../dto/input';
import { SuccessOutput } from '../dto/output';

@Injectable()
export class LogoutActionService {
    constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

    async invoke(data: LogoutInput): Promise<SuccessOutput> {
        this.tokenBlacklistService.add(data.refreshToken);
        return { success: true };
    }
}