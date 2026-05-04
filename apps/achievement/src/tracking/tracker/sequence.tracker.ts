import { Injectable } from '@nestjs/common';
import { AchievementEntity } from '@libs/orm';

@Injectable()
export class SequenceTracker {
    public increment(achievement: AchievementEntity): void {
        achievement.metadata.sequence = {
            count: (achievement.metadata.sequence?.count ?? 0) + 1,
        };
    }

    public reset(achievement: AchievementEntity): void {
        achievement.metadata.sequence = { count: 0 };
    }

    public getCount(achievement: AchievementEntity): number {
        return achievement.metadata.sequence?.count ?? 0;
    }
}
