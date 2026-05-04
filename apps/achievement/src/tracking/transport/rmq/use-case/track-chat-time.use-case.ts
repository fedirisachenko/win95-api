import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';
import { ACHIEVEMENT_DEFINITION_MAP } from '../../../../management/constant/achievement.constant';
import { CounterTracker } from '../../../tracker/counter.tracker';
import { ChatFinalizedInput } from '../dto/input/chat-finalized.input';

@Injectable()
export class TrackChatTimeUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterTracker,
    ) {}

    @CreateRequestContext()
    public async invoke(data: ChatFinalizedInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.CHAT_TIME,
        });

        const definition = ACHIEVEMENT_DEFINITION_MAP.get(achievement.type);
        const durationMinutes = Math.floor(data.durationMs / 60_000);

        if (!this.counter.isMaxTier(achievement, definition.tiers)) {
            this.counter.incrementBy(achievement, durationMinutes);
            this.counter.tryAdvanceTier(achievement, definition.tiers);
        }

        await this.orm.em.flush();
    }
}
