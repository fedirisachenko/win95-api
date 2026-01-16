import { Injectable, Inject } from '@nestjs/common';
import { AbstractNotificationEvent, NotificationManager, NOTIFICATION_MANAGER } from '@libs/notification';

export type SendResetPasswordPayload = {
    email: string;
    resetLink: string;
};

@Injectable()
export class SendResetPasswordNotification extends AbstractNotificationEvent<SendResetPasswordPayload> {
    constructor(
        @Inject(NOTIFICATION_MANAGER)
        private readonly manager: NotificationManager,
    ) {
        super();
    }

    async send(): Promise<void> {
        const { email, resetLink } = this.getData();
        await this.manager.send({
            type: 'reset_password',
            to: email,
            payload: { resetLink },
        });
    }
}