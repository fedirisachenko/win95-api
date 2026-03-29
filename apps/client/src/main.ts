import { bootstrap } from '../../bootstrap';
import { ClientModule } from './client.module';

bootstrap({
    module: ClientModule,
    portEnvKey: 'CLIENT_APP_PORT',
    defaultPort: 3031,
    swagger: { title: 'Win95 Client API', path: 'api-client/api' },
});
