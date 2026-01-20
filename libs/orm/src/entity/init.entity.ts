import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({
    tableName: 'init',
})
export class InitEntity {
    @PrimaryKey({ fieldName: 'id', type: 'uuid' })
    readonly id = v4();

    @Property({
        fieldName: 'init_state',
        type: 'boolean',
    })
    initState: boolean = true;
}
