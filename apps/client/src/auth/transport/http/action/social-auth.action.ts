import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JsonOutput, Mapper } from '@libs/core';
import { RmqService } from '@libs/rmq';

import { SocialAuthActionService } from '../../../action-service/social-auth.action-service';
import { SocialAuthInput } from '../dto/input/social-auth.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Social Auth')
@Controller('api-client/auth/social')
export class SocialAuthAction {
    constructor(
        private readonly actionService: SocialAuthActionService,
        private readonly mapper: Mapper,
        private readonly rmq: RmqService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async invoke(@Body() data: SocialAuthInput): Promise<TokenPairOutput> {
        const { tokens, newUserId } = await this.actionService.invoke(data);

        if (newUserId) await this.rmq.emit('user:registered', { userId: newUserId });

        return this.mapper.map(TokenPairOutput, new JsonOutput(tokens));
    }
}
