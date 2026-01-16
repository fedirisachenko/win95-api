import { Injectable, ConflictException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@libs/orm';
import { TokenService } from '../../tokens/token.service';
import { SignUpInput } from '../dto/input';
import { AuthOutput } from '../dto/output';

@Injectable()
export class SignUpActionService {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
    ) {}

    async invoke(data: SignUpInput): Promise<AuthOutput> {
        const existingUser = await this.em.findOne(UserEntity, { email: data.email });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const password = await bcrypt.hash(data.password, 10);

        const user = this.em.create(UserEntity, {
            email: data.email,
            password,
            name: data.name,
        });

        await this.em.persistAndFlush(user);

        const tokens = await this.tokenService.generateTokenPair(user.id, user.email);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
