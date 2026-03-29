import { Injectable } from '@nestjs/common';
import { AbstractWsRoom } from '@libs/ws';

@Injectable()
export class ChatConversationRoom extends AbstractWsRoom {
    protected readonly prefix = 'chat:conversation';
}
