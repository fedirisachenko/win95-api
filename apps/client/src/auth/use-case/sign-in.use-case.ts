import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@libs/orm';
import { TokenService, TokenPair } from '@libs/security';
import { SignInInput } from '../transport/http/dto';

@Injectable()
export class SignInUseCase {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
    ) {}

    async invoke(data: SignInInput): Promise<TokenPair> {
        const user = await this.em.findOne(UserEntity, { email: data.email });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.tokenService.generateTokenPair(user.id);
    }
}
