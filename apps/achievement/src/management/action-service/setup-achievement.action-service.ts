import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { AchievementEntity, UserEntity } from '@libs/orm';

import { ACHIEVEMENT_DEFINITIONS } from '../constant/achievement.constant';
import { SetupAchievementInput } from '../transport/rmq/dto/input/setup-achievement.input';

@Injectable()
export class SetupAchievementActionService {
    constructor(private readonly em: EntityManager) {}

    public async invoke(input: SetupAchievementInput): Promise<void> {
        const achievements = ACHIEVEMENT_DEFINITIONS.map(({ type }) =>
            this.em.create(AchievementEntity, {
                type,
                user: this.em.getReference(UserEntity, input.userId),
            }),
        );

        await this.em.persistAndFlush(achievements);
    }
}
