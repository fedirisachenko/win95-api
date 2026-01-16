import { AnyEntity, EntityManager, EntityName, EntityRepository, FilterQuery, FindOptions } from '@mikro-orm/core';
import { QueryOrderMap } from '@mikro-orm/core/enums';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationMeta {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
}

@Injectable({ scope: Scope.REQUEST })
export class Paginator {
    constructor(
        @Inject(REQUEST) private request: any,
        private readonly em: EntityManager,
    ) {}

    async paginate<T extends AnyEntity<T>>(
        entity: EntityName<T>,
        query: FilterQuery<T> = {} as FilterQuery<T>,
        sort?: QueryOrderMap<T>,
        page = 1,
        limit = 20,
        options: FindOptions<T> = {},
    ): Promise<T[]> {
        page = page <= 0 ? 1 : page;
        limit = limit <= 0 ? 100 : limit;

        const isPaginationEnabled = limit > 0;

        if (isPaginationEnabled) {
            options.limit = limit;
            options.offset = (page - 1) * limit;
        }

        if (sort) {
            options.orderBy = this.removeEmptyObjects(sort);
        } else {
            const meta = this.em.getMetadata().find(entity.toString());
            if (meta?.properties?.id) {
                options.orderBy = { id: 'ASC' } as any;
            }
        }

        const repository = this.em.getRepository(entity) as EntityRepository<T>;
        const [data, count] = await repository.findAndCount(
            this.removeEmptyObjects(query || {}) as FilterQuery<T>,
            options,
        );

        this.setHeaders(
            count,
            isPaginationEnabled ? Math.ceil(count / limit) : 1,
            isPaginationEnabled ? page : 1,
            isPaginationEnabled ? limit : count,
        );

        return data;
    }

    setHeaders(totalCount: number, pageCount: number, currentPage: number, perPage: number): void {
        if (this.request?.res?.set) {
            this.request.res.set({
                'X-Total-Count': totalCount,
                'X-Page-Count': pageCount,
                'X-Current-Page': currentPage,
                'X-Per-Page': perPage,
            });
        }
    }

    emptyPagination<T = any>(): T[] {
        this.setHeaders(0, 0, 0, 0);
        return [];
    }

    private removeEmptyObjects(obj: any): any {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.removeEmptyObjects(item)).filter((item) => item !== undefined);
        }

        const result: any = {};

        for (const key of Object.keys(obj)) {
            const value = obj[key];

            if (value === null || value === undefined) {
                continue;
            }

            if (typeof value === 'object' && !Array.isArray(value)) {
                const cleaned = this.removeEmptyObjects(value);
                if (Object.keys(cleaned).length > 0) {
                    result[key] = cleaned;
                }
            } else {
                result[key] = value;
            }
        }

        return result;
    }
}