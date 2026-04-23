import { QueueOptions } from 'bullmq';

const url = new URL(process.env.BULLMQ_REDIS_URL || 'redis://localhost:63792');

export default {
    connection: {
        host: url.hostname,
        port: parseInt(url.port, 10),
    },
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: { count: 100 },
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
} as QueueOptions;
