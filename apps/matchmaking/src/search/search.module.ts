import { Module } from '@nestjs/common';
import { WsModule, WsNamespace } from '@libs/ws';
import { Permissions } from '@libs/security';
import { SearchStartUseCase, SearchCancelUseCase, SearchAcceptUseCase } from './use-case';
import { SearchStartAction } from './transport/ws/action/search-start.action';
import { SearchCancelAction } from './transport/ws/action/search-cancel.action';
import { SearchAcceptAction } from './transport/ws/action/search-accept.action';
import { MatchModule } from '../match/match.module';

const actions = [SearchStartAction, SearchCancelAction, SearchAcceptAction];
const useCases = [SearchStartUseCase, SearchCancelUseCase, SearchAcceptUseCase];

@Module({
    imports: [
        WsModule.forFeature({
            namespace: WsNamespace.MATCHMAKING_SEARCH,
            connectionPermission: Permissions.MATCHMAKING.SEARCH,
            imports: [MatchModule],
            actions,
            providers: [...useCases],
        }),
    ],
})
export class SearchModule {}
