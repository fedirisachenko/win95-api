import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AUTH_CONFIG, CODE_STORAGE, CodeStorageInterface, AuthConfig } from '@libs/security';
import { VerifyOtpInput } from '../transport/http/dto';
import { OtpStorageData } from './send-otp.use-case';

const OTP_PREFIX = 'otp:';

@Injectable()
export class VerifyOtpUseCase {
    constructor(
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
        @Inject(CODE_STORAGE) private readonly codeStorage: CodeStorageInterface,
    ) {}

    async invoke(data: VerifyOtpInput): Promise<void> {
        const key = this.getOtpKey(data.email);
        const otpData = (await this.codeStorage.get(key, true)) as OtpStorageData | null;

        if (!otpData) {
            throw new BadRequestException('OTP not found or expired');
        }

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

    private getOtpKey(email: string): string {
        return `${OTP_PREFIX}${email}`;
    }
}
