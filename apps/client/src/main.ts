import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ClientModule } from './client.module';

async function bootstrap() {
    const app = await NestFactory.create(ClientModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    const config = new DocumentBuilder().setTitle('Win95 API').setVersion('1.0').addBearerAuth().build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-client/api', app, document);

    await app.listen(process.env.USER_APP_PORT ?? 3000);
}

bootstrap();
