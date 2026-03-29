import 'dotenv/config';
import { Module } from '@nestjs/common';
import { OrmModule } from '@libs/orm';
import { CoreModule } from '@libs/core';
import { SecurityModule } from '@libs/security';
import mikroOrmConfig from '@config/mikro-orm.config';
import { ConversationModule } from './conversation/conversation.module';
import { amqpConfigProvider } from '@config/amqp.config';

@Module({
    imports: [ConversationModule, OrmModule.register(mikroOrmConfig), CoreModule.register(), SecurityModule.forRoot()],
    providers: [amqpConfigProvider],
})
export class ChatModule {}
