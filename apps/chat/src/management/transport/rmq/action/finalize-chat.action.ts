import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FinalizeChatUseCase } from '../use-case/finalize-chat.use-case';
import { ChatFinalizeInput } from '../dto/input/chat-finalize.input';

@Controller()
export class FinalizeChatAction {
    constructor(private readonly useCase: FinalizeChatUseCase) {}

    @EventPattern('chat:finalize')
    async invoke(@Payload() data: ChatFinalizeInput): Promise<void> {
        await this.useCase.invoke(data);
    }
}
