import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AbstractNotificationEvent } from './abstract-notification-event';

@Injectable()
export class NotificationEmitter {
    constructor(private readonly moduleRef: ModuleRef) {}

    async emit<T>(notificationClass: Type<AbstractNotificationEvent<T>>, data: T): Promise<void> {
        const notification = await this.moduleRef.resolve(notificationClass);
        notification.setData(data);
        await notification.send();
    }
}
