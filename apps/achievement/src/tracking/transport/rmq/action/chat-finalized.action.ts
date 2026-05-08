import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { TrackChatTimeActionService } from '../../../action-service/track-chat-time.action-service';
import { TrackRapidChatActionService } from '../../../action-service/track-rapid-chat.action-service';
import { ChatFinalizedInput } from '../dto/input/chat-finalized.input';

@Controller()
export class ChatFinalizedAction {
    constructor(
        private readonly trackChatTime: TrackChatTimeActionService,
        private readonly trackRapidChat: TrackRapidChatActionService,
    ) {}

    @EventPattern('chat:finalized')
    async invoke(@Payload() data: ChatFinalizedInput): Promise<void> {
        await this.trackChatTime.invoke(data);
        await this.trackRapidChat.invoke(data);
    }
}
