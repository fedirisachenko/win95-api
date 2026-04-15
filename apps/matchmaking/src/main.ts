import { bootstrap } from '../../bootstrap';
import { MatchmakingModule } from './mathmaking.module';

bootstrap({
    module: MatchmakingModule,
    portEnvKey: 'MATCHMAKING_APP_PORT',
    defaultPort: 3033,
    ws: true,
    rmq: { queue: 'matchmaking' },
    swagger: { title: 'Win95 Matchmaking API', path: 'api-matchmaking/api' },
    asyncApi: { title: 'Win95 Matchmaking WS API', path: 'api-matchmaking/api-ws' },
});
