import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { CreateRequestContext } from '@mikro-orm/core';
import { ChatEntity, ChatStatus, ChatUserEntity } from '@libs/orm';
import { ChatJoinInput } from '../dto/input/chat-join.input';

@Injectable()
export class JoinChatActionService {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    async invoke(userId: string, data: ChatJoinInput): Promise<void> {
        const chat = await this.orm.em.findOneOrFail(ChatEntity, { id: data.chatId, status: ChatStatus.ACTIVE });

        await this.orm.em.findOneOrFail(ChatUserEntity, { chat, user: { id: userId } });
    }
}
