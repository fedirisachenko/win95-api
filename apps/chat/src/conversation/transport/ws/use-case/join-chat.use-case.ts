import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { ChatEntity, ChatStatus, ChatParticipantEntity } from '@libs/orm';
import { ChatJoinInput } from '../dto/input/chat-join.input';

@Injectable()
export class JoinChatUseCase {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    async invoke(userId: string, data: ChatJoinInput): Promise<void> {
        const chat = await this.orm.em.findOneOrFail(ChatEntity, { id: data.chatId, status: ChatStatus.ACTIVE });

        await this.orm.em.findOneOrFail(ChatParticipantEntity, { chat, user: { id: userId } });
    }
}
