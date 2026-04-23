import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { SearchStartInput } from '../dto/input/search-start.input';
import { SearchSessionEntity, SearchStatus, UserEntity } from '@libs/orm';
import { MatchmakingService } from '../../../../match/service/matchmaking.service';

@Injectable()
export class SearchStartUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly matchmakingService: MatchmakingService,
    ) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SearchStartInput): Promise<void> {
        const existingSearchSession = await this.orm.em.findOne(SearchSessionEntity, {
            user: { id: userId },
            status: SearchStatus.ACTIVE,
        });
        if (existingSearchSession) {
            return;
        }
        const searchSession = this.orm.em.create(SearchSessionEntity, {
            user: this.orm.em.getReference(UserEntity, userId),
            status: SearchStatus.ACTIVE,
            desiredDuration: data.desiredDuration,
        });

        await this.orm.em.persistAndFlush(searchSession);

        await this.matchmakingService.enqueue({
            searchId: searchSession.id,
            userId,
            duration: searchSession.desiredDuration,
        });
    }
}
