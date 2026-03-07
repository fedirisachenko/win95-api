import { Migration } from '@mikro-orm/migrations';

export class Migration20260306183856 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "chat" ("id" uuid not null, "status" smallint not null default 1, "duration" int not null, "max_participants" smallint not null, "starts_at" timestamptz null, "expires_at" timestamptz null, "job_id" varchar(255) null, "created_at" timestamptz not null, constraint "chat_pkey" primary key ("id"));`,
        );

        this.addSql(
            `create table "message" ("id" uuid not null, "chat_id" uuid not null, "sender_id" uuid not null, "text" text not null, "created_at" timestamptz not null, constraint "message_pkey" primary key ("id"));`,
        );

        this.addSql(
            `create table "chat_user" ("id" uuid not null, "chat_id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, constraint "chat_user_pkey" primary key ("id"));`,
        );

        this.addSql(
            `alter table "message" add constraint "message_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade;`,
        );
        this.addSql(
            `alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "user" ("id") on update cascade;`,
        );

        this.addSql(
            `alter table "chat_user" add constraint "chat_user_chat_id_foreign" foreign key ("chat_id") references "chat" ("id") on update cascade;`,
        );
        this.addSql(
            `alter table "chat_user" add constraint "chat_user_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
        );
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "message" drop constraint "message_chat_id_foreign";`);

        this.addSql(`alter table "chat_user" drop constraint "chat_user_chat_id_foreign";`);

        this.addSql(`drop table if exists "chat" cascade;`);

        this.addSql(`drop table if exists "message" cascade;`);

        this.addSql(`drop table if exists "chat_user" cascade;`);
    }
}
