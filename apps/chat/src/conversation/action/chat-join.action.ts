import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { JoinChatActionService } from '../action-service/join-chat.action-service';
import { ChatRoom } from '../room/chat.room';
import { ChatJoinInput } from '../dto/input/chat-join.input';

@Injectable()
export class ChatJoinAction implements WsAction<ChatJoinInput> {
    event = 'chat:join';

    constructor(
        private readonly actionService: JoinChatActionService,
        private readonly room: ChatRoom,
    ) {}

    async invoke(client: AuthenticatedSocket, data: ChatJoinInput): Promise<void> {
        await this.actionService.invoke(client.data.user.sub, data);
        this.room.join(client, data.chatId);
    }
}
