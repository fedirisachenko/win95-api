import { Migration } from '@mikro-orm/migrations';

export class Migration20260501000003 extends Migration {
    override async up(): Promise<void> {
        // Rename completed → current_tier: field is a tier index, not a boolean flag
        this.addSql(`alter table "achievement" rename column "completed" to "current_tier";`);

        // Move goals out of per-user metadata (static config, same for all users of same type)
        this.addSql(`update "achievement" set metadata = metadata - 'goals';`);
        this.addSql(`alter table "achievement" alter column "metadata" set default '{}';`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "achievement" rename column "current_tier" to "completed";`);
        this.addSql(`alter table "achievement" alter column "metadata" drop default;`);
    }
}
