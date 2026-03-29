import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SearchStartInput {
    @ApiProperty()
    @IsNumber()
    desiredDuration: number;
}
