import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
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
    ) {}

    async invoke(client: AuthenticatedSocket, data: SendMessageInput, server: Server): Promise<void> {
        const message = await this.useCase.invoke(client.data.user.sub, data);

        const messageOutput = new MessageNewOutput();
        messageOutput.id = message.id;
        messageOutput.text = message.text;
        messageOutput.senderId = client.data.user.sub;
        messageOutput.createdAt = message.createdAt;

        this.room.emit(server, data.chatId, 'message:new', messageOutput);
    }
}
