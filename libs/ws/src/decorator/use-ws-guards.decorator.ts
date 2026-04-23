import { Type } from '@nestjs/common';
import { WsActionGuard } from '../type/ws-action-guard.interface';

export const WS_GUARDS_METADATA = 'ws:action:guards';

export const UseWsGuards =
    (...guards: Type<WsActionGuard>[]): MethodDecorator =>
    (_target, _propertyKey, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(WS_GUARDS_METADATA, guards, descriptor.value);
    };

export const getWsActionGuards = (handler: (...args: unknown[]) => unknown): Type<WsActionGuard>[] => {
    return Reflect.getMetadata(WS_GUARDS_METADATA, handler) ?? [];
};
