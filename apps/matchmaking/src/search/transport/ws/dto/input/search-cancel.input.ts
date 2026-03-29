import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SearchCancelInput {
    @ApiProperty()
    @IsUUID()
    searchId: string;
}
