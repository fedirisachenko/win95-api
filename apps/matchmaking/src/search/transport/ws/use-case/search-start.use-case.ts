import { Injectable } from '@nestjs/common';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { SearchStartInput } from '../dto/input/search-start.input';
import { MatchRequestEntity, MatchRequestStatus, UserEntity } from '@libs/orm';
import { MatchmakingService } from '../../../../match/service/matchmaking.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SearchStartUseCase {
    constructor(
        private readonly orm: MikroORM,
        private readonly matchmakingService: MatchmakingService,
    ) {}

    @CreateRequestContext()
    async invoke(userId: string, data: SearchStartInput): Promise<void> {
        const existingRequest = await this.orm.em.findOne(MatchRequestEntity, {
            user: { id: userId },
            status: MatchRequestStatus.ACTIVE,
        });

        if (existingRequest) {
            throw new WsException('User already has an active search');
        }

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
