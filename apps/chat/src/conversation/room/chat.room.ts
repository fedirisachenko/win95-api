import { Injectable } from '@nestjs/common';
import { AbstractWsRoom } from '@libs/ws';

@Injectable()
export class ChatRoom extends AbstractWsRoom {
    protected readonly prefix = 'chat';
}
