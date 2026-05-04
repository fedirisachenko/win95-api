import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ExpireChatUseCase } from '../use-case/expire-chat.use-case';
import { ChatExpireInput } from '../dto/input/chat-expire.input';

@Controller()
export class ChatExpireAction {
    constructor(private readonly useCase: ExpireChatUseCase) {}

    @EventPattern('chat:expired')
    async invoke(@Payload() data: ChatExpireInput): Promise<void> {
        await this.useCase.invoke(data);
    }
}
