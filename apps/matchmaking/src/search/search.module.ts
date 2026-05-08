import { Module } from '@nestjs/common';

import { Permissions } from '@libs/security';
import { WsModule, WsNamespace } from '@libs/ws';

import { MatchModule } from '../match/match.module';
import { SearchAcceptActionService } from './action-service/search-accept.action-service';
import { SearchCancelActionService } from './action-service/search-cancel.action-service';
import { SearchStartActionService } from './action-service/search-start.action-service';
import { SearchAcceptAction } from './transport/ws/action/search-accept.action';
import { SearchCancelAction } from './transport/ws/action/search-cancel.action';
import { SearchStartAction } from './transport/ws/action/search-start.action';

@Module({
    imports: [
        WsModule.forFeature({
            namespace: WsNamespace.MATCHMAKING_SEARCH,
            connectionPermission: Permissions.MATCHMAKING.SEARCH,
            actions: [SearchStartAction, SearchCancelAction, SearchAcceptAction],
            providers: [SearchStartActionService, SearchCancelActionService, SearchAcceptActionService],
            imports: [MatchModule],
        }),
    ],
})
export class SearchModule {}
