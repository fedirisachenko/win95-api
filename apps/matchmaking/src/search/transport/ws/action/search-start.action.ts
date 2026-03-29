import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SearchStartInput } from '../dto';
import { SearchStartUseCase } from '../../../use-case';

@Injectable()
export class SearchStartAction implements WsAction<SearchStartInput> {
    getEventName(): string {
        return 'search:start';
    }

    constructor(private readonly useCase: SearchStartUseCase) {}

    async invoke(client: AuthenticatedSocket, data: SearchStartInput): Promise<void> {
        await this.useCase.invoke(client.data.user.sub, data);
    }
}
