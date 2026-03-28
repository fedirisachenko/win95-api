import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { JoinChatUseCase } from '../../../use-case/join-chat.use-case';
import { ChatRoom } from '../room/chat.room';
import { ChatJoinInput } from '../dto';

@Injectable()
export class ChatJoinAction implements WsAction<ChatJoinInput> {
    event = 'chat:join';

    constructor(
        private readonly useCase: JoinChatUseCase,
        private readonly room: ChatRoom,
    ) {}

    async invoke(client: AuthenticatedSocket, data: ChatJoinInput): Promise<void> {
        await this.useCase.invoke(client.data.user.sub, data);
        this.room.join(client, data.chatId);
    }
}
