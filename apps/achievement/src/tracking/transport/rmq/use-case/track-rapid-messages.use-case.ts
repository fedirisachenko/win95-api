import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';
import { ACHIEVEMENT_DEFINITION_MAP } from '../../../../management/constant/achievement.constant';
import { CounterTracker } from '../../../tracker/counter.tracker';
import { TimeWindowTracker } from '../../../tracker/time-window.tracker';
import { MessageSentInput } from '../dto/input/message-sent.input';

@Injectable()
export class TrackRapidMessagesUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterTracker,
        private readonly timeWindow: TimeWindowTracker,
    ) {}

    @CreateRequestContext()
    public async invoke(data: MessageSentInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.RAPID_MESSAGES,
        });

        const definition = ACHIEVEMENT_DEFINITION_MAP.get(achievement.type);
        if (!definition.timeWindow) {
            return;
        }
        const start = new Date();

        if (!this.timeWindow.isWithinWindow(achievement, start, definition.timeWindow.windowMs)) {
            this.timeWindow.openWindow(achievement, start);
        }

        this.timeWindow.incrementCount(achievement);

        if (this.timeWindow.getCount(achievement) >= definition.timeWindow.countRequired) {
            if (!this.counter.isMaxTier(achievement, definition.tiers)) {
                this.counter.increment(achievement);
                this.counter.tryAdvanceTier(achievement, definition.tiers);
            }
            this.timeWindow.openWindow(achievement, start);
        }

        await this.orm.em.flush();
    }
}
