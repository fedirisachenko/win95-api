import 'dotenv/config';
import { Module } from '@nestjs/common';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule, RedisStorage } from '@libs/security';
import { RedisModule, RedisService } from '@songkeys/nestjs-redis';
import mikroOrmConfig from '@config/mikro-orm.config';
import redisConfig from '@config/redis.config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        OrmModule.register(mikroOrmConfig),
        CoreModule.register(),
        RedisModule.forRoot(redisConfig),
        SecurityModule.forRoot({
            codeStorage: {
                useFactory: (redisService: RedisService) => new RedisStorage(redisService),
                inject: [RedisService],
            },
        }),
        AuthModule,
    ],
})
export class ClientModule {}
