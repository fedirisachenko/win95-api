import { AbstractEnum } from './abstract-enum';

export class ChatStatus extends AbstractEnum {
    protected static choices = {
        1: 'Starting',
        2: 'Active',
        3: 'Expired',
        4: 'Cancelled',
    };

    static readonly STARTING = 1;
    static readonly ACTIVE = 2;
    static readonly EXPIRED = 3;
    static readonly CANCELLED = 4;
}
