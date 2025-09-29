import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from './database.module';

async function bootstrap() {
    const app = await NestFactory.create(DatabaseModule);
    await app.listen(process.env.port ?? 3000);
}
bootstrap();
