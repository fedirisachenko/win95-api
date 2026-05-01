import { Migration } from '@mikro-orm/migrations';

export class Migration20260501000000 extends Migration {
    override async up(): Promise<void> {
        // message: composite index for chat pagination + sender lookup
        this.addSql(`create index "message_chat_id_created_at_index" on "message" ("chat_id", "created_at" desc);`);
        this.addSql(`create index "message_sender_id_index" on "message" ("sender_id");`);

        // user_social: FK index + OAuth uniqueness constraints
        this.addSql(`create index "user_social_user_id_index" on "user_social" ("user_id");`);
        this.addSql(
            `alter table "user_social" add constraint "user_social_provider_social_user_id_unique" unique ("provider", "social_user_id");`,
        );
        this.addSql(
            `alter table "user_social" add constraint "user_social_user_id_provider_unique" unique ("user_id", "provider");`,
        );

        // chat_user: prevent duplicate membership + user FK index
        this.addSql(
            `alter table "chat_user" add constraint "chat_user_chat_id_user_id_unique" unique ("chat_id", "user_id");`,
        );
        this.addSql(`create index "chat_user_user_id_index" on "chat_user" ("user_id");`);

        // search_session: FK index for match participant lookup
        this.addSql(`create index "search_session_search_match_id_index" on "search_session" ("search_match_id");`);
    }

    override async down(): Promise<void> {
        this.addSql(`drop index "search_session_search_match_id_index";`);

        this.addSql(`alter table "chat_user" drop constraint "chat_user_chat_id_user_id_unique";`);
        this.addSql(`drop index "chat_user_user_id_index";`);

        this.addSql(`alter table "user_social" drop constraint "user_social_provider_social_user_id_unique";`);
        this.addSql(`alter table "user_social" drop constraint "user_social_user_id_provider_unique";`);
        this.addSql(`drop index "user_social_user_id_index";`);

        this.addSql(`drop index "message_chat_id_created_at_index";`);
        this.addSql(`drop index "message_sender_id_index";`);
    }
}
