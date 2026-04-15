import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@libs/orm';
import { TokenService, TokenPair } from '@libs/security';
import { SignUpInput } from '../dto';

@Injectable()
export class SignUpUseCase {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
    ) {}

    async invoke(data: SignUpInput): Promise<TokenPair> {
        const existingUser = await this.em.findOne(UserEntity, { email: data.email });

        if (existingUser) {
            throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
        }

        const password = await bcrypt.hash(data.password, 10);

        const user = this.em.create(UserEntity, {
            email: data.email,
            password,
            name: data.name,
        });

        await this.em.persistAndFlush(user);

        return this.tokenService.generateTokenPair(user.id);
    }
}
