import { Injectable } from '@nestjs/common';

import { AuthenticatedSocket, UseWsGuards, WsAction } from '@libs/ws';

import { JoinChatActionService } from '../../../action-service/join-chat.action-service';
import { ChatJoinInput } from '../dto/input/chat-join.input';
import { ChatActiveGuard } from '../guard/chat-active.guard';
import { ChatConversationRoom } from '../room/chat-conversation.room';

@Injectable()
export class ChatJoinAction implements WsAction<ChatJoinInput> {
    constructor(
        private readonly actionService: JoinChatActionService,
        private readonly room: ChatConversationRoom,
    ) {}

    getEventName(): string {
        return 'chat:join';
    }

    @UseWsGuards(ChatActiveGuard)
    async invoke(client: AuthenticatedSocket, data: ChatJoinInput): Promise<void> {
        await this.actionService.invoke(client.data.user.sub, data);
        this.room.join(client, data.chatId);
    }
}
