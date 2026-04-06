import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { SearchSessionEntity, SearchStatus } from '@libs/orm';
import { MatchmakingService } from '../../match/service/matchmaking.service';
import { SearchCancelInput } from '../transport/ws/dto';

@Injectable()
export class SearchCancelUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly matchmakingService: MatchmakingService,
    ) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SearchCancelInput): Promise<void> {
        const searchSession = await this.orm.em.findOne(SearchSessionEntity, {
            id: data.searchId,
            user: { id: userId },
            status: SearchStatus.ACTIVE,
        });

        if (!searchSession) {
            return;
        }

        searchSession.status = SearchStatus.CANCELLED;
        await this.orm.em.flush();

        await this.matchmakingService.dequeue(userId);
    }
}
