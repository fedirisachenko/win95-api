import { Injectable } from '@nestjs/common';
import { WsServerRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { ChatConversationRoom } from '../../ws/room/chat-conversation.room';
import { ChatExpireInput } from '../dto/input/chat-expire.input';

@Injectable()
export class ExpireChatUseCase {
    constructor(
        private readonly wsServerRegistry: WsServerRegistry,
        private readonly room: ChatConversationRoom,
    ) {}

    async invoke(data: ChatExpireInput): Promise<void> {
        const server = this.wsServerRegistry.of(WsNamespace.CHAT_CONVERSATION);

        if (!server) {
            return;
        }

        const roomName = this.room.name(data.chatId);

        this.room.emit(server, data.chatId, 'chat:ended', {
            chatId: data.chatId,
            reason: data.reason,
        });

        server.in(roomName).disconnectSockets(true);
    }
}
