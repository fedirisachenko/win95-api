import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RmqService } from '@libs/rmq';
import { CreateChatUseCase } from '../use-case/create-chat.use-case';
import { CreateChatInput } from '../dto/input/create-chat.input';

@Controller()
export class CreateChatAction {
    constructor(
        private readonly useCase: CreateChatUseCase,
        private readonly rmq: RmqService,
    ) {}

    @EventPattern('match:accepted')
    async invoke(@Payload() data: CreateChatInput): Promise<void> {
        const chatId = await this.useCase.invoke(data);

        await this.rmq.emit('chat:created', {
            chatId,
            userIds: data.userIds,
        });
    }
}
