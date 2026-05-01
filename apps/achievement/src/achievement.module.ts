import { Module } from '@nestjs/common';
import { RmqModule } from '@libs/rmq';
import { ConfigService } from '@nestjs/config';
import { TrackingModule } from './tracking/tracking.module';
import { ManagementModule } from './management/management.module';
import { OrmModule } from '@libs/orm';
import mikroOrmConfig from '@config/mikro-orm.config';
import { CoreModule } from '@libs/core';

@Module({
    imports: [
        OrmModule.register(mikroOrmConfig),
        CoreModule.register(),
        RmqModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                urls: configService.get<string>('AMQP_URLS', 'amqp://localhost:56721').split(','),
                exchange: configService.get<string>('AMQP_EXCHANGE_NAME', 'broadcast'),
                exchangeType: 'direct',
            }),
            inject: [ConfigService],
        }),
        TrackingModule,
        ManagementModule,
    ],
})
export class AchievementModule {}
