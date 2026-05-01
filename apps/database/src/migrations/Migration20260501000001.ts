import { Migration } from '@mikro-orm/migrations';

export class Migration20260501000001 extends Migration {
    override async up(): Promise<void> {
        // Drop dead init table (InitEntity - zero references in codebase)
        this.addSql(`drop table if exists "init" cascade;`);

        // password nullable: social-login users have no password
        this.addSql(`alter table "user" alter column "password" drop not null;`);

        // Add expiry for password reset tokens (previously tokens were infinite-lived)
        this.addSql(`alter table "user" add column "reset_password_token_expires_at" timestamptz null;`);

        // Rename expired_at → expires_at: field means planned expiry time, not past event
        this.addSql(`alter table "chat" rename column "expired_at" to "expires_at";`);
    }

    override async down(): Promise<void> {
        this.addSql(
            `create table "init" ("id" uuid not null, "init_state" boolean not null default true, constraint "init_pkey" primary key ("id"));`,
        );
        this.addSql(`alter table "user" alter column "password" set not null;`);
        this.addSql(`alter table "user" drop column "reset_password_token_expires_at";`);
        this.addSql(`alter table "chat" rename column "expires_at" to "expired_at";`);
    }
}
