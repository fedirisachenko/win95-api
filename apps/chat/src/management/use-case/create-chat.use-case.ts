import { Inject, Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext, ref } from '@mikro-orm/core';
import { ClientProxy } from '@nestjs/microservices';
import { ChatEntity, ChatUserEntity, ChatStatus, UserEntity, SearchMatchEntity } from '@libs/orm';
import { CreateChatInput } from '../transport/rmq/dto/input/create-chat.input';
import { MATCHMAKING_SERVICE } from '../../constant/di-token.constant';

@Injectable()
export class CreateChatUseCase {
    constructor(
        private readonly orm: MikroORM,
        @Inject(MATCHMAKING_SERVICE) private readonly matchmakingClient: ClientProxy,
    ) {}

    @CreateRequestContext()
    async invoke(data: CreateChatInput): Promise<void> {
        const existingChat = await this.orm.em.findOne(ChatEntity, {
            searchMatch: { id: data.searchMatchId },
        });

        if (existingChat) {
            return;
        }

        const searchMatch = await this.orm.em.findOneOrFail(SearchMatchEntity, { id: data.searchMatchId });

        await this.orm.em.transactional(async (em) => {
            const chat = em.create(ChatEntity, {
                searchMatch: ref(searchMatch),
                status: ChatStatus.ACTIVE,
                duration: data.duration,
                maxParticipants: data.userIds.length,
                startsAt: new Date(),
                expiresAt: new Date(Date.now() + data.duration * 1000),
            });

            await Promise.all(
                data.userIds.map((userId) => {
                    em.create(ChatUserEntity, {
                        chat: ref(chat),
                        user: em.getReference(UserEntity, userId),
                    });
                }),
            );

            await em.flush();

            this.matchmakingClient.emit('chat:ready', {
                chatId: chat.id,
                userIds: data.userIds,
            });
        });
    }
}
