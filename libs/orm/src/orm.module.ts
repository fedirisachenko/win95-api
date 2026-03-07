import { DynamicModule, Module, Scope } from '@nestjs/common';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { EntityManager, MikroORM } from '@mikro-orm/core';

@Module({})
export class OrmModule {
    static register(config: MikroOrmModuleSyncOptions): DynamicModule {
        return {
            module: OrmModule,
            global: true,
            providers: [
                {
                    provide: MikroORM,
                    useFactory: async (): Promise<MikroORM> => MikroORM.init(config),
                },
                // REQUEST-scoped fork for HTTP services (e.g. Paginator)
                // WS action-services use MikroORM directly with @CreateRequestContext()
                {
                    provide: EntityManager,
                    useFactory: (orm: MikroORM) => orm.em.fork(),
                    inject: [MikroORM],
                    scope: Scope.REQUEST,
                },
            ],
            exports: [MikroORM, EntityManager],
        };
    }
}
