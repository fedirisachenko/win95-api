import { bootstrap } from '../../bootstrap';
import { MatchmakingModule } from './matchmaking.module';

bootstrap({
    module: MatchmakingModule,
    portEnvKey: 'MATCHMAKING_APP_PORT',
    defaultPort: 3033,
    ws: true,
    asyncApi: { title: 'Win95 Matchmaking WS API', path: 'api-matchmaking/api-ws' },
});
