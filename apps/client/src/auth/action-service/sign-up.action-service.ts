import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '@libs/orm';
import { TokenPair, TokenService } from '@libs/security';

import { SignUpInput } from '../transport/http/dto/input/sign-up.input';

@Injectable()
export class SignUpActionService {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
    ) {}

    async invoke(data: SignUpInput): Promise<{ tokens: TokenPair; userId: string }> {
        const existing = await this.em.findOne(UserEntity, { email: data.email });
        if (existing) throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);

        const password = await bcrypt.hash(data.password, 10);
        const user = this.em.create(UserEntity, {
            email: data.email,
            password,
            name: data.name,
        });

        await this.em.persistAndFlush(user);

        return {
            tokens: await this.tokenService.generateTokenPair(user.id),
            userId: user.id,
        };
    }
}
