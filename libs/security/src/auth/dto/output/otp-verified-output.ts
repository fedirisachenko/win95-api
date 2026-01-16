import { ApiProperty } from '@nestjs/swagger';

export class OtpVerifiedOutput {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    verified: boolean;
}