import { Injectable } from '@nestjs/common';
import { AchievementEntity } from '@libs/orm';

@Injectable()
export class StreakTracker {
    public advance(achievement: AchievementEntity, now: Date): void {
        const currentStreak = achievement.metadata.streak;
        const diffDays = currentStreak ? this.daysDiff(new Date(currentStreak.lastDate), now) : null;

        achievement.metadata.streak = {
            days: diffDays === 1 ? currentStreak!.days + 1 : 1,
            lastDate: now.toISOString(),
        };
    }

    public getCurrentStreak(achievement: AchievementEntity): number {
        return achievement.metadata.streak?.days ?? 0;
    }

    public isMaxTier(achievement: AchievementEntity, tiers: number[]): boolean {
        return achievement.currentTier + 1 >= tiers.length;
    }

    public tryAdvanceTier(achievement: AchievementEntity, tiers: number[]): void {
        const nextTierGoal = tiers[achievement.currentTier + 1];
        if (nextTierGoal && this.getCurrentStreak(achievement) >= nextTierGoal) {
            achievement.currentTier += 1;
        }
    }

    private daysDiff(from: Date, to: Date): number {
        return Math.round((to.getTime() - from.getTime()) / 86_400_000);
    }
}
