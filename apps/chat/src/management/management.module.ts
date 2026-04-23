import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { CHAT_FINALIZE_QUEUE } from './constant/queue.constant';
import { ChatLifecycleService } from './service/chat-lifecycle.service';
import { ChatFinalizeProcessor } from './processor/chat-finalize.processor';
import { CreateChatAction } from './transport/rmq/action/create-chat.action';
import { FinalizeChatAction } from './transport/rmq/action/finalize-chat.action';
import { CreateChatUseCase } from './transport/rmq/use-case/create-chat.use-case';
import { FinalizeChatUseCase } from './transport/rmq/use-case/finalize-chat.use-case';

@Module({
    imports: [
        BullModule.registerQueue({ name: CHAT_FINALIZE_QUEUE }),
        BullBoardModule.forFeature({
            name: CHAT_FINALIZE_QUEUE,
            adapter: BullMQAdapter,
        }),
    ],
    controllers: [CreateChatAction, FinalizeChatAction],
    providers: [CreateChatUseCase, FinalizeChatUseCase, ChatLifecycleService, ChatFinalizeProcessor],
})
export class ManagementModule {}
