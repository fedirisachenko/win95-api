import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import coreConfig from '@config/config.config';
import { Mapper } from './service/mapper';
import { Paginator } from './service/paginator';
import { OrmModule } from '@libs/orm';
import mikroOrmConfig from '@config/mikro-orm.config';

@Global()
@Module({})
export class CoreModule {
    static register(): DynamicModule {
        return {
            module: CoreModule,
            imports: [ConfigModule.forRoot(coreConfig), OrmModule.register(mikroOrmConfig)],
            providers: [Mapper, Paginator],
            exports: [ConfigModule, Mapper, Paginator],
        };
    }
}
