import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

import { Mapper } from '@libs/core';
import { RmqService } from '@libs/rmq';
import { AuthenticatedSocket, UseWsGuards, WsAction } from '@libs/ws';

import { SendMessageActionService } from '../../../action-service/send-message.action-service';
import { SendMessageInput } from '../dto/input/send-message.input';
import { MessageNewOutput } from '../dto/output/message-new.output';
import { ChatActiveGuard } from '../guard/chat-active.guard';
import { ChatConversationRoom } from '../room/chat-conversation.room';

@Injectable()
export class SendMessageAction implements WsAction<SendMessageInput> {
    constructor(
        private readonly actionService: SendMessageActionService,
        private readonly room: ChatConversationRoom,
        private readonly mapper: Mapper,
        private readonly rmq: RmqService,
    ) {}

    getEventName(): string {
        return 'message:send';
    }

    @UseWsGuards(ChatActiveGuard)
    async invoke(client: AuthenticatedSocket, data: SendMessageInput, server: Server): Promise<void> {
        const message = await this.actionService.invoke(client.data.user.sub, data);
        const messageOutput = await this.mapper.map(MessageNewOutput, message);

        this.room.emit(server, data.chatId, 'message:new', messageOutput);

        await this.rmq.emit('chat:message-sent', {
            userId: client.data.user.sub,
            text: data.text,
        });
    }
}
