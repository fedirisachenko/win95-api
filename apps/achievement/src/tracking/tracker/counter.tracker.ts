import { Injectable } from '@nestjs/common';
import { AchievementEntity } from '@libs/orm';

@Injectable()
export class CounterTracker {
    public isMaxTier(achievement: AchievementEntity, tiers: number[]): boolean {
        return achievement.currentTier + 1 >= tiers.length;
    }

    public increment(achievement: AchievementEntity): void {
        achievement.progress += 1;
    }

    public incrementBy(achievement: AchievementEntity, amount: number): void {
        achievement.progress += amount;
    }

    public tryAdvanceTier(achievement: AchievementEntity, tiers: number[]): void {
        const next = tiers[achievement.currentTier + 1];
        if (next && achievement.progress >= next) {
            achievement.currentTier += 1;
        }
    }
}
