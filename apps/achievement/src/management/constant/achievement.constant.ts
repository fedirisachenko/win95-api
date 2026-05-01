import { AchievementType } from '@libs/orm';

export const ACHIEVEMENT_GOALS: Record<number, number[]> = {
    [AchievementType.SEND_MESSAGES]: [10, 50, 100],
};

export const ACHIEVEMENTS: Array<{ type: number }> = [{ type: AchievementType.SEND_MESSAGES }];
