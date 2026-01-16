export type NotificationPayload = {
    type: string;
    to: string;
    payload: Record<string, any>;
};

export interface NotificationManager {
    send(payload: NotificationPayload): Promise<void>;
}

export const NOTIFICATION_MANAGER = Symbol('NOTIFICATION_MANAGER');