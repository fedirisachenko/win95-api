import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatFinalizedInput } from '../dto/input/chat-finalized.input';
import { TrackChatTimeUseCase } from '../use-case/track-chat-time.use-case';
import { TrackRapidChatUseCase } from '../use-case/track-rapid-chat.use-case';

@Controller()
export class ChatFinalizedAction {
    constructor(
        private readonly trackChatTime: TrackChatTimeUseCase,
        private readonly trackRapidChat: TrackRapidChatUseCase,
    ) {}

    @EventPattern('chat:finalized')
    async invoke(@Payload() data: ChatFinalizedInput): Promise<void> {
        await this.trackChatTime.invoke(data);
        await this.trackRapidChat.invoke(data);
    }
}
