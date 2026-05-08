import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ExpireChatActionService } from '../../../action-service/expire-chat.action-service';
import { ChatExpireInput } from '../dto/input/chat-expire.input';

@Controller()
export class ChatExpireAction {
    constructor(private readonly actionService: ExpireChatActionService) {}

    @EventPattern('chat:expired')
    async invoke(@Payload() data: ChatExpireInput): Promise<void> {
        await this.actionService.invoke(data);
    }
}
