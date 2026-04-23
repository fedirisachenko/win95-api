import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { RmqService } from '@libs/rmq';
import { ChatEntity, ChatStatus } from '@libs/orm';

@Injectable()
export class ChatStateService {
    constructor(
        private readonly orm: MikroORM,
        private readonly rmq: RmqService,
    ) {}

    @CreateRequestContext()
    async ensureActive(chatId: string): Promise<ChatEntity> {
        const chat = await this.orm.em.findOneOrFail(ChatEntity, { id: chatId, status: ChatStatus.ACTIVE });

        const plannedEnd = chat.startsAt ? chat.startsAt.getTime() + chat.duration * 1000 : 0;

        if (plannedEnd <= Date.now()) {
            await this.rmq.emit('chat:finalize', {
                chatId,
                status: ChatStatus.EXPIRED,
            });
            throw new WsException('Chat has expired');
        }

        return chat;
    }
}
