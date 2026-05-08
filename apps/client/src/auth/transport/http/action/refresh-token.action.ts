import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JsonOutput, Mapper } from '@libs/core';

import { RefreshTokenActionService } from '../../../action-service/refresh-token.action-service';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Auth')
@Controller('api-client/auth/refresh')
export class RefreshTokenAction {
    constructor(
        private readonly actionService: RefreshTokenActionService,
        private readonly mapper: Mapper,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully', type: TokenPairOutput })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async invoke(@Body() data: RefreshTokenInput): Promise<TokenPairOutput> {
        const result = await this.actionService.invoke(data);
        return this.mapper.map(TokenPairOutput, new JsonOutput(result));
    }
}
