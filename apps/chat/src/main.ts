import { bootstrap } from '../../bootstrap';
import { ChatModule } from './chat.module';

bootstrap({
    module: ChatModule,
    portEnvKey: 'CHAT_APP_PORT',
    defaultPort: 3032,
    ws: true,
    amqp: { queue: 'chat_queue' },
    swagger: { title: 'Win95 Chat API', path: 'api-chat/api' },
    asyncApi: { title: 'Win95 Chat WS API', path: 'api-chat/api-ws' },
});
