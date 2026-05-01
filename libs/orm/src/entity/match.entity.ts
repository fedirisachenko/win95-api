import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { MatchStatus } from '../entity-enum/match-status.enum';

@Entity({ tableName: 'match' })
export class MatchEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Property({ fieldName: 'status', type: 'smallint' })
    status: number = MatchStatus.PENDING;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
