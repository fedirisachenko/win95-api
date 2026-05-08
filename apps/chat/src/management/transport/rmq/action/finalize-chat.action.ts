import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { FinalizeChatActionService } from '../../../action-service/finalize-chat.action-service';
import { ChatFinalizeInput } from '../dto/input/chat-finalize.input';

@Controller()
export class FinalizeChatAction {
    constructor(private readonly actionService: FinalizeChatActionService) {}

    @EventPattern('chat:finalized')
    async invoke(@Payload() data: ChatFinalizeInput): Promise<void> {
        await this.actionService.invoke(data);
    }
}
