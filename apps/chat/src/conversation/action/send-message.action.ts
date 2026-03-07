import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsAction, AuthenticatedSocket } from '@libs/ws';
import { SendMessageActionService } from '../action-service/send-message.action-service';
import { ChatRoom } from '../room/chat.room';
import { SendMessageInput } from '../dto/input/send-message.input';
import { MessageNewOutput } from '../dto/output/message-new.output';

@Injectable()
export class SendMessageAction implements WsAction<SendMessageInput> {
    event = 'message:send';

    constructor(
        private readonly actionService: SendMessageActionService,
        private readonly room: ChatRoom,
    ) {}

    async invoke(client: AuthenticatedSocket, data: SendMessageInput, server: Server): Promise<void> {
        const message = await this.actionService.invoke(client.data.user.sub, data);

        const messageOutput = new MessageNewOutput();
        messageOutput.id = message.id;
        messageOutput.text = message.text;
        messageOutput.senderId = client.data.user.sub;
        messageOutput.createdAt = message.createdAt;

        this.room.emit(server, data.chatId, 'message:new', messageOutput);
    }
}
