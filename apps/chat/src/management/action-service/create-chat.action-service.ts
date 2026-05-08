import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM, ref } from '@mikro-orm/core';

import { ChatEntity, ChatParticipantEntity, ChatStatus, MatchEntity, UserEntity } from '@libs/orm';

import { ChatLifecycleService } from '../service/chat-lifecycle.service';
import { CreateChatInput } from '../transport/rmq/dto/input/create-chat.input';

@Injectable()
export class CreateChatActionService {
    constructor(
        private readonly orm: MikroORM,
        private readonly chatLifecycle: ChatLifecycleService,
    ) {}

    @CreateRequestContext()
    async invoke(data: CreateChatInput): Promise<string> {
        const match = await this.orm.em.findOneOrFail(MatchEntity, { id: data.matchId });

        let chatId: string;

        await this.orm.em.transactional(async (em) => {
            const chat = em.create(ChatEntity, {
                match: ref(match),
                status: ChatStatus.ACTIVE,
                duration: data.duration,
                maxParticipants: data.userIds.length,
                startsAt: new Date(),
            });

            for (const userId of data.userIds) {
                em.create(ChatParticipantEntity, {
                    chat: ref(chat),
                    user: em.getReference(UserEntity, userId),
                });
            }

            await em.flush();

            chatId = chat.id;
        });

        await this.chatLifecycle.scheduleFinalization(chatId, data.duration);

        return chatId;
    }
}
