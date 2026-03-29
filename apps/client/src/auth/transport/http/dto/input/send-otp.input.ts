import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpInput {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
}
