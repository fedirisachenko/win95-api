import { Migration } from '@mikro-orm/migrations';

export class Migration20260309212943 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "user" add column "role" smallint not null default 1;`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "user" drop column "role";`);
    }
}
