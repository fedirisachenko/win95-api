import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatReadyUseCase } from '../../../use-case/chat-ready.use-case';
import { ChatReadyInput } from '../dto/input/chat-ready.input';

@Controller()
export class ChatReadyAction {
    constructor(private readonly useCase: ChatReadyUseCase) {}

    @EventPattern('chat:ready')
    async invoke(@Payload() data: ChatReadyInput): Promise<void> {
        await this.useCase.invoke(data);
    }
}
