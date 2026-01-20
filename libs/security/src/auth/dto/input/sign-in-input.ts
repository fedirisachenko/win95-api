import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SignInInput {
    @ApiProperty({ example: 'user@example.com' })
    @Expose()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @Expose()
    @IsString()
    password: string;
}
