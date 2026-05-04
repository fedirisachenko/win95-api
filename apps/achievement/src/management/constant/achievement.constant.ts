import { AchievementType } from '@libs/orm';
import { AchievementDefinition } from '../type/achievement-definition.type';

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
    { type: AchievementType.SEND_MESSAGES, tiers: [10, 50, 100] },
    { type: AchievementType.RAPID_MESSAGES, tiers: [1, 3, 5], timeWindow: { countRequired: 5, windowMs: 300_000 } },
    { type: AchievementType.CHAT_TIME, tiers: [60, 300, 1000] },
    { type: AchievementType.DAILY_SEARCH_STREAK, tiers: [3, 5, 10] },
    { type: AchievementType.KEYWORD_MESSAGES, tiers: [5, 15, 30], keyword: { value: 'jabascript' } },
    {
        type: AchievementType.RAPID_CHAT,
        tiers: [1, 3, 5],
        sequence: { countRequired: 3, maxDurationMs: 180_000 },
        prerequisite: { type: AchievementType.RAPID_MESSAGES, minTier: 1 },
    },
];

export const ACHIEVEMENT_DEFINITION_MAP = new Map(
    ACHIEVEMENT_DEFINITIONS.map((definition) => [definition.type, definition]),
);
