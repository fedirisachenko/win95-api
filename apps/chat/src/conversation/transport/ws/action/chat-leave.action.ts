import { Injectable } from '@nestjs/common';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { ChatRoom } from '../room/chat.room';
import { ChatLeaveInput } from '../dto';

@Injectable()
export class ChatLeaveAction implements WsAction<ChatLeaveInput> {
    event = 'chat:leave';

    constructor(private readonly room: ChatRoom) {}

    async invoke(client: AuthenticatedSocket, data: ChatLeaveInput): Promise<void> {
        this.room.leave(client, data.chatId);
    }
}
