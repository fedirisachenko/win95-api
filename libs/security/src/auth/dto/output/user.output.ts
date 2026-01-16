import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserOutput {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    name?: string;
}
