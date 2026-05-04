import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';
import { ACHIEVEMENT_DEFINITION_MAP } from '../../../../management/constant/achievement.constant';
import { CounterTracker } from '../../../tracker/counter.tracker';
import { KeywordTracker } from '../../../tracker/keyword.tracker';
import { MessageSentInput } from '../dto/input/message-sent.input';

@Injectable()
export class TrackKeywordMessagesUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterTracker,
        private readonly keyword: KeywordTracker,
    ) {}

    @CreateRequestContext()
    public async invoke(data: MessageSentInput): Promise<void> {
        const definition = ACHIEVEMENT_DEFINITION_MAP.get(AchievementType.KEYWORD_MESSAGES)!;

        if (!this.keyword.containsKeyword(data.message, definition.keyword.value)) {
            return;
        }

        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.KEYWORD_MESSAGES,
        });

        if (!this.counter.isMaxTier(achievement, definition.tiers)) {
            this.counter.increment(achievement);
            this.counter.tryAdvanceTier(achievement, definition.tiers);
        }

        await this.orm.em.flush();
    }
}
