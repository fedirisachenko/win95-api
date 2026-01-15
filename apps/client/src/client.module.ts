import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import coreConfig from '@config/config.config';
import { OrmModule } from '@libs/orm';
import mikroOrmConfig from '@config/mikro-orm.config';

@Module({
    imports: [ConfigModule.forRoot(coreConfig), OrmModule.register(mikroOrmConfig)],
})
export class ClientModule {}
