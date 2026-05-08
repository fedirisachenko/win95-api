import { Module } from '@nestjs/common';

import { Permissions } from '@libs/security';
import { WsModule, WsNamespace } from '@libs/ws';

import { ExpireChatActionService } from './action-service/expire-chat.action-service';
import { JoinChatActionService } from './action-service/join-chat.action-service';
import { SendMessageActionService } from './action-service/send-message.action-service';
import { ChatStateService } from './service/chat-state.service';
import { ChatExpireAction } from './transport/rmq/action/chat-expire.action';
import { ChatJoinAction } from './transport/ws/action/chat-join.action';
import { ChatLeaveAction } from './transport/ws/action/chat-leave.action';
import { SendMessageAction } from './transport/ws/action/send-message.action';
import { ChatActiveGuard } from './transport/ws/guard/chat-active.guard';
import { ChatConversationRoom } from './transport/ws/room/chat-conversation.room';

@Module({
    imports: [
        WsModule.forFeature({
            namespace: WsNamespace.CHAT_CONVERSATION,
            connectionPermission: Permissions.CHAT.JOIN,
            actions: [ChatJoinAction, ChatLeaveAction, SendMessageAction],
            providers: [
                JoinChatActionService,
                SendMessageActionService,
                ChatConversationRoom,
                ChatStateService,
                ChatActiveGuard,
            ],
        }),
    ],
    controllers: [ChatExpireAction],
    providers: [ExpireChatActionService, ChatConversationRoom],
})
export class ConversationModule {}
