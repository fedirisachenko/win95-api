import { IsEmail, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@libs/orm';

export class VerifyOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    code: string;

    @ApiProperty({ enum: OtpPurpose.getValues(), example: OtpPurpose.LOGIN })
    @IsIn(OtpPurpose.getValues())
    purpose: number;
}
