import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SearchAcceptInput {
    @ApiProperty()
    @IsUUID()
    searchId: string;
}
