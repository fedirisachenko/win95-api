import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

import { AchievementEntity, AchievementType } from '@libs/orm';

import { ACHIEVEMENT_DEFINITION_MAP } from '../../management/constant/achievement.constant';
import { CounterService } from '../service/counter.service';
import { TimeWindowService } from '../service/time-window.service';
import { MessageSentInput } from '../transport/rmq/dto/input/message-sent.input';

@Injectable()
export class TrackRapidMessagesActionService {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterService,
        private readonly timeWindow: TimeWindowService,
    ) {}

    @CreateRequestContext()
    public async invoke(data: MessageSentInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.RAPID_MESSAGES,
        });

        const definition = ACHIEVEMENT_DEFINITION_MAP.get(achievement.type);
        if (!definition.timeWindow) return;

        const start = new Date();

        if (!this.timeWindow.isWithinWindow(achievement, start, definition.timeWindow.windowMs)) {
            this.timeWindow.openWindow(achievement, start);
        }

        this.timeWindow.incrementCount(achievement);

        if (this.timeWindow.getCount(achievement) < definition.timeWindow.countRequired) {
            await this.orm.em.flush();
            return;
        }

        if (!this.counter.isMaxTier(achievement, definition.tiers)) {
            this.counter.increment(achievement);
            this.counter.tryAdvanceTier(achievement, definition.tiers);
        }
        this.timeWindow.openWindow(achievement, start);

        await this.orm.em.flush();
    }
}
