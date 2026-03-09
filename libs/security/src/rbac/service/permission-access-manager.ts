import { Inject, Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { UserEntity } from '@libs/orm';
import { CODE_STORAGE } from '../../constant/di-token.constant';
import { CodeStorageInterface } from '../../contract/code-storage.interface';
import { DefaultPermissionsByRole } from '../constant/default-permissions.constant';

const CACHE_PREFIX = 'user_permissions:';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class PermissionAccessManager {
    constructor(
        private readonly orm: MikroORM,
        @Inject(CODE_STORAGE) private readonly cache: CodeStorageInterface,
    ) {}

    async getPermissions(userId: string): Promise<string[]> {
        const cacheKey = `${CACHE_PREFIX}${userId}`;

        const cached = await this.cache.get(cacheKey, true);
        if (cached) return cached;

        const em = this.orm.em.fork();
        const user = await em.findOne(UserEntity, { id: userId });
        if (!user) return [];

        const permissions = DefaultPermissionsByRole[user.role] ?? [];

        await this.cache.set(cacheKey, JSON.stringify(permissions), CACHE_TTL_MS);

        return permissions;
    }

    async isGranted(userId: string, action: string | string[]): Promise<boolean> {
        const permissions = await this.getPermissions(userId);
        const actions = Array.isArray(action) ? action : [action];

        return actions.every((a) => permissions.includes(a));
    }

    async clearCache(userId: string): Promise<void> {
        await this.cache.del(`${CACHE_PREFIX}${userId}`);
    }
}
