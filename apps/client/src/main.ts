import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClientModule } from './client.module';
import { TolerantValidationPipe } from '@libs/security';

async function bootstrap() {
    const app = await NestFactory.create(ClientModule);
    const configService = app.get(ConfigService);

    app.useGlobalPipes(TolerantValidationPipe);

    const config = new DocumentBuilder().setTitle('Win95 API').setVersion('1.0').addBearerAuth().build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-client/api', app, document);

    await app.listen(configService.get<number>('CLIENT_APP_PORT', 3031));
}

bootstrap();
