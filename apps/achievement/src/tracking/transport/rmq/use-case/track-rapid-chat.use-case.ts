import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { AchievementEntity, AchievementType } from '@libs/orm';
import { ACHIEVEMENT_DEFINITION_MAP } from '../../../../management/constant/achievement.constant';
import { CounterTracker } from '../../../tracker/counter.tracker';
import { SequenceTracker } from '../../../tracker/sequence.tracker';
import { ChatFinalizedInput } from '../dto/input/chat-finalized.input';

@Injectable()
export class TrackRapidChatUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly counter: CounterTracker,
        private readonly sequence: SequenceTracker,
    ) {}

    @CreateRequestContext()
    public async invoke(data: ChatFinalizedInput): Promise<void> {
        const definition = ACHIEVEMENT_DEFINITION_MAP.get(AchievementType.RAPID_CHAT);

        if (!definition.prerequisite) {
            return;
        }

        if (!definition.sequence) {
            return;
        }

        const prerequisite = await this.orm.em.findOne(AchievementEntity, {
            user: { id: data.userId },
            type: definition.prerequisite.type,
        });

        if (!prerequisite || prerequisite.currentTier < definition.prerequisite.minTier) {
            return;
        }

        const achievement = await this.orm.em.findOneOrFail(AchievementEntity, {
            user: { id: data.userId },
            type: AchievementType.RAPID_CHAT,
        });

        if (data.durationMs > definition.sequence.maxDurationMs) {
            this.sequence.reset(achievement);
            await this.orm.em.flush();

            return;
        }

        this.sequence.increment(achievement);

        if (this.sequence.getCount(achievement) >= definition.sequence.countRequired) {
            if (!this.counter.isMaxTier(achievement, definition.tiers)) {
                this.counter.increment(achievement);
                this.counter.tryAdvanceTier(achievement, definition.tiers);
            }
            this.sequence.reset(achievement);
        }
        await this.orm.em.flush();
        return;
    }
}
