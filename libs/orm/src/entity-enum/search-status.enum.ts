import { AbstractEnum } from './abstract-enum';

export class SearchStatus extends AbstractEnum {
    protected static choices = {
        1: 'Active',
        2: 'Pending',
        3: 'Finished',
        4: 'Cancelled',
    };

    static readonly ACTIVE = 1;
    static readonly PENDING = 2;
    static readonly FINISHED = 3;
    static readonly CANCELLED = 4;
}
