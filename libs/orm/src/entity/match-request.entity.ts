import { Entity, Index, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';
import { MatchEntity } from './match.entity';
import { MatchRequestStatus } from '../entity-enum/match-request-status.enum';

@Entity({ tableName: 'match_request' })
@Index({ properties: ['user', 'status'] })
export class MatchRequestEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @ManyToOne(() => UserEntity, { fieldName: 'user_id', ref: true })
    user: Ref<UserEntity>;

    @Index()
    @ManyToOne(() => MatchEntity, { fieldName: 'match_id', ref: true, nullable: true })
    match?: Ref<MatchEntity>;

    @Property({ fieldName: 'desired_duration', type: 'int' })
    desiredDuration: number;

    @Property({ fieldName: 'status', type: 'smallint' })
    status: MatchRequestStatus = MatchRequestStatus.ACTIVE;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
