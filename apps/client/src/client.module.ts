import 'dotenv/config';
import { Module } from '@nestjs/common';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule, HttpTransport, JwtStrategy } from '@libs/security';
import mikroOrmConfig from '@config/mikro-orm.config';

@Module({
    imports: [
        CoreModule.register(),
        OrmModule.register(mikroOrmConfig),
        SecurityModule.forRoot({
            transports: [HttpTransport],
            strategies: [JwtStrategy],
            auth: {
                enabled: true,
                routePrefix: '/auth',
            },
        }),
    ],
})
export class ClientModule {}
