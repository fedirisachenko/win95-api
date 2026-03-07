import { Module } from '@nestjs/common';
import { WsAction, WsActionRegistry } from '@libs/ws';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatJoinAction } from './action/chat-join.action';
import { ChatLeaveAction } from './action/chat-leave.action';
import { SendMessageAction } from './action/send-message.action';
import { JoinChatActionService } from './action-service/join-chat.action-service';
import { SendMessageActionService } from './action-service/send-message.action-service';
import { ChatRoom } from './room/chat.room';

const actions = [ChatJoinAction, ChatLeaveAction, SendMessageAction];

const actionServices = [JoinChatActionService, SendMessageActionService];

const rooms = [ChatRoom];

@Module({
    providers: [
        ChatGateway,
        {
            provide: WsActionRegistry,
            useFactory: (...acts: WsAction[]) => new WsActionRegistry(acts),
            inject: actions,
        },
        ...actions,
        ...actionServices,
        ...rooms,
    ],
})
export class ConversationModule {}
