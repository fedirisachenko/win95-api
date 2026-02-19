import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { NotificationEmitter } from './service/notification-emitter';
import { NotificationManager } from './contract/notification-manager.interface';
import { NOTIFICATION_MANAGER } from './constant/di-token.constant';
import { ConsoleNotificationManager } from './manager/console-notification-manager';
import { AbstractNotificationEvent } from './service/abstract-notification-event';

export type NotificationModuleOptions = {
    manager?: Type<NotificationManager>;
    events?: Type<AbstractNotificationEvent>[];
};

@Module({})
export class NotificationModule {
    static forRoot(options: NotificationModuleOptions = {}): DynamicModule {
        const managerProvider: Provider = {
            provide: NOTIFICATION_MANAGER,
            useClass: options.manager || ConsoleNotificationManager,
        };

        const eventProviders: Provider[] = (options.events || []).map((EventClass) => ({
            provide: EventClass,
            useClass: EventClass,
        }));

        return {
            module: NotificationModule,
            global: true,
            providers: [NotificationEmitter, managerProvider, ...eventProviders],
            exports: [NotificationEmitter, NOTIFICATION_MANAGER, ...eventProviders],
        };
    }
}
