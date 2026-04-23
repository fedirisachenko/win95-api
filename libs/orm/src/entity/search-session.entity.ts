import { Entity, Index, ManyToOne, PrimaryKey, Property, Ref } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';
import { SearchMatchEntity } from './search-match.entity';
import { SearchStatus } from '../entity-enum/search-status.enum';

@Entity({ tableName: 'search_session' })
@Index({ properties: ['user', 'status'] })
export class SearchSessionEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @ManyToOne(() => UserEntity, { fieldName: 'user_id', ref: true })
    user: Ref<UserEntity>;

    @ManyToOne(() => SearchMatchEntity, { fieldName: 'search_match_id', ref: true, nullable: true })
    searchMatch?: Ref<SearchMatchEntity>;

    @Property({ fieldName: 'desired_duration', type: 'int' })
    desiredDuration: number;

    @Property({ fieldName: 'status', type: 'smallint' })
    status: SearchStatus = SearchStatus.ACTIVE;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}
