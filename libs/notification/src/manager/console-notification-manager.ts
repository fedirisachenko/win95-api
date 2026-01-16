import { Injectable, Logger } from '@nestjs/common';
import { NotificationManager, NotificationPayload } from '../contract/notification-manager.interface';

@Injectable()
export class ConsoleNotificationManager implements NotificationManager {
    private readonly logger = new Logger('Notification');

    async send(payload: NotificationPayload): Promise<void> {
        this.logger.log(
            `[${payload.type.toUpperCase()}] To: ${payload.to} | Payload: ${JSON.stringify(payload.payload)}`,
        );
    }
}