import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper, JsonOutput } from '@libs/core';
import { RmqService } from '@libs/rmq';
import { SignUpInput } from '../dto/input/sign-up.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';
import { SignUpUseCase } from '../use-case/sign-up.use-case';

@ApiTags('Auth')
@Controller('api-client/auth/sign-up')
export class SignUpAction {
    constructor(
        private readonly useCase: SignUpUseCase,
        private readonly mapper: Mapper,
        private readonly rmq: RmqService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully', type: TokenPairOutput })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async invoke(@Body() data: SignUpInput): Promise<TokenPairOutput> {
        const { tokens, userId } = await this.useCase.invoke(data);

        await this.rmq.emit('user:registered', { userId });

        return this.mapper.map(TokenPairOutput, new JsonOutput(tokens));
    }
}
