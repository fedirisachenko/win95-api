// app-wide — Redis key builders consumed by both `match` and `search`.
// Keep here so both features see the same key shape.
export const RedisKey = {
    matchAttemptQueue: (duration: number, language: string) => `mm:queue:${duration}:${language}`,
    matchmakingUser: (userId: string) => `mm:user:${userId}`,
    matchmakingAccept: (searchMatchId: string) => `mm:accept:${searchMatchId}`,
} as const;
