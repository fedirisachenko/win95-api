import { Migration } from '@mikro-orm/migrations';

export class Migration20260116011309 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `create table "user" ("id" uuid not null, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) null, "reset_password_token" varchar(255) null, "email_verified" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`,
        );
        this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    }

    override async down(): Promise<void> {
        this.addSql(`drop table if exists "user" cascade;`);
    }
}
