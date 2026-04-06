import { Module } from '@nestjs/common';
import { WsModule, WsNamespace } from '@libs/ws';
import { Permissions } from '@libs/security';
import { ChatJoinAction } from './transport/ws/action/chat-join.action';
import { ChatLeaveAction } from './transport/ws/action/chat-leave.action';
import { SendMessageAction } from './transport/ws/action/send-message.action';
import { JoinChatUseCase, SendMessageUseCase } from './use-case';
import { ChatConversationRoom } from './transport/ws/room/chat-conversation.room';

const actions = [ChatJoinAction, ChatLeaveAction, SendMessageAction];
const useCases = [JoinChatUseCase, SendMessageUseCase];
const rooms = [ChatConversationRoom];

@Module({
    imports: [
        WsModule.forFeature({
            namespace: WsNamespace.CHAT_CONVERSATION,
            connectionPermission: Permissions.CHAT.JOIN,
            actions,
            providers: [...useCases, ...rooms],
        }),
    ],
})
export class ConversationModule {}
