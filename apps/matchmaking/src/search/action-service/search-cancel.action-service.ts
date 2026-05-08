import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';

import { MatchRequestEntity, MatchRequestStatus } from '@libs/orm';

import { MatchmakingService } from '../../match/service/matchmaking.service';
import { SearchCancelInput } from '../transport/ws/dto/input/search-cancel.input';

@Injectable()
export class SearchCancelActionService {
    constructor(
        private readonly orm: MikroORM,
        private readonly matchmakingService: MatchmakingService,
    ) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SearchCancelInput): Promise<void> {
        const matchRequest = await this.orm.em.findOne(MatchRequestEntity, {
            id: data.searchId,
            user: { id: userId },
            status: MatchRequestStatus.ACTIVE,
        });
        if (!matchRequest) return;

        matchRequest.status = MatchRequestStatus.CANCELLED;
        await this.orm.em.flush();

        await this.matchmakingService.dequeue(userId);
    }
}
