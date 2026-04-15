import { DynamicModule, Provider, Type } from '@nestjs/common';
import { WsAction } from './ws-action.interface';

export interface WsModuleOptions {
    namespace: string;
    connectionPermission?: string;
    cors?: object;
    imports?: Array<Type<any> | DynamicModule>;
    actions?: Type<WsAction>[];
    providers?: Provider[];
}
