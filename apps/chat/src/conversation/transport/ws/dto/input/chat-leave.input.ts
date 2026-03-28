import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChatLeaveInput {
    @ApiProperty()
    @IsUUID()
    chatId: string;
}
