import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { SearchMatchStatus } from '../entity-enum/search-match-status.enum';

@Entity({ tableName: 'search_match' })
export class SearchMatchEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Property({ fieldName: 'status', type: 'smallint' })
    status: number = SearchMatchStatus.PENDING;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
