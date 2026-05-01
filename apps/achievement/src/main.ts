import { bootstrap } from '../../bootstrap';
import { AchievementModule } from './achievement.module';

bootstrap({
    module: AchievementModule,
    portEnvKey: 'ACHIEVEMENT_APP_PORT',
    defaultPort: 3034,
    ws: true,
    rmq: { queue: 'achievement' },
    swagger: { title: 'Win95 Achievement API', path: 'api-achievement/api' },
    asyncApi: { title: 'Win95 Achievement WS API', path: 'api-achievement/api-ws' },
});
