import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { AUTH_CONFIG, AuthConfig, CODE_STORAGE, CodeStorageInterface } from '@libs/security';

import { otpKey } from '../constant/otp.constant';
import { VerifyOtpInput } from '../transport/http/dto/input/verify-otp.input';
import { OtpStorageData } from '../type/otp-storage-data.type';

@Injectable()
export class VerifyOtpActionService {
    constructor(
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
        @Inject(CODE_STORAGE) private readonly codeStorage: CodeStorageInterface,
    ) {}

    async invoke(data: VerifyOtpInput): Promise<void> {
        const key = otpKey(data.email);
        const otpData = (await this.codeStorage.get(key, true)) as OtpStorageData | null;
        if (!otpData) throw new BadRequestException('OTP not found or expired');

        if (otpData.attempts >= this.config.otp.maxAttempts) {
            await this.codeStorage.del(key);
            throw new BadRequestException('Too many attempts');
        }

        if (otpData.code !== data.code) {
            otpData.attempts += 1;
            const ttlMs = this.config.otp.expiresInSeconds * 1000;
            await this.codeStorage.set(key, JSON.stringify(otpData), ttlMs);
            throw new BadRequestException('Invalid OTP code');
        }

        await this.codeStorage.del(key);
    }
}
