import { Injectable } from '@nestjs/common';

import { RmqService } from '@libs/rmq';
import { AuthenticatedSocket, WsAction } from '@libs/ws';

import { SearchAcceptActionService } from '../../../action-service/search-accept.action-service';
import { SearchAcceptInput } from '../dto/input/search-accept.input';

@Injectable()
export class SearchAcceptAction implements WsAction<SearchAcceptInput> {
    constructor(
        private readonly actionService: SearchAcceptActionService,
        private readonly rmq: RmqService,
    ) {}

    getEventName(): string {
        return 'search:accept';
    }

    async invoke(client: AuthenticatedSocket, data: SearchAcceptInput): Promise<void> {
        const matchAccepted = await this.actionService.invoke(client.data.user.sub, data);
        if (!matchAccepted) return;

        await this.rmq.emit('match:accepted', matchAccepted);
    }
}
