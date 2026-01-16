import { CodeStorageInterface } from '../../contract/code-storage.interface';
import { RedisService } from '@songkeys/nestjs-redis';

export class RedisStorage implements CodeStorageInterface {
    constructor(protected readonly redisService: RedisService) {}

    async set(key: string, value: string, expirationTimeMs?: number): Promise<boolean> {
        if (expirationTimeMs && expirationTimeMs <= 0) {
            return true;
        }

        const client = this.redisService.getClient();

        if (expirationTimeMs) {
            const res = await client.set(key, value, 'PX', expirationTimeMs);
            return res === 'OK';
        }

        const res = await client.set(key, value);
        return res === 'OK';
    }

    async get(key: string, parse = false): Promise<any | null> {
        const client = this.redisService.getClient();
        const data = await client.get(key);

        if (!data) {
            return null;
        }

        return parse ? JSON.parse(data) : data;
    }

    async del(key: string): Promise<boolean> {
        const client = this.redisService.getClient();
        return (await client.del(key)) > 0;
    }

    async exists(key: string): Promise<boolean> {
        const client = this.redisService.getClient();
        return (await client.exists(key)) > 0;
    }
}