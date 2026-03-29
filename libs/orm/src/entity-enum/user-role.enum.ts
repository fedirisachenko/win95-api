import { AbstractEnum } from './abstract-enum';

export class UserRole extends AbstractEnum {
    protected static choices = {
        1: 'User',
        2: 'Admin',
    };

    static readonly USER = 1;
    static readonly ADMIN = 2;
}
