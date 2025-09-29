import { NestFactory } from '@nestjs/core';
import { DatabaseModule } from './database.module';

async function bootstrap() {
    const app = await NestFactory.create(DatabaseModule);
    await app.listen(process.env.DATABASE_APP_PORT ?? 9119);
}
bootstrap();
