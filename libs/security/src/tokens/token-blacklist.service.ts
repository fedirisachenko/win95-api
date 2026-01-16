import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
    private blacklist = new Set<string>();

    add(token: string): void {
        this.blacklist.add(token);
    }

    isBlacklisted(token: string): boolean {
        return this.blacklist.has(token);
    }

    remove(token: string): void {
        this.blacklist.delete(token);
    }

    clear(): void {
        this.blacklist.clear();
    }
}
