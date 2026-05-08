import { Injectable } from '@nestjs/common';

import { WsServerRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';

import { ChatExpireInput } from '../transport/rmq/dto/input/chat-expire.input';
import { ChatConversationRoom } from '../transport/ws/room/chat-conversation.room';

@Injectable()
export class ExpireChatActionService {
    constructor(
        private readonly wsServerRegistry: WsServerRegistry,
        private readonly room: ChatConversationRoom,
    ) {}

    async invoke(data: ChatExpireInput): Promise<void> {
        const server = this.wsServerRegistry.of(WsNamespace.CHAT_CONVERSATION);
        if (!server) return;

        const roomName = this.room.name(data.chatId);

        this.room.emit(server, data.chatId, 'chat:ended', {
            chatId: data.chatId,
            reason: data.reason,
        });

        server.in(roomName).disconnectSockets(true);
    }
}
