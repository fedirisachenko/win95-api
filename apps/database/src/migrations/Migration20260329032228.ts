import { Migration } from '@mikro-orm/migrations';

export class Migration20260329032228 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "search_session" ("id" uuid not null, "user_id" uuid not null, "desired_duration" int not null, "status" smallint not null default 1, "created_at" timestamptz not null, constraint "search_session_pkey" primary key ("id"));`,
        );
        this.addSql(`create index "search_session_user_id_status_index" on "search_session" ("user_id", "status");`);

        this.addSql(
            `alter table "search_session" add constraint "search_session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
        );
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "search_session" cascade;`);
    }
}
