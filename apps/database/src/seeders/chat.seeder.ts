import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ChatEntity, ChatStatus, ChatParticipantEntity, UserEntity } from '@libs/orm';

const DURATION = 1800; // 30 minutes

export class ChatSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const [user1, user2] = await Promise.all([
            em.findOneOrFail(UserEntity, { email: 'user1@example.com' }),
            em.findOneOrFail(UserEntity, { email: 'user2@example.com' }),
        ]);

        const startsAt = new Date();

        const chat = em.create(ChatEntity, {
            status: ChatStatus.ACTIVE,
            duration: DURATION,
            maxParticipants: 2,
            startsAt,
        });

        em.create(ChatParticipantEntity, { chat, user: user1 });
        em.create(ChatParticipantEntity, { chat, user: user2 });

        await em.flush();
    }
}
