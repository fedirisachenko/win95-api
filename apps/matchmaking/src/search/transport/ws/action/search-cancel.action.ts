import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SearchCancelInput } from '../dto/input/search-cancel.input';
import { SearchCancelUseCase } from '../use-case/search-cancel.use-case';

@Injectable()
export class SearchCancelAction implements WsAction<SearchCancelInput> {
    getEventName(): string {
        return 'search:cancel';
    }

    constructor(private readonly useCase: SearchCancelUseCase) {}

    async invoke(client: AuthenticatedSocket, data: SearchCancelInput): Promise<void> {
        await this.useCase.invoke(client.data.user.sub, data);
    }
}
