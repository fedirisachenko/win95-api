import { AbstractEnum } from './abstract-enum';

export class OtpPurpose extends AbstractEnum {
    public static readonly LOGIN = 1;
    public static readonly VERIFY_EMAIL = 2;
    public static readonly VERIFY_PHONE = 3;

    protected static choices: { [key: string]: string } = {
        [OtpPurpose.LOGIN]: 'login',
        [OtpPurpose.VERIFY_EMAIL]: 'verify_email',
        [OtpPurpose.VERIFY_PHONE]: 'verify_phone',
    };
}
