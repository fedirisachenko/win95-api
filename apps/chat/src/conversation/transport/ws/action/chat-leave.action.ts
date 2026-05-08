import { Injectable } from '@nestjs/common';

import { AuthenticatedSocket, WsAction } from '@libs/ws';

import { ChatLeaveInput } from '../dto/input/chat-leave.input';
import { ChatConversationRoom } from '../room/chat-conversation.room';

@Injectable()
export class ChatLeaveAction implements WsAction<ChatLeaveInput> {
    constructor(private readonly room: ChatConversationRoom) {}

    getEventName(): string {
        return 'chat:leave';
    }

    async invoke(client: AuthenticatedSocket, data: ChatLeaveInput): Promise<void> {
        this.room.leave(client, data.chatId);
    }
}
