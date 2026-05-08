import { Injectable } from '@nestjs/common';

import { AuthenticatedSocket, WsAction } from '@libs/ws';

import { SearchCancelActionService } from '../../../action-service/search-cancel.action-service';
import { SearchCancelInput } from '../dto/input/search-cancel.input';

@Injectable()
export class SearchCancelAction implements WsAction<SearchCancelInput> {
    constructor(private readonly actionService: SearchCancelActionService) {}

    getEventName(): string {
        return 'search:cancel';
    }

    async invoke(client: AuthenticatedSocket, data: SearchCancelInput): Promise<void> {
        await this.actionService.invoke(client.data.user.sub, data);
    }
}
