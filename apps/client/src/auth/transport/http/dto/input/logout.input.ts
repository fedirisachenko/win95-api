import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutInput {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}
