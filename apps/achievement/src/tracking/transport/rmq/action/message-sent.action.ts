import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { TrackKeywordMessagesActionService } from '../../../action-service/track-keyword-messages.action-service';
import { TrackRapidMessagesActionService } from '../../../action-service/track-rapid-messages.action-service';
import { TrackSendMessagesActionService } from '../../../action-service/track-send-messages.action-service';
import { MessageSentInput } from '../dto/input/message-sent.input';

@Controller()
export class MessageSentAction {
    constructor(
        private readonly trackSendMessages: TrackSendMessagesActionService,
        private readonly trackRapidMessages: TrackRapidMessagesActionService,
        private readonly trackKeywordMessages: TrackKeywordMessagesActionService,
    ) {}

    @EventPattern('chat:message-sent')
    async invoke(@Payload() data: MessageSentInput): Promise<void> {
        await this.trackSendMessages.invoke(data);
        await this.trackRapidMessages.invoke(data);
        await this.trackKeywordMessages.invoke(data);
    }
}
