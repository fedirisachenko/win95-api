import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { MapClass, MapField } from '@libs/core';
import { MessageEntity } from '@libs/orm';

@Exclude()
@MapClass(MessageEntity)
export class MessageNewOutput {
    @Expose()
    @ApiProperty()
    @MapField()
    id: string;

    @Expose()
    @ApiProperty()
    @MapField()
    text: string;

    @Expose()
    @ApiProperty()
    @MapField(({ e }) => e.sender.id)
    senderId: string;

    @Expose()
    @ApiProperty()
    @MapField()
    createdAt: Date;
}
