import { Injectable, Inject } from '@nestjs/common';
import { NotificationEmitter } from '@libs/notification';
import { AUTH_CONFIG, CODE_STORAGE, CodeStorageInterface, AuthConfig } from '@libs/security';
import { SendOtpInput } from '../dto/input/send-otp.input';
import { SendOtpNotification } from '../../../notification/send-otp.notification';
import { otpKey } from '../../../constant/otp.constant';
import { OtpStorageData } from '../../../type/otp-storage-data.type';

@Injectable()
export class SendOtpUseCase {
    constructor(
        private readonly notification: NotificationEmitter,
        @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
        @Inject(CODE_STORAGE) private readonly codeStorage: CodeStorageInterface,
    ) {}

    async invoke(data: SendOtpInput): Promise<number> {
        const code = this.generateOtpCode();
        const key = otpKey(data.email);
        const ttlMs = this.config.otp.expiresInSeconds * 1000;

        const otpData: OtpStorageData = {
            code,
            attempts: 0,
        };

        await this.codeStorage.set(key, JSON.stringify(otpData), ttlMs);

        await this.notification.emit(SendOtpNotification, {
            email: data.email,
            code,
        });

        return this.config.otp.expiresInSeconds;
    }

    private generateOtpCode(): string {
        const length = this.config.otp.codeLength;
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }
}
