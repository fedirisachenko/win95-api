import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { ChatConversationRoom } from '../room/chat-conversation.room';
import { ChatLeaveInput } from '../dto';

@Injectable()
export class ChatLeaveAction implements WsAction<ChatLeaveInput> {
    getEventName(): string {
        return 'chat:leave';
    }

    constructor(private readonly room: ChatConversationRoom) {}

    async invoke(client: AuthenticatedSocket, data: ChatLeaveInput): Promise<void> {
        this.room.leave(client, data.chatId);
    }
}
