import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JsonOutput, Mapper } from '@libs/core';
import { RmqService } from '@libs/rmq';

import { SignUpActionService } from '../../../action-service/sign-up.action-service';
import { SignUpInput } from '../dto/input/sign-up.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Auth')
@Controller('api-client/auth/sign-up')
export class SignUpAction {
    constructor(
        private readonly actionService: SignUpActionService,
        private readonly mapper: Mapper,
        private readonly rmq: RmqService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully', type: TokenPairOutput })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async invoke(@Body() data: SignUpInput): Promise<TokenPairOutput> {
        const { tokens, userId } = await this.actionService.invoke(data);

        await this.rmq.emit('user:registered', { userId });

        return this.mapper.map(TokenPairOutput, new JsonOutput(tokens));
    }
}
