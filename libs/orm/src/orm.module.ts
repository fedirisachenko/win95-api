import { DynamicModule, Module } from '@nestjs/common';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { EntityManager, MikroORM } from '@mikro-orm/core';

@Module({})
export class OrmModule {
    static register(config: MikroOrmModuleSyncOptions | MikroOrmModuleSyncOptions[]): DynamicModule {
        return {
            module: OrmModule,
            global: true,
            providers: [
                {
                    provide: MikroORM,
                    useFactory: async (): Promise<MikroORM[]> => {
                        const ormOpts = config instanceof Array ? config : [config];

                        const orms = await Promise.all(ormOpts.map(async (config) => await MikroORM.init(config)));
                        return orms;
                    },
                },
                {
                    provide: EntityManager,
                    useFactory: (orm: MikroORM) => orm.em,
                    inject: [MikroORM],
                },
            ],
            exports: [MikroORM],
        };
    }
}
