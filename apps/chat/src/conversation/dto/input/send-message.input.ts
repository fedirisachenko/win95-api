import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageInput {
    @ApiProperty()
    @IsUUID()
    chatId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;
}
