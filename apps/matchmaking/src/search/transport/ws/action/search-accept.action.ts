import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SearchAcceptInput } from '../dto/input/search-accept.input';
import { SearchAcceptUseCase } from '../use-case/search-accept.use-case';

@Injectable()
export class SearchAcceptAction implements WsAction<SearchAcceptInput> {
    getEventName(): string {
        return 'search:accept';
    }

    constructor(private readonly useCase: SearchAcceptUseCase) {}

    async invoke(client: AuthenticatedSocket, data: SearchAcceptInput): Promise<void> {
        await this.useCase.invoke(client.data.user.sub, data);
    }
}
