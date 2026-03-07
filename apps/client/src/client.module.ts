import 'dotenv/config';
import { Module } from '@nestjs/common';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule, RedisStorage } from '@libs/security';
import { RedisModule, RedisService } from '@songkeys/nestjs-redis';
import mikroOrmConfig from '@config/mikro-orm.config';
import redisConfig from '@config/redis.config';

@Module({
    imports: [
        OrmModule.register(mikroOrmConfig),
        CoreModule.register(),
        RedisModule.forRoot(redisConfig),
        SecurityModule.forRoot({
            auth: {
                enabled: true,
                routePrefix: '/auth',
            },
            codeStorage: {
                useFactory: (redisService: RedisService) => new RedisStorage(redisService),
                inject: [RedisService],
            },
        }),
    ],
})
export class ClientModule {}
