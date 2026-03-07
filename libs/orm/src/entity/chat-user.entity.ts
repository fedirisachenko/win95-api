import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'chat_user' })
export class ChatUserEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @ManyToOne(() => ChatEntity, { fieldName: 'chat_id', ref: true })
    chat: Ref<ChatEntity>;

    @ManyToOne(() => UserEntity, { fieldName: 'user_id', ref: true })
    user: Ref<UserEntity>;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
