import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateChatUseCase } from '../use-case/create-chat.use-case';
import { CreateChatInput } from '../dto/input/create-chat.input';

@Controller()
export class CreateChatAction {
    constructor(private readonly useCase: CreateChatUseCase) {}

    @EventPattern('chat:management:chat:create')
    async invoke(@Payload() data: CreateChatInput): Promise<void> {
        await this.useCase.invoke(data);
    }
}
