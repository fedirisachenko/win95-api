import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';
import { ACHIEVEMENT_DEFINITION_MAP } from '../../../../management/constant/achievement.constant';
import { CounterTracker } from '../../../tracker/counter.tracker';
import { MessageSentInput } from '../dto/input/message-sent.input';

@Injectable()
export class TrackSendMessagesUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterTracker,
    ) {}

    @CreateRequestContext()
    public async invoke(data: MessageSentInput): Promise<void> {
        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.SEND_MESSAGES,
        });

        const definition = ACHIEVEMENT_DEFINITION_MAP.get(achievement.type);

        if (!this.counter.isMaxTier(achievement, definition.tiers)) {
            this.counter.increment(achievement);
            this.counter.tryAdvanceTier(achievement, definition.tiers);
        }

        await this.orm.em.flush();
    }
}
