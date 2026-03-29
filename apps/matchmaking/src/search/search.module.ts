import { Module } from '@nestjs/common';
import { WsModule } from '@libs/ws';
import { Permissions } from '@libs/security';
import { SearchStartUseCase, SearchCancelUseCase } from './use-case';
import { SearchStartAction } from './transport/ws/action/search-start.action';
import { SearchCancelAction } from './transport/ws/action/search-cancel.action';
import { MatchModule } from '../match/match.module';

const actions = [SearchStartAction, SearchCancelAction];
const useCases = [SearchStartUseCase, SearchCancelUseCase];

@Module({
    imports: [
        WsModule.forFeature({
            namespace: '/matchmaking/search',
            connectionPermission: Permissions.MATCHMAKING.SEARCH,
            imports: [MatchModule],
            actions,
            providers: [...useCases],
        }),
    ],
})
export class SearchModule {}
