import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Mapper, JsonOutput } from '@libs/core';
import { RmqService } from '@libs/rmq';
import { SocialAuthUseCase } from '../use-case/social-auth.use-case';
import { SocialAuthInput } from '../dto/input/social-auth.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Social Auth')
@Controller('api-client/auth/social')
export class SocialAuthAction {
    constructor(
        private readonly useCase: SocialAuthUseCase,
        private readonly mapper: Mapper,
        private readonly rmq: RmqService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async invoke(@Body() data: SocialAuthInput): Promise<TokenPairOutput> {
        const { tokens, newUserId } = await this.useCase.invoke(data);

        if (newUserId) {
            await this.rmq.emit('user:registered', { userId: newUserId });
        }

        return this.mapper.map(TokenPairOutput, new JsonOutput(tokens));
    }
}
