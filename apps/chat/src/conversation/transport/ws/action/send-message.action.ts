import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Mapper } from '@libs/core';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SendMessageUseCase } from '../../../use-case';
import { ChatConversationRoom } from '../room/chat-conversation.room';
import { SendMessageInput, MessageNewOutput } from '../dto';

@Injectable()
export class SendMessageAction implements WsAction<SendMessageInput> {
    getEventName(): string {
        return 'message:send';
    }

    constructor(
        private readonly useCase: SendMessageUseCase,
        private readonly room: ChatConversationRoom,
        private readonly mapper: Mapper,
    ) {}

    async invoke(client: AuthenticatedSocket, data: SendMessageInput, server: Server): Promise<void> {
        const message = await this.useCase.invoke(client.data.user.sub, data);

        const messageOutput = this.mapper.map(MessageNewOutput, message);

        this.room.emit(server, data.chatId, 'message:new', messageOutput);
    }
}
