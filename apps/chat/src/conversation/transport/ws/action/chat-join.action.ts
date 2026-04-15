import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { JoinChatUseCase } from '../use-case/join-chat.use-case';
import { ChatConversationRoom } from '../room/chat-conversation.room';
import { ChatJoinInput } from '../dto/input/chat-join.input';

@Injectable()
export class ChatJoinAction implements WsAction<ChatJoinInput> {
    getEventName(): string {
        return 'chat:join';
    }

    constructor(
        private readonly useCase: JoinChatUseCase,
        private readonly room: ChatConversationRoom,
    ) {}

    async invoke(client: AuthenticatedSocket, data: ChatJoinInput): Promise<void> {
        await this.useCase.invoke(client.data.user.sub, data);
        this.room.join(client, data.chatId);
    }
}
