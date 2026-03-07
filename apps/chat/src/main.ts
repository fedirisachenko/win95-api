import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';
import { TolerantValidationPipe } from '@libs/security';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(ChatModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('CHAT_APP_PORT', 3032);

    app.useWebSocketAdapter(new IoAdapter(app));
    app.useGlobalPipes(TolerantValidationPipe);

    const swaggerConfig = new DocumentBuilder().setTitle('Win95 Chat API').setVersion('1.0').addBearerAuth().build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-chat/api', app, swaggerDocument);

    const asyncApiConfig = new AsyncApiDocumentBuilder()
        .setTitle('Win95 Chat WS API')
        .setVersion('1.0')
        .setDefaultContentType('application/json')
        .addBearerAuth()
        .addServer('chat', { url: `ws://localhost:${port}`, protocol: 'socket.io' })
        .build();

    const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApiConfig);
    await AsyncApiModule.setup('api-chat/api-ws', app, asyncApiDocument);

    await app.listen(port);
}
bootstrap();
