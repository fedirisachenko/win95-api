import { Migration } from '@mikro-orm/migrations';

export class Migration20250929204405_init extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "init" ("id" uuid not null, "init_state" boolean not null default true, constraint "init_pkey" primary key ("id"));`,
        );
    }
}
