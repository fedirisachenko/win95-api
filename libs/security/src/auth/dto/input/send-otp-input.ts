import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.LOGIN })
    @IsEnum(OtpPurpose)
    purpose: OtpPurpose;
}
