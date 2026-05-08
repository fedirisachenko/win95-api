import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { RmqService } from '@libs/rmq';

import { CreateChatActionService } from '../../../action-service/create-chat.action-service';
import { CreateChatInput } from '../dto/input/create-chat.input';

@Controller()
export class CreateChatAction {
    constructor(
        private readonly actionService: CreateChatActionService,
        private readonly rmq: RmqService,
    ) {}

    @EventPattern('match:accepted')
    async invoke(@Payload() data: CreateChatInput): Promise<void> {
        const chatId = await this.actionService.invoke(data);

        await this.rmq.emit('chat:created', {
            chatId,
            userIds: data.userIds,
        });
    }
}
