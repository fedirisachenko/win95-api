import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { OtpEntity } from '@libs/orm';
import { AUTH_CONFIG } from '../../constants';
import { AuthConfig } from '../interfaces/auth-config.interface';
import { VerifyOtpInput } from '../dto/input';

@Injectable()
export class VerifyOtpActionService {
    constructor(
        private readonly em: EntityManager,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
    ) {}

    async invoke(data: VerifyOtpInput): Promise<void> {
        const otp = await this.em.findOne(OtpEntity, {
            email: data.email,
            purpose: data.purpose,
        });

        if (!otp) {
            throw new BadRequestException('OTP not found or expired');
        }

        if (otp.expiresAt < new Date()) {
            await this.em.removeAndFlush(otp);
            throw new BadRequestException('OTP expired');
        }

        if (otp.attempts >= this.config.otp.maxAttempts) {
            await this.em.removeAndFlush(otp);
            throw new BadRequestException('Too many attempts');
        }

        if (otp.code !== data.code) {
            otp.attempts += 1;
            await this.em.flush();
            throw new BadRequestException('Invalid OTP code');
        }

        await this.em.removeAndFlush(otp);
    }
}
