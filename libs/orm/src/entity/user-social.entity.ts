import { Entity, Index, ManyToOne, PrimaryKey, Property, Ref, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'user_social' })
@Unique({ properties: ['provider', 'socialUserId'] })
@Unique({ properties: ['user', 'provider'] })
export class UserSocialEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Index()
    @ManyToOne(() => UserEntity, { fieldName: 'user_id', ref: true })
    user: Ref<UserEntity>;

    @Property({ fieldName: 'provider', type: 'smallint' })
    provider: number;

    @Property({ fieldName: 'social_user_id', type: 'string' })
    socialUserId: string;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();

    @Property({ fieldName: 'updated_at', type: 'datetime', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
