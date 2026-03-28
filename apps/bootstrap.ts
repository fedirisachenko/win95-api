import 'dotenv/config';
import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { TolerantValidationPipe } from '@libs/security';
import { AMQP_CONFIG, AmqpConfig } from '@config/amqp.config';
import { connectAmqpMicroservice } from '@libs/microservice-event';

export interface BootstrapOptions {
    module: Type<any>;
    portEnvKey: string;
    defaultPort: number;
    ws?: boolean;
    amqp?: { queue: string };
    swagger?: { title: string; path: string };
    asyncApi?: { title: string; path: string };
}

export async function bootstrap(options: BootstrapOptions) {
    const app = await NestFactory.create(options.module);
    const configService = app.get(ConfigService);
    const port = configService.get<number>(options.portEnvKey, options.defaultPort);

    app.useGlobalPipes(TolerantValidationPipe);

    if (options.ws) {
        app.useWebSocketAdapter(new IoAdapter(app));
    }

    if (options.amqp) {
        const config = app.get<AmqpConfig>(AMQP_CONFIG);
        connectAmqpMicroservice(app, options.amqp.queue, config);
        await app.startAllMicroservices();
    }

    if (options.swagger) {
        const swaggerConfig = new DocumentBuilder()
            .setTitle(options.swagger.title)
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup(options.swagger.path, app, document);
    }

    if (options.asyncApi) {
        const asyncConfig = new AsyncApiDocumentBuilder()
            .setTitle(options.asyncApi.title)
            .setVersion('1.0')
            .setDefaultContentType('application/json')
            .addBearerAuth()
            .addServer('ws', { url: `ws://localhost:${port}`, protocol: 'socket.io' })
            .build();
        const asyncApiDocument = AsyncApiModule.createDocument(app, asyncConfig);
        await AsyncApiModule.setup(options.asyncApi.path, app, asyncApiDocument);
    }

    await app.listen(port);
}
