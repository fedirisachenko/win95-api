import { Migration } from '@mikro-orm/migrations';

export class Migration20260415175518 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`alter table "chat" rename column "expires_at" to "expired_at";`);
    }

    override async down(): Promise<void> {
        this.addSql(`alter table "chat" rename column "expired_at" to "expires_at";`);
    }
}
