import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper, JsonOutput } from '@libs/core';
import { SignInInput } from '../dto/input/sign-in.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';
import { SignInUseCase } from '../use-case/sign-in.use-case';

@ApiTags('Auth')
@Controller('sign-in')
export class SignInAction {
    constructor(
        private readonly useCase: SignInUseCase,
        private readonly mapper: Mapper,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in with email and password' })
    @ApiResponse({ status: 200, description: 'Signed in successfully', type: TokenPairOutput })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async invoke(@Body() data: SignInInput): Promise<TokenPairOutput> {
        const result = await this.useCase.invoke(data);
        return this.mapper.map(TokenPairOutput, new JsonOutput(result));
    }
}
