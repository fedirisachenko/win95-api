import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { MATCHMAKING_QUEUE } from './constant/queue.constant';
import { MatchmakingProcessor } from './processor/matchmaking.processor';
import { MatchmakingService } from './service/matchmaking.service';

@Module({
    imports: [
        BullModule.registerQueue({ name: MATCHMAKING_QUEUE }),
        BullBoardModule.forFeature({
            name: MATCHMAKING_QUEUE,
            adapter: BullMQAdapter,
        }),
    ],
    providers: [MatchmakingProcessor, MatchmakingService],
    exports: [MatchmakingService],
})
export class MatchModule {}
