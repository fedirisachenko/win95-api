import { Entity, Index, ManyToOne, PrimaryKey, Property, Ref, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'chat_participant' })
@Unique({ properties: ['chat', 'user'] })
export class ChatParticipantEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @ManyToOne(() => ChatEntity, { fieldName: 'chat_id', ref: true })
    chat: Ref<ChatEntity>;

    @Index()
    @ManyToOne(() => UserEntity, { fieldName: 'user_id', ref: true })
    user: Ref<UserEntity>;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
