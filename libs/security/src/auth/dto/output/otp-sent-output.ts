import { ApiProperty } from '@nestjs/swagger';

export class OtpSentOutput {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    expiresIn: number;
}
