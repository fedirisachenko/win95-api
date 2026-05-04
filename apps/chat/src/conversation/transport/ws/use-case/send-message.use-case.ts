import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { ChatEntity, ChatStatus, ChatMessageEntity, UserEntity } from '@libs/orm';
import { SendMessageInput } from '../dto/input/send-message.input';

@Injectable()
export class SendMessageUseCase {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SendMessageInput): Promise<ChatMessageEntity> {
        const chat = await this.orm.em.findOneOrFail(ChatEntity, { id: data.chatId, status: ChatStatus.ACTIVE });

        const message = this.orm.em.create(ChatMessageEntity, {
            chat,
            sender: this.orm.em.getReference(UserEntity, userId),
            text: data.text,
        });

        await this.orm.em.persistAndFlush(message);

        return message;
    }
}
