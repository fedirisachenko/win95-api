import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ChatStatus } from '../entity-enum/chat-status.enum';

@Entity({ tableName: 'chat' })
export class ChatEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Property({ fieldName: 'status', type: 'smallint' })
    status: number = ChatStatus.STARTING;

    /** Duration of the chat session in seconds */
    @Property({ fieldName: 'duration', type: 'integer' })
    duration: number;

    @Property({ fieldName: 'max_participants', type: 'smallint' })
    maxParticipants: number;

    @Property({ fieldName: 'starts_at', type: 'datetime', nullable: true })
    startsAt?: Date;

    @Property({ fieldName: 'expires_at', type: 'datetime', nullable: true })
    expiresAt?: Date;

    @Property({ fieldName: 'job_id', type: 'string', nullable: true })
    jobId?: string;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
