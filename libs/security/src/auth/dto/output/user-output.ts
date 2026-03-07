import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { MapClass, MapField } from '@libs/core';
import { UserEntity } from '@libs/orm';

@Exclude()
@MapClass(UserEntity)
export class UserOutput {
    @Expose()
    @ApiProperty()
    @MapField()
    id: string;

    @Expose()
    @ApiProperty()
    @MapField()
    email: string;

    @Expose()
    @ApiPropertyOptional()
    @MapField()
    name?: string;
}
