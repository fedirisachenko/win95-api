import { ApiProperty } from '@nestjs/swagger';

export class TokenPairOutput {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
