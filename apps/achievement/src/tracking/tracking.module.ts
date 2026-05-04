import { Module } from '@nestjs/common';
import { MessageSentAction } from './transport/rmq/action/message-sent.action';
import { ChatFinalizedAction } from './transport/rmq/action/chat-finalized.action';
import { SearchStartedAction } from './transport/rmq/action/search-started.action';
import { TrackSendMessagesUseCase } from './transport/rmq/use-case/track-send-messages.use-case';
import { TrackRapidMessagesUseCase } from './transport/rmq/use-case/track-rapid-messages.use-case';
import { TrackChatTimeUseCase } from './transport/rmq/use-case/track-chat-time.use-case';
import { TrackDailySearchStreakUseCase } from './transport/rmq/use-case/track-daily-search-streak.use-case';
import { TrackKeywordMessagesUseCase } from './transport/rmq/use-case/track-keyword-messages.use-case';
import { TrackRapidChatUseCase } from './transport/rmq/use-case/track-rapid-chat.use-case';
import { CounterTracker } from './tracker/counter.tracker';
import { TimeWindowTracker } from './tracker/time-window.tracker';
import { StreakTracker } from './tracker/streak.tracker';
import { SequenceTracker } from './tracker/sequence.tracker';
import { KeywordTracker } from './tracker/keyword.tracker';

const trackers = [CounterTracker, TimeWindowTracker, StreakTracker, SequenceTracker, KeywordTracker];

@Module({
    controllers: [MessageSentAction, ChatFinalizedAction, SearchStartedAction],
    providers: [
        ...trackers,
        TrackSendMessagesUseCase,
        TrackRapidMessagesUseCase,
        TrackChatTimeUseCase,
        TrackDailySearchStreakUseCase,
        TrackKeywordMessagesUseCase,
        TrackRapidChatUseCase,
    ],
})
export class TrackingModule {}
