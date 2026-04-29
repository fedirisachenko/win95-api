import { AbstractEnum } from './abstract-enum';

export class AchievementType extends AbstractEnum {
    protected static choices = {
        1: 'Send messages',
    };

    static readonly SEND_MESSAGES = 1;
}
