import { Entity, ManyToOne, PrimaryKey, Property, Ref, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';
import { AchievementMetadata } from '../type/achievement.type';

@Entity({ tableName: 'achievement' })
@Unique({ properties: ['user', 'type'] })
export class AchievementEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @ManyToOne(() => UserEntity, { fieldName: 'user_id', ref: true })
    user: Ref<UserEntity>;

    @Property({ fieldName: 'type', type: 'smallint' })
    type: number;

    @Property({ fieldName: 'progress', type: 'int', default: 0 })
    progress: number = 0;

    @Property({ fieldName: 'completed', type: 'smallint', default: 0 })
    completed: number = 0;

    @Property({ fieldName: 'metadata', type: 'jsonb' })
    metadata: AchievementMetadata;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();

    @Property({ fieldName: 'updated_at', type: 'datetime', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
