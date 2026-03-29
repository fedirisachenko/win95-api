import { Migration } from '@mikro-orm/migrations';

export class Migration20260309221226 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_social" ("id" uuid not null, "user_id" uuid not null, "provider" smallint not null, "social_user_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_social_pkey" primary key ("id"));`);

    this.addSql(`alter table "user_social" add constraint "user_social_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_social" cascade;`);
  }

}
