import { Injectable } from '@nestjs/common';
import { SocketRegistry } from '@libs/core';
import { WsNamespace } from '@libs/ws';
import { ChatReadyInput } from '../dto/input/chat-ready.input';

@Injectable()
export class ChatReadyUseCase {
    constructor(private readonly socketRegistry: SocketRegistry) {}

    async invoke(data: ChatReadyInput): Promise<void> {
        for (const userId of data.userIds) {
            this.socketRegistry
                .of(WsNamespace.MATCHMAKING_SEARCH)
                .get(userId)
                ?.emit('search:completed', { chatId: data.chatId });
        }
    }
}
