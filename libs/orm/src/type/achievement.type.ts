export type TimeWindowTrackerState = { start: string; count: number };
export type StreakTrackerState = { days: number; lastDate: string };
export type SequenceTrackerState = { count: number };

export type AchievementMetadata = {
    timeWindow?: TimeWindowTrackerState;
    streak?: StreakTrackerState;
    sequence?: SequenceTrackerState;
};
