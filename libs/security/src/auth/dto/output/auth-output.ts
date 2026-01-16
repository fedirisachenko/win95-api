import { ApiProperty } from '@nestjs/swagger';
import { UserOutput } from './user-output';

export class AuthOutput {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty({ type: UserOutput })
    user: UserOutput;
}
