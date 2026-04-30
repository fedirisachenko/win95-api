import { Migration } from '@mikro-orm/migrations';

export class Migration20260429211340 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "achievement" ("id" uuid not null, "user_id" uuid not null, "type" smallint not null, "progress" int not null default 0, "completed" smallint not null default 0, "metadata" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "achievement_pkey" primary key ("id"));`,
        );
        this.addSql(
            `alter table "achievement" add constraint "achievement_user_id_type_unique" unique ("user_id", "type");`,
        );

        this.addSql(
            `alter table "achievement" add constraint "achievement_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "achievement" cascade;`);
    }
}
