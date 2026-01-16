import { Inject, Injectable } from '@nestjs/common';
import { CODE_STORAGE, CodeStorageInterface } from '../contract/code-storage.interface';

const BLACKLIST_PREFIX = 'token_blacklist:';
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

@Injectable()
export class TokenBlacklistService {
    constructor(
        @Inject(CODE_STORAGE)
        private readonly codeStorage: CodeStorageInterface,
    ) {}

    async add(token: string, ttlMs: number = DEFAULT_TTL_MS): Promise<void> {
        const key = this.getKey(token);
        await this.codeStorage.set(key, '1', ttlMs);
    }

    async isBlacklisted(token: string): Promise<boolean> {
        const key = this.getKey(token);
        return this.codeStorage.exists(key);
    }

    async remove(token: string): Promise<void> {
        const key = this.getKey(token);
        await this.codeStorage.del(key);
    }

    private getKey(token: string): string {
        return `${BLACKLIST_PREFIX}${token}`;
    }
}