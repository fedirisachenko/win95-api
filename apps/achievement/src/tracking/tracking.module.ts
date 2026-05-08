import { Module } from '@nestjs/common';

import { TrackChatTimeActionService } from './action-service/track-chat-time.action-service';
import { TrackDailySearchStreakActionService } from './action-service/track-daily-search-streak.action-service';
import { TrackKeywordMessagesActionService } from './action-service/track-keyword-messages.action-service';
import { TrackRapidChatActionService } from './action-service/track-rapid-chat.action-service';
import { TrackRapidMessagesActionService } from './action-service/track-rapid-messages.action-service';
import { TrackSendMessagesActionService } from './action-service/track-send-messages.action-service';
import { CounterService } from './service/counter.service';
import { KeywordService } from './service/keyword.service';
import { SequenceService } from './service/sequence.service';
import { StreakService } from './service/streak.service';
import { TimeWindowService } from './service/time-window.service';
import { ChatFinalizedAction } from './transport/rmq/action/chat-finalized.action';
import { MessageSentAction } from './transport/rmq/action/message-sent.action';
import { SearchStartedAction } from './transport/rmq/action/search-started.action';

const services = [CounterService, TimeWindowService, StreakService, SequenceService, KeywordService];
const actionServices = [
    TrackSendMessagesActionService,
    TrackRapidMessagesActionService,
    TrackChatTimeActionService,
    TrackDailySearchStreakActionService,
    TrackKeywordMessagesActionService,
    TrackRapidChatActionService,
];

@Module({
    controllers: [MessageSentAction, ChatFinalizedAction, SearchStartedAction],
    providers: [...services, ...actionServices],
})
export class TrackingModule {}
