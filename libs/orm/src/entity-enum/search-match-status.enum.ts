import { AbstractEnum } from './abstract-enum';

export class SearchMatchStatus extends AbstractEnum {
    protected static choices = {
        1: 'Pending',
        2: 'Accepted',
        3: 'Cancelled',
    };

    static readonly PENDING = 1;
    static readonly ACCEPTED = 2;
    static readonly CANCELLED = 3;
}
