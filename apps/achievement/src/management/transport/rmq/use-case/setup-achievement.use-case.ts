import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { ACHIEVEMENTS } from '../../../constant/achievement.constant';
import { AchievementEntity, UserEntity } from '@libs/orm';
import { SetupAchievementInput } from '../dto/input/setup-achievement.input';

@Injectable()
export class SetupAchievementUseCase {
    constructor(private readonly em: EntityManager) {}

    public async invoke(input: SetupAchievementInput): Promise<void> {
        const achievements = ACHIEVEMENTS.map(({ type }) =>
            this.em.create(AchievementEntity, {
                type,
                user: this.em.getReference(UserEntity, input.userId),
            }),
        );

        await this.em.persistAndFlush(achievements);
    }
}
