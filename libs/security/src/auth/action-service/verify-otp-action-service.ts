import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AUTH_CONFIG } from '../../constants';
import { AuthConfig } from '../interfaces/auth-config.interface';
import { VerifyOtpInput } from '../dto/input';
import { CODE_STORAGE, CodeStorageInterface } from '../../contract/code-storage.interface';
import { OtpStorageData } from './send-otp-action-service';

const OTP_PREFIX = 'otp:';

@Injectable()
export class VerifyOtpActionService {
    constructor(
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
        @Inject(CODE_STORAGE) private readonly codeStorage: CodeStorageInterface,
    ) {}

    async invoke(data: VerifyOtpInput): Promise<void> {
        const key = this.getOtpKey(data.email, data.purpose);
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
            await this.codeStorage.set(key, JSON.stringify(otpData));
            throw new BadRequestException('Invalid OTP code');
        }

        await this.codeStorage.del(key);
    }

    private getOtpKey(email: string, purpose: number): string {
        return `${OTP_PREFIX}${email}:${purpose}`;
    }
}
