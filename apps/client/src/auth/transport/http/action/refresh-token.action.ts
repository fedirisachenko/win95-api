import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper, JsonOutput } from '@libs/core';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';
import { RefreshTokenUseCase } from '../use-case/refresh-token.use-case';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Auth')
@Controller('refresh')
export class RefreshTokenAction {
    constructor(
        private readonly useCase: RefreshTokenUseCase,
        private readonly mapper: Mapper,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully', type: TokenPairOutput })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async invoke(@Body() data: RefreshTokenInput): Promise<TokenPairOutput> {
        const result = await this.useCase.invoke(data);
        return this.mapper.map(TokenPairOutput, new JsonOutput(result));
    }
}
