import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenInput } from '../dto/input';
import { TokenPairOutput } from '../dto/output';
import { RefreshTokenActionService } from '../action-service/refresh-token-action-service';

@ApiTags('Auth')
@Controller('refresh')
export class RefreshTokenAction {
    constructor(private readonly actionService: RefreshTokenActionService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully', type: TokenPairOutput })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async invoke(@Body() data: RefreshTokenInput): Promise<TokenPairOutput> {
        return this.actionService.invoke(data);
    }
}
