import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
    tableName: 'user',
})
export class UserEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Property({ fieldName: 'email', type: 'string', unique: true })
    email: string;

    @Property({ fieldName: 'password', type: 'string', nullable: true })
    password?: string;

    @Property({ fieldName: 'name', type: 'string', nullable: true })
    name?: string;

    @Property({ fieldName: 'reset_password_token', type: 'string', nullable: true })
    resetPasswordToken?: string;

    @Property({ fieldName: 'reset_password_token_expires_at', type: 'datetime', nullable: true })
    resetPasswordTokenExpiresAt?: Date;

    @Property({ fieldName: 'role', type: 'smallint' })
    role: number = 1;

    @Property({ fieldName: 'email_verified', type: 'boolean', default: false })
    emailVerified: boolean = false;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();

    @Property({ fieldName: 'updated_at', type: 'datetime', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
