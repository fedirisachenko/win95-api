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
                    useFactory: async (): Promise<MikroORM> => {
                        return MikroORM.init(config);
                    },
                },
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
