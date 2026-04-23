import { Injectable } from '@nestjs/common';
import { CreateRequestContext } from '@mikro-orm/core';
import { ChatLifecycleService } from '../../../service/chat-lifecycle.service';
import { ChatFinalizeInput } from '../dto/input/chat-finalize.input';

@Injectable()
export class FinalizeChatUseCase {
    constructor(private readonly chatLifecycleService: ChatLifecycleService) {}

    @CreateRequestContext()
    async invoke(data: ChatFinalizeInput): Promise<void> {
        await this.chatLifecycleService.finalize({
            chatId: data.chatId,
            status: data.status,
        });
    }
}
