import { ApiProperty } from '@nestjs/swagger';

export class MessageNewOutput {
    @ApiProperty() id: string;
    @ApiProperty() text: string;
    @ApiProperty() senderId: string;
    @ApiProperty() createdAt: Date;
}
