import { Migration } from '@mikro-orm/migrations';

export class Migration20260501000002 extends Migration {
    override async up(): Promise<void> {
        // Rename tables
        this.addSql(`alter table "search_session" rename to "match_request";`);
        this.addSql(`alter table "search_match" rename to "match";`);
        this.addSql(`alter table "chat_user" rename to "chat_participant";`);
        this.addSql(`alter table "message" rename to "chat_message";`);

        // Rename FK columns
        this.addSql(`alter table "match_request" rename column "search_match_id" to "match_id";`);
        this.addSql(`alter table "chat" rename column "search_match_id" to "match_id";`);

        // match_request (was search_session): rename PK, indexes, FK constraints
        this.addSql(`alter index "search_session_pkey" rename to "match_request_pkey";`);
        this.addSql(
            `alter index "search_session_user_id_status_index" rename to "match_request_user_id_status_index";`,
        );
        this.addSql(`alter index "search_session_search_match_id_index" rename to "match_request_match_id_index";`);
        this.addSql(
            `alter table "match_request" rename constraint "search_session_user_id_foreign" to "match_request_user_id_foreign";`,
        );
        this.addSql(
            `alter table "match_request" rename constraint "search_session_search_match_id_foreign" to "match_request_match_id_foreign";`,
        );

        // match (was search_match): rename PK
        this.addSql(`alter index "search_match_pkey" rename to "match_pkey";`);

        // chat_participant (was chat_user): rename PK, unique, indexes, FK constraints
        this.addSql(`alter index "chat_user_pkey" rename to "chat_participant_pkey";`);
        this.addSql(
            `alter table "chat_participant" rename constraint "chat_user_chat_id_user_id_unique" to "chat_participant_chat_id_user_id_unique";`,
        );
        this.addSql(`alter index "chat_user_user_id_index" rename to "chat_participant_user_id_index";`);
        this.addSql(
            `alter table "chat_participant" rename constraint "chat_user_chat_id_foreign" to "chat_participant_chat_id_foreign";`,
        );
        this.addSql(
            `alter table "chat_participant" rename constraint "chat_user_user_id_foreign" to "chat_participant_user_id_foreign";`,
        );

        // chat_message (was message): rename PK, indexes, FK constraints
        this.addSql(`alter index "message_pkey" rename to "chat_message_pkey";`);
        this.addSql(
            `alter index "message_chat_id_created_at_index" rename to "chat_message_chat_id_created_at_index";`,
        );
        this.addSql(`alter index "message_sender_id_index" rename to "chat_message_sender_id_index";`);
        this.addSql(
            `alter table "chat_message" rename constraint "message_chat_id_foreign" to "chat_message_chat_id_foreign";`,
        );
        this.addSql(
            `alter table "chat_message" rename constraint "message_sender_id_foreign" to "chat_message_sender_id_foreign";`,
        );

        // chat: rename FK constraint and unique for match_id
        this.addSql(`alter table "chat" rename constraint "chat_search_match_id_foreign" to "chat_match_id_foreign";`);
        this.addSql(`alter table "chat" rename constraint "chat_search_match_id_unique" to "chat_match_id_unique";`);
    }

    override async down(): Promise<void> {
        // Restore chat constraints
        this.addSql(`alter table "chat" rename constraint "chat_match_id_foreign" to "chat_search_match_id_foreign";`);
        this.addSql(`alter table "chat" rename constraint "chat_match_id_unique" to "chat_search_match_id_unique";`);

        // Restore chat_message
        this.addSql(
            `alter table "chat_message" rename constraint "chat_message_chat_id_foreign" to "message_chat_id_foreign";`,
        );
        this.addSql(
            `alter table "chat_message" rename constraint "chat_message_sender_id_foreign" to "message_sender_id_foreign";`,
        );
        this.addSql(`alter index "chat_message_pkey" rename to "message_pkey";`);
        this.addSql(
            `alter index "chat_message_chat_id_created_at_index" rename to "message_chat_id_created_at_index";`,
        );
        this.addSql(`alter index "chat_message_sender_id_index" rename to "message_sender_id_index";`);

        // Restore chat_participant
        this.addSql(
            `alter table "chat_participant" rename constraint "chat_participant_chat_id_foreign" to "chat_user_chat_id_foreign";`,
        );
        this.addSql(
            `alter table "chat_participant" rename constraint "chat_participant_user_id_foreign" to "chat_user_user_id_foreign";`,
        );
        this.addSql(`alter index "chat_participant_pkey" rename to "chat_user_pkey";`);
        this.addSql(
            `alter table "chat_participant" rename constraint "chat_participant_chat_id_user_id_unique" to "chat_user_chat_id_user_id_unique";`,
        );
        this.addSql(`alter index "chat_participant_user_id_index" rename to "chat_user_user_id_index";`);

        // Restore match
        this.addSql(`alter index "match_pkey" rename to "search_match_pkey";`);

        // Restore match_request
        this.addSql(
            `alter table "match_request" rename constraint "match_request_user_id_foreign" to "search_session_user_id_foreign";`,
        );
        this.addSql(
            `alter table "match_request" rename constraint "match_request_match_id_foreign" to "search_session_search_match_id_foreign";`,
        );
        this.addSql(`alter index "match_request_pkey" rename to "search_session_pkey";`);
        this.addSql(
            `alter index "match_request_user_id_status_index" rename to "search_session_user_id_status_index";`,
        );
        this.addSql(`alter index "match_request_match_id_index" rename to "search_session_search_match_id_index";`);

        // Restore columns
        this.addSql(`alter table "match_request" rename column "match_id" to "search_match_id";`);
        this.addSql(`alter table "chat" rename column "match_id" to "search_match_id";`);

        // Restore table names
        this.addSql(`alter table "match_request" rename to "search_session";`);
        this.addSql(`alter table "match" rename to "search_match";`);
        this.addSql(`alter table "chat_participant" rename to "chat_user";`);
        this.addSql(`alter table "chat_message" rename to "message";`);
    }
}
