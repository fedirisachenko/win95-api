import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { hash } from 'bcrypt';
import { UserEntity } from '@libs/orm';

export class UserSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const password = await hash('password123', 10);

        em.create(UserEntity, {
            email: 'user1@example.com',
            password,
            name: 'John Doe',
            emailVerified: true,
        });

        em.create(UserEntity, {
            email: 'user2@example.com',
            password,
            name: 'Jane Doe',
            emailVerified: true,
        });

        await em.flush();
    }
}
