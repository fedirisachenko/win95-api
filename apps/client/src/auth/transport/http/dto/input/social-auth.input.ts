import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SocialAuthInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    provider: number;
}
