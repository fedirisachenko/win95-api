export type TimeWindowConfig = { windowMs: number; countRequired: number };
export type SequenceConfig = { countRequired: number; maxDurationMs: number };
export type KeywordConfig = { value: string };
export type PrerequisiteConfig = { type: number; minTier?: number };

export type AchievementDefinition = {
    type: number;
    tiers: number[];
    timeWindow?: TimeWindowConfig;
    sequence?: SequenceConfig;
    keyword?: KeywordConfig;
    prerequisite?: PrerequisiteConfig;
};
