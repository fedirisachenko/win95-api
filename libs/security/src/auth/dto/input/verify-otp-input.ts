import { IsEmail, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurposeEnum } from '../../enum/otp-purpose-enum';

export class VerifyOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    code: string;

    @ApiProperty({ enum: OtpPurposeEnum, example: OtpPurposeEnum.LOGIN })
    @IsEnum(OtpPurposeEnum)
    purpose: OtpPurposeEnum;
}
