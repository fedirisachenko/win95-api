import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@libs/orm';
import { TokenService, TokenPair } from '@libs/security';
import { SignUpInput } from '../dto/input/sign-up.input';
import { RmqService } from '@libs/rmq';

@Injectable()
export class SignUpUseCase {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
        private readonly rmq: RmqService,
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

        await this.rmq.emit('achievement:management:setup:achievement', { userId: user.id });

        return this.tokenService.generateTokenPair(user.id);
    }
}
