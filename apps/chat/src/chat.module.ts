import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule } from '@libs/security';
import { RmqModule } from '@libs/rmq';
import mikroOrmConfig from '@config/mikro-orm.config';
import { ConversationModule } from './conversation/conversation.module';
import { ManagementModule } from './management/management.module';

@Module({
    imports: [
        OrmModule.register(mikroOrmConfig),
        CoreModule.register(),
        SecurityModule.forRoot(),
        RmqModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                urls: configService.get<string>('AMQP_URLS', 'amqp://localhost:56721').split(','),
                exchange: configService.get<string>('AMQP_EXCHANGE_NAME', 'broadcast'),
                exchangeType: 'direct',
            }),
            inject: [ConfigService],
        }),
        ConversationModule,
        ManagementModule,
    ],
})
export class ChatModule {}
