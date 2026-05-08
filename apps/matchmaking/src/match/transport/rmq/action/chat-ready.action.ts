import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ChatReadyActionService } from '../../../action-service/chat-ready.action-service';
import { ChatReadyInput } from '../dto/input/chat-ready.input';

@Controller()
export class ChatReadyAction {
    constructor(private readonly actionService: ChatReadyActionService) {}

    @EventPattern('chat:created')
    async invoke(@Payload() data: ChatReadyInput): Promise<void> {
        await this.actionService.invoke(data);
    }
}
