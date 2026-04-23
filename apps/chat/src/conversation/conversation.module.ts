import { Module } from '@nestjs/common';
import { WsModule, WsNamespace } from '@libs/ws';
import { Permissions } from '@libs/security';
import { ChatJoinAction } from './transport/ws/action/chat-join.action';
import { ChatLeaveAction } from './transport/ws/action/chat-leave.action';
import { SendMessageAction } from './transport/ws/action/send-message.action';
import { JoinChatUseCase } from './transport/ws/use-case/join-chat.use-case';
import { SendMessageUseCase } from './transport/ws/use-case/send-message.use-case';
import { ChatConversationRoom } from './transport/ws/room/chat-conversation.room';
import { ChatStateService } from './service/chat-state.service';
import { ChatActiveGuard } from './guard/chat-active.guard';
import { ExpireChatUseCase } from './transport/rmq/use-case/expire-chat.use-case';
import { ChatExpireAction } from './transport/rmq/action/chat-expire.action';

const actions = [ChatJoinAction, ChatLeaveAction, SendMessageAction];
const useCases = [JoinChatUseCase, SendMessageUseCase];
const rooms = [ChatConversationRoom];
const services = [ChatStateService];
const guards = [ChatActiveGuard];

@Module({
    imports: [
        WsModule.forFeature({
            namespace: WsNamespace.CHAT_CONVERSATION,
            connectionPermission: Permissions.CHAT.JOIN,
            actions,
            providers: [...useCases, ...rooms, ...services, ...guards],
        }),
    ],
    controllers: [ChatExpireAction],
    providers: [ExpireChatUseCase, ChatConversationRoom],
})
export class ConversationModule {}
