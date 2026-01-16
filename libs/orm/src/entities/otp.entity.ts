import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
    tableName: 'otps',
})
export class OtpEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id: string = v4();

    @Property({ fieldName: 'email', type: 'string' })
    email: string;

    @Property({ fieldName: 'code', type: 'string' })
    code: string;

    @Property({ fieldName: 'purpose', type: 'string' })
    purpose: string;

    @Property({ fieldName: 'attempts', type: 'integer', default: 0 })
    attempts: number = 0;

    @Property({ fieldName: 'expires_at', type: 'datetime' })
    expiresAt: Date;

    @Property({ fieldName: 'created_at', type: 'datetime' })
    createdAt: Date = new Date();
}