import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@libs/orm';
import { TokenService } from '../../token/token.service';
import { ResetPasswordInput } from '../dto/input/reset-password-input';

@Injectable()
export class ResetPasswordActionService {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
    ) {}

    async invoke(data: ResetPasswordInput): Promise<void> {
        const payload = await this.tokenService.verifyResetPasswordToken(data.token);
        if (!payload) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const user = await this.em.findOneOrFail(UserEntity, { id: payload.sub });

        const isTokenValid = await bcrypt.compare(data.token, user.resetPasswordToken);
        if (!isTokenValid) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        user.password = await bcrypt.hash(data.newPassword, 10);
        user.resetPasswordToken = undefined;
        await this.em.flush();
    }
}
