import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OtpPurpose {
    LOGIN = 'login',
    VERIFY_EMAIL = 'verify_email',
    VERIFY_PHONE = 'verify_phone',
}

export class SendOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
    @IsEnum(OtpPurpose)
    purpose: OtpPurpose;
}