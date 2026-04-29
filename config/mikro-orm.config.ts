import { FlushMode, LoadStrategy, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { join } from 'path';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';
import { NotFoundException } from '@nestjs/common';
import { SeedManager } from '@mikro-orm/seeder';
import {
    ChatEntity,
    ChatUserEntity,
    InitEntity,
    MessageEntity,
    UserEntity,
    UserSocialEntity,
    SearchSessionEntity,
    SearchMatchEntity,
    AchievementEntity,
} from '@libs/orm';

const ENTITIES = [
    InitEntity,
    UserEntity,
    ChatEntity,
    ChatUserEntity,
    MessageEntity,
    UserSocialEntity,
    SearchSessionEntity,
    SearchMatchEntity,
    AchievementEntity,
];

const IS_PROD = process.env.NODE_ENV === 'production';

const MIKRO_ORM_CONFIG: MikroOrmModuleSyncOptions = {
    entities: ENTITIES,
    extensions: [SeedManager],

    clientUrl: process.env.DATABASE_URL_DEFAULT,

    // cache: { enabled: true },

    driverOptions: {
        connection: {
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        },
        pool: {
            min: +(process.env.DB_POOL_MIN || 2),
            max: +(process.env.DB_POOL_MAX || 10),
        },
    },

    findOneOrFailHandler: () => {
        throw new NotFoundException();
    },

    flushMode: FlushMode.COMMIT,
    driver: PostgreSqlDriver,
    loadStrategy: LoadStrategy.JOINED,

    migrations: {
        tableName: IS_PROD ? 'mikro_orm_migrations' : 'public.mikro_orm_migrations',
        path: join(__dirname, '../apps/database/src/migrations'),
        pathTs: join(__dirname, '../apps/database/src/migrations'),
        glob: '!(*.d).{js,ts}',

        transactional: true,
        allOrNothing: false,
        disableForeignKeys: false,
        snapshot: false,
    },

    seeder: {
        path: join(__dirname, '../apps/database/src/seeders'),
        pathTs: join(__dirname, '../apps/database/src/seeders'),
    },

    forceUtcTimezone: true,
    debug: process.env.NODE_ENV === 'debug' ? ['query'] : false,
};

export default MIKRO_ORM_CONFIG;
