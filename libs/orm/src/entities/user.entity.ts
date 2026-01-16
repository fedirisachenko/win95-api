import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
    tableName: 'users',
})
export class UserEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Property({ fieldName: 'email', type: 'string', unique: true })
    email: string;

    @Property({ fieldName: 'password', type: 'string' })
    password: string;

    @Property({ fieldName: 'name', type: 'string', nullable: true })
    name?: string;

    @Property({ fieldName: 'reset_password_token', type: 'string', nullable: true })
    resetPasswordToken?: string;

    @Property({ fieldName: 'email_verified', type: 'boolean', default: false })
    emailVerified: boolean = false;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();

    @Property({ fieldName: 'updated_at', type: 'datetime', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}