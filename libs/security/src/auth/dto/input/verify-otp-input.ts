import { IsEmail, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from './send-otp-input';

export class VerifyOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    code: string;

    @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
    @IsEnum(OtpPurpose)
    purpose: OtpPurpose;
}