import { Entity, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'message' })
export class MessageEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @ManyToOne(() => ChatEntity, { fieldName: 'chat_id', ref: true })
    chat: Ref<ChatEntity>;

    @ManyToOne(() => UserEntity, { fieldName: 'sender_id', ref: true })
    sender: Ref<UserEntity>;

    @Property({ fieldName: 'text', type: 'text' })
    text: string;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
