import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Mapper, JsonOutput } from '@libs/core';
import { SocialAuthUseCase } from '../use-case/social-auth.use-case';
import { SocialAuthInput } from '../dto/input/social-auth.input';
import { TokenPairOutput } from '../dto/output/token-pair.output';

@ApiTags('Social Auth')
@Controller('social')
export class SocialAuthAction {
    constructor(
        private readonly useCase: SocialAuthUseCase,
        private readonly mapper: Mapper,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async invoke(@Body() data: SocialAuthInput): Promise<TokenPairOutput> {
        const result = await this.useCase.invoke(data);
        return this.mapper.map(TokenPairOutput, new JsonOutput(result));
    }
}
