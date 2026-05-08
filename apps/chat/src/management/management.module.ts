import { Module } from '@nestjs/common';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';

import { CreateChatActionService } from './action-service/create-chat.action-service';
import { FinalizeChatActionService } from './action-service/finalize-chat.action-service';
import { CHAT_FINALIZE_QUEUE } from './constant/queue.constant';
import { ChatFinalizeProcessor } from './processor/chat-finalize.processor';
import { ChatLifecycleService } from './service/chat-lifecycle.service';
import { CreateChatAction } from './transport/rmq/action/create-chat.action';
import { FinalizeChatAction } from './transport/rmq/action/finalize-chat.action';

@Module({
    imports: [
        BullModule.registerQueue({ name: CHAT_FINALIZE_QUEUE }),
        BullBoardModule.forFeature({
            name: CHAT_FINALIZE_QUEUE,
            adapter: BullMQAdapter,
        }),
    ],
    controllers: [CreateChatAction, FinalizeChatAction],
    providers: [CreateChatActionService, FinalizeChatActionService, ChatLifecycleService, ChatFinalizeProcessor],
})
export class ManagementModule {}
