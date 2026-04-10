import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import {
    BULLMQ_MATCHMAKING_QUEUE,
    BULLMQ_ACCEPT_TIMEOUT_QUEUE,
    BULLMQ_CHAT_READY_TIMEOUT_QUEUE,
} from './constant/queue.constant';
import { MatchmakingProcessor } from './processor/matchmaking.processor';
import { AcceptTimeoutProcessor } from './processor/accept-timeout.processor';
import { ChatReadyTimeoutProcessor } from './processor/chat-ready-timeout.processor';
import { MatchmakingService } from './service/matchmaking.service';
import { ChatReadyAction } from './transport/rmq/action/chat-ready.action';
import { ChatReadyUseCase } from './use-case/chat-ready.use-case';

@Module({
    imports: [
        BullModule.registerQueue({ name: BULLMQ_MATCHMAKING_QUEUE }),
        BullModule.registerQueue({ name: BULLMQ_ACCEPT_TIMEOUT_QUEUE }),
        BullModule.registerQueue({ name: BULLMQ_CHAT_READY_TIMEOUT_QUEUE }),
        BullBoardModule.forFeature({
            name: BULLMQ_MATCHMAKING_QUEUE,
            adapter: BullMQAdapter,
        }),
        BullBoardModule.forFeature({
            name: BULLMQ_ACCEPT_TIMEOUT_QUEUE,
            adapter: BullMQAdapter,
        }),
        BullBoardModule.forFeature({
            name: BULLMQ_CHAT_READY_TIMEOUT_QUEUE,
            adapter: BullMQAdapter,
        }),
    ],
    controllers: [ChatReadyAction],
    providers: [
        MatchmakingProcessor,
        AcceptTimeoutProcessor,
        ChatReadyTimeoutProcessor,
        MatchmakingService,
        ChatReadyUseCase,
    ],
    exports: [MatchmakingService, BullModule],
})
export class MatchModule {}
