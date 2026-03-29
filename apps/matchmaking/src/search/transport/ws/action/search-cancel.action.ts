import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SearchCancelInput } from '../dto';
import { SearchCancelUseCase } from '../../../use-case';

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
