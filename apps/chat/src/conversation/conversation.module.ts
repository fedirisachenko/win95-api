import { Module } from '@nestjs/common';
import { WsModule } from '@libs/ws';
import { Permissions } from '@libs/security';
import { ChatJoinAction } from './transport/ws/action/chat-join.action';
import { ChatLeaveAction } from './transport/ws/action/chat-leave.action';
import { SendMessageAction } from './transport/ws/action/send-message.action';
import { JoinChatUseCase } from './use-case/join-chat.use-case';
import { SendMessageUseCase } from './use-case/send-message.use-case';
import { ChatRoom } from './transport/ws/room/chat.room';

const actions = [ChatJoinAction, ChatLeaveAction, SendMessageAction];
const useCases = [JoinChatUseCase, SendMessageUseCase];
const rooms = [ChatRoom];

@Module({
    imports: [
        WsModule.forFeature({
            namespace: '/chat/conversation',
            connectionPermission: Permissions.CHAT.JOIN,
            actions,
            providers: [...useCases, ...rooms],
        }),
    ],
})
export class ConversationModule {}
