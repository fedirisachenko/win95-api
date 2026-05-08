import { Injectable } from '@nestjs/common';

import { AuthenticatedSocket, WsAction } from '@libs/ws';

import { SearchStartActionService } from '../../../action-service/search-start.action-service';
import { SearchStartInput } from '../dto/input/search-start.input';

@Injectable()
export class SearchStartAction implements WsAction<SearchStartInput> {
    constructor(private readonly actionService: SearchStartActionService) {}

    getEventName(): string {
        return 'search:start';
    }

    async invoke(client: AuthenticatedSocket, data: SearchStartInput): Promise<void> {
        await this.actionService.invoke(client.data.user.sub, data);
    }
}
