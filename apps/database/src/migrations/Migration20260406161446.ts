import { Migration } from '@mikro-orm/migrations';

export class Migration20260406161446 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "search_match" ("id" uuid not null, "status" smallint not null default 1, "created_at" timestamptz not null, constraint "search_match_pkey" primary key ("id"));`,
        );

        this.addSql(`alter table "chat" add column "search_match_id" uuid null;`);
        this.addSql(
            `alter table "chat" add constraint "chat_search_match_id_foreign" foreign key ("search_match_id") references "search_match" ("id") on update cascade on delete set null;`,
        );
        this.addSql(`alter table "chat" add constraint "chat_search_match_id_unique" unique ("search_match_id");`);

        this.addSql(`alter table "search_session" add column "search_match_id" uuid null;`);
        this.addSql(
            `alter table "search_session" add constraint "search_session_search_match_id_foreign" foreign key ("search_match_id") references "search_match" ("id") on update cascade on delete set null;`,
        );
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "chat" drop constraint "chat_search_match_id_foreign";`);

        this.addSql(`alter table "search_session" drop constraint "search_session_search_match_id_foreign";`);

        this.addSql(`drop table if exists "search_match" cascade;`);

        this.addSql(`alter table "chat" drop constraint "chat_search_match_id_unique";`);
        this.addSql(`alter table "chat" drop column "search_match_id";`);

        this.addSql(`alter table "search_session" drop column "search_match_id";`);
    }
}
