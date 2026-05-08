import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

import { AchievementEntity, AchievementType } from '@libs/orm';

import { ACHIEVEMENT_DEFINITION_MAP } from '../../management/constant/achievement.constant';
import { CounterService } from '../service/counter.service';
import { ChatFinalizedInput } from '../transport/rmq/dto/input/chat-finalized.input';

@Injectable()
export class TrackChatTimeActionService {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterService,
    ) {}

    @CreateRequestContext()
    public async invoke(data: ChatFinalizedInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.CHAT_TIME,
        });

        const definition = ACHIEVEMENT_DEFINITION_MAP.get(achievement.type);
        if (this.counter.isMaxTier(achievement, definition.tiers)) return;

        const durationMinutes = Math.floor(data.durationMs / 60_000);
        this.counter.incrementBy(achievement, durationMinutes);
        this.counter.tryAdvanceTier(achievement, definition.tiers);

        await this.orm.em.flush();
    }
}
