import { AchievementMetadata, AchievementType } from '@libs/orm';

export const ACHIEVEMENTS: Array<{ type: number; metadata: AchievementMetadata }> = [
    { type: AchievementType.SEND_MESSAGES, metadata: { goals: [10, 50, 100] } },
];
