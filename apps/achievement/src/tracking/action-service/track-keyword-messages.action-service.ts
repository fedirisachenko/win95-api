import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

import { AchievementEntity, AchievementType } from '@libs/orm';

import { ACHIEVEMENT_DEFINITION_MAP } from '../../management/constant/achievement.constant';
import { CounterService } from '../service/counter.service';
import { KeywordService } from '../service/keyword.service';
import { MessageSentInput } from '../transport/rmq/dto/input/message-sent.input';

@Injectable()
export class TrackKeywordMessagesActionService {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterService,
        private readonly keyword: KeywordService,
    ) {}

    @CreateRequestContext()
    public async invoke(data: MessageSentInput): Promise<void> {
        const definition = ACHIEVEMENT_DEFINITION_MAP.get(AchievementType.KEYWORD_MESSAGES);
        if (!this.keyword.containsKeyword(data.message, definition.keyword.value)) return;

        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.KEYWORD_MESSAGES,
        });
        if (this.counter.isMaxTier(achievement, definition.tiers)) return;

        this.counter.increment(achievement);
        this.counter.tryAdvanceTier(achievement, definition.tiers);

        await this.orm.em.flush();
    }
}
