import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';

import { NotificationEmitter } from '@libs/notification';
import { UserEntity } from '@libs/orm';
import { AUTH_CONFIG, AuthConfig, TokenService } from '@libs/security';

import { SendResetPasswordNotification } from '../notification/send-reset-password.notification';
import { SendResetPasswordInput } from '../transport/http/dto/input/send-reset-password.input';

@Injectable()
export class SendResetPasswordActionService {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
        private readonly notification: NotificationEmitter,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    async invoke(data: SendResetPasswordInput): Promise<void> {
        const user = await this.em.findOne(UserEntity, { email: data.email });
        if (!user) return;

        const resetToken = await this.tokenService.generateResetPasswordToken(user.id, user.email);
        user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
        await this.em.flush();

        const resetLink = `${this.config.routePrefix}/reset-password?token=${resetToken}`;

        await this.notification.emit(SendResetPasswordNotification, {
            email: user.email,
            resetLink,
        });
    }
}
