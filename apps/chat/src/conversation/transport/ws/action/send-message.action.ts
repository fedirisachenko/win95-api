import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Mapper } from '@libs/core';
import { WsAction, AuthenticatedSocket, UseWsGuards } from '@libs/ws';
import { RmqService } from '@libs/rmq';
import { SendMessageUseCase } from '../use-case/send-message.use-case';
import { ChatConversationRoom } from '../room/chat-conversation.room';
import { SendMessageInput } from '../dto/input/send-message.input';
import { MessageNewOutput } from '../dto/output/message-new.output';
import { ChatActiveGuard } from '../../../guard/chat-active.guard';

@Injectable()
export class SendMessageAction implements WsAction<SendMessageInput> {
    getEventName(): string {
        return 'message:send';
    }

    constructor(
        private readonly useCase: SendMessageUseCase,
        private readonly room: ChatConversationRoom,
        private readonly mapper: Mapper,
        private readonly rmq: RmqService,
    ) {}

    @UseWsGuards(ChatActiveGuard)
    async invoke(client: AuthenticatedSocket, data: SendMessageInput, server: Server): Promise<void> {
        const message = await this.useCase.invoke(client.data.user.sub, data);

        const messageOutput = await this.mapper.map(MessageNewOutput, message);

        this.room.emit(server, data.chatId, 'message:new', messageOutput);

        await this.rmq.emit('chat:message-sent', {
            userId: client.data.user.sub,
            text: data.text,
        });
    }
}
