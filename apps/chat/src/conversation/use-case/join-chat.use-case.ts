import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { ChatEntity, ChatStatus, ChatUserEntity } from '@libs/orm';
import { ChatJoinInput } from '../transport/ws/dto';

@Injectable()
export class JoinChatUseCase {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    async invoke(userId: string, data: ChatJoinInput): Promise<void> {
        const chat = await this.orm.em.findOneOrFail(ChatEntity, { id: data.chatId, status: ChatStatus.ACTIVE });

        await this.orm.em.findOneOrFail(ChatUserEntity, { chat, user: { id: userId } });
    }
}
