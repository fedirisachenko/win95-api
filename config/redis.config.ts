export default {
    config: {
        url: process.env.REDIS_URL || 'redis://localhost:63791',
        retryStrategy: (times: number) => Math.min(times * 30, 1000),
        reconnectOnError: () => false,
    },
    closeClient: true,
    readyLog: true,
    errorLog: true,
};
