import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { OtpEntity } from '@libs/orm';
import { NotificationEmitter } from '@libs/notification';
import { AUTH_CONFIG } from '../../constants';
import { AuthConfig } from '../interfaces/auth-config.interface';
import { SendOtpInput } from '../dto/input';
import { OtpSentOutput } from '../dto/output';
import { SendOtpNotification } from '../notification/send-otp-notification';

@Injectable()
export class SendOtpActionService {
    constructor(
        private readonly em: EntityManager,
        private readonly notification: NotificationEmitter,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    async invoke(data: SendOtpInput): Promise<OtpSentOutput> {
        await this.em.nativeDelete(OtpEntity, {
            email: data.email,
            purpose: data.purpose,
        });

        const code = this.generateOtpCode();

        const otp = this.em.create(OtpEntity, {
            email: data.email,
            code,
            purpose: data.purpose,
            expiresAt: new Date(Date.now() + this.config.otp.expiresInSeconds * 1000),
        });

        await this.em.persistAndFlush(otp);

        await this.notification.emit(SendOtpNotification, {
            email: data.email,
            code,
            purpose: data.purpose,
        });

        return {
            success: true,
            expiresIn: this.config.otp.expiresInSeconds,
        };
    }

    private generateOtpCode(): string {
        const length = this.config.otp.codeLength;
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }
}
