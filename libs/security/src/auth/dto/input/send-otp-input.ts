import { IsEmail, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@libs/orm';

export class SendOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ enum: OtpPurpose.getValues(), example: OtpPurpose.LOGIN })
    @IsIn(OtpPurpose.getValues())
    purpose: number;
}
