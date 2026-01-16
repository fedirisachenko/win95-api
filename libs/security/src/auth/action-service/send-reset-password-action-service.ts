import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@libs/orm';
import { NotificationEmitter } from '@libs/notification';
import { TokenService } from '../../tokens/token.service';
import { AUTH_CONFIG } from '../../constants';
import { AuthConfig } from '../interfaces/auth-config.interface';
import { SendResetPasswordInput } from '../dto/input';
import { SuccessOutput } from '../dto/output';
import { SendResetPasswordNotification } from '../notification/send-reset-password-notification';

@Injectable()
export class SendResetPasswordActionService {
    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService,
        private readonly notification: NotificationEmitter,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    async invoke(data: SendResetPasswordInput): Promise<SuccessOutput> {
        const user = await this.em.findOne(UserEntity, { email: data.email });

        if (!user) {
            return { success: true };
        }

        const resetToken = await this.tokenService.generateResetPasswordToken(user.id, user.email);

        user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
        await this.em.flush();

        const resetLink = `${this.config.routePrefix}/reset-password?token=${resetToken}`;

        await this.notification.emit(SendResetPasswordNotification, {
            email: user.email,
            resetLink,
        });

        return { success: true };
    }
}