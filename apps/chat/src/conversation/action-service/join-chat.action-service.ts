import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

import { ChatParticipantEntity, ChatStatus } from '@libs/orm';

import { ChatJoinInput } from '../transport/ws/dto/input/chat-join.input';

@Injectable()
export class JoinChatActionService {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    async invoke(userId: string, data: ChatJoinInput): Promise<void> {
        await this.orm.em.findOneOrFail(ChatParticipantEntity, {
            chat: { id: data.chatId, status: ChatStatus.ACTIVE },
            user: { id: userId },
        });
    }
}
