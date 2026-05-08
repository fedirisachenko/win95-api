import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JsonOutput, Mapper } from '@libs/core';

import { SignInActionService } from '../../../action-service/sign-in.action-service';
import { SignInInput } from '../dto/input/sign-in.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Auth')
@Controller('api-client/auth/sign-in')
export class SignInAction {
    constructor(
        private readonly actionService: SignInActionService,
        private readonly mapper: Mapper,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in with email and password' })
    @ApiResponse({ status: 200, description: 'Signed in successfully', type: TokenPairOutput })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async invoke(@Body() data: SignInInput): Promise<TokenPairOutput> {
        const result = await this.actionService.invoke(data);
        return this.mapper.map(TokenPairOutput, new JsonOutput(result));
    }
}
