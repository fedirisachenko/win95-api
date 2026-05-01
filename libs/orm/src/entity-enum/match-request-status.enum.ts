import { AbstractEnum } from './abstract-enum';

export class MatchRequestStatus extends AbstractEnum {
    protected static choices = {
        1: 'Active',
        2: 'Cancelled',
    };

    static readonly ACTIVE = 1;
    static readonly CANCELLED = 2;
}
