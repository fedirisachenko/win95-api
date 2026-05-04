import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageSentInput } from '../dto/input/message-sent.input';
import { TrackSendMessagesUseCase } from '../use-case/track-send-messages.use-case';
import { TrackRapidMessagesUseCase } from '../use-case/track-rapid-messages.use-case';
import { TrackKeywordMessagesUseCase } from '../use-case/track-keyword-messages.use-case';

@Controller()
export class MessageSentAction {
    constructor(
        private readonly trackSendMessages: TrackSendMessagesUseCase,
        private readonly trackRapidMessages: TrackRapidMessagesUseCase,
        private readonly trackKeywordMessages: TrackKeywordMessagesUseCase,
    ) {}

    @EventPattern('chat:message-sent')
    async invoke(@Payload() data: MessageSentInput): Promise<void> {
        await this.trackSendMessages.invoke(data);
        await this.trackRapidMessages.invoke(data);
        await this.trackKeywordMessages.invoke(data);
    }
}
