import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext, ref } from '@mikro-orm/core';
import { RmqService } from '@libs/rmq';
import { ChatEntity, ChatParticipantEntity, ChatStatus, UserEntity, MatchEntity } from '@libs/orm';
import { CreateChatInput } from '../dto/input/create-chat.input';
import { ChatLifecycleService } from '../../../service/chat-lifecycle.service';

@Injectable()
export class CreateChatUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly rmq: RmqService,
        private readonly chatLifecycle: ChatLifecycleService,
    ) {}

    @CreateRequestContext()
    async invoke(data: CreateChatInput): Promise<void> {
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

            await Promise.all(
                data.userIds.map((userId) => {
                    em.create(ChatParticipantEntity, {
                        chat: ref(chat),
                        user: em.getReference(UserEntity, userId),
                    });
                }),
            );

            await em.flush();

            chatId = chat.id;
        });

        await this.chatLifecycle.scheduleFinalization(chatId, data.duration);

        await this.rmq.emit('chat:created', {
            chatId,
            userIds: data.userIds,
        });
    }
}
