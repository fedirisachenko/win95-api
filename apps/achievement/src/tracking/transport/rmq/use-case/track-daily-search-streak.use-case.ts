import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';
import { ACHIEVEMENT_DEFINITION_MAP } from '../../../../management/constant/achievement.constant';
import { StreakTracker } from '../../../tracker/streak.tracker';
import { SearchStartedInput } from '../dto/input/search-started.input';

@Injectable()
export class TrackDailySearchStreakUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly streak: StreakTracker,
    ) {}

    @CreateRequestContext()
    public async invoke(data: SearchStartedInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.DAILY_SEARCH_STREAK,
        });

        const definition = ACHIEVEMENT_DEFINITION_MAP.get(achievement.type);

        this.streak.advance(achievement, new Date());

        if (!this.streak.isMaxTier(achievement, definition.tiers)) {
            this.streak.tryAdvanceTier(achievement, definition.tiers);
        }

        await this.orm.em.flush();
    }
}
