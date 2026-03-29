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
            status: { $in: [SearchStatus.ACTIVE, SearchStatus.PENDING] },
        });

        if (!searchSession) {
            return;
        }

        const wasActive = searchSession.status === SearchStatus.ACTIVE;

        searchSession.status = SearchStatus.CANCELLED;
        await this.orm.em.flush();

        if (wasActive) {
            await this.matchmakingService.dequeue(userId);
        }
    }
}
