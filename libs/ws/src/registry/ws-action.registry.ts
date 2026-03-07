import { Injectable } from '@nestjs/common';
import { WsAction } from '../interface/ws-action.interface';

@Injectable()
export class WsActionRegistry {
    private readonly map = new Map<string, WsAction>();

    constructor(actions: WsAction[]) {
        for (const action of actions) {
            this.map.set(action.event, action);
        }
    }

    get(event: string): WsAction | undefined {
        return this.map.get(event);
    }
}
