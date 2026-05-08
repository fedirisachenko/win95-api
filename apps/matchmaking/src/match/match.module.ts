import { Module } from '@nestjs/common';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';

import { ChatReadyActionService } from './action-service/chat-ready.action-service';
import { ACCEPT_TIMEOUT_QUEUE, CHAT_READY_TIMEOUT_QUEUE, MATCH_ATTEMPT_QUEUE } from './constant/queue.constant';
import { AcceptTimeoutProcessor } from './processor/accept-timeout.processor';
import { ChatReadyTimeoutProcessor } from './processor/chat-ready-timeout.processor';
import { MatchAttemptProcessor } from './processor/match-attempt.processor';
import { MatchmakingService } from './service/matchmaking.service';
import { ChatReadyAction } from './transport/rmq/action/chat-ready.action';

@Module({
    imports: [
        BullModule.registerQueue({ name: MATCH_ATTEMPT_QUEUE }),
        BullModule.registerQueue({ name: ACCEPT_TIMEOUT_QUEUE }),
        BullModule.registerQueue({ name: CHAT_READY_TIMEOUT_QUEUE }),
        BullBoardModule.forFeature({
            name: MATCH_ATTEMPT_QUEUE,
            adapter: BullMQAdapter,
        }),
        BullBoardModule.forFeature({
            name: ACCEPT_TIMEOUT_QUEUE,
            adapter: BullMQAdapter,
        }),
        BullBoardModule.forFeature({
            name: CHAT_READY_TIMEOUT_QUEUE,
            adapter: BullMQAdapter,
        }),
    ],
    controllers: [ChatReadyAction],
    providers: [
        MatchAttemptProcessor,
        AcceptTimeoutProcessor,
        ChatReadyTimeoutProcessor,
        MatchmakingService,
        ChatReadyActionService,
    ],
    exports: [MatchmakingService, BullModule],
})
export class MatchModule {}
