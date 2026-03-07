import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { ChatEntity, ChatStatus, MessageEntity, UserEntity } from '@libs/orm';
import { SendMessageInput } from '../dto/input/send-message.input';
import { CreateRequestContext } from '@mikro-orm/core';

@Injectable()
export class SendMessageActionService {
    constructor(private readonly orm: MikroORM) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SendMessageInput): Promise<MessageEntity> {
        const chat = await this.orm.em.findOneOrFail(ChatEntity, { id: data.chatId, status: ChatStatus.ACTIVE });

        const message = this.orm.em.create(MessageEntity, {
            chat,
            sender: this.orm.em.getReference(UserEntity, userId),
            text: data.text,
        });

        await this.orm.em.persistAndFlush(message);

        return message;
    }
}
