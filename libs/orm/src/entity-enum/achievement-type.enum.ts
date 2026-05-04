import { AbstractEnum } from './abstract-enum';

export class AchievementType extends AbstractEnum {
    protected static choices = {
        1: 'Send messages',
        2: 'Rapid messages',
        3: 'Chat time',
        4: 'Daily search streak',
        5: 'Keyword messages',
        6: 'Rapid chat',
    };

    static readonly SEND_MESSAGES = 1;
    static readonly RAPID_MESSAGES = 2;
    static readonly CHAT_TIME = 3;
    static readonly DAILY_SEARCH_STREAK = 4;
    static readonly KEYWORD_MESSAGES = 5;
    static readonly RAPID_CHAT = 6;
}
