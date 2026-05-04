import { Injectable } from '@nestjs/common';
import { RmqService } from '@libs/rmq';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SearchAcceptInput } from '../dto/input/search-accept.input';
import { SearchAcceptUseCase } from '../use-case/search-accept.use-case';

@Injectable()
export class SearchAcceptAction implements WsAction<SearchAcceptInput> {
    getEventName(): string {
        return 'search:accept';
    }

    constructor(
        private readonly useCase: SearchAcceptUseCase,
        private readonly rmq: RmqService,
    ) {}

    async invoke(client: AuthenticatedSocket, data: SearchAcceptInput): Promise<void> {
        const matchAccepted = await this.useCase.invoke(client.data.user.sub, data);

        if (matchAccepted) {
            await this.rmq.emit('match:accepted', matchAccepted);
        }
    }
}
