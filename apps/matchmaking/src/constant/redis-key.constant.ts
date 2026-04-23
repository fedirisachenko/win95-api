export const RedisKey = {
    matchmakingQueue: (duration: number, language: string) => `mm:queue:${duration}:${language}`,
    matchmakingUser: (userId: string) => `mm:user:${userId}`,
    matchmakingAccept: (searchMatchId: string) => `mm:accept:${searchMatchId}`,
} as const;
