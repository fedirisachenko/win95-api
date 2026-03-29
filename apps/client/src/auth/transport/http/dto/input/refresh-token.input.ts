import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenInput {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}
