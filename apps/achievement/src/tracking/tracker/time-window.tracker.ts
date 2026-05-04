import { Injectable } from '@nestjs/common';
import { AchievementEntity } from '@libs/orm';

@Injectable()
export class TimeWindowTracker {
    public isWithinWindow(achievement: AchievementEntity, start: Date, windowMs: number): boolean {
        const timeWindow = achievement.metadata.timeWindow;
        if (!timeWindow) return false;

        return start.getTime() - new Date(timeWindow.start).getTime() <= windowMs;
    }

    public openWindow(achievement: AchievementEntity, start: Date): void {
        achievement.metadata.timeWindow = { start: start.toISOString(), count: 0 };
    }

    public incrementCount(achievement: AchievementEntity): void {
        if (!achievement.metadata.timeWindow) return;

        achievement.metadata.timeWindow.count += 1;
    }

    public getCount(achievement: AchievementEntity): number {
        return achievement.metadata.timeWindow?.count ?? 0;
    }
}
