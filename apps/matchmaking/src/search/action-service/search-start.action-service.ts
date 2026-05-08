import { Injectable } from '@nestjs/common';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { WsException } from '@nestjs/websockets';

import { MatchRequestEntity, MatchRequestStatus, UserEntity } from '@libs/orm';

import { MatchmakingService } from '../../match/service/matchmaking.service';
import { SearchStartInput } from '../transport/ws/dto/input/search-start.input';

@Injectable()
export class SearchStartActionService {
    constructor(
        private readonly orm: MikroORM,
        private readonly matchmakingService: MatchmakingService,
    ) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SearchStartInput): Promise<void> {
        const existing = await this.orm.em.findOne(MatchRequestEntity, {
            user: { id: userId },
            status: MatchRequestStatus.ACTIVE,
        });
        if (existing) throw new WsException('User already has an active search');

        const matchRequest = this.orm.em.create(MatchRequestEntity, {
            user: this.orm.em.getReference(UserEntity, userId),
            status: MatchRequestStatus.ACTIVE,
            desiredDuration: data.desiredDuration,
        });

        await this.orm.em.persistAndFlush(matchRequest);

        await this.matchmakingService.enqueue({
            searchId: matchRequest.id,
            userId,
            duration: matchRequest.desiredDuration,
        });
    }
}
