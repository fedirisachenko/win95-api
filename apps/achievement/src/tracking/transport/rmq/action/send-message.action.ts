import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendMessageInput } from '../dto/input/send-message.input';
import { SendMessageUseCase } from '../use-case/send-message.use-case';

@Controller()
export class SendMessageAction {
    constructor(private readonly useCase: SendMessageUseCase) {}

    @EventPattern('achievement:tracking:send:message')
    async invoke(@Payload() data: SendMessageInput): Promise<void> {
        await this.useCase.invoke(data);
    }
}
