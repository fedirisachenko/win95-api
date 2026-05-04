export const RedisKey = {
    matchAttemptQueue: (duration: number, language: string) => `mm:queue:${duration}:${language}`,
    matchmakingUser: (userId: string) => `mm:user:${userId}`,
    matchmakingAccept: (searchMatchId: string) => `mm:accept:${searchMatchId}`,
} as const;
