import 'dotenv/config';
import { Module } from '@nestjs/common';
import { OrmModule } from '@libs/orm';
import mikroOrmConfig from '@config/mikro-orm.config';

@Module({
    imports: [OrmModule.register(mikroOrmConfig)],
})
export class DatabaseModule {}
