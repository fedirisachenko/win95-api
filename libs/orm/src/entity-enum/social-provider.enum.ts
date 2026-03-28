import { AbstractEnum } from './abstract-enum';

export class SocialProvider extends AbstractEnum {
    protected static choices = {
        1: 'Google',
    };

    static readonly GOOGLE = 1;
}