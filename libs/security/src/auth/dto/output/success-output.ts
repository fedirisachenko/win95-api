import { ApiProperty } from '@nestjs/swagger';

export class SuccessOutput {
    @ApiProperty()
    success: boolean;
}
