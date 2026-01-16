import { Injectable, Inject } from '@nestjs/common';
import { AbstractNotificationEvent, NotificationManager, NOTIFICATION_MANAGER } from '@libs/notification';

export type SendOtpPayload = {
    email: string;
    code: string;
    purpose: string;
};

@Injectable()
export class SendOtpNotification extends AbstractNotificationEvent<SendOtpPayload> {
    constructor(
        @Inject(NOTIFICATION_MANAGER)
        private readonly manager: NotificationManager,
    ) {
        super();
    }

    async send(): Promise<void> {
        const { email, code, purpose } = this.getData();
        await this.manager.send({
            type: 'otp',
            to: email,
            payload: { code, purpose },
        });
    }
}
